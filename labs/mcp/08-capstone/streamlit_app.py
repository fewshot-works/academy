# Bonus: the same capstone agent from agent.py, wrapped in a browser chat
# window instead of a scripted terminal conversation. This is a demo/
# marketing wrapper, not a new agent -- importing from agent.py reuses its
# tools, guard, and memory exactly as they are.
#
# Run with: uv run streamlit run streamlit_app.py
# See README.md for setup steps (this needs the same .env as agent.py).

import asyncio

import streamlit as st
from agent import agent, thread_config

st.set_page_config(page_title="MCP Capstone -- Calculator + Guarded Fetch", layout="centered")

st.title("MCP Capstone Assistant")
st.caption(
    "One agent, two MCP servers: a calculator you built yourself, and a public fetch "
    "server guarded by a fixed domain allowlist, with memory across the conversation."
)

with st.sidebar:
    st.header("What's running")
    st.markdown(
        "- **calculator** -- your own MCP server, unchanged since Chapter 2\n"
        "- **fetch** -- the public mcp-server-fetch, wrapped in a domain allowlist "
        "(Chapter 6's guard pattern)\n"
        "- **Memory** across the whole conversation via a LangGraph checkpointer"
    )
    st.caption("Try asking it to fetch a URL outside the allowlist and watch the guard block it.")

if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"])
        if message.get("tool_calls"):
            st.caption("Tools used: " + ", ".join(message["tool_calls"]))

user_message = st.chat_input("Ask it to calculate something, or fetch a Wikipedia page...")

if user_message:
    st.session_state.messages.append({"role": "user", "content": user_message})
    with st.chat_message("user"):
        st.write(user_message)

    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            messages_before = len(agent.get_state(thread_config).values.get("messages", []))
            result = asyncio.run(
                agent.ainvoke({"messages": [{"role": "user", "content": user_message}]}, thread_config)
            )
            new_messages = result["messages"][messages_before:]

        tool_names = []
        for m in new_messages:
            for call in getattr(m, "tool_calls", None) or []:
                tool_names.append(call["name"])

        answer = result["messages"][-1].content.strip()
        if not answer:
            answer = "Sorry, I wasn't able to put together an answer to that. A human will follow up."
        st.write(answer)
        if tool_names:
            st.caption("Tools used: " + ", ".join(tool_names))

    st.session_state.messages.append({"role": "assistant", "content": answer, "tool_calls": tool_names})
