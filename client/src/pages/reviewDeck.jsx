import React, { useState, useEffect, useContext } from "react";
import { MdClose, MdArrowBack, MdCheck, MdRefresh } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { useParams } from "react-router";
import axios from "axios";
import { UserContext } from "../context/userContext";

const ReviewDeck = () => {
  const { backendUrl, getToken } = useContext(UserContext);
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalReviewed, setTotalReviewed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeck();
    listFlashcards();
  }, [deckId]);

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
    } finally {
      setLoading(false);
    }
  };

  const listFlashcards = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Return to the deck page
  const handleReturn = () => {
    navigate(`/decks/${deckId}`);
  };

  // Check if we have a current card
  const currentCard = cards.length > 0 ? cards[currentCardIndex] : null;

  const handleNextCard = (correct) => {
    if (correct) {
      setCorrectCount((prev) => prev + 1);
    }

    setTotalReviewed((prev) => prev + 1);

    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      setReviewComplete(true);
    }
  };

  const restartReview = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setReviewComplete(false);
    setCorrectCount(0);
    setTotalReviewed(0);
  };

  // Show loading state
  if (loading || !deck || cards.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-red-600 text-white py-4 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center">
          <button
            onClick={handleReturn}
            className="mr-4 p-2 hover:bg-red-700 rounded-full transition-colors"
          >
            <MdArrowBack className="text-xl" />
          </button>
          <div>
            <h1 className="text-xl font-bold">{deck.title}</h1>
            {!reviewComplete && (
              <p className="text-sm text-red-100">
                Card {currentCardIndex + 1} of {cards.length}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!reviewComplete ? (
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
            {currentCard && (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAnswer(true);
                      }}
                      className="mt-6 text-red-600 hover:text-red-700 font-medium"
                    >
                      Show Answer
                    </button>
                  )}
                </div>
              </div>
            )}

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
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Review Complete!</h2>
              <p className="text-xl mb-6">
                You got {correctCount} out of {cards.length} cards correct.
              </p>

              <div className="mb-8">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${Math.round(
                        (correctCount / cards.length) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="mt-2 text-gray-600">
                  {Math.round((correctCount / cards.length) * 100)}% correct
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={restartReview}
                  className="px-6 py-3 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg flex items-center gap-2"
                >
                  <MdRefresh className="text-xl" />
                  <span>Review Again</span>
                </button>
                <button
                  onClick={handleReturn}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Return to Deck
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDeck;
