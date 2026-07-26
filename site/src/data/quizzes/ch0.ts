import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'Why does each lab use uv instead of manually installing Python and venv?',
    options: [
      'uv makes downloads faster than pip',
      'uv replaces the need for a code editor',
      "uv installs Python and creates an isolated environment automatically, so there's nothing to activate by hand",
      'uv connects directly to Ollama',
    ],
    correctIndex: 2,
    explanation: 'uv folds installing Python, isolating packages, and activating an environment into one step, run automatically the first time you use a lab folder.',
  },
  {
    question: "What's the main difference between Ollama and a hosted API key (OpenAI/Anthropic)?",
    options: [
      "They're the same thing, just different names",
      'Ollama runs a model on your own computer for free; an API key sends requests to a company’s servers and costs money per request',
      'Ollama requires a credit card; the API key is free',
      'The API key runs locally; Ollama needs the internet',
    ],
    correctIndex: 1,
    explanation: "Ollama is local, free, and private but limited to your hardware. A hosted key is usually faster or more capable, but bills you per request.",
  },
  {
    question: 'Do you need to manually activate anything before running a lab with uv?',
    options: [
      'Yes, run `source .venv/bin/activate` before every lab',
      'Yes, but only the first time you use a lab folder',
      'Yes, you must manually activate Ollama first',
      'No, running `uv run <script>.py` handles creating and activating the environment for you',
    ],
    correctIndex: 3,
    explanation: "That's the whole point of uv over plain venv: one command does the creating, installing, and activating for you.",
  },
];
