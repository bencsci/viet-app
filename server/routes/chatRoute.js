// routes/chatRoutes.js
import express from "express";
import { requireAuth } from "@clerk/express";
import OpenAI from "openai";

const chatRoute = express.Router();

// Instantiate OpenAI (new usage), with no separate Configuration class needed.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/chat/
 * Body: { messages: [ { role: 'user'|'assistant'|'system', content: string }, ... ] }
 */

console.log("test");
chatRoute.post("/sendMessage", requireAuth(), async (req, res) => {
  try {
    console.log("Received chat request");
    const { messages } = req.body;
    console.log("Messages:", messages);
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    // Add system message for Vietnamese conversation context
    const conversationContext = {
      role: "system",
      content:
        "You are a friendly Vietnamese person chatting casually online. Respond in a mix of Vietnamese and English like a typical Vietnamese young person would do when texting. Use casual language, some internet slang, and occasionally mix English words naturally. If the user writes in English, you can still include some Vietnamese expressions. If they write in Vietnamese, respond primarily in Vietnamese with some English mixed in. Be friendly, engaging, and authentic in conversation style.",
    };

    const fullMessages = [conversationContext, ...messages];

    const response = await openai.chat.completions.create({
      model: "gpt-4", // Changed from gpt-4o-mini to gpt-4 for better Vietnamese support
      messages: fullMessages,
      temperature: 0.9, // Add some randomness to make responses more natural
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
});

export default chatRoute;
