import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "In the lab, 'Ignore all previous instructions...' was blocked before the model was ever called, but a reworded version, 'Forget everything above...', got through. Why?",
    options: [
      "The second phrasing is grammatically different so the model treated it differently",
      "The input guardrail is a plain substring match against a fixed list of known phrases -- it only catches wording it specifically anticipated, not the underlying intent",
      "Ollama caches blocked requests and refuses to check them twice",
      "The second request used a different provider",
    ],
    correctIndex: 1,
    explanation: "check_input() does a literal substring match. Same intent, different wording, no match. This is the core limitation of pattern-based input guardrails, not a bug in the lab.",
  },
  {
    question: "In the lab's Scenario 4, a leaked system prompt came back wrapped in valid JSON matching the exact Pydantic schema, and passed the output guardrail. What does this reveal about schema validation as a guardrail?",
    options: [
      "Schema validation is useless and shouldn't be used",
      "Schema validation checks structure and types (is 'answer' a string?), not content or meaning (should this string have been said at all?) -- it can't catch a leak that happens to be syntactically well-formed",
      "The Pydantic library has a bug that needs to be reported",
      "JSON can never contain leaked information",
    ],
    correctIndex: 1,
    explanation: "Structural validation and content moderation are different problems. A perfectly valid, schema-matching JSON object can still contain something that never should have been sent -- catching that needs a check that understands meaning, not shape.",
  },
  {
    question: "Why does the lab's get_safe_reply() fail closed with a canned safe message after a second failed validation, instead of just returning the model's raw output at that point?",
    options: [
      "Because retrying twice is the maximum the Ollama API allows",
      "Because showing unvalidated output after it already failed a trust check twice means trusting exactly the thing that just failed -- a known-safe fallback preserves the guarantee that nothing unvalidated reaches the caller",
      "Because Pydantic requires exactly two validation attempts",
      "Because the raw output is always empty by that point",
    ],
    correctIndex: 1,
    explanation: "Failing closed sacrifices that one response's usefulness to preserve a stronger guarantee: nothing the caller sees ever skipped validation, even if that means occasionally showing a generic fallback instead of a real (but unverified) answer.",
  },
  {
    question: "The chapter points to Llama Guard and guardrails-ai as production alternatives to this lab's approach. What do they actually add over a pattern list and a Pydantic schema?",
    options: [
      "They eliminate the need for any input or output checking at all",
      "They replace hand-written pattern lists and single schemas with trained classifiers (for safety/content understanding) and much larger libraries of structured-output checks -- the same shape of defense, with more coverage and semantic understanding",
      "They only work with proprietary models, never open-source ones",
      "They make retries and fail-closed behavior unnecessary",
    ],
    correctIndex: 1,
    explanation: "The technique in this lab, check input, validate output, fail closed on doubt, is the right shape. Production tools scale that shape up: a trained classifier catches reworded injection attempts a pattern list would miss, and a bigger rule library catches more output problems than one schema check.",
  },
];
