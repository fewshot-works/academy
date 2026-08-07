# Chapter 3 lab: one agent, two MCP servers at once.
#
# Chapter 1 connected to mcp-server-fetch. Chapter 2 connected to our own
# calculator_server.py. Neither of those servers knows the other exists --
# they're just two entries in the same mcp_servers dict here. The agent
# gets tools from both, and picks whichever tool fits the question.

import asyncio
import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_mcp_adapters.client import MultiServerMCPClient

load_dotenv()

# Which model to use is controlled by PROVIDER in your .env, same as every
# other lab. See README.md for setup.
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
    "fetch": {
        "command": "uvx",
        # Version pin works around a real compatibility bug: as of this
        # writing, mcp-server-fetch's latest release hasn't caught up to a
        # rename in the mcp package's newest major version.
        "args": ["--with", "mcp<2.0.0", "mcp-server-fetch"],
        "transport": "stdio",
    },
    "calculator": {
        "command": "uv",
        "args": ["run", "calculator_server.py"],
        "transport": "stdio",
    },
}


async def main():
    # One client, two servers. get_tools() starts both as subprocesses and
    # asks each "what do you offer?", then hands back one combined list --
    # the agent below never has to know which server a tool came from.
    client = MultiServerMCPClient(mcp_servers)
    tools = await client.get_tools()
    print(f"Tools from both servers: {[tool.name for tool in tools]}")

    agent = create_agent(model=model, tools=tools)

    questions = [
        "Use the calculator tool to figure out 12% of 850.",
        "What is the page at https://example.com about? Answer in one sentence.",
    ]

    for question in questions:
        print(f"\nQuestion: {question}")
        result = await agent.ainvoke({"messages": [{"role": "user", "content": question}]})
        for message in result["messages"]:
            tool_calls = getattr(message, "tool_calls", None)
            if tool_calls:
                for call in tool_calls:
                    print(f"  -> calling {call['name']}({call['args']})")
        print(f"Answer: {result['messages'][-1].content.strip()}")


asyncio.run(main())
