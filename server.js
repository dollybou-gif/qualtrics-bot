// server.js - Render deployment for Qualtrics GPT-5-mini chat
import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // or built-in fetch if Node >= 18
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 10000;

// Enable CORS so Qualtrics can call this server from the browser
app.use(cors());
app.use(bodyParser.json());

// Main chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const messages = req.body.messages; // messages array from Qualtrics JS

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // set this in Render secrets
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: messages,
        max_tokens: 2500,
        temperature: 0.5
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Health check route (optional)
app.get("/", (req, res) => {
  res.send("Qualtrics GPT-5-mini server is running!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
