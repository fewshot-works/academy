# Advanced Concepts lab: role-based access control (RBAC) for agent tools.
#
# Chapter 3 (Agent Security) guarded one tool with a fixed allowlist: the
# same rule applied no matter who -- or what -- was asking. This lab adds
# the next layer: the SAME agent, with the SAME tools, should behave
# differently depending on who's asking. And "who's asking" doesn't just
# decide yes/no, it can also decide HOW MUCH.
#
# Fernwood Coffee Co.'s support assistant gets the same request twice: a
# customer says order #4521 arrived damaged and wants a $95 refund.
#
# PART ONE runs as a support_rep, a role with no refund permission at all.
# Blocked outright -- same binary allow/deny mechanism as Chapter 3's
# allowlist.
#
# PART TWO runs the exact same question as a support_lead, a role that DOES
# have refund permission, but only up to a $75 cap. $95 is still blocked --
# not because the role lacks permission, but because this specific request
# exceeds what that role is scoped to do. That's the new idea: the guard
# doesn't just gate the tool, it gates the tool's arguments based on role.
#
# Which provider this uses (Ollama, OpenAI, or Anthropic) is controlled by
# the PROVIDER variable in your .env file. See README.md for setup steps.

import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.tools import tool

load_dotenv()  # reads .env, makes PROVIDER (and any API keys) available below

provider = os.getenv("PROVIDER", "ollama")


# ============================================================
# fake order data
# ============================================================

ORDERS = {
    "4521": {
        "item": "12oz Ethiopia Yirgacheffe (3-pack)",
        "amount": 95,
        "status": "delivered, customer reports damaged packaging",
    },
}


@tool
def look_up_order(order_id: str) -> str:
    """Look up an order by its order ID."""
    order = ORDERS.get(order_id)
    if not order:
        return f"No order found with ID {order_id}."
    return (
        f"Order {order_id}: {order['item']}, ${order['amount']}, "
        f"status: {order['status']}"
    )


# ============================================================
# roles and what they're allowed to do
# ============================================================

ROLE_PERMISSIONS = {
    "support_rep": {"look_up_order"},
    "support_lead": {"look_up_order", "issue_refund"},
}

REFUND_CAP = {
    "support_lead": 75,  # support_rep has no refund permission at all
}

CURRENT_ROLE = "support_rep"  # run() below changes this before each part

issued_refunds = []


@tool
def issue_refund_guarded(order_id: str, amount: int) -> str:
    """Issue a refund of the given dollar amount for the given order ID."""
    if "issue_refund" not in ROLE_PERMISSIONS.get(CURRENT_ROLE, set()):
        print(f"  [tool-call guard] blocked issue_refund: role '{CURRENT_ROLE}' has no refund permission")
        return f"Could not issue refund: role '{CURRENT_ROLE}' does not have permission to issue refunds."

    cap = REFUND_CAP.get(CURRENT_ROLE, 0)
    if amount > cap:
        print(f"  [tool-call guard] blocked issue_refund: ${amount} exceeds the ${cap} cap for role '{CURRENT_ROLE}'")
        return f"Could not issue refund: ${amount} exceeds the ${cap} refund cap for role '{CURRENT_ROLE}'."

    issued_refunds.append((order_id, amount))
    return f"Refund of ${amount} issued for order {order_id}."


# ============================================================
# build the agent -- same create_agent pattern as Chapter 3
# ============================================================

if provider == "ollama":
    model = "ollama:qwen2.5:3b"
elif provider == "openai":
    model = "openai:gpt-4o-mini"
elif provider == "anthropic":
    model = "anthropic:claude-haiku-4-5-20251001"
else:
    raise ValueError(f"Unknown provider '{provider}'. Set PROVIDER to ollama, openai, or anthropic in your .env")

SYSTEM_PROMPT = (
    "You are a customer support assistant for Fernwood Coffee Co. Use "
    "look_up_order to check order details, then use issue_refund_guarded to "
    "process refunds when the customer's request is reasonable."
)

QUESTION = (
    "The customer says order #4521 arrived with damaged packaging and "
    "they're asking for a $95 refund. Look into it and handle it."
)


def run(role, label):
    global CURRENT_ROLE
    CURRENT_ROLE = role

    print(f"\n--- {label} (role: {role}) ---")
    agent = create_agent(model=model, tools=[look_up_order, issue_refund_guarded], system_prompt=SYSTEM_PROMPT)
    result = agent.invoke({"messages": [{"role": "user", "content": QUESTION}]})

    for message in result["messages"]:
        tool_calls = getattr(message, "tool_calls", None)
        if tool_calls:
            for call in tool_calls:
                print(f"  -> calling {call['name']}({call['args']})")

    print(f"Answer: {result['messages'][-1].content.strip()}")


# ============================================================
# PART ONE: support_rep -- no refund permission at all
# ============================================================

print("=" * 60)
print("PART ONE: support_rep asks for a $95 refund")
print("=" * 60)

run("support_rep", "support rep")

if issued_refunds:
    print(f"\n{len(issued_refunds)} refund(s) actually issued:")
    for order_id, amount in issued_refunds:
        print(f"  order {order_id}: ${amount}")
else:
    print("\nNo refund was issued this run.")

# ============================================================
# PART TWO: same question, support_lead -- has permission, but a $75 cap
# ============================================================

issued_refunds.clear()

print()
print("=" * 60)
print("PART TWO: support_lead asks for the same $95 refund")
print("=" * 60)

run("support_lead", "support lead")

if issued_refunds:
    print(f"\n{len(issued_refunds)} refund(s) actually issued:")
    for order_id, amount in issued_refunds:
        print(f"  order {order_id}: ${amount}")
else:
    print("\nNo refund was issued this run. support_lead has refund "
          "permission, but $95 is still over the $75 cap for that role.")
