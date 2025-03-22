import { supabaseClient } from "../config/supabaseClient.js";
import { getTitleGeneratorPrompt } from "../prompts/prompts.js";
import OpenAI from "openai";
import { getUserProfile } from "../functions/user.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const profile = await getUserProfile(supabase, userId);

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        messages: messages,
        language: profile.language,
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, id: data.id });
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
    const { convoId } = req.body;

    if (!convoId) {
      return res.status(400).json({ error: "Conversation ID is required" });
    }

    const { data, error } = await supabase
      .from("conversations")
      .select("messages")
      .eq("user_id", userId)
      .eq("id", convoId)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json({ messages: data.messages || [] });
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
    const { convoId } = req.body;

    if (!convoId) {
      return res.status(400).json({ error: "Conversation ID is required" });
    }

    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("user_id", userId)
      .eq("id", convoId);

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
    const { messages, convoId } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Invalid messages" });
    }

    if (!convoId) {
      return res.status(400).json({ error: "Conversation ID is required" });
    }

    const { error } = await supabase
      .from("conversations")
      .update({ messages })
      .eq("user_id", userId)
      .eq("id", convoId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating conversation:", error);
    res.status(500).json({ error: "Failed to update conversation" });
  }
};

const listConversations = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;

    // Use the helper function
    const profile = await getUserProfile(supabase, userId);

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .eq("language", profile.language)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error listing conversations:", error);
    res.status(500).json({ error: "Failed to list conversations" });
  }
};

const generateTitle = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;

    const { messages, convoId } = req.body;

    const profile = await getUserProfile(supabase, userId);

    if (!messages || !Array.isArray(messages) || !convoId) {
      return res
        .status(400)
        .json({ error: "Invalid messages array or missing convoId" });
    }

    const promptMessages = [
      {
        role: "system",
        content: getTitleGeneratorPrompt(profile.language),
      },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: promptMessages,
      temperature: 0.3,
    });

    const title = response.choices[0]?.message?.content;

    await supabase
      .from("conversations")
      .update({ title })
      .eq("user_id", userId)
      .eq("id", convoId);

    console.log("----------*TITLE GENERATED*---------");
    res.json({ success: true, title });
  } catch (error) {
    console.error("Error generating title:", error);
    res.status(500).json({ error: "Failed to generate title" });
  }
};

const updateTitle = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;

    const { title, convoId } = req.body;

    const { error } = await supabase
      .from("conversations")
      .update({ title })
      .eq("user_id", userId)
      .eq("id", convoId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating title:", error);
    res.status(500).json({ error: "Failed to update title" });
  }
};

export {
  saveConversation,
  getConversation,
  deleteConversation,
  updateConversation,
  listConversations,
  generateTitle,
  updateTitle,
};
