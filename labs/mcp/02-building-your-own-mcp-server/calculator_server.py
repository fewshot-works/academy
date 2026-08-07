# Chapter 2 lab, part 1: the same calculator from Intermediate Chapter 5 and
# 6, this time exposed as its own MCP server instead of being wired directly
# into one agent's code.
#
# FastMCP (part of the official MCP Python SDK) turns a plain Python
# function into an MCP tool: the @mcp.tool() decorator reads the function's
# type hints and docstring to build the schema a client will see, and
# mcp.run() starts listening for MCP messages on stdin/stdout.
#
# This file is never run directly with "python". It's started as a
# subprocess by agent_with_server.py -- see that file, and the README.

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("calculator")


@mcp.tool()
def calculator(expression: str) -> str:
    """Evaluate a basic arithmetic expression, e.g. '18 * 7 + 4'."""
    # Deliberately NOT Python's eval() -- the caller's text becomes the
    # input here, and eval() would happily run anything, not just math.
    # Walking a parsed syntax tree and only allowing a few operators keeps
    # this safe no matter what text a client sends.
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
    mcp.run()
