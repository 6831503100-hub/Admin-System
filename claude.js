export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 🔥 เช็ค API KEY ก่อน
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Missing API key' });
  }

  try {
    // 🔥 บางที req.body เป็น string
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // 🔥 handle error จาก API
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error || data,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({
      error: { message: err.message },
    });
  }
}
function startListening() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Browser ไม่รองรับเสียง");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "th-TH";
  recognition.start();

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    console.log("พูดว่า:", text);

    // 👉 เอาไปใส่ input
    const input = document.querySelector("#trackingInput");
    if (input) {
      input.value = text;
    }
  };

  recognition.onerror = function (err) {
    console.error(err);
  };
}
function startListening() {
  alert("Voice working 🎤");

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "th-TH";

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    document.getElementById("trackingInput").value = text;
  };

  recognition.start();
}