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
  const [language, setLanguage] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [profile, setProfile] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    loadConversations();
  }, [prevConvoId]);

  const loadProfile = async () => {
    try {
      if (!getToken) return; // Skip if auth is not ready

      const token = await getToken();
      if (!token) return;

      const res = await axios.get(`${backendUrl}/api/profile/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profileData = res.data[0];
      setProfile(profileData);
      setLanguage(profileData.language);
      setDifficulty(profileData.language_level);
      //console.log("Profile loaded:", profileData);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

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
    language,
    setLanguage,
    difficulty,
    setDifficulty,
    profile,
    loadProfile,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
