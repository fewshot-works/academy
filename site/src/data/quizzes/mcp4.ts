import type {QuizQuestion} from '@site/src/components/Quiz';

export const questions: QuizQuestion[] = [
  {
    question:
      'While the client runs, terminal 1 prints lines like INFO: 127.0.0.1:... "POST /mcp HTTP/1.1" 200 OK. What is that?',
    options: [
      "An error indicating calculator_http_server.py crashed and had to restart mid-request",
      "Uvicorn, the web server running calculator_http_server.py, logging each HTTP request the client's MCP calls arrive as",
      "The client's own debug output, accidentally printed to the wrong terminal",
      'A sign that Ollama is sending requests directly to the calculator server, bypassing the client',
    ],
    correctIndex: 1,
    explanation:
      "Every tool call this lab makes arrives at the server as a real HTTP POST. Terminal 1's log lines are Uvicorn, the server underneath FastMCP, recording each one, visible proof the client is talking to it over the network rather than a subprocess pipe.",
  },
  {
    question:
      "Unlike Chapters 1-3's servers, calculator_http_server.py doesn't stop when the client script finishes running. Why not, and how do you actually stop it?",
    options: [
      "It's an independent process the client never owned in the first place, so it keeps running until you stop it yourself with Ctrl+C in its own terminal, the same way a server on another machine would keep running after any one client disconnects",
      "It automatically shuts down after 60 seconds of inactivity",
      'The client sends a shutdown signal, but only if PROVIDER=ollama',
      'It stops the moment terminal 2 is closed, regardless of what terminal 1 is doing',
    ],
    correctIndex: 0,
    explanation:
      "stdio servers lived and died with the client process that started them. This HTTP server has no such tie to any one client, so its lifecycle is yours to manage directly, Ctrl+C in terminal 1 when you're done.",
  },
  {
    question:
      'The troubleshooting section says if port 8000 is already taken on your machine, two files need updating to match a new port. Which two, and why both?',
    options: [
      "Only calculator_http_server.py needs changing, since it's the one that binds the port",
      "calculator_http_server.py's port=8000 (where the server listens) and http_client_agent.py's url (where the client looks for it), since the url is the only thing telling the client where the server lives",
      'Only http_client_agent.py, since the client is what fails to connect',
      ".env, since PROVIDER controls which port the server uses",
    ],
    correctIndex: 1,
    explanation:
      "The server binds whatever port you give it, and the client has no way to find it except the url you configured. Change one without the other and the client connects to the wrong place, or nowhere at all.",
  },
  {
    question:
      "If http_client_agent.py's url pointed at a server on a different machine on the internet instead of 127.0.0.1, what else in the client code would need to change?",
    options: [
      'The entire MultiServerMCPClient setup would need to be rewritten',
      'Nothing else — the url is the only thing that identifies where the server lives',
      'The tool calling logic in create_agent would need new parameters',
      "The 'transport' field would need to change to a different value",
    ],
    correctIndex: 1,
    explanation:
      "The url string is the only piece of config that says where the server is. A local 127.0.0.1 address and a remote hostname are handled identically by everything else in the client.",
  },
];
