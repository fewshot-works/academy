# Intermediate Chapter 3 lab: same corpus, four ways to retrieve from it.
# Plain vector search, then metadata filtering, then hybrid (vector + keyword)
# search, then LLM re-ranking on top of hybrid's results.
#
# This lab needs one provider that can do both embeddings and chat, so
# PROVIDER only supports ollama or openai. See README.md for setup steps.

import os
from dotenv import load_dotenv
import chromadb
from rank_bm25 import BM25Okapi

load_dotenv()

provider = os.getenv("PROVIDER", "ollama")

question = "How many purchases before Fernwood gives you a free drink?"

# Three small fictional coffee companies. Fernwood is the same company from
# Foundations Chapter 6, now sharing a corpus with two others whose facts
# were written to sound similar on purpose, so retrieval actually has
# something to get wrong.
DOCUMENTS = [
    {
        "id": "fernwood-menu",
        "company": "Fernwood",
        "topic": "menu",
        "text": "Fernwood Coffee Co.'s best-selling drink is the Depot Latte, "
        "a vanilla-and-cardamom latte named after the old train depot the "
        "shop was built in. It has outsold every other drink on the menu "
        "since opening day.",
    },
    {
        "id": "fernwood-locations",
        "company": "Fernwood",
        "topic": "locations",
        "text": "Fernwood Coffee Co. has three locations, all in the same "
        "state: the original train depot shop, a downtown kiosk opened in "
        "2019, and a drive-through location opened in 2022.",
    },
    {
        "id": "fernwood-sourcing",
        "company": "Fernwood",
        "topic": "sourcing",
        "text": "Fernwood Coffee Co. sources its coffee beans from three "
        "small farms, one in Ethiopia, one in Colombia, and one in "
        "Guatemala, visiting each farm in person once a year.",
    },
    {
        "id": "fernwood-loyalty",
        "company": "Fernwood",
        "topic": "loyalty",
        "text": "Fernwood Coffee Co.'s loyalty program gives customers a "
        "free drink after every ten purchases. The punch card never "
        "expires and can be transferred to another person.",
    },
    {
        "id": "harborbean-menu",
        "company": "Harbor Bean",
        "topic": "menu",
        "text": "Harbor Bean Roasters' top-selling drink is the Cardamom "
        "Cloud Latte, a cardamom-and-oat-milk latte that has outsold every "
        "other item on the menu since it launched in 2020.",
    },
    {
        "id": "harborbean-locations",
        "company": "Harbor Bean",
        "topic": "locations",
        "text": "Harbor Bean Roasters operates two locations, both near "
        "the waterfront in the same coastal town, with a third location "
        "planned for next year.",
    },
    {
        "id": "harborbean-sourcing",
        "company": "Harbor Bean",
        "topic": "sourcing",
        "text": "Harbor Bean Roasters buys its beans through a single "
        "import broker rather than dealing with farms directly, "
        "prioritizing consistent pricing over direct relationships.",
    },
    {
        "id": "harborbean-loyalty",
        "company": "Harbor Bean",
        "topic": "loyalty",
        "text": "Harbor Bean Roasters' loyalty program gives customers a "
        "free drink after every eight purchases, tracked through an app "
        "rather than a physical card.",
    },
    {
        "id": "whistlepost-menu",
        "company": "Whistlepost",
        "topic": "menu",
        "text": "Whistlepost Coffee's most popular drink is the Smoked "
        "Maple Cold Brew, a cold brew finished with a few drops of smoked "
        "maple syrup, introduced in 2021.",
    },
    {
        "id": "whistlepost-locations",
        "company": "Whistlepost",
        "topic": "locations",
        "text": "Whistlepost Coffee has a single flagship location inside "
        "a converted railway signal box, with no plans to open additional "
        "locations.",
    },
    {
        "id": "whistlepost-sourcing",
        "company": "Whistlepost",
        "topic": "sourcing",
        "text": "Whistlepost Coffee roasts beans sourced from a single "
        "farm in Honduras, buying the entire year's harvest in one "
        "purchase each spring.",
    },
    {
        "id": "whistlepost-loyalty",
        "company": "Whistlepost",
        "topic": "loyalty",
        "text": "Whistlepost Coffee doesn't run a loyalty program at all, "
        "choosing instead to keep prices slightly lower across the board.",
    },
]


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


