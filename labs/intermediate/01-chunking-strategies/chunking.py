# Intermediate Chapter 1 lab: cut a real, multi-paragraph document into
# chunks three different ways, fixed-size, recursive, and semantic, and
# compare what each one produces.
#
# Which provider this uses (Ollama or OpenAI) is controlled by PROVIDER in
# your .env file. Semantic chunking needs an embedding model, and Anthropic
# doesn't offer one, so this lab only supports ollama or openai. See
# README.md for setup steps.

import os
import re
from dotenv import load_dotenv
import numpy as np

load_dotenv()

provider = os.getenv("PROVIDER", "ollama")

document = """Mossbank Public Library is extending its hours starting next month. The building will now stay open until 8 PM on weeknights, two hours later than before, after years of requests from evening commuters. The children's section will still close at 7 PM so staff can reshelve before the doors lock.

Library cards remain free for anyone who lives, works, or attends school in the county. Cardholders can borrow up to ten items for three weeks, with two renewals allowed if nobody else has requested the item. Overdue fines are ten cents per day per item, capped at five dollars.

Fernwood Coffee is opening a second location downtown next Saturday. The original shop, a converted train depot on Elm Street, has been serving the neighborhood since 2016. The new location will keep the same menu, headlined by the bestselling Depot Latte.

The downtown shop will open at 6 AM on weekdays for the commuter crowd, an hour earlier than the original location. Fernwood is hiring three baristas for the new spot and taking applications in person through the end of the month.

The Mountain View Hiking Club meets every Saturday morning at the trailhead parking lot, rain or shine. New members are welcome at any meetup and don't need to sign up in advance, just show up with water and good shoes.

This month's featured hike climbs to the old fire lookout tower, a six-mile round trip with about 1,200 feet of elevation gain. The club is also planning its annual overnight trip to Cedar Ridge in the fall, with details to follow."""

MAX_CHUNK_SIZE = 260


def split_into_sentences(text):
    # A plain regex split on ". ", "! ", or "? ", good enough for the tidy
    # prose in this lab. Real documents are messier than this, but a full
    # sentence tokenizer is more machinery than this lab needs.
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    return [s for s in sentences if s]


def fixed_chunk(text, size):
    return [text[i : i + size] for i in range(0, len(text), size)]


def fixed_chunk_overlap(text, size, overlap):
    chunks = []
    step = size - overlap
    for start in range(0, len(text), step):
        chunks.append(text[start : start + size])
    return chunks


def split_sentences_to_size(text, max_size):
    # Used when a single paragraph is still too big on its own: fall back
    # from paragraph boundaries to sentence boundaries.
    sentences = split_into_sentences(text)
    chunks = []
    current = ""
    for sentence in sentences:
        candidate = f"{current} {sentence}".strip() if current else sentence
        if len(candidate) <= max_size:
            current = candidate
        else:
            if current:
                chunks.append(current)
            if len(sentence) <= max_size:
                current = sentence
            else:
                # Even one sentence is too big. Last resort: raw characters.
                chunks.extend(fixed_chunk(sentence, max_size))
                current = ""
    if current:
        chunks.append(current)
    return chunks


def recursive_chunk(text, max_size):
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks = []
    current = ""
    for paragraph in paragraphs:
        candidate = f"{current}\n\n{paragraph}".strip() if current else paragraph
        if len(candidate) <= max_size:
            current = candidate
        else:
            if current:
                chunks.append(current)
            if len(paragraph) <= max_size:
                current = paragraph
            else:
                # Paragraph itself is too big. Fall back to sentences.
                chunks.extend(split_sentences_to_size(paragraph, max_size))
                current = ""
    if current:
        chunks.append(current)
    return chunks


def embed(text):
    if provider == "ollama":
        import requests

        response = requests.post(
            "http://localhost:11434/api/embeddings",
            json={"model": "nomic-embed-text", "prompt": text},
        )
        return response.json()["embedding"]

    elif provider == "openai":
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text,
        )
        return response.data[0].embedding

    else:
        print(
            f"PROVIDER is set to '{provider}', but Anthropic doesn't offer an "
            "embeddings API. Set PROVIDER to ollama or openai in your .env and try again."
        )
        raise SystemExit(1)


def cosine_similarity(vec_a, vec_b):
    vec_a = np.array(vec_a)
    vec_b = np.array(vec_b)
    return np.dot(vec_a, vec_b) / (np.linalg.norm(vec_a) * np.linalg.norm(vec_b))


def semantic_chunk(text, threshold):
    sentences = split_into_sentences(text.replace("\n\n", " "))
    embeddings = [embed(sentence) for sentence in sentences]

    chunks = []
    current = [sentences[0]]
    for i in range(1, len(sentences)):
        similarity = cosine_similarity(embeddings[i - 1], embeddings[i])
        if similarity < threshold:
            # The topic just shifted enough to start a new chunk.
            chunks.append(" ".join(current))
            current = [sentences[i]]
        else:
            current.append(sentences[i])
    chunks.append(" ".join(current))
    return chunks


def show(label, chunks):
    print(f"\n{label}: {len(chunks)} chunks")
    for i, chunk in enumerate(chunks, start=1):
        preview = chunk.replace("\n", " ")
        if len(preview) > 100:
            preview = preview[:100] + "..."
        print(f"  {i}. {preview}")


print(f"Document length: {len(document)} characters\n")

fixed_chunks = fixed_chunk(document, MAX_CHUNK_SIZE)
show(f"Fixed-size ({MAX_CHUNK_SIZE} chars, no overlap)", fixed_chunks)

overlap_chunks = fixed_chunk_overlap(document, MAX_CHUNK_SIZE, overlap=40)
show(f"Fixed-size with overlap ({MAX_CHUNK_SIZE} chars, 40 overlap)", overlap_chunks)

recursive_chunks = recursive_chunk(document, MAX_CHUNK_SIZE)
show(f"Recursive (paragraph -> sentence, max {MAX_CHUNK_SIZE} chars)", recursive_chunks)

print(
    "\nSemantic chunking needs an embedding for every sentence, "
    f"calling {provider}..."
)
semantic_chunks_result = semantic_chunk(document, threshold=0.55)
show("Semantic (embedding similarity, threshold 0.55)", semantic_chunks_result)

print(
    "\nLook at the boundary between chunk 1 and chunk 2 in the fixed-size "
    "split above: it cuts a sentence in half. The recursive split never "
    "does that, and the semantic split groups the whole Fernwood Coffee "
    "story into one chunk even though it spans two paragraphs."
)
