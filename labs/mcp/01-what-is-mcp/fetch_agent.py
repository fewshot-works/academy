# Chapter 1 lab: connect an agent to an MCP server you didn't write.
#
# Every tool so far (Chapter 5's calculator, Chapter 6's Wikipedia search)
# was a Python function you wrote yourself, in your own script. This tool
# is different: it comes from mcp-server-fetch, an MCP server built by
# someone else, whose source code this script has never seen. The agent
# just asks the server what it can do, and calls it.
#
# Which provider is used (Ollama, OpenAI, or Anthropic) is controlled by the
# PROVIDER variable in your .env file. See README.md for setup steps.

import asyncio
import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_mcp_adapters.client import MultiServerMCPClient

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

# mcp-server-fetch is the official MCP reference server for fetching a URL
# and turning it into readable text. "uvx mcp-server-fetch" downloads and
# runs it on the fly the first time -- nothing to install by hand. The
# "--with mcp<2.0.0" pin works around a real compatibility bug: as of this
# writing, mcp-server-fetch's latest release hasn't caught up to a rename
# in the mcp package's newest major version.
mcp_servers = {
    "fetch": {
        "command": "uvx",
        "args": ["--with", "mcp<2.0.0", "mcp-server-fetch"],
        "transport": "stdio",
    }
}


async def main():
    # The client starts the server as a subprocess and speaks MCP to it
    # over stdio. get_tools() asks the server what it offers and wraps
    # each one as a LangChain tool -- this script never defines fetch()
    # itself.
    client = MultiServerMCPClient(mcp_servers)
    tools = await client.get_tools()
    print(f"Tools the fetch server offers: {[tool.name for tool in tools]}")

    agent = create_agent(model=model, tools=tools)

    question = "What is the page at https://example.com about? Answer in one sentence."
    print(f"\nQuestion: {question}")

    result = await agent.ainvoke({"messages": [{"role": "user", "content": question}]})

    for message in result["messages"]:
        tool_calls = getattr(message, "tool_calls", None)
        if tool_calls:
            for call in tool_calls:
                print(f"  -> calling {call['name']}({call['args']})")

    print(f"Answer: {result['messages'][-1].content.strip()}")


asyncio.run(main())
