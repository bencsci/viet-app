import React, { useState, useEffect, useContext } from "react";
import { MdAdd, MdDelete, MdEdit, MdMoreVert, MdClose } from "react-icons/md";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { UserContext } from "../context/userContext";
import { useNavigate, useParams } from "react-router";
import { useChat } from "../hooks/useChat";
import SmModal from "./modals/SmModal";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const {
    setPrevConvoId,
    conversations,
    loadConversations,
    setIsNewConversation,
  } = useContext(UserContext);
  const { convoId } = useParams();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [conversationToRename, setConversationToRename] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const { createConversation, deleteConversation, renameConversation } =
    useChat(setPrevConvoId, setIsNewConversation, null);
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
    await createConversation();
    loadConversations();
    setIsSidebarOpen(false);
  };

  const handleDeleteConversation = async (id, e) => {
    console.log("Deleting conversation:", id);
    e.stopPropagation();
    setActiveMenu(null);

    await deleteConversation(id);
    loadConversations();
    if (convoId === id) {
      navigate("/");
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

    await renameConversation(conversationToRename, newTitle);
    setRenameModalOpen(false);
    setConversationToRename(null);
    setNewTitle("");
    loadConversations();
  };

  const handleConversationSelect = (convoId) => {
    setIsNewConversation(false);
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
          <div className="bg-[#47A1BE] text-white p-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hover:bg-[#3E89A3] p-1 rounded transition-colors"
            >
              <AiOutlineMenuUnfold size={20} />
            </button>
          </div>

          <div className="px-4 py-3 border-b border-gray-200">
            <button
              onClick={createNewConversation}
              className="flex items-center justify-center gap-2 w-full bg-[#47A1BE] text-white hover:bg-[#3E89A3] rounded-lg p-3 transition-colors shadow-sm font-medium"
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
                className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                  convoId === conv.id.toString()
                    ? "bg-[#D2E8EF] text-[#327085]"
                    : "hover:bg-gray-300 text-gray-700"
                }`}
                title={conv.title || "New Conversation"}
              >
                <div className="flex items-center gap-3 truncate max-w-[80%]">
                  <span className="truncate font-medium text-sm">
                    {conv.title || "New Conversation"}
                  </span>
                </div>

                <div className="relative">
                  <button
                    data-menu-button={conv.id}
                    onClick={(e) => toggleMenu(conv.id, e)}
                    className={`p-2 rounded-lg ${
                      convoId === conv.id.toString()
                        ? "hover:bg-[#95C9DA] text-[#489DBA]"
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
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
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

          <div className="p-6 border-t border-gray-200 h-[4.7rem]">
            <div className="text-xs text-gray-500 text-center">
              Select words to translate them
            </div>
          </div>
        </div>
      </div>

      {/* Rename Modal */}
      {renameModalOpen && (
        <SmModal
          modalName="Rename Conversation"
          valName="New Title"
          value={newTitle}
          handleSubmit={handleRenameSubmit}
          onClose={() => setRenameModalOpen(false)}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder=""
          submitButtonText="Save"
        />
      )}
    </>
  );
};

export default Sidebar;
