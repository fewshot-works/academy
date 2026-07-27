import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'Why does the tool-execution loop need a maximum step count (MAX_STEPS)?',
    options: [
      'Nothing guarantees the model eventually stops asking for tools and gives a plain-text answer, so without a cap a model that keeps calling tools could loop forever',
      'Each provider charges extra after 5 tool calls in a single conversation',
      'Ollama refuses to accept more than 5 messages in one conversation',
      'It prevents the calculator tool from being called more than once',
    ],
    correctIndex: 0,
    explanation: 'MAX_STEPS is the concrete version of the "reason to stop" idea from Foundations Chapter 7, a beginner-obvious safety net against a model that never stops calling tools.',
  },
  {
    question: 'Why does the calculator tool parse the expression with the ast module instead of calling Python\'s eval()?',
    options: [
      'ast is faster than eval() for simple arithmetic',
      "eval() runs whatever text it's given as real Python code, not just arithmetic; since the input is text the model generated, that's a real security risk, not a hypothetical one",
      'eval() cannot handle decimal numbers',
      'ast is required by Ollama\'s API, but not by OpenAI or Anthropic',
    ],
    correctIndex: 1,
    explanation: "eval(\"18 * 7 + 4\") and eval(\"os.system('rm -rf /')\") are both just code that runs. Parsing into a syntax tree and only walking a small set of allowed operations means anything outside basic arithmetic can't do anything, even if the model asks it to.",
  },
  {
    question: "What's actually different between what Chapter 4's function-calling section showed and what this chapter's lab does?",
    options: [
      'Chapter 4 used a smaller model, this chapter requires a larger one',
      'Chapter 4 only worked with OpenAI, this chapter adds Ollama and Anthropic support',
      "Chapter 4 showed the model choosing a tool and filling in arguments, but never running it; this chapter actually calls the real function, feeds the result back to the model, and repeats until there's a final answer",
      'Chapter 4 used JSON mode instead of function calling',
    ],
    correctIndex: 2,
    explanation: "Chapter 4's decision (which tool, which arguments) never went anywhere. This chapter acts on that same kind of decision: real function call, real result, fed back into the conversation, looping until the model is done.",
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
