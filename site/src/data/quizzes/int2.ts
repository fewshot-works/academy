import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: 'What are the three things that actually differ between embedding models?',
    options: [
      'Quality, latency, and cost',
      'Color, font, and file size',
      'Only cost, since all embedding models perform about the same',
      'Only quality, since latency and cost are the same for every model',
    ],
    correctIndex: 0,
    explanation: 'No single axis tells the whole story. A model can be excellent and cheap but slow, or fast and free but mediocre, choosing a model means weighing quality, latency, and cost together.',
  },
  {
    question: 'The chapter opens with a camera-lens analogy: a cheap lens is light and free to carry, an expensive one captures more nuance but is heavier and slower. What point is that analogy making about picking an embedding model?',
    options: [
      "That there's one lens (model) that's always correct to buy",
      "That no single model is 'the best' in general, the right pick depends on the trade-offs of what you're actually building",
      'That expensive models are always worth the extra cost',
      'That cost is the only factor worth considering',
    ],
    correctIndex: 1,
    explanation: "Neither lens is \"the best\" in general, it depends on what you're shooting. The chapter uses this to make the same point about choosing an embedding model: it depends on what you're building.",
  },
  {
    question: 'Why was the latency comparison in the lab less reliable than the quality comparison?',
    options: [
      "Latency can't be measured in Python",
      'The first run mostly measured Ollama loading the model into memory, not the embedding computation itself, so timing flattened out (and sometimes flipped) on a second run',
      'Both models always take exactly the same amount of time',
      'Latency only matters for OpenAI, never for Ollama',
    ],
    correctIndex: 1,
    explanation: 'Locally, most of the first-run time is model loading, not embedding compute, which makes latency a noisy signal. Quality and cost held up consistently across runs; latency did not.',
  },
  {
    question: "With PROVIDER=openai, the lab prints an exact dollar cost per run rather than an estimate. How does the script get that exact number, per the chapter?",
    options: [
      'It looks up a fixed price list and multiplies by the number of sentences',
      "It reads the real token count straight from each API response and multiplies by that model's per-token price",
      'It estimates cost based on how long the request took to complete',
      "It queries OpenAI's billing dashboard directly",
    ],
    correctIndex: 1,
    explanation: 'The script reads the real token count straight from each API response, so the dollar cost printed for that run is exact, not estimated.',
  },
];
