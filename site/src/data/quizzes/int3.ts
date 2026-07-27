import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'Why can vector search alone retrieve the wrong document, even when the question names something specific?',
    options: [
      'Embeddings capture meaning, not certainty, so a wrong document can embed as more similar to the question than the right one',
      'Vector search always returns documents in alphabetical order',
      'Cosine similarity only works when the documents are exactly the same length',
      'Vector search cannot process questions that contain proper nouns',
    ],
    correctIndex: 0,
    explanation: "Two documents can land close together in vector space just from sharing surface-level wording, even if one of them isn't actually the right answer. That's exactly what happened in the lab: a competitor's fact outranked Fernwood's own answer.",
  },
  {
    question: 'What is the main limitation of metadata filtering, even though it fixes a wrong result instantly when it applies?',
    options: [
      'It only works when you already know the constraint to filter on ahead of time',
      'It makes every search slower than vector search alone',
      'It can only be used with OpenAI, not with Ollama',
      'It requires re-embedding every document in the corpus',
    ],
    correctIndex: 0,
    explanation: "Metadata filtering removes non-matching documents before ranking, which is why it works so cleanly. But it needs a known constraint, like a company name, to filter on. If the question doesn't specify one, there's nothing to filter.",
  },
  {
    question: "In the lab, hybrid search narrowed the gap but didn't flip the top result on its own. Why?",
    options: [
      'BM25 keyword scoring cannot run on the same documents as vector search',
      "The fixed 50/50 blend wasn't enough to overturn how confidently vector search preferred the wrong answer, even though keyword scoring favored the right one",
      'Hybrid search only works with OpenAI embeddings',
      'The documents were too short for BM25 to score at all',
    ],
    correctIndex: 1,
    explanation: 'BM25 did score the correct document higher for containing the distinctive word "Fernwood," but combining it with vector similarity at a fixed weight only pulled the right answer into contention, it took re-ranking to finish the job.',
  },
  {
    question: 'Why does re-ranking typically run over a handful of top candidates instead of the entire corpus?',
    options: [
      "Re-ranking with an LLM is far more expensive per document than a vector or keyword lookup, so it's only practical on a small, already-narrowed set",
      'LLMs cannot read more than one document at a time',
      'Re-ranking replaces the need for embeddings entirely',
      'Running re-ranking on more than three documents always produces an error',
    ],
    correctIndex: 0,
    explanation: 'Having an LLM actually read and judge each candidate is slow and costly compared to a similarity score. Running it over thousands of documents would be impractical, but over the top few that cheaper retrieval already narrowed down, it catches what those methods missed.',
  },
];
