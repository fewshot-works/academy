# Advanced Chapter 3 lab: comparing prompting, retrieval-augmented context,
# and a real (tiny) LoRA fine-tune on the same factual questions.
#
# This lab is different from every other one in the curriculum: it trains a
# model, not just calls one. It's still small and fast, distilgpt2 is an
# 82-million-parameter model, LoRA only trains a tiny fraction of that, and
# the whole thing runs on CPU in a few minutes, no GPU, no API key, no
# PROVIDER setting.

from datasets import Dataset
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM, AutoTokenizer, DataCollatorForLanguageModeling, Trainer, TrainingArguments

MODEL_NAME = "distilgpt2"

# Twelve facts about three fictional coffee companies -- the same corpus
# used in Chapters 2 and 3, reformatted as question/answer pairs a tiny
# model can actually learn to reproduce.
TRAINING_QA = [
    ("What is Fernwood Coffee Co.'s best-selling drink?", "The Depot Latte, a vanilla-and-cardamom latte named after the old train depot."),
    ("How many locations does Fernwood Coffee Co. have?", "Three locations, all in the same state."),
    ("Where does Fernwood Coffee Co. source its beans?", "From three small farms, one in Ethiopia, one in Colombia, and one in Guatemala."),
    ("How many purchases before Fernwood Coffee Co. gives you a free drink?", "Ten purchases."),
    ("What is Harbor Bean Roasters' top-selling drink?", "The Cardamom Cloud Latte."),
    ("How many locations does Harbor Bean Roasters have?", "Two locations, both near the waterfront."),
    ("Where does Harbor Bean Roasters source its beans?", "Through a single import broker, not directly from farms."),
    ("How many purchases before Harbor Bean Roasters gives you a free drink?", "Eight purchases."),
    ("What is Whistlepost Coffee's most popular drink?", "The Smoked Maple Cold Brew."),
    ("How many locations does Whistlepost Coffee have?", "One flagship location, inside a converted railway signal box."),
    ("Where does Whistlepost Coffee source its beans?", "From a single farm in Honduras."),
    ("Does Whistlepost Coffee have a loyalty program?", "No, Whistlepost doesn't run a loyalty program."),
]

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
tokenizer.pad_token = tokenizer.eos_token

# --- Step 1: turn the facts into training text and tokenize them ---
texts = [f"Q: {q}\nA: {a}{tokenizer.eos_token}" for q, a in TRAINING_QA]
dataset = Dataset.from_dict({"text": texts})


def tokenize(example):
    return tokenizer(example["text"], truncation=True, max_length=64)


tokenized_dataset = dataset.map(tokenize, remove_columns=["text"])

# The collator pads each batch to the longest example in it (not a fixed 64
# every time) and automatically masks the padding in `labels` with -100, so
# the model isn't trained to predict padding filler -- only the real text.
data_collator = DataCollatorForLanguageModeling(tokenizer, mlm=False)

# --- Step 2: wrap the base model with a small LoRA adapter ---
base_model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=["c_attn"],
    lora_dropout=0.05,
    task_type="CAUSAL_LM",
)
model = get_peft_model(base_model, lora_config)
model.print_trainable_parameters()

# --- Step 3: train. Only twelve examples, so many epochs, small dataset,
# small model -- this takes a couple of minutes on a laptop CPU. ---
training_args = TrainingArguments(
    output_dir="./lora-output",
    num_train_epochs=120,
    per_device_train_batch_size=4,
    learning_rate=1e-3,
    logging_steps=30,
    save_strategy="no",
    report_to=[],
)

trainer = Trainer(model=model, args=training_args, train_dataset=tokenized_dataset, data_collator=data_collator)
trainer.train()
model.eval()  # turn dropout off -- training left it on, and generation doesn't need it


def generate(prompt, use_adapter):
    inputs = tokenizer(prompt, return_tensors="pt")
    if use_adapter:
        output_ids = model.generate(**inputs, max_new_tokens=25, do_sample=False, pad_token_id=tokenizer.eos_token_id)
    else:
        # LoRA adapters can be switched off on the same model object --
        # no need to keep two separate models loaded to compare before/after.
        with model.disable_adapter():
            output_ids = model.generate(**inputs, max_new_tokens=25, do_sample=False, pad_token_id=tokenizer.eos_token_id)
    full_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    answer = full_text[len(prompt):].strip()
    # The tiny model doesn't always stop cleanly at the end of its answer --
    # it keeps going and starts inventing the next "Q:". We only want the
    # first answer, so cut at the first newline.
    return answer.split("\n")[0].strip()


# ============================================================
# Comparison 1: a question the fine-tune WAS trained on
# ============================================================
print("\n=== Question from the training set ===")
question = "How many purchases before Fernwood Coffee Co. gives you a free drink?"
print(f"Q: {question}\n")

print("A. Base model, no context, no fine-tune:")
print(" ", generate(f"Q: {question}\nA:", use_adapter=False))

print("B. Base model + retrieved context (what RAG hands it):")
context = "Fernwood Coffee Co.'s loyalty program gives customers a free drink after every ten purchases."
print(" ", generate(f"Context: {context}\nQ: {question}\nA:", use_adapter=False))

print("C. LoRA fine-tuned model, no context:")
print(" ", generate(f"Q: {question}\nA:", use_adapter=True))


# ============================================================
# Comparison 2: a fact that changed AFTER the fine-tune was trained --
# this is the question that actually separates the three approaches
# ============================================================
print("\n=== Question about a fact that changed after fine-tuning ===")
new_question = "How many locations does Fernwood Coffee Co. have now?"
print(f"Q: {new_question}\n")

print("A. Base model, no context, no fine-tune:")
print(" ", generate(f"Q: {new_question}\nA:", use_adapter=False))

print("B. Base model + retrieved context (what RAG hands it):")
new_context = "Fernwood Coffee Co. just opened a fourth location, a coffee truck that visits local farmers markets on weekends."
print(" ", generate(f"Context: {new_context}\nQ: {new_question}\nA:", use_adapter=False))

print("C. LoRA fine-tuned model, no context:")
print(" ", generate(f"Q: {new_question}\nA:", use_adapter=True))
