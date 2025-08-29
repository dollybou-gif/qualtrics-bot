import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // if not using native fetch

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

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
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
