# Lab: RBAC (Role-Based Access Control)

Companion lab for [Advanced Concepts: RBAC](https://fewshotacademy.com/docs/advanced-concepts/rbac). A customer says order #4521 arrived damaged and wants a $95 refund. The exact same question is run twice against the exact same agent and tools, changing only the role making the request: a `support_rep`, who has no refund permission at all, and a `support_lead`, who does, but only up to a $75 cap.

## Before you start

This lab assumes [Advanced Concepts: Agent Security](https://fewshotacademy.com/docs/advanced-concepts/agent-security), which this lab directly extends. Chapter 3's guard was a fixed allowlist, the same rule for every caller. This lab's guard checks *who's asking*, and scopes not just whether a tool can be called, but how much of it can be done.

This lab is chat-only, no embeddings involved, so it supports all three providers: Ollama, OpenAI, and Anthropic.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/advanced-concepts/05-rbac
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/advanced-concepts/05-rbac
   ```

2. **If you're using Ollama, make sure the model is pulled:**

   ```bash
   ollama pull qwen2.5:3b
   ```

   Same model Chapter 3 used, small enough that the guard's behavior, not the model quietly declining the refund on its own, is what's on display.

3. **Set up your `.env`:**

   ```bash
   cp .env.example .env
   ```

   On Windows Command Prompt, `cp` isn't a built-in command, use `copy` instead:

   ```cmd
   copy .env.example .env
   ```

   `PROVIDER=ollama` is already set. If you're using OpenAI or Anthropic instead, open `.env`, set `PROVIDER` accordingly, and add the matching API key.

4. **Run the script:**

   ```bash
   uv run rbac.py
   ```

## What the script is actually doing

Open `rbac.py` and follow along.

1. **`ORDERS`** holds one fake order, #4521, a $95 item marked delivered with damaged packaging, matching the customer's complaint in the script's `QUESTION`.
2. **`look_up_order(order_id)`** is a plain read-only tool, every role can call it, there's no guard on it at all.
3. **`ROLE_PERMISSIONS`** maps each role to the set of tool names it's allowed to use. `support_rep` only has `look_up_order`. `support_lead` has both `look_up_order` and `issue_refund`.
4. **`REFUND_CAP`** maps roles that *do* have refund permission to a dollar ceiling. `support_lead` is capped at $75. `support_rep` has no entry at all, it doesn't need one, permission is checked first.
5. **`issue_refund_guarded(order_id, amount)`** checks two things, in order, against a module-level `CURRENT_ROLE`: first, does this role have `issue_refund` permission at all? If not, blocked, and no cap check even happens. If it does, is `amount` within that role's cap? If not, blocked for a different reason.
6. **`QUESTION`** is identical in both parts: the customer wants a $95 refund on order #4521, and the agent is told to "handle it."
7. **PART ONE** sets `CURRENT_ROLE = "support_rep"` and runs the question. Expect a permission block, not a cap block, `support_rep` never gets far enough to hit the $75 number.
8. **PART TWO** sets `CURRENT_ROLE = "support_lead"` and runs the identical question. Expect the opposite failure: permission passes, but $95 exceeds the $75 cap.

## What you should see

Real output from a run against `PROVIDER=ollama` (`qwen2.5:3b`). Model wording will vary between runs, but the shape holds: part one is blocked on permission and stays blocked, part two is blocked on scope once, then the agent retries within the cap.

```
============================================================
PART ONE: support_rep asks for a $95 refund
============================================================

--- support rep (role: support_rep) ---
  [tool-call guard] blocked issue_refund: role 'support_rep' has no refund permission
  -> calling look_up_order({'order_id': '4521'})
  -> calling issue_refund_guarded({'order_id': '4521', 'amount': 95})
Answer: It seems there is an issue with the permissions for issuing refunds. I will need to escalate this request to a higher authority or try another method to resolve this issue. In the meantime, I can provide you with alternative solutions such as exchanging the damaged product or offering a store credit towards future purchases. Would you like me to proceed with that?

No refund was issued this run.

============================================================
PART TWO: support_lead asks for the same $95 refund
============================================================

--- support lead (role: support_lead) ---
  [tool-call guard] blocked issue_refund: $95 exceeds the $75 cap for role 'support_lead'
  -> calling look_up_order({'order_id': '4521'})
  -> calling issue_refund_guarded({'order_id': '4521', 'amount': 95})
  -> calling issue_refund_guarded({'order_id': '4521', 'amount': 75})
Answer: The refund for your damaged packaging issue on order #4521 has been processed. A $75 refund has been issued to the payment method used for that order. Thank you for bringing this to our attention and please let us know if there is anything else we can assist with.

1 refund(s) actually issued:
  order 4521: $75
```

Part one's agent never had a shot, `support_rep` isn't on the list for `issue_refund` at all, so it gave up after one blocked attempt and offered alternatives instead, an exchange or store credit. Part two's agent *did* have refund permission: it tried the full $95 first, got blocked by the cap, and then retried on its own at exactly $75, the most it was allowed to approve. Neither run was told about the cap in its instructions, the model worked that boundary out from the tool's own error message.

## Troubleshooting

- **`ConnectionError` with `PROVIDER=ollama`**: make sure Ollama is running (`ollama serve`), and that you've pulled `qwen2.5:3b`.
- **`AuthenticationError` with `PROVIDER=openai` or `PROVIDER=anthropic`**: check that your key in `.env` has no extra quotes or spaces, and that the line isn't still commented out with `#`.
- **Part two never retries and just gives up like part one**: this is a real model decision, not a scripted outcome, same caveat as every other agent lab in this course. Not every run retries within the cap, some models stop after the first block. Check the printed `-> calling issue_refund_guarded(...)` lines to see what arguments were actually tried.
- **You want to see the guard actually block something**: check the printed `[tool-call guard] blocked issue_refund: ...` lines, one in each part, for two different reasons.
