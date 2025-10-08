import { useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { deckService } from "../services/deckService";

export const useDeck = (currentDeckId, listDecks) => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);

  const createDeck = useCallback(
    async (newDeckName) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await deckService.createDeck(newDeckName, token);

        listDecks();
        navigate(`/decks/${res.id}`);
        toast.success("Deck created successfully!");
        return res;
      } catch (error) {
        console.error("Error creating deck:", error);
        toast.error("Failed to create deck. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [getToken, listDecks, navigate]
  );

  const removeDeck = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      await deckService.deleteDeck(currentDeckId, token);

      listDecks();
      navigate("/decks");
      toast.success("Deck deleted successfully!");
    } catch (error) {
      console.error("Error deleting deck:", error);
      toast.error("Failed to delete deck. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getToken, listDecks, navigate]);

  const loadDeck = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await deckService.loadDeck(currentDeckId, token);

      setDeck(res);
    } catch (error) {
      console.error("Error loading deck:", error);
      navigate("/404-not-found");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getToken, navigate]);
  const editTitle = useCallback(
    async (newTitle) => {
      try {
        setLoading(true);
        const token = await getToken();
        await deckService.editTitle(currentDeckId, newTitle, token);

        // Update local deck state
        setDeck((prev) => (prev ? { ...prev, title: newTitle } : null));
        listDecks();
        toast.success("Deck title updated!");
      } catch (error) {
        console.error("Error updating deck title:", error);
        toast.error("Failed to update deck title. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  return {
    deck,
    loading,
    createDeck,
    removeDeck,
    loadDeck,
    editTitle,
    setDeck,
  };
};
