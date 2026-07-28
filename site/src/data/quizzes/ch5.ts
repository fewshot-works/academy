import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'According to the chapter\'s history note, what came first: FAISS (the fast nearest-neighbor search algorithm), or dedicated vector database products like Pinecone, Weaviate, and Chroma?',
    options: [
      'Vector database products came first, then FAISS was built to speed them up',
      'FAISS came out of Facebook AI Research in 2017; dedicated vector database products followed a few years later, mostly 2019 to 2022',
      'They were all released in the same year',
      'Chroma predates FAISS by over a decade',
    ],
    correctIndex: 1,
    explanation: "The chapter's history callout gives this exact order: FAISS in 2017, dedicated products following once real demand existed, mostly 2019-2022.",
  },
  {
    question: 'The chapter mentions optional metadata you can filter on alongside a similarity search, like "only search records where topic is pets." How deep does this chapter actually go into that feature?',
    options: [
      'It builds a full working example of metadata filtering in the lab',
      "It only mentions that metadata filtering exists, and says Intermediate covers it in more depth",
      'It says metadata filtering is impossible in vector databases',
      'It requires a separate paid product to use at all',
    ],
    correctIndex: 1,
    explanation: 'The chapter says: "You won\'t need this yet, but it\'s a useful thing to know exists. Intermediate covers it in more depth."',
  },
  {
    question: "In the lab's real run, a cat-related query returns the two dog sentences as its top two matches (0.89 and 0.84), well ahead of the third match at 0.21. What does that gap actually show?",
    options: [
      'That the vector database made an error and should be re-run',
      'That the two dog sentences are much more related in meaning to the cat query than the third sentence is, exactly the kind of gap similarity scores are meant to surface',
      'That a score of 0.21 means the third sentence is written in a different language',
      'That scores below 0.5 are automatically discarded by the database',
    ],
    correctIndex: 1,
    explanation: "The wide gap between 0.84 and 0.21 is the database doing exactly what it's for: surfacing what's actually close in meaning versus what isn't.",
  },
  {
    question: 'What distance metric does Chroma default to, and why does that matter for this course?',
    options: [
      'Chroma defaults to cosine similarity, so no extra setup is ever needed',
      'Chroma does not support choosing a distance metric at all',
      'Chroma always uses dot product and it cannot be changed',
      'Chroma defaults to Euclidean distance, so you need to explicitly ask for cosine similarity when creating a collection to match the scores used since Chapter 4',
    ],
    correctIndex: 3,
    explanation: "This course uses cosine similarity throughout, so the lab explicitly requests it rather than relying on Chroma's default.",
  },
];
