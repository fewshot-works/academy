import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "In the host/client/server split, which role does mcp-server-fetch play in this chapter's lab, and how is it started?",
    options: [
      "It's the host, and it runs inside the same Python process as the agent",
      "It's the server, and MultiServerMCPClient starts it as a separate subprocess, talking to it over stdio",
      "It's the client, and it connects out to the agent",
      'It replaces the LLM entirely for this lab',
    ],
    correctIndex: 1,
    explanation:
      "mcp-server-fetch is the server: a separate program exposing a fetch tool over MCP. The script's MultiServerMCPClient plays the client, starting that server as a subprocess and talking to it over stdio, the host is the script (and the LLM it calls) that never sees the server's source code.",
  },
  {
    question:
      'Every tool in Intermediate Chapters 5 and 6 (calculator, search_wikipedia) was a Python function the reader wrote themselves. What specifically is different about the fetch tool this chapter uses?',
    options: [
      'It runs faster than a hand-written Python function',
      "It costs money to call, unlike the hand-written tools",
      "This script never defines a fetch() function: client.get_tools() asks the running MCP server what it offers and wraps whatever comes back, no glue code written for this specific tool",
      'It only works with Anthropic models',
    ],
    correctIndex: 2,
    explanation:
      "The chapter's whole point is this: the script never writes a fetch() function. get_tools() asks the server what it exposes and wraps it automatically, the same script could talk to a completely different MCP server without changing that line.",
  },
  {
    question:
      "During testing, llama3.2 occasionally called the fetch tool with start_index as the string '0' instead of the integer 0, and the server rejected the call with a real validation error. Why does that happen with an MCP server but not with the reader's own hand-written tools?",
    options: [
      'MCP servers are simply broken and reject valid input at random',
      "An MCP server enforces its declared input schema strictly, wrong types are rejected outright, while a hand-written Python function like calculator() will happily accept and coerce whatever it's given",
      'The fetch tool has no input schema at all',
      "Ollama doesn't support integer arguments",
    ],
    correctIndex: 1,
    explanation:
      "The chapter and lab both call this out as a real, observed difference: your own hand-written tools accept whatever Python hands them, but an MCP server enforces the schema it declared, a small local model sending the wrong JSON type gets a real rejection instead of silent coercion.",
  },
  {
    question:
      'The lab script pins the fetch server with `uvx --with "mcp<2.0.0" mcp-server-fetch` instead of just `uvx mcp-server-fetch`. Why?',
    options: [
      "It's a performance optimization to make the server start faster",
      "As of this writing, the latest mcp-server-fetch release imports a name that was renamed in the mcp package's newest major version, so the plain command fails with an ImportError; pinning an older, compatible mcp version works around it",
      'It reduces the number of tools the server exposes',
      "It's required by the MCP specification for all servers",
    ],
    correctIndex: 1,
    explanation:
      "This is a real, observed version-skew bug between two independently versioned packages, not a spec requirement or performance tweak. The pin works around it by keeping mcp-server-fetch on a version of the mcp package it's actually compatible with.",
  },
];
