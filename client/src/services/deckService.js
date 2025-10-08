import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const deckService = {
  async createDeck(deckName, token) {
    const res = await axios.post(
      `${backendUrl}/api/decks/create`,
      { deckName: deckName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  async deleteDeck(deckId, token) {
    await axios.post(
      `${backendUrl}/api/decks/remove`,
      { deckId: deckId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  async loadDeck(deckId, token) {
    const res = await axios.post(
      `${backendUrl}/api/decks/get`,
      { deckId: deckId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  },

  async editTitle(deckId, newTitle, token) {
    await axios.post(
      `${backendUrl}/api/decks/edit`,
      {
        deckId,
        title: newTitle,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
