import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "What does adding checkpointer=InMemorySaver() and a thread_id actually change about how agent.invoke() behaves, compared to Chapter 5 and 6?",
    options: [
      "It makes the model respond faster",
      "It lets invoke() calls sharing the same thread_id read and build on a stored message history, instead of every call starting from a blank messages list",
      "It automatically picks a better model for the question",
      "It adds new tools the agent can call",
    ],
    correctIndex: 1,
    explanation: "The checkpointer stores each thread's messages between calls. Same thread_id means the agent remembers; a different thread_id, or no checkpointer at all, means it starts from scratch every time, exactly like Chapters 5 and 6.",
  },
  {
    question: "In the real captured lab run, chat_short_term.py's thread grew 4, 8, 12, 16, 20, 24 messages, one per turn, while chat_summarized.py's grew to 6 and then stayed at 6 for the rest of the same six-question conversation. What does that comparison demonstrate?",
    options: [
      "chat_summarized.py stopped remembering anything after turn 2",
      "chat_short_term.py has a bug that chat_summarized.py fixes",
      "Short-term memory keeps every message forever, so the thread (and the cost of every future call) grows without bound, while summarization keeps the thread bounded by periodically compressing older messages",
      "The two scripts were run with different questions",
    ],
    correctIndex: 2,
    explanation: "Same six questions, same model, both scripts. The only difference is that one keeps everything verbatim (growing every turn) and the other collapses older messages into a summary once a size trigger is crossed (staying roughly flat afterward).",
  },
  {
    question: "Both scripts correctly answered the final question (\"What's my name, and what am I building?\") even after chat_summarized.py had already summarized away the original message stating that name and project. Why?",
    options: [
      "Summarization deletes old messages, so this was a lucky guess",
      "The summarization step compresses old messages into a summary rather than deleting them, so information like a stated name can survive, just in a shortened form, instead of being thrown away",
      "The checkpointer secretly kept a second, uncompressed copy",
      "The recall question itself contained the answer",
    ],
    correctIndex: 1,
    explanation: "This is the whole point of summarizing instead of just trimming or deleting old messages: a well-written summary preserves the facts that mattered, even though the original wording is gone.",
  },
  {
    question: "What's a real cost of summarized memory, not just a hypothetical one, based on what the lab showed?",
    options: [
      "It's slower to set up than short-term memory",
      "It only works with Ollama, not OpenAI or Anthropic",
      "The summary is a real LLM call compressing the past, so it can occasionally blur or drop a detail a person would have kept, and needs its own configuration (trigger, keep) to get right",
      "It requires a paid, persistent database",
    ],
    correctIndex: 2,
    explanation: "Summarization trades perfect recall for bounded cost. Most of the time that trade is worth it, but the summary is only as good as the LLM call that wrote it, and unlike short-term memory, nothing here is guaranteed to be word-for-word accurate anymore.",
  },
];
