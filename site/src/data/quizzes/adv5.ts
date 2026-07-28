import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "In the lab's real trace, the ollama.chat span's parent_id field matches the span_id of the ask_model.task span. What does that tell you?",
    options: [
      "It's a coincidence, span IDs are random and unrelated",
      "ollama.chat is a child span of ask_model.task -- the LLM call happened inside the traced task, and OpenTelemetry records that nesting via parent_id",
      "The two spans failed and had to be retried under the same ID",
      "parent_id only matters for spans exported to Jaeger, not the console",
    ],
    correctIndex: 1,
    explanation: "A span's parent_id pointing at another span's span_id is exactly how OpenTelemetry represents nesting -- it's what lets a trace be reconstructed as a tree (workflow contains task contains LLM call) instead of a flat list of unrelated events.",
  },
  {
    question: "The lab switched the Ollama branch from requests.post() (used in every earlier lab) to the official ollama Python package. Why was that change necessary for this chapter?",
    options: [
      "The ollama package is faster than raw HTTP requests",
      "OpenLLMetry auto-instruments specific known client libraries like the ollama package -- it can't see inside a generic requests.post() call, so that swap is what actually turns Ollama calls into rich LLM spans",
      "requests.post() doesn't work with Ollama's chat endpoint at all",
      "The .env file requires the ollama package to load PROVIDER correctly",
    ],
    correctIndex: 1,
    explanation: "Auto-instrumentation works by wrapping a specific library's functions. A generic HTTP call carries no signal that it's an LLM request, so OpenLLMetry has nothing to hook into -- using the real client library is what makes the prompt/completion/token capture possible.",
  },
  {
    question: "In the real captured trace, the model answered 'we have three locations, all within the state of Oregon,' but the system prompt only said 'all in the same state,' no state name given. How did the trace make this catchable?",
    options: [
      "It didn't -- tracing only records timing and token counts, not content",
      "The span's gen_ai.prompt and gen_ai.completion attributes put exactly what the model was told and exactly what it said in the same record, side by side, so a detail the model added on its own is visible on inspection",
      "OpenLLMetry automatically flags factual inconsistencies as errors",
      "Ollama refuses to answer questions using facts not in the prompt",
    ],
    correctIndex: 1,
    explanation: "Tracing doesn't catch hallucinations automatically -- it makes them visible by keeping the exact prompt and the exact completion attached to the same span, so a mismatch between what was given and what came back is something you can actually go look at, instead of something invisible once the response scrolls by.",
  },
  {
    question: "The bonus Jaeger section changes exactly one argument to Traceloop.init() (exporter=ConsoleSpanExporter() becomes api_endpoint=\"http://localhost:4318\") and nothing else in the script. Why is that the only change needed?",
    options: [
      "Jaeger and the console use the same data format by coincidence",
      "The @task/@workflow decorators and auto-instrumentation always produce the same spans -- Traceloop.init() is the one place that decides where those spans go, so switching destinations doesn't touch how they're generated",
      "The script actually needs several other changes not shown in the lab",
      "Jaeger only works with OpenAI and Anthropic, not Ollama",
    ],
    correctIndex: 1,
    explanation: "This is the practical payoff of building on OpenTelemetry: instrumentation (what gets recorded) and export (where it goes) are separate concerns. The same trace can go to a terminal, a local Jaeger container, or a production observability platform without changing a single decorator.",
  },
];
