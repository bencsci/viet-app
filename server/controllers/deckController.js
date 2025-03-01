import { supabaseClient } from "../config/supabaseClient.js";

const createDeck = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;
    const { deckName } = req.body;

    if (!deckName) {
      return res.status(400).json({ error: "Invalid deck name" });
    }

    const { data, error } = await supabase
      .from("decks")
      .insert({
        user_id: userId,
        title: deckName,
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Error saving deck:", error);
    res.status(500).json({ error: "Failed to save deck" });
  }
};

const getDeck = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;
    const { deckId } = req.body;

    if (!deckId) {
      return res.status(400).json({ error: "Deck ID is required" });
    }

    const { data, error } = await supabase
      .from("decks")
      .select("*")
      .eq("user_id", userId)
      .eq("id", deckId)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error getting conversation:", error);
    res.status(500).json({ error: "Failed to get conversation" });
  }
};

const editDeckTitle = async (req, res) => {};

const removeDeck = async (req, res) => {};

const addFlashcard = async (req, res) => {};

const removeFlashcard = async (req, res) => {};

const editFront = async (req, res) => {};

const editBack = async (req, res) => {};

export {
  createDeck,
  editDeckTitle,
  removeDeck,
  addFlashcard,
  removeFlashcard,
  editFront,
  editBack,
  getDeck,
};
