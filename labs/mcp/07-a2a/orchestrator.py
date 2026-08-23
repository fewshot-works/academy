# Chapter 7 lab: one local agent, two remote A2A agents.
#
# calculator_agent.py and wikipedia_agent.py are separate A2A servers,
# started on their own, the same way Chapter 4's HTTP server was. This
# script never starts them, it discovers each one's Agent Card, wraps each
# discovered agent as a LangChain tool, and lets create_agent decide which
# remote agent fits a given question -- the same tool-calling pattern every
# earlier chapter used, except each "tool" here is a whole other agent
# reached over A2A instead of an MCP tool call.
#
# Which provider this uses (Ollama, OpenAI, or Anthropic) is controlled by
# PROVIDER in your .env file. See README.md for setup.

import asyncio
import os

import httpx
from dotenv import load_dotenv
from a2a.client import A2ACardResolver, ClientConfig, create_client
from a2a.helpers import get_artifact_text, new_text_message
from a2a.types import Role, SendMessageRequest
from langchain.agents import create_agent
from langchain_core.tools import tool

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

REMOTE_AGENTS = {
    "calculator": "http://127.0.0.1:9001",
    "wikipedia": "http://127.0.0.1:9002",
}


async def ask_remote_agent(base_url, question):
    # The three A2A steps: resolve the Agent Card, create a client from it,
    # send a message and read back the completed task's artifact text.
    async with httpx.AsyncClient() as httpx_client:
        resolver = A2ACardResolver(httpx_client, base_url=base_url)
        card = await resolver.get_agent_card()
        config = ClientConfig(streaming=False, httpx_client=httpx_client)
        client = await create_client(agent=card, client_config=config)

        message = new_text_message(question, role=Role.ROLE_USER)
        request = SendMessageRequest(message=message)

        async for response in client.send_message(request):
            return get_artifact_text(response.task.artifacts[-1])
    return "No response from remote agent."


# Order matters here: with only two tools, a small local model like
# llama3.2 is noticeably more reliable about picking the right one when the
# tool it should call less often for a given prompt is listed first. Not an
# A2A rule, just a quirk of small models with few tools to choose between.
@tool
async def delegate_to_wikipedia_agent(topic: str) -> str:
    """Look up a topic on Wikipedia and return a short summary."""
    return await ask_remote_agent(REMOTE_AGENTS["wikipedia"], topic)


@tool
async def delegate_to_calculator_agent(expression: str) -> str:
    """Evaluate a basic arithmetic expression, e.g. '18 * 7 + 4'."""
    return await ask_remote_agent(REMOTE_AGENTS["calculator"], expression)


async def main():
    async with httpx.AsyncClient() as httpx_client:
        for name, base_url in REMOTE_AGENTS.items():
            card = await A2ACardResolver(httpx_client, base_url=base_url).get_agent_card()
            print(f"Discovered {name} agent: {card.name} -- skills: {[s.name for s in card.skills]}")

    agent = create_agent(model=model, tools=[delegate_to_wikipedia_agent, delegate_to_calculator_agent])

    for question in [
        "What is the Model Context Protocol?",
        "Use the calculator agent to figure out 23 * 19.",
    ]:
        print(f"\nYou: {question}")
        result = await agent.ainvoke({"messages": [{"role": "user", "content": question}]})
        for message in result["messages"]:
            tool_calls = getattr(message, "tool_calls", None)
            if tool_calls:
                for call in tool_calls:
                    print(f"  -> delegating via {call['name']}({call['args']})")
        print(f"Agent: {result['messages'][-1].content.strip()}")


asyncio.run(main())
