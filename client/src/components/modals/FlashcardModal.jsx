import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MdClear } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { UserContext } from "../../context/userContext";
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
      <div className="max-w-lg w-full max-h-[90vh] flex flex-col rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#489DBA] to-[#5AAECC] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-semibold">Add Flashcard</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isCreatingDeck || isAddingCard}
            aria-label="Close modal"
          >
            <MdClear className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="bg-white flex-1 overflow-y-auto p-6 space-y-5">
          {/* Deck Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Deck
            </label>
            {isLoadingDecks ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-3 border-gray-200 border-t-[#489DBA] rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {showNewDeckForm ? (
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newDeckTitle}
                        onChange={(e) => setNewDeckTitle(e.target.value)}
                        placeholder="Enter deck name..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#489DBA]/30 focus:border-[#489DBA] outline-none disabled:bg-gray-200 disabled:cursor-not-allowed transition-all"
                        disabled={isCreatingDeck}
                        autoFocus
                      />
                      <button
                        onClick={createNewDeck}
                        disabled={!newDeckTitle.trim() || isCreatingDeck}
                        className={`px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-all flex items-center justify-center min-w-[100px] ${
                          !newDeckTitle.trim() || isCreatingDeck
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#489DBA] hover:bg-[#3E89A3] hover:shadow-md active:scale-95"
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
                      className="text-sm text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50 transition-colors"
                      disabled={isCreatingDeck}
                    >
                      <div className="flex mt-2">
                        <IoMdArrowRoundBack className="mr-1 mt-1" />{" "}
                        <span>Back to selection</span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <select
                      value={selectedDeck?.id || ""}
                      onChange={(e) => {
                        const deckId = e.target.value;
                        const selected =
                          decks.find((deck) => deck.id === deckId) || {};
                        setSelectedDeck(selected);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#489DBA]/30 focus:border-[#489DBA] outline-none transition-all bg-white cursor-pointer"
                    >
                      <option value="">Choose a deck...</option>
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
                      className="text-sm text-[#489DBA] hover:text-[#3E89A3] font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <span className="text-lg leading-none">+</span>
                      <span>Create new deck</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Front of Card */}
          <div>
            <label
              htmlFor="flashcard-front"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Front
            </label>
            <textarea
              id="flashcard-front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#489DBA]/30 focus:border-[#489DBA] outline-none transition-all resize-none"
              rows="3"
              placeholder="Term or phrase (e.g., Xin chào)"
            />
          </div>

          {/* Back of Card */}
          <div>
            <label
              htmlFor="flashcard-back"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Back
            </label>
            <textarea
              id="flashcard-back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#489DBA]/30 focus:border-[#489DBA] outline-none transition-all resize-none"
              rows="3"
              placeholder="Translation or definition (e.g., Hello)"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-400 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#489DBA] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              disabled={isCreatingDeck || isAddingCard}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addFlashcard}
              disabled={!selectedDeck?.id || !front || !back || isAddingCard}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white w-full sm:w-auto transition-all flex items-center justify-center min-w-[120px] ${
                !selectedDeck?.id || !front || !back || isAddingCard
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#489DBA] hover:bg-[#3E89A3] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#489DBA] active:scale-95"
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
