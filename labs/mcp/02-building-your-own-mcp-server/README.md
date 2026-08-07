# Lab 2: Building Your Own MCP Server

Companion lab for [MCP Chapter 2: Building Your Own MCP Server](https://fewshotacademy.com/docs/mcp/building-your-own-mcp-server). Chapter 1 connected an agent to a server someone else built. This lab flips that: it wraps the calculator tool from Intermediate Chapters 5 and 6 as your own MCP server, then connects an agent to it, the same way Chapter 1 connected to `mcp-server-fetch`.

## Before you start

You should already have done [Chapter 1: What Is MCP](../01-what-is-mcp/), this lab reuses its `MultiServerMCPClient` + `create_agent` pattern, just pointed at a server this project wrote instead of an off-the-shelf one.

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder.**

   ```bash
   cd academy/labs/mcp/02-building-your-own-mcp-server
   ```

2. **If you're using Ollama, make sure the model is pulled:**

   ```bash
   ollama pull llama3.2
   ```

3. **Set up your `.env`:**

   ```bash
   cp .env.example .env
   ```

   `PROVIDER=ollama` is already set. If you're using OpenAI or Anthropic instead, open `.env`, set `PROVIDER` accordingly, and add the matching API key.

4. **Run the agent script:**

   ```bash
   uv run agent_with_server.py
   ```

   You don't run `calculator_server.py` yourself, `agent_with_server.py` starts it as a subprocess (with `uv run calculator_server.py` under the hood) every time it runs, and shuts it down when it's done.

## What you should see

With `PROVIDER=ollama`:

```
Tools our own server offers: ['calculator']

Question: What's 15% of 340?
  -> calling calculator({'expression': '0.15 * 340'})
Answer: The answer to the question is: 51.0
```

You'll also see a couple of lines like `Processing request of type ListToolsRequest` mixed into the output, that's FastMCP's own server-side logging, printed by the subprocess as it handles the client's requests. It's expected, not an error.

## What the scripts are actually doing

**`calculator_server.py`** is the server. Open it and compare it to Intermediate Chapter 5's `calculator()`, the arithmetic logic (parse with `ast`, walk the tree, allow only a few operators) is identical, that part of the lesson hasn't changed. What's new:

1. **`FastMCP("calculator")`** creates a server instance. The name is just a label other tools can show a person.
2. **`@mcp.tool()`** turns the plain function below it into an MCP tool. FastMCP reads the function's type hints (`expression: str`) and docstring to build the schema a client will see when it asks "what do you offer?", you don't write that schema by hand.
3. **`mcp.run()`** starts the server listening on stdin/stdout for MCP messages. This only happens when the file is run directly (`if __name__ == "__main__"`), which is exactly what `agent_with_server.py` does when it starts this file as a subprocess.

**`agent_with_server.py`** is the client and host, essentially identical to Chapter 1's `fetch_agent.py`, just with `mcp_servers` pointed at `["run", "calculator_server.py"]` instead of `mcp-server-fetch`. From the client's point of view, there's no difference between a server you wrote an hour ago and one a stranger published years ago, both just answer "what do you offer?" the same way.

## Bonus: build the server without code, in Langflow

Langflow can turn a flow into an MCP server itself, no Python required. Open your Langflow project, build a small flow with a **Calculator** component (or reuse one from an earlier chapter's flow), then open that project's **Settings → MCP Server** tab. Toggling it on exposes every flow in that project as an MCP tool, over a URL any MCP client can connect to, the same role `calculator_server.py` plays here, generated from a visual flow instead of `@mcp.tool()`.

Point `agent_with_server.py` at it and you'd see the same shape of run: `client.get_tools()` would list the Langflow-generated tool by name, and the agent would call it the same way. This lab keeps the code version since the rest of the track builds on writing your own server, but it's worth seeing that the concept, a program that answers "what do you offer?" over MCP, doesn't require code at all.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **Nothing happens for a few seconds on first run**: `uv run calculator_server.py` (started as a subprocess) has to create its own virtual environment and install `mcp` the first time. Subsequent runs start instantly.
- **The model calls `calculator` with an expression that isn't math**: unlike Intermediate Chapter 5's hand-written loop, this server's tool has no `try/except` around the arithmetic logic at all, and it doesn't need one. FastMCP catches the exception itself and hands the agent an error result like `"Error executing tool calculator: <class 'ast.Not'>"`, the same "tell the model what went wrong instead of crashing" behavior Chapter 5 wrote by hand, here for free.
