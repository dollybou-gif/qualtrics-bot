import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors()); // Allow requests from anywhere
app.use(express.json()); // Parse JSON bodies

// Endpoint Qualtrics will POST to
app.post("/chat", async (req, res) => {
  try {
    const messages = req.body.messages;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: messages,
        max_tokens: 2500,
        temperature: 0.5
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json(data); // Forward AI response directly to Qualtrics
    } else {
      res.json({ choices: [{ message: { content: "No response received" } }] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ choices: [{ message: { content: "Server error: " + err.message } }] });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));


