# Chapter 4 lab: the same calculator tool from Chapters 2 and 3, exposed
# over a different transport. Every other chapter's server runs over
# stdio -- the client starts it as a subprocess and talks to it over its
# stdin/stdout. This one runs as a standalone HTTP server instead: you
# start it yourself, in its own terminal, and it keeps running on its own,
# the same way a server on a different machine would.
#
# Run this directly and leave it running:
#   uv run calculator_http_server.py
# Then, in a second terminal, run http_client_agent.py to connect to it.

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("calculator", host="127.0.0.1", port=8000)


@mcp.tool()
def calculator(expression: str) -> str:
    """Evaluate a basic arithmetic expression, e.g. '18 * 7 + 4'."""
    import ast
    import operator

    allowed_ops = {
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
            return allowed_ops[type(node.op)](eval_node(node.left), eval_node(node.right))
        if isinstance(node, ast.UnaryOp):
            return allowed_ops[type(node.op)](eval_node(node.operand))
        raise ValueError(f"Unsupported expression: {expression}")

    parsed = ast.parse(expression, mode="eval")
    return str(eval_node(parsed.body))


if __name__ == "__main__":
    # "streamable-http" is the transport MCP recommends for anything that
    # isn't a local subprocess -- it's what a remote or containerized
    # server would use. This starts listening on http://127.0.0.1:8000/mcp.
    mcp.run(transport="streamable-http")
