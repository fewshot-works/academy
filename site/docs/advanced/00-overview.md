---
sidebar_position: 1
description: What Advanced covers, what you'll build by the end, and how it builds on the multi-tool agent you already shipped in Intermediate.
---

import TrackProgress from '@site/src/components/LearningProgress/TrackProgress';

# Advanced Overview

<TrackProgress trackId="advanced" />

> **Before you start:** if it's been a while, skim Foundations' [bonus chapter on using AI responsibly](../foundations/02b-responsible-ai-use.md) as a refresher, privacy, bias, and verifying what a model tells you.

## Where you're picking up

Intermediate ended with one agent, three tools it picked between on its own — a calculator, a Wikipedia search, and search over your own documents — with memory holding the whole conversation together. That agent worked, and worked well enough to trust for a demo. It's also, by production standards, still a toy: one model doing everything itself, no other agents to delegate to, no defense against a document or a user actively trying to make it misbehave, no record of what a run actually cost, and nothing making sure a slow or wrong answer isn't a total mystery.

## What's different now

Advanced closes exactly those gaps, one at a time: splitting work across multiple specialized agents instead of one generalist; retrieval that checks its own results and tries again instead of trusting whatever came back first; knowing when fine-tuning actually earns its cost instead of assuming it always does; defending an agent against prompt injection and validating what it sends back; tracing every step of a run so nothing is a mystery; caching, rate limiting, and streaming so something that works in a demo also works under real load; and, finally, packaging any of this as more than a script you run from a terminal.

## What you'll be able to do by end

By the end of Advanced, you'll have built a small team of agents that coordinate on a task, a self-correcting retrieval pipeline, a real (if tiny) fine-tuned model you can compare against prompting and RAG, a guardrail layer that catches prompt injection and bad output, a traced agent run you can inspect step by step, and a version of your agent wrapped in an API and a Docker container. The capstone puts all of it together: one agentic RAG system, evaluated, guarded, and traced — still running entirely on your own laptop.

## Chapters ahead

1. **Multi-agent patterns** — supervisor, hierarchical, and swarm topologies for splitting work across more than one agent.
2. **Advanced RAG** — query rewriting, HyDE, multi-hop retrieval, and self-correcting RAG.
3. **Fine-tuning vs. RAG vs. prompting** — a decision framework, plus a real (tiny) local fine-tune to compare against both.
4. **Guardrails & safety** — defending against prompt injection and validating what the model sends back.
5. **Observability** — tracing agent runs and tracking cost, latency, and token usage.
6. **Production concerns** — caching, rate limiting, streaming, and cost optimization.
7. **Shipping it** — packaging an agent as an API and a basic Docker container.
8. **Capstone** — an end-to-end agentic RAG system: evaluated, guarded, and traced.

## What's next

Chapter 1 starts with the most obvious gap: one agent, doing everything itself. You'll build a small team instead — a supervisor that delegates to specialists — and see exactly what that trade-off buys you, and what it costs.
