import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { getToken } = useAuth();
  const { user } = useUser();
  const [prevConvoId, setPrevConvoId] = useState();
  const [conversations, setConversations] = useState([]);
  const [reviewMode, setReviewMode] = useState("srs");
  const [language, setLanguage] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [profile, setProfile] = useState({});
  const [isOnboarding, setIsOnboarding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.publicMetadata) {
      setIsOnboarding(!user.publicMetadata.onboardingComplete);
    }
  }, [user]);

  useEffect(() => {
    if (!isOnboarding) {
      loadProfile();
    }
  }, [isOnboarding]);

  useEffect(() => {
    if (!isOnboarding) {
      //console.log("Loading conversations", isOnboarding);
      loadConversations();
    }
  }, [prevConvoId, isOnboarding]);

  const loadProfile = async () => {
    try {
      if (!getToken || isOnboarding) return; // Skip if onboarding or auth not ready

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
      if (!getToken || isOnboarding) return; // Skip if onboarding or auth not ready

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
      navigate("/404-not-found");
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
    isOnboarding,
    setIsOnboarding,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
