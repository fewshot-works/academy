import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'What is an embedding, in one sentence?',
    options: [
      'A compressed version of the text that can be decoded back to the original exactly',
      'A list of numbers representing the meaning of a piece of text, positioned so similar meanings end up with similar numbers',
      'A count of how many times each word appears in the text',
      'A translation of the text into a different language',
    ],
    correctIndex: 1,
    explanation: 'Like coordinates on a giant map of meaning, similar meaning lands close together, even without shared words.',
  },
  {
    question: 'What does cosine similarity actually measure?',
    options: [
      'The exact number of words two sentences have in common',
      'How many dimensions a vector has',
      'The angle between two vectors: near 1 means very similar meaning, near 0 unrelated, near -1 close to opposite',
      'The total straight-line distance between two vectors, regardless of direction',
    ],
    correctIndex: 2,
    explanation: "It's a direction check, not a word-overlap check. Two sentences can share zero words and still score near 1.",
  },
  {
    question: 'Why can you not compare an embedding from one model against an embedding from a different model?',
    options: [
      'You can, as long as both sentences are written in English',
      "Each model builds its own 'map' with its own layout and dimensions, so distances between vectors from different models are meaningless",
      'Embeddings from different models are always identical for the same sentence',
      'You can, but only after dividing each vector by its own length',
    ],
    correctIndex: 1,
    explanation: 'Two different models can place the same sentence in completely different coordinates.',
  },
  {
    question: 'Besides cosine similarity, what is another way to measure distance between vectors, and how is it different?',
    options: [
      'Alphabetical distance, which sorts vectors by the words they came from',
      'Token distance, which counts how many tokens apart the two vectors are',
      "Euclidean (L2) distance, which measures straight-line distance and is sensitive to a vector's length, not just its direction",
      'Training distance, which measures how far apart the two models were trained in time',
    ],
    correctIndex: 2,
    explanation: 'Dot product is the third option mentioned in the chapter, cheapest to compute, and matches cosine similarity once vectors are normalized.',
  },
];
