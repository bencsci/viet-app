import React from "react";
import { MdPlayArrow } from "react-icons/md";
import { Link } from "react-router";

const DeckCard = ({
  id,
  title,
  cardCount,
  lastReviewed,
  mastery,
  totalReviews,
}) => {
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

  const gradeInfo = getGradeInfo(mastery, totalReviews);

  return (
    <div
      key={id}
      className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {title}
          </h3>
          <div
            className={`${gradeInfo.color} flex items-center gap-2 font-medium`}
          >
            <span>{mastery}%</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100">
              {gradeInfo.grade}
            </span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span className="mr-4">{cardCount} cards</span>
          <span>Last reviewed: {lastReviewed}</span>
        </div>
        <div className="flex w-full">
          <Link to={`/decks/${id}`} className="w-full">
            <button className="w-full bg-[#47A1BE] hover:bg-[#327085] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <MdPlayArrow className="text-lg" />
              <span>View Deck</span>
            </button>
          </Link>
        </div>
      </div>
      <div className="h-2 bg-[#489DBA]"></div>
    </div>
  );
};

export default DeckCard;
