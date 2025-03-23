import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {
  MdAdd,
  MdChat,
  MdDelete,
  MdEdit,
  MdMoreVert,
  MdClose,
} from "react-icons/md";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { UserContext } from "../context/userContext";
import { useNavigate, useParams } from "react-router";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const {
    setPrevConvoId,
    conversations,
    setConversations,
    loadConversations,
    backendUrl,
    language,
    isOnboarding,
  } = useContext(UserContext);
  const { convoId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [activeMenu, setActiveMenu] = useState(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [conversationToRename, setConversationToRename] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    loadConversations();

    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      // Only close if clicking outside any menu button or menu
      const isMenuButton = event.target.closest("[data-menu-button]");
      const isMenuContent = event.target.closest("[data-menu-content]");

      if (!isMenuButton && !isMenuContent) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const createNewConversation = async () => {
    try {
      const token = await getToken();
      const res = await axios.post(
        `${backendUrl}/api/history/save`,
        { messages: [] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/c/${res.data.id}`);
      setPrevConvoId(res.data.id);
      loadConversations();
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const deleteConversation = async (id, e) => {
    console.log("Deleting conversation:", id);
    e.stopPropagation();
    setActiveMenu(null);

    if (convoId.toString() === id.toString()) {
      // First delete the conversation
      try {
        const token = await getToken();
        await axios.post(
          `${backendUrl}/api/history/delete`,
          { convoId: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Then navigate to home and reset
        navigate("/");
        loadConversations();
      } catch (error) {
        console.error("Error deleting conversation:", error);
      }
    } else {
      // If not the current conversation, just delete normally
      try {
        const token = await getToken();
        await axios.post(
          `${backendUrl}/api/history/delete`,
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
    }
  };

  const openRenameModal = (id, e) => {
    e.stopPropagation();
    setActiveMenu(null);

    // Find the conversation to get its current title
    const conversation = conversations.find((c) => c.id === id);
    if (conversation) {
      setConversationToRename(id);
      setNewTitle(conversation.title || "");
      setRenameModalOpen(true);
    }
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();

    if (!newTitle.trim() || !conversationToRename) {
      return;
    }

    // try {
    //   const token = await getToken();
    //   const res = await axios.post(
    //     `${BACKEND_URL}/api/history/save`,
    //     { messages: [] },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
    //   setSelectedConvoId(res.data.id);
    //   loadConversations();
    //   setIsSidebarOpen(false); // Close sidebar on mobile after creating new chat
    // } catch (error) {
    //   console.error("Error creating conversation:", error);
    // }

    try {
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/history/update-title`,
        { title: newTitle, convoId: conversationToRename },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Close modal and reset state
      setRenameModalOpen(false);
      setConversationToRename(null);
      setNewTitle("");

      // Reload conversations to show the updated title
      loadConversations();
    } catch (error) {
      console.error("Error renaming conversation:", error);
    }
  };

  const handleConversationSelect = (convoId) => {
    navigate(`/c/${convoId}`);
    //setSelectedConvoId(convoId);
    setPrevConvoId(convoId);
    setIsSidebarOpen(false);
  };

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <>
      <div
        className={`fixed md:static top-16 left-0 h-[calc(100vh-64px)] bg-gray-100 overflow-hidden transition-all duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "w-72" : "w-0"
        }`}
      >
        <div className="h-full flex flex-col w-72">
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
                  convoId === conv.id.toString()
                    ? "bg-red-100 text-red-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                title={conv.title || "New Conversation"}
              >
                <div className="flex items-center gap-3 truncate max-w-[80%]">
                  <div
                    className={`p-2 rounded-lg ${
                      convoId === conv.id.toString()
                        ? "bg-red-200"
                        : "bg-gray-200 group-hover:bg-gray-300"
                    }`}
                  >
                    <MdChat className="w-4 h-4" />
                  </div>
                  <span className="truncate font-medium text-sm">
                    {conv.title || "New Conversation"}
                  </span>
                </div>

                {/* More options button and menu */}
                <div className="relative">
                  <button
                    data-menu-button={conv.id}
                    onClick={(e) => toggleMenu(conv.id, e)}
                    className={`p-2 rounded-lg ${
                      convoId === conv.id.toString()
                        ? "hover:bg-red-200 text-red-600"
                        : "hover:bg-gray-200 text-gray-500"
                    }`}
                  >
                    <MdMoreVert className="w-4 h-4" />
                  </button>

                  {/* Dropdown menu */}
                  {activeMenu === conv.id && (
                    <div
                      data-menu-content={conv.id}
                      className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => openRenameModal(conv.id, e)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <MdEdit className="mr-2" /> Rename
                      </button>
                      <button
                        onClick={(e) => deleteConversation(conv.id, e)}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <MdDelete className="mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </div>
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

      {/* Rename Modal */}
      {renameModalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium">Rename Conversation</h3>
              <button
                onClick={() => setRenameModalOpen(false)}
                className="p-1 hover:bg-red-600 rounded transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRenameSubmit} className="p-4">
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter a new title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRenameModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
