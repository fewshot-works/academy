# Advanced Chapter 1 lab: a supervisor agent delegating to two specialist
# agents, instead of one generalist agent juggling every tool itself.
#
# Intermediate's capstone gave one agent three tools and let it decide which
# to call. Here, two of those tools (calculator and search_wikipedia,
# unchanged from Chapters 5/6/7/9) each get their own small agent instead --
# a "research agent" and a "math agent". A third agent, the supervisor, has
# no tools of its own except the other two agents, wrapped as tools it can
# call. This is the "agent-as-tool" pattern: LangChain's own docs now
# recommend building a supervisor this way directly, rather than reaching
# for a separate framework, so nothing new is being installed here beyond
# what Chapters 6, 7, and 9 already used.
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

if provider == "ollama":
    model = "ollama:llama3.2"
elif provider == "openai":
    model = "openai:gpt-4o-mini"
elif provider == "anthropic":
    model = "anthropic:claude-haiku-4-5-20251001"
else:
    raise ValueError(f"Unknown provider '{provider}'. Set PROVIDER to ollama, openai, or anthropic in your .env")


# ============================================================
# the two tools -- unchanged from Chapters 5/6/7/9
# ============================================================

@tool
def calculator(expression: str) -> str:
    """Evaluate a basic arithmetic expression, e.g. '18 * 7 + 4'."""
    # Deliberately NOT Python's eval() -- see Chapter 5/6 for why.
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
# two specialist agents, each with exactly one tool
# ============================================================

research_agent = create_agent(model=model, tools=[search_wikipedia])
math_agent = create_agent(model=model, tools=[calculator])


# ============================================================
# wrap each specialist agent as a tool the supervisor can call --
# this is the whole trick of the "agent-as-tool" pattern
# ============================================================

@tool
def ask_research_agent(topic: str) -> str:
    """Delegate a lookup to the research specialist, who can search
    Wikipedia for general public knowledge (history, geography, famous
    landmarks, etc). Cannot do math -- send arithmetic to ask_math_agent
    instead."""
    result = research_agent.invoke({"messages": [{"role": "user", "content": topic}]})
    return result["messages"][-1].content


@tool
def ask_math_agent(expression: str) -> str:
    """Delegate a calculation to the math specialist, who can evaluate
    arithmetic expressions. Cannot look anything up -- send research
    questions to ask_research_agent instead."""
    result = math_agent.invoke({"messages": [{"role": "user", "content": expression}]})
    return result["messages"][-1].content


# ============================================================
# the supervisor -- no tools of its own except the two agents above.
# Same checkpointer + thread_id pattern as Chapter 7, so a follow-up
# question can lean on an answer from a turn or two ago -- that's what
# makes a multi-step question ("look this up, then do math on it")
# tractable as separate turns instead of one single-shot reasoning chain.
# ============================================================

supervisor = create_agent(model=model, tools=[ask_research_agent, ask_math_agent], checkpointer=InMemorySaver())
thread_config = {"configurable": {"thread_id": "conversation-1"}}


def send(message):
    print(f"\nYou: {message}")
    result = supervisor.invoke({"messages": [{"role": "user", "content": message}]}, thread_config)

    for msg in result["messages"][-3:]:
        tool_calls = getattr(msg, "tool_calls", None)
        if tool_calls:
            for call in tool_calls:
                print(f"  supervisor -> calling {call['name']}({call['args']})")

    print(f"Supervisor: {result['messages'][-1].content.strip()}")


# ============================================================
# a scripted conversation: one pure research question, one pure math
# question, then a follow-up that needs the supervisor to remember the
# research answer and hand a derived expression to the math agent
# ============================================================

send("What year did construction of the Eiffel Tower finish?")
send("What's 18 * 7 + 4?")
send("What's 15% of the year the Eiffel Tower finished construction?")
