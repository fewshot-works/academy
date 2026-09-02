import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "A provider accepts the request but never returns a response or an error. What does the gateway need so it can eventually try the fallback?",
    options: [
      "A longer system prompt",
      "A per-attempt timeout",
      "The same API key for both providers",
      "A cache containing the unanswered request",
    ],
    correctIndex: 1,
    explanation:
      "Failover code runs only after an attempt returns or raises an error. A provider that hangs can hold the request indefinitely unless each attempt has a deadline. The lab sets a 30-second timeout so a stalled provider becomes a retryable timeout instead of blocking the fallback forever.",
  },
  {
    question:
      "According to this chapter's comparison table, which of the three gateways is described as the natural fit for a team that's already running the same platform for its regular REST API traffic?",
    options: [
      "LiteLLM",
      "Portkey",
      "Kong AI Gateway",
      "All three fit that case equally well",
    ],
    correctIndex: 2,
    explanation:
      "Kong AI Gateway extends Kong's existing API gateway to LLM traffic, so a team already operating Kong for ordinary REST APIs can reuse that infrastructure rather than introduce a separate gateway platform. Basic LLM proxying and the chapter's multi-provider failover are not the same product tier: the latter requires Kong's paid AI Proxy Advanced plugin.",
  },
  {
    question:
      "Token & Cost Management's model right-sizing and this chapter's gateway both involve routing a request somewhere else. What's the actual difference between them?",
    options: [
      "There's no real difference, they're the same technique with different names",
      "Right-sizing routes to a smaller or larger model within one provider based on task difficulty; this chapter routes across providers based on whether the primary is answering at all",
      "Right-sizing is about cost, so it only applies to hosted providers, while this chapter's gateway only works with Ollama",
      "This chapter's gateway replaces right-sizing entirely, so a production system only needs one or the other",
    ],
    correctIndex: 1,
    explanation:
      "The chapter spells this out directly under \"Where this doesn't overlap with earlier chapters\": right-sizing picks a bigger or smaller model from the same provider depending on how hard the task is. This chapter's gateway doesn't care about task difficulty at all, it cares about whether the primary provider is responding, and switches to an entirely different provider if it isn't. A production system would reasonably use both at once, they solve different problems.",
  },
  {
    question:
      "The TL;DR uses a hypothetical example where two providers each have 99.5% uptime. Assuming independent failures, what calculation produces about 13 minutes of combined downtime a year?",
    options: [
      "Averaging the two providers' uptime percentages together",
      "Adding the two providers' downtime hours together",
      "Multiplying each provider's downtime share together, since combined downtime only happens when both are down at the same moment",
      "Doubling one provider's downtime to account for having a second one",
    ],
    correctIndex: 2,
    explanation:
      "A hypothetical provider at 99.5% uptime is down 0.5% of the year, about 44 hours. With two independent providers behind a gateway, the provider path fails only when both are down at once: 0.005 x 0.005 = 0.000025, or roughly 13 minutes a year. This best-case calculation excludes correlated failures and downtime in the gateway itself.",
  },
];
