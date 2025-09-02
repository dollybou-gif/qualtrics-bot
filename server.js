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
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5-mini-2025-08-07",
        messages: messages,
        max_tokens: 2250,
        temperature: 0.5,
      }),
    });

    const data = await response.json();

    // Log everything for debugging
    console.log("OpenAI response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json(data); // forward error
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
});
