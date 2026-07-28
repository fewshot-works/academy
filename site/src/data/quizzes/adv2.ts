import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "Query rewriting and HyDE both change something before the query is embedded. What's the real difference between them?",
    options: [
      "They're the same technique with two different names",
      "Rewriting makes the question clearer while staying a question; HyDE replaces the question with a hypothetical answer, on the theory that answer-shaped text embeds closer to real answer documents",
      "Rewriting only works with OpenAI, HyDE only works with Ollama",
      "HyDE always uses a larger model than the one answering the final question",
    ],
    correctIndex: 1,
    explanation: "The lab shows this directly: rewriting 'wheres harbor bean get its beans' into a clearer question didn't fix anything, but generating a plausible answer sentence and embedding that instead did.",
  },
  {
    question: "In the lab's real run, Approach D's self-correction loop graded the retrieved fact as wrong (NO) on both attempts, yet still returned the wrong final answer. What actually went wrong?",
    options: [
      "The grader was broken and should have said YES",
      "The rewrite step returned the same question unchanged, so the second attempt retrieved the identical wrong fact -- the loop's grading half worked, but its rewriting half didn't",
      "Self-correction only supports one retry, never two",
      "ChromaDB silently ignored the second query",
    ],
    correctIndex: 1,
    explanation: "Self-correction depends on two working parts, grading and rewriting. Here the grader correctly caught the mistake twice, but the rewriter failed to actually change the query, so retrying accomplished nothing -- a real, reproducible failure mode worth watching for.",
  },
  {
    question: "Why did multi-hop retrieval succeed in the lab's run while query rewriting and self-correction (both still pure vector search) hit the same wall?",
    options: [
      "Multi-hop uses a completely different embedding model",
      "Multi-hop breaks the problem into two smaller retrievals -- identify the entity, then search within it -- so no single vector comparison has to overcome the corpus's embedding bias on its own",
      "Multi-hop doesn't use embeddings at all",
      "It didn't actually succeed, the lab's output was edited to look that way",
    ],
    correctIndex: 1,
    explanation: "Query rewriting and self-correction both still boil down to one comparison between a query and the whole corpus, inheriting whatever bias that comparison has. Multi-hop's second hop searches a much smaller, already-identified slice of the corpus, so the same bias never gets a chance to dominate.",
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
