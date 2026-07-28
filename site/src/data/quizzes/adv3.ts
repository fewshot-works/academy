import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "The lab's LoRA fine-tune trains only 147,456 of distilgpt2's 82 million total parameters, and the whole training run finishes in seconds on a laptop CPU with no GPU. What does that gap between 147,456 and 82 million actually buy?",
    options: [
      "Nothing -- training all 82 million parameters would take the same amount of time",
      "LoRA freezes the original 82 million parameters and trains a small set of added parameters instead, which is why a training run that would otherwise need a GPU and real time finishes on an ordinary laptop CPU in seconds",
      "147,456 parameters is a bug -- the fine-tune should be training the full model",
      "The small parameter count means the fine-tune can only learn a single fact",
    ],
    correctIndex: 1,
    explanation: "This is the core mechanic of LoRA: instead of updating the model's original weights, it adds a small number of new trainable parameters alongside them. Training 147,456 numbers instead of 82 million is what makes CPU-only, seconds-long fine-tuning possible at all.",
  },
  {
    question: "On the lab's trained question, the base model with no context and no fine-tune simply answered 'No.' What does that specific answer show?",
    options: [
      "The base model is broken and needs to be reinstalled",
      "A model given neither retrieved context (RAG) nor fine-tuned knowledge has nothing to work with on a question outside its training data, so it can only guess -- and guesses badly",
      "The question itself was invalid and should have been rejected",
      "\"No\" is actually the correct answer, and RAG/fine-tuning both got it wrong",
    ],
    correctIndex: 1,
    explanation: "The bare base model isn't choosing to be unhelpful -- it genuinely has no path to the answer. Approach B (context) and Approach C (fine-tuned) each solve that gap differently, but the base model with neither shows what having nothing looks like.",
  },
  {
    question: "Given everything the chapter's three approaches (base model, RAG-style context, fine-tuning) showed, why do production systems often use fine-tuning and RAG together rather than picking just one?",
    options: [
      "They can't actually be combined -- a model is either fine-tuned or RAG-based, never both",
      "Fine-tuning shapes how the model behaves and responds, while RAG supplies whatever facts are currently true -- together they cover both what fine-tuning alone can't (facts that change) and what RAG alone can't (consistent style or behavior)",
      "Combining them is purely a cost-saving measure with no functional benefit",
      "RAG makes fine-tuning entirely unnecessary in every case",
    ],
    correctIndex: 1,
    explanation: "The three approaches solve different problems: fine-tuning bakes in stable behavior, RAG keeps facts current. A production system often needs both a consistent voice/behavior and up-to-date facts, which is why the two are frequently combined instead of treated as a single either/or choice.",
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
