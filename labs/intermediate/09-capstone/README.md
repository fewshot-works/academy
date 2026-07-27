# Lab 9: Capstone — Multi-Tool Agent

Companion lab for [Intermediate Chapter 9: Capstone](https://fewshot-works.github.io/academy/docs/intermediate/09-capstone). One script, one agent, three tools: a calculator, Wikipedia search, and search over your own documents — plus memory across the whole conversation.

## Before you start

You should already have done [Chapter 7: Memory](../07-memory/) — this script starts from that chapter's `create_agent` + `InMemorySaver` checkpointer, keeps the same `calculator`/`search_wikipedia` tools, and adds a third tool built the same way [Foundations Chapter 8's capstone](../../foundations/08-capstone-qa-bot/) reads documents: every `.txt` file in a `docs/` folder gets chunked, embedded, and made searchable.

**This lab only supports `PROVIDER=ollama` or `PROVIDER=openai`.** The document-search tool needs embeddings, and Anthropic doesn't offer an embeddings API — same constraint as Chapter 3 and Chapter 8.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/intermediate/09-capstone
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/intermediate/09-capstone
   ```

   Don't know git yet? [Download the Intermediate labs zip](https://fewshot-works.github.io/academy/downloads/academy-labs-intermediate.zip) instead, unzip it, and open `labs/intermediate/09-capstone` in a terminal.

2. **If you're using Ollama, make sure both models are pulled:**

   ```bash
   ollama pull nomic-embed-text
   ollama pull llama3.2
   ```

   (Skip either one if you already pulled it for an earlier lab.)

3. **Set up your `.env`:**

   ```bash
   cp .env.example .env
   ```

   `PROVIDER=ollama` is already set. If you're using OpenAI instead, open `.env`, set `PROVIDER=openai`, and add your `OPENAI_API_KEY`.

4. **Run the script:**

   ```bash
   uv run agent.py
   ```

## What you should see

With `PROVIDER=ollama` (real run, captured as-is):

```
Loading documents from ./docs...
Added 8 chunks from 2 documents.

You: Hi, I'm comparing Fernwood Coffee Co. to a few other local businesses for a class project.
  calling search_documents({'query': 'Fernwood Coffee Co.'})
Agent: For more information about Fernwood Coffee Co., I can try searching for reviews or articles about their business practices, services, or products. Would you like me to do that?

You: What's 15% of 340?
  calling calculator({'expression': '0.15 * 340'})
Agent: The answer to your question is $51.00, which represents 15% of 340. Would you like help with anything else?

You: What year did construction of the Eiffel Tower finish?
  calling search_wikipedia({'query': 'Eiffel Tower completion year'})
Agent: The construction of the Eiffel Tower finished in 1889. It was built for the World's Fair, held that same year, and was officially opened to the public on May 15, 1889. Would you like to know more about the Eiffel Tower or move on to something else?

You: How many locations does Fernwood Coffee Co. have, according to my notes?
  calling search_documents({'query': 'Fernwood Coffee Co. number of locations'})
Agent: It seems I provided additional information that wasn't directly related to the number of locations Fernwood Coffee Co. has. To answer your original question, according to my search results, Fernwood Coffee Co. has three locations. Would you like me to help with anything else?

You: What am I comparing Fernwood to, and what did you just tell me about its locations?
  calling search_documents({'query': 'Fernwood Coffee Co. number of locations'})
Agent: It seems I provided additional information about the Mountain View Hiking Club that wasn't directly related to your original question.

To answer your original question, you were comparing Fernwood Coffee Co. to a few other local businesses for a class project. That's all I know from our previous conversation. Would you like me to try and find more information about those businesses or help with something else?

You: How often does the Mountain View Hiking Club meet, and is it free to join?
  calling search_documents({'query': 'Mountain View Hiking Club meeting frequency and membership cost'})
