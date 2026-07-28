import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "The lab's ask_research_agent is decorated with @tool and its body just calls research_agent.invoke(...). What does this \"agent-as-tool\" pattern actually let you reuse from earlier chapters to build a multi-agent supervisor?",
    options: [
      "A brand-new API that LangChain added specifically for multi-agent systems",
      "The exact same @tool decorator and create_agent machinery from Chapters 6, 7, and 9 -- an agent becomes a tool simply by wrapping its .invoke() call in an ordinary tool function, no new framework needed",
      "A separate multi-agent library that has to be installed alongside LangChain",
      "LangGraph's built-in Supervisor class, which wraps agents as tools automatically",
    ],
    correctIndex: 1,
    explanation: "The chapter is explicit about this: agent-as-tool isn't a special multi-agent feature, it's the same @tool decorator and create_agent call used since Chapter 6, just wrapping another agent's .invoke() instead of a plain function -- which is why nothing new gets installed for this chapter.",
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
    question: "The chapter describes swarm as agents handing off directly to \"whichever peer is best suited next... like a relay race passing a baton,\" with no central coordinator. According to the chapter's comparison table, what's the actual cost of removing that coordinator?",
    options: [
      "Handoffs become slower because there's no coordinator to speed things up",
      "It becomes harder to reason about who's \"in charge\" at any given moment, and control can bounce between agents in ways nobody explicitly designed",
      "Swarm requires exactly two agents and cannot scale beyond that",
      "There is no cost -- swarm strictly dominates supervisor and hierarchical",
    ],
    correctIndex: 1,
    explanation: "The chapter's table lists this explicitly as swarm's trade-off: \"Hard to trace who's in control at any moment.\" Swarm trades a coordinator's clarity for faster handoffs between peers.",
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
