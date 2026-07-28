import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "The lab's cache key is a hash of system + user_message together, not just the question text. Why include the system prompt?",
    options: [
      "It makes the hash function run faster",
      "The system prompt shapes what answer is correct -- if it changes, a cached answer keyed only on the question would return a stale response that no longer matches current instructions",
      "Ollama requires the system prompt to be part of every cache lookup",
      "It's a security measure to prevent cache poisoning",
    ],
    correctIndex: 1,
    explanation: "A cache key needs to capture everything that determines the answer. The question alone isn't enough -- the same question under a different system prompt can (and should) produce a different answer, so both have to be part of the key.",
  },
  {
    question: "In the rate limiter demo (capacity=2, refill_rate=1/second), requests 1 and 2 are instant but request 3 waits about a second. What does the token bucket do differently from a hard request limit that just rejects excess requests?",
    options: [
      "Nothing -- a token bucket and a hard limit behave identically",
      "A token bucket makes excess requests wait until a token refills, instead of rejecting them outright -- the request still succeeds, just later, rather than failing",
      "A token bucket only works with streaming responses",
      "A token bucket requires a database to track state",
    ],
    correctIndex: 1,
    explanation: "wait_for_token() blocks in a sleep loop until a token is available rather than raising an error. That's the core design choice of a token bucket: smooth out bursts by making requests wait their turn, not by dropping them.",
  },
  {
    question: "Streaming doesn't make the model generate a full answer any faster. What problem does it actually solve?",
    options: [
      "It reduces the total token count the model has to generate",
      "It reduces perceived latency -- the user sees the first words within milliseconds instead of staring at nothing until the entire answer is ready, even though the total generation time is the same",
      "It allows the model to skip generating tokens it's unsure about",
      "It compresses the response to use less bandwidth",
    ],
    correctIndex: 1,
    explanation: "The total time to generate the full response is unchanged. What changes is when the user sees the first evidence that something is happening -- immediately, instead of after the whole response is buffered.",
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
