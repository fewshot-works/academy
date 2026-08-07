# Chapter 5 lab: an MCP server that offers a resource and a prompt,
# nothing a client "calls" the way it calls a tool. A resource is
# something a client reads, a prompt is a reusable template a client
# fills in and sends to its own model. Both are read-only from the
# server's point of view.
#
# This file is never run as "python docs_server.py" directly, it's
# started as a subprocess by resources_and_prompts_agent.py, same as
# every earlier chapter's server.

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("calculator-docs")


@mcp.resource("calculator://supported-operations")
def supported_operations() -> str:
    """The arithmetic operations the calculator tool (from Chapter 2) supports."""
    return "add (+), subtract (-), multiply (*), divide (/), power (**), and negation (-x)."


@mcp.prompt()
def explain_answer(expression: str, answer: str) -> str:
    """A reusable template for asking a model to explain a calculator result in plain English."""
    return f"In one plain-English sentence, explain why {expression} equals {answer}."


if __name__ == "__main__":
    mcp.run()
