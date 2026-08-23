# MCP capstone: one agent, two MCP servers, calculator_server.py (your own,
# unchanged since Chapter 2) and mcp-server-fetch (public, unchanged since
# Chapter 1 and Chapter 3), plus memory across the conversation and a
# guardrail on fetch, the one tool here that can actually go wrong.
#
# Fetch retrieves whatever URL it's given and hands the page's text back to
# the model. Chapter 6 showed why that's a real risk: text a tool returns is
# text the model reads, and nothing stops a fetched page from containing its
# own instructions aimed at whoever reads it next. This script doesn't wait
# for that to happen, it wraps fetch in a fixed domain allowlist, the same
# client-side guard pattern from Chapter 6, applied to a tool worth actually
# running instead of a fictional attacker.
#
# A stronger version of this idea, pausing for a human's explicit approval
# before a risky call runs instead of a fixed allowlist, is Advanced
# Concepts: Human-in-the-Loop Approval Gates. This lab sticks with the
# allowlist since it needs no human on the other end to finish running.
#
# Which provider is used (Ollama, OpenAI, or Anthropic) is controlled by the
# PROVIDER variable in your .env file. See README.md for setup steps.

import asyncio
import os
from urllib.parse import urlparse

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_core.tools import tool
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.checkpoint.memory import InMemorySaver

load_dotenv()

provider = os.getenv("PROVIDER", "ollama")
if provider == "ollama":
    model = "ollama:llama3.2"
elif provider == "openai":
    model = "openai:gpt-4o-mini"
elif provider == "anthropic":
    model = "anthropic:claude-haiku-4-5-20251001"
else:
    raise ValueError(f"Unknown provider '{provider}'. Set PROVIDER to ollama, openai, or anthropic in your .env")

mcp_servers = {
    "calculator": {
        "command": "uv",
        "args": ["run", "calculator_server.py"],
        "transport": "stdio",
    },
    "fetch": {
        "command": "uvx",
        "args": ["--with", "mcp<2.0.0", "mcp-server-fetch"],
        "transport": "stdio",
    },
}

# Only fetches to these domains are allowed through, no matter what the
# model, or a fetched page's own text, tries to talk it into doing instead.
ALLOWED_DOMAINS = {"en.wikipedia.org", "example.com"}


async def build_agent():
    client = MultiServerMCPClient(mcp_servers)
    tools = await client.get_tools()

    fetch_tool = next(t for t in tools if t.name == "fetch")

    @tool
    async def fetch_guarded(url: str) -> str:
        """Fetch a URL and return its page content as text. Use this to
        look things up on the web."""
        domain = urlparse(url).netloc
        if domain not in ALLOWED_DOMAINS:
            print(f"  [tool-call guard] blocked fetch to unapproved domain: {domain}")
            return f"Could not fetch: {domain} is not an approved domain."
        return await fetch_tool.ainvoke({"url": url})

    guarded_tools = [t for t in tools if t.name != "fetch"] + [fetch_guarded]

    return create_agent(model=model, tools=guarded_tools, checkpointer=InMemorySaver())


# Built once, at import time -- both the scripted run below and
# streamlit_app.py share this same agent and conversation thread.
agent = asyncio.run(build_agent())

thread_config = {"configurable": {"thread_id": "conversation-1"}}


async def send(message):
    print(f"\nYou: {message}")
    messages_before = len(agent.get_state(thread_config).values.get("messages", []))
    result = await agent.ainvoke({"messages": [{"role": "user", "content": message}]}, thread_config)

    new_messages = result["messages"][messages_before:]
    for m in new_messages:
        tool_calls = getattr(m, "tool_calls", None)
        if tool_calls:
            for call in tool_calls:
                print(f"  calling {call['name']}({call['args']})")

    print(f"Agent: {result['messages'][-1].content.strip()}")


async def run_conversation():
    await send("What's 15% of 340?")
    await send("Now look up https://en.wikipedia.org/wiki/Model_Context_Protocol and summarize it in one sentence.")
    await send("Try fetching https://totally-unapproved-domain.example.net instead -- what happens?")
    await send("What was the first thing I asked you to calculate?")


if __name__ == "__main__":
    asyncio.run(run_conversation())
