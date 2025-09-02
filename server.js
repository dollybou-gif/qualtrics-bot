import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors()); // allow requests from Qualtrics

// POST endpoint for Qualtrics
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // API key is stored securely in Render
      },
      body: JSON.stringify({
        model: "gpt-5-mini-2025-08-07",   // same model you defined in Qualtrics
        messages: messages,
        max_tokens: 2250,       // dissertation-appropriate token budget
        temperature: 0.5,       // balanced randomness
      }),
    });

    const data = await response.json();
    res.json(data); // send response back to Qualtrics
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ error: error.message });
  }
});

// Render will use this port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
