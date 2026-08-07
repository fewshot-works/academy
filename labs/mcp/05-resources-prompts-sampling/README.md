# Lab 5: Resources, Prompts & Sampling

Companion lab for [MCP Chapter 5: Resources, Prompts & Sampling](https://fewshotacademy.com/docs/mcp/resources-prompts-sampling). Every earlier chapter's server offered tools. This one offers a **resource** (content to read) and a **prompt** (a reusable template), MCP's other two primitives.

## Before you start

You should already have done [Chapter 2](../02-building-your-own-mcp-server/) — this lab's server pattern (FastMCP, a client that starts it as a subprocess) is the same, just with new decorators.

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder.**

   ```bash
   cd academy/labs/mcp/05-resources-prompts-sampling
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
   uv run resources_and_prompts_agent.py
   ```

## What you should see

With `PROVIDER=ollama`:

```
Resource content:
  add (+), subtract (-), multiply (*), divide (/), power (**), and negation (-x).

Prompt template filled in: In one plain-English sentence, explain why 12 * 7 equals 84.

Model's explanation: When you multiply 12 by 7, you're essentially adding 7 together 12 times, which comes out to 84.
```

You may also see an `IncompleteFieldDefinitionWarning` from `pydantic_settings` in the terminal, it's a warning from a dependency's internals, not this lab's code, and it's safe to ignore.

## What the script is actually doing

`docs_server.py` defines two things neither Chapter 2 nor 3's servers had:

- **`@mcp.resource("calculator://supported-operations")`** turns a function into a piece of content a client can read, addressed by that URI, the same idea as a URL identifying a page. It doesn't take arguments or get "called" mid-conversation, a client just asks for it and gets the text back.
- **`@mcp.prompt()`** turns a function into a reusable template. `explain_answer(expression, answer)` takes two arguments and returns a filled-in string, the server never runs a model itself, it just hands back text this script's own agent can send to whichever model it's using.

On the client side, `client.get_resources("docs")` reads the resource, `client.get_prompt("docs", "explain_answer", arguments={...})` fills in the template. Neither one goes through `create_agent`'s tool-calling loop the way Chapters 1-3's tools did, this script calls them directly, then decides what to do with the result. Here, that's handing the filled-in prompt to a plain agent with no tools, just to get an explanation back.

## A primitive this lab doesn't cover: sampling

MCP has a third capability beyond tools, resources, and prompts, called **sampling**: a server can ask the *client's* model to generate something, reversing the usual direction. The official Python SDK supports it at the `ClientSession` level (`sampling_callback`), but `langchain-mcp-adapters`, the wrapper every lab in this track uses, doesn't expose it as of this writing. Building a sampling-capable client means dropping to the raw MCP SDK instead of `MultiServerMCPClient`, out of scope for this lab, but worth knowing exists.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **`IncompleteFieldDefinitionWarning` in the output**: a warning from `pydantic_settings`, a dependency's dependency. Not related to this lab's code, safe to ignore.
