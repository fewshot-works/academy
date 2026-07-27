# Chapter 6 lab: the same calculator + Wikipedia search assistant from
# Chapter 5, this time built with LangChain's create_agent instead of a
# hand-written loop.
#
# Chapter 5 wrote the reason/act/observe loop by hand, once per provider.
# Here, create_agent handles that loop for us -- same two tools, same four
# questions, so you can compare the two side by side.
#
# Which provider is used (Ollama, OpenAI, or Anthropic) is controlled by the
# PROVIDER variable in your .env file. See README.md for setup steps.

import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.tools import tool

load_dotenv()  # reads .env, makes PROVIDER (and any API keys) available below

provider = os.getenv("PROVIDER", "ollama")


# ============================================================
# the two tools -- same logic as Chapter 5, now as LangChain tools
# ============================================================

@tool
def calculator(expression: str) -> str:
    """Evaluate a basic arithmetic expression, e.g. '18 * 7 + 4'."""
    # Deliberately NOT Python's eval() -- the model's own text becomes the
    # input here, and eval() would happily run anything, not just math.
    # Walking a parsed syntax tree and only allowing a few operators keeps
    # this safe no matter what the model sends.
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
        headers={"User-Agent": "zero-to-agent-tutorial (https://github.com/fewshot-works/zero-to-agent)"},
    )
    results = response.json()["query"]["search"]
    if not results:
        return "No Wikipedia results found."

    top = results[0]
    snippet = top["snippet"].replace('<span class="searchmatch">', "").replace("</span>", "")
    return html.unescape(f"{top['title']}: {snippet}")


# ============================================================
# build the agent -- this one call replaces Chapter 5's three
# separate ~40-line provider branches
# ============================================================

if provider == "ollama":
    model = "ollama:llama3.2"
elif provider == "openai":
    model = "openai:gpt-4o-mini"
elif provider == "anthropic":
    model = "anthropic:claude-haiku-4-5-20251001"
else:
    raise ValueError(f"Unknown provider '{provider}'. Set PROVIDER to ollama, openai, or anthropic in your .env")

agent = create_agent(model=model, tools=[calculator, search_wikipedia])


def run_with_tools(question):
    print(f"\nQuestion: {question}")
    result = agent.invoke({"messages": [{"role": "user", "content": question}]})

    for message in result["messages"]:
        tool_calls = getattr(message, "tool_calls", None)
        if tool_calls:
            for call in tool_calls:
                print(f"  -> calling {call['name']}({call['args']})")

    return result["messages"][-1].content


# ============================================================
# try the same four questions as Chapter 5
# ============================================================

questions = [
    "What's 18 * 7 + 4?",
    "What year did construction of the Eiffel Tower finish?",
    "In one sentence, what's a good tip for staying focused while studying?",
    "What's 15% of 340, and what year did construction of the Eiffel Tower finish?",
]

for question in questions:
    answer = run_with_tools(question)
    print(f"Answer: {answer.strip()}")
