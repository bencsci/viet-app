import { supabaseClient } from "../config/supabaseClient.js";
import { srsFunc } from "../functions/FC3.js";
import { getNewDueDate, updateMastery } from "../functions/srsHelperFuncs.js";
import textToSpeech from "@google-cloud/text-to-speech";

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

    const { data, error } = await supabase
      .from("decks")
      .select("*")
      .eq("user_id", userId)
      .eq("id", deckId)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error getting deck:", error);
    return res.status(500).json({ error: "Failed to get deck" });
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
    if ("total_reviews" in updateFields) {
      // Ensure total_reviews is a number and not negative
      fieldsToUpdate.total_reviews = Math.max(
        0,
        parseInt(updateFields.total_reviews) || 0
      );
    }
    if ("card_count" in updateFields)
      fieldsToUpdate.card_count = updateFields.card_count;
    if ("mastery" in updateFields)
      fieldsToUpdate.mastery = updateFields.mastery;
    if ("last_reviewed" in updateFields)
      fieldsToUpdate.last_reviewed = updateFields.last_reviewed;

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

const removeDeck = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );

    const userId = req.auth.userId;
    const { deckId } = req.body;

    // Delete all flashcards in the deck
    try {
      const { error: flashcardsError } = await supabase
        .from("flashcards")
        .delete()
        .eq("deck_id", deckId);

      if (flashcardsError) throw flashcardsError;
    } catch (error) {
      console.error("Error deleting flashcards from deck:", error);
      return res
        .status(500)
        .json({ error: "Failed to delete flashcards from deck" });
    }

    // Delete the deck
    const { data, error } = await supabase
      .from("decks")
      .delete()
      .eq("id", deckId)
      .eq("user_id", userId);

    if (error) throw error;

    res.json({ success: true, data: data });
  } catch (error) {
    console.error("Error deleting deck:", error);
    res.status(500).json({ error: "Failed to delete deck" });
  }
};

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
    console.error("Error editing flashcard:", error);
    res.status(500).json({ error: "Failed to edit flashcard" });
  }
};

const updateFlashcard = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );

    const {
      cardId,
      streak,
      eFactor,
      interval,
      score,
      lateness,
      mastery,
      totalReviews,
      deckId,
    } = req.body;

    // Initialize card with default values if needed
    const card = {
      streak: streak,
      eFactor: eFactor,
      interval: interval,
      mastery: mastery,
      total_reviews: totalReviews,
    };

    const evaluation = { score, lateness };
    const newData = srsFunc(card, evaluation);

    const newDueDate = getNewDueDate(newData.interval);
    updateMastery(card, score);

    const { error } = await supabase
      .from("flashcards")
      .update({
        streak: newData.streak,
        e_factor: newData.eFactor,
        interval: newData.interval,
        due_date: newDueDate,
        mastery: card.mastery.toFixed(0),
        total_reviews: card.total_reviews,
      })
      .eq("id", cardId);

    const { data, error2 } = await supabase
      .from("flashcards")
      .select("*")
      .eq("deck_id", deckId);

    if (error) throw error;
    if (error2) throw error2;
    res.json(data);
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
  getDeck,
  listDecks,
  listFlashcards,
  editFlashcard,
  updateFlashcard,
};
