# Lab 3: Better Retrieval

Companion lab for [Intermediate Chapter 3: Better Retrieval](https://fewshot-works.github.io/zero-to-agent/docs/intermediate/better-retrieval). You'll retrieve from the same set of documents four different ways, plain vector search, metadata filtering, hybrid search, and LLM re-ranking, and see where each one helps.

## Before you start

You should already have Foundations done, at least [Chapter 6: What Is RAG](https://fewshot-works.github.io/zero-to-agent/docs/foundations/what-is-rag) — this lab reuses that lab's `embed()` and `ask()` pattern, and its corpus starts with the same fictional company, Fernwood Coffee Co., now sharing a bigger, deliberately confusable set of documents with two other fictional coffee companies.

**This lab only supports `PROVIDER=ollama` or `PROVIDER=openai`.** It needs one provider that can do both embeddings and chat, and Anthropic doesn't offer an embeddings API.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd zero-to-agent/labs/intermediate/03-better-retrieval
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/zero-to-agent.git
   cd zero-to-agent/labs/intermediate/03-better-retrieval
   ```

   Don't know git yet? [Download the Intermediate labs zip](https://fewshot-works.github.io/zero-to-agent/downloads/zero-to-agent-labs-intermediate.zip) instead, unzip it, and open `labs/intermediate/03-better-retrieval` in a terminal.

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

   If you're using Ollama, `PROVIDER=ollama` is already set, leave it as-is. If you're using OpenAI, open `.env` and set `PROVIDER=openai`, then add your `OPENAI_API_KEY`.

4. **Run the script:**

   ```bash
   uv run better_retrieval.py
   ```

## What you should see

With `PROVIDER=ollama`:

```
Question: How many purchases before Fernwood gives you a free drink?

A. Baseline: vector search only
  1. [Harbor Bean] Harbor Bean Roasters' loyalty program gives customers a free drink aft...
  2. [Fernwood] Fernwood Coffee Co.'s loyalty program gives customers a free drink aft...
  3. [Fernwood] Fernwood Coffee Co.'s best-selling drink is the Depot Latte, a vanilla...

B. Metadata filter: vector search where company = Fernwood
  1. [Fernwood] Fernwood Coffee Co.'s loyalty program gives customers a free drink aft...
  2. [Fernwood] Fernwood Coffee Co.'s best-selling drink is the Depot Latte, a vanilla...
  3. [Fernwood] Fernwood Coffee Co. has three locations, all in the same state: the or...

C. Hybrid: 50% vector similarity + 50% keyword (BM25) score
  1. [Harbor Bean] Harbor Bean Roasters' loyalty program gives customers a free drink aft...
  2. [Fernwood] Fernwood Coffee Co.'s loyalty program gives customers a free drink aft...
  3. [Fernwood] Fernwood Coffee Co.'s best-selling drink is the Depot Latte, a vanilla...

D. Re-rank: ask the LLM to pick the best of hybrid's top 3
  Picked: [Fernwood] Fernwood Coffee Co.'s loyalty program gives customers a free drink after every ten purchases. The punch card never expires and can be transferred to another person.

Summary of top pick per approach:
  A. Baseline vector search -> [Harbor Bean]
  B. Metadata filter        -> [Fernwood]
  C. Hybrid search          -> [Harbor Bean]
  D. LLM re-rank            -> [Fernwood]
```

Notice what actually happens here, not the tidy version you might expect:

- **A (baseline) gets it wrong.** Even though the question names Fernwood directly, plain vector search ranks Harbor Bean's loyalty fact first, because Harbor Bean's wording ("free drink after every eight purchases") is embedded as slightly more similar to the question than Fernwood's own answer is. This is the real failure mode these techniques exist to fix, not a rigged example.
- **B (metadata filter) fixes it instantly**, because scoping the search to `company = Fernwood` before ranking removes every wrong-company document from consideration entirely. It only works because the question happens to name the company explicitly, though, if it hadn't, there'd be nothing to filter on.
- **C (hybrid) narrows the gap but doesn't flip the top result on its own.** BM25 does score Fernwood's fact higher than Harbor Bean's for this query (the word "Fernwood" only appears in Fernwood's documents), but the fixed 50/50 blend with vector similarity isn't quite enough to overcome how confidently vector search preferred the wrong document. What hybrid *does* do is pull the correct document into the top 3, which matters for the next step.
- **D (re-ranking) is what actually finishes the job.** Handed hybrid's top 3 candidates, the LLM reads the actual text, not just a similarity score, and correctly picks Fernwood's fact. Re-ranking works here specifically because hybrid already did the work of getting the right answer into the candidate pool.

Your exact numbers may shift slightly with a different embedding model, but this general shape, baseline stumbles, filtering and hybrid each help partially, re-ranking cleans up what's left, tends to hold.

## What the script is actually doing

Open `better_retrieval.py` and follow along.

1. Twelve short facts across three fictional coffee companies (Fernwood, Harbor Bean, Whistlepost) are embedded and stored in an in-memory ChromaDB collection, each tagged with `company` and `topic` metadata. Fernwood is the same company from Foundations Chapter 6; the other two exist to create genuine ambiguity for vector search to trip over.
2. The same documents are also indexed with `rank_bm25`'s `BM25Okapi`, a simple keyword-scoring algorithm, using plain `.split()` tokenization.
3. **Approach A** runs a plain `collection.query()`, cosine similarity over embeddings only, exactly like the Foundations RAG lab.
4. **Approach B** runs the same query again, but with `where={"company": "Fernwood"}`, so ChromaDB only considers documents from that company before ranking.
5. **Approach C** computes a vector similarity score and a BM25 score for every document, normalizes both to a 0-1 range, and combines them as `0.5 * vector + 0.5 * bm25`.
6. **Approach D** takes hybrid's top 3 documents and asks the model (via the same `ask()` chat pattern from the Foundations RAG lab) to pick the one that actually answers the question.

## Troubleshooting

- **`PROVIDER is set to '...'` message and the script exits**: switch `PROVIDER` to `ollama` or `openai` in your `.env`. Anthropic has no embeddings API.
- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled both `nomic-embed-text` and `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **Step D prints a company that doesn't match what you expected**: this is a real LLM call, not a lookup, small local models occasionally pick the wrong candidate even from a short, clear list. If it happens consistently, try a larger model.
