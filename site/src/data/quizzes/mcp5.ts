import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "This lab's resource is addressed as calculator://supported-operations. What does the calculator:// part actually mean to MCP?",
    options: [
      "It's an arbitrary label this server chose, the same way a filename doesn't inherently mean anything to the filesystem, MCP doesn't parse or enforce any particular URI scheme",
      "It tells the client which transport, stdio or HTTP, to use for this specific resource",
      "It must match a protocol handler registered elsewhere in the project",
      "It has to resolve as a real, fetchable web URL or the resource registration fails",
    ],
    correctIndex: 0,
    explanation:
      "A resource's URI is just a label the server picks, calculator:// here is no more meaningful to MCP than any other string would be; it exists so a client has something to ask for by name.",
  },
  {
    question:
      "resources_and_prompts_agent.py hands the filled-in explain_answer prompt to an agent created with no tools at all. Why no tools here?",
    options: [
      "create_agent requires at least one tool, so an unused placeholder tool has to be passed in",
      "The prompt already spells out the full question as plain text; the agent just has to answer it, there's no decision about calling anything left for it to make",
      "Tools are stripped out automatically whenever the input comes from client.get_prompt() instead of a normal question",
      "The explain_answer prompt is itself registered as a tool internally",
    ],
    correctIndex: 1,
    explanation:
      "By the time the filled-in template reaches the agent, it's just a question in plain English, \"why does 12 * 7 equal 84?\" Nothing about answering that requires calling anything, so the agent gets no tools at all.",
  },
  {
    question:
      "What does client.get_prompt(...) return, and what does resources_and_prompts_agent.py do with it?",
    options: [
      "A raw string that's printed and discarded",
      'A list of chat messages, which the script passes straight into agent.ainvoke({"messages": prompt_messages}) the same shape create_agent expects for any conversation',
      'A new agent object ready to run',
      'A dictionary that must be converted to JSON before use',
    ],
    correctIndex: 1,
    explanation:
      "get_prompt() returns LangChain-compatible chat messages, which slot directly into the same {\"messages\": [...]} shape used everywhere else in this track, no conversion needed.",
  },
  {
    question:
      "Sampling reverses MCP's usual request direction. What does that mean concretely?",
    options: [
      "Instead of a client asking a server for something, a server can ask the client's model to generate text, useful when a server-side tool needs, say, a one-line summary mid-logic without carrying its own model and API key",
      "It means resources become writable by the client instead of read-only",
      "It means one MCP server can directly call tools on another MCP server",
      "It means the client no longer needs to call an LLM of its own",
    ],
    correctIndex: 0,
    explanation:
      "Every other primitive in this chapter has the client asking the server for something. Sampling flips that: the server is the one asking, for text from the model the client already has access to.",
  },
];
