import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'As a rule of thumb, the chapter says 1 token is roughly ¾ of an English word. Using that rule, roughly how many tokens is a 100-word paragraph?',
    options: [
      'About 75',
      'About 100',
      'About 130',
      'About 400',
    ],
    correctIndex: 2,
    explanation: 'The chapter states this directly: "a 100-word paragraph is roughly 130 tokens."',
  },
  {
    question: "The chapter distinguishes \"training\" from \"inference.\" What's the actual difference?",
    options: [
      "They're two names for the exact same step",
      'Training happens once, ahead of time, where the model learns token probabilities from huge amounts of text; inference is what happens every time you send it a prompt afterward, running the predict-one-token-at-a-time loop',
      'Inference happens once; training happens on every request you send',
      'Training only applies to hosted models, inference only applies to Ollama',
    ],
    correctIndex: 1,
    explanation: 'The chapter is explicit: training is a one-time, upfront process done by a company like OpenAI or Anthropic; inference is what runs every time you send a prompt to the already-trained model.',
  },
  {
    question: "Per the chapter's privacy section, what's the practical difference between talking to Ollama and talking to a hosted model like OpenAI or Anthropic?",
    options: [
      "There's no real difference, both send your text to a company's servers",
      "Ollama runs entirely on your own machine so nothing you type ever leaves it; a hosted model sends your prompt to that company's own computers, under their privacy and data-retention policy",
      'Hosted models never actually process your prompt, only Ollama does',
      'Ollama requires you to accept the same privacy policy as the hosted providers',
    ],
    correctIndex: 1,
    explanation: 'The chapter uses a "friend in the room" (Ollama) vs. "sealed letter across the country" (hosted model) analogy to make exactly this point.',
  },
  {
    question: 'What is the "context window"?',
    options: [
      'The limited number of tokens an LLM can consider at once, like its short-term memory',
      'The pop-up box where you type your prompt',
      'The amount of time the model takes to generate a reply',
      'The maximum number of tokens the model is allowed to generate before stopping',
    ],
    correctIndex: 0,
    explanation: 'Like reading a novel where you can only remember the last 30 pages, anything older has faded from memory.',
  },
];