def normalize(scores):
    lowest = min(scores)
    highest = max(scores)
    if highest == lowest:
        return [1.0 for _ in scores]
    return [(s - lowest) / (highest - lowest) for s in scores]


def show(label, docs):
    print(label)
    for i, doc in enumerate(docs, start=1):
        print(f"  {i}. [{doc['company']}] {doc['text'][:70]}...")
    print()


# --- Step 1: embed every document and store it in an in-memory vector database ---
client = chromadb.Client()
collection = client.get_or_create_collection(
    name="coffee_facts", metadata={"hnsw:space": "cosine"}
)

ids = [doc["id"] for doc in DOCUMENTS]
texts = [doc["text"] for doc in DOCUMENTS]
metadatas = [{"company": doc["company"], "topic": doc["topic"]} for doc in DOCUMENTS]
embeddings = [embed(text) for text in texts]
collection.upsert(ids=ids, embeddings=embeddings, documents=texts, metadatas=metadatas)

# --- Step 2: also build a keyword (BM25) index over the same documents ---
tokenized_docs = [text.lower().split() for text in texts]
bm25 = BM25Okapi(tokenized_docs)

print(f"Question: {question}\n")
question_embedding = embed(question)

# --- Approach A: plain vector search, exactly like the Foundations RAG lab ---
baseline = collection.query(query_embeddings=[question_embedding], n_results=3)
baseline_docs = [
    {"company": m["company"], "text": d}
    for d, m in zip(baseline["documents"][0], baseline["metadatas"][0])
]
show("A. Baseline: vector search only", baseline_docs)

# --- Approach B: metadata filtering, scoping the search to one company ---
filtered = collection.query(
    query_embeddings=[question_embedding],
    n_results=3,
    where={"company": "Fernwood"},
)
filtered_docs = [
    {"company": m["company"], "text": d}
    for d, m in zip(filtered["documents"][0], filtered["metadatas"][0])
]
show("B. Metadata filter: vector search where company = Fernwood", filtered_docs)

# --- Approach C: hybrid search, combining vector similarity with keyword overlap ---
all_results = collection.query(query_embeddings=[question_embedding], n_results=len(DOCUMENTS))
vector_similarities = {
    doc_id: 1 - distance
    for doc_id, distance in zip(all_results["ids"][0], all_results["distances"][0])
}
bm25_scores = dict(zip(ids, bm25.get_scores(question.lower().split())))

normalized_vector = dict(zip(ids, normalize([vector_similarities[i] for i in ids])))
normalized_bm25 = dict(zip(ids, normalize([bm25_scores[i] for i in ids])))
hybrid_scores = {
    doc_id: 0.5 * normalized_vector[doc_id] + 0.5 * normalized_bm25[doc_id] for doc_id in ids
}

ranked_ids = sorted(hybrid_scores, key=lambda doc_id: hybrid_scores[doc_id], reverse=True)[:3]
doc_by_id = {doc["id"]: doc for doc in DOCUMENTS}
hybrid_docs = [
    {"company": doc_by_id[doc_id]["company"], "text": doc_by_id[doc_id]["text"]}
    for doc_id in ranked_ids
]
show("C. Hybrid: 50% vector similarity + 50% keyword (BM25) score", hybrid_docs)

# --- Approach D: re-rank hybrid's top 3 with an LLM ---
candidates_text = "\n".join(f"{i}. {doc['text']}" for i, doc in enumerate(hybrid_docs, start=1))
rerank_prompt = f"""Question: {question}

Here are 3 candidate facts. Reply with ONLY the number of the one that best
answers the question, nothing else.

{candidates_text}"""

rerank_answer = ask(rerank_prompt).strip()
try:
    picked_index = int(rerank_answer.splitlines()[0].strip()[0]) - 1
    picked_doc = hybrid_docs[picked_index]
except (ValueError, IndexError):
    picked_doc = hybrid_docs[0]

print("D. Re-rank: ask the LLM to pick the best of hybrid's top 3")
print(f"  Picked: [{picked_doc['company']}] {picked_doc['text']}\n")

print("Summary of top pick per approach:")
print(f"  A. Baseline vector search -> [{baseline_docs[0]['company']}]")
print(f"  B. Metadata filter        -> [{filtered_docs[0]['company']}]")
print(f"  C. Hybrid search          -> [{hybrid_docs[0]['company']}]")
print(f"  D. LLM re-rank            -> [{picked_doc['company']}]")
