import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "multi_server_agent.py's mcp_servers dict starts fetch and calculator as two separate subprocesses. Do the two servers know about each other or coordinate in any way?",
    options: [
      'Yes, MultiServerMCPClient introduces them so they can divide up incoming questions',
      "No, each server is started and talked to independently over its own stdio pipe; neither is aware the other exists, it's client.get_tools() that merges their two answers into one list",
      'Yes, but only if both are listed under the same transport type',
      'No, and because of that the agent has to specify which server a call should go to',
    ],
    correctIndex: 1,
    explanation:
      "fetch and calculator are two unrelated subprocesses that never talk to each other. All the merging happens on the client side, when client.get_tools() combines what each one separately reported.",
  },
  {
    question:
      "The chapter says adding a second server to mcp_servers \"doesn't add a routing layer.\" What does that mean in practice?",
    options: [
      "MCP itself adds a hidden routing step that picks the right server automatically once there's more than one",
      "MCP's job stops at each server describing what it offers; deciding which tool fits a given question is the same ordinary tool-calling decision from Intermediate Chapter 5, just now choosing from a bigger pool of candidates",
      'Routing only becomes necessary once you connect three or more servers',
      'Each server has to declare a priority so the agent knows which one to try first',
    ],
    correctIndex: 1,
    explanation:
      "Nothing new gets built to handle multiple servers. The model makes the same kind of tool-choice call it always did, MCP just hands it a longer list of candidates to choose from.",
  },
  {
    question:
      "mcp_servers[\"fetch\"][\"args\"] in this chapter still includes --with mcp<2.0.0, the same version-skew workaround from Chapter 1. Why does a chapter about connecting two servers still need it?",
    options: [
      "The bug is between the mcp-server-fetch and mcp packages themselves, unrelated to how many servers a script connects to, so any lab that starts mcp-server-fetch needs the same pin",
      "calculator_server.py has the same bug, so the pin covers both servers at once",
      'It was left in by mistake and has no effect in this chapter',
      "It's only needed the first time uvx downloads mcp-server-fetch, and this chapter is that first time",
    ],
    correctIndex: 0,
    explanation:
      "The workaround travels with mcp-server-fetch itself, not with any particular lab. Every chapter in this track that starts mcp-server-fetch carries the same --with mcp<2.0.0 pin for the same reason.",
  },
  {
    question:
      "In the bonus section, what role does Langflow play that's different from Chapter 2's bonus?",
    options: [
      'The same role, exposing flows as a server',
      "The client role: an MCP Tools component in a flow connects out to an external server (like mcp-server-fetch) the same way client.get_tools() does in this lab's Python script",
      'Langflow cannot connect to external MCP servers, only host its own',
      'Langflow replaces the need for an MCP server entirely',
    ],
    correctIndex: 1,
    explanation:
      "Chapter 2's bonus had Langflow act as a server (Settings -> MCP Server). Here, Langflow's MCP Tools component acts as a client, pointing at an external server and pulling in its tools, the same relationship multi_server_agent.py has with mcp-server-fetch and calculator_server.py.",
  },
];
