import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "In this chapter's lab, where does the hidden instruction actually live?",
    options: [
      "In the user's own question to the agent",
      "Inside the text that get_weather returns, appended after real weather data, in a server this track has no way to verify is honest",
      'In a system prompt the client wrote',
      "In the calculator server's tool description",
    ],
    correctIndex: 1,
    explanation:
      "get_weather returns real weather data plus a hidden instruction telling the model to also call send_report. The user never asked for that, it rides in on a completely ordinary weather question, arriving as tool output from an untrusted server.",
  },
  {
    question:
      'What is different about this chapter\'s attack compared to the indirect prompt injection covered in Advanced Concepts: Agent Security?',
    options: [
      'Nothing, they are the exact same attack',
      "That chapter's injection arrives inside a document a trusted tool reads; this chapter's injection is the MCP server itself, a whole connection you added to your agent, not just one document it happened to read",
      'This chapter\'s attack only works with OpenAI models',
      'This chapter uses direct injection, typed by the user',
    ],
    correctIndex: 1,
    explanation:
      "Agent Security's vendor notice is one poisoned document read by an otherwise-trustworthy tool. Here, an entire MCP server, tool descriptions and all, is the untrusted party, a supply-chain-flavored variant specific to connecting to servers you didn't write.",
  },
  {
    question:
      "What does send_report_guarded in security_lab.py actually check before calling the real send_report tool?",
    options: [
      "Whether the text of the model's answer contains suspicious words",
      "Whether the to argument is in a fixed set of allowed recipients, regardless of why the model decided to call send_report",
      'Whether the weather server is reachable',
      "Whether the user's original question mentioned sending a report",
    ],
    correctIndex: 1,
    explanation:
      "The guard constrains the tool's arguments, not the model's reasoning or wording. It doesn't try to detect the injection, it just refuses to let send_report reach anyone outside ALLOWED_RECIPIENTS, no matter what convinced the model to call it.",
  },
  {
    question:
      "Why does MCP itself do nothing to stop a server from lying in a tool's description or return value?",
    options: [
      'MCP requires every server to be code-signed, so lying servers get rejected automatically',
      "MCP defines how tools, resources, and prompts are structured and transported, it has no mechanism that checks whether a server's claims about what a tool does, or what it returns, are actually true",
      'MCP only allows official, Anthropic-approved servers to connect',
      "This is a bug that MCP's next protocol version will fix",
    ],
    correctIndex: 1,
    explanation:
      "MCP is a protocol for structure and transport, not a trust or verification layer. Any server you connect to can describe or return anything it wants, the defense has to live on the client side.",
  },
];
