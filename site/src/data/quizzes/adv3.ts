import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "In the lab, the LoRA fine-tuned model correctly answered a question from its training set but confidently gave a stale answer to a question about a fact that changed afterward. What does this show?",
    options: [
      "The fine-tune failed and needs more training epochs",
      "Fine-tuning bakes facts into the model's weights at training time, so it recalls trained facts reliably but has no way to know about anything that changed after training finished",
      "LoRA only works for questions that were literally in the training data, word for word",
      "The model was hallucinating both times",
    ],
    correctIndex: 1,
    explanation: "The fine-tuned model wasn't malfunctioning, it correctly reproduced what it learned. The problem is that what it learned is frozen the moment training stops, so a fact that changes afterward doesn't update itself.",
  },
  {
    question: "Why did the base model + context (RAG-style) answer visibly react to new information in the lab, while the fine-tuned model's answer never changed no matter what context was given?",
    options: [
      "The fine-tuned model ignores all input",
      "RAG's facts live outside the model in the context you supply at request time, so changing the context changes the model's input; a fine-tuned model's facts are compiled into its weights and can't be overridden by anything you send at request time",
      "The base model is simply a better model than the fine-tuned one",
      "Context only affects models under 100 million parameters",
    ],
    correctIndex: 1,
    explanation: "This is the core tradeoff of the chapter: RAG keeps facts external and current, but needs a retrieval step every time. Fine-tuning has no retrieval step, but the only way to change what it 'knows' is to fine-tune it again.",
  },
  {
    question: "The bonus Ollama Modelfile approach bakes facts into a system prompt and saves it as a reusable model. Why isn't this the same as real fine-tuning?",
    options: [
      "It only works with Ollama, never with OpenAI or Anthropic models",
      "No model weights change -- the facts are still plain text sent to the model on every request, just saved so you don't retype them; a real fine-tune changes the weights themselves",
      "It's actually slower than a real LoRA fine-tune",
      "Modelfiles can only store one fact at a time",
    ],
    correctIndex: 1,
    explanation: "A Modelfile is prompting with less retyping -- zero-infrastructure and often good enough, but it doesn't get you the speed of a model that genuinely learned something, and it doesn't scale to a large fact set the way RAG does.",
  },
  {
    question: "Given everything this chapter and the earlier RAG chapters showed, when does fine-tuning actually earn its cost over prompting or RAG?",
    options: [
      "Always -- fine-tuning is strictly better once you're willing to pay for it",
      "When the behavior or facts are stable (not changing week to week), prompting alone can't reliably teach the behavior, and repeatedly sending the same lengthy instructions is adding real latency or token cost",
      "Never -- RAG can always be used instead",
      "Only when using a model larger than 82 million parameters",
    ],
    correctIndex: 1,
    explanation: "Fine-tuning is the most expensive of the three to get wrong -- fixing bad training data means retraining, not editing a prompt. It earns its cost specifically when the target behavior is stable and prompting/RAG's per-request overhead is a real problem.",
  },
];
