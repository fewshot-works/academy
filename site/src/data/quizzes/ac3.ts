import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "Advanced Chapter 4's INJECTION_PATTERNS scans the user's own chat message for suspicious phrases. Why doesn't that defense catch this chapter's vendor-notice attack?",
    options: [
      "It would catch it, this chapter's attack is identical to a direct injection",
      "The malicious instruction never appears in the user's message at all, it arrives later as the output of a tool call the agent made while doing an ordinary, innocent-looking task",
      "INJECTION_PATTERNS only works with Ollama, not with OpenAI or Anthropic",
      "The vendor notice is too short for pattern matching to work on",
    ],
    correctIndex: 1,
    explanation:
      "Chapter 4's filter scans the user's own typed message, and in this lab the user's request (\"summarize this vendor notice\") is completely innocent. The hidden instruction only shows up inside a document the agent reads as a tool result, there's no suspicious user input to scan in the first place.",
  },
  {
    question:
      "Why would tuning a keyword filter to also catch this chapter's hidden instruction be a losing strategy long-term?",
    options: [
      "Keyword filters can't run on tool output for technical reasons",
      "The hidden instruction is phrased like ordinary business correspondence (\"required for vendor compliance logging\"), not like an obvious command, so a filter tuned to catch this exact wording just pushes attackers to the next plausible-sounding phrasing",
      "Keyword filters are always too slow to run on every tool call",
      "It wouldn't be a losing strategy, a big enough keyword list solves it completely",
    ],
    correctIndex: 1,
    explanation:
      "Chapter 4 already showed pattern matching is an arms race for obvious commands like \"ignore previous instructions.\" It gets worse here: the attacker isn't limited to command-like phrasing at all, any polite, ordinary-sounding sentence can carry the same instruction, so there's no fixed vocabulary to defend against.",
  },
  {
    question:
      "In the lab's real run, the guarded agent still tried three separate times to email an address outside the allowlist. Why does the allowlist still count as the fix, even though the model kept trying?",
    options: [
      "It doesn't count as a fix, the model getting fooled at all is a failure",
      "The allowlist checks the recipient at the point of action, not the model's intent, so no email actually left the building on any of the three attempts, regardless of why the model kept trying",
      "The allowlist worked because the model eventually stopped trying on its own",
      "The three attempts prove the injected text was successfully detected and removed",
    ],
    correctIndex: 1,
    explanation:
      "The model's reasoning was fooled, and that's fine, models being talked into bad tool calls isn't reliably preventable. What's preventable is the consequence: the guard checks the recipient every time, independent of the model's confidence or persistence, so all three attempts were blocked before anything was sent.",
  },
  {
    question:
      "Why does the fixed recipient allowlist work as a guard without ever detecting that an injection happened?",
    options: [
      "It doesn't, the allowlist secretly relies on a hidden keyword scan of the tool's arguments",
      "It asks one narrow question, is this recipient approved, which has the same correct answer whether the send_email call came from a legitimate request or a successful injection, so it never needs to know which one happened",
      "It works only because qwen2.5:3b is a small, easily-blocked model",
      "It works by asking the model to double check its own tool calls before sending",
    ],
    correctIndex: 1,
    explanation:
      "This is the core idea of the chapter: instead of trying to tell a malicious instruction apart from a legitimate one by reading it, constrain the tool's capability so the outcome is safe either way. The allowlist doesn't care why send_email was called, only whether the recipient is one of a small, known-safe set.",
  },
];
