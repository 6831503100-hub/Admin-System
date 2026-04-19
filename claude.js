const voiceBtn = document.getElementById("voiceBtn");
const trackingInput = document.getElementById("trackingInput");

let mediaRecorder = null;
let audioChunks = [];
let stream = null;
let isRecording = false;

async function startRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("❌ Browser นี้ไม่รองรับการใช้ไมค์");
    return;
  }

  if (!window.MediaRecorder) {
    alert("❌ Browser นี้ไม่รองรับการอัดเสียง");
    return;
  }

  if (!voiceBtn || !trackingInput) {
    alert("❌ ไม่เจอ voiceBtn หรือ trackingInput");
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    let mimeType = "";
    if (MediaRecorder.isTypeSupported("audio/webm")) {
      mimeType = "audio/webm";
    }

    mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      try {
        const audioBlob = new Blob(audioChunks, {
          type: mimeType || "audio/webm"
        });

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        voiceBtn.disabled = true;
        voiceBtn.textContent = "⏳ Transcribing...";

        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: formData
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Transcription failed");
        }

        trackingInput.value = data.text || "";
      } catch (err) {
        console.error(err);
        alert("❌ " + err.message);
      } finally {
        voiceBtn.disabled = false;
        voiceBtn.textContent = "🎤 Voice";
        audioChunks = [];
      }
    };

    mediaRecorder.start();
    isRecording = true;
    voiceBtn.textContent = "⏹ Stop";
  } catch (err) {
    console.error(err);
    alert("❌ ใช้ไมค์ไม่ได้: " + err.message);
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
  }
}

if (voiceBtn) {
  voiceBtn.addEventListener("click", () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });
} else {
  alert("❌ ไม่เจอปุ่ม #voiceBtn");
}