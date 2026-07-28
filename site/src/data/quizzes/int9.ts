import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "The chapter's \"What this doesn't cover\" section says search_documents's docstring literally names \"Fernwood Coffee Co. or the Mountain View Hiking Club.\" Why does the chapter call this a real shortcut rather than a general solution?",
    options: [
      "Because naming documents in a docstring is against LangChain's API rules",
      'Because it only works for this two-document toy lab; pointing the tool at your own files means the docstring needs to be rewritten to describe what is actually in there',
      'Because docstrings cannot contain proper nouns',
      'Because it means the tool does not actually work at all',
    ],
    correctIndex: 1,
    explanation: "That's a real, working shortcut for a two-document toy lab, not a general solution -- point this at your own files and the model needs to be told, in the docstring, what's actually in there.",
  },
  {
    question: 'The summary table lists four pieces this capstone reuses: tool calling, create_agent, memory via checkpointer, and reading your own documents. What does the chapter say is the only genuinely new thing?',
    options: [
      'A new embedding model none of the earlier chapters used',
      'Combining all of them at once: a search_documents tool wrapped alongside a calculator and Wikipedia, letting the agent choose between three tools instead of two',
      "A new provider that wasn't covered in Chapters 5-7",
      'Nothing, the chapter is a repeat of Foundations Chapter 8',
    ],
    correctIndex: 1,
    explanation: "The only thing genuinely new is combining them: a search_documents tool, built the same way Foundations' capstone read a docs/ folder, wrapped as a third tool the agent can reach for -- or not -- right alongside a calculator and Wikipedia.",
  },
  {
    question: "The chapter's \"What this doesn't cover\" section says this lab's docstring fix works because there are only three tools to keep straight. What does it say an agent with twenty tools would need instead?",
    options: [
      'Nothing different, docstrings scale to any number of tools equally well',
      'A different strategy entirely, better tool naming, grouping, or letting the model search for the right tool',
      'Twenty separate checkpointers, one per tool',
      'A larger model is the only fix needed',
    ],
    correctIndex: 1,
    explanation: 'Three tools is not many tools. An agent with twenty tools needs a different strategy entirely -- better tool naming, grouping, or letting the model search for the right tool -- which is beyond what this capstone covers.',
  },
  {
    question: 'In the real lab run, one answer included the model saying, mid-response, "I think I made another mistake by including information about the Ridge Trail Sunrise Hike again!" before still landing on the correct final answer. What\'s the honest takeaway from a real transcript like this?',
    options: [
      'The lab is broken and needs to be fixed before it is usable',
      'A small local model can visibly narrate its own confusion or self-correct mid-answer and still reach the right answer -- worth reading a real transcript occasionally instead of only checking the tool-call trace or the final line',
      "This proves multi-tool agents don't work with local models",
      'The checkpointer was storing corrupted data',
    ],
    correctIndex: 1,
    explanation: "This is a real, reproducible artifact of a small model working through a slightly noisy context, not a bug. The tool selection and the final answer were both correct; the messy narration in between is exactly the kind of thing that's easy to miss if you only ever look at cleaned-up output.",
  },
];
