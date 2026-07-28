import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "The lab's cache demo shows a repeated question answered in 0.00 seconds the second time. What is that 0.00-second response actually doing?",
    options: [
      "The model is answering unusually fast because it recognizes the repeated question",
      "It's a dictionary lookup against previously-saved results on disk (a JSON file) -- no model call happens at all the second time",
      "Ollama has an internal cache that kicks in automatically after one request",
      "The response is pre-generated for every possible question when the script starts",
    ],
    correctIndex: 1,
    explanation: "The 0.00s isn't the model working faster -- it's the model not being called at all. The cache is a plain dictionary keyed by hash, backed by a JSON file, and a hit means the answer is read off disk instead of generated.",
  },
  {
    question: "The lab's rate limiter caps how fast requests go out rather than rejecting requests outright. What is rate limiting actually protecting?",
    options: [
      "The user's own patience, by making them wait intentionally",
      "The model provider's capacity or budget -- by capping how fast requests arrive, rate limiting prevents overwhelming what the provider can handle, rather than blocking access altogether",
      "The cache, which would otherwise fill up too quickly",
      "The network connection's total bandwidth",
    ],
    correctIndex: 1,
    explanation: "Rate limiting isn't about denying requests, it's about pacing them so the provider (its infrastructure or your budget) isn't hit faster than it can handle. That's why the token bucket makes excess requests wait instead of failing them.",
  },
  {
    question: "Streaming in this lab prints the response as it's generated instead of waiting for the whole thing. What is that mechanism actually doing, beyond just changing how output looks?",
    options: [
      "It generates the response using a smaller, faster model",
      "It prints each piece of the response as the model produces it, rather than buffering the entire response and printing it only once fully complete -- the total generation time doesn't change",
      "It skips generating parts of the response the model is uncertain about",
      "It sends the request to multiple providers at once and prints whichever responds first",
    ],
    correctIndex: 1,
    explanation: "Streaming doesn't make generation faster, it changes when you see output. Instead of silence until the full answer is ready, pieces print as they arrive, reducing perceived latency without changing the underlying generation time.",
  },
  {
    question: "The lab's rate limiter is a plain dict (tokens, capacity, refill_rate, last_refill) passed into functions, not a class. Why does this fit the token-bucket algorithm just as well as a class would?",
    options: [
      "Python dicts are faster than classes for this use case",
      "A token bucket is just a small amount of mutable state (four numbers) plus two operations on it -- a dict holding that state, updated by a plain function, expresses the same thing without adding a class just to hold four fields",
      "Classes cannot store time-based state like last_refill",
      "Rate limiting is only possible with functional programming",
    ],
    correctIndex: 1,
    explanation: "A class earns its place when it bundles meaningfully complex behavior with state. Here the 'object' is four numbers and one update rule -- a dict plus a function does the identical job with less ceremony, consistent with this curriculum's preference for the simplest structure that does the job.",
  },
];
