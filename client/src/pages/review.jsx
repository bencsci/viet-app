import React, { useState, useContext, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import {
  MdAdd,
  MdSearch,
  MdMoreVert,
  MdPlayArrow,
  MdClose,
} from "react-icons/md";
import DeckCard from "../components/deckCard";
import { UserContext } from "../context/userContext";
import axios from "axios";

const Review = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { backendUrl } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");

  // Sample deck data - would come from API in real implementation
  const [decks, setDecks] = useState([
    {
      id: 1,
      title: "Basic Vietnamese Phrases",
      cardCount: 24,
      lastReviewed: "2 days ago",
    },
    {
      id: 2,
      title: "Food Vocabulary",
      cardCount: 38,
      lastReviewed: "1 week ago",
    },
    {
      id: 3,
      title: "Travel Expressions",
      cardCount: 15,
      lastReviewed: "3 days ago",
    },
    { id: 4, title: "Common Verbs", cardCount: 42, lastReviewed: "Just now" },
    {
      id: 5,
      title: "Numbers & Counting",
      cardCount: 20,
      lastReviewed: "5 days ago",
    },
  ]);

  const filteredDecks = decks.filter((deck) =>
    deck.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDeck = async (e) => {
    e.preventDefault();

    if (!newDeckName.trim()) return;

    try {
      const token = await getToken();
      const res = await axios.post(
        `${backendUrl}/api/decks/create`,
        { deckName: newDeckName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/decks/${res.data.id}`);
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-red-600 text-white py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Flashcard Decks
          </h1>
          <p className="text-red-100">
            Review your vocabulary and improve your Vietnamese
          </p>
        </div>
      </div>

      {/* Search and Add Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search decks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md w-full md:w-auto justify-center"
          >
            <MdAdd className="text-xl" />
            <span className="font-medium">Create New Deck</span>
          </button>
        </div>
      </div>

      {/* Decks Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-12">
        {filteredDecks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500">
              No decks found. Create a new deck to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck) => (
              <DeckCard
                key={deck.id}
                id={deck.id}
                title={deck.title}
                cardCount={deck.cardCount}
                lastReviewed={deck.lastReviewed}
              />
            ))}
          </div>
        )}
      </div>

      {/* Empty State - shown when no decks exist */}
      {decks.length === 0 && (
        <div className="max-w-md mx-auto text-center py-16">
          <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdAdd className="text-red-500 text-4xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No flashcard decks yet
          </h2>
          <p className="text-gray-500 mb-6">
            Create your first deck to start learning Vietnamese vocabulary
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md mx-auto"
          >
            <MdAdd className="text-xl" />
            <span className="font-medium">Create New Deck</span>
          </button>
        </div>
      )}

      {/* Create Deck Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium">Create New Deck</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 hover:bg-red-600 rounded transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeck} className="p-4">
              <div className="mb-4">
                <label
                  htmlFor="deckName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deck Name
                </label>
                <input
                  type="text"
                  id="deckName"
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  placeholder="Enter a name for your deck"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Create Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
