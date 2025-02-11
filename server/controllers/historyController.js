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
  saveConversation,
  getConversation,
  deleteConversation,
  updateConversation,
};
