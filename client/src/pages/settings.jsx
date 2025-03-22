import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    language,
    setLanguage,
    difficulty,
    setDifficulty,
    getToken,
    backendUrl,
    loadProfile,
    setPrevConvoId,
  } = useContext(UserContext);

  useEffect(() => {
    const init = async () => {
      await loadProfile();
      setIsLoading(false);
    };
    init();
  }, []);

  const languages = [
    { value: "vietnamese", label: "Vietnamese" },
    { value: "french", label: "French" },
    { value: "spanish", label: "Spanish" },
    { value: "portuguese", label: "Portuguese" },
    { value: "italian", label: "Italian" },
  ];

  const difficulties = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const handleLanguageChange = async (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setPrevConvoId(null);

    try {
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/profile/language`,
        {
          language: newLanguage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadProfile();
    } catch (error) {
      console.error("Error updating language:", error);
      setLanguage(language);
    }
  };

  const handleDifficultyChange = async (e) => {
    const newDifficulty = e.target.value;
    setDifficulty(newDifficulty);

    try {
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/profile/difficulty`,
        {
          language_level: newDifficulty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadProfile();
    } catch (error) {
      console.error("Error updating difficulty:", error);
      setDifficulty(difficulty);
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] p-8 mt-14 bg-gray-100 overflow-hidden">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          {!isLoading && (
            <>
              {/* Language Selection */}
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Language
                </label>
                <select
                  id="language"
                  value={language || ""}
                  onChange={handleLanguageChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Selection */}
              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  value={difficulty || ""}
                  onChange={handleDifficultyChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {difficulties.map((diff) => (
                    <option key={diff.value} value={diff.value}>
                      {diff.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
