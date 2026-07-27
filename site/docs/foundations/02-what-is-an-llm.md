---
sidebar_position: 3
---

import Quiz from '@site/src/components/Quiz';
import {questions as ch2Questions} from '@site/src/data/quizzes/ch2';

# Chapter 2: What Is a Large Language Model?

> **Time:** 10 minutes. **Cost:** $0 with Ollama, or roughly $0.001 (a tenth of a cent) per run with a hosted API key.

Your phone's keyboard already does something like this: you type "I'll be there in", and it suggests "5", "10", "a bit". It's not reading your mind, it's guessing the next word based on patterns from millions of texts people have typed before.

A large language model (LLM), the technology behind ChatGPT, Claude, and similar tools, does the exact same trick. It's just wildly bigger, and it does it one step at a time, over and over, to write whole paragraphs. That's genuinely most of the magic trick. Let's take it apart.

> **A bit of history:** the architecture behind almost every modern LLM, called the transformer, came from a 2017 paper by Google researchers with the memorable title "Attention Is All You Need." For a few years it mostly stayed inside AI research. That changed in 2020, when OpenAI's GPT-3 showed that making one of these models much bigger let it do useful things from just a handful of examples, no retraining required. ChatGPT's public launch in November 2022 is what most people think of as the beginning, but the core trick, predicting the next token over and over, had been building for years before that.

## Step 1: text gets chopped into "tokens"

Before an LLM can do anything with your text, it has to break it into small chunks called **tokens**. A token is usually smaller than a word, sometimes a whole common word, sometimes just a piece of one.

For example, the word "unbelievable" might get split into three tokens: `un`, `believ`, `able`. Common short words like "the" or "cat" are usually a single token each. As a rough rule of thumb, **1 token ≈ ¾ of an English word**, so a 100-word paragraph is roughly 130 tokens.

Why chop text up like this instead of working word-by-word? Because it lets the model handle *any* word, including ones it's never seen, like a typo or a made-up brand name, by piecing it together from smaller, familiar chunks, the same way you can sound out an unfamiliar word by its syllables.

## Step 2: predicting one token at a time

Here's the actual trick. Given the tokens so far, the model doesn't "know" the answer, it calculates a probability for every possible next token, then picks one (usually the highest-probability one, sometimes a slightly-less-likely one on purpose for variety).

Say the text so far is: *"The cat sat on the"*. The model might assign probabilities like:

| Candidate next token | Probability |
|---|---|
| mat | 41% |
| floor | 18% |
| couch | 12% |
| moon | 0.03% |

It picks "mat," glues it onto the text, and then repeats the *entire* process again, now predicting what comes after "The cat sat on the mat," one token at a time, until it decides the response is complete.

```mermaid
flowchart LR
    A[Tokens so far] --> B[Model calculates a probability for every possible next token]
    B --> C[Pick one token]
    C --> D[Add it to the text]
    D -->|repeat| A
```

That's it. That loop, run thousands of times per response, is how an LLM writes an entire email, poem, or piece of code. It's never planning the whole thing in advance, just repeatedly guessing "what token most plausibly comes next" based on patterns learned from enormous amounts of text during training.

This live, one-token-at-a-time generation process has a name: **inference**. It's the counterpart to training. Training happens once, ahead of time (done by a company like OpenAI or Anthropic, using enormous amounts of computing power), and is where the model learns those token probabilities from huge amounts of text. Inference is what happens every time you send it a prompt afterward: the already-trained model just runs the Step 2 loop to generate a reply. When people talk about the cost or speed of "running" an LLM, inference is almost always what they mean, training already happened long before you typed anything.

This also explains **why LLMs sometimes confidently say things that are wrong** (often called "hallucinating"). The model isn't looking facts up in a database, it's generating the statistically most plausible-*sounding* next words. Usually that lines up with the truth, because true statements are common in its training data. But it has no built-in "is this actually true?" check, it's playing an extremely good game of "what word most likely comes next," not consulting an encyclopedia.

