import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "In the real lab run, every question with only one relevant document topped out at precision@3 = 0.33, even on questions where retrieval found the right document. Why can precision never reach 1.00 there, no matter how good retrieval is?",
    options: [
      "The embedding model is too weak to do better",
      "K=3 always returns 3 documents, so 1 truly relevant document out of 3 retrieved is mechanically 1/3, regardless of how good the ranking is",
      "Precision only applies to hybrid search, not vector search",
      "The eval set was labeled incorrectly",
    ],
    correctIndex: 1,
    explanation: "Precision@k is (relevant documents retrieved) / k. If a question genuinely only has one relevant document and k=3, the best possible precision@3 is 1/3, not 1.0. That's not a retrieval failure, it's what the metric measures: how much of what you retrieved was actually useful.",
  },
  {
    question: "In the real run, baseline (vector-only) and hybrid (vector + BM25) retrieval scored exactly the same precision@3 and recall@3 on every question. Looking at the per-question output, why?",
    options: [
      "The hybrid script had a bug and silently fell back to baseline",
      "Both methods retrieved the identical set of top-3 documents for every question, only the ranking order within that set differed, and precision/recall only care about which documents were retrieved, not their order",
      "BM25 scoring was disabled by the PROVIDER setting",
      "The eval set didn't include any questions hybrid search could help with",
    ],
    correctIndex: 1,
    explanation: "Precision@k and recall@k are set-based: they only ask whether a document is in the top-k, not where. Chapter 3 already noted that hybrid narrows the score gap without always flipping which documents make the cut, this eval set is a real, measured case of exactly that.",
  },
  {
    question: "Why does evaluating a generated answer need a second LLM call (LLM-as-judge) instead of just checking whether the generated text exactly matches a reference answer?",
    options: [
      "Exact string matching is too slow to run on more than a few questions",
      "A correct answer can be worded many different ways, so a judge that reads for meaning catches correct-but-differently-worded answers that exact matching would wrongly mark wrong",
      "LLM-as-judge is required by the OpenAI and Anthropic APIs",
      "Reference answers can't be written in advance",
    ],
    correctIndex: 1,
    explanation: "\"Fernwood gives a free drink after every ten purchases\" and \"Based on the context, Fernwood Coffee Co.'s loyalty program requires 10 purchases to give customers a free drink\" say the same thing in different words. String matching would fail that pair; a judge reading for meaning passes it correctly.",
  },
  {
    question: "In the real run, the judge marked question 3 as PASS even though its own one-sentence reason said the candidate answer \"fails to provide accurate information about its location,\" half of what the question asked. What does this real result show about LLM-as-judge?",
    options: [
      "The judge model was misconfigured and needs a different prompt format entirely",
      "A judge's PASS/FAIL verdict can be inconsistent with its own stated reasoning, so judge output is a useful signal to spot-check against, not a number to trust blindly",
      "This proves LLM-as-judge should never be used for evaluation",
      "The retrieval step was broken, not the judge",
    ],
    correctIndex: 1,
    explanation: "The judge itself is just another LLM call, and this run shows it can be too lenient, even flagging a real gap in its own reasoning while still writing PASS on the first line. That's the honest limit of this technique: it's a fast, useful signal at scale, not a substitute for occasionally reading the actual answers.",
  },
];
