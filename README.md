# zero-to-agent

A free, open-source, chapter-wise curriculum for Generative AI, LLMs, Vector Databases, RAG, and Agents — from "what is a token?" to a working, evaluated agentic RAG system.

Everything runs on your own laptop. No servers, no accounts, no required cloud spend:

- **Content site** (`site/`) — a static [Docusaurus](https://docusaurus.io/) site with the lessons, diagrams, and explanations. Deployed free on [Vercel](https://vercel.com).
- **Hands-on labs** (`labs/`) — runnable Python code, one folder per tier, that you clone and run locally against either a free local [Ollama](https://ollama.com) model or your own OpenAI/Anthropic API key. Vector storage uses a local, file-based [ChromaDB](https://www.trychroma.com/) — no server required.

See [`PRD.md`](./PRD.md) for the full product plan: problem statement, market analysis, curriculum outline, architecture, and roadmap.

## Structure

```
zero-to-agent/
├── site/    # Docusaurus content site
├── labs/    # companion runnable code, per tier
│   ├── tier1-foundations/
│   ├── tier2-intermediate/
│   └── tier3-advanced/
├── PRD.md
├── LICENSE          # MIT — code (labs/ and other source)
└── LICENSE-CONTENT  # CC BY 4.0 — lesson content (site/docs/)
```

## Status

Early scaffold. Tier 1 content is being written next — see `PRD.md` §13 (Roadmap) and §15 (Next Steps).

## License

Code is licensed under [MIT](./LICENSE). Lesson content is licensed under [CC BY 4.0](./LICENSE-CONTENT).
