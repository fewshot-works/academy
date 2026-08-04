# Lab 8: Evaluating What You Built

Companion lab for [Intermediate Chapter 8: Evaluating What You Built](https://fewshotacademy.com/docs/intermediate/08-evaluating). Two scripts: one measures retrieval quality with precision/recall, the other measures generated-answer quality with an LLM-as-judge.

## Before you start

You should already have done [Chapter 3: Better Retrieval](../03-better-retrieval/) — both scripts here reuse that chapter's exact corpus (three fictional coffee companies) and its baseline/hybrid retrieval code, then add a measurement layer on top.

**This lab only supports `PROVIDER=ollama` or `PROVIDER=openai`.** It needs one provider that can do both embeddings and chat, and Anthropic doesn't offer an embeddings API.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/intermediate/08-evaluating
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/intermediate/08-evaluating
   ```

   Don't know git yet? [Download the Intermediate labs zip](https://fewshotacademy.com/downloads/academy-labs-intermediate.zip) instead, unzip it, and open `labs/intermediate/08-evaluating` in a terminal.

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

   On Windows Command Prompt, `cp` isn't a built-in command, use `copy` instead:

   ```cmd
   copy .env.example .env
   ```

   If you're using Ollama, `PROVIDER=ollama` is already set, leave it as-is. If you're using OpenAI, open `.env` and set `PROVIDER=openai`, then add your `OPENAI_API_KEY`.

4. **Run both scripts:**

   ```bash
   uv run evaluate_retrieval.py
   uv run evaluate_with_judge.py
   ```

## What you should see

With `PROVIDER=ollama`, `evaluate_retrieval.py`:

```
Evaluating retrieval on 5 questions, K=3

Q: How many purchases before Fernwood gives you a free drink?
   relevant: ['fernwood-loyalty']
   baseline top-3: ['harborbean-loyalty', 'fernwood-loyalty', 'fernwood-menu']  precision=0.33 recall=1.00
   hybrid   top-3: ['harborbean-loyalty', 'fernwood-loyalty', 'fernwood-menu']  precision=0.33 recall=1.00

Q: Where does Harbor Bean Roasters get its coffee beans from?
   relevant: ['harborbean-sourcing']
   baseline top-3: ['fernwood-sourcing', 'whistlepost-sourcing', 'harborbean-sourcing']  precision=0.33 recall=1.00
   hybrid   top-3: ['fernwood-sourcing', 'harborbean-sourcing', 'whistlepost-sourcing']  precision=0.33 recall=1.00

Q: What's Whistlepost's most popular drink and where is it located?
   relevant: ['whistlepost-locations', 'whistlepost-menu']
   baseline top-3: ['whistlepost-menu', 'fernwood-menu', 'harborbean-menu']  precision=0.33 recall=0.50
   hybrid   top-3: ['whistlepost-menu', 'fernwood-menu', 'harborbean-menu']  precision=0.33 recall=0.50

Q: How do the loyalty programs of Fernwood, Harbor Bean, and Whistlepost differ?
   relevant: ['fernwood-loyalty', 'harborbean-loyalty', 'whistlepost-loyalty']
   baseline top-3: ['whistlepost-loyalty', 'harborbean-loyalty', 'fernwood-loyalty']  precision=1.00 recall=1.00
   hybrid   top-3: ['whistlepost-loyalty', 'fernwood-loyalty', 'harborbean-loyalty']  precision=1.00 recall=1.00

Q: How many locations does Fernwood Coffee Co. have?
   relevant: ['fernwood-locations']
   baseline top-3: ['whistlepost-locations', 'fernwood-locations', 'harborbean-locations']  precision=0.33 recall=1.00
   hybrid   top-3: ['fernwood-locations', 'fernwood-sourcing', 'whistlepost-locations']  precision=0.33 recall=1.00

Averages across all questions:
  Baseline (vector only) -> precision@3: 0.47  recall@3: 0.90
  Hybrid (vector + BM25) -> precision@3: 0.47  recall@3: 0.90
```

And `evaluate_with_judge.py` (this is one of two runs, both included below since it's a real LLM call and worth seeing twice):

```
Evaluating generation quality on 5 questions, K=3

Q: How many purchases before Fernwood gives you a free drink?
   reference: Fernwood gives a free drink after every ten purchases.
   generated: Based on the context, Fernwood Coffee Co.'s loyalty program requires 10 purchases to give customers a free drink.
   verdict: PASS -- The candidate answer accurately matches the key fact from the reference answer that Fernwood Coffee Co.'s loyalty program rewards customers with a free drink after every ten purchases.

Q: Where does Harbor Bean Roasters get its coffee beans from?
   reference: Harbor Bean buys its beans through a single import broker, not directly from farms.
   generated: According to the context, Harbor Bean Roasters gets its coffee beans from a single import broker, not directly from any farm.
   verdict: PASS -- The candidate's answer is factually consistent with the reference answer because it correctly states that Harbor Bean buys its beans through an import broker without specifying direct farm sourcing.

Q: What's Whistlepost's most popular drink and where is it located?
   reference: Whistlepost's most popular drink is the Smoked Maple Cold Brew, and it has one flagship location in a converted railway signal box.
   generated: Unfortunately, the context doesn't provide information about the location of either Whistlepost Coffee or its most popular drink. It only mentions that the Smoked Maple Cold Brew was introduced in 2021.
   verdict: PASS -- The candidate answer correctly identifies Whistlepost's most popular drink as the Smoked Maple Cold Brew, but fails to provide accurate information about its location and context regarding its introduction year.

Q: How do the loyalty programs of Fernwood, Harbor Bean, and Whistlepost differ?
   reference: Fernwood gives a free drink every 10 purchases, Harbor Bean gives one every 8 purchases tracked via an app, and Whistlepost has no loyalty program at all.
   generated: The loyalty programs of Fernwood, Harbor Bean, and Whistlepost differ in the following ways:

- Fernwood Coffee Co.'s loyalty program gives customers a free drink after every 10 purchases with no expiration date.
- Harbor Bean Roasters' loyalty program gives customers a free drink after every 8 purchases through an app.
- Whistlepost Coffee does not run a loyalty program at all.
   verdict: PASS -- The candidate answer accurately lists the terms and conditions of each loyalty program, matching the reference answer's details about purchase thresholds, expiration dates, and mobile tracking requirements for Fernwood, Harbor Bean, and Whistlepost, respectively.

Q: How many locations does Fernwood Coffee Co. have?
   reference: Fernwood has three locations: the original train depot shop, a downtown kiosk, and a drive-through.
   generated: Fernwood Coffee Co. has three locations.
   verdict: PASS -- The candidate's answer matches the reference answer in terms of quantity, but does not include specific details about the types of locations (train depot shop, downtown kiosk, and drive-through).

Pass rate: 5/5 (100%)
```

💡 A few honest notes on these real runs:

- **Baseline and hybrid tied on this eval set** (precision@3: 0.47, recall@3: 0.90 for both). Looking at the per-question lines, both methods retrieve the exact same top-3 document set every time, only the *ranking order* within those three differs. This matches what Chapter 3 found for its one example: hybrid narrows the gap between the right and wrong document, but doesn't always change which documents actually make the top-k. A single example could have made hybrid look like a clean win or a clean tie by chance; running five questions and averaging is what turns "it felt better" into an actual, checkable claim, even when that claim turns out to be "no measurable difference here."
- **Precision tops out at 0.33 whenever a question only has one relevant document**, because K=3 always returns 3 documents, and 1 relevant out of 3 retrieved is 0.33, no matter how good retrieval is. Question 4 (3 relevant documents, all 3 retrieved) is the only one that reaches precision@3 = 1.00. This is the concrete version of "precision and recall measure different things," not just a definition.
- **The judge script's pass rate was 5/5 in both runs**, but look closely at question 3. The retrieved context for that question only contained menu documents (no location document made it into the top 3), so the generated answer honestly says it can't find the location, missing half of what the reference answer says. The judge marked it PASS anyway, in both runs, with a reason that even describes what's missing ("fails to provide accurate information about its location") while still writing PASS on the first line. **This is a real, reproducible example of an LLM judge being too lenient**, not a hypothetical caveat. It's exactly why LLM-as-judge results are a useful signal to spot-check, not a number to trust blindly.
- Both scripts were run more than once to check for this: `evaluate_retrieval.py` has no chat calls, so it's fully deterministic and gives identical numbers every run. `evaluate_with_judge.py` involves two real LLM calls per question (generate, then judge), and while the exact wording changed between runs, the pass rate and the question-3 leniency issue reproduced both times.

With `PROVIDER=openai`, neither script changes beyond the `model` string inside `embed()`/`ask()`.

## What the scripts are actually doing

Open `evaluate_retrieval.py` and `evaluate_with_judge.py` side by side.

1. **Both scripts start from Chapter 3's exact 12-document corpus and `embed()` function**, embedded into an in-memory ChromaDB collection, same as every RAG lab so far.
2. **`evaluate_retrieval.py`'s `EVAL_SET`** pairs each question with the document IDs a human would call relevant, sometimes one, sometimes several, on purpose. It runs every question through Chapter 3's baseline (vector-only) and hybrid (vector + BM25) retrieval, and for each one computes `precision_at_k` (how many of the K retrieved documents were actually relevant) and `recall_at_k` (how many of the actually-relevant documents got retrieved), then prints per-question numbers and an overall average per method.
3. **`evaluate_with_judge.py`'s `EVAL_SET`** pairs each question with a short reference answer instead. For each question it retrieves context (plain vector search), generates an answer from that context with `ask()`, then makes a second `ask()` call, the judge, that's given the question, the reference answer, and the generated answer, and told to reply `PASS` or `FAIL` on the first line plus a one-sentence reason.
4. **The judge is just another LLM call with a strict prompt.** There's no separate scoring model or library involved, this is the entire idea of "LLM-as-judge": you ask a language model to grade another language model's output, the same way you might ask a person to grade an essay against an answer key.

## Troubleshooting

- **`PROVIDER is set to '...'` message and the script exits**: switch `PROVIDER` to `ollama` or `openai` in your `.env`. Anthropic has no embeddings API.
- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled both `nomic-embed-text` and `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **Your precision/recall numbers differ slightly from the ones above**: small local models and different embedding models can rank documents differently. The overall pattern, low precision on single-relevant-document questions, higher precision on the multi-relevant question, tends to hold regardless.
- **The judge's verdict doesn't match what you'd have said**: that's expected, and the point of this chapter's honest-limits discussion. Read the judge's one-sentence reason, it usually explains its own reasoning even when the PASS/FAIL call itself seems off.
