import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "What's the key difference between a RAG bot and an AI agent?",
    options: [
      'An agent is just a RAG bot with a bigger context window',
      'A RAG bot can use tools, but an agent cannot',
      "There's no real difference, 'agent' is just newer marketing for the same thing",
      'A RAG bot follows one fixed sequence every time; an agent loops, deciding at each step what to do next, and can use more than one tool',
    ],
    correctIndex: 3,
    explanation: 'A RAG bot is a vending machine: same input, same steps, every time. An agent is more like an assistant that adapts.',
  },
  {
    question: 'What two things does an agent need that a plain chatbot does not?',
    options: [
      'A bigger training dataset and more parameters',
      'Tools it is allowed to use, and a way to recognize when it has enough information to stop looping',
      'A human reviewing every single response before it is sent',
      'A separate, fine-tuned version of the base model',
    ],
    correctIndex: 1,
    explanation: 'Without a reason to stop, an agent could loop forever instead of ever giving a final answer.',
  },
  {
    question: 'In the flight-and-weather example, why could a plain RAG bot not answer the question in one pass?',
    options: [
      'RAG bots cannot access the internet under any circumstances',
      'The question was too long to fit in a RAG bot context window',
      'It needed two separate pieces of live information, and the second lookup depended on the result of the first',
      'RAG bots can only ever answer questions about documents, never about weather',
    ],
    correctIndex: 2,
    explanation: "You can't look up tomorrow's weather at the destination until you know the destination. A fixed retrieve-then-answer bot can't make that kind of mid-course decision.",
  },
];
