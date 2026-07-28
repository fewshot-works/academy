import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "Per the chapter's 'what you gain' list, create_agent has built-in handling for two things Chapter 5 wrote by hand: a step limit and a failing tool call. What did Chapter 5's hand-written versions of these look like?",
    options: [
      'Chapter 5 did not handle either of these at all',
      "MAX_STEPS, a hand-written cap on the loop, and call_tool()'s try/except, which turned a crashing tool call into an error string",
      'A separate configuration file for each provider',
      "A second LLM call that checked whether the first one's tool call was safe",
    ],
    correctIndex: 1,
    explanation: "A built-in step limit and built-in handling for a tool call that errors out, both of which Chapter 5 had to write by hand (MAX_STEPS, call_tool()'s try/except).",
  },
  {
    question: "Chapter 5's tool_use.py is 270 lines; Chapter 6's agent.py is 123. Where does most of that difference come from?",
    options: [
      'Chapter 6 supports fewer providers',
      'Chapter 6 has fewer tools',
      "Chapter 5 wrote a separate ~40-line branch of message-handling code for each of the three providers; Chapter 6 replaces all three with a single model-string variable, since create_agent handles the provider differences internally",
      "Chapter 6's tools have simpler logic than Chapter 5's",
    ],
    correctIndex: 2,
    explanation: "The tools themselves are identical between the two chapters, same ast-based calculator, same Wikipedia search. The savings come entirely from not having to hand-write Ollama's, OpenAI's, and Anthropic's different message shapes three separate times.",
  },
  {
    question: "The bonus section says Langflow's Simple Agent template's Agent component \"is LangChain's agent under the hood, the same create_agent this chapter just showed you in code.\" What does that tell you about the relationship between the no-code and code versions?",
    options: [
      'They are unrelated technologies that happen to solve similar problems',
      'The no-code Agent component and the create_agent call are the same underlying mechanism, just exposed as a visual block instead of a Python function call',
      "Langflow's agent is strictly more powerful than create_agent",
      "The no-code version doesn't actually call any tools, it just simulates the trace",
    ],
    correctIndex: 1,
    explanation: "That single component is LangChain's agent under the hood, the same create_agent this chapter just showed you in code, wired up visually instead.",
  },
  {
    question: 'In the real captured lab run, Question 3 ("what\'s a good tip for staying focused while studying?") triggered a search_wikipedia call in one run, but the README notes it varies run to run, sometimes calculator with a made-up expression, sometimes no tool call at all. What does this tell you about switching to create_agent?',
    options: [
      'create_agent fixed the tool-happy behavior Chapter 5 had',
      'create_agent made the tool-happy behavior worse',
      "The model's tendency to reach for a tool it doesn't need is a property of the model, not the loop; switching frameworks doesn't change it, since Chapter 5's hand-written loop hit the exact same quirk with the exact same model",
      'This only happens with the calculator tool, never with search_wikipedia',
    ],
    correctIndex: 2,
    explanation: "The framework changes how the loop is written, not how the model decides when to call a tool. That decision comes from the model itself, so the same quirky, sometimes tool-happy behavior shows up whether you wrote the loop by hand or let create_agent handle it.",
  },
];
