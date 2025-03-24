import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router";
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
  MdSettings,
} from "react-icons/md";
import axios from "axios";
import { UserContext } from "../context/userContext";
import AddFlashcards from "../components/addFlashcards";
import Statistics from "../components/statistics";
import Flashcard from "../components/flashcard";

const Deck = () => {
  const { deckId } = useParams();
  const { backendUrl, reviewMode, setReviewMode } = useContext(UserContext);
  const { getToken } = useAuth();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cards");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [isDeleteDeckModalOpen, setIsDeleteDeckModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isReviewSettingsOpen, setIsReviewSettingsOpen] = useState(false);

  useEffect(() => {
    loadDeck();
    listFlashcards();
  }, [deckId]);

  const removeDeck = async () => {
    try {
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/decks/remove`,
        { deckId: deckId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/decks");
    } catch (error) {
      console.log("Error deleting deck:", error);
      alert("Failed to delete deck. Please try again.");
    }
  };

  const updateCardCount = async () => {
    try {
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/decks/edit`,
        { deckId: deckId, card_count: deck.card_count - 1 },
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

  const loadDeck = async () => {
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
      navigate("/404-not-found");
    } finally {
      setLoading(false);
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
      navigate("/404-not-found");
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
          flashcardId: cardToDelete.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCards((prevCards) =>
        prevCards.filter((c) => c.id !== cardToDelete.id)
      );

      updateCardCount();
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

  const editTitle = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();
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

      setRenameModalOpen(false);
      loadDeck();
    } catch (error) {
      console.log("Error updating deck title", error);
    }
  };

  const getGradeInfo = (mastery, totalReviews) => {
    if (!totalReviews || totalReviews === 0) {
      return {
        grade: "New",
        color: "text-purple-600",
        bg: "bg-purple-500",
      };
    }

    if (mastery >= 90)
      return { grade: "A", color: "text-green-600", bg: "bg-green-500" };
    if (mastery >= 80)
      return { grade: "B", color: "text-blue-600", bg: "bg-blue-500" };
    if (mastery >= 70)
      return { grade: "C", color: "text-yellow-600", bg: "bg-yellow-500" };
    if (mastery >= 60)
      return { grade: "D", color: "text-orange-600", bg: "bg-orange-500" };
    if (mastery >= 50)
      return { grade: "E", color: "text-red-400", bg: "bg-red-400" };
    return { grade: "F", color: "text-red-600", bg: "bg-red-400" };
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#47A1BE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-[#47A1BE] text-white py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-4">
            <Link
              to="/decks"
              className="mr-4 p-2 hover:bg-[#3E89A3] rounded-full transition-colors"
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
            <div className="bg-[#3E89A3] bg-opacity-30 rounded-lg p-4">
              <p className="text-blue-200 text-sm">Cards</p>
              <p className="text-2xl font-bold">{deck.card_count}</p>
            </div>
            <div className="bg-[#3E89A3] bg-opacity-30 rounded-lg p-4">
              <p className="text-blue-200 text-sm">Mastery</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{deck.mastery}%</p>
                <div
                  className={`${
                    getGradeInfo(deck.mastery, deck.total_reviews).color
                  } px-3 py-1 rounded-full text-lg font-bold bg-white`}
                >
                  {getGradeInfo(deck.mastery, deck.total_reviews).grade}
                </div>
              </div>
              <div className="mt-3 bg-white/20 rounded-full h-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    getGradeInfo(deck.mastery, deck.total_reviews).bg
                  }`}
                  style={{ width: `${deck.mastery}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-[#3E89A3] bg-opacity-30 rounded-lg p-4">
              <p className="text-blue-200 text-sm">Reviews</p>
              <p className="text-2xl font-bold">{deck.total_reviews}</p>
            </div>
            <div className="bg-[#3E89A3] bg-opacity-30 rounded-lg p-4">
              <p className="text-blue-200 text-sm">Last Reviewed</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to={`/decks/${deckId}/review`} className="w-full">
            <button
              disabled={cards.length === 0}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium shadow-sm ${
                cards.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#47A1BE] hover:bg-[#3E89A3] text-white"
              }`}
            >
              <MdPlayArrow className="text-xl" />
              <span>Start Review</span>
            </button>
          </Link>

          <button
            onClick={() => {
              setNewTitle(deck.title);
              setRenameModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-sm border border-gray-200"
          >
            <MdEdit className="text-xl" />
            <span>Rename Deck</span>
          </button>

          <button
            onClick={() => setIsReviewSettingsOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-sm border border-gray-200"
          >
            <MdSettings className="text-xl" />
            <span>Review Settings</span>
          </button>

          <button
            onClick={() => setIsDeleteDeckModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-red-50 text-red-600 rounded-lg font-medium shadow-sm border border-red-200"
          >
            <MdDelete className="text-xl" />
            <span>Delete Deck</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("cards")}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === "cards"
                  ? "border-[#47A1BE] text-[#47A1BE]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === "stats"
                  ? "border-[#47A1BE] text-[#47A1BE]"
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
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MdAdd className="text-[#47A1BE] text-3xl" />
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

            <AddFlashcards
              deck={deck}
              listFlashcards={listFlashcards}
              loadDeck={loadDeck}
            />
          </div>
        )}

        {activeTab === "stats" && <Statistics deck={deck} cards={cards} />}
      </div>

      {/* Deletion Confirmation Modal */}
      {isDeleteModalOpen && cardToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-[#47A1BE] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium">Confirm Deletion</h3>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCardToDelete(null);
                }}
                className="p-1 hover:bg-[#47A1BE] rounded transition-colors"
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
                  className="px-4 py-2 bg-[#47A1BE] text-white rounded-md hover:bg-[#47A1BE]"
                >
                  Delete Flashcard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {renameModalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#47A1BE] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium">Rename Deck</h3>
              <button
                onClick={() => setRenameModalOpen(false)}
                className="p-1 hover:bg-[#47A1BE] rounded transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editTitle} className="p-4">
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#47A1BE] focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRenameModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#47A1BE] text-white rounded-md hover:bg-[#47A1BE] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Deck Confirmation Modal */}
      {isDeleteDeckModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-[#47A1BE] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium">Delete Deck</h3>
              <button
                onClick={() => setIsDeleteDeckModalOpen(false)}
                className="p-1 hover:bg-[#47A1BE] rounded transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center mb-4 text-red-500">
                <MdDelete className="w-16 h-16" />
              </div>

              <h3 className="text-xl font-bold text-center mb-2">
                Delete "{deck.title}"?
              </h3>

              <p className="mb-6 text-gray-700 text-center">
                This will permanently delete this deck and all {deck.card_count}{" "}
                flashcards it contains. This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteDeckModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={removeDeck}
                  className="px-4 py-2 bg-[#47A1BE] text-white rounded-md hover:bg-[#47A1BE]"
                >
                  Delete Deck
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isReviewSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-[#47A1BE] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium">Review Settings</h3>
              <button
                onClick={() => setIsReviewSettingsOpen(false)}
                className="p-1 hover:bg-[#47A1BE] rounded transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Spaced Repetition
                    </h4>
                    <p className="text-sm text-gray-500">
                      Review cards based on your performance
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="reviewMode"
                    checked={reviewMode === "srs"}
                    onChange={() => setReviewMode("srs")}
                    className="w-4 h-4 text-red-500 focus:ring-red-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      All Cards (Shuffle)
                    </h4>
                    <p className="text-sm text-gray-500">
                      Review entire deck in shuffled order
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="reviewMode"
                    checked={reviewMode === "all"}
                    onChange={() => setReviewMode("all")}
                    className="w-4 h-4 text-red-500 focus:ring-red-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Reversed</h4>
                    <p className="text-sm text-gray-500">
                      Switch front and back of cards
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="reviewMode"
                    checked={reviewMode === "reversed"}
                    onChange={() => setReviewMode("reversed")}
                    className="w-4 h-4 text-red-500 focus:ring-red-400"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsReviewSettingsOpen(false)}
                  className="px-4 py-2 bg-[#47A1BE] text-white rounded-md hover:bg-[#47A1BE]"
                >
                  Done
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
