import React, { useState, useEffect, useContext, act } from "react";
import { MdClose, MdArrowBack, MdCheck, MdRefresh } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { useParams } from "react-router";
import axios from "axios";
import { UserContext } from "../context/userContext";

const ReviewDeck = () => {
  const { backendUrl, getToken, reviewMode, listDecks } =
    useContext(UserContext);
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [updatedCards, setUpdatedCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [results, setResults] = useState({
    fail: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });
  const [totalReviewed, setTotalReviewed] = useState(0);
  const [loadingDeck, setLoadingDeck] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [timeToAnswer, setTimeToAnswer] = useState(null);

  useEffect(() => {
    loadDeck();
    if (!isReviewing) {
      listFlashcards();
    }
  }, [deckId, isReviewing]);

  useEffect(() => {
    if (reviewComplete) {
      calculateDeckMastery();
    }
  }, [reviewComplete]);

  const updateDeckStats = async () => {
    try {
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/decks/edit`,
        {
          deckId,
          total_reviews: (deck.total_reviews || 0) + 1,
          last_reviewed: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log("Error updating deck stats:", error);
    }
  };

  const loadDeck = async () => {
    try {
      setLoadingDeck(true);
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
      setLoadingDeck(false);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleReviewMode = (fetchedCards) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (reviewMode) {
      case "srs":
        return shuffleArray(fetchedCards).filter((card) => {
          if (!card.due_date) return true;
          const dueDate = new Date(card.due_date);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate <= today;
        });

      case "all":
        return shuffleArray([...fetchedCards]);

      case "reversed":
        return shuffleArray(fetchedCards).map((card) => ({
          ...card,
          front: card.back,
          back: card.front,
        }));

      default:
        return shuffleArray(fetchedCards);
    }
  };

  const listFlashcards = async () => {
    try {
      setLoadingCards(true);
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

      const processedCards = handleReviewMode(res.data || []);
      setCards(processedCards);
    } catch (error) {
      console.error("Error listing flashcards:", error);
      setCards([]);
    } finally {
      setLoadingCards(false);
    }
  };

  const calculateDeckMastery = async () => {
    try {
      if (updatedCards.length > 0) {
        let totalMastery = 0;

        for (const card of updatedCards) {
          if (card.mastery !== null && card.mastery !== undefined) {
            totalMastery += Number(card.mastery);
            console.log(`Card Mastery ${card.front}:`, card.mastery);
          }
        }

        const averageMastery = Math.ceil(totalMastery / updatedCards.length);
        console.log("Average Mastery:", averageMastery);
        const token = await getToken();
        await axios.post(
          `${backendUrl}/api/decks/edit`,
          { deckId: deckId, mastery: averageMastery },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDeck((prev) => ({
          ...prev,
          mastery: averageMastery,
        }));

        listDecks();
      }
    } catch (error) {
      console.error("Error updating deck mastery:", error);
    }
  };

  const handleReturn = async () => {
    if (reviewComplete || totalReviewed > 0) {
      await updateDeckStats();
    }
    navigate(`/decks/${deckId}`);
  };

  const currentCard = cards.length > 0 ? cards[currentCardIndex] : null;

  const calculateScore = (rating, timeToAnswer) => {
    let score;

    if (rating === "easy") {
      if (timeToAnswer <= 5) {
        score = 5;
      } else {
        score = 4;
      }
    } else if (rating === "good") {
      if (timeToAnswer <= 10) {
        score = 4;
      } else {
        score = 3;
      }
    } else if (rating === "hard") {
      score = 3;
    } else if (rating === "fail") {
      if (timeToAnswer <= 20) {
        score = 2;
      } else {
        score = 1;
      }
    }

    return score;
  };

  const calculateLateness = () => {
    if (!currentCard.due_date) {
      return 0;
    }

    const now = new Date();
    const due = new Date(currentCard.due_date);
    const diffTime = now.getTime() - due.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);

    return diffHours;
  };

  const updateFlashcard = async (rating) => {
    if (!currentCard) return;

    try {
      const currentTime = new Date();
      const elapsedTimeMs = timeToAnswer ? currentTime - timeToAnswer : 0;
      const elapsedTimeSeconds = Math.floor(elapsedTimeMs / 1000);
      const score = calculateScore(rating, elapsedTimeSeconds);
      const lateness = calculateLateness();
      const token = await getToken();

      console.log(
        `Score: ${score}, Time: ${elapsedTimeSeconds}, Late: ${lateness}`
      );
      const res = await axios.post(
        `${backendUrl}/api/decks/update-flashcard`,
        {
          cardId: currentCard.id,
          streak: currentCard.streak,
          eFactor: currentCard.e_factor,
          interval: currentCard.interval,
          score: score,
          lateness: lateness,
          mastery: currentCard.mastery,
          totalReviews: currentCard.total_reviews,
          deckId: deckId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUpdatedCards((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error updating flashcards:", error);
    }
  };

  const handleRateCard = async (rating) => {
    setResults((prev) => ({
      ...prev,
      [rating]: prev[rating] + 1,
    }));

    await updateFlashcard(rating);
    setTotalReviewed((prev) => prev + 1);

    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
      setTimeToAnswer(null);
    } else {
      setReviewComplete(true);
      setIsReviewing(false);
    }
  };

  const restartReview = async () => {
    if (totalReviewed > 0) {
      await updateDeckStats();
    }

    setCurrentCardIndex(0);
    setShowAnswer(false);
    setReviewComplete(false);
    setResults({
      fail: 0,
      hard: 0,
      good: 0,
      easy: 0,
    });
    setTotalReviewed(0);
    setUpdatedCards([]);

    setIsReviewing(false);
    setLoadingDeck(true);
    setLoadingCards(true);
    await loadDeck();
    await listFlashcards();
  };

  const correctCount = results.good + results.easy + results.hard;

  if (loadingDeck || !deck) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#47A1BE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (loadingCards) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-[#47A1BE] text-white py-4 px-4 md:px-8">
          <div className="max-w-4xl mx-auto flex items-center">
            <button
              onClick={handleReturn}
              className="mr-4 p-2 hover:bg-[#327085] rounded-full transition-colors"
            >
              <MdArrowBack className="text-xl" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{deck.title}</h1>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#47A1BE] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    const isEmptyDeck = reviewMode !== "srs";
    const noCardsDue = reviewMode === "srs";

    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-[#47A1BE] text-white py-4 px-4 md:px-8">
          <div className="max-w-4xl mx-auto flex items-center">
            <button
              onClick={handleReturn}
              className="mr-4 p-2 hover:bg-[#327085] rounded-full transition-colors"
            >
              <MdArrowBack className="text-xl" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{deck.title}</h1>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {noCardsDue ? "No Cards Due" : "Deck is Empty"}
            </h2>
            <p className="text-gray-600 mb-6">
              {noCardsDue
                ? "Great job! You've completed all your due reviews. Come back later or try a different review mode."
                : "This deck doesn't have any flashcards yet. Add some cards to start reviewing!"}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleReturn}
                className="px-6 py-3 bg-[#47A1BE] hover:bg-[#327085] text-white rounded-lg flex items-center gap-2"
              >
                <MdArrowBack className="text-xl" />
                <span>Return to Deck</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-[#47A1BE] text-white py-4 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center">
          <button
            onClick={handleReturn}
            className="mr-4 p-2 hover:bg-[#327085] rounded-full transition-colors"
          >
            <MdArrowBack className="text-xl" />
          </button>
          <div>
            <h1 className="text-xl font-bold">{deck.title}</h1>
            {!reviewComplete && (
              <p className="text-sm text-blue-100">
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
                className="p-8 min-h-[300px] flex flex-col justify-center cursor-pointer relative"
                onClick={() =>
                  !showAnswer &&
                  setShowAnswer(true) &&
                  setTimeToAnswer(new Date()) &&
                  setIsReviewing(true)
                }
              >
                <div className="text-center">
                  <p className="text-gray-500 mb-2 text-sm">Question</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentCard.front}
                  </h2>
                </div>

                {!showAnswer ? (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAnswer(true);
                        setTimeToAnswer(new Date());
                        if (!isReviewing) {
                          setIsReviewing(true);
                        }
                      }}
                      className="w-3/4 py-4 bg-sky-400 text-white rounded-lg shadow-md font-medium text-lg cursor-pointer"
                    >
                      Flip Card
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-full h-px bg-gray-200 my-6"></div>

                    <div className="text-center mb-4">
                      <p className="text-gray-500 mb-2 text-sm">Answer</p>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {currentCard.back}
                      </h2>
                    </div>
                  </>
                )}
              </div>
            )}

            {showAnswer && (
              <div className="bg-gray-50 p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => handleRateCard("fail")}
                    className="px-4 py-4 bg-red-400 hover:bg-red-500 text-white rounded-lg flex items-center justify-center transition-colors text-lg font-medium"
                  >
                    <span>Fail</span>
                  </button>
                  <button
                    onClick={() => handleRateCard("hard")}
                    className="px-4 py-4 bg-orange-400 hover:bg-orange-500 text-white rounded-lg flex items-center justify-center transition-colors text-lg font-medium"
                  >
                    <span>Hard</span>
                  </button>
                  <button
                    onClick={() => handleRateCard("good")}
                    className="px-4 py-4 bg-blue-400 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-colors text-lg font-medium"
                  >
                    <span>Good</span>
                  </button>
                  <button
                    onClick={() => handleRateCard("easy")}
                    className="px-4 py-4 bg-green-400 hover:bg-green-500 text-white rounded-lg flex items-center justify-center transition-colors text-lg font-medium"
                  >
                    <span>Easy</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Review Complete!</h2>
              <p className="text-xl mb-6">
                You got {correctCount} out of {totalReviewed} cards correct.
              </p>

              <div className="mb-8">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${Math.round(
                        (correctCount / totalReviewed) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="mt-2 text-gray-600">
                  {totalReviewed > 0
                    ? Math.round((correctCount / totalReviewed) * 100)
                    : 0}
                  % correct
                </p>
              </div>

              <div className="mb-8 grid grid-cols-4 gap-2">
                <div className="bg-red-100 p-3 rounded-lg">
                  <div className="text-red-600 font-bold text-xl">
                    {results.fail}
                  </div>
                  <div className="text-sm text-gray-600">Fail</div>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <div className="text-orange-600 font-bold text-xl">
                    {results.hard}
                  </div>
                  <div className="text-sm text-gray-600">Hard</div>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <div className="text-blue-600 font-bold text-xl">
                    {results.good}
                  </div>
                  <div className="text-sm text-gray-600">Good</div>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <div className="text-green-600 font-bold text-xl">
                    {results.easy}
                  </div>
                  <div className="text-sm text-gray-600">Easy</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={restartReview}
                  className="px-6 py-3 bg-blue-100 text-[#47A1BE] hover:bg-blue-200 rounded-lg flex items-center gap-2"
                >
                  <MdRefresh className="text-xl" />
                  <span>Review Again</span>
                </button>
                <button
                  onClick={handleReturn}
                  className="px-6 py-3 bg-[#47A1BE] hover:bg-[#327085] text-white rounded-lg"
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
