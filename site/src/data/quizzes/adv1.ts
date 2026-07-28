import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "This chapter's supervisor has two tools, ask_research_agent and ask_math_agent, but each one is actually a whole separate agent, not a plain function like calculator. What makes filling in that tool call harder for the model than calling calculator directly?",
    options: [
      "Nothing -- it's exactly as easy, since a tool call looks the same either way",
      "Delegating to another agent means trusting a whole extra reasoning loop and tool call to happen correctly downstream, not just evaluating one expression immediately",
      "ask_research_agent and ask_math_agent don't have docstrings",
      "The supervisor can only call one tool per conversation",
    ],
    correctIndex: 1,
    explanation: "calculator does one narrow thing with its argument and returns immediately. ask_research_agent's argument has to be good enough for a whole separate agent, with its own tool-calling decision to make, to act on -- which is exactly why the lab's real output shows messier arguments on the research delegation than on the math one.",
  },
  {
    question: "In the lab's real captured run, the supervisor's first tool call included extra, malformed-looking arguments (an unused 'expression' and 'object' field alongside 'topic'), yet the final answer was still correct. What does this actually demonstrate?",
    options: [
      "The lab is broken and needs debugging before it's usable",
      "A small local model's tool-calling arguments get visibly noisier once a tool's job is delegating to another agent rather than running one calculation directly -- and the underlying delegation can still work despite that noise",
      "ChromaDB silently repaired the malformed arguments",
      "The checkpointer rewrote the tool call before it was sent",
    ],
    correctIndex: 1,
    explanation: "This is a real, reproducible rough edge of asking a 3B local model to coordinate other agents instead of calling a tool directly. It's worth running the lab yourself and reading the actual tool-call arguments, not just the final answer, the same lesson Chapter 9 made about reading real transcripts.",
  },
  {
    question: "The lab's third question, \"What's 15% of the year the Eiffel Tower finished construction?\", is asked as a separate turn instead of being combined with the first question into one message. Why?",
    options: [
      "Combining them would exceed a hard message-length limit",
      "Asking two questions across one conversation lets the checkpointer's memory carry the looked-up year from one turn to the next, turning one hard single-shot coordination problem into two easier ones",
      "The math agent cannot process any question mentioning a landmark",
      "LangChain does not allow more than three tool calls in one script",
    ],
    correctIndex: 1,
    explanation: "This reuses Chapter 7's checkpointer/thread_id mechanism directly: the supervisor doesn't re-derive or re-look-up the year in turn three, it reads 1889 straight out of thread history and only asks the math agent to compute 0.15 * 1889.",
  },
  {
    question: "Given the chapter's comparison table, which pattern would fit best if a single supervisor started managing so many specialist agents that no one coordinator could reasonably route between all of them?",
    options: [
      "Supervisor, unchanged -- more specialists never change the topology",
      "Hierarchical -- nest supervisors inside supervisors so each one only has to manage a handful of team leads or specialists directly",
      "Swarm -- always the right fix for too many specialists",
      "None of these patterns handle more than two agents",
    ],
    correctIndex: 1,
    explanation: "Hierarchical exists specifically for this case: instead of one supervisor juggling a dozen specialists directly, section-level supervisors each manage a smaller group, and a top-level supervisor coordinates the section supervisors -- more hops and more upfront design, but each individual coordinator stays manageable.",
  },
];
