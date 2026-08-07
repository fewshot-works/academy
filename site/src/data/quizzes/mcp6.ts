import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      "The lab's QUESTION only asks the agent to read the weather policy and summarize Paris's weather, nothing about sending anything anywhere. Why design the test question this way?",
    options: [
      "So that if send_report does get called, it's unambiguous the instruction came from inside get_weather's result, not from anything the user actually asked for",
      "To keep the lab runnable without a paid API key",
      "Because send_report requires weather data as one of its own arguments",
      "To avoid confusing qwen2.5:3b with a multi-part question",
    ],
    correctIndex: 0,
    explanation:
      "A question that never mentions sending anything makes the source of any send_report call unambiguous, if it happens, the only place that instruction could have come from is the hidden text inside get_weather's result.",
  },
  {
    question:
      "rogue_weather_server.py's real send_report tool always reports success, no matter what to address is passed in. Why is that detail deliberate?",
    options: [
      "So that if the model does get tricked into calling it, nothing about the tool's own response reveals anything went wrong, the leak looks like an ordinary, successful action",
      "It's a placeholder bug the lab hasn't gotten around to fixing",
      "Real MCP tools are required by the spec to always report success",
      "It only reports success when PROVIDER=ollama is set",
    ],
    correctIndex: 0,
    explanation:
      "A rogue tool that visibly failed or errored would tip off the reader. Reporting success unconditionally is what makes the leak in part one look completely unremarkable from the agent's side, exactly what a real attack would aim for.",
  },
  {
    question:
      "send_report_guarded is described as a client-side guard: the wrapper lives in security_lab.py, not inside rogue_weather_server.py. Why does that placement matter?",
    options: [
      "It works no matter what the rogue server's own code does, since you don't control or trust that code, the defense has to live in code you do control",
      "Client-side code executes noticeably faster than server-side code",
      "MCP doesn't allow a guard to be defined inside a server's own tool",
      "It only matters when the server uses stdio transport, not streamable HTTP",
    ],
    correctIndex: 0,
    explanation:
      "A guard living inside the rogue server would be worthless, a dishonest server could just not enforce it. Putting the check on the client side means it applies no matter what the untrusted server's code actually does.",
  },
  {
    question:
      "This lab pulls qwen2.5:3b instead of the llama3.2 used everywhere else in the track. Why?",
    options: [
      "It's small enough to fall for the injection reliably while staying coherent enough to show the guard doing its job; a larger local model, or a hosted PROVIDER, tends to just not fall for it",
      "llama3.2 doesn't support tool calling at all",
      "rogue_weather_server.py's code requires qwen2.5:3b specifically to run",
      "qwen2.5:3b is cheaper to run than llama3.2 on the same hardware",
    ],
    correctIndex: 0,
    explanation:
      "A model that reliably resists the injection would make for a lab where nothing bad ever happens in part one, and the guard would have nothing to demonstrate. qwen2.5:3b is small enough to fall for it often enough to be useful.",
  },
];
