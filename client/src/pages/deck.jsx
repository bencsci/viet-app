import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import {
  MdAdd,
  MdArrowBack,
  MdPlayArrow,
  MdEdit,
  MdBarChart,
  MdCheck,
  MdClose,
  MdDelete,
} from "react-icons/md";
import axios from "axios";
import { UserContext } from "../context/userContext";
import AddFlashcards from "../components/addFlashcards";
import ReviewDeck from "../components/reviewDeck";
import Statistics from "../components/statistics";
import Flashcard from "../components/flashcard";

const Deck = () => {
  const { deckId } = useParams();
  const { backendUrl } = useContext(UserContext);
  const { getToken } = useAuth();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cards");
  const [reviewMode, setReviewMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  useEffect(
    () => {
      loadDeck();
      listFlashcards();
    },
    [deckId],
    [cards]
  );

  const loadDeck = async () => {
    try {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await axios.post(
          `${backendUrl}/api/decks/get`,
          { deckId: deckId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDeck(res.data);
      } catch (error) {
        console.error("Error loading deck:", error);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const listFlashcards = async () => {
    try {
      const token = await getToken();
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

      setCards(res.data);
    } catch (error) {
      console.error("Error listing flashcards:", error);
    }
  };

  const deleteFlashcard = async (card, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setCardToDelete(card);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteFlashcard = async () => {
    if (!cardToDelete) return;

    try {
      const token = await getToken();

      await axios.post(
        `${backendUrl}/api/decks/remove-flashcard`,
        {
          deckId,
          flashcardId: cardToDelete.id || cardToDelete._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCards((prevCards) =>
        prevCards.filter(
          (c) => c.id !== cardToDelete.id && c._id !== cardToDelete._id
        )
      );

      loadDeck();
      listFlashcards();

      console.log("Flashcard deleted successfully");
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      alert("Failed to delete flashcard. Please try again.");
    } finally {
      setIsDeleteModalOpen(false);
      setCardToDelete(null);
    }
  };

  const startReview = () => {
    if (cards.length === 0) {
      alert("Add some flashcards first!");
      return;
    }
    setReviewMode(true);
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (reviewMode) {
    return (
      <ReviewDeck
        cards={cards}
        deckTitle={deck?.title || "Deck"}
        onClose={() => setReviewMode(false)}
      />
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-red-600 text-white py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-4">
            <Link
              to="/review"
              className="mr-4 p-2 hover:bg-red-700 rounded-full transition-colors"
            >
              <MdArrowBack className="text-xl" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold py-3">
                {deck.title}
              </h1>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-red-700 bg-opacity-30 rounded-lg p-4">
              <p className="text-red-200 text-sm">Cards</p>
              <p className="text-2xl font-bold">{cards.length}</p>
            </div>
            <div className="bg-red-700 bg-opacity-30 rounded-lg p-4">
              <p className="text-red-200 text-sm">Mastery</p>
              <p className="text-2xl font-bold">{deck.mastery}%</p>
            </div>
            <div className="bg-red-700 bg-opacity-30 rounded-lg p-4">
              <p className="text-red-200 text-sm">Reviews</p>
              <p className="text-2xl font-bold">{deck.total_reviews}</p>
            </div>
            <div className="bg-red-700 bg-opacity-30 rounded-lg p-4">
              <p className="text-red-200 text-sm">Last Reviewed</p>
              <p className="text-2xl font-bold">
                {new Date(deck.last_reviewed).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={startReview}
            disabled={cards.length === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium shadow-sm ${
              cards.length === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            <MdPlayArrow className="text-xl" />
            <span>Start Review</span>
          </button>

          <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-sm border border-gray-200">
            <MdEdit className="text-xl" />
            <span>Edit Deck</span>
          </button>

          <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-sm border border-gray-200">
            <MdBarChart className="text-xl" />
            <span>Detailed Stats</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("cards")}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === "cards"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === "stats"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Statistics
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "cards" && (
          <div>
            {cards.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MdAdd className="text-red-500 text-3xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  No flashcards yet
                </h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Add your first flashcard to start learning Vietnamese
                  vocabulary
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cards.map((card) => (
                  <Flashcard
                    key={card.id}
                    card={card}
                    listFlashcards={listFlashcards}
                    onDelete={() => deleteFlashcard(card)}
                  />
                ))}
              </div>
            )}

            <AddFlashcards deckId={deckId} listFlashcards={listFlashcards} />
          </div>
        )}

        {activeTab === "stats" && <Statistics deck={deck} cards={cards} />}
      </div>

      {/* Deletion Confirmation Modal */}
      {isDeleteModalOpen && cardToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium">Confirm Deletion</h3>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCardToDelete(null);
                }}
                className="p-1 hover:bg-red-600 rounded transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="mb-4 text-gray-700">
                You're about to remove this flashcard from your deck. This
                action cannot be undone.
              </p>

              <div className="flex flex-col space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Front:
                  </h4>
                  <p className="text-gray-800 font-medium">
                    {cardToDelete.front}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Back:
                  </h4>
                  <p className="text-gray-800 font-medium">
                    {cardToDelete.back}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                If you're sure you want to delete this flashcard, please confirm
                below.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setCardToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteFlashcard}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete Flashcard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deck;
