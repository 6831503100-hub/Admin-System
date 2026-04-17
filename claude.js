alert("JS โหลดแล้ว");

function startListening() {
  alert("กำลังฟัง... 🎤");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("❌ Browser ไม่รองรับ");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "th-TH";

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;

    const input = document.getElementById("trackingInput");
    if (input) {
      input.value = text;
    } else {
      alert("❌ ไม่เจอ input");
    }
  };

  recognition.onerror = function (e) {
    alert("❌ error: " + e.error);
  };

  recognition.start();
}