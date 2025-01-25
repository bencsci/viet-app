import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

async function sendMessageToOpenAI(messages, callback, getToken, setIsTyping) {
  try {
    const token = await getToken();
    const res = await axios.post(
      "http://localhost:4000/api/chat/send",
      { messages },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    callback([...messages, { role: "assistant", content: res.data.reply }]);
  } catch (error) {
    console.error("Error details:", error.response?.data || error);
    alert("Something went wrong. Please try again later!");
    callback(messages); // Keep existing messages on error
  } finally {
    setIsTyping(false);
  }
}

const Chat = () => {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    console.log("Messages:", messages);

    // Pass getToken and setIsTyping to the function
    sendMessageToOpenAI(
      [...messages, newMessage],
      setMessages,
      getToken,
      setIsTyping
    );

    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="bg-red-500 text-white p-4">
        <h1 className="text-xl font-bold">Chat with Vietnamese Friend</h1>
      </div>

      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            Hello! Start a conversation! 👋
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                message.role === "user"
                  ? "bg-red-500 text-white rounded-br-none"
                  : "bg-gray-300 text-black rounded-bl-none"
              }`}
            >
              {message.content}
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
      </div>

      {/* Message input form */}
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
