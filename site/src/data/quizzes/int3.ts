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
    question: "The chapter describes BM25, the classic keyword-scoring half of hybrid search, as scoring documents by 'how often and how distinctively they contain the query's exact words.' What kind of thing does this catch that embeddings alone can miss?",
    options: [
      'Punctuation errors in the query',
      'An exact term that matters, like a proper noun or a specific number',
      'Whether the document is written in the same language as the query',
      'The overall reading level of the document',
    ],
    correctIndex: 1,
    explanation: 'Embeddings can miss exact terms that matter, like a proper noun or a specific number, that keyword search catches directly.',
  },
  {
    question: "The lab introduces a third fictional coffee company, Whistlepost Coffee, alongside Fernwood and Harbor Bean. Why add a third company instead of testing with just two?",
    options: [
      'To make the vector database run slower for the demo',
      "Because the facts across all three were deliberately written to sound similar, creating genuine ambiguity for retrieval to trip over, not just a two-way coincidence",
      'Because ChromaDB requires a minimum of three documents to function',
      'To test whether the model can count to three',
    ],
    correctIndex: 1,
    explanation: 'The twelve documents across three companies were deliberately written to sound similar, to stress-test retrieval the way real, messier corpora actually behave.',
  },
  {
    question: "The chapter's closing line says no single technique is the fix, they compound. What does the real lab run show that actually demonstrates this?",
    options: [
      'Metadata filtering alone was sufficient in every case tested',
      "Hybrid search pulls the right answer into contention even though it can't win outright on its own, and re-ranking is what then picks it out from that narrowed set",
      'Re-ranking alone always fixes every wrong answer, without needing the other two techniques',
      'The four techniques all produced identical results in the real run',
    ],
    correctIndex: 1,
    explanation: "Hybrid narrows the gap without flipping the top result, but gets the right answer into the top 3; re-ranking then reads the actual text and picks it correctly. The techniques compound rather than any one fixing it alone.",
  },
];
