import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'Why does asking a model to "think step by step" sometimes fix a wrong answer, instead of just changing how the answer is explained?',
    options: [
      'It forces the reasoning steps to appear in the output before the final answer, so the answer is conditioned on that reasoning instead of skipping past it',
      'It makes the model use a more powerful version of itself behind the scenes',
      'It switches the model into a special "math mode" that uses a calculator',
      'It has no real effect, it just makes the response longer',
    ],
    correctIndex: 0,
    explanation: 'LLMs generate one token at a time, each conditioned on everything before it. If a prompt lets the model jump straight to a number, it can skip a step it actually needed. Asking it to reason first forces those steps into the output before the final answer.',
  },
  {
    question: 'What is the main risk of just asking a model to "respond with only JSON," instead of using a native JSON mode?',
    options: [
      'The model might refuse to respond at all',
      'JSON responses always cost more tokens than plain text',
      'The reply can still include a stray sentence or a markdown code fence, which breaks a plain json.loads() call even though the model mostly cooperates',
      'Freeform JSON prompting only works with Ollama, not with hosted providers',
    ],
    correctIndex: 2,
    explanation: "Freeform prompting for JSON often works, but 'often' isn't good enough for code with no human watching it run. Native structured-output modes guarantee valid JSON back instead of just requesting it nicely.",
  },
  {
    question: 'Why are structured output and function calling more closely related than they first appear?',
    options: [
      'They are actually the exact same API call with a different name',
      "Both force a model's reply into a schema instead of just asking for a shape in plain language, and Anthropic implements JSON output through tool use directly",
      'Function calling is only available with OpenAI, so the comparison does not apply elsewhere',
      'Structured output cannot be combined with a system prompt',
    ],
    correctIndex: 1,
    explanation: 'Anthropic makes this literal: Claude has no separate "JSON mode." To force a structured reply, you define a tool with an input schema, the same mechanism used for function calling.',
  },
  {
    question: 'Why did the lab only show the model choosing a tool call, instead of actually running it?',
    options: [
      'Choosing a tool and filling in arguments is a decision the model makes from the prompt alone; actually calling the function and feeding the result back is a separate execution loop, built in the next chapter',
      'Running the tool would have required a paid API plan',
      'Local models like llama3.2 are not capable of describing tool arguments',
      'Executing tools is against the terms of service of every provider',
    ],
    correctIndex: 0,
    explanation: "This chapter is about the model's decision, which tool, which arguments. Actually calling check_order_status(), getting a real result back, and feeding it back to the model is different machinery, that's what Chapter 5 builds.",
  },
];
