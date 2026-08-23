# A tiny A2A server. Same arithmetic logic as calculator_server.py from
# Chapter 2, but instead of exposing it as an MCP tool, this wraps it as an
# A2A agent: it publishes an Agent Card describing what it can do, and
# handles incoming tasks through an AgentExecutor instead of an MCP tool
# function.

import ast
import operator

import uvicorn
from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.routes import create_agent_card_routes, create_jsonrpc_routes
from a2a.server.tasks import InMemoryTaskStore, TaskUpdater
from a2a.helpers import get_message_text, new_task_from_user_message, new_text_message, new_text_part
from a2a.types import AgentCapabilities, AgentCard, AgentInterface, AgentSkill, TaskState
from starlette.applications import Starlette

ALLOWED_OPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
}


def eval_node(node):
    if isinstance(node, ast.Constant):
        return node.value
    if isinstance(node, ast.BinOp):
        return ALLOWED_OPS[type(node.op)](eval_node(node.left), eval_node(node.right))
    if isinstance(node, ast.UnaryOp):
        return ALLOWED_OPS[type(node.op)](eval_node(node.operand))
    raise ValueError("Unsupported expression")


class CalculatorAgentExecutor(AgentExecutor):
    # This is the A2A equivalent of an MCP tool function: it's what actually
    # runs when a task comes in. Every step here (create the task, report
    # "working", enqueue the result as an artifact, report "completed") is
    # part of the A2A task lifecycle, not something this agent invented.
    async def execute(self, context: RequestContext, event_queue: EventQueue) -> None:
        if context.current_task:
            task = context.current_task
        else:
            task = new_task_from_user_message(context.message)
            await event_queue.enqueue_event(task)

        task_updater = TaskUpdater(event_queue=event_queue, task_id=task.id, context_id=task.context_id)
        await task_updater.update_status(
            state=TaskState.TASK_STATE_WORKING,
            message=new_text_message("Evaluating expression..."),
        )

        expression = get_message_text(context.message)
        try:
            parsed = ast.parse(expression, mode="eval")
            result = str(eval_node(parsed.body))
        except Exception:
            result = f"Could not evaluate '{expression}' as an arithmetic expression."

        await task_updater.add_artifact(parts=[new_text_part(text=result)])
        await task_updater.update_status(state=TaskState.TASK_STATE_COMPLETED)

    async def cancel(self, context: RequestContext, event_queue: EventQueue) -> None:
        raise NotImplementedError


# The Agent Card is what a client discovers before ever sending a task, the
# A2A equivalent of MCP's "list_tools". It advertises one skill.
skill = AgentSkill(
    id="calculator",
    name="Calculator",
    description="Evaluates a basic arithmetic expression, e.g. '18 * 7 + 4', and returns the result.",
    input_modes=["text/plain"],
    output_modes=["text/plain"],
    tags=["math", "arithmetic"],
    examples=["23 * 19", "(4 + 6) / 2"],
)

agent_card = AgentCard(
    name="Calculator Agent",
    description="An agent that evaluates arithmetic expressions.",
    version="0.1.0",
    default_input_modes=["text/plain"],
    default_output_modes=["text/plain"],
    capabilities=AgentCapabilities(streaming=True),
    supported_interfaces=[
        AgentInterface(protocol_binding="JSONRPC", url="http://127.0.0.1:9001", protocol_version="1.0"),
    ],
    skills=[skill],
)

request_handler = DefaultRequestHandler(
    agent_executor=CalculatorAgentExecutor(),
    task_store=InMemoryTaskStore(),
    agent_card=agent_card,
)

routes = []
routes.extend(create_agent_card_routes(agent_card))
routes.extend(create_jsonrpc_routes(request_handler, "/"))

app = Starlette(routes=routes)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=9001)
