import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";

const Flashcard = ({ card, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-medium text-gray-800 mb-1">Front</h3>
          <div className="bg-gray-50 p-3 rounded-md min-h-[60px] flex items-center">
            <p className="text-gray-700">{card.front}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">Back</h3>
          <div className="bg-gray-50 p-3 rounded-md min-h-[60px] flex items-center">
            <p className="text-gray-700">{card.back}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center px-4 pb-4">
        <div className="flex items-center">
          <div className="bg-gray-200 rounded-full h-2.5 mr-2 w-24">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${Math.round((card.mastery || 0) * 100)}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-500">
            {Math.round((card.mastery || 0) * 100)}% mastered
          </span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(card)}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <MdEdit className="text-xl" />
          </button>
          <button
            onClick={() => onDelete(card)}
            className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100"
          >
            <MdDelete className="text-xl" />
          </button>
        </div>
      </div>

      <div className="h-1 bg-gray-100 w-full">
        <div
          className="h-full bg-red-500"
          style={{ width: `${Math.round((card.mastery || 0) * 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Flashcard;
