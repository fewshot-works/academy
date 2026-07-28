import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "OpenTelemetry produces two related concepts in this chapter's trace: a span and a trace. What's the actual difference between them?",
    options: [
      "They're two names for the same thing",
      "A span is one unit of work with a start time, end time, and attached details; a trace is a whole request's worth of spans strung together via parent_id, showing how they nest",
      "A trace only exists once spans are exported to a UI like Jaeger",
      "A span records timing only; a trace records prompt and completion content",
    ],
    correctIndex: 1,
    explanation: "The chapter's real captured trace shows this directly: individual spans (ollama.chat, ask_model.task, support_conversation.workflow) each cover one unit of work, and they're tied together into a single trace by parent_id references and a shared trace_id.",
  },
  {
    question: "The chapter builds on OpenLLMetry, which is built on OpenTelemetry, a vendor-neutral standard, rather than a proprietary tracing SDK. What's the actual benefit of that choice?",
    options: [
      "Vendor-neutral SDKs are always faster than proprietary ones",
      "You instrument your code once, and can send the resulting spans to whichever destination you want (console, Jaeger, a hosted platform) without changing the instrumentation itself -- no vendor lock-in",
      "OpenTelemetry is required by law for any production AI system",
      "Proprietary SDKs cannot capture prompt or completion content",
    ],
    correctIndex: 1,
    explanation: "The chapter's bonus section proves this in practice: switching from console output to Jaeger, or to LangSmith, changes exactly one line, Traceloop.init()'s destination argument. The @task/@workflow decorators and auto-instrumentation never change.",
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
    question: "The chapter's bonus section offers both a local Jaeger container and a hosted LangSmith account as trace UIs, even though this lab never imports LangChain. What's the actual trade-off between the two options?",
    options: [
      "LangSmith can't be used at all without also using LangChain in your code",
      "Jaeger needs Docker and a container to manage but keeps traces on your machine with no account; LangSmith needs a free account and sends traces off your machine, but neither needs any change beyond Traceloop.init()'s destination -- LangSmith accepts plain OTLP regardless of what library produced it",
      "Jaeger is strictly better in every way and LangSmith offers no advantage",
      "LangSmith requires rewriting the lab's @task and @workflow decorators",
    ],
    correctIndex: 1,
    explanation: "LangSmith works here specifically because it accepts standard OTLP traces, it doesn't care that the spans came from OpenLLMetry instead of LangChain. The real choice is local-and-account-free (Jaeger) versus zero-install-but-hosted (LangSmith), not a difference in what gets captured.",
  },
];
