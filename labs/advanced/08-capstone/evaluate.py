# Advanced capstone, part 2: evaluating the agent from agent.py, not just
# running it. Two checks, same techniques as Intermediate Chapter 8, now
# applied to the three-tool agent instead of a plain retrieve-then-answer
# pipeline:
#
#   1. Retrieval quality (precision@k / recall@k) for the search_documents
#      tool's underlying vector search, checked directly against the
#      collection, the same way Chapter 8 checked it.
#   2. LLM-as-judge over the FULL AGENT's answers, not just retrieved
#      context. Some of these questions need the calculator or Wikipedia
#      tool too, so this checks whether the whole agent, tool choice
#      included, produces a correct final answer, not just whether
#      retrieval found the right paragraph.
#
# This lab needs one provider that can do both embeddings and chat, so
# PROVIDER only supports ollama or openai, same constraint as agent.py.

import glob
import os

import chromadb
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.tools import tool
from langgraph.checkpoint.memory import InMemorySaver

load_dotenv()

provider = os.getenv("PROVIDER", "ollama")

if provider not in ("ollama", "openai"):
    print(
        f"PROVIDER is set to '{provider}', but this lab needs one provider "
        "that handles both embeddings and chat. Set PROVIDER to ollama or "
        "openai in your .env and try again."
    )
    raise SystemExit(1)


def embed(text):
    if provider == "ollama":
        import requests

        response = requests.post(
            "http://localhost:11434/api/embeddings",
            json={"model": "nomic-embed-text", "prompt": text},
        )
        return response.json()["embedding"]

    else:  # openai
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.embeddings.create(model="text-embedding-3-small", input=text)
        return response.data[0].embedding


def ask(prompt):
    if provider == "ollama":
        import requests

        response = requests.post(
            "http://localhost:11434/api/chat",
            json={"model": "llama3.2", "messages": [{"role": "user", "content": prompt}], "stream": False},
        )
        return response.json()["message"]["content"]

    else:  # openai
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}])
        return response.choices[0].message.content


# ============================================================
# Same document loading as agent.py
# ============================================================

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

chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(name="my_documents", metadata={"hnsw:space": "cosine"})
collection.upsert(ids=all_ids, embeddings=[embed(chunk) for chunk in all_chunks], documents=all_chunks)


# ============================================================
# 1. Retrieval quality: precision@k / recall@k against a hand-labeled set
#    of (question, correct chunk IDs) pairs
# ============================================================

K = 2

RETRIEVAL_EVAL_SET = [
    {
        "question": "How many locations does Fernwood Coffee Co. have?",
        "relevant_ids": {"fernwood_coffee.txt-3"},
    },
    {
        "question": "What's Fernwood's bestselling drink?",
        "relevant_ids": {"fernwood_coffee.txt-1"},
    },
    {
        "question": "Where does Fernwood source its coffee beans from?",
        "relevant_ids": {"fernwood_coffee.txt-2"},
    },
    {
        "question": "How often does the Mountain View Hiking Club meet, and is it free to join?",
        "relevant_ids": {"mountain_view_hiking_club.txt-1", "mountain_view_hiking_club.txt-3"},
    },
]


def precision_at_k(retrieved_ids, relevant_ids, k):
    hits = len(set(retrieved_ids[:k]) & relevant_ids)
    return hits / k


def recall_at_k(retrieved_ids, relevant_ids, k):
    hits = len(set(retrieved_ids[:k]) & relevant_ids)
    return hits / len(relevant_ids)


def evaluate_retrieval():
    print("=== 1. Retrieval quality (search_documents) ===\n")
    total_precision = 0
    total_recall = 0

    for item in RETRIEVAL_EVAL_SET:
        results = collection.query(query_embeddings=[embed(item["question"])], n_results=K)
        retrieved_ids = results["ids"][0]
        precision = precision_at_k(retrieved_ids, item["relevant_ids"], K)
        recall = recall_at_k(retrieved_ids, item["relevant_ids"], K)
        total_precision += precision
        total_recall += recall

        print(f"Q: {item['question']}")
        print(f"   retrieved: {retrieved_ids}")
        print(f"   relevant:  {sorted(item['relevant_ids'])}")
        print(f"   precision@{K}: {precision:.2f}  recall@{K}: {recall:.2f}\n")

    n = len(RETRIEVAL_EVAL_SET)
    print(f"Average precision@{K}: {total_precision / n:.2f}")
    print(f"Average recall@{K}: {total_recall / n:.2f}\n")


