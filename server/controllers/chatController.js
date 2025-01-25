import OpenAI from "openai";
import { vietnameseTutorPrompt } from "../prompts/beginners.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sendMessageToOpenAI = async (req, res) => {
  try {
    console.log("Received chat request");
    const { messages } = req.body;
    //console.log("Messages:", messages);
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    // Add system message for Vietnamese tutor context
    const conversationContext = {
      role: "system",
      content: vietnameseTutorPrompt,
    };

    //const userMessage = { role: "user", content: messages };

    const fullMessages = [conversationContext, ...messages];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: fullMessages,
      temperature: 1.5,
    });

    // The AI's reply is in response.choices[0].message.content
    const aiReply = response.choices[0]?.message?.content;
    console.log("OpenAI response:", aiReply);
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({
      error: "OpenAI API Error",
      details: error.message,
    });
  }
};

export { sendMessageToOpenAI };
