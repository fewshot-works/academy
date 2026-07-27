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
    question: 'In the lab, what does a bigger "quality gap" between similar-pairs and different-pairs indicate?',
    options: [
      'The model is slower than average',
      'The model separates similar meaning from different meaning more clearly',
      'The model is more expensive to run',
      'The model was trained on more languages',
    ],
    correctIndex: 1,
    explanation: "An embedding model's job is to place similar meanings close together and different meanings far apart. A bigger gap between how similar paraphrases score versus how similar unrelated sentences score means it's doing that more clearly.",
  },
  {
    question: 'Why was the latency comparison in the lab less reliable than the quality comparison?',
    options: [
      'Latency can\'t be measured in Python',
      'The first run mostly measured Ollama loading the model into memory, not the embedding computation itself, so timing flattened out (and sometimes flipped) on a second run',
      'Both models always take exactly the same amount of time',
      'Latency only matters for OpenAI, never for Ollama',
    ],
    correctIndex: 1,
    explanation: 'Locally, most of the first-run time is model loading, not embedding compute, which makes latency a noisy signal. Quality and cost held up consistently across runs; latency did not.',
  },
  {
    question: 'Why is $0 marginal cost with a local (Ollama) model not automatically the right choice?',
    options: [
      'Ollama models actually cost money per call, just like OpenAI',
      'Cost is only one of three axes, a free model that separates meaning poorly can still hurt retrieval quality in a RAG system',
      'Local models are always faster than hosted models, so cost is irrelevant',
      "It is always the right choice, there's no real tradeoff",
    ],
    correctIndex: 1,
    explanation: 'Zero cost is appealing, but if the model does a worse job telling meaning apart, retrieval quality suffers downstream, even though no dollar amount shows that cost directly.',
  },
];
