import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "A2A reached a versioned 1.0 milestone with a multi-vendor steering committee and six-language SDKs before this track added a chapter on it. Why does that maturity matter for the decision to write hands-on material about it?",
    options: [
      "A protocol with real governance, adoption, and a stable version is worth building a lab around, unlike an early experiment whose API might change before the lab is even published",
      "It means A2A is faster than MCP at runtime",
      "It's required by MCP's own specification as a dependency",
      "It means A2A replaces the need to learn MCP first",
    ],
    correctIndex: 0,
    explanation:
      "Maturity and governance signals (versioned releases, multi-vendor backing, stable SDKs) are what make a protocol safe to build a lab around, a lab written against something still shifting week to week would likely break. This is unrelated to runtime speed, spec dependencies, or replacing MCP.",
  },
  {
    question:
      "orchestrator.py lists delegate_to_wikipedia_agent before delegate_to_calculator_agent in the tools list. What does the lab's README say drove that ordering?",
    options: [
      "A2A itself has no ordering requirement, it's an observed quirk of llama3.2 being noticeably more reliable at calling the second-listed tool correctly when only two tools were available",
      "A2A requires tools to be listed alphabetically by remote agent name",
      "The Wikipedia agent must always be discovered before the Calculator agent can start",
      "LangChain's create_agent only supports two tools if they're passed in a specific order",
    ],
    correctIndex: 0,
    explanation:
      "This is a small-model quirk, not a protocol rule: swapping the order made the calculator question noticeably less reliable in testing. Neither A2A, agent startup order, nor create_agent itself impose any such ordering requirement.",
  },
  {
    question:
      "Both calculator_agent.py and wikipedia_agent.py must already be running before orchestrator.py starts. Which earlier chapter's lab already required this same setup, and why?",
    options: [
      "Chapter 4's HTTP server lab, because a server reached over HTTP runs independently and isn't started by whoever connects to it, unlike Chapters 1-3's stdio servers the client launched itself",
      "Chapter 2's own-server lab, because MCP servers always require two terminals",
      "Chapter 6's security lab, because a rogue server must be started separately from the client for the guard to work",
      "No earlier chapter required this, it's new to A2A",
    ],
    correctIndex: 0,
    explanation:
      "Chapter 4 first introduced the two-terminal requirement for exactly this reason: an HTTP (or in this case A2A) server runs on its own and has to already be up before a client can connect, unlike the stdio servers Chapters 1-3 started as subprocesses.",
  },
  {
    question:
      "calculator_agent.py and wikipedia_agent.py run as two completely separate processes on two different ports, and neither script imports or references the other. What does that isolation actually buy the lab?",
    options: [
      "Either agent can be swapped, restarted, or replaced independently, orchestrator.py only needs a running URL and a fetchable Agent Card, not access to the other agent's code",
      "It's required, A2A agents are technically incapable of running in the same process",
      "Nothing, it's just how the example happens to be organized",
      "It means the two agents are load-balanced copies of each other",
    ],
    correctIndex: 0,
    explanation:
      "Because orchestrator.py only depends on each agent's Agent Card and URL, not its source, either remote agent could be rewritten, moved to another machine, or swapped for someone else's implementation entirely without orchestrator.py changing at all. That decoupling, not a technical requirement of A2A itself, is what running them as separate processes demonstrates.",
  },
];
