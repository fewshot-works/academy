import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "Every earlier chapter's mcp_servers entry had 'command' and 'args'. This chapter's has 'url' instead. What's the practical difference?",
    options: [
      "'url' entries run faster than 'command' entries",
      "'command'/'args' tell the client how to start a server itself as a subprocess; 'url' tells the client where to find a server that's already running on its own",
      'There is no real difference, just different syntax for the same thing',
      "'url' only works with OpenAI and Anthropic, not Ollama",
    ],
    correctIndex: 1,
    explanation:
      "stdio servers are started by the client (command + args). HTTP servers run independently, the client just connects to wherever they already are (url), possibly on a different machine.",
  },
  {
    question:
      "In this lab, why does the server need to be started in a separate terminal before the client runs, unlike Chapters 1-3?",
    options: [
      'HTTP servers are slower to start than stdio servers',
      "The streamable-http transport isn't a subprocess the client launches; it's a standalone process (here, a local Uvicorn server) that keeps running on its own, the same way a server on another machine would",
      "It's a bug in langchain-mcp-adapters that will be fixed later",
      'Two terminals are required by the MCP protocol itself',
    ],
    correctIndex: 1,
    explanation:
      "That's the whole point of this chapter's swap: stdio servers are owned and started by the client process; HTTP servers are independent processes the client merely connects to.",
  },
  {
    question:
      "calculator_http_server.py's calculator() function is identical to Chapter 2's calculator_server.py. What does that show about MCP's transport layer?",
    options: [
      'The transport layer requires rewriting all tool logic to match',
      "A tool's logic and schema don't change based on transport; only how the client and server exchange bytes changes, so switching stdio for HTTP is a config change, not a rewrite",
      'HTTP transport only supports tools with string arguments',
      'stdio and HTTP servers cannot use the same @mcp.tool() decorator',
    ],
    correctIndex: 1,
    explanation:
      "@mcp.tool() and the function underneath it are transport-agnostic. Only mcp.run(transport=...) on the server and the mcp_servers config on the client change.",
  },
  {
    question:
      "If http_client_agent.py's url pointed at a server on a different machine on the internet instead of 127.0.0.1, what else in the client code would need to change?",
    options: [
      'The entire MultiServerMCPClient setup would need to be rewritten',
      'Nothing else — the url is the only thing that identifies where the server lives',
      'The tool calling logic in create_agent would need new parameters',
      "The 'transport' field would need to change to a different value",
    ],
    correctIndex: 1,
    explanation:
      "The url string is the only piece of config that says where the server is. A local 127.0.0.1 address and a remote hostname are handled identically by everything else in the client.",
  },
];
