# Few-Shot Academy

**🔗 Live site: [fewshotacademy.com](https://fewshotacademy.com/)**

A free, open-source, chapter-wise curriculum for Generative AI, LLMs, Vector Databases, RAG, and Agents — from "what is a token?" to a working, evaluated agentic RAG system.

Everything runs on your own laptop. No servers, no accounts, no required cloud spend:

- **Content site** (`site/`) — a static [Docusaurus](https://docusaurus.io/) site with the lessons, diagrams, and explanations. Live at [fewshotacademy.com](https://fewshotacademy.com/), deployed via Cloudflare Pages.
- **Hands-on labs** (`labs/`) — runnable Python code, one folder per track, that you clone and run locally against either a free local [Ollama](https://ollama.com) model or your own OpenAI/Anthropic API key. Vector storage uses a local, file-based [ChromaDB](https://www.trychroma.com/) — no server required. No git? Download a track's labs as a zip instead: [Foundations](https://fewshotacademy.com/downloads/academy-labs-foundations.zip), [Intermediate](https://fewshotacademy.com/downloads/academy-labs-intermediate.zip) (Advanced will be linked here once that track ships).

## Structure

```
academy/
├── site/    # Docusaurus content site
├── labs/    # companion runnable code, per track
│   ├── foundations/
│   ├── intermediate/
│   └── advanced/
├── LICENSE          # MIT — code (labs/ and other source)
└── LICENSE-CONTENT  # CC BY 4.0 — lesson content (site/docs/)
```

## Status

**Foundations**, **Intermediate**, and **Advanced** are all complete and live.

## License

Code is licensed under [MIT](./LICENSE). Lesson content is licensed under [CC BY 4.0](./LICENSE-CONTENT).
