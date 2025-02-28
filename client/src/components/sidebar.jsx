import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { MdAdd, MdChat, MdDelete } from "react-icons/md";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { UserContext } from "../context/userContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { setSelectedConvoId, selectedConvoId } = useContext(UserContext);
  const { getToken } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${BACKEND_URL}/api/history/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConversations(res.data);
      if (res.data.length <= 0) {
        setSelectedConvoId(null);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const createNewConversation = async () => {
    try {
      const token = await getToken();
      const res = await axios.post(
        `${BACKEND_URL}/api/history/save`,
        { messages: [] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedConvoId(res.data.id);
      loadConversations();
      setIsSidebarOpen(false); // Close sidebar on mobile after creating new chat
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const deleteConversation = async (id, e) => {
    e.stopPropagation();
    try {
      const token = await getToken();
      await axios.post(
        `${BACKEND_URL}/api/history/delete`,
        { convoId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      loadConversations();
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleConversationSelect = (id) => {
    setSelectedConvoId(id);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div
        className={`fixed md:static top-16 left-0 h-[calc(100vh-64px)] bg-gray-50 overflow-hidden transition-all duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <div className="h-full flex flex-col w-64">
          {/* Header section */}
          <div className="bg-red-500 text-white p-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-red-600 rounded transition-colors"
            >
              <AiOutlineMenuUnfold size={20} />
            </button>
          </div>

          {/* New Chat button */}
          <div className="px-4 py-3 border-b border-gray-200">
            <button
              onClick={createNewConversation}
              className="flex items-center justify-center gap-2 w-full bg-red-500 text-white hover:bg-red-600 rounded-lg p-3 transition-colors shadow-sm font-medium"
            >
              <MdAdd className="w-5 h-5" />
              New Chat
            </button>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleConversationSelect(conv.id)}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                  selectedConvoId === conv.id
                    ? "bg-red-100 text-red-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div
                    className={`p-2 rounded-lg ${
                      selectedConvoId === conv.id
                        ? "bg-red-200"
                        : "bg-gray-200 group-hover:bg-gray-300"
                    }`}
                  >
                    <MdChat className="w-4 h-4" />
                  </div>
                  <span className="truncate font-medium">
                    {conv.title || "New Conversation"}
                  </span>
                </div>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                    selectedConvoId === conv.id
                      ? "hover:bg-red-200 text-red-600"
                      : "hover:bg-gray-200 text-gray-500"
                  }`}
                >
                  <MdDelete className="w-4 h-4" />
                </button>
              </div>
            ))}

            {conversations.length === 0 && (
              <div className="text-center text-gray-500 mt-4 px-4">
                No conversations yet. Start a new chat!
              </div>
            )}
          </div>

          {/* Footer section */}
          <div className="p-6 border-t border-gray-200 h-[4.7rem]">
            <div className="text-xs text-gray-500 text-center">
              Select words to translate them
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
