export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { audio } = req.body;

    if (!audio) {
      return res.status(400).json({ error: "No audio provided" });
    }

    // 🔥 ตรงนี้คือ mock (ยังไม่ใช้ OpenAI จริง)
    return res.status(200).json({
      text: "ทดสอบเสียงพูด (mock result)"
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}