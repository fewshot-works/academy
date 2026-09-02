# Advanced Concepts lab: a minimal AI gateway, built by hand.
#
# TaskFlow's support assistant (the same fictional app from Advanced
# Concepts: Token & Cost Management) needs to answer a customer question
# right now. This lab simulates PRIMARY_PROVIDER having a temporary outage:
# every call to it fails instead of answering.
#
# PART ONE calls the primary provider directly, no fallback. That's what
# "just call the provider's SDK" looks like when the provider is down: the
# request fails, full stop, the customer gets nothing.
#
# PART TWO wraps the exact same call in a tiny gateway function: try the
# primary, catch the failure, automatically retry against FALLBACK_PROVIDER
# instead. When the fallback is available, the customer gets an answer and
# never sees the primary provider's error.
#
# Which two providers this uses is controlled by PRIMARY_PROVIDER and
# FALLBACK_PROVIDER in your .env file. See README.md for setup steps.

import os

from dotenv import load_dotenv

# Reads .env and makes the provider settings and any API keys available below.
load_dotenv()

PRIMARY_PROVIDER = os.getenv("PRIMARY_PROVIDER", "openai")
FALLBACK_PROVIDER = os.getenv("FALLBACK_PROVIDER", "ollama")

OLLAMA_MODEL = "llama3.2"
OPENAI_MODEL = "gpt-4o-mini"
ANTHROPIC_MODEL = "claude-haiku-4-5-20251001"
REQUEST_TIMEOUT_SECONDS = 30


class RetryableProviderError(Exception):
    """A temporary provider failure that is safe to route around."""


def call_provider(provider, messages):
    """One real call to one real provider. Same messages shape works for
    all three, this is the "one interface" half of what a gateway buys you.
    """
    if provider == "ollama":
        import requests

        try:
            response = requests.post(
                "http://localhost:11434/api/chat",
                json={"model": OLLAMA_MODEL, "messages": messages, "stream": False},
                timeout=REQUEST_TIMEOUT_SECONDS,
            )
        except (requests.ConnectionError, requests.Timeout) as error:
            raise RetryableProviderError(
                f"ollama is temporarily unavailable: {error}"
            ) from error

        if response.status_code == 429 or response.status_code >= 500:
            raise RetryableProviderError(
                f"ollama returned retryable HTTP {response.status_code}"
            )
        response.raise_for_status()
        return response.json()["message"]["content"]

    elif provider == "openai":
        import openai

        client = openai.OpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            timeout=REQUEST_TIMEOUT_SECONDS,
            max_retries=0,
        )
        try:
            response = client.chat.completions.create(
                model=OPENAI_MODEL, messages=messages
            )
        except (
            openai.APIConnectionError,
            openai.APITimeoutError,
            openai.InternalServerError,
            openai.RateLimitError,
        ) as error:
            raise RetryableProviderError(
                f"openai is temporarily unavailable: {error}"
            ) from error
        return response.choices[0].message.content

    elif provider == "anthropic":
        import anthropic

        client = anthropic.Anthropic(
            api_key=os.getenv("ANTHROPIC_API_KEY"),
            timeout=REQUEST_TIMEOUT_SECONDS,
            max_retries=0,
        )
        system = messages[0]["content"] if messages[0]["role"] == "system" else None
        chat_messages = messages[1:] if system else messages
        try:
            response = client.messages.create(
                model=ANTHROPIC_MODEL,
                max_tokens=300,
                system=system,
                messages=chat_messages,
            )
        except (
            anthropic.APIConnectionError,
            anthropic.APITimeoutError,
            anthropic.InternalServerError,
            anthropic.RateLimitError,
        ) as error:
            raise RetryableProviderError(
                f"anthropic is temporarily unavailable: {error}"
            ) from error
        return response.content[0].text

    else:
        raise ValueError(f"Unknown provider '{provider}'. Use ollama, openai, or anthropic.")


# ============================================================
# the fault injector -- simulates PRIMARY_PROVIDER having an outage
# ============================================================

def flaky_call_provider(provider, messages):
    """Same as call_provider, except PRIMARY_PROVIDER always fails here,
    similar to one incident in a cluster of provider disruptions.
    FALLBACK_PROVIDER is never touched by the simulated fault.
    """
    if provider == PRIMARY_PROVIDER:
        print(
            f"  [fault injector] simulating outage for {provider} "
            "(connection refused)"
        )
        raise RetryableProviderError(f"simulated outage: {provider} is not responding")

    return call_provider(provider, messages)


# ============================================================
# the gateway -- tries each provider in order, falls back on failure
# ============================================================

def call_with_failover(messages, providers):
    last_error = None

    for provider in providers:
        try:
            reply = flaky_call_provider(provider, messages)
            return reply, provider
        except RetryableProviderError as error:
            print(f"  [gateway] {provider} failed ({error}), trying next provider")
            last_error = error

    raise RuntimeError(f"All providers failed. Last error: {last_error}")


# ============================================================
# TaskFlow's support assistant needs to answer this, right now
# ============================================================

MESSAGES = [
    {
        "role": "system",
        "content": "You are a support assistant for TaskFlow, a task-management app. Answer in one or two sentences.",
    },
    {"role": "user", "content": "How do I export my TaskFlow tasks to a CSV file?"},
]

print("=" * 60)
print(f"PART ONE: no gateway, direct call to {PRIMARY_PROVIDER} (simulated outage)")
print("=" * 60)

try:
    reply = flaky_call_provider(PRIMARY_PROVIDER, MESSAGES)
    print(reply.strip())
except RetryableProviderError as error:
    print(f"\nRequest failed: {error}")
    print(
        "No fallback exists here. The support widget shows an error "
        "until the provider recovers."
    )

print()
print("=" * 60)
print(f"PART TWO: with a gateway, {PRIMARY_PROVIDER} -> {FALLBACK_PROVIDER} on failure")
print("=" * 60)

reply, answered_by = call_with_failover(MESSAGES, [PRIMARY_PROVIDER, FALLBACK_PROVIDER])
print(f"\n(answered by: {answered_by})")
print(reply.strip())
