import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "The chapter says Docker \"packages your code together with everything it needs to run... into one portable image.\" What problem is that solving that running the script locally doesn't already solve?",
    options: [
      "It makes the code itself run computations faster",
      "It bundles the code with its exact Python version, dependencies, and OS libraries, so \"works on my machine\" becomes \"works,\" regardless of what's already installed on whatever machine runs it next",
      "It replaces the need for a .env file entirely",
      "It automatically converts the app to a different programming language for portability",
    ],
    correctIndex: 1,
    explanation: "The chapter is explicit that Docker solves the gap between 'works on my machine' and 'works anywhere' -- by packaging the runtime environment itself, not just the code, so the same image behaves identically on a laptop or a cloud server.",
  },
  {
    question: "The chapter describes \"turning a script into an API\" as putting a small web server in front of a function. What actually changes for something calling that function once FastAPI is in front of it?",
    options: [
      "The function's internal logic has to be rewritten to be web-aware",
      "Another program can send an HTTP request (like POST /ask) and get an HTTP response back, instead of running the script directly and reading its terminal output",
      "The function can only be called by other Python programs, never by curl or a browser",
      "The function starts running continuously in the background instead of only on demand",
    ],
    correctIndex: 1,
    explanation: "FastAPI doesn't change what the function computes, it changes how it's reached -- from 'you, typing into a terminal' to any HTTP client sending a request and getting a response back.",
  },
  {
    question: "In the chapter's architecture diagram, the FastAPI app and the ask() function both sit inside the \"Docker container\" subgraph. What sits outside that boundary?",
    options: [
      "Nothing -- the whole diagram is inside the Docker container",
      "The curl client making the request, and the model provider (Ollama/OpenAI/Anthropic) that ask() ultimately calls out to",
      "Only the model provider is outside; the curl client is also inside the container",
      "Only the curl client is outside; the model provider runs inside the container too",
    ],
    correctIndex: 1,
    explanation: "The container packages the app and its code, not the things it talks to. The client sending requests and the model provider receiving calls from ask() both live outside the container boundary, exactly as the diagram shows.",
  },
  {
    question: "The lab's Question and Answer classes are Pydantic BaseModels, even though this curriculum's lab code otherwise avoids classes. Why is that not a contradiction of the \"no unnecessary abstraction\" rule?",
    options: [
      "Pydantic models aren't actually classes under the hood",
      "FastAPI's normal, expected way to define request/response schemas is a Pydantic model -- using the framework's own idiom isn't adding an abstraction on top of the problem, it's how the problem is meant to be solved",
      "The rule against classes only applies to labs that don't use any external framework",
      "Question and Answer are actually optional and could be removed with no effect",
    ],
    correctIndex: 1,
    explanation: "The style guidance is about avoiding abstraction for its own sake, not about avoiding a framework's standard patterns. FastAPI validates and documents endpoints through Pydantic models; fighting that to avoid a class would be the actual unnecessary complication.",
  },
  {
    question: "The local Docker container starts in under a second whenever you run docker run. The live Render deploy, on its free tier, can take about a minute to respond to the first request after sitting idle. What's causing that specific delay?",
    options: [
      "Render's free tier deliberately throttles response speed on every single request, not just the first",
      "Render spins a Free web service down after 15 minutes with no traffic to save resources, and spinning it back up on the next incoming request is what takes the time, after that it responds normally until it goes idle again",
      "The Docker image has to be rebuilt from scratch on every request",
      "OpenAI and Anthropic's APIs are simply slower to respond than Ollama",
    ],
    correctIndex: 1,
    explanation: "This is specific to running on a free host: Render suspends an idle Free service after 15 minutes of no traffic to avoid keeping unused containers running, and the next request has to wake it back up before it can answer, which is where that one-time delay comes from. The local Docker run never sleeps because nothing is managing it that way, it just runs as long as your terminal does.",
  },
];
