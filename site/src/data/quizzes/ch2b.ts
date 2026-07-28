import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'Why shouldn\'t you paste a confidential work document into a hosted AI chatbot, but pasting it into your local Ollama setup is fine?',
    options: [
      'Hosted tools send your prompt to that provider\'s own computers, under their privacy/retention policy; Ollama runs entirely on your machine, so nothing leaves it',
      'There\'s no real difference, both are equally private',
      'Ollama is slower, so it\'s only a speed trade-off',
      'Hosted tools only store your prompt if you enable a special setting',
    ],
    correctIndex: 0,
    explanation: 'A hosted model processes your prompt on the provider\'s own servers under their policy. Ollama runs locally, so nothing you type into it ever leaves your machine.',
  },
  {
    question: 'An AI tool keeps describing "a successful entrepreneur" with the same gender and background every time you ask. What does this reflect?',
    options: [
      'An objective fact about who succeeds as an entrepreneur',
      'A deliberate choice by the AI to promote a specific group',
      'Patterns in the model\'s training data, which itself over-represents certain groups in that role, not an objective truth',
      'A bug that only happens with that specific question',
    ],
    correctIndex: 2,
    explanation: 'Models learn patterns from huge amounts of human-written text, and that text carries whatever biases and imbalances already exist in it. The output reflects those patterns, not an objective fact.',
  },
  {
    question: 'An AI confidently gives you a specific but wrong fact for a decision that actually matters (health, legal, financial). What\'s the right habit here?',
    options: [
      'Trust it, since it sounded confident',
      'Never use AI for anything important, ever',
      'Match your verification effort to the stakes, independently check anything high-stakes before acting on it',
      'Only trust answers the AI gives with a disclaimer attached',
    ],
    correctIndex: 2,
    explanation: 'The chapter\'s core habit: low-stakes, casual answers barely need checking, but anything you\'ll act on that matters (money, health, legal, safety) needs independent verification first, since the model has no built-in fact-check.',
  },
  {
    question: 'You used an AI tool to help draft a school assignment. Is it automatically fine to submit it as entirely your own work?',
    options: [
      'Yes, AI-assisted work is always treated the same as work you wrote alone',
      'No, never, using AI for schoolwork is always against the rules everywhere',
      'It depends on your school\'s specific policy on AI use and disclosure, which varies and is still evolving, check it rather than assuming',
      'Only if the AI tool is free to use',
    ],
    correctIndex: 2,
    explanation: 'Rules on AI-assisted work and disclosure vary by school, employer, and country, and are still being written. Check the actual policy instead of assuming either way.',
  },
];
