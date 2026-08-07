import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "In calculator_server.py, what does the @mcp.tool() decorator actually do with the function underneath it?",
    options: [
      'It runs the function immediately and caches the result',
      "It reads the function's type hints and docstring to build the schema an MCP client sees when it asks the server what it offers, then registers the function to run when that tool is called",
      'It converts the function into a REST API endpoint',
      'It requires the function to be rewritten as a class method',
    ],
    correctIndex: 1,
    explanation:
      "FastMCP builds the tool's schema (name, description, argument types) straight from the function's type hints and docstring, no schema written by hand, and wires the function itself to run when a client calls that tool.",
  },
  {
    question:
      "The lab never runs `python calculator_server.py` directly. How does the server actually get started?",
    options: [
      'It runs automatically when the computer boots',
      "agent_with_server.py's MultiServerMCPClient starts it as a subprocess (via `uv run calculator_server.py`) and talks to it over stdio, the same pattern Chapter 1 used for mcp-server-fetch",
      "It's deployed to a cloud server before the lab starts",
      'FastMCP starts it the first time any Python file in the folder is imported',
    ],
    correctIndex: 1,
    explanation:
      "mcp_servers in agent_with_server.py describes the same command-plus-args shape Chapter 1 used for an off-the-shelf server. From the client's side, a server you wrote yourself and one someone else published work identically.",
  },
  {
    question:
      "When the calculator tool is called with an expression that isn't valid math, what actually happens, given that calculator_server.py has no try/except around the arithmetic logic?",
    options: [
      'The server process crashes and has to be restarted',
      'FastMCP catches the exception itself and returns an error result to the caller, the same "tell the caller what went wrong instead of crashing" behavior Intermediate Chapter 5 wrote by hand, here built into the framework',
      'The request silently returns no result at all',
      'The server automatically fixes the invalid expression',
    ],
    correctIndex: 1,
    explanation:
      "FastMCP wraps tool calls so an exception becomes an error result handed back to the caller, not a crash. Chapter 5 wrote that same safety net by hand with a try/except; here it comes from the framework.",
  },
  {
    question:
      "The chapter's bonus section describes exposing a Langflow flow as an MCP server. What role does that Langflow server play, compared to calculator_server.py?",
    options: [
      "It replaces the agent entirely, no client is needed",
      "It's the same role: a server that answers 'what do you offer?' over MCP, generated from a visual flow (via a project's Settings -> MCP Server toggle) instead of Python's @mcp.tool()",
      'It can only be used by other Langflow projects, not by agent_with_server.py',
      'It requires rewriting the calculator logic in Python first',
    ],
    correctIndex: 1,
    explanation:
      "Langflow's MCP Server toggle exposes a project's flows as MCP tools the same way calculator_server.py exposes calculator(), just generated from a visual flow instead of a decorated function. Any MCP client, including this lab's agent, could connect to either one the same way.",
  },
];
