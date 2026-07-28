import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question: "The lab's app.py reuses the exact same ask() function from earlier chapters, unchanged. What did FastAPI actually add on top of it?",
    options: [
      "A completely new, faster implementation of the model-calling logic",
      "An HTTP layer: a route (@app.post(\"/ask\")) and request/response schemas (Question/Answer) that let any HTTP client call the same function that used to only run from a terminal",
      "Automatic caching and rate limiting built into the framework",
      "A requirement to rewrite the function using async/await",
    ],
    correctIndex: 1,
    explanation: "FastAPI doesn't change what the code does, it changes how it's reached. The model-calling logic is identical to every earlier lab; what's new is a network-reachable entry point in front of it.",
  },
  {
    question: "Calling the app directly with uv run uvicorn reaches Ollama fine, but the same app in Docker needs OLLAMA_URL=http://host.docker.internal:11434 to work. Why?",
    options: [
      "Docker containers can't make network requests at all without special configuration",
      "Inside a container, \"localhost\" refers to the container itself, not the host machine, so the app's default localhost:11434 looks for Ollama somewhere it isn't; host.docker.internal is Docker's hostname for reaching back out to the host",
      "Ollama requires a different API format when called from Docker",
      "The Dockerfile blocks all outbound network connections by default",
    ],
    correctIndex: 1,
    explanation: "This is the core networking gotcha of running containerized apps against services on the host: a container's \"localhost\" is its own isolated namespace, not your machine's. host.docker.internal exists specifically to bridge that gap.",
  },
  {
    question: "The Dockerfile copies pyproject.toml and uv.lock and runs uv sync before copying app.py, rather than copying everything in one step. What does that ordering buy?",
    options: [
      "It's required -- Docker cannot copy multiple files in one COPY instruction",
      "Docker layer caching: since dependencies change far less often than app code, this order means editing app.py and rebuilding reuses the already-installed-dependencies layer instead of reinstalling everything from scratch",
      "It makes the final image smaller by excluding app.py from the dependency layer",
      "It's purely a style convention with no effect on build behavior",
    ],
    correctIndex: 1,
    explanation: "Docker caches each build step (layer) and only reruns it if its inputs changed. Installing dependencies before copying the frequently-changing app code means most rebuilds skip the slow uv sync step entirely.",
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
];
