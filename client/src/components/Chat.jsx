import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { AiOutlineMenuFold } from "react-icons/ai";
import { UserContext } from "../context/userContext";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import ChatBubble from "./ChatBubble";
import FlashcardModal from "./modals/FlashcardModal";

const Chat = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { getToken } = useAuth();
  const {
    conversations,
    setPrevConvoId,
    backendUrl,
    isNewConversation,
    setIsNewConversation,
    listDecks,
  } = useContext(UserContext);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [titleGenerated, setTitleGenerated] = useState(false);
  const navigate = useNavigate();
  const { convoId } = useParams();
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [flashcardModalData, setFlashcardModalData] = useState({
    front: "",
    back: "",
  });
  const [isAudioPlayingGlobally, setIsAudioPlayingGlobally] = useState(false);

  const loadMessages = useCallback(
    async (currentConvoId) => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const res = await axios.post(
          `${backendUrl}/api/history/get`,
          { convoId: currentConvoId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data && res.data.messages) {
          setMessages(res.data.messages);
          const convo = conversations.find(
            (c) => c.id.toString() === currentConvoId.toString()
          );
          if (convo && convo.title) {
            setTitleGenerated(true);
          } else {
            setTitleGenerated(false);
          }
        } else {
          setMessages([]);
          setTitleGenerated(false);
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
        toast.error("Failed to load conversation.");
        setMessages([]);
        setTitleGenerated(false);
        setPrevConvoId(null);
        navigate("/404-not-found");
      } finally {
        setIsLoading(false);
      }
    },
    [getToken, backendUrl, conversations, navigate]
  );

  useEffect(() => {
    if (convoId) {
      loadMessages(convoId);
      setPrevConvoId(convoId);
      setIsNewConversation(false);
    } else {
      setIsLoading(false);
      setMessages([]);
      setIsNewConversation(true);
      setTitleGenerated(false);
    }
  }, [convoId]);

  useEffect(() => {
    if (!isLoading) {
      if (convoId) {
        const convo = conversations.find(
          (c) => c.id.toString() === convoId.toString()
        );

        if (convo) {
          if (convo.title) {
            setTitleGenerated(true);
          } else {
            setTitleGenerated(false);
          }

          if (
            messages.length === 4 &&
            convoId &&
            !convo.title &&
            !titleGenerated
          ) {
            console.log("Generating title...");
            generateTitle(messages, convoId);
          }
        }
      }
    }

    if (!convoId) {
      setIsNewConversation(true);
    } else {
      setIsNewConversation(false);
    }
  }, [messages]);

  const generateTitle = useCallback(
    async (currentMessages, currentConvoId) => {
      if (!currentMessages || currentMessages.length < 2 || !currentConvoId)
        return;
      try {
        const token = await getToken();
        await axios.post(
          `${backendUrl}/api/history/generate-title`,
          { messages: currentMessages, convoId: currentConvoId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Title generation request sent for:", currentConvoId);
        listDecks();
      } catch (error) {
        console.error("Error generating title:", error);
        setTitleGenerated(false);
      }
    },
    [getToken, backendUrl, listDecks]
  );

  const sendMessageToOpenAI = useCallback(
    async (messagesToSend) => {
      setIsTyping(true);
      let newConvoId = convoId;
      try {
        const token = await getToken();
        
        // Create a new converstion, if new
        if (!convoId && messagesToSend.length > 0) {
          const createRes = await axios.post(
            `${backendUrl}/api/history/save`,
            { messages: [messagesToSend[0]] },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (createRes.data && createRes.data.id) {
            newConvoId = createRes.data.id;
            navigate(`/c/${newConvoId}`, { replace: true });
            setIsNewConversation(false);
            setPrevConvoId(newConvoId);
            listDecks();
          } else {
            throw new Error("Failed to create conversation.");
          }
        }
        
        // Send message
        const chatRes = await axios.post(
          `${backendUrl}/api/chat/send`,
          { messages: messagesToSend, convoId: newConvoId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: chatRes.data.reply },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message. Please try again.");
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsTyping(false);
      }
    },
    [
      convoId,
      getToken,
      backendUrl,
      navigate,
      setIsNewConversation,
      setPrevConvoId,
      listDecks,
    ]
  );

  const updateDatabase = useCallback(
    async (currentMessages, currentConvoId) => {
      if (updateDatabase.timeoutId) {
        clearTimeout(updateDatabase.timeoutId);
      }
      updateDatabase.timeoutId = setTimeout(async () => {
        try {
          const token = await getToken();
          await axios.post(
            `${backendUrl}/api/history/update`,
            { messages: currentMessages, convoId: currentConvoId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error("Error updating conversation in DB:", error);
        }
      }, 1500);
    },
    [getToken, backendUrl]
  );

  const translateText = useCallback(
    async (text) => {
      if (!text) return null;
      try {
        const token = await getToken();
        const res = await axios.post(
          `${backendUrl}/api/chat/translate`,
          { words: text },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data.translation;
      } catch (error) {
        console.error("Translation API error:", error);
        toast.error("Translation failed.");
        throw error;
      }
    },
    [getToken, backendUrl]
  );

  const playAudio = useCallback(
    async (text) => {
      if (!text || isAudioPlayingGlobally) {
        console.log("playAudio blocked:", {
          textExists: !!text,
          isAudioPlayingGlobally,
        });
        return;
      }

      setIsAudioPlayingGlobally(true);
      let audioUrl = null;

      try {
        const token = await getToken();
        console.log("Requesting TTS blob from backend...");
        const response = await axios.post(
          `${backendUrl}/api/chat/tts`,
          { text },
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );

        console.log(
          "Received TTS blob, type:",
          response.data.type,
          "size:",
          response.data.size
        );
        const audioBlob = new Blob([response.data], { type: "audio/mp3" });
        audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        console.log("Attempting to play audio...");
        await audio.play();

        audio.onended = () => {
          console.log("Audio playback finished.");
          URL.revokeObjectURL(audioUrl);
          setIsAudioPlayingGlobally(false);
        };

        audio.onerror = (err) => {
          console.error("Audio element error:", err);
          if (audioUrl) URL.revokeObjectURL(audioUrl);
          setIsAudioPlayingGlobally(false);
          toast.error("Error playing audio.");
        };
      } catch (error) {
        console.error("TTS Error in playAudio:", error);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setIsAudioPlayingGlobally(false);
        toast.error("Failed to fetch audio.");
        throw error;
      }
    },
    [getToken, backendUrl, isAudioPlayingGlobally]
  );

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

    sendMessageToOpenAI([...messages, newMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (conversations) {
      if (convoId && messages.length > 0) {
        updateDatabase(messages, convoId);
      }
    }
  }, [messages]);

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
