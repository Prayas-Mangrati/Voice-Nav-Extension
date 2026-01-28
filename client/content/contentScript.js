// client/content/contentScript.js
console.log("VoiceNav+ content script active");

let recognition = null;
let isListening = false;
let pendingUrl = null;

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "start-listening" && !isListening) startListening();
  if (message.type === "stop-listening" && isListening) stopListening();

  // Summarization feedback
  if (message.type === "summary-result") showSummaryOverlay(message.text);
  if (message.type === "summary-error") showSummaryOverlay("⚠️ " + message.text);

  // AI feedback (NEW)
  if (message.type === "ai-result") showSummaryOverlay(message.text);
  if (message.type === "ai-error") showSummaryOverlay("⚠️ " + message.text);

  // Confirmation for website navigation (if you kept it)
  if (message.type === "confirm-open") {
    pendingUrl = message.url;
    showConfirmationOverlay(message.text);
    startYesNoListening();
  }
});

// ---- Voice Recognition ----
function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showSummaryOverlay("Speech recognition not supported.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  isListening = true;

  recognition.onstart = () => showSummaryOverlay("🎤 Listening...");
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.trim();
    chrome.runtime.sendMessage({ type: "voice-command", text });
  };
  recognition.onerror = (e) => showSummaryOverlay("⚠️ Error: " + e.error);
  recognition.onend = () => (isListening = false);

  recognition.start();
}

function stopListening() {
  if (recognition && isListening) recognition.stop();
  isListening = false;
  showSummaryOverlay("🛑 Stopped listening");
}

// ---- Overlay ----
function showSummaryOverlay(text) {
  const old = document.getElementById("voicenav-overlay");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.id = "voicenav-overlay";
  overlay.innerText = text;

  Object.assign(overlay.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    maxWidth: "360px",
    background: "#ffffff",
    color: "#000",
    padding: "12px 16px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.4",
    zIndex: "999999",
    whiteSpace: "pre-wrap",
    overflowY: "auto",
    maxHeight: "50vh",
  });

  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.style.transition = "opacity 1s ease";
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 1000);
  }, 15000);
}

// ---- (Optional) confirm-open overlay kept if you still use it ----
function showConfirmationOverlay(text) {
  const old = document.getElementById("voicenav-confirm");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.id = "voicenav-confirm";

  overlay.innerHTML = `
    <div style="font-size:15px;margin-bottom:8px;">${text}</div>
  `;

  Object.assign(overlay.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#fff",
    color: "#000",
    padding: "14px 16px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
    fontFamily: "Arial, sans-serif",
    zIndex: "999999",
    maxWidth: "300px",
  });

  document.body.appendChild(overlay);
}

function startYesNoListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;

  const rec = new SpeechRecognition();
  rec.lang = "en-US";
  rec.interimResults = false;

  rec.onresult = (event) => {
    const response = event.results[0][0].transcript.trim().toLowerCase();
    if (response.includes("yes")) confirmRedirect(true);
    else if (response.includes("no")) confirmRedirect(false);
  };

  rec.start();
}

function confirmRedirect(shouldRedirect) {
  const overlay = document.getElementById("voicenav-confirm");
  if (overlay) overlay.remove();

  if (shouldRedirect && pendingUrl) {
    const utter = new SpeechSynthesisUtterance("Opening site.");
    utter.lang = "en-US";
    speechSynthesis.speak(utter);
    window.location.href = pendingUrl;
  } else {
    const utter = new SpeechSynthesisUtterance("Cancelled.");
    utter.lang = "en-US";
    speechSynthesis.speak(utter);
  }

  pendingUrl = null;
}

// ---- Auto-start mic if persistent flag is on ----
chrome.storage.local.get("listening", (res) => {
  if (res.listening) {
    console.log("🎤 Persistent mic active — auto-starting listener");
    setTimeout(() => startListening(), 700);
  }
});
