import React from "react";
import { MdClose, MdSettings } from "react-icons/md";

const ReviewSettingsModal = ({ reviewMode, setReviewMode, onClose }) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <div className="bg-[#47A1BE] text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MdSettings className="text-xl" />
              <h3 className="text-lg font-medium">Review Settings</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Choose how you want to review your flashcards:
            </p>
            <div className="space-y-4">
              <label
                className={`
                  block p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    reviewMode === "srs"
                      ? "border-[#47A1BE] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="reviewMode"
                    checked={reviewMode === "srs"}
                    onChange={() => setReviewMode("srs")}
                    className="w-5 h-5 text-[#47A1BE] focus:ring-[#47A1BE]"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Spaced Repetition
                    </h4>
                    <p className="text-sm text-gray-600">
                      Smart review system that prioritizes cards based on your
                      performance and review history
                    </p>
                  </div>
                </div>
              </label>

              <label
                className={`
                  block p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    reviewMode === "all"
                      ? "border-[#47A1BE] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="reviewMode"
                    checked={reviewMode === "all"}
                    onChange={() => setReviewMode("all")}
                    className="w-5 h-5 text-[#47A1BE] focus:ring-[#47A1BE]"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      All Cards (Shuffled)
                    </h4>
                    <p className="text-sm text-gray-600">
                      Review all cards in your deck in a random order
                    </p>
                  </div>
                </div>
              </label>

              <label
                className={`
                  block p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    reviewMode === "reversed"
                      ? "border-[#47A1BE] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="reviewMode"
                    checked={reviewMode === "reversed"}
                    onChange={() => setReviewMode("reversed")}
                    className="w-5 h-5 text-[#47A1BE] focus:ring-[#47A1BE]"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Reversed Cards
                    </h4>
                    <p className="text-sm text-gray-600">
                      Test yourself by switching the front and back of all cards
                    </p>
                  </div>
                </div>
              </label>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#47A1BE] text-white rounded-lg hover:bg-[#3E89A3] transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSettingsModal;
