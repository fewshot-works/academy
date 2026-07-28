import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'The chapter\'s history note says GPT-3\'s 2020 research paper was literally titled "Language Models are Few-Shot Learners." What did that paper actually show?',
    options: [
      'That models need to be retrained from scratch for every new task',
      'That a model could pick up a new pattern from just a few examples shown directly in the prompt, no retraining needed',
      'That zero-shot prompting always outperforms few-shot prompting',
      'That system prompts were invented that same year',
    ],
    correctIndex: 1,
    explanation: "That's exactly the few-shot technique the chapter teaches: a model matching a pattern from examples in the prompt itself, with no retraining involved.",
  },
  {
    question: "In the lab's real run, the chapter notes that zero-shot \"rambles while the other two land on a clean one-word answer.\" Which two techniques are \"the other two\"?",
    options: [
      'Few-shot and system prompt',
      'Zero-shot and few-shot',
      'System prompt and zero-shot',
      'None, all three rambled equally in the real run',
    ],
    correctIndex: 0,
    explanation: "The lab's captured transcript shows zero-shot writing a full sentence, while few-shot and the system prompt both answer with just \"negative.\"",
  },
  {
    question: "Per the chapter's diagram, what does zero-shot's answer tend to vary in, from one run to the next?",
    options: [
      'Its correctness only, never its format',
      'Its length and format, since there is no example to match',
      'Its language, sometimes switching languages mid-answer',
      'The number of tokens it is allowed to generate',
    ],
    correctIndex: 1,
    explanation: "The chapter's mermaid diagram labels zero-shot's output as varying in \"length and format,\" unlike few-shot and the system prompt.",
  },
];
