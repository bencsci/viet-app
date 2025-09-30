import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MdClear } from "react-icons/md";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";

const FlashcardModal = ({ isOpen, onClose, initialFront, initialBack }) => {
  const { getToken, backendUrl, decks, isLoadingDecks, listDecks } =
    useContext(UserContext);

  const [front, setFront] = useState(initialFront || "");
  const [back, setBack] = useState(initialBack || "");
  const [selectedDeck, setSelectedDeck] = useState({});
  const [showNewDeckForm, setShowNewDeckForm] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFront(initialFront || "");
      setBack(initialBack || "");
      setSelectedDeck({});
      setShowNewDeckForm(false);
      setNewDeckTitle("");
      if (!decks || decks.length === 0) {
        listDecks();
      }
    }
  }, [isOpen, initialFront, initialBack]);

  const createNewDeck = async () => {
    if (!newDeckTitle.trim() || isCreatingDeck) return;

    setIsCreatingDeck(true);
    try {
      const token = await getToken();
      const res = await axios.post(
        `${backendUrl}/api/decks/create`,
        { deckName: newDeckTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newDeck = res.data;
      listDecks();
      setSelectedDeck(newDeck);
      setShowNewDeckForm(false);
      setNewDeckTitle("");
      toast.success(`Deck "${newDeck.title}" created!`);
    } catch (error) {
      console.error("Error creating deck:", error);
      toast.error("Failed to create deck.");
    } finally {
      setIsCreatingDeck(false);
    }
  };

  const addFlashcard = async () => {
    if (!selectedDeck?.id || !front || !back || isAddingCard) return;

    setIsAddingCard(true);
    try {
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/decks/add-flashcard`,
        {
          deckId: selectedDeck.id,
          front: front,
          back: back,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Flashcard added to "${selectedDeck.title}"!`);
      listDecks();
      onClose();
    } catch (error) {
      console.error("Error adding flashcard:", error);
      toast.error("Failed to add flashcard.");
    } finally {
      setIsAddingCard(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in-scale">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-xl">
        <div className="bg-[#489DBA] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold">Add Flashcard</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#3E89A3] rounded-full transition-colors disabled:opacity-50"
            disabled={isCreatingDeck || isAddingCard}
          >
            <MdClear className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Deck
            </label>
            {isLoadingDecks ? (
              <div className="flex justify-center py-2">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#47A1BE] rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {showNewDeckForm ? (
                  <div className="mb-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-2 mb-2">
                      <input
                        type="text"
                        value={newDeckTitle}
                        onChange={(e) => setNewDeckTitle(e.target.value)}
                        placeholder="Enter new deck title..."
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#47A1BE] focus:border-[#47A1BE] outline-none disabled:bg-gray-100"
                        disabled={isCreatingDeck}
                      />
                      <button
                        onClick={createNewDeck}
                        disabled={!newDeckTitle.trim() || isCreatingDeck}
                        className={`px-3 py-2 rounded-md text-white text-sm transition-colors flex items-center justify-center ${
                          !newDeckTitle.trim() || isCreatingDeck
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#489DBA] hover:bg-[#3E89A3]"
                        }`}
                      >
                        {isCreatingDeck ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          "Create"
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => setShowNewDeckForm(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      disabled={isCreatingDeck}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <select
                      value={selectedDeck?.id || ""}
                      onChange={(e) => {
                        const deckId = e.target.value;
                        const selected =
                          decks.find((deck) => deck.id === deckId) || {};
                        setSelectedDeck(selected);
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 text-sm focus:ring-1 focus:ring-[#47A1BE] focus:border-[#47A1BE] outline-none"
                    >
                      <option value="">Select a Deck</option>
                      {decks && decks.length > 0 ? (
                        decks.map((deck) => (
                          <option key={deck.id} value={deck.id}>
                            {deck.title}
                          </option>
                        ))
                      ) : (
                        <option disabled>No decks available</option>
                      )}
                    </select>
                    <button
                      onClick={() => setShowNewDeckForm(true)}
                      className="text-sm text-[#47A1BE] hover:text-[#3E89A3] font-medium"
                    >
                      + Create new deck
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="flashcard-front"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Front
            </label>
            <textarea
              id="flashcard-front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#47A1BE] focus:border-[#47A1BE] outline-none"
              rows="3"
              placeholder="Term or phrase (e.g., Xin chào)"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="flashcard-back"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Back
            </label>
            <textarea
              id="flashcard-back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#47A1BE] focus:border-[#47A1BE] outline-none"
              rows="3"
              placeholder="Translation or definition (e.g., Hello)"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#47A1BE] disabled:opacity-50"
              disabled={isCreatingDeck || isAddingCard}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addFlashcard}
              disabled={!selectedDeck?.id || !front || !back || isAddingCard}
              className={`px-4 py-2 rounded-md text-sm text-white w-full sm:w-auto transition-colors flex items-center justify-center ${
                !selectedDeck?.id || !front || !back || isAddingCard
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#489DBA] hover:bg-[#3E89A3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#47A1BE]"
              }`}
            >
              {isAddingCard ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Add to Deck"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardModal;
