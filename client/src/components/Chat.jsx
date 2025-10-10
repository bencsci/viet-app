import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { AiOutlineMenuFold } from "react-icons/ai";
import { UserContext } from "../context/userContext";
import { useParams } from "react-router";
import ChatBubble from "./ChatBubble";
import FlashcardModal from "./modals/FlashcardModal";
import { useChat } from "../hooks/useChat";

const Chat = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const {
    conversations,
    setPrevConvoId,
    isNewConversation,
    setIsNewConversation,
    listDecks,
  } = useContext(UserContext);

  const messagesEndRef = useRef(null);
  const { convoId } = useParams();
  const [inputMessage, setInputMessage] = useState("");
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [flashcardModalData, setFlashcardModalData] = useState({
    front: "",
    back: "",
  });

  const {
    messages,
    setMessages,
    isTyping,
    isLoading,
    setIsLoading,
    loadMessages,
    sendMessage,
    translateText,
    playAudio,
  } = useChat(setPrevConvoId, setIsNewConversation, listDecks);

  useEffect(() => {
    if (convoId) {
      // setMessages([]);
      // setIsLoading(true);
      loadMessages(convoId);
      setPrevConvoId(convoId);
      setIsNewConversation(false);
    } else {
      setIsLoading(false);
      setMessages([]);
      setIsNewConversation(true);
    }
  }, [
    convoId,
    loadMessages,
    setPrevConvoId,
    setIsNewConversation,
    setMessages,
    setIsLoading,
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleShowFlashcardModal = useCallback((front, back) => {
    setFlashcardModalData({ front, back });
    setIsFlashcardModalOpen(true);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const newMessage = { role: "user", content: inputMessage.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    sendMessage([...messages, newMessage], convoId);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 transition-all duration-300 ease-in-out">
      <div className="bg-[#47A1BE] text-white p-4 flex items-center gap-2 sticky top-0 z-20 shadow-sm flex-shrink-0">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="hover:bg-[#3E89A3] p-1 rounded transition-colors"
            aria-label="Open sidebar"
          >
            <AiOutlineMenuFold size={22} />
          </button>
        )}
        <h1 className="text-xl font-bold truncate">
          {isNewConversation
            ? "New Chat"
            : conversations.find((c) => c.id.toString() === convoId?.toString())
                ?.title || "Chat"}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          isNewConversation ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-end lg:px-5">
                <div className="relative group max-w-[70%] rounded-2xl px-4 py-2 bg-[#3E89A3] text-white rounded-br-none">
                  <div>{messages[0]?.content ? messages[0]?.content : ""}</div>
                </div>
              </div>

              <div className="flex justify-start lg:px-5">
                <div className="relative group max-w-[70%] rounded-2xl px-4 py-2 bg-gray-300 text-black rounded-bl-none">
                  <div>{messages[1]?.content ? messages[1]?.content : ""}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12"></div>
              </div>
            </div>
          )
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-16 px-4">
            <p className="text-lg">Start a new conversation!</p>
            <p className="text-sm mt-1">Ask a question or say hello 👋</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatBubble
              key={index}
              message={message}
              index={index}
              onTranslateText={translateText}
              onPlayAudio={playAudio}
              onShowFlashcardModal={handleShowFlashcardModal}
            />
          ))
        )}

        {isTyping && (
          <div className="flex justify-start lg:px-5">
            <div className="bg-gray-200 text-black rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <div className="flex space-x-1.5 items-center">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 p-4 bg-white sticky bottom-0 flex-shrink-0 z-10"
      >
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Send a message"
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#47A1BE] focus:border-transparent"
            disabled={isTyping || isLoading}
          />
          <button
            type="submit"
            className={`bg-[#489DBA] text-white rounded-full px-6 py-2 hover:bg-[#3E89A3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#489DBA] transition-colors ${
              isTyping || !inputMessage.trim() ? "cursor-not-allowed" : ""
            }`}
            disabled={isTyping || !inputMessage.trim() || isLoading}
          >
            Send
          </button>
        </div>
      </form>

      <FlashcardModal
        isOpen={isFlashcardModalOpen}
        onClose={() => setIsFlashcardModalOpen(false)}
        initialFront={flashcardModalData.front}
        initialBack={flashcardModalData.back}
      />
    </div>
  );
};

export default Chat;
