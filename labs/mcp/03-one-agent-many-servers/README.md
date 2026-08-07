# Lab 3: One Agent, Many Servers

Companion lab for [MCP Chapter 3: One Agent, Many Servers](https://fewshotacademy.com/docs/mcp/one-agent-many-servers). Chapters 1 and 2 each connected an agent to a single MCP server. This lab connects one agent to *both* at once, `mcp-server-fetch` and this project's own `calculator_server.py`, and asks two questions to see which server's tool the agent reaches for.

## Before you start

You should already have done [Chapter 1](../01-what-is-mcp/) and [Chapter 2](../02-building-your-own-mcp-server/) — this lab reuses both servers unchanged, just in one `mcp_servers` dict instead of two separate ones.

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder.**

   ```bash
   cd academy/labs/mcp/03-one-agent-many-servers
   ```

2. **If you're using Ollama, make sure the model is pulled:**

   ```bash
   ollama pull llama3.2
   ```

3. **Set up your `.env`:**

   ```bash
   cp .env.example .env
   ```

   On Windows Command Prompt, `cp` isn't a built-in command, use `copy` instead:

   ```cmd
   copy .env.example .env
   ```

   `PROVIDER=ollama` is already set. If you're using OpenAI or Anthropic instead, open `.env`, set `PROVIDER` accordingly, and add the matching API key.

4. **Run the agent script:**

   ```bash
   uv run multi_server_agent.py
   ```

   Both servers start as subprocesses, `mcp-server-fetch` via `uvx`, `calculator_server.py` via `uv run`, exactly as in Chapters 1 and 2. Neither one knows the other is running.

## What you should see

With `PROVIDER=ollama`:

```
Tools from both servers: ['fetch', 'calculator']

Question: Use the calculator tool to figure out 12% of 850.
  -> calling calculator({'expression': '0.12 * 850'})
Answer: The answer to the user's question is: 102.0

Question: What is the page at https://example.com about? Answer in one sentence.
  -> calling fetch({'url': 'https://example.com'})
Answer: The webpage at https://example.com is a documentation example domain...
```

## An honest surprise: routing isn't automatic

The first version of this lab just asked `"What's 12% of 850?"`, no mention of "calculator." With `llama3.2`, that consistently picked `fetch` instead, searching Google or Wolfram Alpha for the answer rather than using the calculator tool sitting right next to it, and got the math wrong about half the time (`90` instead of `102`).

That's not a bug in either server. Both correctly told the agent what they offer; the model just judged "search the web" as more likely to answer a percentage question than "call a tool named `calculator`." Adding two words, "use the calculator tool," fixed it every time in testing. Larger models (`gpt-4o-mini`, Claude) route correctly from the vague phrasing too, this is specifically a smaller-model quirk. It's worth trying the original phrasing yourself once, to see the misrouting firsthand, before moving on.

## What the script is actually doing

`multi_server_agent.py` is nearly identical to Chapters 1 and 2's client scripts, with one difference: `mcp_servers` has two entries instead of one, `fetch` and `calculator`. `MultiServerMCPClient(mcp_servers)` starts both subprocesses and asks each "what do you offer?", then `client.get_tools()` hands back one combined list, tagged by name only. The agent that receives that list has no idea, and doesn't need to know, that the tools came from two unrelated programs.

The two questions are picked to exercise each server once: the first only `calculator` can answer, the second only `fetch` can. In a real multi-server setup, the agent picks per question, same as it picks between any two tools.

## Bonus: Langflow as the client

Chapter 2's bonus had Langflow play the *server* role, exposing a flow as an MCP server. Langflow can also play the *client* role, this lab's role: an **MCP Tools** component in a flow can point at any external MCP server, `mcp-server-fetch` included, and the flow's agent gets that server's tools the same way `multi_server_agent.py` does with `client.get_tools()`. Add two **MCP Tools** components pointed at different servers to a single flow, and you have the no-code version of this lab: one agent, two servers, no Python.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **The agent calls `fetch` for the math question**: see "An honest surprise" above, this is a real small-model routing quirk, not a broken lab.
- **`ImportError: cannot import name 'McpError'`**: same version-skew bug covered in Chapter 1, already worked around by the `--with "mcp<2.0.0"` pin in `mcp_servers["fetch"]["args"]`. If you see it anyway, `uv cache clean` and try again.
