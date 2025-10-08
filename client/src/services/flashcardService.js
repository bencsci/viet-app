import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const flashcardService = {
  async loadFlashcards(deckId, token) {
    const res = await axios.post(
      `${backendUrl}/api/decks/list-flashcards`,
      {
        deckId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  },

  async addFlashcards(deckId, cards, token) {
    await axios.post(
      `${backendUrl}/api/decks/add-multiple-flashcards`,
      {
        deckId: deckId,
        cards: cards,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  async deleteFlashcard(deckId, cardId, token) {
    await axios.post(
      `${backendUrl}/api/decks/remove-flashcard`,
      {
        deckId,
        flashcardId: cardId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  async updateFlashcards(cardId, newFront, newBack, token) {
    await axios.post(
      `${backendUrl}/api/decks/edit-flashcard`,
      {
        cardId: cardId,
        newFront: newFront,
        newBack: newBack,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