# ============================================================
# 2. LLM-as-judge over the full agent's answers, tool choice included
# ============================================================

JUDGE_EVAL_SET = [
    {
        "question": "How many locations does Fernwood Coffee Co. have, according to my notes?",
        "reference_answer": "Fernwood has three locations, all in the same state.",
    },
    {
        "question": "How often does the Mountain View Hiking Club meet, and is it free to join?",
        "reference_answer": "It meets every Saturday morning at 8 AM. Joining is free; there's an optional "
        "ten-dollar contribution toward trail maintenance for the club's most popular annual event.",
    },
    {
        "question": "What's 15% of 340, and what's Fernwood's bestselling drink?",
        "reference_answer": "15% of 340 is 51. Fernwood's bestselling drink is the Depot Latte.",
    },
]


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
    verdict = "PASS" if lines and "PASS" in lines[0].strip().upper() else "FAIL"
    reason = lines[1].strip() if len(lines) > 1 else ""
    return verdict, reason


def evaluate_agent_answers():
    print("=== 2. LLM-as-judge (full agent, tool choice included) ===\n")

    if provider == "ollama":
        model = "ollama:llama3.2"
    else:  # openai
        model = "openai:gpt-4o-mini"

    agent = create_agent(model=model, tools=[calculator, search_wikipedia, search_documents], checkpointer=InMemorySaver())

    pass_count = 0
    for i, item in enumerate(JUDGE_EVAL_SET):
        # A fresh thread per question -- this eval checks each answer in
        # isolation, not a multi-turn conversation.
        thread_config = {"configurable": {"thread_id": f"eval-{i}"}}
        result = agent.invoke({"messages": [{"role": "user", "content": item["question"]}]}, thread_config)
        candidate_answer = result["messages"][-1].content.strip()

        verdict, reason = judge(item["question"], item["reference_answer"], candidate_answer)
        if verdict == "PASS":
            pass_count += 1

        print(f"Q: {item['question']}")
        print(f"   reference: {item['reference_answer']}")
        print(f"   agent:     {candidate_answer}")
        print(f"   verdict:   {verdict} -- {reason}\n")

    n = len(JUDGE_EVAL_SET)
    print(f"Pass rate: {pass_count}/{n} ({100 * pass_count / n:.0f}%)")


@tool
def calculator(expression: str) -> str:
    """Evaluate a basic arithmetic expression, e.g. '18 * 7 + 4'."""
    import ast
    import operator

    allowed_ops = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.Pow: operator.pow,
        ast.USub: operator.neg,
    }

    def eval_node(node):
        if isinstance(node, ast.Constant):
            return node.value
        if isinstance(node, ast.BinOp):
            return allowed_ops[type(node.op)](eval_node(node.left), eval_node(node.right))
        if isinstance(node, ast.UnaryOp):
            return allowed_ops[type(node.op)](eval_node(node.operand))
        raise ValueError(f"Unsupported expression: {expression}")

    parsed = ast.parse(expression, mode="eval")
    return str(eval_node(parsed.body))


@tool
def search_wikipedia(query: str) -> str:
    """Search Wikipedia for general public knowledge (history, geography,
    famous landmarks, etc). Do not use this for questions about the user's
    own notes or documents -- use search_documents for those instead."""
    import html

    import requests

    response = requests.get(
        "https://en.wikipedia.org/w/api.php",
        params={"action": "query", "list": "search", "srsearch": query, "format": "json", "srlimit": 1},
        headers={"User-Agent": "academy-tutorial (https://github.com/fewshot-works/academy)"},
    )
    results = response.json()["query"]["search"]
    if not results:
        return "No Wikipedia results found."

    top = results[0]
    snippet = top["snippet"].replace('<span class="searchmatch">', "").replace("</span>", "")
    return html.unescape(f"{top['title']}: {snippet}")


@tool
def search_documents(query: str) -> str:
    """Search the user's own private notes and documents, loaded locally
    from ./docs (NOT the internet). Use this for any question about
    Fernwood Coffee Co. or the Mountain View Hiking Club, since those are
    documents the user has already loaded -- searching the web for them
    will not find the user's specific notes."""
    results = collection.query(query_embeddings=[embed(query)], n_results=2)
    matches = results["documents"][0]
    if not matches:
        return "No matching documents found."
    return "\n\n".join(matches)


if __name__ == "__main__":
    evaluate_retrieval()
    evaluate_agent_answers()
