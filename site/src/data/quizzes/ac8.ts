import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "Both model providers are healthy, but the shared gateway process is unavailable. What happens to an application that can reach providers only through that gateway?",
    options: [
      "The feature is still unavailable because the gateway is now on its request path",
      "The application automatically bypasses the gateway",
      "The providers proxy through each other",
      "The request always succeeds after the primary provider's timeout",
    ],
    correctIndex: 0,
    explanation:
      "A shared gateway is another dependency. Healthy upstream providers do not help if the application has no working path to reach them. The gateway data plane needs its own availability design, monitoring, and failure plan.",
  },
  {
    question:
      "Your application returns 429 because a tenant has reached a budget limit that your own team enforces. Should the gateway route around it to another provider?",
    options: [
      "Yes, every 429 is a temporary provider-capacity problem",
      "Yes, but only if the second provider is cheaper",
      "No, because failover would bypass the application's intended control",
      "No, because 429 always means the request is malformed",
    ],
    correctIndex: 2,
    explanation:
      "A status code needs context. A provider-specific capacity limit may be routable, but an application or tenant budget limit is policy the gateway must preserve. Calling another provider would defeat that limit.",
  },
  {
    question:
      "A product promises an answer within 12 seconds, but the primary provider has a 30-second timeout. What is the main problem with this fallback design?",
    options: [
      "The fallback has no meaningful time left to satisfy the product promise",
      "The primary model will always return a malformed response",
      "The fallback must use the same 30-second timeout",
      "The gateway cannot record which provider answered",
    ],
    correctIndex: 0,
    explanation:
      "Per-attempt timeouts must fit inside the end-to-end deadline. If the primary can consume 30 seconds while the user-facing promise is 12, the fallback exists in configuration but cannot rescue the request on time.",
  },
  {
    question:
      "A model has already requested a tool that creates a refund when its connection drops. What must be addressed before automatically replaying the turn through a fallback model?",
    options: [
      "Whether the fallback has a more creative system prompt",
      "Whether the action has durable state and duplicate protection such as an idempotency key",
      "Whether both models belong to the same model family",
      "Whether the gateway's cache contains unrelated responses",
    ],
    correctIndex: 1,
    explanation:
      "The first attempt may already have caused an external effect. Durable action state and duplicate protection are needed so replaying the model turn cannot create a second refund. Model routing alone does not make tool side effects safe to repeat.",
  },
];
