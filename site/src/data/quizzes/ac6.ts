import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "This chapter groups tool-call failures into crash, omission, and value faults. Which one does this chapter's lab actually simulate?",
    options: [
      "Crash fault -- the tool call raises an exception",
      "Omission fault -- the tool call returns an empty string",
      "Value fault -- the tool call returns something, but it's truncated and wrong",
      "All three, simulated at once in a single fault",
    ],
    correctIndex: 2,
    explanation:
      "The fault injector truncates the response to 40 characters instead of raising an exception or returning nothing. The tool still returns a normal-looking string, just an incomplete one -- exactly the definition of a value fault, and the chapter explains why it picked this one: it's the type that gives no signal anything went wrong.",
  },
  {
    question:
      "The chapter opens with Netflix's Chaos Monkey, a tool that killed production servers on purpose during business hours. What's the actual point of doing that?",
    options: [
      "To make the site go down as a stress test of the on-call team's response time",
      "To find out how the system behaves when something breaks, under controlled conditions, before a real unplanned outage finds out for you",
      "To punish servers that were running slowly",
      "It's purely a historical anecdote with no connection to this chapter's lab",
    ],
    correctIndex: 1,
    explanation:
      "Servers were going to fail eventually regardless. Chaos Monkey's job was making sure that failure got tested on a Tuesday afternoon with engineers watching, instead of for the first time during a real 2am outage. This chapter's lab does the same thing in miniature: it deliberately corrupts a tool's response to see how the agent handles it, rather than only ever testing the happy path.",
  },
  {
    question:
      "`look_up_order_guarded` retries once if the response looks incomplete. What does it do if that retry ALSO comes back looking incomplete?",
    options: [
      "It retries again, up to a fixed maximum number of attempts",
      "It raises an exception so the agent's own error handling takes over",
      "It gives up and returns a plain \"temporarily unavailable\" message instead of passing broken data along",
      "It silently returns the truncated result anyway, same as the naive tool",
    ],
    correctIndex: 2,
    explanation:
      "The guard only retries once. If the second attempt still fails the `\"$\" not in result or \"status:\" not in result` check, it returns a clear, honest message the model can act on -- not the truncated data, and not an unhandled exception. The point isn't infinite retries, it's making sure the model is never handed data that looks real but isn't.",
  },
  {
    question:
      "AgentChaos tested 65 fault configurations across multiple different backbone LLMs. Besides finding that every agent system degraded, what else did it find that stayed consistent across those different models?",
    options: [
      "The dollar cost of running each agent system",
      "Which agent system handled faults best -- robustness came from how the agent was built, not from which model powered it",
      "The exact wording of each model's error messages",
      "Nothing stayed consistent -- results varied entirely by model",
    ],
    correctIndex: 1,
    explanation:
      "The chapter's ecosystem section calls this out specifically: the ranking of which agent systems handled faults best stayed the same regardless of which backbone model was plugged in. That's a meaningful finding -- it means fault tolerance is a property of the agent's own code (retries, validation, guards), not something you can fix just by upgrading to a smarter model.",
  },
];
