import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "multi_server_agent.py's mcp_servers dict has two entries, fetch and calculator. What does client.get_tools() return?",
    options: [
      'Two separate tool lists that have to be merged by hand',
      'One combined list of tools from both servers, with no indication in the agent code of which server each tool came from',
      'Only the tools from whichever server was listed first in the dict',
      'A single merged tool that can do both fetching and arithmetic',
    ],
    correctIndex: 1,
    explanation:
      "MultiServerMCPClient starts every server in the dict and asks each one \"what do you offer?\", then hands back one flat list. The agent that receives it has no idea, and doesn't need to know, which server any given tool came from.",
  },
  {
    question:
      "The lab's README describes an early version of the question ('What's 12% of 850?') that made llama3.2 call fetch instead of calculator, and sometimes get the math wrong. What does that show?",
    options: [
      'The calculator server was broken and needed to be restarted',
      "Having the right tool available doesn't guarantee the model picks it; a smaller model can judge a less-suited tool as more likely to help, based on wording alone",
      'MCP servers must be listed in the correct order or they get ignored',
      'The fetch server silently overrides other servers when both are connected',
    ],
    correctIndex: 1,
    explanation:
      "Both servers correctly advertised what they offer. The model still chose to search the web over calling a tool literally named calculator, until the question named the tool explicitly. That's model behavior, not a server or protocol bug.",
  },
  {
    question:
      "calculator_server.py in this lab's folder is identical to Chapter 2's. Why copy it instead of importing it from the Chapter 2 folder?",
    options: [
      'Python cannot import files from other directories',
      "Every lab folder in this project is self-contained and copy-paste runnable on its own, no shared library across labs, so each one carries its own copy of anything it needs",
      'The calculator logic actually had to change for this chapter',
      'Copying is faster to run than importing at execution time',
    ],
    correctIndex: 1,
    explanation:
      'This project deliberately avoids a shared library across labs so any single lab folder can be copied out and run on its own, at the cost of some duplicated files like this one.',
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
