import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { MdAdd, MdSearch, MdClose, MdSort } from "react-icons/md";
import DeckCard from "../components/DeckCard";
import { UserContext } from "../context/userContext";
import axios from "axios";
import SmModal from "../components/modals/smModal";
import Qilin from "../assets/QilingoLeft.svg";

const formatLastReviewed = (dateString) => {
  if (!dateString || dateString === "null") return "Never reviewed";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "Never reviewed";

  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Today
  if (diffDays === 0) {
    return `Today at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Yesterday
  if (diffDays === 1) {
    return "Yesterday";
  }

  // Within the last week
  if (diffDays < 7) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  }

  // More than a week ago
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const Review = () => {
  const navigate = useNavigate();
  const { backendUrl, getToken, decks, listDecks, loadingDecks } =
    useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [sortBy, setSortBy] = useState("lastReviewed");
  const [sortDirection, setSortDirection] = useState("desc");

  const filteredDecks = decks.filter((deck) =>
    deck.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSortedDecks = () => {
    return [...filteredDecks].sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return sortDirection === "desc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case "grade":
          const gradeA = a.mastery || 0;
          const gradeB = b.mastery || 0;
          return sortDirection === "asc" ? gradeA - gradeB : gradeB - gradeA;
        case "lastReviewed":
          const dateA = new Date(a.last_reviewed || 0);
          const dateB = new Date(b.last_reviewed || 0);
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        default:
          return 0;
      }
    });
  };

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

      setIsCreateModalOpen(false);
      listDecks();
      navigate(`/decks/${res.data.id}`);
    } catch (error) {
      console.error("Error creating deck:", error);
    }

    useEffect(() => {
      listDecks();
    }, [decks]);
  };

  const SortDropdown = () => (
    <div className="flex items-center gap-2 w-full md:w-auto">
      <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg border border-gray-200 w-full">
        <MdSort className="text-gray-400 text-xl" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm text-gray-700 focus:outline-none bg-transparent flex-1 min-w-[140px]"
        >
          <option value="lastReviewed">Recent First</option>
          <option value="alphabetical">A → Z</option>
          <option value="grade">Grade</option>
        </select>
        <button
          onClick={() =>
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {sortDirection === "asc" ? "↑" : "↓"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-[#4E9AB4] text-white py-6 px-4 md:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col items-center text-center gap-4">
            {/* Mascot */}
            <div className="w-24 sm:w-28 md:w-40">
              <img
                src={Qilin}
                alt="Qilingo Mascot"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                Flashcard Decks
              </h1>
              <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
                Review your vocabulary and improve your conversation skills
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search decks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#47A1BE] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#47A1BE] hover:bg-[#3E89A3] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm w-full md:w-auto justify-center"
            >
              <MdAdd className="text-xl" />
              <span className="font-medium">Create Deck</span>
            </button>
          </div>
          <SortDropdown />
        </div>
      </div>

      {loadingDecks && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#47A1BE] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Decks Grid */}
      {!loadingDecks && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 pb-12">
          {filteredDecks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500">
                No decks found. Create a new deck to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSortedDecks().map((deck) => (
                <DeckCard
                  key={deck.id}
                  id={deck.id}
                  title={deck.title}
                  cardCount={deck.card_count}
                  mastery={deck.mastery}
                  totalReviews={deck.total_reviews}
                  lastReviewed={formatLastReviewed(deck.last_reviewed)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!loadingDecks && decks.length === 0 && (
        <div className="max-w-md mx-auto text-center py-16">
          <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdAdd className="text-[#47A1BE] text-4xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No flashcard decks yet
          </h2>
          <p className="text-gray-500 mb-6">
            Create your first deck to start learning Vietnamese vocabulary
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#47A1BE] hover:bg-[#3E89A3] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md mx-auto"
          >
            <MdAdd className="text-xl" />
            <span className="font-medium">Create New Deck</span>
          </button>
        </div>
      )}

      {isCreateModalOpen && (
        <SmModal
          modalName="Create Deck"
          valName="Deck Name"
          value={newDeckName}
          handleSubmit={handleCreateDeck}
          onClose={() => setIsCreateModalOpen(false)}
          onChange={(e) => setNewDeckName(e.target.value)}
          placeholder="Enter a name for your deck"
          submitButtonText="Create Deck"
        />
      )}
    </div>
  );
};

export default Review;
