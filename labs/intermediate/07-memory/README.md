# Lab 7: Memory

Companion lab for [Intermediate Chapter 7: Memory](https://fewshot-works.github.io/academy/docs/intermediate/07-memory). Two scripts, the exact same six-turn conversation, run through `create_agent` two different ways: one that remembers everything, word for word, and one that periodically summarizes the older parts to keep the conversation from growing forever.

## Before you start

You should already have done [Chapter 6: Your First Agent](../06-your-first-agent/) — both scripts here start from that chapter's `create_agent` call and its same `calculator`/`search_wikipedia` tools, then add memory on top.

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/intermediate/07-memory
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/intermediate/07-memory
   ```

   Don't know git yet? [Download the Intermediate labs zip](https://fewshot-works.github.io/academy/downloads/academy-labs-intermediate.zip) instead, unzip it, and open `labs/intermediate/07-memory` in a terminal.

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

4. **Run both scripts:**

   ```bash
   uv run chat_short_term.py
   uv run chat_summarized.py
   ```

Both run the identical scripted conversation: a first message stating a name and a project, a few unrelated questions in between, and a final question that can only be answered correctly if that first message is still remembered.

## What you should see

With `PROVIDER=ollama`, `chat_short_term.py`:

```
You: Hi, my name is Priya and I'm building a birdwatching app.
Agent: Hi Priya, it seems like you're looking for information on how birdwatching can impact birds and their habitats. [...]
  (thread now holds 4 messages)

You: What's a good name for a database table that stores bird species?
Agent: For your birdwatching app's database, I would suggest naming the table that stores bird species something like "bird_species" or "ornithological_records". [...]
  (thread now holds 8 messages)

You: What's 12 * 8?
Agent: The result of the calculation is 96. Let me know if you have any other questions or need help with anything else!
  (thread now holds 12 messages)

You: What year did construction of the Eiffel Tower finish?
Agent: The construction of the Eiffel Tower finished in 1889. It was built for the World's Fair, held that year in Paris, and was officially opened on March 31, 1889. [...]
  (thread now holds 16 messages)

You: Any tips for staying motivated on a side project?
Agent: Staying motivated on a side project can be challenging, but here are some tips that might help: [...]
  (thread now holds 20 messages)

You: What's my name, and what am I building?
Agent: You're Priya, and you're building a birdwatching app! I remember that earlier. How can I assist you with your project?
  (thread now holds 24 messages)
```

And `chat_summarized.py`, same six questions:

```
You: Hi, my name is Priya and I'm building a birdwatching app.
Agent: Hi Priya, it seems like you're looking for ways to create a responsible and enjoyable birdwatching experience for both users and birds. [...]
  (thread now holds 4 messages)

You: What's a good name for a database table that stores bird species?
Agent: It seems like you're looking for some inspiration on naming your database table. [...]
  (thread now holds 6 messages)

You: What's 12 * 8?
Agent: The answer to the math problem is 96. This calculation can be useful in various aspects of your birdwatching app [...]
  (thread now holds 6 messages)

You: What year did construction of the Eiffel Tower finish?
Agent: Gustave Eiffel, who designed and built the tower. The construction of the Eiffel Tower was completed in 1889. [...]
  (thread now holds 6 messages)

You: Any tips for staying motivated on a side project?
Agent: It looks like I found some relevant information on staying motivated for your side project. [...]
  (thread now holds 6 messages)

You: What's my name, and what am I building?
Agent: It seems like I found some relevant information on your project. To answer your question, Priya is building a birdwatching app with features such as user profiles, species identification, location tracking, and community features.
  (thread now holds 6 messages)
```

💡 A few honest notes on these real runs:

- **One transcript above gets a date wrong.** The `chat_short_term.py` run says the tower "was officially opened on March 31, 1889" — that's actually the *completion* date; the public opening was May 15, 1889. Left in as captured, not corrected, because it's a genuine reminder that a small local model can misstate a well-known fact even when it gets the headline answer (1889) right.
- **The message count tells the whole story.** `chat_short_term.py`'s thread grows every single turn: 4, 8, 12, 16, 20, 24. `chat_summarized.py`'s grows once, to 6, then stays at 6 for the rest of the conversation. Same six questions, same tools, same model, one script's memory keeps growing and the other doesn't.
- **Both correctly answer the final recall question.** Even after `chat_summarized.py` collapsed the earlier turns into a summary, it still knew the name and project from turn one. That's the point of *summarizing* instead of just deleting old messages: the detail survives, compressed, instead of being thrown away.
- **The summarization trigger here (`trigger=("tokens", 300)`) is set artificially low on purpose**, so this short, six-turn toy conversation actually crosses it and you get to see a real summarization event. A production app would set this much higher, in the thousands of tokens, so summarization only kicks in on genuinely long conversations, not every couple of turns.
- **The summarized version is occasionally a little rougher around the edges** — notice the "Gustave Eiffel, who designed and built the tower." fragment tacked onto the Eiffel Tower answer above, a small leftover from the model working off a compressed summary instead of the full original exchange. That's a real, small cost of compression, not a bug to fix.
- **Neither script's trace shows explicit tool calls this run** — the model answered `12 * 8` and the Eiffel Tower question directly instead of calling `calculator` or `search_wikipedia`, and still got both right. Same lesson as Chapters 5 and 6: whether the model reaches for a tool is its own decision, not something memory changes.

With `PROVIDER=openai` or `PROVIDER=anthropic`, neither script changes beyond the `model` string.

## What the scripts are actually doing

Open `chat_short_term.py` and `chat_summarized.py` side by side.

1. **Same two tools, same `create_agent` call as Chapter 6**, plus one new argument: `checkpointer=InMemorySaver()`. The checkpointer is what actually gives the agent memory — without it, every `agent.invoke()` call would still start from a blank slate, exactly like Chapter 5 and 6.
2. **`thread_config = {"configurable": {"thread_id": "conversation-1"}}`**, passed into every `agent.invoke()` call. The `thread_id` is what ties separate `invoke()` calls into one ongoing conversation — the checkpointer stores and retrieves each thread's messages by this ID. A different `thread_id` would start a completely separate, memory-less conversation.
3. **`chat_summarized.py` adds one more argument**: `middleware=[SummarizationMiddleware(model=model, trigger=("tokens", 300), keep=("messages", 4))]`. Once the thread's token count crosses `trigger`, the middleware automatically replaces the older messages with a summary, keeping roughly the last `keep` messages intact alongside it.
4. **`send(message)`** in both scripts does the same thing: call `agent.invoke()` with the new message and the thread config, print the answer, and print how many messages the thread now holds — that count is what makes the "grows vs. stays bounded" difference visible.
5. **The same six-message scripted conversation** runs through `send()` in both scripts, ending in a question that can only be answered correctly if the first message is still remembered in some form.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **`ImportError` mentioning `langgraph`**: `InMemorySaver` and `SummarizationMiddleware` come from `langgraph`/`langchain`, not a separate install; `uv run` should install everything automatically from `pyproject.toml`.
- **`chat_summarized.py`'s answers seem a little off after a summary happens**: that's real, expected behavior, not a bug — the model is now working from a compressed summary instead of the original exchange, and compression is lossy by nature.
- **You want to see the actual summary text**: the middleware replaces old messages with a new one in the thread; you can inspect `result["messages"]` yourself in a Python shell to see exactly what it wrote.
