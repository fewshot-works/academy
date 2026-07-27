import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'Why does chunk size matter for a RAG system?',
    options: [
      'It only affects how fast the vector database can search, not what gets retrieved',
      'Chunks that are too big can drag in irrelevant text, and chunks that are too small can cut a thought off before it makes sense on its own',
      'Larger chunks always produce better answers, so bigger is always safer',
      "It doesn't matter, since the LLM re-reads the whole document at answer time anyway",
    ],
    correctIndex: 1,
    explanation: 'A chunk is the unit retrieval actually searches over. Too big and the right chunk gets diluted with unrelated content; too small and it loses the context needed to answer the question.',
  },
  {
    question: "What's the main tradeoff between fixed-size and recursive chunking?",
    options: [
      'Fixed-size is slower but more accurate; recursive is faster but less accurate',
      'Fixed-size respects sentence boundaries; recursive does not',
      'Fixed-size is simple and fast but can cut a sentence in half; recursive tries paragraph, then sentence, then character boundaries to avoid that',
      'There is no real difference; they always produce identical chunks',
    ],
    correctIndex: 2,
    explanation: "Fixed-size just counts characters and stops, sentence be damned. Recursive tries to keep natural structure intact, and only falls back to a cruder split when it has to.",
  },
  {
    question: 'What signal does semantic chunking split on, and why does it need an embedding model?',
    options: [
      'It splits every fixed number of words, and uses the embedding model only to count words',
      'It splits wherever it finds a period, and the embedding model checks that the period is real',
      'It splits where the similarity between consecutive sentence embeddings drops, since that drop signals the topic just changed',
      'It splits at exactly the halfway point of the document, using the embedding model to find the middle',
    ],
    correctIndex: 2,
    explanation: "Embeddings are the only way to measure whether two sentences are about the same thing. A similarity drop between neighbors is a proxy for 'the topic just shifted.'",
  },
  {
    question: 'In the lab, what did fixed-size chunking do that recursive chunking avoided?',
    options: [
      'Fixed-size chunking merged two unrelated stories into a single chunk; recursive kept them apart',
      'Fixed-size chunking cut a sentence in half at a chunk boundary; recursive chunking never did',
      'Fixed-size chunking called the embedding model; recursive chunking did not',
      'Fixed-size chunking produced fewer chunks than recursive chunking',
    ],
    correctIndex: 1,
    explanation: "Fixed-size just counts to 260 characters and stops mid-sentence. Recursive chunking checks paragraph and sentence boundaries first, so it only cuts mid-sentence as an absolute last resort.",
  },
];
