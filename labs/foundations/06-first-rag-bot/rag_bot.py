# Chapter 6 lab: a tiny RAG bot. It reads a made-up document, splits it into
# chunks, embeds and stores those chunks in a vector database, then answers
# a question by retrieving the most relevant chunks and handing them to an
# LLM as context.
#
# This lab needs one provider that can do both embeddings and chat, so
# PROVIDER only supports ollama or openai. See README.md for setup steps.

import os
from dotenv import load_dotenv
import chromadb

load_dotenv()  # reads .env, makes PROVIDER (and any API keys) available below

provider = os.getenv("PROVIDER", "ollama")

question = "What is Fernwood Coffee Co.'s most popular drink?"


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


# --- Step 1: read the document and split it into chunks ---
# Splitting on blank lines is the simplest possible chunking strategy: each
# paragraph becomes one chunk. Smarter strategies come in Intermediate.
with open("sample_facts.txt") as f:
    text = f.read()

chunks = [chunk.strip() for chunk in text.split("\n\n") if chunk.strip()]

# --- Step 2: embed every chunk and store it in an in-memory vector database ---
client = chromadb.Client()
collection = client.get_or_create_collection(
    name="facts", metadata={"hnsw:space": "cosine"}
)

ids = [f"chunk-{i}" for i in range(len(chunks))]
embeddings = [embed(chunk) for chunk in chunks]
collection.upsert(ids=ids, embeddings=embeddings, documents=chunks)

# --- Step 3: embed the question and retrieve the closest chunks ---
question_embedding = embed(question)
results = collection.query(query_embeddings=[question_embedding], n_results=2)
retrieved_chunks = results["documents"][0]

print(f"Question: {question}\n")
print("Retrieved context:")
for i, chunk in enumerate(retrieved_chunks, start=1):
    print(f"{i}. {chunk}")

# --- Step 4: build a prompt that tells the model to answer using only the retrieved context ---
context = "\n\n".join(retrieved_chunks)
prompt = f"""Answer the question using ONLY the context below. If the answer isn't in the context, say you don't know.

Context:
{context}

Question: {question}"""

answer = ask(prompt)

print("\nAnswer:")
print(answer.strip())
