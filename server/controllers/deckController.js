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

const listDecks = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;

    const { data, error } = await supabase
      .from("decks")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error getting decks:", error);
    res.status(500).json({ error: "Failed to get decks" });
  }
};

const editDeck = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );

    const userId = req.auth.userId;
    const { deckId, ...updateFields } = req.body;

    // Only include fields that were actually provided in the request
    const fieldsToUpdate = {};

    // Check each possible field and only include it if it was provided
    if ("title" in updateFields) fieldsToUpdate.title = updateFields.title;
    if ("total_reviews" in updateFields)
      fieldsToUpdate.total_reviews = updateFields.total_reviews;
    if ("card_count" in updateFields)
      fieldsToUpdate.card_count = updateFields.card_count;
    if ("mastery" in updateFields)
      fieldsToUpdate.mastery = updateFields.mastery;

    // If no fields to update were provided, return an error
    if (Object.keys(fieldsToUpdate).length === 0) {
      return res
        .status(400)
        .json({ error: "No fields to update were provided" });
    }

    const { error } = await supabase
      .from("decks")
      .update(fieldsToUpdate)
      .eq("user_id", userId)
      .eq("id", deckId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating deck:", error);
    res.status(500).json({ error: "Failed to update deck" });
  }
};

const removeDeck = async (req, res) => {};

const listFlashcards = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );

    const { deckId } = req.body;

    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("deck_id", deckId);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error listing flashcards:", error);
    res.status(500).json({ error: "Failed to list flashcards" });
  }
};

const addFlashcard = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );

    const { deckId, front, back } = req.body;

    const { error } = await supabase
      .from("flashcards")
      .insert({ deck_id: deckId, front: front, back: back });

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error("Error adding flashcards:", error);
    res.status(500).json({ error: "Failed to add flashcards" });
  }
};

const removeFlashcard = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );

    const { deckId, flashcardId } = req.body;

    const { error } = await supabase
      .from("flashcards")
      .delete()
      .eq("deck_id", deckId)
      .eq("id", flashcardId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error("Error removing decks:", error);
    res.status(500).json({ error: "Failed to remove decks" });
  }
};

const editFront = async (req, res) => {};

const editBack = async (req, res) => {};

const editFlashcard = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );

    const { cardId, newFront, newBack } = req.body;

    const { error } = await supabase
      .from("flashcards")
      .update({ front: newFront, back: newBack })
      .eq("id", cardId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating flashcard:", error);
    res.status(500).json({ error: "Failed to update flashcard" });
  }
};

export {
  createDeck,
  editDeck,
  removeDeck,
  addFlashcard,
  removeFlashcard,
  editFront,
  editBack,
  getDeck,
  listDecks,
  listFlashcards,
  editFlashcard,
};
