import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "The chapter's history note describes a famous word2vec demonstration: take the vector for \"king,\" subtract \"man,\" add \"woman.\" What was the closest result?",
    options: [
      '"prince"',
      '"queen"',
      '"crown"',
      '"castle"',
    ],
    correctIndex: 1,
    explanation: 'The chapter states this exactly: the closest result was "queen," learned purely from how words get used in text.',
  },
  {
    question: 'The chapter says the word "bank" gets embedded differently in "I deposited a check at the bank" versus "we sat on the river bank." Why?',
    options: [
      'Because the embedding model keeps a special lookup table for words with two meanings',
      'Because the model embeds the meaning of the whole sentence, not just an isolated word, so surrounding context changes the resulting vector',
      'Because "bank" splits into different tokens depending on spelling',
      'Because financial words are always embedded using negative numbers',
    ],
    correctIndex: 1,
    explanation: "The chapter is explicit: an embedding isn't a fixed lookup table of one vector per word; it reflects the meaning of the whole sentence.",
  },
  {
    question: 'Of the three distance metrics the chapter covers, which is described as the cheapest to compute, and why does that matter?',
    options: [
      "Cosine similarity, because it doesn't require any multiplication",
      'Euclidean distance, because it only uses subtraction',
      'Dot product, because a database scanning millions of vectors per query benefits from the cheapest possible calculation',
      'None of them differ in computational cost',
    ],
    correctIndex: 2,
    explanation: 'The chapter says dot product is "the cheapest of the three to compute, which matters when a database is scanning millions of vectors per query."',
  },
  {
    question: "In the lab's real run, the most similar pair scored 0.71 and the least similar pair scored 0.31. What does the chapter say could shift those exact numbers?",
    options: [
      'Nothing, they are fixed no matter what',
      'Using a different embedding model',
      'Running the script at a different time of day',
      'Changing the order the sentences are listed in the script',
    ],
    correctIndex: 1,
    explanation: 'The chapter notes "exact scores and pairing can shift a bit with a different embedding model."',
  },
];
