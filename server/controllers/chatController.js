import OpenAI from "openai";
import {
  languageTutorPrompt,
  translateWordsPrompt,
  translatePrompt,
} from "../prompts/beginners.js";

import { TranslationServiceClient } from "@google-cloud/translate";
import { supabaseClient } from "../config/supabaseClient.js";
const translationClient = new TranslationServiceClient();

// Initialize Supabase client with service role key

// Add error checking for credentials
if (
  !process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  !process.env.GOOGLE_CLOUD_PROJECT_ID
) {
  console.error("Missing Google Cloud credentials or project ID");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sendMessageToOpenAI = async (req, res) => {
  try {
    console.log("Received chat request");
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    // Get the last 5 messages from the conversation
    const recentMessages = messages.slice(-5);
    console.log("Messages:", recentMessages);
    // Add system message for Vietnamese tutor context
    const conversationContext = {
      role: "system",
      content: languageTutorPrompt,
    };

    const fullMessages = [conversationContext, ...recentMessages];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: fullMessages,
      temperature: 0.6,
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

const translateWords = async (req, res) => {
  try {
    const { words, context } = req.body;
    if (!words || !context) {
      return res.status(400).json({ error: "Invalid words format" });
    }

    const messages = [
      {
        role: "system",
        content: translatePrompt(context),
      },
      {
        role: "user",
        content: words,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.3,
    });

    //console.log(messages);

    const translation = response.choices[0]?.message?.content;

    res.json({ translation });
  } catch (error) {
    console.error("OpenAI Translation error:", error);
    res.status(500).json({
      error: "OpenAI Translation Error",
      details: error.message,
    });
  }
};

const translateWordsGoogle = async (req, res) => {
  try {
    const { words } = req.body;
    const request = {
      parent: `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/locations/${process.env.GOOGLE_CLOUD_LOCATION}`,
      contents: [words],
      mimeType: "text/plain",
      sourceLanguageCode: "vi",
      targetLanguageCode: "en",
    };

    const [response] = await translationClient.translateText(request);
    const translation = response.translations[0].translatedText;
    res.json({ translation: translation });
  } catch (error) {
    console.error("Google Translate error:", error);
    res.status(500).json({ error: "Google Translate API Error" });
  }
};

const saveConversation = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Invalid messages" });
    }

    const { data, error } = await supabase.from("conversations").insert({
      user_id: userId,
      messages: messages,
    });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error saving conversation:", error);
    res.status(500).json({ error: "Failed to save conversation" });
  }
};

const getConversation = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;
    const { data, error } = await supabase
      .from("conversations")
      .select("messages")
      .eq("user_id", userId)
      .single();

    // Return the messages property specifically
    res.json({ messages: data?.messages || [] });
  } catch (error) {
    console.error("Error getting conversation:", error);
    res.status(500).json({ error: "Failed to get conversation" });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
};

const updateConversation = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Invalid messages" });
    }

    let error;
    const { data: existingConversation } = await supabase
      .from("conversations")
      .select()
      .eq("user_id", userId)
      .single();

    if (existingConversation) {
      // Update if exists
      const { error: updateError } = await supabase
        .from("conversations")
        .update({ messages: messages })
        .eq("user_id", userId);
      error = updateError;
    } else {
      // Insert if doesn't exist
      const { error: insertError } = await supabase
        .from("conversations")
        .insert({ user_id: userId, messages: messages });
      error = insertError;
    }

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating conversation:", error);
    res.status(500).json({ error: "Failed to update conversation" });
  }
};

export {
  sendMessageToOpenAI,
  translateWords,
  translateWordsGoogle,
  saveConversation,
  getConversation,
  deleteConversation,
  updateConversation,
};
