import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "When you set up a hosted OpenAI or Anthropic API key in Chapter 0's optional Step 5, who actually handles billing for your API requests?",
    options: [
      'This course, since it generates the key for you',
      "The provider (OpenAI or Anthropic) bills you directly on their own site; this course never sees or handles your key or your money",
      'Ollama, since it manages every provider behind the scenes',
      'There is no billing, hosted keys are always free to use',
    ],
    correctIndex: 1,
    explanation: "The chapter is explicit: you add a payment method on the provider's own site, and this project never sees or handles your key or your money.",
  },
  {
    question: "Step 4 has you run `ollama pull llama3.2`, a roughly 2GB download. What does that download actually buy you, according to the chapter?",
    options: [
      'A day pass, the model needs re-downloading every 24 hours',
      'A one-time download, after which the model lives on your machine and runs with no internet connection needed',
      'A decompression tool for running OpenAI models locally',
      'Nothing changes until you also install VS Code',
    ],
    correctIndex: 1,
    explanation: 'The chapter says this directly: "This is a one-time download. After this, the model lives on your machine and needs no internet connection to run."',
  },
  {
    question: "The first time you run `uv run <script>.py` inside a lab folder, what does uv do that a second run later skips straight past?",
    options: [
      'Nothing, it behaves identically on every run',
      "Reads that lab's pyproject.toml, creates its isolated .venv, and installs its packages, before running the script",
      'Downloads a fresh copy of Ollama',
      "Deletes the previous lab's environment to free up space",
    ],
    correctIndex: 1,
    explanation: 'The chapter notes that the first run does the creating, installing, and running all at once; "run it again later and it skips straight to running, since everything\'s already there."',
  },
];
