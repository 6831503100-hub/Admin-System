// =========================
// 🎤 Voice Input Function
// =========================
function startListening() {
  alert("กำลังฟัง... 🎤");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("❌ Browser ไม่รองรับ (ใช้ Chrome)");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "th-TH";

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    console.log("พูดว่า:", text);

    const input = document.getElementById("trackingInput");
    if (input) {
      input.value = text;
    } else {
      alert("❌ ไม่เจอ input");
    }
  };

  recognition.onerror = function (err) {
    console.error("Voice error:", err);
    alert("❌ error เสียง");
  };

  recognition.start();
}


// =========================
// 🔥 (OPTIONAL) Test Function
// =========================
function testClick() {
  alert("ปุ่มทำงานแล้ว ✅");
}