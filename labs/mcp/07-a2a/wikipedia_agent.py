# The second A2A server. Same Wikipedia lookup as Intermediate Chapter 5's
# search_wikipedia tool, wrapped as its own A2A agent on a different port.
# The point of running two of these is Chapter 3's lesson again, but one
# level up: instead of one MCP client routing between MCP servers, this
# lab's orchestrator routes between whole other agents.

import html

import requests
import uvicorn
from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.routes import create_agent_card_routes, create_jsonrpc_routes
from a2a.server.tasks import InMemoryTaskStore, TaskUpdater
from a2a.helpers import get_message_text, new_task_from_user_message, new_text_message, new_text_part
from a2a.types import AgentCapabilities, AgentCard, AgentInterface, AgentSkill, TaskState
from starlette.applications import Starlette


def search_wikipedia(query):
    # Same call as Intermediate Chapter 5: Wikipedia's search API needs a
    # descriptive User-Agent or it rejects the request with a 403.
    response = requests.get(
        "https://en.wikipedia.org/w/api.php",
        params={"action": "query", "list": "search", "srsearch": query, "format": "json", "srlimit": 1},
        headers={"User-Agent": "academy-tutorial (https://github.com/fewshot-works/academy)"},
    )
    results = response.json()["query"]["search"]
    if not results:
        return "No Wikipedia results found."

    top = results[0]
    snippet = top["snippet"].replace('<span class="searchmatch">', "").replace("</span>", "")
    return html.unescape(f"{top['title']}: {snippet}")


class WikipediaAgentExecutor(AgentExecutor):
    async def execute(self, context: RequestContext, event_queue: EventQueue) -> None:
        if context.current_task:
            task = context.current_task
        else:
            task = new_task_from_user_message(context.message)
            await event_queue.enqueue_event(task)

        task_updater = TaskUpdater(event_queue=event_queue, task_id=task.id, context_id=task.context_id)
        await task_updater.update_status(
            state=TaskState.TASK_STATE_WORKING,
            message=new_text_message("Searching Wikipedia..."),
        )

        query = get_message_text(context.message)
        result = search_wikipedia(query)

        await task_updater.add_artifact(parts=[new_text_part(text=result)])
        await task_updater.update_status(state=TaskState.TASK_STATE_COMPLETED)

    async def cancel(self, context: RequestContext, event_queue: EventQueue) -> None:
        raise NotImplementedError


skill = AgentSkill(
    id="wikipedia_lookup",
    name="Wikipedia Lookup",
    description="Searches Wikipedia for a topic and returns the top result's title and snippet.",
    input_modes=["text/plain"],
    output_modes=["text/plain"],
    tags=["search", "wikipedia"],
    examples=["Model Context Protocol", "Ada Lovelace"],
)

agent_card = AgentCard(
    name="Wikipedia Agent",
    description="An agent that looks up topics on Wikipedia.",
    version="0.1.0",
    default_input_modes=["text/plain"],
    default_output_modes=["text/plain"],
    capabilities=AgentCapabilities(streaming=True),
    supported_interfaces=[
        AgentInterface(protocol_binding="JSONRPC", url="http://127.0.0.1:9002", protocol_version="1.0"),
    ],
    skills=[skill],
)

request_handler = DefaultRequestHandler(
    agent_executor=WikipediaAgentExecutor(),
    task_store=InMemoryTaskStore(),
    agent_card=agent_card,
)

routes = []
routes.extend(create_agent_card_routes(agent_card))
routes.extend(create_jsonrpc_routes(request_handler, "/"))

app = Starlette(routes=routes)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=9002)
