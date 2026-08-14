# Advanced Concepts lab: chaos engineering (fault injection) for agent tools.
#
# Every other lab in this course tests the happy path: the tool call works,
# and we watch what the agent does with a correct result. Real tool calls --
# a database query, an API request, an order-lookup service -- don't always
# come back clean. A flaky network, an overloaded service, a dropped
# connection can all make a call return something wrong, not just fail
# outright.
#
# This lab simulates ONE of those failure modes: a "value fault," where a
# tool call returns *something* instead of an error, but that something is
# corrupted -- truncated mid-response, the way a real API might behave if
# the connection dropped partway through. Nothing crashes. No exception is
# raised. The agent just gets bad data and has to decide what to do with it.
#
# Fernwood Coffee Co.'s support assistant is asked the same question twice:
# what's the status of order #4521, and how much was it for?
#
# PART ONE calls a NAIVE tool: it passes along whatever the (simulated)
# flaky service returns, corrupted or not, with zero validation.
#
# PART TWO calls a GUARDED tool: same simulated flaky service, but the tool
# checks whether the response looks complete before trusting it. If it
# doesn't, the tool retries once before giving up and saying so plainly.
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


def _real_lookup(order_id):
    """The order-lookup service, working correctly, no faults involved."""
    order = ORDERS.get(order_id)
    if not order:
        return f"No order found with ID {order_id}."
    return (
        f"Order {order_id}: {order['item']}, ${order['amount']}, "
        f"status: {order['status']}"
    )


# ============================================================
# the fault injector -- simulates a flaky service, on purpose
# ============================================================

TRUNCATE_AT = 40  # cuts the response off mid-word, before the dollar amount

# Counts calls per tool so the FIRST call to each tool comes back corrupted,
# and every call after that comes back clean -- simulating a transient
# blip, not a permanently broken service.
call_count = {"naive": 0, "guarded": 0}


def flaky_lookup(order_id, tool_name):
    call_count[tool_name] += 1
    real_result = _real_lookup(order_id)

    if call_count[tool_name] == 1:
        print(f"  [fault injector] corrupting this response (simulated value fault)")
        return real_result[:TRUNCATE_AT]

    return real_result


# ============================================================
# the two tools -- same simulated fault, different handling
# ============================================================

@tool
def look_up_order_naive(order_id: str) -> str:
    """Look up an order by its order ID."""
    return flaky_lookup(order_id, "naive")


@tool
def look_up_order_guarded(order_id: str) -> str:
    """Look up an order by its order ID."""
    result = flaky_lookup(order_id, "guarded")

    # A real order line always mentions a dollar amount and a status.
    # If either is missing, the response is incomplete -- retry once.
    if "$" not in result or "status:" not in result:
        print("  [fault guard] response looks incomplete, retrying once")
        result = flaky_lookup(order_id, "guarded")

        if "$" not in result or "status:" not in result:
            return "Order lookup is temporarily unavailable. Please tell the customer to try again shortly."

    return result


# ============================================================
# build the agent -- same create_agent pattern as earlier chapters
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
    "You are a customer support assistant for Fernwood Coffee Co. Use the "
    "order-lookup tool available to you before answering questions about an order."
)

QUESTION = "What's the status of order #4521, and how much was it for?"


def run(tool_fn, label):
    print(f"\n--- {label} ---")
    agent = create_agent(model=model, tools=[tool_fn], system_prompt=SYSTEM_PROMPT)
    result = agent.invoke({"messages": [{"role": "user", "content": QUESTION}]})

    for message in result["messages"]:
        tool_calls = getattr(message, "tool_calls", None)
        if tool_calls:
            for call in tool_calls:
                print(f"  -> calling {call['name']}({call['args']})")

    print(f"Answer: {result['messages'][-1].content.strip()}")


# ============================================================
# PART ONE: naive tool -- no validation, corrupted data passed straight through
# ============================================================

print("=" * 60)
print("PART ONE: naive tool, first call comes back corrupted")
print("=" * 60)

run(look_up_order_naive, "look_up_order_naive")

# ============================================================
# PART TWO: guarded tool -- same corruption, but validated and retried
# ============================================================

print()
print("=" * 60)
print("PART TWO: guarded tool, same corrupted first call")
print("=" * 60)

run(look_up_order_guarded, "look_up_order_guarded")
