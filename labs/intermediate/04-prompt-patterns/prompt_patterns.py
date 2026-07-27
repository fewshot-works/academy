# Chapter 4 lab: three prompt patterns that fix three different failure modes.
#
# 1. Chain-of-thought: asking the model to show its work before answering.
# 2. Structured/JSON output: getting a reply you can actually parse.
# 3. Function calling: letting the model choose to call a tool instead of
#    just replying with text.
#
# Which provider this uses (Ollama, OpenAI, or Anthropic) is controlled by
# the PROVIDER variable in your .env file. See README.md for setup steps.

import json
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
# 1. Chain-of-thought
# ============================================================
# A word problem that invites a shortcut answer if the model doesn't
# actually work through the steps.

print("=" * 60)
print("1. CHAIN OF THOUGHT")
print("=" * 60)

word_problem = (
    "A bakery baked 24 muffins. Half of the muffins are blueberry. "
    "Half of the blueberry muffins also have a chocolate drizzle. "
    "How many muffins have both blueberry and a chocolate drizzle?"
)
correct_answer = "6"

print(f"\nProblem: {word_problem}")
print(f"(Correct answer: {correct_answer})\n")

# A lot of real apps ask for a short, direct answer, which removes the
# model's room to work through the problem and makes it more likely to
# guess wrong.
direct_answer = ask(word_problem, system="Answer with only the final number. Do not explain your reasoning.")
print("--- Direct answer (forced to skip its reasoning) ---")
print(direct_answer.strip())
print()

cot_prompt = word_problem + " Think step by step, then give your final answer on its own line."
cot_answer = ask(cot_prompt)
print("--- With 'think step by step' appended ---")
print(cot_answer.strip())
print()

print(f"Summary: correct answer is {correct_answer}. Compare the two responses above")
print("to see whether the direct prompt shortcut its way to a wrong number.")

# ============================================================
# 2. Structured / JSON output
# ============================================================
# Extracting fields from unstructured text is only useful if you can
# actually parse what comes back.

print()
print("=" * 60)
print("2. STRUCTURED / JSON OUTPUT")
print("=" * 60)

event_blurb = (
    "Join us for the Riverside Tech Meetup on August 14th, 2026, at the "
    "Cedar Hall Community Center in Portland. Doors open at 6 PM."
)
extract_instruction = (
    f'Extract the event name, date, and location from this text and respond '
    f'with only JSON, using the keys "name", "date", and "location": "{event_blurb}"'
)

print(f"\nBlurb: {event_blurb}\n")

# --- Freeform: just ask nicely for JSON ---
freeform_reply = ask(extract_instruction)
print("--- Freeform prompt (just asking for JSON) ---")
print(freeform_reply.strip())

freeform_text = freeform_reply.strip()
if freeform_text.startswith("```"):
    # Strip a markdown code fence if the model wrapped its answer in one.
    freeform_text = freeform_text.strip("`")
    freeform_text = freeform_text.replace("json\n", "", 1)

try:
    parsed = json.loads(freeform_text)
    print(f"Parsed OK: {parsed}")
except json.JSONDecodeError:
    print("Failed to parse as JSON.")
print()

# --- Native structured output: each provider does this differently ---
print("--- Native structured-output mode ---")

if provider == "ollama":
    import requests

    response = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": "llama3.2",
            "messages": [{"role": "user", "content": extract_instruction}],
            "format": "json",
            "stream": False,
        },
    )
    native_text = response.json()["message"]["content"]

elif provider == "openai":
    from openai import OpenAI

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": extract_instruction}],
        response_format={"type": "json_object"},
    )
    native_text = response.choices[0].message.content

elif provider == "anthropic":
    # Anthropic has no plain "JSON mode." The idiomatic way to force a
    # structured reply is a tool with an input schema, the model "calls"
    # the tool instead of replying with text, and the arguments it fills
    # in are guaranteed to match the schema. This is the same mechanism
    # section 3 below uses for function calling.
    import anthropic

    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=300,
        tools=[
            {
                "name": "record_event",
                "description": "Record the extracted event details.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "date": {"type": "string"},
                        "location": {"type": "string"},
                    },
                    "required": ["name", "date", "location"],
                },
            }
        ],
        tool_choice={"type": "tool", "name": "record_event"},
        messages=[{"role": "user", "content": extract_instruction}],
    )
    tool_use_block = response.content[0]
    native_text = json.dumps(tool_use_block.input)

print(native_text.strip())
native_parsed = json.loads(native_text)
print(f"Parsed OK: {native_parsed}")

# ============================================================
# 3. Function calling
# ============================================================
# Instead of replying with text, the model can choose to call a tool and
# hand back structured arguments. This lab only shows that choice, it
# doesn't execute the tool, Chapter 5 builds the full loop.

print()
print("=" * 60)
print("3. FUNCTION CALLING")
print("=" * 60)

tool_question = "Can you check the status of order A1234?"
print(f"\nQuestion: {tool_question}\n")

if provider == "ollama":
    import requests

    response = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": "llama3.2",
            "messages": [{"role": "user", "content": tool_question}],
            "tools": [
                {
                    "type": "function",
                    "function": {
                        "name": "check_order_status",
                        "description": "Look up the current status of an order by its order ID.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "order_id": {"type": "string", "description": "The order ID, e.g. A1234"},
                            },
                            "required": ["order_id"],
                        },
                    },
                }
            ],
            "stream": False,
        },
    )
    message = response.json()["message"]
    tool_calls = message.get("tool_calls", [])
    if tool_calls:
        call = tool_calls[0]["function"]
        print(f"Model chose to call: {call['name']}({call['arguments']})")
    else:
        print(f"Model replied with text instead of calling a tool: {message['content']}")

elif provider == "openai":
    from openai import OpenAI

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": tool_question}],
        tools=[
            {
                "type": "function",
                "function": {
                    "name": "check_order_status",
                    "description": "Look up the current status of an order by its order ID.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "order_id": {"type": "string", "description": "The order ID, e.g. A1234"},
                        },
                        "required": ["order_id"],
                    },
                },
            }
        ],
    )
    message = response.choices[0].message
    if message.tool_calls:
        call = message.tool_calls[0].function
        print(f"Model chose to call: {call.name}({call.arguments})")
    else:
        print(f"Model replied with text instead of calling a tool: {message.content}")

elif provider == "anthropic":
    import anthropic

    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=300,
        tools=[
            {
                "name": "check_order_status",
                "description": "Look up the current status of an order by its order ID.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "order_id": {"type": "string", "description": "The order ID, e.g. A1234"},
                    },
                    "required": ["order_id"],
                },
            }
        ],
        messages=[{"role": "user", "content": tool_question}],
    )
    tool_use_blocks = [block for block in response.content if block.type == "tool_use"]
    if tool_use_blocks:
        call = tool_use_blocks[0]
        print(f"Model chose to call: {call.name}({call.input})")
    else:
        text_blocks = [block.text for block in response.content if block.type == "text"]
        print(f"Model replied with text instead of calling a tool: {' '.join(text_blocks)}")