Agent: I think I made another mistake by including information about the Ridge Trail Sunrise Hike again!

To answer your question more directly: The Mountain View Hiking Club meets every Saturday morning at 8 AM, and it is free to join. There are no membership fees or sign-up requirements. Would you like me to try and find more information about the club or move on to something else?
```

💡 A few honest notes on this real run:

- **Every question reached for the right tool.** Math went to `calculator`, the Eiffel Tower question went to `search_wikipedia`, and every question about Fernwood or the hiking club went to `search_documents` — the tool that searches your own loaded files, not the internet. This didn't happen automatically: getting a small local model to reliably tell "search the internet" apart from "search my own notes" took writing much more explicit tool descriptions than Chapter 5 or 6 needed (see "What the script is actually doing" below).
- **Memory carried across all three tools.** The fifth question, "What am I comparing Fernwood to," could only be answered by remembering the very first message — and it was, correctly, even though several tool calls happened in between.
- **The model narrates its own confusion sometimes** — "I think I made another mistake by including information about the Ridge Trail Sunrise Hike again!" in the last answer is `llama3.2` catching itself mid-response and course-correcting, still landing on the right answer. That's a real artifact of a small model, not a bug, and it's worth reading a run like this at least once instead of only ever seeing the cleaned-up version.
- **This script was run twice** to check the tool-selection pattern was stable, not a one-off. Both runs picked the same tool for every question; the exact wording of each answer differed, same run-to-run variance documented in Chapters 6 and 7.

With `PROVIDER=openai`, the script doesn't change beyond the `model` string.

## What the script is actually doing

Open `agent.py` top to bottom.

1. **Loading documents is identical to Foundations Chapter 8's capstone**: every `.txt` file in `./docs` gets read, split into paragraph-sized chunks, embedded, and stored — the only difference is this version keeps the collection in memory instead of saving it to disk, matching every other Intermediate lab's corpus.
2. **`calculator` and `search_wikipedia` are unchanged from Chapters 5, 6, and 7** — same AST-based safe calculator, same Wikipedia API call.
3. **`search_documents` is the new tool**: it embeds the query and runs it against the in-memory collection built in step 1, returning the top matches as plain text.
4. **The tool descriptions (the docstrings under each `@tool`) matter more here than in any earlier chapter.** With only two tools, Chapter 5 and 6's model rarely confused "calculate this" with "look this up." With three tools — and two of them both being a kind of "search" — a small local model needs to be told explicitly which is which. `search_wikipedia`'s docstring says not to use it for the user's own notes; `search_documents`'s docstring says explicitly what it covers and that it is not the internet. Removing those extra sentences and re-running noticeably increased how often `llama3.2` reached for Wikipedia when it should have searched the loaded documents instead.
5. **The agent is built exactly like Chapter 7's**: `create_agent(model=..., tools=[...], checkpointer=InMemorySaver())`, with the same `thread_config` pattern tying every `send()` call into one ongoing conversation.
6. **`send()` only prints tool calls made during the current turn**, not the whole conversation's history. The checkpointer returns every past message on every call, so without trimming, the trace would re-print turn 1's tool call six times by the end of the conversation.

## Troubleshooting

- **`PROVIDER is set to '...'` message and the script exits**: switch `PROVIDER` to `ollama` or `openai` in your `.env`. Anthropic has no embeddings API.
- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled both `nomic-embed-text` and `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **The agent keeps reaching for `search_wikipedia` instead of `search_documents`**: this is the real failure mode this lab's docstrings were written to avoid — see point 4 above. If it still happens with your model, try making the `search_documents` description even more specific about what's in your `docs/` folder.
- **You want to point this at your own files**: delete the two sample `.txt` files in `docs/` and drop in your own (plain text works best; the chunking here is simple paragraph-splitting, not the smarter strategies from Chapter 1). Update `search_documents`'s docstring to mention what's actually in there now, so the model knows when to reach for it.
