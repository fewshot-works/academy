# Advanced Concepts lab: pausing an agent for a human's yes before a risky
# tool actually runs.
#
# calculator and search_wikipedia (same as Intermediate Chapter 7) are safe
# to auto-approve, a wrong calculator answer or a bad Wikipedia snippet is
# easy to notice and cheap to shrug off. send_email is different: once it
# sends, a real customer has a real email in their inbox, there's no
# un-sending it. This lab gates only that one tool with
# HumanInTheLoopMiddleware, so the agent still calls it, but the call
# pauses right before it would actually run, and waits for a human decision.
#
# The conversation below sends two refund emails. The first is approved,
# the real send_email body runs, and the customer gets an email. The
# second has a wrong amount and an unfamiliar recipient, so it's rejected:
# send_email's body never runs, and the agent gets told why instead.
#
# Which provider this uses (Ollama, OpenAI, or Anthropic) is controlled by
# the PROVIDER variable in your .env file. See README.md for setup steps.

import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langchain.tools import tool
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import Command

load_dotenv()  # reads .env, makes PROVIDER (and any API keys) available below

provider = os.getenv("PROVIDER", "ollama")


# ============================================================
# the same two tools as Chapter 7, plus one new, riskier one
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


sent_emails = []


@tool
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email with the given subject and body to the given recipient."""
    sent_emails.append((to, subject, body))
    return f"Email sent to {to}."


# ============================================================
# build the agent -- same create_agent + checkpointer as Chapter 7,
# plus a middleware that pauses before send_email actually runs
# ============================================================

if provider == "ollama":
    model = "ollama:llama3.2"
elif provider == "openai":
    model = "openai:gpt-4o-mini"
elif provider == "anthropic":
    model = "anthropic:claude-haiku-4-5-20251001"
else:
    raise ValueError(f"Unknown provider '{provider}'. Set PROVIDER to ollama, openai, or anthropic in your .env")

SYSTEM_PROMPT = (
    "You are a support assistant for Fernwood Coffee Co. Use calculator and "
    "search_wikipedia freely. Use send_email whenever a refund needs "
    "confirming, don't wait to be told twice."
)

# calculator and search_wikipedia aren't listed here, so
# HumanInTheLoopMiddleware auto-approves them without pausing. send_email
# is listed, so every call to it pauses for a decision first.
agent = create_agent(
    model=model,
    tools=[calculator, search_wikipedia, send_email],
    system_prompt=SYSTEM_PROMPT,
    checkpointer=InMemorySaver(),
    middleware=[HumanInTheLoopMiddleware(interrupt_on={"send_email": True})],
)

thread_config = {"configurable": {"thread_id": "conversation-1"}}


def send(message):
    print(f"\nYou: {message}")
    result = agent.invoke({"messages": [{"role": "user", "content": message}]}, thread_config)
    if "__interrupt__" not in result:
        print(f"Agent: {result['messages'][-1].content.strip()}")
    return result


def show_pending_call(result):
    request = result["__interrupt__"][0].value
    action = request["action_requests"][0]
    print(f"  [paused] agent wants to call {action['name']}({action['args']})")


# ============================================================
# ordinary questions -- neither tool is gated, so neither pauses
# ============================================================

send("What's 15% of $340?")
send("Search Wikipedia for the history of espresso.")

# ============================================================
# a legitimate refund -- send_email pauses, we approve it, and
# the real tool body runs on resume
# ============================================================

result = send(
    "A customer named Jordan says their $18 order never arrived. Send a "
    "refund confirmation to jordan@example.com for $18."
)
show_pending_call(result)
print("  -> approving")
result = agent.invoke(Command(resume={"decisions": [{"type": "approve"}]}), thread_config)
print(f"Agent: {result['messages'][-1].content.strip()}")

# ============================================================
# same conversation, another refund -- but the amount is 10x too
# high and the address looks wrong, so we reject it instead
# ============================================================

result = send(
    "Another customer had the same issue, send a $180 refund confirmation "
    "to finance-test@external-domain.com."
)
show_pending_call(result)
print("  -> rejecting")
result = agent.invoke(
    Command(
        resume={
            "decisions": [
                {
                    "type": "reject",
                    "message": "Amount and recipient look wrong, don't send this one.",
                }
            ]
        }
    ),
    thread_config,
)
print(f"Agent: {result['messages'][-1].content.strip()}")

print(f"\n{len(sent_emails)} email(s) actually sent:")
for to, subject, body in sent_emails:
    print(f"  to: {to} | subject: {subject} | body: {body}")
