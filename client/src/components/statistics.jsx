import React from "react";

const Statistics = ({ deck, cards }) => {
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
    return { grade: "F", color: "text-red-600", bg: "bg-red-600" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const deckGradeInfo = getGradeInfo(deck.mastery, deck.total_reviews);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Performance Statistics
        </h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-700">
                Mastery Level
              </h3>
              <div
                className={`${deckGradeInfo.color} font-bold text-xl px-3 py-1 rounded-full bg-gray-100`}
              >
                {deckGradeInfo.grade}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`${deckGradeInfo.bg} h-4 rounded-full transition-all duration-300`}
                style={{ width: `${deck.mastery}%` }}
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
                {cards.map((card) => {
                  const cardGradeInfo = getGradeInfo(
                    card.mastery,
                    card.total_reviews
                  );
                  return (
                    <div key={card.id} className="flex items-center">
                      <span className="text-sm text-gray-600 w-32 truncate">
                        {card.front}
                      </span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${cardGradeInfo.bg} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${card.mastery}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {Math.round(card.mastery || 0)}%
                        </span>
                        <span className={`${cardGradeInfo.color} font-bold`}>
                          {cardGradeInfo.grade}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Review History
              </h3>
              <p className="text-gray-500">
                Total reviews:{" "}
                <span className="font-medium text-gray-700">
                  {deck.total_reviews || 0}
                </span>
                <br />
                Last reviewed:{" "}
                <span className="font-medium text-gray-700">
                  {formatDate(deck.last_reviewed)}
                </span>
              </p>

              {/* This would be a chart in a real implementation */}
              <div className="h-40 bg-gray-100 rounded-lg mt-4 flex items-center justify-center">
                <p className="text-gray-400">Review history chart</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
