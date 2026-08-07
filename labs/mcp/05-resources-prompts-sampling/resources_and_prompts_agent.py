# Chapter 5 lab: reading a resource and using a prompt template from an
# MCP server, MCP's other two primitives besides tools.
#
# Resources and prompts aren't things an agent decides to call mid
# conversation the way it calls a tool. They're things your own script
# reaches for directly: get_resources() reads content, get_prompt() fills
# in a template. What you do with either afterwards is up to you.

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
    "docs": {
        "command": "uv",
        "args": ["run", "docs_server.py"],
        "transport": "stdio",
    }
}


async def main():
    client = MultiServerMCPClient(mcp_servers)

    # A resource: content the server offers to be read, addressed by a
    # URI, the same as a URL identifies a page. No model is involved yet,
    # this is just fetching text.
    resources = await client.get_resources("docs")
    print("Resource content:")
    print(f"  {resources[0].as_string()}")

    # A prompt: a reusable template the server defines, filled in with
    # arguments this script provides. The server never runs a model
    # itself, it just hands back the filled-in message for this script's
    # own agent to send.
    prompt_messages = await client.get_prompt(
        "docs",
        "explain_answer",
        arguments={"expression": "12 * 7", "answer": "84"},
    )
    print(f"\nPrompt template filled in: {prompt_messages[0].content}")

    agent = create_agent(model=model, tools=[])
    result = await agent.ainvoke({"messages": prompt_messages})
    print(f"\nModel's explanation: {result['messages'][-1].content.strip()}")


asyncio.run(main())
