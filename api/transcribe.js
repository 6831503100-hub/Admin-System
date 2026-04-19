export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Expected multipart/form-data" });
    }

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": contentType
      },
      body: bodyBuffer
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI transcription error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Transcription failed"
      });
    }

    return res.status(200).json({
      text: data.text || ""
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: err.message || "Server error"
    });
  }
}