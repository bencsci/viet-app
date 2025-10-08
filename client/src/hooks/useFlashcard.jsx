import { useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { flashcardService } from "../services/flashcardService";

export const useFlashcard = (deckId, listDecks) => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);

  const listFlashcards = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await flashcardService.loadFlashcards(deckId, token);

      setCards(res);
    } catch (error) {
      console.error("Error listing flashcards:", error);
      navigate("/404-not-found");
    }
  }, [getToken, deckId, navigate]);

  const addFlashcards = useCallback(
    async (cardsToAdd) => {
      try {
        const token = await getToken();

        await flashcardService.addFlashcards(deckId, cardsToAdd, token);

        listFlashcards();
        listDecks();
        const updateMessage =
          cardsToAdd.length === 1 ? "Added Flashcard!" : "Added Flashcards!";
        toast.success(updateMessage);
      } catch (error) {
        console.error("Error creating flashcards:", error);
        toast.error("Failed to add flashcards");
      }
    },
    [getToken, deckId, listFlashcards, listDecks]
  );

  const removeFlashcard = useCallback(
    async (currentCardId) => {
      try {
        const token = await getToken();

        await flashcardService.deleteFlashcard(deckId, currentCardId, token);

        setCards((prevCards) =>
          prevCards.filter((c) => c.id !== currentCardId)
        );

        listDecks();

        console.log("Flashcard deleted successfully");
      } catch (error) {
        console.error("Error deleting flashcard:", error);
        alert("Failed to delete flashcard. Please try again.");
      }
    },
    [getToken, deckId, listDecks]
  );

  const updateCard = useCallback(
    async (currentCardId, newFront, newBack) => {
      try {
        const token = await getToken();
        await flashcardService.updateFlashcards(
          currentCardId,
          newFront,
          newBack,
          token
        );

        await listFlashcards();
        toast.success("Flashcard Updated!");
      } catch (error) {
        console.log("Error editing card", error);
      }

    },
    [getToken, listFlashcards]
  );

  return {
    cards,
    setCards,
    listFlashcards,
    addFlashcards,
    removeFlashcard,
    updateCard,
  };
};
