# Advanced Chapter 5 lab: tracing an agent's LLM calls with OpenLLMetry
# (traceloop-sdk), built on OpenTelemetry. Every LLM call becomes a span
# with the model name, the prompt, the completion, and how long it took,
# printed straight to your own console. No account, no API key, nothing
# leaves your machine.
#
# The provider used (Ollama, OpenAI, or Anthropic) is controlled by the
# PROVIDER variable in your .env file. See README.md for setup steps.
#
# Note: unlike earlier labs, the Ollama branch here uses the official
# `ollama` Python package instead of raw `requests` calls. OpenLLMetry
# auto-instruments that specific package, so this swap is what actually
# gets Ollama calls captured as real LLM spans, not just generic HTTP
# traffic.

import os

from dotenv import load_dotenv
from opentelemetry.sdk.trace.export import ConsoleSpanExporter
from traceloop.sdk import Traceloop
from traceloop.sdk.decorators import task, workflow

load_dotenv()

provider = os.getenv("PROVIDER", "ollama")

# disable_batch=True prints each span as soon as it finishes, instead of
# waiting to batch several together -- easier to read for a short script.
#
# Bonus (see README): to send traces to a local Jaeger UI instead of the
# console, run Jaeger with Docker and swap this line for:
#   Traceloop.init(app_name="fernwood-support-agent", api_endpoint="http://localhost:4318", disable_batch=True)
Traceloop.init(app_name="fernwood-support-agent", exporter=ConsoleSpanExporter(), disable_batch=True)


@task(name="ask_model")
def ask(user_message, system=None):
    if provider == "ollama":
        import ollama

        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": user_message})

        response = ollama.chat(model="llama3.2", messages=messages)
        return response.message.content

    elif provider == "openai":
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
        return response.choices[0].message.content

    elif provider == "anthropic":
        import anthropic

        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            system=system or "",
            messages=[{"role": "user", "content": user_message}],
        )
        return response.content[0].text

    else:
        print(f"Unknown PROVIDER '{provider}'. Set it to ollama, openai, or anthropic in .env")
        raise SystemExit(1)


SYSTEM_PROMPT = """You are the support bot for Fernwood Coffee Co. Answer briefly, one or two
sentences, using only these facts: best-selling drink is the Depot Latte; three locations,
all in the same state; loyalty program gives a free drink after every ten purchases."""


@workflow(name="support_conversation")
def run_conversation():
    print("Q1: What's your best-selling drink?")
    answer_1 = ask("What's your best-selling drink?", system=SYSTEM_PROMPT)
    print(f"A1: {answer_1}\n")

    print("Q2: How many locations do you have?")
    answer_2 = ask("How many locations do you have?", system=SYSTEM_PROMPT)
    print(f"A2: {answer_2}\n")


run_conversation()
