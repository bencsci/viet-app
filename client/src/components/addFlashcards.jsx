import React, { useState, useContext } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";

const AddFlashcards = ({ deck, listFlashcards, loadDeck }) => {
  const { backendUrl, getToken } = useContext(UserContext);
  const [newFlashcards, setNewFlashcards] = useState([
    { id: 0, front: "", back: "" },
  ]);

  const updateCardCount = async () => {
    try {
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/decks/edit`,
        { deckId: deck.id, card_count: deck.card_count + 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadDeck();
    } catch (error) {
      console.error("Error updating card count in deck:", error);
    }
  };

  const addNewFlashcardField = () => {
    setNewFlashcards([
      ...newFlashcards,
      { id: newFlashcards.length, front: "", back: "" },
    ]);
  };

  const updateAddFlashcard = (id, field, value) => {
    setNewFlashcards(
      newFlashcards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const removeFlashcardField = (id) => {
    if (newFlashcards.length === 1) {
      setNewFlashcards([{ id: 0, front: "", back: "" }]);
      return;
    }

    setNewFlashcards(newFlashcards.filter((card) => card.id !== id));
  };

  const handleCreateFlashcards = async () => {
    const validCards = newFlashcards.filter(
      (card) => card.front.trim() && card.back.trim()
    );

    if (validCards.length === 0) return;

    try {
      const token = await getToken();

      const cardsToSubmit = [...validCards];

      for (const card of cardsToSubmit) {
        await axios.post(
          `${backendUrl}/api/decks/add-flashcard`,
          { deckId: deck.id, front: card.front, back: card.back },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setNewFlashcards([{ id: 0, front: "", back: "" }]);
      await updateCardCount();
      await listFlashcards();

      let updateMessage =
        cardsToSubmit.length === 1 ? "Added Flashcard!" : "Added Flashcards!";

      toast.success(updateMessage);

      console.log("All flashcards added successfully");
    } catch (error) {
      console.error("Error creating flashcards:", error);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Add New Flashcards
      </h3>
      <div className="space-y-4">
        {newFlashcards.map((card) => (
          <div
            key={card.id}
            className="group relative flex gap-4 bg-gray-50 p-4 rounded-lg"
          >
            <div className="flex-1">
              <label
                htmlFor={`front-${card.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Front (Vietnamese)
              </label>
              <textarea
                id={`front-${card.id}`}
                value={card.front}
                onChange={(e) =>
                  updateAddFlashcard(card.id, "front", e.target.value)
                }
                placeholder="Enter the Vietnamese word or phrase"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none bg-white"
                rows={2}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor={`back-${card.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Back (English)
              </label>
              <textarea
                id={`back-${card.id}`}
                value={card.back}
                onChange={(e) =>
                  updateAddFlashcard(card.id, "back", e.target.value)
                }
                placeholder="Enter the English translation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none bg-white"
                rows={2}
              />
            </div>
            <button
              type="button"
              onClick={() => removeFlashcardField(card.id)}
              className="absolute -right-2 -top-2 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove card"
            >
              <MdClose className="text-lg" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={addNewFlashcardField}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <MdAdd className="text-xl" />
          <span>Add Another Card</span>
        </button>
        <button
          type="button"
          onClick={handleCreateFlashcards}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ml-auto"
        >
          Save All Cards
        </button>
      </div>
    </div>
  );
};

export default AddFlashcards;
