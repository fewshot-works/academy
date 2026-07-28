import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "The chapter notes that re-running Scenario 4 (system prompt leak) doesn't always produce the same outcome -- sometimes the output guardrail catches it, sometimes it doesn't. What actually determines whether it gets caught?",
    options: [
      "Whether the output guardrail is enabled that particular run",
      "An accident of formatting -- whether the model happens to wrap the leaked content in valid JSON matching the expected schema -- not either guardrail actually understanding that a leak occurred",
      "Whether Ollama or a hosted provider is being used",
      "The length of the leaked system prompt text",
    ],
    correctIndex: 1,
    explanation: "Neither guardrail understands meaning here. The output guardrail only checks JSON shape, so whether a leak slips through depends on whether the model's response happens to be validly formatted that run, not on anything actually recognizing the leak.",
  },
  {
    question: "Scenario 2's prompt injection attempt is caught by check_input() before the model is ever called, while Scenario 4's leak reaches the model and only then (sometimes) gets caught by the output guardrail. What's the practical advantage of catching a problem at the input stage like Scenario 2 does?",
    options: [
      "There is no advantage -- both stages are equally good places to catch a problem",
      "It saves the cost and latency of a model call that was going to be thrown away anyway -- Scenario 4's problem isn't caught until after the (wasted) request already ran",
      "Input guardrails are more accurate than output guardrails in every case",
      "Only input guardrails can be run without an internet connection",
    ],
    correctIndex: 1,
    explanation: "An input guardrail that blocks before the model call avoids paying for and waiting on a response that was never going to be used. Output guardrails, by contrast, only catch problems after the full cost of the call has already been paid.",
  },
  {
    question: "Scenario 1 (a normal question) and Scenario 3 (a legitimate but out-of-scope question) both pass through the lab's input and output guardrails without incident. What do these two scenarios actually demonstrate, alongside the scenarios where something gets caught?",
    options: [
      "That the guardrails are unnecessary since most traffic is harmless",
      "That guardrails aren't just about catching bad input -- they also need to let normal and legitimate-but-unusual traffic through cleanly, which both scenarios' valid, schema-matching answers show happening",
      "That Scenario 3 should have been blocked and wasn't",
      "That the input guardrail only ever runs on suspicious-looking messages",
    ],
    correctIndex: 1,
    explanation: "A guardrail that blocks everything indiscriminately isn't useful. Scenario 1 and 3 show the system working as intended on ordinary traffic -- nothing to catch, valid answers pass straight through -- which matters as much as correctly catching Scenario 2 and 4's problems.",
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
