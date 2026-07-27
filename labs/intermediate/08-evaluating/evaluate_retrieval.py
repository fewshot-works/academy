# Intermediate Chapter 8 lab, part 1: does retrieval actually work, with
# numbers instead of just eyeballing one example?
#
# Reuses Chapter 3's exact corpus and its baseline (vector-only) and hybrid
# (vector + BM25) retrieval, then runs both through a small hand-labeled eval
# set (question -> which document IDs are actually relevant) and computes
# precision@3 and recall@3 for each method, so we can prove whether hybrid
# actually retrieves the right documents more often, not just in one example.
#
# This lab needs one provider that can do both embeddings and chat, so
# PROVIDER only supports ollama or openai. See README.md for setup steps.

import os
from dotenv import load_dotenv
import chromadb
from rank_bm25 import BM25Okapi

load_dotenv()

provider = os.getenv("PROVIDER", "ollama")

K = 3

# Same twelve facts as Intermediate Chapter 3's corpus.
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

# Our eval set: for each question, the document IDs a human reading the
# corpus would actually call relevant. Some questions have one relevant
# document, some have several, on purpose, so precision and recall can
# diverge instead of always moving together.
EVAL_SET = [
    {
        "question": "How many purchases before Fernwood gives you a free drink?",
        "relevant_ids": {"fernwood-loyalty"},
    },
    {
        "question": "Where does Harbor Bean Roasters get its coffee beans from?",
        "relevant_ids": {"harborbean-sourcing"},
    },
    {
        "question": "What's Whistlepost's most popular drink and where is it located?",
        "relevant_ids": {"whistlepost-menu", "whistlepost-locations"},
    },
    {
        "question": "How do the loyalty programs of Fernwood, Harbor Bean, and Whistlepost differ?",
        "relevant_ids": {"fernwood-loyalty", "harborbean-loyalty", "whistlepost-loyalty"},
    },
    {
        "question": "How many locations does Fernwood Coffee Co. have?",
        "relevant_ids": {"fernwood-locations"},
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


def normalize(scores):
    lowest = min(scores)
    highest = max(scores)
    if highest == lowest:
        return [1.0 for _ in scores]
    return [(s - lowest) / (highest - lowest) for s in scores]


def precision_at_k(retrieved_ids, relevant_ids, k):
    hits = len(set(retrieved_ids[:k]) & relevant_ids)
    return hits / k


def recall_at_k(retrieved_ids, relevant_ids, k):
    hits = len(set(retrieved_ids[:k]) & relevant_ids)
    return hits / len(relevant_ids)


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


def retrieve_baseline(question_embedding):
    """Plain vector search, top K document IDs."""
    result = collection.query(query_embeddings=[question_embedding], n_results=K)
    return result["ids"][0]


def retrieve_hybrid(question, question_embedding):
    """50% vector similarity + 50% keyword (BM25) score, top K document IDs."""
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
    return sorted(hybrid_scores, key=lambda doc_id: hybrid_scores[doc_id], reverse=True)[:K]


# --- Step 3: run every question through both methods and score them ---
totals = {"baseline": {"precision": 0.0, "recall": 0.0}, "hybrid": {"precision": 0.0, "recall": 0.0}}

print(f"Evaluating retrieval on {len(EVAL_SET)} questions, K={K}\n")

for item in EVAL_SET:
    question = item["question"]
    relevant_ids = item["relevant_ids"]
    question_embedding = embed(question)

    baseline_ids = retrieve_baseline(question_embedding)
    hybrid_ids = retrieve_hybrid(question, question_embedding)

    baseline_p = precision_at_k(baseline_ids, relevant_ids, K)
    baseline_r = recall_at_k(baseline_ids, relevant_ids, K)
    hybrid_p = precision_at_k(hybrid_ids, relevant_ids, K)
    hybrid_r = recall_at_k(hybrid_ids, relevant_ids, K)

    totals["baseline"]["precision"] += baseline_p
    totals["baseline"]["recall"] += baseline_r
    totals["hybrid"]["precision"] += hybrid_p
    totals["hybrid"]["recall"] += hybrid_r

    print(f"Q: {question}")
    print(f"   relevant: {sorted(relevant_ids)}")
    print(f"   baseline top-{K}: {baseline_ids}  precision={baseline_p:.2f} recall={baseline_r:.2f}")
    print(f"   hybrid   top-{K}: {hybrid_ids}  precision={hybrid_p:.2f} recall={hybrid_r:.2f}")
    print()

n = len(EVAL_SET)
print("Averages across all questions:")
print(f"  Baseline (vector only) -> precision@{K}: {totals['baseline']['precision'] / n:.2f}  recall@{K}: {totals['baseline']['recall'] / n:.2f}")
print(f"  Hybrid (vector + BM25) -> precision@{K}: {totals['hybrid']['precision'] / n:.2f}  recall@{K}: {totals['hybrid']['recall'] / n:.2f}")
