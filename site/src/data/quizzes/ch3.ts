import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "What's the difference between zero-shot and few-shot prompting?",
    options: [
      'Zero-shot costs money to run; few-shot is free',
      'Zero-shot asks the question with no examples; few-shot shows a couple of worked examples first so the model matches that shape',
      'Few-shot requires retraining the model first',
      'Zero-shot only works with hosted APIs, and few-shot only works with Ollama',
    ],
    correctIndex: 1,
    explanation: "Few-shot doesn't retrain anything permanently. The model just matches the pattern you demonstrated for that one conversation.",
  },
  {
    question: 'Why does a system prompt behave differently than phrasing the same thing as a regular user message?',
    options: [
      'System prompts are secretly routed to a larger, more powerful model',
      "There's no real difference, it's just a naming convention",
      'Most chat APIs keep the system prompt in its own separate field, which the model treats as a standing rule for the whole conversation',
      'System prompts can only be used once per conversation',
    ],
    correctIndex: 2,
    explanation: 'Think of it as standing orders given once, instead of repeating the same instructions with every request.',
  },
  {
    question: 'When would few-shot prompting be a better choice than writing a longer zero-shot instruction?',
    options: [
      'When you want the cheapest possible API call, regardless of quality',
      'When the model does not support system prompts',
      'Never, zero-shot is always at least as good',
      'When the output needs a specific, consistent shape that is easier to demonstrate with examples than to describe in words',
    ],
    correctIndex: 3,
    explanation: 'A fixed label, a JSON structure, or a particular tone is often easier to show than to explain accurately.',
  },
];
