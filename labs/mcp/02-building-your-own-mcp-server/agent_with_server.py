# Chapter 2 lab, part 2: an agent that connects to the calculator server in
# calculator_server.py -- the same create_agent call as every chapter since
# Intermediate Chapter 6, now pointed at a server this project built itself
# instead of Chapter 1's off-the-shelf one.
#
# Which provider is used (Ollama, OpenAI, or Anthropic) is controlled by the
# PROVIDER variable in your .env file. See README.md for setup steps.

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

# "uv run calculator_server.py" starts our own server as a subprocess, the
# same way Chapter 1 started someone else's. From the client's side, there's
# no difference: it's still just a server that answers "what do you offer?"
mcp_servers = {
    "calculator": {
        "command": "uv",
        "args": ["run", "calculator_server.py"],
        "transport": "stdio",
    }
}


async def main():
    client = MultiServerMCPClient(mcp_servers)
    tools = await client.get_tools()
    print(f"Tools our own server offers: {[tool.name for tool in tools]}")

    agent = create_agent(model=model, tools=tools)

    question = "What's 15% of 340?"
    print(f"\nQuestion: {question}")

    result = await agent.ainvoke({"messages": [{"role": "user", "content": question}]})

    for message in result["messages"]:
        tool_calls = getattr(message, "tool_calls", None)
        if tool_calls:
            for call in tool_calls:
                print(f"  -> calling {call['name']}({call['args']})")

    print(f"Answer: {result['messages'][-1].content.strip()}")


asyncio.run(main())
