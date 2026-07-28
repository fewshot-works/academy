# Advanced Chapter 2 lab: four techniques for when a single vector search
# over the raw question isn't enough -- query rewriting, HyDE, multi-hop
# retrieval, and a self-correcting retrieval loop.
#
# Reuses the same twelve-document coffee shop corpus from Intermediate
# Chapter 3 (Fernwood, Harbor Bean, Whistlepost), since these techniques
# only earn their keep against a corpus retrieval can actually get wrong.
#
# This lab needs one provider that can do both embeddings and chat, so
# PROVIDER only supports ollama or openai. See README.md for setup steps.

import os

import chromadb
from dotenv import load_dotenv

load_dotenv()

provider = os.getenv("PROVIDER", "ollama")

# Same twelve facts as Intermediate Chapter 3. Fernwood is the same company
# from Foundations Chapter 6; Harbor Bean and Whistlepost exist to create
# genuine ambiguity for retrieval to trip over.
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


def retrieve(query_embedding, n_results=1, where=None):
    kwargs = {"query_embeddings": [query_embedding], "n_results": n_results}
    if where:
        kwargs["where"] = where
    results = collection.query(**kwargs)
    return [
        {"company": m["company"], "text": d}
        for d, m in zip(results["documents"][0], results["metadatas"][0])
    ]


def show(label, doc):
    print(f"  {label} [{doc['company']}] {doc['text'][:80]}...")


# --- Step 1: embed every document and store it in an in-memory vector database ---
client = chromadb.Client()
collection = client.get_or_create_collection(
    name="coffee_facts_advanced", metadata={"hnsw:space": "cosine"}
)

ids = [doc["id"] for doc in DOCUMENTS]
texts = [doc["text"] for doc in DOCUMENTS]
metadatas = [{"company": doc["company"], "topic": doc["topic"]} for doc in DOCUMENTS]
embeddings = [embed(text) for text in texts]
collection.upsert(ids=ids, embeddings=embeddings, documents=texts, metadatas=metadatas)


# ============================================================
# Approach A: query rewriting -- turn a vague, informal question into a
# clear search query before embedding it
# ============================================================
print("A. Query rewriting")
vague_question = "wheres harbor bean get its beans"
print(f"  Original question: {vague_question}")
show("Retrieved on the original question:", retrieve(embed(vague_question))[0])

rewrite_prompt = f"""Rewrite this question into a clear, specific search query
mentioning the company name if you can tell which one it's about. Reply with
ONLY the rewritten query, nothing else.

Question: {vague_question}"""
rewritten_query = ask(rewrite_prompt).strip()
print(f"  Rewritten query: {rewritten_query}")
show("Retrieved on the rewritten query:  ", retrieve(embed(rewritten_query))[0])
print()


# ============================================================
# Approach B: HyDE (Hypothetical Document Embeddings) -- ask the model to
# sketch a plausible answer first, then embed *that* instead of the
# question, since an answer-shaped sentence often lands closer to the real
# answer document than a question-shaped one does
# ============================================================
print("B. HyDE")
comparison_question = (
    "Which shop's beans travel through the fewest middlemen before "
    "reaching the shop?"
)
print(f"  Question: {comparison_question}")
show("Retrieved on the question directly:", retrieve(embed(comparison_question))[0])

hyde_prompt = f"""Write one plausible-sounding sentence that could be the
answer to this question, as if it were pulled from a company fact sheet.
It's fine if you're not sure it's correct. Reply with ONLY that sentence.

Question: {comparison_question}"""
hypothetical_answer = ask(hyde_prompt).strip()
print(f"  Hypothetical answer: {hypothetical_answer}")
show("Retrieved on the hypothetical answer:", retrieve(embed(hypothetical_answer))[0])
print()


# ============================================================
# Approach C: multi-hop retrieval -- some questions need two lookups
# chained together, not one. Hop 1 finds which company the question is
# about; hop 2 answers the actual question, scoped to that company.
# ============================================================
print("C. Multi-hop retrieval")
multihop_question = (
    "Does the coffee shop that opened inside a converted railway signal "
    "box have a loyalty program?"
)
print(f"  Question: {multihop_question}")

hop1 = retrieve(embed(multihop_question))[0]
show("Hop 1 (identify the company):", hop1)
company = hop1["company"]

hop2 = retrieve(embed("loyalty program"), where={"company": company})[0]
show(f"Hop 2 (look up {company}'s loyalty program):", hop2)
print()


# ============================================================
# Approach D: self-correcting retrieval -- grade what came back, and if
# it doesn't actually answer the question, rewrite the query and try once
# more instead of just returning a bad result
# ============================================================
print("D. Self-correcting retrieval")
question = "How many purchases before Fernwood gives you a free drink?"
print(f"  Question: {question}")

query = question
for attempt in range(1, 3):
    candidate = retrieve(embed(query))[0]
    show(f"Attempt {attempt}, retrieved:", candidate)

    grade_prompt = f"""Question: {question}
Candidate fact: {candidate['text']}

Does this fact directly answer the question? Reply with ONLY YES or NO."""
    grade = ask(grade_prompt).strip().upper()
    print(f"    Grade: {grade}")

    if "YES" in grade or attempt == 2:
        print(f"  Final answer: [{candidate['company']}] {candidate['text']}")
        break

    rewrite_prompt = f"""This fact does NOT answer the question. Rewrite the
question into a better, more specific search query that would find the
correct fact, mentioning the company name from the question if there is one.
Reply with ONLY the rewritten query.

Question: {question}
Wrong fact retrieved: {candidate['text']}"""
    query = ask(rewrite_prompt).strip()
    print(f"    Retrying with: {query}")
