# Chapter 7 lab, part 1: short-term memory.
#
# Chapter 5 and 6's agents answered one question at a time -- every
# agent.invoke() call started from a blank messages list, so the agent had
# no idea what was asked a moment ago. Here, a checkpointer plus a
# thread_id gives the agent a running memory of everything said so far in
# this conversation.
#
# Which provider is used (Ollama, OpenAI, or Anthropic) is controlled by the
# PROVIDER variable in your .env file. See README.md for setup steps.

import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.tools import tool
from langgraph.checkpoint.memory import InMemorySaver

load_dotenv()  # reads .env, makes PROVIDER (and any API keys) available below

provider = os.getenv("PROVIDER", "ollama")


# ============================================================
# the same two tools as Chapter 5 and 6
# ============================================================

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
    """Search Wikipedia and return the top result's title and snippet."""
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


# ============================================================
# build the agent -- same create_agent as Chapter 6, plus a
# checkpointer, which is what actually gives it memory
# ============================================================

if provider == "ollama":
    model = "ollama:llama3.2"
elif provider == "openai":
    model = "openai:gpt-4o-mini"
elif provider == "anthropic":
    model = "anthropic:claude-haiku-4-5-20251001"
else:
    raise ValueError(f"Unknown provider '{provider}'. Set PROVIDER to ollama, openai, or anthropic in your .env")

agent = create_agent(model=model, tools=[calculator, search_wikipedia], checkpointer=InMemorySaver())

# Every invoke() call that shares this thread_id reads and appends to the
# same stored conversation. A different thread_id would start a fresh,
# unrelated conversation with no memory of this one.
thread_config = {"configurable": {"thread_id": "conversation-1"}}


def send(message):
    print(f"\nYou: {message}")
    result = agent.invoke({"messages": [{"role": "user", "content": message}]}, thread_config)
    print(f"Agent: {result['messages'][-1].content.strip()}")
    print(f"  (thread now holds {len(result['messages'])} messages)")


# ============================================================
# a scripted conversation, ending in a question that can only be
# answered correctly if turn 1 is still remembered
# ============================================================

send("Hi, my name is Priya and I'm building a birdwatching app.")
send("What's a good name for a database table that stores bird species?")
send("What's 12 * 8?")
send("What year did construction of the Eiffel Tower finish?")
send("Any tips for staying motivated on a side project?")
send("What's my name, and what am I building?")
