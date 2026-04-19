const voiceBtn = document.getElementById("voiceBtn");
const trackingInput = document.getElementById("trackingInput");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let isListening = false;

if (!voiceBtn || !trackingInput) {
  alert("❌ ไม่เจอ voiceBtn หรือ trackingInput");
} else if (!SpeechRecognition) {
  alert("❌ Browser นี้ไม่รองรับ Voice Recognition");
} else {
  recognition = new SpeechRecognition();
  recognition.lang = "th-TH";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening = true;
    voiceBtn.textContent = "⏹ Stop";
    voiceBtn.disabled = false;
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript || "";
    trackingInput.value = text;
  };

  recognition.onerror = (event) => {
    console.error(event);
    alert("❌ Error: " + event.error);
  };

  recognition.onend = () => {
    isListening = false;
    voiceBtn.textContent = "🎤 Voice";
    voiceBtn.disabled = false;
  };

  voiceBtn.addEventListener("click", () => {
    if (!isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }
  });
}