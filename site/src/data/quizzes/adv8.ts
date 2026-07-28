import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "The chapter's summary table lists four pieces this capstone combines: the three-tool agent, an input guardrail, tracing, and evaluation. Three of those four are unchanged reuse from earlier chapters. What's actually new about this capstone?",
    options: [
      "A brand-new agent architecture not seen in any earlier chapter",
      "Running all four pieces together on one system, and being honest about what that combination actually reveals once tested end to end, rather than any single piece being new on its own",
      "A new tool that none of the earlier chapters used",
      "Replacing the checkpointer with a database-backed memory system",
    ],
    correctIndex: 1,
    explanation: "The chapter is explicit that the three-tool agent, guardrail, and tracing are byte-for-byte reuse. What's genuinely new is combining them into one guarded, traced, evaluated system and seeing what the combination surfaces -- like the retrieval and judge weaknesses evaluate.py catches.",
  },
  {
    question: "The capstone's evaluate.py surfaces two separate honest findings in the same run: retrieval recall@2 is a perfect 1.00, but precision@2 averages only 0.62, and the LLM-as-judge marks two wrong answers as PASS. What do these two findings have in common?",
    options: [
      "Both are caused by the exact same underlying bug in search_documents",
      "Both show a metric that looks clean at a glance (perfect recall, a 100% pass rate) hiding a real weakness that only shows up when you read past the headline number",
      "Neither finding is actually meaningful -- both are just noise from a small model",
      "Both were fixed later in the chapter by switching to a larger model",
    ],
    correctIndex: 1,
    explanation: "Recall@2 being perfect looks reassuring, but precision@2 of 0.62 means the right chunk often isn't ranked first -- and a 100% judge pass rate looks even more reassuring, but hides two answers that are actually wrong. Both are the same lesson: don't stop at the headline number.",
  },
  {
    question: "Per the capstone's architecture, check_input() runs before the agent (and its trace) is ever touched. What does that mean for a blocked message, in terms of tracing?",
    options: [
      "A blocked message still gets a full trace span, just marked as an error",
      "A blocked message produces no span and no model call at all -- tracing only starts once a message actually reaches the agent, so a blocked turn costs nothing and leaves no trace record",
      "Blocked messages are traced separately in a dedicated guardrail span",
      "The trace records the blocked message's content but not that it was blocked",
    ],
    correctIndex: 1,
    explanation: "check_input() sits in front of everything, including tracing. A message it blocks never reaches run_turn() or agent.invoke(), so there's no span, no model call, and nothing for OpenLLMetry to record for that turn.",
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
