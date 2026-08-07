# Lab 4: Transports & Deployment

Companion lab for [MCP Chapter 4: Transports & Deployment](https://fewshotacademy.com/docs/mcp/transports-and-deployment). Every server in Chapters 1-3 ran over stdio, started by the client as a subprocess. This lab runs the same calculator tool over HTTP instead, started on its own, in its own terminal, the way a server on a different machine would run.

## Before you start

You should already have done [Chapter 2](../02-building-your-own-mcp-server/) — this lab's calculator tool is the same one, just started differently.

This lab needs **two terminals**, one for the server, one for the client. It's chat-only, so it supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder (in both terminals).**

   ```bash
   cd academy/labs/mcp/04-transports-and-deployment
   ```

2. **If you're using Ollama, make sure the model is pulled:**

   ```bash
   ollama pull llama3.2
   ```

3. **Set up your `.env` (in either terminal, it's shared):**

   ```bash
   cp .env.example .env
   ```

   `PROVIDER=ollama` is already set. If you're using OpenAI or Anthropic instead, open `.env`, set `PROVIDER` accordingly, and add the matching API key.

4. **In terminal 1, start the server and leave it running:**

   ```bash
   uv run calculator_http_server.py
   ```

   You'll see `Uvicorn running on http://127.0.0.1:8000`. Unlike every earlier chapter, nothing else starts this process for you, it runs until you stop it with `Ctrl+C`.

5. **In terminal 2, run the client:**

   ```bash
   uv run http_client_agent.py
   ```

## What you should see

In terminal 2, with `PROVIDER=ollama`:

```
Tools from the HTTP server: ['calculator']

Question: Use the calculator tool to figure out 23 * 19.
  -> calling calculator({'expression': '23 * 19'})
Answer: The result of 23 multiplied by 19 is 437.
```

Terminal 1 logs each request it handles (`INFO: 127.0.0.1:... "POST /mcp HTTP/1.1" 200 OK`), that's expected, it's the server doing its job.

When you're done, stop the server in terminal 1 with `Ctrl+C`.

## What changed, and what didn't

`http_client_agent.py`'s `mcp_servers` entry looks different from every earlier chapter:

```python
mcp_servers = {
    "calculator": {
        "url": "http://127.0.0.1:8000/mcp",
        "transport": "streamable_http",
    }
}
```

No `command`, no `args`, just a `url`. Earlier chapters' `"command": "uv", "args": ["run", "calculator_server.py"]` told the client how to *start* a server. This tells it where to *find* one that's already running. Swap `127.0.0.1` for a real hostname and this same client code would talk to a server on another machine entirely, no other change required.

What didn't change: `calculator_http_server.py`'s tool logic is identical to Chapter 2's `calculator_server.py`, and `client.get_tools()` on the client side works exactly the same way. Only the transport, how bytes get from client to server, is different. The rest of MCP, schemas, tool calls, results, doesn't know or care which one it's running over.

## Troubleshooting

- **Client can't connect / `ConnectionRefusedError`**: make sure terminal 1's server is still running and shows `Uvicorn running on http://127.0.0.1:8000`. The client doesn't start it for you in this chapter.
- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama itself is running (`ollama serve`), separate from the MCP server, and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **Port 8000 already in use**: another process is using it. Either stop that process, or change `port=8000` in `calculator_http_server.py` and the `url` in `http_client_agent.py` to match.
