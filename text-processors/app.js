const express = require("express");
const { config } = require("dotenv");

config();

const app = express();

app.use(express.json());

// setup open ai
const { OpenAI } = require("openai");
console.log(process.env.OPENAI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const runCompletion = async (prompt) =>
  openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "write a story about the word" },
      { role: "user", content: prompt },
    ],
  });

app.post("/prompt", async (req, res) => {
  try {
    const { input } = req.body;
    const completion = await runCompletion(input);
    console.log(completion);
    res.status(200).json({ data: completion, message: completion.choices[0].message });
  } catch (error) {
    console.error(error);
    if (error?.response)
      res.status(error.response.status).json({ error: error.response.data });
    else res.status(500).json({ error: error.message });
  }
});
app.listen(+(process.env.PORT ?? 8080), () =>
  console.info(`Im listening on ${process.env.PORT ?? 8080}`)
);
