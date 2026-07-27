# Intermediate Chapter 8 lab, part 2: precision/recall only tells you whether
# the right documents were found. It says nothing about whether the *answer*
# the model wrote from those documents was actually correct. For that we need
# a second LLM call, an "LLM-as-judge", to read the generated answer against
# a short reference answer and decide PASS or FAIL.
#
# This lab needs one provider that can do both embeddings and chat, so
# PROVIDER only supports ollama or openai. See README.md for setup steps.

import os
from dotenv import load_dotenv
import chromadb

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

# Same five questions as evaluate_retrieval.py, this time paired with a
# short reference answer instead of a set of relevant document IDs.
EVAL_SET = [
    {
        "question": "How many purchases before Fernwood gives you a free drink?",
        "reference_answer": "Fernwood gives a free drink after every ten purchases.",
    },
    {
        "question": "Where does Harbor Bean Roasters get its coffee beans from?",
        "reference_answer": "Harbor Bean buys its beans through a single import broker, not directly from farms.",
    },
    {
        "question": "What's Whistlepost's most popular drink and where is it located?",
        "reference_answer": "Whistlepost's most popular drink is the Smoked Maple Cold Brew, and it has one flagship location in a converted railway signal box.",
    },
    {
        "question": "How do the loyalty programs of Fernwood, Harbor Bean, and Whistlepost differ?",
        "reference_answer": "Fernwood gives a free drink every 10 purchases, Harbor Bean gives one every 8 purchases tracked via an app, and Whistlepost has no loyalty program at all.",
    },
    {
        "question": "How many locations does Fernwood Coffee Co. have?",
        "reference_answer": "Fernwood has three locations: the original train depot shop, a downtown kiosk, and a drive-through.",
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


def retrieve(question):
    """Plain vector search, top K document texts."""
    question_embedding = embed(question)
    result = collection.query(query_embeddings=[question_embedding], n_results=K)
    return result["documents"][0]


def generate_answer(question, context_docs):
    context = "\n".join(context_docs)
    prompt = (
        f"Answer the question using only the context below.\n\n"
        f"Context:\n{context}\n\nQuestion: {question}"
    )
    return ask(prompt)


def judge(question, reference_answer, candidate_answer):
    prompt = (
        "You are grading whether a candidate answer is factually consistent "
        "with a reference answer. Reply with PASS on the first line if the "
        "candidate answer contains the same key facts as the reference "
        "answer, or FAIL if it contradicts or misses them. On the second "
        "line, give one sentence explaining why.\n\n"
        f"Question: {question}\n"
        f"Reference answer: {reference_answer}\n"
        f"Candidate answer: {candidate_answer}"
    )
    response = ask(prompt)
    lines = response.strip().splitlines()
    verdict = lines[0].strip().upper() if lines else "FAIL"
    reason = lines[1].strip() if len(lines) > 1 else ""
    if "PASS" in verdict:
        verdict = "PASS"
    else:
        verdict = "FAIL"
    return verdict, reason


# --- Step 2: for every question, retrieve context, generate an answer, then judge it ---
pass_count = 0

print(f"Evaluating generation quality on {len(EVAL_SET)} questions, K={K}\n")

for item in EVAL_SET:
    question = item["question"]
    reference_answer = item["reference_answer"]

    context_docs = retrieve(question)
    candidate_answer = generate_answer(question, context_docs)
    verdict, reason = judge(question, reference_answer, candidate_answer)

    if verdict == "PASS":
        pass_count += 1

    print(f"Q: {question}")
    print(f"   reference: {reference_answer}")
    print(f"   generated: {candidate_answer}")
    print(f"   verdict: {verdict} -- {reason}")
    print()

n = len(EVAL_SET)
print(f"Pass rate: {pass_count}/{n} ({100 * pass_count / n:.0f}%)")
