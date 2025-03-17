import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { getToken } = useAuth();

  const [prevConvoId, setPrevConvoId] = useState();
  const [conversations, setConversations] = useState([]);
  const [reviewMode, setReviewMode] = useState("srs");

  useEffect(() => {
    // Load conversations when the component mounts
    loadConversations();
  }, [prevConvoId]);

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
    prevConvoId,
    setPrevConvoId,
    backendUrl,
    conversations,
    setConversations,
    loadConversations,
    getToken,
    reviewMode,
    setReviewMode,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
