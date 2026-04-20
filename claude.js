const voiceBtn = document.getElementById("voiceBtn");
const trackingInput = document.getElementById("trackingInput");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let isListening = false;

if (!voiceBtn || !trackingInput) {
  console.log("voiceBtn หรือ trackingInput ไม่เจอ");
} else if (!SpeechRecognition) {
  voiceBtn.disabled = true;
  voiceBtn.textContent = "Voice not supported";
  voiceBtn.style.opacity = "0.6";
  voiceBtn.style.cursor = "not-allowed";
} else {
  recognition = new SpeechRecognition();
  recognition.lang = "th-TH";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening = true;
    voiceBtn.textContent = "⏹ Stop";
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript || "";
    trackingInput.value = text;
  };

  recognition.onerror = (event) => {
    console.log("Voice error:", event.error);
    isListening = false;
    voiceBtn.textContent = "🎤 Voice";
  };

  recognition.onend = () => {
    isListening = false;
    voiceBtn.textContent = "🎤 Voice";
  };

  voiceBtn.addEventListener("click", () => {
    if (!isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }
  });
}