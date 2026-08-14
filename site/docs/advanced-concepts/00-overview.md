---
sidebar_position: 1
description: What Advanced Concepts is, how it's different from the three-tier curriculum, and how to use it.
---

# Advanced Concepts Overview

## What this section is

Foundations, Intermediate, and Advanced are a track: each chapter assumes you finished the one before it, and they end in a capstone. Advanced Concepts isn't that. It's a cookbook, a shelf of standalone, self-contained chapters on topics that don't need to happen in a specific order or lead anywhere in particular. Finish one, and you're done, nothing is left half-built for a later chapter to pick up.

## Where you're picking up

Every chapter here assumes you've been through at least Foundations, ideally the whole three-tier curriculum. They lean on things already taught there, tokens, prompting basics, how a model actually generates text, rather than re-teaching them.

## What's here

**Prompt Engineering** — how to write a prompt that says exactly what you mean: cutting the filler that wastes tokens, structuring instructions so nothing is ambiguous, and adding the one kind of constraint that actually reduces hallucinations.

**Token & Cost Management** — how to think about reducing token usage and LLM cost: trimming what you resend, provider-native prompt caching, routing tasks to the right-sized model, and batching what isn't urgent.

**Agent Security** — indirect prompt injection: malicious instructions arriving as tool output, like a document or email, instead of user input, and why the fix is constraining what a sensitive tool is allowed to do rather than trying to detect suspicious text.

**Human-in-the-Loop** — pausing an agent right before a specific, hard-to-reverse tool call, like sending an email or issuing a refund, and requiring a human's explicit approve, edit, reject, or respond decision before the real tool ever runs.

**RBAC** — scoping what a tool is allowed to do based on who's calling it, not just whether it can be called at all: role-based permission checks, and a per-role limit (like a refund cap) on top of a fixed allowlist.

**Chaos Engineering** — deliberately corrupting a tool's return value to see how an agent degrades, instead of only testing the happy path: crash, omission, and value faults as the mental model, and a guard that checks a response before trusting it.

**Continuous Adversarial Evaluation** — testing a security defense against a battery of differently-worded attacks instead of just one, why a keyword filter misses phrasings it wasn't built to catch while a structural guard doesn't, and why the eval harness itself is also attack surface.

## What's next

Pick a chapter title that catches your eye and start there. Nothing here is gated behind anything else in this section.
