# Lab 2: Advanced RAG

Companion lab for [Advanced Chapter 2: Advanced RAG](https://fewshot-works.github.io/academy/docs/advanced/02-advanced-rag). Four techniques, query rewriting, HyDE, multi-hop retrieval, and self-correcting retrieval, run against the same tricky twelve-fact coffee shop corpus from Intermediate Chapter 3.

## Before you start

You should already have done Intermediate [Chapter 3: Better Retrieval](../../intermediate/03-better-retrieval/) — this lab reuses that lab's exact corpus (Fernwood Coffee Co., Harbor Bean Roasters, Whistlepost Coffee) and its `embed()`/`ask()` pattern.

**This lab only supports `PROVIDER=ollama` or `PROVIDER=openai`.** It needs one provider that can do both embeddings and chat, and Anthropic doesn't offer an embeddings API.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/advanced/02-advanced-rag
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/advanced/02-advanced-rag
   ```

2. **If you're using Ollama, make sure both models are pulled:**

   ```bash
   ollama pull nomic-embed-text
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

   If you're using Ollama, `PROVIDER=ollama` is already set, leave it as-is. If you're using OpenAI, open `.env` and set `PROVIDER=openai`, then add your `OPENAI_API_KEY`.

4. **Run the script:**

   ```bash
   uv run advanced_rag.py
   ```

## What you should see

With `PROVIDER=ollama`:

```
A. Query rewriting
  Original question: wheres harbor bean get its beans
  Retrieved on the original question: [Fernwood] Fernwood Coffee Co. sources its coffee beans from three small farms, one in Ethi...
  Rewritten query: "Sourcing and origin of beans for Harbor Beans"
  Retrieved on the rewritten query:   [Fernwood] Fernwood Coffee Co. sources its coffee beans from three small farms, one in Ethi...

B. HyDE
  Question: Which shop's beans travel through the fewest middlemen before reaching the shop?
  Retrieved on the question directly: [Harbor Bean] Harbor Bean Roasters buys its beans through a single import broker rather than d...
  Hypothetical answer: Our company uses a direct-to-consumer distribution model for our specialty coffee beans, allowing them to bypass traditional wholesalers and retailers and reach customers at every touchpoint along the supply chain.
  Retrieved on the hypothetical answer: [Fernwood] Fernwood Coffee Co. sources its coffee beans from three small farms, one in Ethi...

C. Multi-hop retrieval
  Question: Does the coffee shop that opened inside a converted railway signal box have a loyalty program?
  Hop 1 (identify the company): [Whistlepost] Whistlepost Coffee has a single flagship location inside a converted railway sig...
  Hop 2 (look up Whistlepost's loyalty program): [Whistlepost] Whistlepost Coffee doesn't run a loyalty program at all, choosing instead to kee...

D. Self-correcting retrieval
  Question: How many purchases before Fernwood gives you a free drink?
  Attempt 1, retrieved: [Harbor Bean] Harbor Bean Roasters' loyalty program gives customers a free drink after every e...
    Grade: NO
    Retrying with: How many purchases before Fernwood gives you a free drink?
  Attempt 2, retrieved: [Harbor Bean] Harbor Bean Roasters' loyalty program gives customers a free drink after every e...
    Grade: NO
  Final answer: [Harbor Bean] Harbor Bean Roasters' loyalty program gives customers a free drink after every eight purchases, tracked through an app rather than a physical card.
```

💡 A few honest notes on this real run, only two of the four approaches actually fix anything:

- **A (query rewriting) doesn't fix it.** Both the vague original question and the LLM's rewritten, clearer version retrieve Fernwood's sourcing fact instead of Harbor Bean's, the same embedding bias Intermediate Chapter 3 found, just on a different topic. Rewriting cleans up vague phrasing; it doesn't touch a baked-in embedding preference.
- **B (HyDE) works.** The direct question retrieves the wrong (and actually opposite-meaning) fact. Generating a hypothetical answer first and embedding that lands correctly on Fernwood.
- **C (multi-hop) works cleanly**, both hops land on the right document every time this was run.
- **D (self-correction) catches the problem but can't fix it.** The grader correctly says "NO" twice, but the rewrite step returns the question completely unchanged on retry, so the second attempt is really just repeating the first. The loop runs out of retries and honestly reports the wrong answer.

Run the script a few times yourself, Approach D's rewrite step in particular is inconsistent, sometimes it produces a genuinely different (but still unhelpful) query, sometimes an identical one. That inconsistency is real `llama3.2` behavior, not a bug in the lab.

With `PROVIDER=openai`, the script doesn't change beyond the `embed()`/`ask()` provider branches, and you'll likely see cleaner, more consistent rewrites, though not necessarily different final results, the embedding bias in Approach A and D is a property of the corpus and embedding model, not the chat model doing the rewriting.

## What the script is actually doing

Open `advanced_rag.py`.

1. **The same twelve-document corpus** from Intermediate Chapter 3, embedded into an in-memory ChromaDB collection, tagged with `company` metadata.
2. **`retrieve(query_embedding, n_results, where)`** is a small wrapper around `collection.query()`, reused across all four approaches.
3. **Approach A** embeds a vague question directly, then asks the model to rewrite it into something clearer, and embeds the rewritten version, comparing the two retrievals.
4. **Approach B (HyDE)** embeds a comparison question directly, then separately asks the model to write one plausible-sounding *answer* sentence (it doesn't have to be correct) and embeds that sentence instead, comparing the two retrievals.
5. **Approach C (multi-hop)** runs one retrieval to identify which company a question is about (hop 1), then a second retrieval scoped to that company specifically, using `where={"company": ...}`, to answer the actual question (hop 2).
6. **Approach D (self-correction)** retrieves a candidate answer, asks the model to grade it (YES/NO) against the question, and if the grade is NO and a retry is left, asks the model to rewrite the query and tries again, up to two attempts total.

## Troubleshooting

- **`PROVIDER is set to '...'` message and the script exits**: switch `PROVIDER` to `ollama` or `openai` in your `.env`. Anthropic has no embeddings API.
- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled both `nomic-embed-text` and `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **Approach D's final answer is wrong**: that's expected and discussed above, self-correction is only as reliable as its rewrite step, and a small local model doesn't always produce a genuinely different query on retry.
- **You get different top companies than shown above**: these are real LLM and embedding calls, not fixed lookups. The specific documents retrieved can shift slightly between runs; the overall pattern (A and D struggle, B and C succeed) tends to hold.
