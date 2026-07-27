# Chapter 7 lab, part 2: summarized long-term memory.
#
# chat_short_term.py remembers everything, word for word, forever -- the
# thread just keeps growing. That's fine for a short chat, but a long-running
# conversation would eventually mean sending the entire history back to the
# model on every single turn: slower, more expensive, and eventually too
# big for the model's context window.
#
# SummarizationMiddleware fixes that: once the thread crosses a size
# trigger, the older messages get collapsed into a short summary, and only
# the summary plus the most recent messages get sent from then on. Same
# conversation, same recall question, but a bounded, not growing, thread.
#
# NOTE: the token trigger below is set artificially low (a few hundred
# tokens) so this short, six-turn demo conversation actually crosses it. A
# real production trigger would be in the thousands -- see README.md.
#
# Which provider is used (Ollama, OpenAI, or Anthropic) is controlled by the
# PROVIDER variable in your .env file. See README.md for setup steps.

import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware
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
# build the agent -- same as chat_short_term.py, plus a
# SummarizationMiddleware that keeps the thread from growing forever
# ============================================================

if provider == "ollama":
    model = "ollama:llama3.2"
elif provider == "openai":
    model = "openai:gpt-4o-mini"
elif provider == "anthropic":
    model = "anthropic:claude-haiku-4-5-20251001"
else:
    raise ValueError(f"Unknown provider '{provider}'. Set PROVIDER to ollama, openai, or anthropic in your .env")

agent = create_agent(
    model=model,
    tools=[calculator, search_wikipedia],
    checkpointer=InMemorySaver(),
    middleware=[
        SummarizationMiddleware(
            model=model,
            trigger=("tokens", 300),  # artificially low for this demo -- see note above
            keep=("messages", 4),
        )
    ],
)

thread_config = {"configurable": {"thread_id": "conversation-1"}}


def send(message):
    print(f"\nYou: {message}")
    result = agent.invoke({"messages": [{"role": "user", "content": message}]}, thread_config)
    print(f"Agent: {result['messages'][-1].content.strip()}")
    print(f"  (thread now holds {len(result['messages'])} messages)")


# ============================================================
# the exact same scripted conversation as chat_short_term.py
# ============================================================

send("Hi, my name is Priya and I'm building a birdwatching app.")
send("What's a good name for a database table that stores bird species?")
send("What's 12 * 8?")
send("What year did construction of the Eiffel Tower finish?")
send("Any tips for staying motivated on a side project?")
send("What's my name, and what am I building?")
