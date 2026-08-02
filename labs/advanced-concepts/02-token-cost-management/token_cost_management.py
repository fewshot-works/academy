# Advanced Concepts lab: two experiments in one script.
#
# Part one: a support conversation about a fictional app, TaskFlow, has grown
# to eight back-and-forth turns. Resending the whole thing on every new
# message means paying for the same tokens over and over. This part compares
# sending the FULL conversation history against sending a TRIMMED version
# (a one-line summary of the older turns, folded into the system prompt,
# plus only the most recent exchange), and checks that the trimmed version
# still has enough information to answer correctly.
#
# Part two: the same small logic puzzle gets asked of a small model and a
# large model from the same provider, so you can see the token count and the
# reasoning quality side by side, the actual trade-off behind "right-sizing."
#
# Which provider this uses (Ollama, OpenAI, or Anthropic) is controlled by
# the PROVIDER variable in your .env file. See README.md for setup steps.

import os
import tiktoken
from dotenv import load_dotenv

load_dotenv()  # reads .env, makes PROVIDER (and any API keys) available below

provider = os.getenv("PROVIDER", "ollama")

# Every provider tokenizes slightly differently. tiktoken is OpenAI's
# tokenizer, we use it here as a consistent ruler across all three providers,
# not as an exact count for Ollama or Anthropic. Close enough to compare
# "bigger" vs "smaller," which is the point of this lab.
encoding = tiktoken.get_encoding("cl100k_base")

# One small model and one large model per provider. Same pattern as every
# other lab in this course, PROVIDER picks the provider, this dict just adds
# a size on top of that.
OLLAMA_MODELS = {"small": "llama3.2:1b", "large": "llama3.2"}
OPENAI_MODELS = {"small": "gpt-4o-mini", "large": "gpt-4o"}
ANTHROPIC_MODELS = {"small": "claude-haiku-4-5-20251001", "large": "claude-sonnet-5"}


def count_tokens(messages):
    text = " ".join(message["content"] for message in messages)
    return len(encoding.encode(text))


def ask(messages, model_size="small"):
    # messages is a list of {"role": ..., "content": ...} dicts, same shape
    # every provider's chat API expects. Anthropic is the one exception, it
    # wants the system message pulled out and passed as its own argument
    # instead of left in the list.
    if provider == "ollama":
        import requests

        model = OLLAMA_MODELS[model_size]
        response = requests.post(
            "http://localhost:11434/api/chat",
            json={"model": model, "messages": messages, "stream": False},
        )
        return response.json()["message"]["content"]

    elif provider == "openai":
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        model = OPENAI_MODELS[model_size]
        response = client.chat.completions.create(model=model, messages=messages)
        return response.choices[0].message.content

    elif provider == "anthropic":
        import anthropic

        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        model = ANTHROPIC_MODELS[model_size]

        system = None
        chat_messages = messages
        if messages and messages[0]["role"] == "system":
            system = messages[0]["content"]
            chat_messages = messages[1:]

        if system:
            response = client.messages.create(
                model=model, max_tokens=300, system=system, messages=chat_messages
            )
        else:
            response = client.messages.create(model=model, max_tokens=300, messages=chat_messages)
        return response.content[0].text

    else:
        print(f"Unknown provider '{provider}'. Set PROVIDER to ollama, openai, or anthropic in your .env")
        exit()


# ============================================================
# Part one: context trimming.
# ============================================================

print("=" * 60)
print("PART ONE: context trimming")
print("=" * 60)

SYSTEM_PROMPT = (
    "You are a support assistant for TaskFlow, a task-management app. Plan "
    "details: the Free plan does not include priority support. The Pro plan "
    "(monthly or annual) includes priority support. The Team plan includes "
    "priority support and a dedicated Slack channel."
)

# What actually happened earlier in this conversation, turn by turn.
CONVERSATION = [
    ("user", "Hey, I'm having trouble syncing my tasks between devices."),
    ("assistant", "Sorry to hear that! Can you tell me which plan you're on and which devices you're syncing between?"),
    ("user", "I'm on the Pro plan, billed annually. Syncing between my laptop and phone."),
    ("assistant", "Got it. Try toggling sync off and back on in Settings > Sync. Let me know if that helps."),
    ("user", "That didn't work, still not syncing."),
    ("assistant", "Can you check if you're on the latest app version? We shipped a sync fix in version 4.2."),
    ("user", "Just updated to 4.2, sync is working now, thanks!"),
    ("assistant", "Great, glad that's resolved! Let me know if anything else comes up."),
]

