import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'What is a "token"?',
    options: [
      'Always exactly one whole word',
      'The small chunk of text an LLM actually processes, often smaller than a whole word',
      'A unit used to measure how much an API call costs, unrelated to the text itself',
      'A special character marking the end of a sentence',
    ],
    correctIndex: 1,
    explanation: 'A common short word is often one token, but longer or unusual words get split into smaller pieces.',
  },
  {
    question: 'How does an LLM decide what to write next?',
    options: [
      'It looks up the answer in a built-in database of facts',
      'It plans out the entire response in advance, then writes it',
      'It calculates a probability for every possible next token and picks one, repeating that one token at a time',
      'It copies the closest matching sentence from its training data word-for-word',
    ],
    correctIndex: 2,
    explanation: 'That loop, run thousands of times per response, is the entire trick behind an LLM writing anything.',
  },
  {
    question: 'Why can an LLM confidently state something that is factually wrong?',
    options: [
      "It's deliberately programmed to lie some percentage of the time",
      'It generates the most statistically plausible-sounding next words, with no built-in fact-checking step',
      'It only happens with older, cheaper models',
      'It happens because the context window is set too large',
    ],
    correctIndex: 1,
    explanation: 'Plausible-sounding and true usually overlap, since true statements are common in training data, but there is no guarantee.',
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
