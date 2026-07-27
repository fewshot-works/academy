# Chapter 5 lab: a small tool-calling assistant with two real tools, a
# calculator and a Wikipedia search, that the model can choose to call.
#
# Chapter 4 showed a model choosing a tool but never running it. This lab
# closes that gap: when the model asks for a tool, we actually run it, hand
# the result back, and let the model use it to answer.
#
# Which provider this uses (Ollama, OpenAI, or Anthropic) is controlled by
# the PROVIDER variable in your .env file. See README.md for setup steps.

import json
import os
from dotenv import load_dotenv

load_dotenv()  # reads .env, makes PROVIDER (and any API keys) available below

provider = os.getenv("PROVIDER", "ollama")


# ============================================================
# The two real tools the assistant can call
# ============================================================

def calculator(expression):
    # Evaluates a basic arithmetic expression like "18 * 7 + 4". This is
    # deliberately NOT Python's eval() — the model's own text becomes the
    # input here, and eval() would happily run anything, not just math.
    # Walking a parsed syntax tree and only allowing a few operators keeps
    # this safe no matter what text the model sends.
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


def search_wikipedia(query):
    # Looks up a query on Wikipedia's free public search API (no API key
    # needed) and returns the top result's title and snippet. Wikipedia's
    # robot policy requires a descriptive User-Agent header, requests
    # without one get rejected with a 403.
    import html
    import requests

    response = requests.get(
        "https://en.wikipedia.org/w/api.php",
        params={"action": "query", "list": "search", "srsearch": query, "format": "json", "srlimit": 1},
        headers={"User-Agent": "zero-to-agent-tutorial (https://github.com/fewshot-works/zero-to-agent)"},
    )
    results = response.json()["query"]["search"]
    if not results:
        return "No Wikipedia results found."

    top = results[0]
    snippet = top["snippet"].replace('<span class="searchmatch">', "").replace("</span>", "")
    return html.unescape(f"{top['title']}: {snippet}")


TOOLS = {"calculator": calculator, "search_wikipedia": search_wikipedia}
MAX_STEPS = 5  # stop looping if the model keeps calling tools without ever answering


def call_tool(name, args):
    # The model doesn't always call a tool with arguments that actually work
    # (e.g. asking the calculator to evaluate plain English). Rather than
    # crashing, hand the error back as the tool's result so the model can see
    # what went wrong and try something else.
    try:
        return TOOLS[name](**args)
    except Exception as error:
        return f"Error: {error}"


def run_with_tools(question):
    # Sends the question to the model along with descriptions of both
    # tools, and keeps looping: if the model asks for a tool, run it for
    # real and hand the result back, until the model replies with a plain
    # text answer instead of another tool call.
    print(f"\nQuestion: {question}")

    if provider == "ollama":
        import requests

        tool_schemas = [
            {
                "type": "function",
                "function": {
                    "name": "calculator",
                    "description": "Evaluate a basic arithmetic expression, e.g. '18 * 7 + 4'.",
                    "parameters": {
                        "type": "object",
                        "properties": {"expression": {"type": "string"}},
                        "required": ["expression"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "search_wikipedia",
                    "description": "Search Wikipedia and return the top result's title and snippet.",
                    "parameters": {
                        "type": "object",
                        "properties": {"query": {"type": "string"}},
                        "required": ["query"],
                    },
                },
            },
        ]
        messages = [{"role": "user", "content": question}]

        for _ in range(MAX_STEPS):
            response = requests.post(
                "http://localhost:11434/api/chat",
                json={"model": "llama3.2", "messages": messages, "tools": tool_schemas, "stream": False},
            )
            message = response.json()["message"]
            messages.append(message)

            tool_calls = message.get("tool_calls")
            if not tool_calls:
                return message["content"]

            for call in tool_calls:
                name = call["function"]["name"]
                args = call["function"]["arguments"]
                print(f"  -> calling {name}({args})")
                result = call_tool(name, args)
                messages.append({"role": "tool", "content": result})

        return "(gave up after too many tool calls)"

    elif provider == "openai":
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        tool_schemas = [
            {
                "type": "function",
                "function": {
                    "name": "calculator",
                    "description": "Evaluate a basic arithmetic expression, e.g. '18 * 7 + 4'.",
                    "parameters": {
                        "type": "object",
                        "properties": {"expression": {"type": "string"}},
                        "required": ["expression"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "search_wikipedia",
                    "description": "Search Wikipedia and return the top result's title and snippet.",
                    "parameters": {
                        "type": "object",
                        "properties": {"query": {"type": "string"}},
                        "required": ["query"],
                    },
                },
            },
        ]
        messages = [{"role": "user", "content": question}]

        for _ in range(MAX_STEPS):
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                tools=tool_schemas,
            )
            message = response.choices[0].message
            messages.append(message.model_dump(exclude_unset=True))

            if not message.tool_calls:
                return message.content

            for call in message.tool_calls:
                name = call.function.name
                args = json.loads(call.function.arguments)
                print(f"  -> calling {name}({args})")
                result = call_tool(name, args)
                messages.append({"role": "tool", "tool_call_id": call.id, "content": result})

        return "(gave up after too many tool calls)"

    elif provider == "anthropic":
        import anthropic

        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        tool_schemas = [
            {
                "name": "calculator",
                "description": "Evaluate a basic arithmetic expression, e.g. '18 * 7 + 4'.",
                "input_schema": {
                    "type": "object",
                    "properties": {"expression": {"type": "string"}},
                    "required": ["expression"],
                },
            },
            {
                "name": "search_wikipedia",
                "description": "Search Wikipedia and return the top result's title and snippet.",
                "input_schema": {
                    "type": "object",
                    "properties": {"query": {"type": "string"}},
                    "required": ["query"],
                },
            },
        ]
        messages = [{"role": "user", "content": question}]

        for _ in range(MAX_STEPS):
            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=500,
                tools=tool_schemas,
                messages=messages,
            )
            messages.append({"role": "assistant", "content": response.content})

            tool_use_blocks = [block for block in response.content if block.type == "tool_use"]
            if not tool_use_blocks:
                text_blocks = [block.text for block in response.content if block.type == "text"]
                return " ".join(text_blocks)

            tool_results = []
            for block in tool_use_blocks:
                print(f"  -> calling {block.name}({block.input})")
                result = call_tool(block.name, block.input)
                tool_results.append({"type": "tool_result", "tool_use_id": block.id, "content": result})
            messages.append({"role": "user", "content": tool_results})

        return "(gave up after too many tool calls)"

    else:
        return f"Unknown provider '{provider}'. Set PROVIDER to ollama, openai, or anthropic in your .env"


# ============================================================
# Try it with a few different questions
# ============================================================

questions = [
    "What's 18 * 7 + 4?",
    "What year did construction of the Eiffel Tower finish?",
    "In one sentence, what's a good tip for staying focused while studying?",
    "What's 15% of 340, and what year did construction of the Eiffel Tower finish?",
]

for question in questions:
    answer = run_with_tools(question)
    print(f"Answer: {answer.strip()}")