FINAL_QUESTION = "What plan am I on again, and does that plan include priority support?"

# The full version: system prompt, every turn so far, then the new question.
# This is what you'd send if you just kept appending to the message list
# forever.
full_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
full_messages += [{"role": role, "content": content} for role, content in CONVERSATION]
full_messages += [{"role": "user", "content": FINAL_QUESTION}]

# The trimmed version: the older turns get folded into one summary sentence
# added to the system prompt (standing in for what an automatic
# summarization step would produce, see Intermediate Chapter 7 on memory),
# then only the most recent exchange is kept in full, then the new question.
SUMMARY = (
    "Earlier in this conversation, the user said they're on the Pro plan, "
    "billed annually, and had a sync issue between laptop and phone that "
    "was resolved after updating to app version 4.2."
)
trimmed_messages = [
    {"role": "system", "content": SYSTEM_PROMPT + " " + SUMMARY},
    {"role": "user", "content": CONVERSATION[-2][1]},
    {"role": "assistant", "content": CONVERSATION[-1][1]},
    {"role": "user", "content": FINAL_QUESTION},
]

full_tokens = count_tokens(full_messages)
trimmed_tokens = count_tokens(trimmed_messages)
savings_percent = round((1 - trimmed_tokens / full_tokens) * 100)

print(f"\nFull history: {len(full_messages)} messages, ~{full_tokens} tokens")
print(f"Trimmed history: {len(trimmed_messages)} messages, ~{trimmed_tokens} tokens")
print(f"That's a ~{savings_percent}% drop in the tokens sent for this one turn.")

print("\n--- Response using FULL history ---")
full_reply = ask(full_messages)
print(full_reply.strip())

print("\n--- Response using TRIMMED history ---")
trimmed_reply = ask(trimmed_messages)
print(trimmed_reply.strip())

print(
    "\nBoth responses should mention the Pro plan and priority support. If "
    "the trimmed one still gets that right, the summary line preserved the "
    "one fact that actually mattered, and everything else was safe to drop."
)

# ============================================================
# Part two: model right-sizing.
# ============================================================

print()
print("=" * 60)
print("PART TWO: model right-sizing")
print("=" * 60)

# An easy classification task. One word back, no reasoning required, a
# small model is plenty.
EASY_MESSAGES = [
    "My card was charged twice for this month's subscription.",
    "The app crashes every time I try to add a subtask.",
    "It would be great if I could set recurring tasks.",
    "How do I change my display name?",
]

print("\n--- Easy task: one-word classification, small model only ---")
for message in EASY_MESSAGES:
    classify_prompt = [
        {
            "role": "system",
            "content": (
                "Classify the user's message into exactly one category: "
                "billing, bug, feature, or other. Reply with only that one "
                'word, nothing else. Example: "The app keeps freezing on '
                'startup" -> bug'
            ),
        },
        {"role": "user", "content": message},
    ]
    label = ask(classify_prompt, model_size="small")
    tokens = count_tokens(classify_prompt)
    print(f'  "{message}" -> {label.strip()}  [~{tokens} tokens]')

print(
    "\nA small model handling a one-word classification like this is the "
    "right-sizing win: same answer quality, a fraction of the cost of "
    "routing it to the large model."
)

# A harder task: a logic puzzle with several constraints to hold in mind at
# once. Worth checking whether the small model actually gets it right, or
# whether this is where the large model earns its higher cost.
LOGIC_PUZZLE = (
    "Alice, Bob, and Carla finished a race in some order. Alice did not "
    "finish first. Carla finished before Bob. Bob did not finish last. "
    "What was the finishing order, from first to last? Answer with just "
    "the three names in order."
)
puzzle_messages = [{"role": "user", "content": LOGIC_PUZZLE}]
puzzle_tokens = count_tokens(puzzle_messages)

print(f"\n--- Hard task: logic puzzle, small vs. large model [~{puzzle_tokens} tokens each] ---")
print(f"Question: {LOGIC_PUZZLE}")
print("(Correct order: Carla, Bob, Alice.)")

print("\nSmall model's answer:")
small_answer = ask(puzzle_messages, model_size="small")
print(small_answer.strip())

print("\nLarge model's answer:")
large_answer = ask(puzzle_messages, model_size="large")
print(large_answer.strip())

print(
    "\nCompare the two answers above against the correct order. This is the "
    "other half of right-sizing: the puzzle needs more reasoning than the "
    "classification did, so it's worth checking whether the model you "
    "picked actually delivers that reasoning, instead of assuming a bigger "
    "name automatically will."
)
