import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "The chapter shows tool-calling mechanics differ across providers: Ollama hands you already-parsed arguments, OpenAI hands you a JSON string you parse yourself, and Anthropic is described as 'the odd one out.' What specifically makes Anthropic the odd one out?",
    options: [
      'Anthropic does not support tool calling at all',
      'Anthropic requires the tool result to go back as a user-role message containing a tool_result block, instead of an assistant-role message like the other two',
      'Anthropic charges extra for every tool call',
      'Anthropic only allows one tool call per conversation',
    ],
    correctIndex: 1,
    explanation: "The chapter is explicit: with Anthropic, the result has to go back as a user-role message, not assistant, containing a tool_result block, the detail most likely to trip up someone used to OpenAI-style APIs.",
  },
  {
    question: "During testing, an earlier attempt at question 3 had the model call calculator with the argument '1 hour of focused study per day', plain English, not math. What happened, and how did the script handle it?",
    options: [
      'The script crashed and had to be restarted manually',
      "The syntax-tree parser failed on that input, but call_tool() wraps the real function call in a try/except, turning the failure into an error string handed back to the model instead of crashing",
      'Ollama silently ignored the tool call and answered directly',
      'The lab was rewritten afterward to prevent the model from ever calling the calculator with non-math input',
    ],
    correctIndex: 1,
    explanation: "That's exactly why call_tool() in the script wraps the actual function call in a try/except, and turns any failure into an error string, handed back to the model the same way a real result would be, instead of taking down the whole script.",
  },
  {
    question: 'The chapter notes that search_wikipedia needs no API key, no cost, and no signup. Why does the chapter call this detail out specifically?',
    options: [
      "Because it's the only tool in the entire curriculum that works without an API key",
      "Because it keeps the chapter's own \"$0 with Ollama\" promise intact even for what functions as a \"web search\" tool",
      'Because Wikipedia normally requires a paid subscription for programmatic access',
      'Because the calculator tool requires an API key and this contrasts with it',
    ],
    correctIndex: 1,
    explanation: 'No API key, no cost, no signup, which keeps this lab\'s "$0 with Ollama" promise intact even for the "web search" tool.',
  },
  {
    question: 'During testing, a lab question that needed no live lookup ("what\'s a good tip for staying focused while studying?") still triggered a search_wikipedia call from llama3.2. What does this show?',
    options: [
      'The lab script has a bug that forces every question through at least one tool',
      "Small local models sometimes reach for a tool even when they don't need one; the loop doesn't need to know the difference, it just keeps running until the model stops asking for tools",
      'Wikipedia search must be called before every other tool as a required first step',
      'The question was miscategorized and actually did need a live lookup',
    ],
    correctIndex: 1,
    explanation: "This is a real model behavior, not a bug in the loop. Smaller local models are more tool-happy than hosted ones. The loop handles it the same way regardless: run the tool, feed back the result, let the model decide what to do next.",
  },
];
