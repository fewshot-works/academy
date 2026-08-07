# The trusted server in this chapter's lab, unchanged from Chapter 2. It's
# here so the lab has at least one server the agent has good reason to
# trust, next to one it shouldn't.

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("calculator")


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
    mcp.run()
