import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { MdAdd, MdChat, MdDelete, MdMenu } from "react-icons/md";
import { UserContext } from "../context/userContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Sidebar = () => {
  const { setSelectedConvoId, selectedConvoId, backendUrl } =
    useContext(UserContext);
  const { getToken } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
      setIsMobileOpen(false); // Close sidebar on mobile after creating new chat
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
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button - updated colors */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-20 right-4 z-50 p-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors shadow-lg"
      >
        <MdMenu className="w-6 h-6" />
      </button>

      {/* Sidebar - updated background color */}
      <div
        className={`fixed md:static top-16 left-0 h-[calc(100vh-64px)] bg-gray-100 w-64 transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="h-full flex flex-col p-4">
          <button
            onClick={createNewConversation}
            className="flex items-center justify-center gap-2 w-full bg-red-500 text-white hover:bg-red-600 rounded-lg p-3 mb-4 transition-colors shadow-md"
          >
            <MdAdd className="w-5 h-5" />
            New Chat
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleConversationSelect(conv.id)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConvoId === conv.id
                    ? "bg-gray-300"
                    : "hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MdChat className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{conv.title || conv.id}</span>
                </div>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className="p-1 hover:bg-red-200 rounded transition-colors"
                >
                  <MdDelete className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-20 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
