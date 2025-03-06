import React from "react";
import { MdPlayArrow } from "react-icons/md";
import { Link } from "react-router";

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
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span className="mr-4">{cardCount} cards</span>
          <span>Last reviewed: {lastReviewed}</span>
        </div>
        <div className="flex w-full">
          <Link to={`/decks/${id}`} className="w-full">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <MdPlayArrow className="text-lg" />
              <span>View Deck</span>
            </button>
          </Link>
        </div>
      </div>
      <div className="h-2 bg-red-500"></div>
    </div>
  );
};

export default DeckCard;
