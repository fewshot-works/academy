import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "The lab's client is created with MultiServerMCPClient(mcp_servers), even though this chapter's mcp_servers dict only lists one server. Why not a class named for a single server?",
    options: [
      "It's a naming mistake left over from an earlier draft of the library",
      'MultiServerMCPClient works identically whether mcp_servers has one entry or several; this chapter just never exercises the "multi" part, Chapter 3 is where connecting to more than one server matters',
      "It's required specifically because mcp-server-fetch needs multiple connections internally",
      'It automatically starts several copies of the same server for load balancing',
    ],
    correctIndex: 1,
    explanation:
      "The class name reflects what it's built for, not what this particular chapter uses it for. One server or several, the code is the same; Chapter 3 is where a second server actually gets added to mcp_servers.",
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
      "The chapter says the host never needs to read the server's source code to use its tools. What actually makes that possible?",
    options: [
      'uvx downloads and displays the server’s source for the host to read before first use',
      "The client asks the server, over the MCP protocol, what it offers, and the server answers with tool names, descriptions, and the exact shape of arguments each one expects, before any tool is ever called",
      'LangChain ships with every MCP server’s tools pre-registered, so no request to the server is needed',
      'The model itself infers the server’s tools by reading its Python code at runtime',
    ],
    correctIndex: 1,
    explanation:
      "That's the whole handshake: the host asks \"what do you offer?\" and gets back a self-describing list, no source reading required. This chapter's lab performs exactly that handshake against mcp-server-fetch.",
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
