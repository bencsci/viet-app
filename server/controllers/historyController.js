import { supabaseClient } from "../config/supabaseClient.js";

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

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        messages: messages,
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

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error listing conversations:", error);
    res.status(500).json({ error: "Failed to list conversations" });
  }
};

export {
  saveConversation,
  getConversation,
  deleteConversation,
  updateConversation,
  listConversations,
};
