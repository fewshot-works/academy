import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'What problem does a vector database solve that a plain Python loop does not?',
    options: [
      'It makes the embeddings themselves more accurate',
      'Speed at scale: a loop comparing a new vector against every stored vector one by one gets slow as the collection grows, while a vector database uses an index to find matches fast',
      'It removes the need for an embedding model entirely',
      'It lets you skip computing similarity scores altogether',
    ],
    correctIndex: 1,
    explanation: 'Like a librarian who already knows roughly where a new book belongs, instead of scanning every title in the building.',
  },
  {
    question: 'What gets stored in a vector database record, at minimum?',
    options: [
      'Just the metadata, not the original text',
      "The LLM's prompt and its final generated answer",
      'An embedding and the original text it came from',
      "A compressed image of the vector's coordinates",
    ],
    correctIndex: 2,
    explanation: 'Optional metadata can be attached too, for filtering alongside the similarity search.',
  },
  {
    question: 'What does "top-k nearest neighbors" mean?',
    options: [
      'The k oldest records currently in the database',
      'Given a new vector, the k stored vectors that are closest to it in meaning',
      'The k records with the shortest original text',
      'The k records tagged with the most metadata fields',
    ],
    correctIndex: 1,
    explanation: 'k is however many results you asked for, like "give me the top 3 closest matches."',
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
