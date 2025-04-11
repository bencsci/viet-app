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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    try {
      const token = await getToken();

      await axios.post(
        `${backendUrl}/api/decks/add-multiple-flashcards`,
        {
          deckId: deck.id,
          cards: validCards,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewFlashcards([{ id: 0, front: "", back: "" }]);
      await listFlashcards();
      await loadDeck();

      const updateMessage =
        validCards.length === 1 ? "Added Flashcard!" : "Added Flashcards!";
      toast.success(updateMessage);
    } catch (error) {
      console.error("Error creating flashcards:", error);
      toast.error("Failed to add flashcards");
    } finally {
      setIsSubmitting(false);
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
                Front
              </label>
              <textarea
                id={`front-${card.id}`}
                value={card.front}
                onChange={(e) =>
                  updateAddFlashcard(card.id, "front", e.target.value)
                }
                placeholder="Enter a word or phrase"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#47A1BE] focus:border-transparent resize-none bg-white"
                rows={2}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor={`back-${card.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Back
              </label>
              <textarea
                id={`back-${card.id}`}
                value={card.back}
                onChange={(e) =>
                  updateAddFlashcard(card.id, "back", e.target.value)
                }
                placeholder="Enter a word or phrase"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#47A1BE] focus:border-transparent resize-none bg-white"
                rows={2}
              />
            </div>
            <button
              type="button"
              onClick={() => removeFlashcardField(card.id)}
              className="absolute -right-2 -top-2 p-1 bg-blue-100 hover:bg-[#D2E8EF] text-[#47A1BE] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
          className="flex items-center gap-2 px-4 py-2 text-[#47A1BE] hover:bg-blue-50 rounded-md transition-colors"
        >
          <MdAdd className="text-xl" />
          <span>Add Another Card</span>
        </button>
        <button
          type="button"
          onClick={handleCreateFlashcards}
          disabled={isSubmitting}
          className={`px-6 py-2 ${
            isSubmitting ? "bg-gray-400" : "bg-[#47A1BE] hover:bg-[#327085]"
          } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#47A1BE] focus:ring-offset-2 ml-auto flex items-center justify-center`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            "Save All Cards"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddFlashcards;
