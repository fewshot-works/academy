---
title: Frontier models don't make safer agents
description: A new benchmark auto-generates adversarial tool environments at scale instead of the four hand-built ones prior work used, and every frontier model it tested, GPT-5 included, still gets hijacked. The fix that actually worked wasn't a bigger model.
slug: frontier-models-arent-safer-agents
authors: [mangatrai]
tags: [security, agents, research]
---

DeepSeek-V3.2 gets hijacked into an unauthorized tool call 75% of the time under its worst attack framing. GPT-4.1 hits 75.6%. GPT-5, the strongest model in the lineup, still gets hijacked 59% of the time under a different framing. These aren't obscure or under-trained models. They're the frontier, tested by a new benchmark called [ToolHazard](https://arxiv.org/abs/2608.11878), and none of them come close to holding.

{/* truncate */}

:::tip[TL;DR]
ToolHazard uses an LLM pipeline to auto-generate adversarial tool environments instead of hand-writing a handful, and the resulting benchmark is bigger and harder than anything before it: 28 environments, 512 tools, 15.6 steps per task on average. Every frontier model tested gets hijacked at meaningful rates, GPT-5 included. The one thing that reliably cut attack success wasn't a smarter base model, it was training on adversarial trajectories directly, which also improved the model's benign task success and transferred to a completely different benchmark.
:::

## The scale is the point

Most agent security benchmarks before this one, AgentDojo included, hand-build a handful of environments and predefine where an attack gets planted. That's a fair test, but it's a small one: four environments, four or five steps per task. An attacker who only has to beat four fixed scenarios isn't facing anything like a real deployment.

ToolHazard's Environment Simulator, Attacker Agent, and User Simulator generate the whole thing instead: 28 stateful environments across healthcare, finance, e-commerce, and more, 512 tools, tasks averaging 15.6 steps. That's closer to what a real multi-tool agent actually does, and it's also just a much bigger surface for an attack to land somewhere.

## Nobody held

| Model | ASR range across attack framings |
|---|---|
| GPT-5 | 1.2% to 59.1% |
| GPT-4.1 | 1.2% to 75.6% |
| Gemini-3.1-Pro | 3.5% to 63.2% |
| DeepSeek-V3.2 | 1.2% to 75.0% |
| Qwen3-8B | 11.8% to 54.3% |

Every model's low end sits near zero, meaning it holds fine against a poorly-framed attack. Every model's high end climbs into a range where a real attacker, picking the framing that works, gets through more than half the time. Bigger and newer helped some (GPT-5 fares better than GPT-4.1 on the worst framings) but not enough to call the problem solved. This isn't a small-model issue you outgrow by upgrading.

Two mechanical findings stood out. Injected instructions succeed more often when they show up **early** in an agent's trajectory, and when they're placed **near the end** of a tool's returned text rather than buried in the middle. That second one lines up with a pattern long known outside security research too, "lost in the middle" work has shown models attend unevenly across long context, favoring the start and the end. ToolHazard is evidence that an attacker can exploit the exact same bias.

## What actually moved the needle

Swapping in a smarter model didn't fix this. Training directly on the attack did, and it didn't cost anything in return: fine-tuning Qwen3-8B on ToolHazard-generated attack trajectories (roughly 1,000 examples, supervised plus reinforcement learning) took its attack success rate from 36.1% down to 18.1%, while its benign task success rate went *up*, from 67.6% to 75.9%. Same direction, not a security-for-utility trade.

The more interesting part is that this wasn't overfitting to ToolHazard's own benchmark. The same aligned model, tested cold on AgentDojo, an independently built benchmark it never trained against, still showed the improvement carry over. Robustness that transfers to a benchmark it's never seen is a much stronger claim than robustness on the benchmark it trained on.

## The takeaway

If your agent security plan is "use the best available model," this benchmark is a direct counterargument. GPT-5 still got hijacked more than half the time under its worst framing. What actually worked was building attack data at scale and training against it directly, closer to how spam filters and malware detection improved, not by getting a smarter general-purpose model, but by training specifically on the thing they were trying to catch.

We've written about the indirect-injection side of this in [Agent Security](/docs/advanced-concepts/agent-security), and about why one clean test run doesn't prove a defense holds in [Continuous Adversarial Evaluation](/docs/advanced-concepts/continuous-adversarial-evaluation). ToolHazard is the most convincing evidence yet for both arguments at once.
