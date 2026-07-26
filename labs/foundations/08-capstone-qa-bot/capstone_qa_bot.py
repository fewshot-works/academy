# Foundations capstone: a reusable Q&A bot over your own documents. It reads
# every .txt file in ./docs, splits them into chunks, embeds and stores
# those chunks in a vector database saved to disk, then answers as many
# questions as you want by retrieving the most relevant chunks and handing
# them to an LLM as context.
#
# This lab needs one provider that can do both embeddings and chat, so
# PROVIDER only supports ollama or openai. See README.md for setup steps.

import os
import glob
from dotenv import load_dotenv
import chromadb

load_dotenv()  # reads .env, makes PROVIDER (and any API keys) available below

provider = os.getenv("PROVIDER", "ollama")


def embed(text):
    if provider == "ollama":
        import requests

        response = requests.post(
            "http://localhost:11434/api/embeddings",
            json={"model": "nomic-embed-text", "prompt": text},
        )
        return response.json()["embedding"]

    elif provider == "openai":
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text,
        )
        return response.data[0].embedding

    else:
        print(
            f"PROVIDER is set to '{provider}', but this lab needs one provider "
            "that handles both embeddings and chat. Set PROVIDER to ollama or "
            "openai in your .env and try again."
        )
        raise SystemExit(1)


def ask(prompt):
    if provider == "ollama":
        import requests

        response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "llama3.2",
                "messages": [{"role": "user", "content": prompt}],
                "stream": False,
            },
        )
        return response.json()["message"]["content"]

    elif provider == "openai":
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content


# --- Step 1: read every .txt file in ./docs and split each into chunks ---
# Splitting on blank lines is the simplest possible chunking strategy: each
# paragraph becomes one chunk. Smarter strategies come in Intermediate.
print("Loading documents from ./docs...")

doc_paths = sorted(glob.glob("docs/*.txt"))

all_chunks = []
all_ids = []
for doc_path in doc_paths:
    filename = os.path.basename(doc_path)
    with open(doc_path) as f:
        text = f.read()
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    for i, paragraph in enumerate(paragraphs):
        all_chunks.append(paragraph)
        all_ids.append(f"{filename}-{i}")

# --- Step 2: embed every chunk and store it in a vector database saved to disk ---
# A PersistentClient means these embeddings only need to be computed once.
# Re-running the script reuses what's already on disk instead of starting over.
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(
    name="my_documents", metadata={"hnsw:space": "cosine"}
)

embeddings = [embed(chunk) for chunk in all_chunks]
collection.upsert(ids=all_ids, embeddings=embeddings, documents=all_chunks)

print(f"Added {len(all_chunks)} chunks from {len(doc_paths)} documents to the vector database.\n")

# --- Step 3: keep asking questions until the learner quits ---
while True:
    question = input("Ask a question (or type 'quit' to exit): ")

    if question.strip().lower() == "quit":
        break

    question_embedding = embed(question)
    results = collection.query(query_embeddings=[question_embedding], n_results=2)
    retrieved_chunks = results["documents"][0]

    print("\nRetrieved context:")
    for i, chunk in enumerate(retrieved_chunks, start=1):
        print(f"{i}. {chunk}")

    context = "\n\n".join(retrieved_chunks)
    prompt = f"""Answer the question using ONLY the context below. If the answer isn't in the context, say you don't know.

Context:
{context}

Question: {question}"""

    answer = ask(prompt)

    print("\nAnswer:", answer.strip())
    print()
