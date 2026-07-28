import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "In the lab's real run, Approach A rewrote the vague question \"wheres harbor bean get its beans\" into a clearer, well-formed question before retrieving. What happened when both versions were actually embedded and searched?",
    options: [
      "The rewritten version fixed the problem and correctly retrieved Harbor Bean's sourcing fact",
      "Both the original vague question and the clearer rewritten version retrieved the same wrong fact -- Fernwood's sourcing information -- instead of Harbor Bean's",
      "The rewritten version failed to run at all because it was too long",
      "Only the original question retrieved the wrong fact; the rewrite retrieved nothing",
    ],
    correctIndex: 1,
    explanation: "Making a question grammatically clearer doesn't change which chunk it's closest to in embedding space if the underlying bias is that Fernwood's language matches the query better than Harbor Bean's -- the lab's real run shows the rewrite made no difference to the outcome.",
  },
  {
    question: "The lab's HyDE example asks 'which company uses the fewest middlemen for sourcing,' and Harbor Bean's own text says it uses 'a single import broker.' Why did HyDE's hypothetical-answer embedding correctly retrieve Fernwood instead of Harbor Bean?",
    options: [
      "HyDE ignores Harbor Bean's chunk entirely regardless of content",
      "A broker is itself a middleman, so Harbor Bean's answer is actually wrong for the question asked; the hypothetical answer HyDE generates and embeds looks like a direct-from-farm answer, which matches Fernwood's actual sourcing text",
      "HyDE always prefers whichever chunk is alphabetically first",
      "Fernwood's chunk is simply longer, and HyDE always favors longer text",
    ],
    correctIndex: 1,
    explanation: "This is a case where the vector-search 'miss' on Harbor Bean would actually have been the wrong answer -- a broker is a middleman. HyDE's hypothetical answer, shaped like a real answer to 'fewest middlemen,' embeds closer to Fernwood's genuinely direct-from-farm sourcing description.",
  },
  {
    question: "The lab's multi-hop example uses the phrase 'a converted railway signal box' to identify a company before asking about it. Why does hop one succeed at pinning down Whistlepost Coffee specifically?",
    options: [
      "It doesn't -- multi-hop still has to guess which company matches",
      "The phrase is distinctive enough that it's essentially only true of one document in the corpus, so the first hop's retrieval confidently narrows down to Whistlepost before the second hop ever runs",
      "Railway signal boxes are mentioned in every document in the corpus",
      "Multi-hop skips the first hop entirely and searches everything at once",
    ],
    correctIndex: 1,
    explanation: "Multi-hop works precisely because the first hop's query is specific enough to have basically one right answer. Once Whistlepost is identified as 'the converted railway signal box' company, the second hop can search just its content instead of the whole corpus.",
  },
  {
    question: "Chapter 3 fixed vector search's wrong answers with metadata filtering, hybrid search, and re-ranking, all applied after a question was already embedded. How do this chapter's four techniques relate to those?",
    options: [
      "They make Chapter 3's techniques obsolete",
      "They target different failure points earlier in the pipeline (the question itself, or the number of retrieval attempts) rather than replacing Chapter 3's post-embedding fixes -- and the lab shows they don't fix the same embedding-bias problem Chapter 3's techniques do",
      "They're required before Chapter 3's techniques can run at all",
      "They only work if hybrid search is disabled",
    ],
    correctIndex: 1,
    explanation: "The chapter is explicit about this: Approach A and D in the lab hit the exact embedding bias Chapter 3 diagnosed, and rewriting/self-correction alone didn't fix it, because they never leave pure vector search. Hybrid search and re-ranking remain the actual fix for that specific problem; this chapter's techniques solve different problems (vague questions, answer-shaped retrieval, chained lookups).",
  },
];
