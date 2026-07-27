# Lab 4: Prompt Patterns

Companion lab for [Intermediate Chapter 4: Prompt Patterns](https://fewshot-works.github.io/academy/docs/intermediate/prompt-patterns). Three techniques, three failure modes: chain-of-thought (wrong shortcut answers), structured/JSON output (replies you can't parse), and function calling (no way for the model to act on what it decided).

## Before you start

You should already have Foundations done, at least [Chapter 3: Prompting 101](https://fewshot-works.github.io/academy/docs/foundations/prompting-101) — this lab assumes you already know zero-shot, few-shot, and system prompts, and builds on top of them.

This lab is chat-only, no embeddings involved, so it's the first Intermediate lab that supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/intermediate/04-prompt-patterns
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/intermediate/04-prompt-patterns
   ```

   Don't know git yet? [Download the Intermediate labs zip](https://fewshot-works.github.io/academy/downloads/academy-labs-intermediate.zip) instead, unzip it, and open `labs/intermediate/04-prompt-patterns` in a terminal.

2. **If you're using Ollama, make sure the model is pulled:**

   ```bash
   ollama pull llama3.2
   ```

3. **Set up your `.env`:**

   ```bash
   cp .env.example .env
   ```

   `PROVIDER=ollama` is already set. If you're using OpenAI or Anthropic instead, open `.env`, set `PROVIDER` accordingly, and add the matching API key.

4. **Run the script:**

   ```bash
   uv run prompt_patterns.py
   ```

## What you should see

With `PROVIDER=ollama`:

```
============================================================
1. CHAIN OF THOUGHT
============================================================

Problem: A bakery baked 24 muffins. Half of the muffins are blueberry. Half of the blueberry muffins also have a chocolate drizzle. How many muffins have both blueberry and a chocolate drizzle?
(Correct answer: 6)

--- Direct answer (forced to skip its reasoning) ---
4

--- With 'think step by step' appended ---
To find out how many muffins have both blueberry and a chocolate drizzle, we need to break it down:

1. Half of the muffins are blueberry: 24 / 2 = 12
2. Half of the blueberry muffins also have a chocolate drizzle: 12 / 2 = 6

So, there are 6 muffins that have both blueberry and a chocolate drizzle.

6

Summary: correct answer is 6. Compare the two responses above
to see whether the direct prompt shortcut its way to a wrong number.

============================================================
2. STRUCTURED / JSON OUTPUT
============================================================

Blurb: Join us for the Riverside Tech Meetup on August 14th, 2026, at the Cedar Hall Community Center in Portland. Doors open at 6 PM.

--- Freeform prompt (just asking for JSON) ---
{"name": "Riverside Tech Meetup", "date": "August 14th, 2026", "location": "Cedar Hall Community Center in Portland"}
Parsed OK: {'name': 'Riverside Tech Meetup', 'date': 'August 14th, 2026', 'location': 'Cedar Hall Community Center in Portland'}

--- Native structured-output mode ---
{"name": "Riverside Tech Meetup", "date": "August 14th, 2026", "location": "Cedar Hall Community Center, Portland"}
Parsed OK: {'name': 'Riverside Tech Meetup', 'date': 'August 14th, 2026', 'location': 'Cedar Hall Community Center, Portland'}

============================================================
3. FUNCTION CALLING
============================================================

Question: Can you check the status of order A1234?

Model chose to call: check_order_status({'order_id': 'A1234'})
```

💡 A few honest notes on this real run, not the tidy version:

- **Section 1 genuinely fails without the trick.** Forced to skip its reasoning and answer with just a number, `llama3.2` guessed 4, wrong. Appending "think step by step" reliably gets it to 6, the correct answer, because it's forced to actually work through "half of 24, then half of that" instead of pattern-matching straight to a number. This isn't cherry-picked, run it a few times yourself and you'll see the direct answer miss more often than not, while the step-by-step version holds up.
- **Section 2's freeform prompt happened to parse fine on this run.** Small models don't always cooperate, sometimes they wrap the JSON in a ```` ```json ```` fence, or add a sentence before it, which breaks a plain `json.loads()` call (the script strips a code fence if it finds one, but not stray prose). Native structured-output mode (`"format": "json"` for Ollama, `response_format={"type": "json_object"}` for OpenAI) skips that risk entirely, the API guarantees valid JSON back. If you see the freeform attempt fail on your run, that's the point being made, not a bug.
- **Section 3 shows a decision, not an action.** The model picks the right tool and fills in the right argument, but nothing actually calls `check_order_status`. That's deliberate, wiring the model's decision up to a real function and feeding the result back is Chapter 5's job.

With `PROVIDER=openai` or `PROVIDER=anthropic`, the shape is the same, only the JSON mode and function-calling mechanics underneath differ (see below).

## What the script is actually doing

Open `prompt_patterns.py` and follow along.

1. **Chain-of-thought**: the same word problem is sent twice, once with a system prompt that forces a bare number (no room to reason), once with "think step by step" appended to the question itself (room to reason, and told to use it). Both final answers are printed so you can compare them against the known-correct answer.
2. **Structured/JSON output**: a short event blurb is sent with a freeform "respond with only JSON" instruction, and the script tries `json.loads()` on whatever comes back (stripping a markdown fence if there is one). Then the same extraction is repeated using each provider's native structured-output mode: `"format": "json"` for Ollama, `response_format={"type": "json_object"}` for OpenAI, and for Anthropic, a single tool with an input schema (Anthropic has no plain JSON mode, structured output there works *through* tool use, which is exactly what section 3 covers).
3. **Function calling**: one mock tool, `check_order_status(order_id)`, is described to the model alongside a question that should trigger it. The script prints which tool the model chose and what arguments it filled in, without ever calling the real function.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **Section 1's direct answer comes out correct on your run**: it's a real LLM call, not a fixed script, small models don't fail the same way every single time. Run it a few times if you want to see the miss.
- **Section 3 prints a text reply instead of a tool call**: this can happen with smaller local models. If it does, the script prints the text reply instead so you can see what happened.
