import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "In the real lab run, every question with only one relevant document topped out at precision@3 = 0.33, even on questions where retrieval found the right document. Why can precision never reach 1.00 there, no matter how good retrieval is?",
    options: [
      'The embedding model is too weak to do better',
      'K=3 always returns 3 documents, so 1 truly relevant document out of 3 retrieved is mechanically 1/3, regardless of how good the ranking is',
      'Precision only applies to hybrid search, not vector search',
      'The eval set was labeled incorrectly',
    ],
    correctIndex: 1,
    explanation: "Precision@k is (relevant documents retrieved) / k. If a question genuinely only has one relevant document and k=3, the best possible precision@3 is 1/3, not 1.0. That's not a retrieval failure, it's what the metric measures: how much of what you retrieved was actually useful.",
  },
  {
    question: "In the real run, baseline (vector-only) and hybrid (vector + BM25) retrieval scored exactly the same precision@3 and recall@3 on every question. Looking at the per-question output, why?",
    options: [
      'The hybrid script had a bug and silently fell back to baseline',
      'Both methods retrieved the identical set of top-3 documents for every question, only the ranking order within that set differed, and precision/recall only care about which documents were retrieved, not their order',
      'BM25 scoring was disabled by the PROVIDER setting',
      "The eval set didn't include any questions hybrid search could help with",
    ],
    correctIndex: 1,
    explanation: "Precision@k and recall@k are set-based: they only ask whether a document is in the top-k, not where. Chapter 3 already noted that hybrid narrows the score gap without always flipping which documents make the cut, this eval set is a real, measured case of exactly that.",
  },
  {
    question: "The chapter's \"What these numbers don't tell you\" section says a 5-question eval set is tiny enough that one question flipping from PASS to FAIL swings the pass rate by 20 points. Why does that matter for interpreting this chapter's own 100% pass rate?",
    options: [
      'It does not matter, 100% is 100% regardless of set size',
      "A single noisy or borderline judgment could have produced a very different-looking pass rate, so a small eval set's headline number deserves less confidence than a large one's",
      'It means the judge model needs to be replaced with a larger one',
      'It means precision and recall are also affected by eval set size in the same way',
    ],
    correctIndex: 1,
    explanation: 'A 5-question eval set is tiny. One question flipping from PASS to FAIL swings the pass rate by 20 points. Real evaluation sets run into the dozens or hundreds of questions specifically so one noisy result doesn\'t dominate the average.',
  },
  {
    question: "The chapter notes that recall@k is \"capped by k, not just by retrieval quality.\" What does that mean in practice for comparing recall scores across different questions in an eval set?",
    options: [
      'Recall scores are always identical across all questions regardless of k',
      'A question with more relevant documents than k can never reach recall@k = 1.0, no matter how good retrieval is, so recall should be compared across questions with the same relevant-document count, not across all of them equally',
      'Recall@k only applies to hybrid search, never to vector-only search',
      'Increasing k always decreases recall',
    ],
    correctIndex: 1,
    explanation: 'A question with 4 relevant documents can never reach recall@3 = 1.0, no matter how good the search is, because only 3 slots exist. Compare recall across questions with the same relevant-document count, not across all of them equally.',
  },
];
