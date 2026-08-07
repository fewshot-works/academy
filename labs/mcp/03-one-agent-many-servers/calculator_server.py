# Chapter 3 lab: same calculator server from Chapter 2, reused here so this
# folder is self-contained. Nothing about it changes -- the point of this
# chapter is that a client can talk to it alongside a second, unrelated
# server without either server knowing the other exists.
#
# This file is never run as "python calculator_server.py". It's started as
# a subprocess by multi_server_agent.py -- see that file, and README.md.

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("calculator")


@mcp.tool()
def calculator(expression: str) -> str:
    """Evaluate a basic arithmetic expression, e.g. '18 * 7 + 4'."""
    # Deliberately NOT Python's eval() -- the caller's text becomes an
    # input here, and eval() would happily run anything, not just math.
    # Walking the parsed syntax tree and only allowing a few operators
    # keeps this safe no matter what text a client sends.
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
