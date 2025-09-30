import React from "react";
import { MdClose, MdDelete } from "react-icons/md";

const DeleteDeckModal = ({ onClose, deleteDeck, deck }) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <div className="bg-[#47A1BE] text-white px-4 py-3 flex items-center justify-between">
            <h3 className="font-medium">Delete Deck</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#47A1BE] rounded transition-colors"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center mb-4 text-red-500">
              <MdDelete className="w-16 h-16" />
            </div>

            <h3 className="text-xl font-bold text-center mb-2">
              Delete "{deck.title}"?
            </h3>

            <p className="mb-6 text-gray-700 text-center">
              This will permanently delete this deck and all {deck.card_count}{" "}
              flashcards it contains. This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteDeck}
                className="px-4 py-2 bg-[#47A1BE] text-white rounded-md hover:bg-[#47A1BE]"
              >
                Delete Deck
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteDeckModal;
