from dotenv import load_dotenv
import streamlit as st
import os
import google.generativeai as genai
import speech_recognition as sr

# Load environment variables
load_dotenv()

# Configure Google Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Function to load Gemini Pro model and get responses
model = genai.GenerativeModel("gemini-pro") 
chat = model.start_chat(history=[])

def get_gemini_response(question):
    response = chat.send_message(question, stream=True)
    return response

# Initialize our Streamlit app
st.set_page_config(page_title="Q&A Demo")

st.header("Freelancing AI Chatbot")

# Initialize session state for chat history if it doesn't exist
if 'chat_history' not in st.session_state:
    st.session_state['chat_history'] = []

def recognize_speech():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        st.write("Listening...")
        audio = recognizer.listen(source)
        try:
            text = recognizer.recognize_google(audio)
            st.write(f"Recognized: {text}")
            return text
        except sr.UnknownValueError:
            st.write("Sorry, I could not understand the audio.")
        except sr.RequestError as e:
            st.write(f"Could not request results; {e}")
    return ""

# Text input from the user
input = st.text_input("Input: ", key="input")

# Speech input button
if st.button("Speak"):
    input = recognize_speech()

# Submit button
submit = st.button("Enter")

if submit and input:
    response = get_gemini_response(input)
    # Add user query and response to session state chat history
    st.session_state['chat_history'].append((
        "You are a freelance platform AI bot. User will give you queries related to the platform; entertain only those. Do not answer any random query. In such cases, give a fixed response that you aren't meant to do so. Provide desired results related to a freelance website in the best way possible. The user input is: ", 
        input
    ))
    st.subheader("The Response is")
    for chunk in response:
        st.write(chunk.text)
        st.session_state['chat_history'].append(("Bot", chunk.text))

st.subheader("The Chat History is")

for role, text in st.session_state['chat_history']:
    st.write(f"{role}: {text}")
