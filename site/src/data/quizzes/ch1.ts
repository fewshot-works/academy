import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'How do AI, machine learning, deep learning, and generative AI relate to each other?',
    options: [
      "They're four separate, competing technologies",
      "They're nested, each one a specific kind of the one before it, like Russian nesting dolls",
      'Generative AI came first, and the others were built on top of it afterward',
      "They're just four different marketing names for the same thing",
    ],
    correctIndex: 1,
    explanation: 'Every generative AI system is also deep learning, which is also machine learning, which is also AI, but not every AI is generative.',
  },
  {
    question: 'Is a thermostat that turns on the AC above 78°F an example of machine learning?',
    options: [
      'Yes, because it reacts automatically to sensor data',
      'Yes, any automated device counts as machine learning',
      "No, it's AI in the broadest sense, but not machine learning, because a person wrote the rule directly instead of the computer learning it from examples",
      "No, because thermostats don't count as AI at all",
    ],
    correctIndex: 2,
    explanation: 'AI is a low bar (any computer behavior built to act smart); ML specifically means the pattern was learned from data, not hand-coded.',
  },
  {
    question: 'What is the key shift from old-school programming to machine learning?',
    options: [
      'ML programs always run faster than hand-written ones',
      'Instead of a programmer writing exact rules, the computer works out the pattern on its own from a large pile of examples',
      'ML does not require a computer to run',
      'ML always creates brand-new content, while old-school programming never does',
    ],
    correctIndex: 1,
    explanation: 'Like teaching a kid to recognize dogs from examples instead of handing them a rulebook.',
  },
  {
    question: 'What makes generative AI different from most earlier machine learning, like a spam filter or face unlock?',
    options: [
      'It produces brand-new content instead of picking from a fixed set of labels',
      'It does not use neural networks',
      'It does not learn from examples the way older ML does',
      'It is not considered a form of AI',
    ],
    correctIndex: 0,
    explanation: "A spam filter labels (spam or not); generative AI creates content that didn't exist before you asked for it.",
  },
];
