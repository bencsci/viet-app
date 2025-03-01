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
} from "react-icons/md";
import axios from "axios";
import { UserContext } from "../context/userContext";

const Deck = () => {
  const { deckId } = useParams();
  const { backendUrl } = useContext(UserContext);
  const { getToken } = useAuth();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cards");
  const [reviewMode, setReviewMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    // // Simulate API call to get deck details
    // setTimeout(() => {
    //   setDeck({
    //     id: deckId,
    //     title: "Basic Vietnamese Phrases",
    //     created: "2023-05-15",
    //     lastReviewed: "2023-06-10",
    //     totalReviews: 24,
    //     masteryLevel: 68,
    //   });
    //   // Sample cards - would come from API
    //   setCards([
    //     { id: 1, front: "Xin chào", back: "Hello", mastery: 90 },
    //     { id: 2, front: "Cảm ơn", back: "Thank you", mastery: 85 },
    //     { id: 3, front: "Tạm biệt", back: "Goodbye", mastery: 70 },
    //   ]);
    //   setLoading(false);
    // }, 800);

    loadDeck();
  }, [deckId]);

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

  const startReview = () => {
    if (cards.length > 0) {
      setReviewMode(true);
      setCurrentCardIndex(0);
      setShowAnswer(false);
    }
  };

  const handleNextCard = (correct) => {
    // In a real app, you would update the card's mastery level here

    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      // End of review
      setReviewMode(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (reviewMode) {
    const currentCard = cards[currentCardIndex];

    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-red-600 text-white py-4 px-4 md:px-8">
          <div className="max-w-4xl mx-auto flex items-center">
            <button
              onClick={() => setReviewMode(false)}
              className="mr-4 p-2 hover:bg-red-700 rounded-full transition-colors"
            >
              <MdArrowBack className="text-xl" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{deck.title}</h1>
              <p className="text-sm text-red-100">
                Card {currentCardIndex + 1} of {cards.length}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
            <div
              className="p-8 min-h-[300px] flex items-center justify-center cursor-pointer"
              onClick={() => !showAnswer && setShowAnswer(true)}
            >
              <div className="text-center">
                <p className="text-gray-500 mb-2 text-sm">
                  {showAnswer ? "Answer" : "Question"}
                </p>
                <h2 className="text-2xl font-bold text-gray-800">
                  {showAnswer ? currentCard.back : currentCard.front}
                </h2>

                {!showAnswer && (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="mt-6 text-red-600 hover:text-red-700 font-medium"
                  >
                    Show Answer
                  </button>
                )}
              </div>
            </div>

            {showAnswer && (
              <div className="bg-gray-50 p-4 flex justify-center gap-4">
                <button
                  onClick={() => handleNextCard(false)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center gap-2"
                >
                  <MdClose className="text-xl" />
                  <span>Incorrect</span>
                </button>
                <button
                  onClick={() => handleNextCard(true)}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2"
                >
                  <MdCheck className="text-xl" />
                  <span>Correct</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
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
              <p className="text-2xl font-bold">{deck.masteryLevel}%</p>
            </div>
            <div className="bg-red-700 bg-opacity-30 rounded-lg p-4">
              <p className="text-red-200 text-sm">Reviews</p>
              <p className="text-2xl font-bold">{deck.totalReviews}</p>
            </div>
            <div className="bg-red-700 bg-opacity-30 rounded-lg p-4">
              <p className="text-red-200 text-sm">Last Reviewed</p>
              <p className="text-2xl font-bold">
                {new Date(deck.lastReviewed).toLocaleDateString()}
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
            <MdAdd className="text-xl" />
            <span>Add Cards</span>
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
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md mx-auto">
                  <MdAdd className="text-xl" />
                  <span className="font-medium">Add Flashcard</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Front</p>
                        <p className="text-lg font-medium">{card.front}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Back</p>
                        <p className="text-lg font-medium">{card.back}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-gray-200 rounded-full h-2.5 mr-2 w-24">
                          <div
                            className="bg-green-500 h-2.5 rounded-full"
                            style={{ width: `${card.mastery}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {card.mastery}% mastered
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
                        <MdEdit className="text-xl" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center mt-6">
                  <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                    <MdAdd className="text-xl" />
                    <span className="font-medium">Add More Cards</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Performance Statistics
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Mastery Level
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${deck.masteryLevel}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                  <span>Mastered</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Card Mastery
                  </h3>
                  <div className="space-y-3">
                    {cards.map((card) => (
                      <div key={card.id} className="flex items-center">
                        <span className="text-sm text-gray-600 w-32 truncate">
                          {card.front}
                        </span>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${card.mastery}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {card.mastery}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Review History
                  </h3>
                  <p className="text-gray-500">
                    You've reviewed this deck {deck.totalReviews} times.
                    <br />
                    Last reviewed on{" "}
                    {new Date(deck.lastReviewed).toLocaleDateString()}.
                  </p>

                  {/* This would be a chart in a real implementation */}
                  <div className="h-40 bg-gray-100 rounded-lg mt-4 flex items-center justify-center">
                    <p className="text-gray-400">Review history chart</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deck;
