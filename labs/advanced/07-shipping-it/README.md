# Lab 7: Shipping It

Companion lab for [Advanced Chapter 7: Shipping It](https://fewshotacademy.com/docs/advanced/07-shipping-it). Wraps the support bot in a small FastAPI app, then packages that app in a Docker container, the first lab in this curriculum where you write a Dockerfile instead of just running someone else's image.

## Before you start

This lab works with any provider. Ollama is free and local. You'll need [Docker](https://docs.docker.com/get-docker/) installed for the second half (any Docker Desktop-compatible engine, Rancher Desktop, Docker Desktop, Colima, works the same way).

## Steps: run it locally first

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/advanced/07-shipping-it
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/advanced/07-shipping-it
   ```

2. **If you're using Ollama, make sure the model is pulled and Ollama is running:**

   ```bash
   ollama pull llama3.2
   ```

3. **Set up your `.env`:**

   ```bash
   cp .env.example .env
   ```

   On Windows Command Prompt, `cp` isn't a built-in command, use `copy` instead:

   ```cmd
   copy .env.example .env
   ```

   If you're using Ollama, `PROVIDER=ollama` is already set, leave it as-is.

4. **Run the app:**

   ```bash
   uv run uvicorn app:app --reload
   ```

5. **In a second terminal, call it:**

   ```bash
   curl http://localhost:8000/health
   curl -X POST http://localhost:8000/ask -H "Content-Type: application/json" -d '{"question": "What is your best-selling drink?"}'
   ```

   💡 On Windows PowerShell, run `curl.exe` instead of plain `curl` -- PowerShell aliases `curl` to `Invoke-WebRequest`, which doesn't accept `-d` the same way. `curl.exe` runs the real curl binary that ships with Windows 10 and later, and both commands above work as written.

### What you should see

Real output, `PROVIDER=ollama`:

```
$ curl http://localhost:8000/health
{"status":"ok","provider":"ollama"}

$ curl -X POST http://localhost:8000/ask -H "Content-Type: application/json" -d '{"question": "What is your best-selling drink?"}'
{"answer":"Our best-selling drink is the Depot Latte - a rich and creamy blend of espresso, steamed milk, and a hint of vanilla flavoring."}
```

Stop the app with `Ctrl+C` when you're done, before moving to the Docker steps.

## Steps: package it in Docker

6. **Build the image:**

   ```bash
   docker build -t fernwood-api .
   ```

7. **Run the container.** This is the one step that's genuinely different from running locally: inside the container, `localhost` refers to the container itself, not your Mac, so it can't reach Ollama on your host at `http://localhost:11434` the way the app does when run directly. `OLLAMA_URL` overrides that:

   ```bash
   docker run --rm -d --name fernwood-api --env-file .env -e OLLAMA_URL=http://host.docker.internal:11434 -p 8000:8000 fernwood-api
   ```

   `host.docker.internal` is a special hostname Docker sets up that always points back to your host machine, this only matters for Ollama, OpenAI's and Anthropic's APIs are already out on the internet, so `PROVIDER=openai` or `PROVIDER=anthropic` need no such override.

8. **Call it, exactly the same way as the local run:**

   ```bash
   curl http://localhost:8000/health
   curl -X POST http://localhost:8000/ask -H "Content-Type: application/json" -d '{"question": "How many locations do you have?"}'
   ```

   💡 Same note as step 5: on Windows PowerShell, use `curl.exe` instead of plain `curl`.

### What you should see

Real output, same questions, now answered by code running inside a container instead of directly on your machine:

```
$ curl http://localhost:8000/health
{"status":"ok","provider":"ollama"}

$ curl -X POST http://localhost:8000/ask -H "Content-Type: application/json" -d '{"question": "How many locations do you have?"}'
{"answer":"We currently have three locations in our home state."}
```

9. **Stop the container when you're done:**

   ```bash
   docker stop fernwood-api
   ```

## What the lab is actually doing

Open `app.py`.

1. **The same `ask()` function** from every earlier lab, unchanged, PROVIDER branching and all. FastAPI doesn't need your model logic to look any different, it just calls the same function a request handler.
2. **`Question` and `Answer`** are Pydantic models (FastAPI's normal, expected way to define a request/response shape, this isn't the kind of abstraction the rest of this curriculum avoids, it's the framework's idiom). FastAPI uses them to validate incoming JSON and generate the response schema automatically.
3. **`ollama_url`** reads an `OLLAMA_URL` environment variable, defaulting to `http://localhost:11434` for local runs. That one line is what makes the Docker step above work at all.

Open `Dockerfile`. It's five real steps: start from a slim Python base image, install `uv`, copy in `pyproject.toml` and `uv.lock` and run `uv sync` (this layer only rebuilds when dependencies actually change, not on every code edit), copy in the app code, and run it with `uvicorn` bound to `0.0.0.0` so it accepts connections from outside the container, not just `localhost` inside it.

## Troubleshooting

- **`ConnectionError` or a timeout calling `/ask` from inside Docker, but the local run worked fine**: almost always the `OLLAMA_URL` override, double check the `docker run` command included `-e OLLAMA_URL=http://host.docker.internal:11434` and that Ollama is actually running on your host.
- **`docker build` fails on the `uv sync` step**: make sure `uv.lock` exists in the folder (it's committed to the repo) and wasn't excluded by a `.dockerignore` you added yourself, this lab doesn't ship one.
- **Port 8000 already in use**: something else (maybe the local `uvicorn` run from step 4) is still bound to it. Stop that process, or change `-p 8000:8000` to `-p 8001:8000` and call `http://localhost:8001` instead.
- **`docker: command not found`**: install Docker Desktop, Rancher Desktop, or another Docker-compatible engine, and make sure it's actually running (not just installed) before `docker build`.
