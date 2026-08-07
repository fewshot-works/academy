# Chapter 4 lab: connect to a server over HTTP instead of stdio.
#
# Every mcp_servers entry so far had "command" and "args" -- the client
# started the server itself as a subprocess. This one has a "url" instead:
# the server is already running (started separately, with
# calculator_http_server.py), possibly on a different machine entirely.
# The client just connects to it. That's the whole difference.

import asyncio
import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_mcp_adapters.client import MultiServerMCPClient

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
        "url": "http://127.0.0.1:8000/mcp",
        "transport": "streamable_http",
    }
}


async def main():
    client = MultiServerMCPClient(mcp_servers)
    tools = await client.get_tools()
    print(f"Tools from the HTTP server: {[tool.name for tool in tools]}")

    agent = create_agent(model=model, tools=tools)

    question = "Use the calculator tool to figure out 23 * 19."
    print(f"\nQuestion: {question}")
    result = await agent.ainvoke({"messages": [{"role": "user", "content": question}]})
    for message in result["messages"]:
        tool_calls = getattr(message, "tool_calls", None)
        if tool_calls:
            for call in tool_calls:
                print(f"  -> calling {call['name']}({call['args']})")
    print(f"Answer: {result['messages'][-1].content.strip()}")


asyncio.run(main())
