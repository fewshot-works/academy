import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "In the real lab run, the agent correctly said it didn't know how many locations Fernwood Coffee Co. has, even though that fact exists in the loaded documents. What actually went wrong?",
    options: [
      "The input guardrail incorrectly blocked the question",
      "The search_documents tool's vector search ranked the founding-history and bestselling-drink paragraphs above the locations paragraph for that particular query, a genuine retrieval miss, not a guardrail or hallucination issue",
      "The model hallucinated a wrong answer and the output guardrail caught it",
      "The checkpointer lost the conversation's memory",
    ],
    correctIndex: 1,
    explanation: "Nothing blocked the question and nothing was fabricated. The vector search for a generic query like \"Fernwood Coffee Co.\" simply didn't rank the right chunk first, which the lab's own evaluate.py precision@2 numbers (0.62 average) independently confirm as a real, measurable weakness.",
  },
  {
    question: "evaluate.py's LLM-as-judge section runs the full agent on each eval question and gives every question its own thread_id (eval-0, eval-1, ...) rather than reusing agent.py's shared conversation-1 thread. Why?",
    options: [
      "LangGraph requires a unique thread_id for every agent.invoke() call",
      "Reusing one thread would let earlier eval questions' context leak into later questions via the checkpointer, distorting each question's score with memory it shouldn't have",
      "It makes the script run faster",
      "It's required so the calculator and search_documents tools don't conflict with each other",
    ],
    correctIndex: 1,
    explanation: "The checkpointer's whole job is making past messages available on future turns. That's exactly right for a real conversation and exactly wrong for independent eval questions, so each one gets a fresh thread to be judged in isolation.",
  },
  {
    question: "The lab's judge marked \"Fernwood Coffee Co. has 1 location\" as a PASS against a reference answer stating three locations. What does this specific mistake demonstrate?",
    options: [
      "The judge model was misconfigured and needs a different prompt",
      "LLM-as-judge verdicts are a useful signal but not ground truth -- a small model grading another small model's work can be too lenient, even on a direct factual contradiction, so pass rates need spot-checking against the actual answers",
      "The eval set's reference answer was wrong, not the judge",
      "This proves LLM-as-judge should never be used for agent evaluation",
    ],
    correctIndex: 1,
    explanation: "This is the same limitation Intermediate Chapter 8 raised about LLM-as-judge, now shown happening on a real run: a 100% pass rate looked clean, but reading the actual graded answers revealed the judge missing a flat numerical contradiction. The fix isn't abandoning the technique, it's not trusting a pass rate you haven't spot-checked.",
  },
  {
    question: "This capstone's evaluate.py judges the full agent's answers, while Intermediate Chapter 8's evaluation judged a plain retrieve-then-answer pipeline. What does judging the full agent add that the earlier version couldn't measure?",
    options: [
      "Nothing meaningfully different -- it's the same evaluation applied to a different corpus",
      "Whether the agent chose the right tool (or combination of tools) for a question, not just whether a fixed retrieval step returned good context -- one eval question deliberately needs both the calculator and search_documents in a single correct answer",
      "The full agent version runs faster because it skips the retrieval step",
      "It replaces precision@k/recall@k entirely with a single agent-quality score",
    ],
    correctIndex: 1,
    explanation: "A fixed RAG pipeline always retrieves, so evaluating it only ever tests retrieval and generation quality. Judging the full agent also puts tool selection under test, an answer can be wrong not because retrieval failed but because the agent reached for the wrong tool, or the right tools but combined them incorrectly.",
  },
];
