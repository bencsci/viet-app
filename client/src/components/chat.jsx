import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {
  MdTranslate,
  MdClear,
  MdAdd,
  MdRestartAlt,
  MdVolumeUp,
} from "react-icons/md";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { UserContext } from "../context/userContext";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";

const Chat = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { getToken } = useAuth();
  const { conversations, setPrevConvoId, backendUrl } = useContext(UserContext);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageStates, setMessageStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [titleGenerated, setTitleGenerated] = useState(false);
  const navigate = useNavigate();
  const { convoId } = useParams();
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState({});
  const [flashcardFront, setFlashcardFront] = useState("");
  const [flashcardBack, setFlashcardBack] = useState("");
  const [currentTranslation, setCurrentTranslation] = useState("");
  const [isLoadingDecks, setIsLoadingDecks] = useState(false);
  const [showNewDeckForm, setShowNewDeckForm] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [messageToPlay, setMessageToPlay] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isNewConversation, setIsNewConversation] = useState(false);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const res = await axios.post(
        `${backendUrl}/api/history/get`,
        { convoId: convoId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data && res.data.messages) {
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      setPrevConvoId(null);
      navigate("/404-not-found");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (convoId) {
      loadMessages();
      setPrevConvoId(convoId);
    } else {
      setIsLoading(false);
      setMessages([]);
    }

    if (!convoId) {
      setIsNewConversation(true);
    } else {
      setIsNewConversation(false);
    }

    console.log("isNewConversation", isNewConversation);
  }, [convoId]);

  useEffect(() => {
    if (!isLoading) {
      if (convoId) {
        const convo = conversations.find(
          (c) => c.id.toString() === convoId.toString()
        );

        if (convo) {
          // console.log("message.length", messages.length === 4);
          // console.log("convoId", convoId !== null);
          // console.log("conversations", !convo?.title);
          // console.log("convo", convo?.title);
          // console.log("titleGenerated", !titleGenerated);

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
            //setTitleGenerated(true);
            generateTitle();
          }
        }
      }
    }
  }, [messages]);

  const generateTitle = async () => {
    try {
      const token = await getToken();
      const res = await axios.post(
        `${backendUrl}/api/history/generate-title`,
        {
          messages: messages,
          convoId: convoId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Title generated successfully:", res.data);
    } catch (error) {
      console.error("Error generating title for conversation:", error);
      //setTitleGenerated(false);
    }
  };

  async function sendMessageToOpenAI(messages) {
    try {
      const token = await getToken();
      const res = await axios.post(
        `${backendUrl}/api/chat/send`,
        { messages },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedMessages = [
        ...messages,
        { role: "assistant", content: res.data.reply },
      ];
      setMessages(updatedMessages);

      // Saves user conversation if there are no other conversations
      if (!convoId) {
        createNewConversation(updatedMessages);
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error);
      alert("Something went wrong. Please try again later!");
      setMessages(messages);
    } finally {
      setIsTyping(false);
    }
  }

  const createNewConversation = async (messageToSave) => {
    try {
      const token = await getToken();
      const res = await axios.post(
        `${backendUrl}/api/history/save`,
        { messages: messageToSave },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Set the new conversation ID as the selected conversation
      // if (res.data && res.data.convoId) {
      //   setconvoId(res.data.convoId);
      // }
      navigate(`/c/${res.data.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  async function translateWords(words) {
    try {
      const token = await getToken();
      const res = await axios.post(
        `${backendUrl}/api/chat/translate`,
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

      // Set the flashcard front to the selected words
      if (orderedWords.length > 0) {
        setFlashcardFront(orderedWords.join(" "));

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
      } else {
        // Clear flashcard front if no words are selected
        setFlashcardFront("");
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

    console.log("Translating content:", content);
    setMessageToPlay(content);
    const translation = await translateWords(content);

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

  const updateDatabase = async () => {
    try {
      // Double check to prevent empty messages from being saved
      if (!convoId || messages.length === 0) return;

      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/history/update`,
        {
          messages,
          convoId: convoId,
        },
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

  useEffect(() => {
    if (conversations) {
      // Only update if we have both convoId and messages
      if (convoId && messages.length > 0) {
        updateDatabase();
      }
    }
  }, [messages]);

  const fetchDecks = async () => {
    try {
      setIsLoadingDecks(true);
      const token = await getToken();
      const res = await axios.get(`${backendUrl}/api/decks/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDecks(res.data);
    } catch (error) {
      console.error("Error fetching decks:", error);
    } finally {
      setIsLoadingDecks(false);
    }
  };

  const handleAddToFlashcards = (translation, index) => {
    setCurrentTranslation(translation);

    // Get the selected words from the message state
    if (messageStates[index]?.selectedWords) {
      const orderedWords = Array.from(
        messageStates[index].selectedWords.values()
      )
        .sort((a, b) => a.position - b.position)
        .map((item) => item.word)
        .join(" ");

      // If there are selected words, use them for the front
      if (orderedWords) {
        setFlashcardFront(orderedWords);
      }
    }

    setFlashcardBack(translation);
    setShowFlashcardModal(true);
    fetchDecks();
  };

  const createNewDeck = async () => {
    if (!newDeckTitle.trim()) return;

    try {
      const token = await getToken();
      const res = await axios.post(
        `${backendUrl}/api/decks/create`,
        { deckName: newDeckTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDecks();
      setDecks([...decks, res.data]);
      setSelectedDeck(res.data);
      setShowNewDeckForm(false);
      setNewDeckTitle("");
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  };

  const updateCardCount = async () => {
    try {
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/decks/edit`,
        { deckId: selectedDeck.id, card_count: selectedDeck.card_count + 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadDeck();
    } catch (error) {
      console.error("Error updating card count in deck:", error);
    }
  };

  const addFlashcard = async () => {
    try {
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/decks/add-flashcard`,
        {
          deckId: selectedDeck.id,
          front: flashcardFront,
          back: flashcardBack,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowFlashcardModal(false);
      setFlashcardFront("");
      setFlashcardBack("");
      setSelectedDeck({});
      updateCardCount();

      toast.success(`Flashcard successfully added to ${selectedDeck.title}!`);
    } catch (error) {
      console.error("Error adding flashcard:", error);
    }
  };

  const playAudio = async (text) => {
    try {
      if (isPlayingAudio) return;
      setIsPlayingAudio(true);

      const token = await getToken();
      const response = await axios.post(
        `${backendUrl}/api/chat/tts`,
        {
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const audioBlob = new Blob([response.data], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setIsPlayingAudio(false);
      };

      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      toast.error("Failed to play audio");
      setIsPlayingAudio(false);
    }
  };

  return (
    <div
      className={`flex flex-col h-[calc(100vh-64px)] bg-white transition-all duration-300 ease-in-out`}
    >
      <div className="bg-red-500 text-white p-4 flex items-center gap-2 sticky top-0 z-10">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="hover:bg-red-600 p-1 rounded transition-colors"
          >
            <AiOutlineMenuFold size={20} />
          </button>
        )}
        <h1 className="text-xl font-bold truncate">
          Chat with a Vietnamese Friend {Object.keys(messages).length}
        </h1>
      </div>

      {isLoading ? (
        isNewConversation ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* User message placeholder */}
            <div className="flex justify-end lg:px-5">
              <div className="relative group max-w-[70%] rounded-2xl px-4 py-2 bg-red-600 text-white rounded-br-none">
                <div>{messages[0]?.content ? messages[0]?.content : "..."}</div>
              </div>
            </div>

            {/* Assistant message placeholder */}
            <div className="flex justify-start lg:px-5">
              <div className="relative group max-w-[70%] rounded-2xl px-4 py-2 bg-gray-300 text-black rounded-bl-none">
                <div>{messages[1]?.content ? messages[1]?.content : "..."}</div>
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
                  } lg:px-5`}
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
                      <div>{messageStates[index]?.translation}</div>
                    )}
                    <div className="mt-2 pt-2 border-t border-gray-400/30 flex space-x-2">
                      <button
                        className={`p-1.5 ${
                          isPlayingAudio
                            ? "bg-blue-200 animate-pulse cursor-not-allowed"
                            : "bg-blue-100 hover:bg-blue-200"
                        } rounded-full text-blue-600 transition-colors`}
                        title={
                          isPlayingAudio ? "Playing audio..." : "Play audio"
                        }
                        onClick={() => {
                          if (isPlayingAudio) return;
                          if (messageToPlay) {
                            playAudio(messageToPlay);
                            setMessageToPlay(null);
                          } else {
                            playAudio(
                              Array.from(
                                messageStates[index].selectedWords.values()
                              )
                                .sort((a, b) => a.position - b.position)
                                .map((item) => item.word)
                                .join(" ")
                            );
                          }
                        }}
                        disabled={isPlayingAudio}
                      >
                        <MdVolumeUp
                          className={`w-3.5 h-3.5 ${
                            isPlayingAudio ? "opacity-75" : ""
                          }`}
                        />
                      </button>
                      <button
                        className="p-1.5 bg-green-100 hover:bg-green-200 rounded-full text-green-600 transition-colors"
                        title="Add to flashcards"
                        onClick={() =>
                          handleAddToFlashcards(
                            messageStates[index]?.translation,
                            index
                          )
                        }
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
                } lg:px-5`}
              >
                <div
                  className={`relative group max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-red-600 text-white rounded-br-none"
                      : "bg-gray-300 text-black rounded-bl-none"
                  }`}
                >
                  <div>
                    {message.role === "user"
                      ? message.content
                      : message.content.split(" ").map((word, wordIndex) => (
                          <span
                            key={wordIndex}
                            onClick={() => {
                              handleWordTranslation(
                                word,
                                index,
                                message.content,
                                wordIndex
                              );
                            }}
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

      {/* Flashcard Modal */}
      {showFlashcardModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">Add to Flashcards</h2>
              <button
                onClick={() => {
                  setShowFlashcardModal(false);
                  setShowNewDeckForm(false);
                  setNewDeckTitle("");
                }}
                className="p-1 hover:bg-red-600 rounded-full transition-colors"
              >
                <MdClear className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Deck
                </label>
                {isLoadingDecks ? (
                  <div className="flex justify-center py-2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    {showNewDeckForm ? (
                      <div className="mb-3">
                        <div className="flex flex-col sm:flex-row gap-2 mb-2">
                          <input
                            type="text"
                            value={newDeckTitle}
                            onChange={(e) => setNewDeckTitle(e.target.value)}
                            placeholder="Enter deck title"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                          />
                          <button
                            onClick={createNewDeck}
                            disabled={!newDeckTitle.trim()}
                            className={`px-3 py-2 rounded-md text-white text-sm ${
                              !newDeckTitle.trim()
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600"
                            }`}
                          >
                            Create
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setShowNewDeckForm(false);
                            setNewDeckTitle("");
                          }}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <select
                          value={selectedDeck.id || ""}
                          onChange={(e) => {
                            const selected = decks.find(
                              (deck) => deck.id === e.target.value
                            );
                            setSelectedDeck(selected || {});
                          }}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
                        >
                          <option value="">Select a deck</option>
                          {decks.map((deck) => (
                            <option key={deck.id} value={deck.id}>
                              {deck.title}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setShowNewDeckForm(true)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          + Create new deck
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Front (Translation)
                </label>
                <textarea
                  value={flashcardFront}
                  onChange={(e) => setFlashcardFront(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Back (Original Text)
                </label>
                <textarea
                  value={flashcardBack}
                  onChange={(e) => setFlashcardBack(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="2"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  onClick={() => {
                    setShowFlashcardModal(false);
                    setShowNewDeckForm(false);
                    setNewDeckTitle("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={addFlashcard}
                  disabled={
                    !selectedDeck.id || !flashcardFront || !flashcardBack
                  }
                  className={`px-4 py-2 rounded-md text-white w-full sm:w-auto ${
                    !selectedDeck.id || !flashcardFront || !flashcardBack
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  Add to Deck
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
