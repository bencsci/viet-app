import React from "react";
import { MdMoreVert, MdPlayArrow } from "react-icons/md";

const DeckCard = ({ id, title, cardCount, lastReviewed }) => {
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
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
            <MdMoreVert className="text-xl" />
          </button>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span className="mr-4">{cardCount} cards</span>
          <span>Last reviewed: {lastReviewed}</span>
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
  );
};

export default DeckCard;