## Step 3: the "context window" (its short-term memory)

An LLM can only look at a limited number of tokens at once, this limit is called the **context window**. Think of it like reading a novel where you can only remember the last 30 pages; anything before that has faded from memory. If a conversation gets too long, older parts can fall outside the window and the model effectively "forgets" them.

Context windows vary by model: some hold a few thousand tokens, some hold hundreds of thousands. Bigger isn't automatically better for every task, but it does mean the model can consider more of your conversation, or a longer document, at once.

## Before you hit send: a word on privacy

Talking to a friend standing next to you and mailing a sealed letter across the country are both "sending a message," but only one of them puts your words in someone else's hands along the way. Using a hosted AI model works like the letter: whatever you type travels over the internet to that company's own computers to be processed, then the reply travels back. Ollama, the free option from Chapter 0, is the "friend in the room" version instead, nothing you type ever leaves your machine.

That matters because a hosted provider handles your prompt under *their* privacy and data-retention policy, not this course's. So before you paste something into a hosted model: don't include passwords, other people's personal details, or confidential work documents, unless you've actually read that provider's policy yourself. It's the same instinct as not reading your diary out loud to a stranger on a train: once it's out, you don't control where it goes.

Combine that with what you just learned about hallucination, confidently wrong answers, plus content that leaves your machine, and one habit covers both: treat anything you send to or get back from a hosted AI tool the way you'd treat a conversation with a helpful stranger, often right, but worth checking before you hand over anything sensitive or act on anything important.

## Hands-on lab: make your first LLM call

Time to see the loop from Step 2 actually run. In this lab you'll write a tiny script that sends one prompt to an AI model and prints back what it generated, using either your free local Ollama model from Chapter 0, or a hosted OpenAI/Anthropic key if you set one up.

Full instructions: [`labs/foundations/02-first-api-call`](https://github.com/fewshot-works/zero-to-agent/tree/main/labs/foundations/02-first-api-call)

Here's what you should see (with Ollama; exact wording will vary, since the model is generating text one token at a time, not reciting a fixed answer):

```
Using provider: ollama
Prompt: In one short sentence, explain what a large language model is, as if you were talking to a curious 10 year old.
Waiting for a reply...

AI replied:
A large language model is like a computer that has read a huge number of books and websites, so it can guess what word should come next when you ask it a question!
```

## Checkpoint

<details>
<summary>What is a "token," and is it the same thing as a word?</summary>

A token is the small chunk of text an LLM actually processes, often smaller than a word (a common word might be one token; a longer or unusual word might be split into two or three). It's not the same as a word, though short common words often are exactly one token.
</details>

<details>
<summary>How does an LLM decide what to write next?</summary>

It calculates a probability for every possible next token, given everything written so far, then picks one and repeats the process one token at a time, until the response is done.
</details>

<details>
<summary>Why can an LLM confidently state something that's factually wrong?</summary>

It's generating the most statistically plausible-sounding next words based on patterns in its training data, not looking facts up in a database. There's no built-in fact-checking step: plausible-sounding and true usually overlap, but not always.
</details>

<details>
<summary>Why shouldn't you paste a password or a confidential work document into a hosted AI chatbot?</summary>

Because a hosted model runs on that provider's own computers, so your prompt travels there under their privacy and data-retention policy, not this course's. Ollama is the exception: it runs entirely on your own machine, so nothing you type into it ever leaves your computer.
</details>

## Check Your Knowledge

<details>
<summary>Click to start the quiz</summary>

<Quiz chapterId="ch2" questions={ch2Questions} />

</details>

## What's next

Now that you know an LLM is just repeatedly predicting the next token, Chapter 3 covers something you have direct control over: how you *phrase* your prompt changes what the model considers likely, and that's the entire game behind "prompt engineering."
