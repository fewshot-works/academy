import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "The chapter describes 'overlap' as a common patch for fixed-size chunking, repeating the last ~50 characters of one chunk at the start of the next. What does overlap actually accomplish?",
    options: [
      'It fixes the mid-sentence cut entirely, a cut never happens once overlap is added',
      "It softens the cut rather than fixing it: if a thought gets severed, some of what came before still survives into the next chunk",
      'It removes the need for recursive chunking entirely',
      'It compresses the chunks to use less storage',
    ],
    correctIndex: 1,
    explanation: "Overlap doesn't fix the cut, it just softens it. Some of what came before the cut still survives into the next chunk, rather than being lost outright.",
  },
  {
    question: "According to the chapter's closing guidance, when is fixed-size chunking actually a reasonable choice, despite being the bluntest of the three techniques?",
    options: [
      'Never, recursive chunking is always strictly better',
      'For uniform, boilerplate-heavy text where structure barely matters',
      'Only when working with poetry or verse',
      'Only when the provider is set to Anthropic',
    ],
    correctIndex: 1,
    explanation: "The chapter is direct about this: fixed-size is fine for uniform, boilerplate-heavy text where structure barely matters, even though it's the simplest and crudest of the three approaches.",
  },
  {
    question: "The chapter says semantic chunking's similarity threshold, the cutoff for what counts as 'a real topic shift', can't just be guessed. How does the chapter say it actually gets set?",
    options: [
      "It's a fixed, universal number that works for every document",
      'It has to be tuned by testing against real text, not guessed in advance',
      "It's calculated automatically from the document's word count",
      "It's set once by the embedding model's provider and can't be changed",
    ],
    correctIndex: 1,
    explanation: "The chapter is explicit that the threshold counting as 'a real topic shift' has to be tuned by testing against real text, not guessed in advance.",
  },
  {
    question: 'In the lab, what did fixed-size chunking do that recursive chunking avoided?',
    options: [
      'Fixed-size chunking merged two unrelated stories into a single chunk; recursive kept them apart',
      'Fixed-size chunking cut a sentence in half at a chunk boundary; recursive chunking never did',
      'Fixed-size chunking called the embedding model; recursive chunking did not',
      'Fixed-size chunking produced fewer chunks than recursive chunking',
    ],
    correctIndex: 1,
    explanation: "Fixed-size just counts to 260 characters and stops mid-sentence. Recursive chunking checks paragraph and sentence boundaries first, so it only cuts mid-sentence as an absolute last resort.",
  },
];
