import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      'Which two MCP servers does the capstone agent connect to, and what does each represent?',
    options: [
      'Two copies of the same calculator server, to test load balancing',
      'calculator_server.py, a server you built and trust completely, and mcp-server-fetch, a public server whose one risky tool needs a guard',
      'Two public servers, since a capstone should avoid custom code',
      "The rogue weather server from Chapter 6, reused to demonstrate the guard again",
    ],
    correctIndex: 1,
    explanation:
      "The pairing mirrors Chapter 6's framing: one server you wrote and have good reason to trust, next to a public one you didn't write, connected via the same MultiServerMCPClient pattern from Chapter 3.",
  },
  {
    question:
      "Why does fetch_guarded check the URL's domain instead of trying to detect malicious page content?",
    options: [
      'Detecting malicious content is impossible in principle',
      "Constraining the tool call itself, not the text a model reads or writes, is the same guard-not-detect pattern Chapter 6 used for send_report, and it works regardless of how convincing an injected instruction is",
      "Domain checking is required by the MCP protocol specification",
      'fetch_guarded actually does scan for malicious content, in addition to the domain check',
    ],
    correctIndex: 1,
    explanation:
      "A fixed allowlist doesn't need to recognize an attack to stop it, it just refuses anything outside the approved set, the same reasoning Chapter 6 applied to send_report's recipient.",
  },
  {
    question:
      'What happens to the real fetch tool once fetch_guarded is built in build_agent()?',
    options: [
      "It's deleted entirely and can never be called again by any code",
      "It's kept out of the tool list handed to the model; only fetch_guarded is exposed, and fetch_guarded calls the real tool internally after its domain check passes",
      'It runs in parallel with fetch_guarded, and the model picks whichever one it prefers',
      "It's renamed to fetch_guarded, no wrapping involved",
    ],
    correctIndex: 1,
    explanation:
      "guarded_tools swaps the real fetch out for fetch_guarded in the list passed to create_agent. The model never sees or can call the unguarded version directly, fetch_guarded is the only path to it, and only after the domain check passes.",
  },
  {
    question:
      "The lab mentions Advanced Concepts: Human-in-the-Loop Approval Gates as a stronger alternative to a fixed allowlist. What does that chapter's approach require that this lab's guard doesn't?",
    options: [
      'A more expensive AI model',
      'A human available to explicitly approve, edit, reject, or respond to a paused tool call before it continues',
      'A second MCP server dedicated to approvals',
      'Nothing, they are exactly the same mechanism',
    ],
    correctIndex: 1,
    explanation:
      "A fixed allowlist runs unattended, no human needed. Human-in-the-Loop pauses execution and waits for an explicit approve/edit/reject/respond decision, more flexible, but only useful when a human is actually there to answer.",
  },
];
