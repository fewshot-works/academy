# Intermediate capstone: one agent, three tools it decides between on its
# own -- a calculator, Wikipedia search, and search over your own documents
# -- plus memory across the whole conversation.
#
# Nothing here is a new idea. Chapters 5 and 6 gave an agent a calculator and
# Wikipedia search. Chapter 7 gave it memory with a checkpointer. Foundations
# Chapter 8 read every .txt file in a docs/ folder, embedded it, and searched
# it. This script wires that same document search in as a third tool, so the
# agent picks whichever tool (or none) actually fits each question, instead
# of a fixed retrieve-then-answer pipeline always running.
#
# This lab needs one provider that can do both embeddings and chat for the
# document-search tool, so PROVIDER only supports ollama or openai -- same
# constraint as Chapter 3 and Chapter 8. See README.md for setup steps.

import os
import glob
from dotenv import load_dotenv
import chromadb
from langchain.agents import create_agent
from langchain.tools import tool
from langgraph.checkpoint.memory import InMemorySaver

load_dotenv()  # reads .env, makes PROVIDER (and any API keys) available below

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
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text,
        )
        return response.data[0].embedding


# ============================================================
# Read every .txt file in ./docs, split into paragraph-sized chunks,
# embed them, and store them in an in-memory vector database. Same
# steps as Foundations Chapter 8, minus saving it to disk -- every
# other Intermediate lab rebuilds its corpus from scratch on each run.
# ============================================================

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

chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(
    name="my_documents", metadata={"hnsw:space": "cosine"}
)
collection.upsert(
    ids=all_ids,
    embeddings=[embed(chunk) for chunk in all_chunks],
    documents=all_chunks,
)

print(f"Added {len(all_chunks)} chunks from {len(doc_paths)} documents.\n")


# ============================================================
# three tools -- calculator and search_wikipedia are unchanged from
# Chapters 5/6/7, search_documents is new
# ============================================================


@tool
def calculator(expression: str) -> str:
    """Evaluate a basic arithmetic expression, e.g. '18 * 7 + 4'."""
    # Deliberately NOT Python's eval() -- the model's own text becomes the
    # input here, and eval() would happily run anything, not just math.
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


# ============================================================
# build the agent -- same create_agent + checkpointer as Chapter 7,
# now with three tools instead of two
# ============================================================

if provider == "ollama":
    model = "ollama:llama3.2"
else:  # openai
    model = "openai:gpt-4o-mini"

agent = create_agent(
    model=model,
    tools=[calculator, search_wikipedia, search_documents],
    checkpointer=InMemorySaver(),
)

# Every send() below shares this thread_id, so the agent reads and appends
# to the same stored conversation -- same pattern as Chapter 7.
thread_config = {"configurable": {"thread_id": "conversation-1"}}


def send(message):
    print(f"\nYou: {message}")
    messages_before = len(agent.get_state(thread_config).values.get("messages", []))
    result = agent.invoke({"messages": [{"role": "user", "content": message}]}, thread_config)

    # Only show tool calls made THIS turn -- the checkpointer returns the
    # full conversation on every call, and re-printing old turns' tool
    # calls each time would make the trace grow more confusing, not less.
    new_messages = result["messages"][messages_before:]
    for m in new_messages:
        tool_calls = getattr(m, "tool_calls", None)
        if tool_calls:
            for call in tool_calls:
                print(f"  calling {call['name']}({call['args']})")

    print(f"Agent: {result['messages'][-1].content.strip()}")


# ============================================================
# one scripted conversation touching all three tools, plus memory:
# a fact stated up front, calculator, Wikipedia, your own documents,
# then a question only answerable by remembering earlier turns
# ============================================================


def run_conversation():
    send("Hi, I'm comparing Fernwood Coffee Co. to a few other local businesses for a class project.")
    send("What's 15% of 340?")
    send("What year did construction of the Eiffel Tower finish?")
    send("How many locations does Fernwood Coffee Co. have, according to my notes?")
    send("What am I comparing Fernwood to, and what did you just tell me about its locations?")
    send("How often does the Mountain View Hiking Club meet, and is it free to join?")


if __name__ == "__main__":
    run_conversation()
