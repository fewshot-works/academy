import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'What does "augmented" mean in Retrieval-Augmented Generation?',
    options: [
      "The model's size is increased right before it answers",
      'The question gets automatically translated before being sent',
      'The LLM answer is supplemented with retrieved text at the moment of answering, instead of relying only on what it learned during training',
      'The LLM is retrained on the retrieved documents before answering',
    ],
    correctIndex: 2,
    explanation: 'No retraining happens at all. The relevant facts are just handed to the model at the moment you ask.',
  },
  {
    question: 'Why does RAG reduce hallucination without eliminating it?',
    options: [
      'RAG completely eliminates hallucination, since the model can no longer guess',
      'The model now works from real retrieved text, which makes correct answers far more likely, but it can still misread or misuse that text',
      'RAG has no real effect on hallucination one way or the other',
      'RAG only works on fictional documents, so hallucination does not apply',
    ],
    correctIndex: 1,
    explanation: 'RAG lowers the odds of a wrong answer. It does not remove them entirely.',
  },
  {
    question: 'What are the main steps in the RAG loop?',
    options: [
      'Train a new model, then embed the question, then answer directly',
      'Ask the question twice and compare the two answers',
      'Embed the question, search a vector database for close matches, add those chunks to the prompt as context, then generate an answer',
      'Summarize the entire database first, then embed just the summary',
    ],
    correctIndex: 2,
    explanation: "It chains together the two prior chapters' pieces (embed, search) plus one more step (stuff context, then generate).",
  },
  {
    question: 'In the closed-book vs. open-book exam analogy, which student represents a plain LLM answering from memory alone?',
    options: [
      'The open-book student',
      'The closed-book student',
      'Neither, the analogy does not apply to LLMs',
      'Both, since LLMs always check a reference before answering',
    ],
    correctIndex: 1,
    explanation: 'RAG turns the LLM into the open-book student instead, letting it check a relevant page before answering.',
  },
];
