import React, { useState, useContext } from "react";
import { MdEdit, MdDelete, MdSave, MdClose } from "react-icons/md";
import axios from "axios";
import { UserContext } from "../context/userContext";

const Flashcard = ({ card, listFlashcards, onDelete }) => {
  const { backendUrl, getToken } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newCard, setNewCard] = useState({
    front: card.front,
    back: card.back,
  });

  const editCard = async () => {
    console.log(`Front: ${newCard.front}, Back: ${newCard.back}`);
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

      //setNewCard("");
      listFlashcards();
    } catch (error) {
      console.log("Error editing card", error);
    }
    setIsEditing(false);
  };

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
          {isEditing ? (
            <button
              onClick={() => editCard()}
              className="text-gray-400 hover:text-green-600 p-2 rounded-full hover:bg-green-100"
            >
              <MdSave className="text-xl" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            >
              <MdEdit className="text-xl" />
            </button>
          )}
          {isEditing ? (
            <button
              onClick={() => {
                setIsEditing(false);
                setNewCard({ front: card.front, back: card.back });
              }}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            >
              <MdClose className="text-xl" />
            </button>
          ) : (
            <button
              onClick={onDelete}
              className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100"
            >
              <MdDelete className="text-xl" />
            </button>
          )}
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
