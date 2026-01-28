# VoiceNav+

VoiceNav+ is a **voice-driven Chrome extension** that enables hands-free browser navigation, intelligent page reading, and AI-assisted browsing using speech recognition and text-to-speech.

The extension works across supported websites and allows users to control tabs, search the web, read content aloud, and interact with AI using natural voice commands.

---

## 🚀 Features

### 🎤 Voice Navigation
- Scroll up / down
- Reload page
- Open new tab
- Close current tab
- Switch between tabs (next / previous)

### 📖 Intelligent Page Reading
- Read selected text or entire page aloud
- Pause, resume, or stop reading
- Automatically extracts meaningful content from pages

### 🤖 AI-Assisted Browsing (Backend Powered)
- **Summarize** page or selected content
- **Ask AI questions** about the current page
- **Translate** page content to any language
- Spoken + visual AI responses

### 🌐 Smart Website Control
- Open popular websites via voice (YouTube, Google, GitHub, etc.)
- Context-aware search:
  - Searches YouTube when on YouTube
  - Searches Wikipedia when on Wikipedia
  - Defaults to Google elsewhere

### 🗣️ Voice Feedback & Overlays
- Spoken confirmation for every action
- Floating on-page overlays for AI results and feedback

---

## 🧠 How It Works

1. User starts voice listening from the extension popup
2. Speech is captured using the **Web Speech API**
3. Commands are processed in a background service worker
4. Browser actions or AI requests are triggered
5. AI responses are fetched from a Node.js backend
6. Results are spoken and displayed on the page

---

## 🛠️ Tech Stack

### Client (Chrome Extension)
- JavaScript
- Chrome Extension APIs (Manifest V3)
- Web Speech API
- Speech Synthesis API

### Server (Backend)
- Node.js
- Express.js
- Groq LLM API (LLaMA 3.1)
- dotenv, CORS

##Thank you for reading.

