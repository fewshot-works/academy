import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "Per the capstone's summary table, which chapter's piece is responsible for \"finding the chunks most related to a question, fast\"?",
    options: [
      'Chapter 2',
      'Chapter 4',
      'Chapter 5',
      'Chapter 6',
    ],
    correctIndex: 2,
    explanation: 'The table lists "Storing and searching vectors" under Chapter 5, with "Finds the chunks most related to a question, fast" as what it does here.',
  },
  {
    question: 'The chapter says two things are new in this capstone, and both are "small steps, not new concepts." One is persistent storage. What\'s the other?',
    options: [
      'A completely new embedding model',
      'A real question loop that keeps asking until you tell it to quit, instead of one hardcoded question',
      'A brand-new LLM provider not used in earlier chapters',
      'A web interface instead of a terminal script',
    ],
    correctIndex: 1,
    explanation: 'The chapter states this exactly: "A real question loop instead of one hardcoded question... keeps asking \'what\'s your next question?\' until you tell it to quit."',
  },
  {
    question: 'The closing 💡 bonus suggests ways to keep playing with the capstone bot before starting Intermediate. Which of these does it specifically suggest?',
    options: [
      'Deploying the bot to a cloud server',
      'Feeding it a public-domain book and asking it questions nobody has asked before',
      'Rewriting it in a different programming language',
      'Connecting it to a paid vector database',
    ],
    correctIndex: 1,
    explanation: 'The closing bonus paragraph suggests exactly this, alongside swapping in your own notes or exploring Ollama\'s and Hugging Face\'s other models.',
  },
];
