import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { getToken } = useAuth();

  // Retrieve selectedConvoId from localStorage or set to null
  const [selectedConvoId, setSelectedConvoId] = useState(() => {
    const storedId = localStorage.getItem("selectedConvoId");
    return storedId && storedId !== "undefined" ? JSON.parse(storedId) : null;
  });

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Save selected conversation ID to localStorage when it changes
    if (selectedConvoId !== null) {
      localStorage.setItem("selectedConvoId", JSON.stringify(selectedConvoId));
    }

    // Load conversations when the component mounts
    loadConversations();
  }, [selectedConvoId]);

  const loadConversations = async () => {
    try {
      if (!getToken) return; // Skip if auth is not ready

      const token = await getToken();
      if (!token) return;

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
    loadConversations,
    getToken,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
