import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "Why do the calculator and search_wikipedia functions need type hints and a docstring in Chapter 6's lab, when Chapter 5's versions of the same functions didn't?",
    options: [
      "LangChain's create_agent reads the type hints and docstring to build the tool's JSON schema automatically; Chapter 5 built that same schema by hand in a separate dictionary, so its functions didn't need to carry that information",
      "Type hints make the functions run faster",
      "Docstrings are required by Python for any function called from a loop",
      "Chapter 5's functions were never given real logic, only Chapter 6's are",
    ],
    correctIndex: 0,
    explanation: "Same information either way, a description of what the tool does and what arguments it takes. Chapter 5 wrote it as a JSON dict. Chapter 6 lets create_agent infer it from the function's own signature and docstring.",
  },
  {
    question: "Chapter 5's tool_use.py is 270 lines; Chapter 6's agent.py is 123. Where does most of that difference come from?",
    options: [
      "Chapter 6 supports fewer providers",
      "Chapter 6 has fewer tools",
      "Chapter 5 wrote a separate ~40-line branch of message-handling code for each of the three providers; Chapter 6 replaces all three with a single model-string variable, since create_agent handles the provider differences internally",
      "Chapter 6's tools have simpler logic than Chapter 5's",
    ],
    correctIndex: 2,
    explanation: "The tools themselves are identical between the two chapters, same ast-based calculator, same Wikipedia search. The savings come entirely from not having to hand-write Ollama's, OpenAI's, and Anthropic's different message shapes three separate times.",
  },
  {
    question: "What's a real cost of using create_agent instead of Chapter 5's hand-written loop, not just a hypothetical downside?",
    options: [
      "It's slower to run",
      "It only works with one provider",
      "It can't use more than one tool at a time",
      "You lose visibility into the exact message shape going back and forth, the tool_call_id matching, Anthropic's user-role tool results, and so on, all still happening, just no longer visible or directly debuggable, plus an added dependency on LangChain itself",
    ],
    correctIndex: 3,
    explanation: "This is the real trade-off the chapter argues for: less code and less to get wrong, in exchange for less visibility into what's actually happening and one more dependency to track. Neither side is correct in general, it depends on what you're building.",
  },
  {
    question: 'In the real captured lab run, Question 3 ("what\'s a good tip for staying focused while studying?") triggered a search_wikipedia call in one run, but the README notes it varies run to run, sometimes calculator with a made-up expression, sometimes no tool call at all. What does this tell you about switching to create_agent?',
    options: [
      "create_agent fixed the tool-happy behavior Chapter 5 had",
      "create_agent made the tool-happy behavior worse",
      "The model's tendency to reach for a tool it doesn't need is a property of the model, not the loop; switching frameworks doesn't change it, since Chapter 5's hand-written loop hit the exact same quirk with the exact same model",
      "This only happens with the calculator tool, never with search_wikipedia",
    ],
    correctIndex: 2,
    explanation: "The framework changes how the loop is written, not how the model decides when to call a tool. That decision comes from the model itself, so the same quirky, sometimes tool-happy behavior shows up whether you wrote the loop by hand or let create_agent handle it.",
  },
];
