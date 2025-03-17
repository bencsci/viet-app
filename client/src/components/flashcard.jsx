import React, { useState, useContext } from "react";
import { MdEdit, MdDelete, MdSave, MdClose } from "react-icons/md";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";

const Flashcard = ({ card, listFlashcards, onDelete }) => {
  const { backendUrl, getToken } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newCard, setNewCard] = useState({
    front: card.front,
    back: card.back,
  });

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

  const editCard = async () => {
    try {
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/decks/edit-flashcard`,
        {
          cardId: card.id,
          newFront: newCard.front,
          newBack: newCard.back,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await listFlashcards();
      toast.success("Flashcard Updated!");
    } catch (error) {
      console.log("Error editing card", error);
    }
    setIsEditing(false);
  };

  const mastery = Math.round(card.mastery || 0);
  const gradeInfo = getGradeInfo(mastery, card.total_reviews);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-medium text-gray-800 mb-1">Front</h3>
          <div className="bg-gray-50 p-3 rounded-md min-h-[60px] flex items-center">
            {isEditing ? (
              <input
                className="w-full bg-transparent border-none focus:outline-none text-gray-700"
                type="text"
                value={newCard.front}
                onChange={(e) => {
                  setNewCard({ ...newCard, front: e.target.value });
                }}
              />
            ) : (
              <p className="text-gray-700">{newCard.front}</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">Back</h3>
          <div className="bg-gray-50 p-3 rounded-md min-h-[60px] flex items-center">
            {isEditing ? (
              <input
                className="w-full bg-transparent border-none focus:outline-none text-gray-700"
                type="text"
                value={newCard.back}
                onChange={(e) => {
                  setNewCard({ ...newCard, back: e.target.value });
                }}
              />
            ) : (
              <p className="text-gray-700">{newCard.back}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center px-4 pb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="bg-gray-200 rounded-full h-2.5 mr-2 w-24">
              <div
                className={`${gradeInfo.bg} h-2.5 rounded-full transition-all duration-300`}
                style={{ width: `${mastery}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-500">{mastery}% mastered</span>
          </div>
          <div className={`font-bold text-lg ${gradeInfo.color}`}>
            {gradeInfo.grade}
          </div>
        </div>

        <div className="flex space-x-1">
          {isEditing ? (
            <>
              <button
                onClick={() => editCard()}
                className="text-gray-400 hover:text-green-600 p-2 rounded-full hover:bg-green-100"
              >
                <MdSave className="text-xl" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewCard({ front: card.front, back: card.back });
                }}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              >
                <MdClose className="text-xl" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              >
                <MdEdit className="text-xl" />
              </button>
              <button
                onClick={onDelete}
                className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100"
              >
                <MdDelete className="text-xl" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="h-1 bg-gray-100 w-full">
        <div
          className={`h-full ${gradeInfo.bg} transition-all duration-300`}
          style={{ width: `${mastery}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Flashcard;
