import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'Why does the capstone bot use a persistent vector database instead of the in-memory one from Chapter 6?',
    options: [
      'Persistent storage makes the embeddings themselves more accurate',
      'So documents only need to be embedded once, since an in-memory database disappears the moment the script ends',
      'It is required because Ollama cannot work with in-memory databases',
      'It is needed to support more than one document at a time',
    ],
    correctIndex: 1,
    explanation: "Chapter 6's bot rebuilt the database from scratch every run; this one saves it to disk so later runs skip straight to answering.",
  },
  {
    question: 'What happens if you ask the capstone bot a question that is not covered by either sample document?',
    options: [
      'The bot automatically searches the internet instead',
      'The bot throws an error and refuses to answer',
      'It still returns its top-k closest chunks, even though they are not relevant, so a well-behaved model should say it does not know rather than guess',
      "The bot always replies 'I don't know' for any question that isn't an exact quote from the documents",
    ],
    correctIndex: 2,
    explanation: 'Same "reduces but does not eliminate hallucination" point from Chapter 6. A weaker model may still guess anyway.',
  },
  {
    question: 'What is the one change needed to point this bot at your own notes instead of the sample documents?',
    options: [
      'Rewrite the embedding logic to match your file format',
      'Nothing in the code, just replace the files in the docs/ folder with your own .txt files',
      'Retrain the LLM on your documents first',
      'Change the PROVIDER setting in .env',
    ],
    correctIndex: 1,
    explanation: 'The script reads chunks from whatever .txt files it finds in that folder.',
  },
];
