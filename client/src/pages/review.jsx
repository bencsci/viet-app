import React, { useState } from "react";
import { MdAdd, MdSearch, MdMoreVert, MdPlayArrow } from "react-icons/md";

const Review = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md w-full md:w-auto justify-center">
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
              <div
                key={deck.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                      {deck.title}
                    </h3>
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                      <MdMoreVert className="text-xl" />
                    </button>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <span className="mr-4">{deck.cardCount} cards</span>
                    <span>Last reviewed: {deck.lastReviewed}</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <MdPlayArrow className="text-lg" />
                      <span>Study</span>
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
                <div className="h-2 bg-red-500"></div>
              </div>
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
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md mx-auto">
            <MdAdd className="text-xl" />
            <span className="font-medium">Create New Deck</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Review;
