import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Retrieve selectedConvoId from localStorage or set to null
  const [selectedConvoId, setSelectedConvoId] = useState(() => {
    const storedId = localStorage.getItem("selectedConvoId");
    return storedId && storedId !== "undefined" ? JSON.parse(storedId) : null;
  });

  const [conversations, setConversations] = useState([]);

  useEffect(() => {}, []);

  useEffect(() => {
    // Save selected conversation ID to localStorage when it changes
    if (selectedConvoId !== null) {
      localStorage.setItem("selectedConvoId", JSON.stringify(selectedConvoId));
    }
  }, [selectedConvoId]);

  const loadConversations = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${backendUrl}/api/history/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setConversations(res.data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const contextValue = {
    selectedConvoId,
    setSelectedConvoId,
    backendUrl,
    conversations,
    setConversations,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
