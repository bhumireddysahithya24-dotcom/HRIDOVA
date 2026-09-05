# app.py
import streamlit as st
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=st.secrets["OPENAI_API_KEY"])

st.title("Maya & Jay Chatbots")

# Choose which chatbot to talk to
bot_choice = st.sidebar.radio(
    "Choose your chatbot",
    ["Maya", "Jay"],
    index=0,
)

# Define personalities
PERSONALITIES = {
    "Maya": (
        "You are Maya, a friendly, empathetic AI assistant. "
        "You speak warmly, supportively, and clearly. "
        "You help users with questions, advice, and conversation."
    ),
    "Jay": (
        "You are Jay, a sharp, practical AI assistant focused on tech, coding, and productivity. "
        "You give clear, step-by-step answers and prefer concise explanations."
    ),
}

# Initialize separate chat histories
if "maya_messages" not in st.session_state:
    st.session_state.maya_messages = [
        {"role": "system", "content": PERSONALITIES["Maya"]}
    ]

if "jay_messages" not in st.session_state:
    st.session_state.jay_messages = [
        {"role": "system", "content": PERSONALITIES["Jay"]}
    ]

st.subheader(f"Talking to {bot_choice}")

# Choose which message list to use
if bot_choice == "Maya":
    messages = st.session_state.maya_messages
else:
    messages = st.session_state.jay_messages

# Display chat history (skip system message)
for msg in messages:
    if msg["role"] == "system":
        continue
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# Chat input
if prompt := st.chat_input(f"Ask {bot_choice}..."):
    # Add user message
    messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

    # Get AI response
    with st.chat_message("assistant"):
        placeholder = st.empty()
        placeholder.write("Thinking...")

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7,
        )

        assistant_text = response.choices[0].message.content
        placeholder.write(assistant_text)

    # Add assistant message
    messages.append({"role": "assistant", "content": assistant_text})