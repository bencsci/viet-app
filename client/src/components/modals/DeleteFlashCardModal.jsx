import React from "react";
import { MdClose } from "react-icons/md";

const DeleteFlashCardModal = ({ onClose, flashcard, deleteCard }) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <div className="bg-[#47A1BE] text-white px-4 py-3 flex items-center justify-between">
            <h3 className="font-medium">Confirm Deletion</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#47A1BE] rounded transition-colors"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <p className="mb-4 text-gray-700">
              You're about to remove this flashcard from your deck. This action
              cannot be undone.
            </p>

            <div className="flex flex-col space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Front:
                </h4>
                <p className="text-gray-800 font-medium">
                  {flashcard.front}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Back:
                </h4>
                <p className="text-gray-800 font-medium">{flashcard.back}</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              If you're sure you want to delete this flashcard, please confirm
              below.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteCard}
                className="px-4 py-2 bg-[#47A1BE] text-white rounded-md hover:bg-[#47A1BE]"
              >
                Delete Flashcard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteFlashCardModal;
