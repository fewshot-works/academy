import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "Why does pausing an agent for a human decision require a checkpointer, when Chapter 7's calculator and search_wikipedia calls never needed one?",
    options: [
      "It doesn't, checkpointers are unrelated to human-in-the-loop pausing",
      "agent.invoke() actually returns while paused, sometimes for a long time in a real app, and the checkpointer is what preserves the conversation so far so it can be resumed later on the same thread",
      "A checkpointer is only needed to make calculator and search_wikipedia run faster",
      "Checkpointers are required by every LangGraph agent regardless of whether anything pauses",
    ],
    correctIndex: 1,
    explanation:
      "A paused agent isn't idling in memory, the process is free to do something else while it waits. The checkpointer writes down everything said so far so a later Command(resume=...) call on the same thread can pick up exactly where things left off.",
  },
  {
    question:
      "This chapter's lab only lists send_email in HumanInTheLoopMiddleware's interrupt_on. What happens to calls to calculator, which isn't listed at all?",
    options: [
      "They're blocked entirely, since only listed tools are allowed to run",
      "They run immediately with no pause, interrupt_on only intercepts tool names it's explicitly told to watch, anything else is auto-approved by default",
      "They pause the same way send_email does, just with a shorter timeout",
      "They require a separate middleware to be added before they can run at all",
    ],
    correctIndex: 1,
    explanation:
      "HumanInTheLoopMiddleware only gates the tool names it's told about. calculator and search_wikipedia aren't mentioned in interrupt_on, so they run exactly as they did in earlier chapters, no pause at all.",
  },
  {
    question:
      "In the lab's real run, the second refund request was rejected. Did send_email's actual Python body run for that call?",
    options: [
      "Yes, it ran but the email was deleted afterward",
      "No, a rejection means the real tool is never executed at all, the agent instead receives a synthetic result standing in for it",
      "Yes, rejection only prevents the tool's return value from being shown to the user",
      "It depends on whether the model retries the call afterward",
    ],
    correctIndex: 1,
    explanation:
      "A reject decision means the tool's code never runs, full stop. The agent gets a synthetic message in its place (the rejection reason here) and has to respond without any real send_email side effect having occurred.",
  },
  {
    question:
      "How does this chapter's approval gate differ from Chapter 3's recipient allowlist on send_email?",
    options: [
      "They're the same thing, both automatically decide whether a tool call is allowed to proceed",
      "The allowlist automatically constrains what the tool is allowed to do, with no pause at all, while this chapter's gate pauses execution and defers the actual decision to a human, for any call to a listed tool regardless of reason",
      "The approval gate replaces the need for a checkpointer entirely",
      "The allowlist only works with local models, while the approval gate only works with hosted providers",
    ],
    correctIndex: 1,
    explanation:
      "Chapter 3's allowlist runs automatically, every time, checking one narrow condition (is this recipient approved). This chapter's gate doesn't decide anything by itself, it pauses the call and waits for a human's explicit approve/edit/reject/respond decision, whether the call turns out to be legitimate, mistaken, or malicious.",
  },
];
