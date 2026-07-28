import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'The chapter\'s history note says the term "Retrieval-Augmented Generation" comes from a 2020 research paper, about two years before ChatGPT went mainstream. What point is the chapter making with that timing?',
    options: [
      "That RAG was invented specifically to fix ChatGPT's flaws",
      "That combining search with generation predates the current AI boom, RAG isn't a reaction to ChatGPT-style tools going mainstream",
      'That the 2020 paper has since been proven wrong',
      'That RAG only became possible once ChatGPT existed',
    ],
    correctIndex: 1,
    explanation: 'The chapter notes this is "worth noticing": the RAG paper predates ChatGPT-style tools going mainstream by about two years.',
  },
  {
    question: "The lab's document, Fernwood Coffee Co., is entirely made up and doesn't exist anywhere in the real world. Why does the chapter deliberately choose a fictional company for this lab?",
    options: [
      'To make the lab more entertaining to read',
      "So that if the bot answers correctly, that's proof it's actually using the retrieved text, not something the model already knew from training",
      'Because real company names are legally protected',
      'Because fictional names produce more accurate embeddings',
    ],
    correctIndex: 1,
    explanation: "The chapter is explicit that the document is \"made-up on purpose, so you can be certain any correct answer came from retrieval, not from something the model already knew.\"",
  },
  {
    question: 'In the chapter\'s Langflow bonus section, what has to be swapped out of the default "Vector Store RAG" template to match what the Python lab actually used?',
    options: [
      'Nothing, the template already matches exactly',
      'Both Astra DB components need to be swapped for Chroma DB, and the embedding components swapped for Ollama Embeddings (or OpenAI, matching whichever provider the lab used)',
      'The LLM component needs to be removed entirely',
      'The template only works with a paid Langflow account',
    ],
    correctIndex: 1,
    explanation: 'The bonus section walks through exactly this swap: Astra DB to Chroma DB, and the embedding components to match the local Ollama model used since Chapter 4.',
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
