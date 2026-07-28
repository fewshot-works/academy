import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "According to the chapter's history note, what happened in the decades between AI being named at Dartmouth in 1956 and the deep learning boom of the last decade?",
    options: [
      "Nothing, AI research didn't really begin until deep learning arrived",
      'The field went through repeated cycles of excitement followed by funding cuts and skepticism, often called "AI winters," before progress eventually stuck',
      "AI research paused entirely until Alan Turing's 1950 paper",
      'Generative AI was invented first, and the other terms were defined afterward to describe it',
    ],
    correctIndex: 1,
    explanation: 'The chapter\'s history callout describes exactly this: repeated "AI winters" of excitement and funding cuts, each eventually giving way to real progress that stuck around.',
  },
  {
    question: "Per the chapter's example table, what's the difference between face unlock on your phone and ChatGPT writing you an email, even though both count as deep learning?",
    options: [
      "Face unlock isn't real AI, but ChatGPT is",
      "Face unlock recognizes and labels (is this the right face or not), while ChatGPT generates brand-new content that didn't exist before you asked",
      'Face unlock is generative and ChatGPT is not',
      'There is no difference, they use identical techniques for identical tasks',
    ],
    correctIndex: 1,
    explanation: "The table marks face unlock as deep learning but not generative (\"it recognizes, doesn't create\"), while ChatGPT is marked generative.",
  },
  {
    question: "The chapter's table marks the email spam filter example as Deep Learning: \"Sometimes.\" What does that \"sometimes\" actually mean?",
    options: [
      'That spam filters only correctly catch spam half the time',
      'That not every ML technique used for spam filtering is a deep learning one; some spam filters use other ML methods, only some use deep neural networks',
      'That deep learning is required before anything counts as AI at all',
      'That the word is a typo and should say "always"',
    ],
    correctIndex: 1,
    explanation: 'Deep learning is one specific technique inside the broader category of machine learning, not the whole category, so a spam filter can be ML without necessarily being built with deep learning.',
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
