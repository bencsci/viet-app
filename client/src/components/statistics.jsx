import React from "react";

const Statistics = ({ deck, cards }) => {
  return (
    <div>
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
    </div>
  );
};

export default Statistics;
