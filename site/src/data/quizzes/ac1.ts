import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "Per the chapter's trim checklist, which of these is NOT one of the questions you should ask yourself before sending a prompt?",
    options: [
      "Could I delete this sentence and lose nothing?",
      "Is there a place where the model has to guess a format, a boundary, or what to do if something's missing?",
      "Have I used the maximum number of examples the prompt can fit?",
      "Would a stranger, reading this once, know exactly what to hand back?",
    ],
    correctIndex: 2,
    explanation:
      "The checklist is about cutting waste, not maximizing anything. \"Fit in as many examples as possible\" runs directly against the chapter's \"no filler\" principle -- more isn't the goal, unambiguous is.",
  },
  {
    question:
      "The chapter names two specific habits for eliminating the ambiguity that comes from mixing instructions and data in one paragraph. What are they?",
    options: [
      "Writing in short fragments and adding more exclamation points for emphasis",
      "Delimiters that visually separate the data from the instructions, and stating the exact output format you want",
      "Always using bullet points and capitalizing every key term",
      "Repeating the instruction three times, each phrased slightly differently",
    ],
    correctIndex: 1,
    explanation:
      "\"Structure kills ambiguity\" names exactly two fixes: wrap the data (triple quotes, XML-style tags, a code fence) so it's never one undifferentiated blob with the instructions, and say the format you want instead of leaving the model to guess it.",
  },
  {
    question:
      "In the lab's real run, the bloated prompt was 201 words. After cutting the filler, stating the same three questions, the trimmed prompt was 84 words. What does that drop, by itself, demonstrate?",
    options: [
      "That a prompt can lose well over half its length without losing any of its actual content, since the extra 117 words were filler doing nothing",
      "That shorter prompts always produce more accurate answers regardless of what they say",
      "That 84 words is the ideal length for every prompt, no matter the task",
      "That the model automatically ignores anything past the 84th word",
    ],
    correctIndex: 0,
    explanation:
      "The bloated and trimmed prompts ask the exact same three questions, everything cut between 201 and 84 words was politeness, hedging, and restating the ask, words that did nothing for the answer's accuracy. That's the specific-beats-verbose point made in numbers.",
  },
  {
    question:
      "Per the chapter, which single addition to a prompt does the most to reduce hallucination on an unanswerable question?",
    options: [
      'Adding more politeness and encouraging language, like "please think carefully"',
      "Restricting the model to a named source and giving it an explicit, exact phrase to use when the answer isn't in that source",
      "Making the prompt as short as possible, regardless of what it says",
      'Simply instructing the model to "be accurate" or "don\'t make things up"',
    ],
    correctIndex: 1,
    explanation:
      '"Be accurate" changes nothing, a model already believes it\'s being accurate. What actually works is telling it exactly where the honest boundary is (the source) and exactly what to say when it\'s outside that boundary, removing the ambiguity that otherwise gets resolved by guessing.',
  },
];
