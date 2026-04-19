const voiceBtn = document.getElementById("voiceBtn");
const trackingInput = document.getElementById("trackingInput");

let recognition;
let isListening = false;

// รองรับ browser
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("❌ Browser นี้ไม่รองรับ Voice");
} else {
  recognition = new SpeechRecognition();
  recognition.lang = "th-TH"; // ภาษาไทย
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening = true;
    voiceBtn.textContent = "⏹ Stop";
  };

  recognition.onend = () => {
    isListening = false;
    voiceBtn.textContent = "🎤 Voice";
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    trackingInput.value = text;
  };

  recognition.onerror = (event) => {
    console.error(event);
    alert("❌ Error: " + event.error);
  };
}

if (voiceBtn) {
  voiceBtn.addEventListener("click", () => {
    if (!recognition) return;

    if (!isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }
  });
}