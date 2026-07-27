import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "This capstone's agent has three tools: calculator, search_wikipedia, and search_documents. Chapter 6's two-tool agent rarely confused calculator with search_wikipedia, but getting this agent to reliably pick between the two search tools took writing much more specific docstrings. Why?",
    options: [
      "Three tools is always too many for any model to handle",
      "search_wikipedia and search_documents are both a kind of 'search', so the model has to tell them apart by what they search, not just whether to search at all -- a distinction a vague docstring doesn't give it",
      "search_documents doesn't have a docstring at all",
      "The calculator tool was broken in this chapter",
    ],
    correctIndex: 1,
    explanation: "Deciding 'math or search' is an easy split. Deciding 'search the internet or search my own notes' needs the model to actually understand what each search tool covers, which is exactly what explicit docstrings ('NOT the internet', 'use this for questions about X') provide.",
  },
  {
    question: "The search_documents tool here is built almost the same way as Foundations Chapter 8's capstone (read .txt files from a docs/ folder, chunk, embed, store). What's actually different about how it's used in this chapter?",
    options: [
      "It uses a completely different embedding model",
      "Foundations' capstone always retrieved from the documents on every question, as a fixed pipeline; here retrieval is just one tool among three that the agent decides whether to call at all",
      "This chapter's version doesn't use ChromaDB",
      "The documents are stored on a remote server instead of locally",
    ],
    correctIndex: 1,
    explanation: "Same document-loading pattern, different role. Foundations Chapter 8 always retrieved, then answered. This chapter's agent, like every agent since Chapter 5, decides per question whether search_documents (or any tool) is actually needed.",
  },
  {
    question: "In the real captured lab run, the question \"What am I comparing Fernwood to, and what did you just tell me about its locations?\" was answered correctly even though it came after three tool calls and two unrelated topics (a calculator question and an Eiffel Tower question). What made that possible?",
    options: [
      "The agent re-read the docs/ folder from scratch for every question",
      "The checkpointer and shared thread_id from Chapter 7, which keep the entire conversation, including the very first message, available to the model on every later call",
      "search_documents automatically remembers previous questions",
      "The model guessed correctly by coincidence",
    ],
    correctIndex: 1,
    explanation: "This is Chapter 7's memory mechanism doing exactly what it's for: every agent.invoke() call in the script shares one thread_id, so nothing said earlier is lost just because other tools were called in between.",
  },
  {
    question: "In the real lab run, one answer included the model saying, mid-response, \"I think I made another mistake by including information about the Ridge Trail Sunrise Hike again!\" before still landing on the correct final answer. What's the honest takeaway from a real transcript like this?",
    options: [
      "The lab is broken and needs to be fixed before it's usable",
      "A small local model can visibly narrate its own confusion or self-correct mid-answer and still reach the right answer -- worth reading a real transcript occasionally instead of only checking the tool-call trace or the final line",
      "This proves multi-tool agents don't work with local models",
      "The checkpointer was storing corrupted data",
    ],
    correctIndex: 1,
    explanation: "This is a real, reproducible artifact of a small model working through a slightly noisy context, not a bug. The tool selection and the final answer were both correct; the messy narration in between is exactly the kind of thing that's easy to miss if you only ever look at cleaned-up output.",
  },
];
