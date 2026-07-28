# Lab 3: Fine-tuning vs. RAG vs. prompting

Companion lab for [Advanced Chapter 3: Fine-tuning vs. RAG vs. prompting](https://fewshot-works.github.io/academy/docs/advanced/03-fine-tuning-vs-rag-vs-prompting). A real, tiny LoRA fine-tune, trained and compared against plain prompting and retrieval-augmented context, on the same coffee shop facts from earlier chapters.

## Before you start

This lab is different from every other one in the curriculum: **it trains a model**, not just calls one. It's still small enough to run on a laptop CPU in a few seconds. `distilgpt2` is an 82-million-parameter model, LoRA only trains a tiny fraction of that (0.18% of parameters here), and there's no GPU, no API key, and no `.env` file, everything runs locally and offline.

The first run downloads `distilgpt2` from Hugging Face (about 350MB) and caches it.

## Steps

1. **Move into the lab folder.** If you already cloned the repo for an earlier lab, just `cd` into this one:

   ```bash
   cd academy/labs/advanced/03-fine-tuning-vs-rag-vs-prompting
   ```

   Otherwise, clone the repo first:

   ```bash
   git clone https://github.com/fewshot-works/academy.git
   cd academy/labs/advanced/03-fine-tuning-vs-rag-vs-prompting
   ```

2. **Run the script:**

   ```bash
   uv run fine_tune.py
   ```

   `uv` installs `torch`, `transformers`, `peft`, `datasets`, and `accelerate` on first run, that's a bigger download than most labs, give it a minute.

## What you should see

Training runs in a few seconds on CPU (twelve tiny examples, a tiny model). The loss should drop steadily, from around 3.5 down to under 0.3:

```
{'loss': '3.533', 'epoch': '10'}
{'loss': '1.847', 'epoch': '20'}
{'loss': '1.088', 'epoch': '30'}
{'loss': '0.7195', 'epoch': '40'}
{'loss': '0.5244', 'epoch': '50'}
{'loss': '0.4348', 'epoch': '60'}
{'loss': '0.3807', 'epoch': '70'}
{'loss': '0.3232', 'epoch': '80'}
{'loss': '0.3222', 'epoch': '90'}
{'loss': '0.2746', 'epoch': '100'}
{'loss': '0.2936', 'epoch': '110'}
{'loss': '0.263', 'epoch': '120'}
```

Then, two real comparisons:

```
=== Question from the training set ===
Q: How many purchases before Fernwood Coffee Co. gives you a free drink?

A. Base model, no context, no fine-tune:
  No.
B. Base model + retrieved context (what RAG hands it):
  The number of purchases before Fernwood Coffee Co. gives you a free drink after every ten purchases.
C. LoRA fine-tuned model, no context:
  Ten purchases.

=== Question about a fact that changed after fine-tuning ===
Q: How many locations does Fernwood Coffee Co. have now?

A. Base model, no context, no fine-tune:
  The number of locations is growing. We have a lot of locations in the area. We have a lot of locations in the
B. Base model + retrieved context (what RAG hands it):
  The number of locations is growing. We have a lot of locations in the state, and we have a lot of locations in
C. LoRA fine-tuned model, no context:
  Three locations, all in the same state.
```

💡 A few honest notes on this real run:

- **On a trained fact, fine-tuning wins cleanly.** "Ten purchases." is exactly the training answer, memorized and reproduced with no context needed. Base+context (B) also gets there, but its phrasing is clunkier, it's stitching the context sentence into an answer, not stating a fact it "knows."
- **On a fact that changed after training, fine-tuning goes stale.** The real Fernwood now has a fourth location (a coffee truck, per the injected context), but the fine-tuned model confidently answers "Three locations, all in the same state.", the exact fact it memorized during training, now outdated. It has no way to know that changed, its knowledge is frozen at training time.
- **Base+context (B) is the only approach that reacts to new information at all.** It doesn't produce a crisp "four locations, including a coffee truck" answer, `distilgpt2` is a small, weak model, but its answer visibly shifts ("locations is growing") when the injected context changes, while the fine-tuned model's answer doesn't move no matter what you tell it at question time.
- **The base model with no context and no fine-tune (A) doesn't know anything either time.** That's the baseline all of this is measured against.

This is the actual lesson: fine-tuning bakes facts into weights, which makes recall fast and doesn't need a retrieval step at request time, but those facts are frozen the moment training stops. RAG stays current because the facts live outside the model and get fetched fresh every time.

## What the script is actually doing

Open `fine_tune.py`.

1. **Twelve Q&A pairs** are the same facts from Chapters 2 and 3's coffee shop corpus, reformatted as `"Q: ...\nA: ..."` training text.
2. **Tokenization** truncates each example to 64 tokens; a `DataCollatorForLanguageModeling` pads each batch dynamically and automatically masks padding positions in the labels with `-100`, so the model isn't trained to predict padding filler.
3. **LoRA** (`LoraConfig` + `get_peft_model`) wraps `distilgpt2` with a small trainable adapter on its attention layers, `r=8`, targeting `c_attn`, only 147,456 of the model's 82 million parameters actually get updated.
4. **`Trainer`** runs 120 epochs over the twelve examples (that's normal for a dataset this small, a real fine-tune sees each example dozens or hundreds of times, not once).
5. **`generate(prompt, use_adapter)`** either generates with the LoRA adapter active, or temporarily disables it (`model.disable_adapter()`) to get the plain base model's behavior, no need to keep two separate models loaded to compare before/after.
6. **Two comparisons** run three ways each (A: base model alone, B: base model + a context sentence, C: fine-tuned model alone) to isolate what each approach actually contributes.

## Bonus: "fine-tuning-lite" with an Ollama Modelfile

The `Modelfile` in this folder shows the other end of the spectrum: **not real fine-tuning, but zero-infra and often good enough.** Instead of training anything, it bakes a system prompt full of facts into a saved, reusable model.

```bash
ollama create fernwood-bot -f Modelfile
ollama run fernwood-bot "How many purchases before I get a free drink?"
```

No GPU, no training loop, no `torch`, ready in seconds. The tradeoffs run the other way from LoRA, though:

- The facts live in the prompt, not the weights, so every request re-sends that whole system prompt, more tokens, more latency, than a model that actually learned the facts.
- It doesn't scale to hundreds of facts or a large document set, that's what RAG is for. A Modelfile is really "prompting with less typing," not fine-tuning.
- Updating a fact means editing the `Modelfile` and re-running `ollama create`, not retraining, which is actually an advantage if your facts change often.

Use this when you want a fine-tune's *convenience* (a saved, ready-to-go model) without paying for an actual training run. Use real fine-tuning (or RAG) when the base model needs to genuinely *know* something it currently doesn't, not just be reminded of it.

## Troubleshooting

- **First run is slow**: downloading `distilgpt2` (~350MB) and installing `torch` both happen once and are cached after that.
- **`NotImplementedError` mentioning `scaled_dot_product_attention` and MPS**: this is a known PyTorch/MPS issue with dropout during generation on Apple Silicon. The script already calls `model.eval()` after training to avoid it, if you hit this after modifying the script, check that `model.eval()` still runs before `generate()` is called.
- **Your loss numbers or generated text differ slightly from above**: training is deterministic given the same environment, but small floating-point differences across PyTorch versions/hardware can shift wording slightly. The pattern, trained facts recalled cleanly, post-training facts staying stale, should hold.
- **`ollama create` fails for the bonus section**: make sure Ollama is running and you've pulled a base model that matches the Modelfile's `FROM` line (`ollama pull llama3.2`).
