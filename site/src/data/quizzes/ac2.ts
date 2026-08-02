import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "Per the chapter, hosted LLM APIs typically bill input tokens and output tokens at different rates. What does that mean for a long, resent conversation history?",
    options: [
      "Nothing, only the model's final answer counts toward the bill",
      "Every token in the history you resend is billed again on every turn, even the parts the model didn't need to answer this specific question",
      "Older messages in the history are automatically billed at a discount the longer they've been in the conversation",
      "Conversation history is free, only the newest message in a call is ever billed",
    ],
    correctIndex: 1,
    explanation:
      "Chat APIs are stateless. Whatever you didn't resend, the model has no memory of. That means a full, unmanaged history gets billed in full on every single turn, whether or not the model actually needed all of it to answer this particular question, which is exactly the waste context trimming targets.",
  },
  {
    question:
      "In the lab's real run, the trimmed conversation used about a third fewer tokens and still answered correctly. What made that trim safe, specifically?",
    options: [
      "Trimming is always safe, any summary works as long as it's shorter than the original",
      "The one-line summary happened to preserve the exact fact the final question needed, the user's plan tier",
      "The model was told which parts of the history to ignore",
      "Shorter prompts are always answered more accurately regardless of content",
    ],
    correctIndex: 1,
    explanation:
      "The trim wasn't safe because it was short, it was safe because the summary kept the one detail the next question actually depended on. If a different later question had needed some other fact that got compressed away instead, the trimmed version would have had no way to recover it, that's the real risk in any context-trimming strategy.",
  },
  {
    question:
      "How does provider-native prompt caching (this chapter) actually differ from the response caching covered in Production Concerns Chapter 6?",
    options: [
      "They're the same technique with two different names",
      "Chapter 6's cache returns a stored full response instantly on an exact repeat question, skipping the model call entirely; prompt caching reuses computation over a repeated prefix even when the rest of the prompt is different every time, and still calls the model",
      "Prompt caching only works with Ollama, response caching only works with hosted APIs",
      "Response caching is faster but prompt caching is cheaper, otherwise they solve the same problem",
    ],
    correctIndex: 1,
    explanation:
      "Chapter 6's cache is exact-match: hash the whole prompt, and on a repeat, return the stored answer with no model call at all. Prompt caching works even when the user's actual question changes every call, because it only reuses computation over a shared, unchanged prefix (a long system prompt or reference document), the model still runs, it just doesn't reprocess the part that hasn't changed.",
  },
  {
    question:
      "In the lab's real run, the large model also got the logic puzzle wrong, just differently than the small model did. What's the correct takeaway about model right-sizing?",
    options: [
      "Right-sizing failed, so it isn't a useful technique",
      "Routing a harder task to a larger model is still the reasonable move, but it's a bet worth checking, not a guarantee, the same way Intermediate Chapter 8's evaluation habits check any other pipeline's output",
      "The small model should have been used instead, since neither model got it right",
      "The puzzle was unfair and shouldn't have been used to test right-sizing",
    ],
    correctIndex: 1,
    explanation:
      "Right-sizing decides how much reasoning budget a task deserves, it doesn't guarantee the model you route it to will get the answer right. The small model's reasoning was actively broken (it invented a fourth racer in a three-person race); the large model's reasoning held together but still landed on the wrong order. That's the honest result: bigger is a reasonable bet, and you still have to check it landed.",
  },
  {
    question:
      "Per the chapter, what's the actual trade-off with batch APIs (OpenAI's Batch API, Anthropic's Message Batches API)?",
    options: [
      "They're strictly better than a normal API call, cheaper with no downside",
      "They only work for embedding requests, not chat completions",
      "You give up an immediate response, results typically arrive within a window like 24 hours, in exchange for a meaningful discount, a good trade for backlog work but a bad one for a live user waiting on an answer",
      "They require switching to a different, incompatible model family",
    ],
    correctIndex: 2,
    explanation:
      "Batching trades turnaround time for cost: a provider can pack asynchronous requests into spare capacity, typically completing them within a set window (often 24 hours), at a real discount. That's a good trade for a backlog job like overnight ticket classification, and a bad one for a chatbot answering a person who's waiting right now.",
  },
  {
    question:
      "The chapter uses tiktoken to count tokens across all three providers (Ollama, OpenAI, and Anthropic). Why is that count only an approximation for two of the three?",
    options: [
      "tiktoken is OpenAI's own tokenizer, so it matches Ollama's and Anthropic's tokenization only approximately, not exactly, it's used as a consistent ruler for comparison, not an exact count for every provider",
      "tiktoken only counts English words, not tokens, so the numbers are never accurate for any provider",
      "tiktoken requires an API call to each provider to get an exact count, which the lab skips to save cost",
      "The approximation only matters for Ollama, tiktoken is exact for both OpenAI and Anthropic",
    ],
    correctIndex: 0,
    explanation:
      "tiktoken is OpenAI's tokenizer. Anthropic and Ollama's underlying models don't necessarily split text into tokens the same way, so a tiktoken count is a consistent, close ruler for comparing \"more\" against \"fewer\" across providers, not a byte-for-byte accurate count for every one of them.",
  },
];
