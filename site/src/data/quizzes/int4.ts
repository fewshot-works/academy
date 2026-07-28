import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "In the lab's real captured run, the direct-answer section guessed '4' for the muffin problem, wrong, while the step-by-step section worked through '24 / 2 = 12, then 12 / 2 = 6' to correctly reach 6. What does this specific run demonstrate?",
    options: [
      'That llama3.2 cannot do arithmetic under any circumstances',
      "That the model's reasoning ability was there the whole time, it just wasn't being used until the prompt asked for it explicitly",
      'That step-by-step prompting only works with a calculator tool attached',
      'That the direct-answer section had a bug in the script',
    ],
    correctIndex: 1,
    explanation: "The model's reasoning ability was there the whole time, it just wasn't being used until the prompt asked for it explicitly. Forcing the steps into the output changed what the model actually computed, not just how it explained itself.",
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
    question: "In the lab's real run, the freeform and native JSON outputs both parsed successfully, but differed slightly in wording, one said 'Cedar Hall Community Center in Portland,' the other 'Cedar Hall Community Center, Portland.' What does this specific difference actually show?",
    options: [
      'That native JSON mode is broken and produces incorrect data',
      "That both approaches can produce validly-parseable JSON on a given run, the real risk with freeform prompting is reliability across many runs, not that it always fails",
      'That the freeform prompt used a different underlying model entirely',
      'That location fields are silently ignored by both modes',
    ],
    correctIndex: 1,
    explanation: "It's not that freeform prompting always fails, it's that it can fail, unpredictably, in code that has no human watching it run. This particular run happened to succeed for both approaches.",
  },
  {
    question: "Per the chapter's diagram of the three failure modes, what does adding function calling on top of a plain prompt provide that JSON mode alone doesn't?",
    options: [
      'A guaranteed-parseable reply, the same thing JSON mode already provides',
      "A structured decision your code can actually act on, not just a well-formatted description of what should happen",
      'Faster response times than JSON mode',
      'The ability to skip chain-of-thought reasoning entirely',
    ],
    correctIndex: 1,
    explanation: "The diagram's function-calling step provides a structured decision your code can act on, distinct from JSON mode's guaranteed-parseable reply. Function calling is the step beyond just producing parseable text.",
  },
];
