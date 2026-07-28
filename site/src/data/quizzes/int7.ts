import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "The chapter says a different thread_id \"would start a completely separate conversation with no memory of this one, the same way a new browser tab starts a new chat.\" What does swapping InMemorySaver for a persistent checkpointer (Postgres, Redis) change, per the chapter?",
    options: [
      'It would let a single thread_id be shared across multiple unrelated conversations',
      'It lets conversations survive a script restart, without changing anything else about how the agent is called',
      'It removes the need for a thread_id entirely',
      'It makes summarization mandatory',
    ],
    correctIndex: 1,
    explanation: 'A real app would swap in a persistent checkpointer (Postgres, Redis, and others exist) so conversations survive a restart, without changing anything else about how the agent is called.',
  },
  {
    question: "In the real captured lab run, chat_short_term.py's thread grew 4, 8, 12, 16, 20, 24 messages, one per turn, while chat_summarized.py's grew to 6 and then stayed at 6 for the rest of the same six-question conversation. What does that comparison demonstrate?",
    options: [
      'chat_summarized.py stopped remembering anything after turn 2',
      'chat_short_term.py has a bug that chat_summarized.py fixes',
      'Short-term memory keeps every message forever, so the thread (and the cost of every future call) grows without bound, while summarization keeps the thread bounded by periodically compressing older messages',
      'The two scripts were run with different questions',
    ],
    correctIndex: 2,
    explanation: 'Same six questions, same model, both scripts. The only difference is that one keeps everything verbatim (growing every turn) and the other collapses older messages into a summary once a size trigger is crossed (staying roughly flat afterward).',
  },
  {
    question: 'Both scripts correctly answered the final question ("What\'s my name, and what am I building?") even after chat_summarized.py had already summarized away the original message stating that name and project. Why?',
    options: [
      'Summarization deletes old messages, so this was a lucky guess',
      'The summarization step compresses old messages into a summary rather than deleting them, so information like a stated name can survive, just in a shortened form, instead of being thrown away',
      'The checkpointer secretly kept a second, uncompressed copy',
      'The recall question itself contained the answer',
    ],
    correctIndex: 1,
    explanation: 'This is the whole point of summarizing instead of just trimming or deleting old messages: a well-written summary preserves the facts that mattered, even though the original wording is gone.',
  },
  {
    question: "What's a real cost of summarized memory, not just a hypothetical one, based on what the lab showed?",
    options: [
      "It's slower to set up than short-term memory",
      'It only works with Ollama, not OpenAI or Anthropic',
      'The summary is a real LLM call compressing the past, so it can occasionally blur or drop a detail a person would have kept, and needs its own configuration (trigger, keep) to get right',
      'It requires a paid, persistent database',
    ],
    correctIndex: 2,
    explanation: 'Summarization trades perfect recall for bounded cost. Most of the time that trade is worth it, but the summary is only as good as the LLM call that wrote it, and unlike short-term memory, nothing here is guaranteed to be word-for-word accurate anymore.',
  },
];
