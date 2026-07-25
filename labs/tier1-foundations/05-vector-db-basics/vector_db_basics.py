# Chapter 5 lab: store a handful of sentences in a local vector database,
# then send in one new sentence and see the database instantly return the
# closest matches, without comparing it to every sentence by hand.
#
# Which provider this uses (Ollama or OpenAI) is controlled by PROVIDER in
# your .env file. Anthropic doesn't offer an embeddings API, so this lab
# only supports ollama or openai. See README.md for setup steps.

import os
from dotenv import load_dotenv
import chromadb

load_dotenv()  # reads .env, makes PROVIDER (and any API keys) available below

provider = os.getenv("PROVIDER", "ollama")

sentences = [
    "my dog won't stop barking",
    "our puppy barks at everything",
    "the vet said our dog is healthy",
    "I'm making pasta for dinner",
    "this recipe needs more garlic",
    "we tried a new bakery downtown",
    "the stock market dropped again",
    "interest rates went up this week",
    "my savings account barely earns anything",
    "the new phone has a better camera",
]

query = "my cat keeps meowing at 3am"


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
            f"PROVIDER is set to '{provider}', but Anthropic doesn't offer an "
            "embeddings API. Set PROVIDER to ollama or openai in your .env and try again."
        )
        raise SystemExit(1)


# A PersistentClient saves the database to a folder on disk (./chroma_db),
# so the data is still there if you run this script again later.
client = chromadb.PersistentClient(path="./chroma_db")

# get_or_create so re-running the script doesn't fail on a collection that
# already exists from a previous run. metadata tells Chroma to measure
# closeness with cosine similarity, the same measure used in Chapter 4.
collection = client.get_or_create_collection(
    name="sentences", metadata={"hnsw:space": "cosine"}
)

print(f"Adding {len(sentences)} sentences to the vector database...\n")

# Chroma needs a unique string id for every record we add.
ids = [f"sentence-{i}" for i in range(len(sentences))]
embeddings = [embed(sentence) for sentence in sentences]

# upsert instead of add: if these ids are already in the collection from an
# earlier run, this updates them instead of throwing a duplicate-id error.
collection.upsert(ids=ids, embeddings=embeddings, documents=sentences)

print(f'Query: "{query}"\n')

query_embedding = embed(query)
results = collection.query(query_embeddings=[query_embedding], n_results=3)

print("Top 3 closest matches:")
matched_sentences = results["documents"][0]
distances = results["distances"][0]
for rank, (sentence, distance) in enumerate(zip(matched_sentences, distances), start=1):
    # Chroma returns a distance (lower means closer), so we flip it into a
    # similarity-style score (higher means closer) just to match Chapter 4.
    similarity = 1 - distance
    print(f"{rank}. ({similarity:.2f}) {sentence}")
