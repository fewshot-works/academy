import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "This chapter lists four jobs a gateway does: one interface, failover, centralized keys/cost tracking, and caching/rate limiting. Which one does the chapter say a single-provider PROVIDER if/elif genuinely cannot do at all, no matter how well the code is written?",
    options: [
      "One interface across providers",
      "Failover to a different provider when the primary is down",
      "Centralized API key management",
      "Caching repeated responses",
    ],
    correctIndex: 1,
    explanation:
      "The chapter's opening makes this exact point: a PROVIDER if/elif can be perfectly correct code and still have nowhere to go once the one provider it picked stops answering. The lab's part one demonstrates it directly, the request just fails, there's no fallback anywhere in that code path. The other three jobs (a consistent call shape, centralized keys, caching) are all things a single-provider setup could still do reasonably well on its own.",
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
      "Kong AI Gateway extends Kong's existing API gateway to LLM traffic, so a team already operating Kong for ordinary REST APIs gets LLM routing nearly for free by turning on a plugin, rather than standing up a separate piece of infrastructure. LiteLLM and Portkey are both good defaults for a team with no existing gateway, but that specific \"already running this platform\" fit is Kong's.",
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
      "The TL;DR says two providers each at 99.53% uptime combine to about 12 minutes of expected downtime a year instead of 41 hours, assuming independent failures. What calculation actually produces that 12-minute figure?",
    options: [
      "Averaging the two providers' uptime percentages together",
      "Adding the two providers' downtime hours together",
      "Multiplying each provider's downtime share together, since combined downtime only happens when both are down at the same moment",
      "Doubling one provider's downtime to account for having a second one",
    ],
    correctIndex: 2,
    explanation:
      "A single provider at 99.53% uptime is down about 0.47% of the year (~41 hours). With two independent providers behind a gateway, the combined setup only fails when BOTH are down at once, so the combined downtime share is roughly the product of each one's downtime share: 0.0047 x 0.0047, about 0.0022%, or roughly 11 to 12 minutes a year. Adding or averaging the two would both give a much larger, wrong number, multiplication is what independence actually implies.",
  },
];
