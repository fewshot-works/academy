---
sidebar_position: 8
description: "Wrapping the support bot in a small FastAPI app, then writing a Dockerfile to package it so it can run anywhere, not just on your machine -- including the one networking gotcha every Docker beginner hits, and putting it on a live URL."
---

import Quiz from '@site/src/components/Quiz';
import {questions as adv7Questions} from '@site/src/data/quizzes/adv7';

# Chapter 7: Shipping It

> **Time:** 35 minutes. **Cost:** $0 -- Render's free tier needs no credit card, but the live deploy step needs a real OpenAI or Anthropic key (a few cents), since a server on the internet can't reach the Ollama running on your laptop.

A recipe that only works in your kitchen, with your specific pots, your specific oven, isn't really a recipe anyone else can follow. Every lab so far has been a script you run yourself, on your machine, in your terminal. That's fine for learning, it's useless for shipping. A real product needs to run on a server nobody's sitting in front of, get called by other programs (a website, a mobile app, another service), and behave identically whether it's running on your laptop or someone else's cloud account. This chapter takes the support bot from earlier chapters and does the two things that turn a script into a service: wraps it in an HTTP API, and packages that API so it runs the same way anywhere.

## An API, then a container

**Turning a script into an API** means putting a small web server in front of your function. Instead of running `python script.py` and reading the terminal, another program sends an HTTP request (`POST /ask` with a question) and gets an HTTP response (JSON with an answer) back. [FastAPI](https://fastapi.tiangolo.com/) is a lightweight Python framework built for exactly this, a few lines of code turn any function into an endpoint.

**Packaging that API in Docker** solves a different problem: "works on my machine" is not the same as "works." Docker packages your code together with everything it needs to run, the Python version, every dependency, down to the operating system libraries, into one portable image. Build it once, and it runs identically on your laptop, a teammate's laptop, or a cloud server, because it's not relying on whatever happens to already be installed there.

```mermaid
flowchart LR
    C["curl / another app"] -->|"POST /ask"| A["FastAPI app\n(app.py)"]
    A --> M["ask() -- same function\nfrom every earlier lab"]
    M --> P["Ollama / OpenAI / Anthropic"]
    subgraph D["Docker container"]
        A
        M
    end
```

## A container that only runs when you're there

A lighthouse that only shines when the keeper is standing next to it, watch in hand, isn't protecting any ships. The whole point of a lighthouse is that it works when nobody has to be there. Everything so far, including the Docker container, only runs while it's sitting on your machine with a terminal open. Close the laptop and the API is gone. Getting it onto a **host**, a computer somewhere else that stays on and stays reachable, is what actually makes it a service other people (or other programs) can use.

This chapter uses [Render](https://render.com/) for that host: it builds straight from the same Dockerfile already sitting in the lab folder, no new files to write, and its free tier needs no credit card. That last part matters, several popular hosts (Fly.io included) removed their truly-free tiers and now require a card on file even to try them, Render still doesn't as of this writing.

<details>
<summary>Why not deploy with Ollama, the way the local Docker run does?</summary>

The local Docker step reaches Ollama through `host.docker.internal`, Docker's hostname for "the machine this container is running on." That trick only works because the container and Ollama are on the *same* physical machine. Once the container moves to Render's servers, there is no laptop nearby to reach, `host.docker.internal` would point at Render's own machine, which doesn't have Ollama installed. The live deploy step needs a provider reachable over the open internet, which means `PROVIDER=openai` or `PROVIDER=anthropic` with a real API key.
</details>

## Hands-on lab: FastAPI, then a Dockerfile, then a live URL

The lab's `app.py` doesn't introduce new agent logic, it takes the exact same `ask()` function from every earlier chapter and puts an HTTP layer in front of it.

Full instructions: [`labs/advanced/07-shipping-it`](https://github.com/fewshot-works/academy/tree/main/labs/advanced/07-shipping-it)

Run locally first, with Ollama:

```
$ curl http://localhost:8000/health
{"status":"ok","provider":"ollama"}

$ curl -X POST http://localhost:8000/ask -H "Content-Type: application/json" -d '{"question": "What is your best-selling drink?"}'
{"answer":"Our best-selling drink is the Depot Latte - a rich and creamy blend of espresso, steamed milk, and a hint of vanilla flavoring."}
```

💡 On Windows PowerShell, run `curl.exe` instead of plain `curl` -- PowerShell aliases `curl` to `Invoke-WebRequest`, which doesn't accept `-d` the same way. `curl.exe` runs the real curl binary that ships with Windows 10 and later, and the command above works as written.

Then build and run the exact same app inside Docker:

```bash
docker build -t fernwood-api .
docker run --rm -d --name fernwood-api --env-file .env -e OLLAMA_URL=http://host.docker.internal:11434 -p 8000:8000 fernwood-api
```

```
$ curl http://localhost:8000/health
{"status":"ok","provider":"ollama"}

$ curl -X POST http://localhost:8000/ask -H "Content-Type: application/json" -d '{"question": "How many locations do you have?"}'
{"answer":"We currently have three locations in our home state."}
```

Same code, same questions, same shape of answers, one running directly on the machine, the other running inside an isolated container. That `-e OLLAMA_URL=http://host.docker.internal:11434` is the one line that makes the second one work: **inside a container, `localhost` means the container itself, not your host machine.** The app's normal `http://localhost:11434` would try to find Ollama running *inside the container*, where it doesn't exist. `host.docker.internal` is Docker's special hostname for "actually, the machine running this container", overriding the URL through an environment variable is how the same code adapts to that without an `if running_in_docker:` check anywhere.

### Optional: put it on a live URL

This part needs a free [Render](https://render.com/) account (no credit card) and a GitHub account. Render builds from a repo, not from a Dockerfile sitting on your laptop. If you'd rather stop here, the local Docker container above is a complete, working stopping point.

1. **Fork [the academy repo](https://github.com/fewshot-works/academy)** to your own GitHub account (button in the top right of that page).

2. **In the Render dashboard**, click **New > Web Service** and connect your fork. When asked for the **Language**, choose **Docker** (this folder's `Dockerfile` is what gets built).

3. **Point it at this lab's subfolder.** The repo is a monorepo, so Render needs to know this app doesn't live at the repo root: in the service's **Settings > Build & Deploy**, set **Root Directory** to `labs/advanced/07-shipping-it`, then trigger a manual deploy. (Some Render dashboards offer this field during initial setup too, use whichever one you see.)

4. **Add environment variables** under the service's Environment tab, the same two keys as your local `.env`, but for a real key this time:

   ```
   PROVIDER=openai
   OPENAI_API_KEY=sk-...
   ```

   (Or `PROVIDER=anthropic` / `ANTHROPIC_API_KEY`. Don't set `OLLAMA_URL`, see the note above on why Ollama can't be reached from here.)

5. **Deploy.** Render builds the same `Dockerfile` you already tested locally and gives you a public URL like `https://fernwood-api.onrender.com`.

6. **Call it, exactly the same commands as before, just a different host:**

   ```bash
   curl https://fernwood-api.onrender.com/health
   curl -X POST https://fernwood-api.onrender.com/ask -H "Content-Type: application/json" -d '{"question": "What is your best-selling drink?"}'
   ```

   💡 On Windows PowerShell, remember `curl.exe` instead of plain `curl`, same reason as the note earlier in this chapter.

💡 Render's free tier spins a service down after **15 minutes** with no traffic, and spinning it back up on the next request takes **about a minute**. That first slow `curl` is expected, not a bug, it's the tradeoff for a free host that isn't running 24/7.

🖥️ **Want to see it, not just curl it?** FastAPI automatically serves an interactive UI at `/docs`, no code required. Open `https://fernwood-api.onrender.com/docs` in a browser and try the `/ask` endpoint by clicking through it, an easy way to actually show someone the live deploy.

Nothing about `app.py` or the `Dockerfile` changed to make this work. The same image that ran on your laptop now runs on Render's, the only thing that moved is *where* the container lives, which is exactly the point of packaging it in Docker in the first place.

## Checkpoint

<details>
<summary>The exact same `ask()` function from Chapters 4-6 is reused unchanged in this chapter's `app.py`. What did actually change to turn it into a web service?</summary>

Nothing about the model-calling logic changed at all. What's new is the layer around it: FastAPI's `@app.post("/ask")` decorator turns the function into something reachable over HTTP, and `Question`/`Answer` Pydantic models define what a valid request and response look like. The service boundary moved from "you, typing into a terminal" to "any HTTP client," the actual work being done is identical.
</details>

<details>
<summary>Running the app with `uv run uvicorn app:app` works fine and reaches Ollama with no special configuration. Running the same app in Docker needs `OLLAMA_URL=http://host.docker.internal:11434`. Why the difference?</summary>

A container has its own isolated network namespace. Inside it, "localhost" resolves to the container itself, not the machine hosting it, so `http://localhost:11434` looks for an Ollama server running inside the container, which doesn't exist. `host.docker.internal` is a hostname Docker provides specifically to reach back out to the host machine from inside a container, which is where Ollama is actually running.
</details>

<details>
<summary>The Dockerfile copies `pyproject.toml` and `uv.lock` and runs `uv sync` *before* copying `app.py`. Why that order, rather than copying everything at once?</summary>

Docker builds images in layers, and reuses a layer from a previous build if nothing that layer depends on has changed. Dependencies (`pyproject.toml`/`uv.lock`) change far less often than application code. Installing them in an earlier layer means editing `app.py` and rebuilding doesn't reinstall every dependency from scratch, only the last layer (copying the code) actually redoes work. On a project with real dependencies, that's the difference between a multi-minute rebuild and a near-instant one.
</details>

<details>
<summary>The live deploy sets `OPENAI_API_KEY` as an environment variable in Render's dashboard, rather than baking it into the Docker image with a line like `ENV OPENAI_API_KEY=sk-...` in the Dockerfile. Why does that distinction matter?</summary>

A Docker image is just files, anyone who gets a copy of it (pulls it from a registry, inspects its layers) can read anything baked into it, including an `ENV` line. Setting the key as a platform-level environment variable instead means it's never part of the image itself, it's injected into the container only when Render actually runs it, and it's the exact same reason `.env` is gitignored locally: secrets belong in the deploy target's configuration, not in anything that gets built, committed, or shared.
</details>

## Check Your Knowledge

<details>
<summary>Click to start quiz</summary>

<Quiz chapterId="adv7" questions={adv7Questions} />

</details>

## What's next

You now have every individual piece: retrieval, agents, guardrails, tracing, caching, and a container that's actually live on the internet, not just sitting on your laptop. The capstone puts them all in one system, an agent with real tools, evaluated, guarded, and traced, wrapped in the same API-and-container shape as this chapter, so it's not just a working system, it's one you already know how to ship.
