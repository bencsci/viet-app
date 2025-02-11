import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { MdTranslate, MdClear, MdAdd, MdRestartAlt } from "react-icons/md";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Chat = () => {
  const { getToken } = useAuth();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageStates, setMessageStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${BACKEND_URL}/api/history/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data && res.data.messages) {
          setMessages(res.data.messages);
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, []);

  async function sendMessageToOpenAI(messages) {
    try {
      const token = await getToken();
      const res = await axios.post(
        `${BACKEND_URL}/api/chat/send`,
        { messages },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages([
        ...messages,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (error) {
      console.error("Error details:", error.response?.data || error);
      alert("Something went wrong. Please try again later!");
      setMessages(messages); // Keep existing messages on error
    } finally {
      setIsTyping(false);
    }
  }

  async function translateWords(words) {
    try {
      const token = await getToken();
      const res = await axios.post(
        `${BACKEND_URL}/api/chat/translate`,
        {
          words: typeof words === "string" ? words : words.join(" "),
          context: messages.slice(-1)[0]?.content || "", // Get the last message content
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.translation;
    } catch (error) {
      console.error("Error details:", error.response?.data || error);
      alert("Something went wrong with translation!");
      return null;
    }
  }

  const handleWordTranslation = async (
    word,
    messageIndex,
    content,
    wordPosition
  ) => {
    setMessageStates((prev) => {
      const currentState = prev[messageIndex] || { selectedWords: new Map() };
      const newSelectedWords = new Map(currentState.selectedWords);

      const key = `${word}-${wordPosition}`;
      if (newSelectedWords.has(key)) {
        newSelectedWords.delete(key);
      } else {
        newSelectedWords.set(key, { word, position: wordPosition });
      }

      // Get words in original sentence order
      const orderedWords = Array.from(newSelectedWords.values())
        .sort((a, b) => a.position - b.position)
        .map((item) => item.word);

      if (orderedWords.length > 0) {
        // Set loading state before translation
        setMessageStates((current) => ({
          ...current,
          [messageIndex]: {
            selectedWords: newSelectedWords,
            isLoading: true,
            type: "words",
          },
        }));

        // Perform translation and update state when it completes
        translateWords(orderedWords.join(" "), getToken).then((translation) => {
          setMessageStates((current) => ({
            ...current,
            [messageIndex]: {
              selectedWords: newSelectedWords,
              translation: translation,
              isLoading: false,
              type: "words",
            },
          }));
        });
      }

      return {
        ...prev,
        [messageIndex]: {
          selectedWords: newSelectedWords,
          type: "words",
        },
      };
    });
  };

  const handleBubbleTranslation = async (content, messageIndex) => {
    setMessageStates((prev) => ({
      ...prev,
      [messageIndex]: {
        selectedWords: new Map(),
        isLoading: true,
        type: "full",
      },
    }));

    const translation = await translateWords(content, getToken);

    setMessageStates((prev) => ({
      ...prev,
      [messageIndex]: {
        selectedWords: new Map(),
        translation: translation,
        isLoading: false,
        type: "full",
      },
    }));
  };

  const clearTranslation = (messageIndex) => {
    setMessageStates((prev) => {
      const newState = { ...prev };
      delete newState[messageIndex];
      return newState;
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    console.log("Messages:", messages);

    sendMessageToOpenAI([...messages, newMessage]);

    setInputMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    console.log(messageStates);
  }, [messageStates]);

  useEffect(() => {
    const updateDatabase = async () => {
      if (messages.length === 0) return;

      try {
        const token = await getToken();
        await axios.post(
          `${BACKEND_URL}/api/history/update`,
          { messages },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error updating conversation:", error);
      }
    };

    updateDatabase();
  }, [messages]);

  const handleSaveConversation = async () => {
    try {
      const token = await getToken();
      await axios.post(
        `${BACKEND_URL}/api/history/save`,
        { messages },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Conversation saved successfully!");
    } catch (error) {
      console.error("Error saving conversation:", error);
      alert("Failed to save conversation");
    }
  };

  const handleDeleteConversation = async () => {
    try {
      const token = await getToken();
      await axios.delete(`${BACKEND_URL}/api/history/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages([]); // Clear messages locally
      alert("Conversation deleted successfully!");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      alert("Failed to delete conversation");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="bg-red-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat with Vietnamese Friend</h1>
        {messages.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleDeleteConversation}
              className="bg-white text-red-500 px-4 py-1 rounded-full hover:bg-red-50 transition-colors flex items-center gap-1"
              title="Delete conversation"
            >
              <MdRestartAlt className="w-5 h-5" />
              Reset
            </button>
            <button
              onClick={handleSaveConversation}
              className="bg-white text-red-500 px-4 py-1 rounded-full hover:bg-red-50 transition-colors"
            >
              Save Chat
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              Hello! Start a conversation! 👋
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className="space-y-2">
              {(messageStates[index]?.translation ||
                messageStates[index]?.isLoading) && (
                <div
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="bg-white shadow-md border border-gray-100 rounded-lg px-4 py-2 text-sm text-gray-600 max-w-[70%]">
                    <div className="text-xs text-gray-400 mb-1">
                      Translation:
                    </div>
                    {messageStates[index]?.isLoading ? (
                      <div className="flex justify-center py-2">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div>{messageStates[index].translation}</div>
                    )}
                    <div className="mt-2 pt-2 border-t border-gray-400/30 flex space-x-2">
                      <button
                        className="p-1.5 bg-green-100 hover:bg-green-200 rounded-full text-green-600 transition-colors"
                        title="Add to flashcards"
                      >
                        <MdAdd className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => clearTranslation(index)}
                        className="p-1.5 bg-red-100 hover:bg-red-200 rounded-full text-red-500 transition-colors"
                        title="Clear translation"
                      >
                        <MdClear className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`relative group max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-red-500 text-white rounded-br-none"
                      : "bg-gray-300 text-black rounded-bl-none"
                  }`}
                >
                  <div>
                    {message.role === "user"
                      ? message.content
                      : message.content.split(" ").map((word, wordIndex) => (
                          <span
                            key={wordIndex}
                            onClick={() =>
                              handleWordTranslation(
                                word,
                                index,
                                message.content,
                                wordIndex
                              )
                            }
                            className={`cursor-pointer transition-colors duration-200 ${
                              messageStates[index]?.selectedWords?.has(
                                `${word}-${wordIndex}`
                              )
                                ? "text-red-600"
                                : "hover:text-red-300"
                            }`}
                          >
                            {word}{" "}
                          </span>
                        ))}
                  </div>

                  {message.role === "assistant" &&
                    messageStates[index]?.selectedWords?.size > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-400/30 flex space-x-2">
                        <button
                          onClick={() =>
                            handleBubbleTranslation(message.content, index)
                          }
                          className="p-1 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors text-blue-600"
                          title="Translate message"
                        >
                          <MdTranslate className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-300 text-black rounded-2xl rounded-bl-none px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 p-4 bg-white"
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            className="bg-red-500 text-white rounded-full px-6 py-2 hover:bg-red-600 focus:outline-none"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
