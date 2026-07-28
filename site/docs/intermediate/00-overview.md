---
sidebar_position: 1
description: What Intermediate covers, what you'll build by the end, and how it builds on the Q&A bot you already made in Foundations.
---

# Intermediate Overview

> **Before you start:** if it's been a while, skim Foundations' [bonus chapter on using AI responsibly](../foundations/02b-responsible-ai-use.md) as a refresher, privacy, bias, and verifying what a model tells you.

## Where you're picking up from

Foundations took you from zero to a working Q&A bot. Along the way you sent your first prompt to an LLM, turned text into embeddings, stored and searched those embeddings in a vector database, wired retrieval and generation together into RAG, met the idea of an AI agent, and combined all of it into a real bot that answers questions over your own documents.

Every one of those labs used small, forgiving examples on purpose: six sentences, one tiny fictional document, exactly one hardcoded question. That was deliberate. The goal was to see each piece work on its own, clearly, before anything got messy.

## What's different now

Real documents aren't six sentences. Real retrieval doesn't always pull back the right chunk. Real prompts need more structure than "here's some context, answer the question." Real agents need actual tools to call, not just the idea of a tool. And once you've built any of that, you need a way to know whether it's actually working, not just whether it runs without crashing.

Intermediate is that messiness, addressed one piece at a time: how to cut a real document into pieces that are big enough to make sense and small enough to be useful, how to make retrieval actually find the right chunk, how to get an LLM to respond in a shape your code can rely on, how to give an agent real tools and let it decide when to use them, how to give it memory across a conversation, and how to measure whether any of it is any good.

## What you'll be able to do by the end

By the end of Intermediate, you'll have built a tool-calling assistant, then leveled that up into a multi-tool agent, a capstone that combines web search, a calculator, and RAG over your own documents into one system that decides for itself which tool a question needs. Just as important, you'll know how to evaluate a RAG or agent system, retrieval precision and recall, and a first look at using an LLM as a judge, instead of just eyeballing whether an answer looks right.

## The chapters ahead

1. **Chunking strategies** — fixed-size, recursive, and semantic chunking, and why the choice matters for what gets retrieved later.
2. **Choosing an embedding model** — OpenAI vs. open-source, weighed on cost, quality, and latency.
3. **Better retrieval** — hybrid search, metadata filtering, and re-ranking.
4. **Prompt patterns** — chain-of-thought, structured/JSON output, and function calling.
5. **Tool use** — *lab: build a tool-calling assistant (calculator, web search).*
6. **Your first agent** — a raw function-calling loop, then a light framework, compared side by side.
7. **Memory** — short-term context vs. summarized long-term memory.
8. **Evaluating what you built** — retrieval precision/recall basics, and an intro to LLM-as-judge.
9. **Capstone** — a multi-tool agent combining web search, a calculator, and RAG over your own documents.

## What's next

Chapter 1 starts with the first piece of that messiness: how you actually cut a real, multi-paragraph document into pieces small enough to search but still meaningful on their own.
