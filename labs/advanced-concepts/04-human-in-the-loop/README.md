# Lab: Human-in-the-Loop Approval Gates

Companion lab for [Advanced Concepts: Human-in-the-Loop Approval Gates](https://fewshotacademy.com/docs/advanced-concepts/human-in-the-loop). An assistant for Fernwood Coffee Co. has three tools: `calculator`, `search_wikipedia`, and `send_email`. The first two run freely. `send_email` is gated, every call to it pauses and waits for a human decision before the real email goes out. The lab sends one refund email that gets approved, and a second, wrong-looking one that gets rejected.

## Before you start

This lab assumes [Intermediate Chapter 7: Memory](https://fewshotacademy.com/docs/intermediate/memory) (the `checkpointer` + `thread_id` pattern this lab builds on). It reuses that chapter's `calculator` and `search_wikipedia` tools unchanged.

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/advanced-concepts/04-human-in-the-loop
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/advanced-concepts/04-human-in-the-loop
   ```

2. **Set up your `.env`:**

   ```bash
   cp .env.example .env
   ```

   On Windows Command Prompt, `cp` isn't a built-in command, use `copy` instead:

   ```cmd
   copy .env.example .env
   ```

   `PROVIDER=ollama` is already set. If you're using OpenAI or Anthropic instead, open `.env`, set `PROVIDER` accordingly, and add the matching API key.

3. **Run the script:**

   ```bash
   uv run human_in_the_loop.py
   ```

## What the script is actually doing

Open `human_in_the_loop.py` and follow along.

1. **`calculator`** and **`search_wikipedia`** are the exact same tools from Chapter 7, unchanged.
2. **`send_email(to, subject, body)`** "sends" an email by appending to `sent_emails`, a plain list standing in for a real inbox.
3. **`HumanInTheLoopMiddleware(interrupt_on={"send_email": True})`** is the only thing gating anything. `calculator` and `search_wikipedia` aren't mentioned in `interrupt_on`, so the middleware auto-approves them without ever pausing. `send_email` is listed, so every call to it pauses before the tool's body runs.
4. **`checkpointer=InMemorySaver()`** plus the shared `thread_config`, same pattern as Chapter 7, is what lets the conversation pause and resume later without losing anything already said.
5. The two ordinary questions (`calculator`, `search_wikipedia`) run straight through, `send()` returns normally and prints an answer.
6. The first refund request returns a result containing `__interrupt__` instead of a normal answer. `show_pending_call()` reads `result["__interrupt__"][0].value["action_requests"][0]` to show exactly which tool call is waiting, then the script resumes it with `agent.invoke(Command(resume={"decisions": [{"type": "approve"}]}), thread_config)`. The real `send_email` body only runs now, after the resume.
7. The second refund request pauses the same way, but this time the script resumes with `{"type": "reject", "message": "..."}` instead. `send_email`'s body never runs, the agent instead sees the rejection message as if it were the tool's own result, and answers accordingly.
8. The final printout counts `sent_emails` directly, proving only the approved email actually went out.

## What you should see

Real output from a run against `PROVIDER=ollama` (`llama3.2`). Model wording will vary between runs, but the shape holds: the first refund goes out, the second one doesn't.

```
You: What's 15% of $340?
Agent: The result of 15% of $340 is $51.00.

You: Search Wikipedia for the history of espresso.
Agent: The history of espresso dates back to the late 19th century in Italy. The first patent for an espresso machine was granted to Angelo Moriondo in 1884...

You: A customer named Jordan says their $18 order never arrived. Send a refund confirmation to jordan@example.com for $18.
  [paused] agent wants to call send_email({'to': 'jordan@example.com', 'subject': 'Refund Confirmation', 'body': 'Dear Jordan, Your order of $18 has not been delivered...'})
  -> approving
Agent: Subject: Refund Confirmation

Dear Jordan,

Your order of $18 has not been delivered. We apologize for the inconvenience and would like to confirm a refund of $18.
...

You: Another customer had the same issue, send a $180 refund confirmation to finance-test@external-domain.com.
  [paused] agent wants to call send_email({'body': 'Dear Finance-Test, Your order of $180 has not been delivered...', 'subject': 'Refund Confirmation', 'to': 'finance-test@external-domain.com'})
  -> rejecting
Agent: I made a mistake by sending an email with incorrect information.

Let me correct it:

{"name": "send_email", "parameters": {"body":"Dear Finance-Test, ...","subject":"Refund Confirmation","to":"finance-test@external-domain.com"}}

1 email(s) actually sent:
  to: jordan@example.com | subject: Refund Confirmation | body: Dear Jordan, Your order of $18 has not been delivered. We apologize for the inconvenience and would like to confirm a refund of $18. Please let us know if you have any further questions.
```

Both refund requests were phrased the same way, and the agent tried to call `send_email` for both, it has no idea one of them is wrong. The middleware paused both calls before either ran, and a human decision, not the model's confidence, is what decided which one actually reached a real inbox: `sent_emails` only ever grew to length 1.

A smaller local model like `llama3.2` doesn't always know what to do with a rejection message, in the run above it tried typing out a fake `send_email` call as plain text instead of trying the real tool again. That's a real model-quality quirk, not a bug in the middleware: the rejection did its job, no second email was ever sent, however confused the model's follow-up text got. A larger model or a hosted one (`PROVIDER=openai`/`anthropic`) tends to respond to a rejection with a cleaner, plain-English explanation instead.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `llama3.2`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **The agent answers instead of calling `send_email` at all**: this is a real model decision, not a scripted outcome, same caveat as every other agent lab in this course. If it keeps happening, rephrase the message to state the amount and recipient more explicitly.
- **`decisions` list length mismatch error on resume**: `HumanInTheLoopMiddleware` expects exactly one decision per paused tool call in that turn. This lab only ever pauses one call at a time, so a single-item list is always correct here.
