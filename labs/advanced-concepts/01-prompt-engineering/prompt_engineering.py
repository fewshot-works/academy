# Advanced Concepts lab: one question, four prompts. The same underlying
# question about a fictional bike shop gets asked four times, each time
# through a more deliberately written prompt, bloated, trimmed, structured,
# grounded, so you can watch the answer change as the prompt improves.
#
# One of the three questions has no answer in the source document at all.
# That's on purpose: it's the hallucination test. Watch which prompts make
# the model admit it doesn't know, and which ones guess.
#
# Which provider this uses (Ollama, OpenAI, or Anthropic) is controlled by
# the PROVIDER variable in your .env file. See README.md for setup steps.

import os
from dotenv import load_dotenv

load_dotenv()  # reads .env, makes PROVIDER (and any API keys) available below

provider = os.getenv("PROVIDER", "ollama")


def ask(user_message, system=None):
    # Sends one message, plus an optional system prompt, to whichever
    # provider is set in .env, and returns the model's reply as plain text.
    if provider == "ollama":
        import requests

        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": user_message})

        response = requests.post(
            "http://localhost:11434/api/chat",
            json={"model": "llama3.2", "messages": messages, "stream": False},
        )
        return response.json()["message"]["content"]

    elif provider == "openai":
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
        )
        return response.choices[0].message.content

    elif provider == "anthropic":
        # Anthropic keeps the system prompt as its own top-level argument
        # instead of a message with role "system".
        import anthropic

        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        if system:
            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=300,
                system=system,
                messages=[{"role": "user", "content": user_message}],
            )
        else:
            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=300,
                messages=[{"role": "user", "content": user_message}],
            )
        return response.content[0].text

    else:
        print(f"Unknown provider '{provider}'. Set PROVIDER to ollama, openai, or anthropic in your .env")
        exit()


# ============================================================
# The source document every prompt below is asking about. It answers
# questions 1 and 2. It never mentions the head mechanic's experience at
# all, question 3 is the trap that reveals whether a prompt is grounded.
# ============================================================

SOURCE_DOC = (
    "Riverbend Bikes is a family-owned bike shop in Millbrook. We're open "
    "Tuesday through Saturday, 9 AM to 6 PM, closed Sunday and Monday. We "
    "offer full tune-ups, flat repairs, and custom builds. Returns are "
    "accepted within 14 days with a receipt, for store credit only, no cash "
    "refunds. We do not sell electric bikes."
)

QUESTIONS = (
    "1. What are Riverbend Bikes' store hours?\n"
    "2. What is their return policy?\n"
    "3. How many years of experience does their head mechanic have?"
)

print("Source document (what's actually true):")
print(f"  {SOURCE_DOC}")
print()
print("The document answers questions 1 and 2. It never mentions the head")
print("mechanic's experience -- question 3 is a trap. Watch which prompts")
print("below make the model admit that, and which ones guess.")

results = []


def run_variant(label, prompt):
    word_count = len(prompt.split())
    print()
    print("=" * 60)
    print(label)
    print("=" * 60)
    print(f"[{word_count} words in the prompt]")
    print()
    print(prompt)
    print()
    reply = ask(prompt)
    print("--- Response ---")
    print(reply.strip())
    results.append((label, word_count))


# ============================================================
# 1. Bloated: vague, wordy, no structure, and it practically invites a
#    guess on the unanswerable question ("if you know or can guess").
# ============================================================

bloated_prompt = (
    "I need you to be really helpful and thorough here. I'm working on a "
    "project and it's important that you take your time and think carefully "
    "about everything before responding, and please make sure to be "
    "friendly and conversational in your tone since I really appreciate a "
    "warm response, and also try to be as detailed and comprehensive as "
    "possible in whatever you say because I'd rather have too much "
    "information than too little. By the way, here's some background info "
    f"about a bike shop called Riverbend Bikes: {SOURCE_DOC} So with all "
    "that in mind, can you maybe tell me a bit about their hours and stuff, "
    "and also their return policy, and I'm also kind of curious how "
    "experienced their staff is, like the head mechanic maybe, if you know "
    "or can guess, just give me your best sense of things. Thanks so much, "
    "you're the best!"
)
run_variant("1. BLOATED (vague, wordy, invites a guess)", bloated_prompt)

# ============================================================
# 2. Trimmed: same ask, no filler. Shorter prompt, same three questions,
#    stated plainly instead of buried in small talk.
# ============================================================

trimmed_prompt = f"Here is information about Riverbend Bikes: {SOURCE_DOC}\n\n{QUESTIONS}"
run_variant("2. TRIMMED (specific, no filler)", trimmed_prompt)

# ============================================================
# 3. Structured: delimiters separate the source from the instructions, and
#    the output format is spelled out, so nothing is ambiguous about what
#    "the source" is or what shape the reply should take.
# ============================================================

structured_prompt = (
    f'CONTEXT:\n"""\n{SOURCE_DOC}\n"""\n\n'
    f"Answer these three questions, one per line:\n{QUESTIONS}"
)
run_variant("3. STRUCTURED (delimiters + explicit format)", structured_prompt)

# ============================================================
# 4. Grounded: same structure as #3, plus one explicit instruction to only
#    use CONTEXT and say so in an exact phrase when the answer isn't there.
#    This is the line that actually targets hallucination -- the other
#    three variants leave the model free to fill the gap however it wants.
# ============================================================

grounded_prompt = (
    f'CONTEXT:\n"""\n{SOURCE_DOC}\n"""\n\n'
    "Using ONLY the information in CONTEXT above, answer these three "
    'questions. If the answer is not stated in CONTEXT, respond exactly '
    'with "Not stated in the source" for that question -- do not guess and '
    f"do not use outside knowledge.\n\n{QUESTIONS}"
)
run_variant("4. GROUNDED (constrained to the source, allowed to say 'I don't know')", grounded_prompt)

# ============================================================
# Summary
# ============================================================

print()
print("=" * 60)
print("SUMMARY")
print("=" * 60)
for label, word_count in results:
    print(f"{label}: {word_count} words")
print()
print("Re-read each response above. The question that matters most is #3,")
print("the head mechanic's experience, since the document never says it.")
print("Only a prompt that explicitly tells the model what to do when it")
print("doesn't know reliably admits that, instead of inventing a")
print("plausible-sounding number of years.")
