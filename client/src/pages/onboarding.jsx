import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { UserContext } from "../context/userContext";

const Onboarding = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { backendUrl, setIsOnboarding } = useContext(UserContext);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const languages = [
    {
      code: "english",
      name: "English",
      flag: "https://flagcdn.com/us.svg",
      color: "from-blue-500 to-red-500",
      description: "Learn the global language of business and travel",
    },

    {
      code: "french",
      name: "French",
      flag: "https://flagcdn.com/fr.svg",
      color: "from-blue-500 to-red-500",
      description: "Master the language of love and culture",
    },
    {
      code: "spanish",
      name: "Spanish",
      flag: "https://flagcdn.com/es.svg",
      color: "from-yellow-500 to-red-500",
      description: "Explore one of the world's most spoken languages",
    },
    {
      code: "portuguese",
      name: "Portuguese",
      flag: "https://flagcdn.com/br.svg",
      color: "from-green-500 to-red-500",
      description: "Discover the rich Portuguese language",
    },
    {
      code: "italian",
      name: "Italian",
      flag: "https://flagcdn.com/it.svg",
      color: "from-green-500 to-red-500",
      description: "Learn the language of art and cuisine",
    },
    {
      code: "vietnamese",
      name: "Vietnamese",
      flag: "https://flagcdn.com/vn.svg",
      color: "from-red-500 to-yellow-500",
      description: "Learn the beautiful language of Vietnam",
    },
  ];

  const levels = [
    {
      code: "beginner",
      name: "Beginner",
      icon: "🌱",
      description:
        "Start from scratch. Perfect for those with little prior experience in the language.",
    },
    {
      code: "intermediate",
      name: "Intermediate",
      icon: "🌿",
      description:
        "For those who can handle basic conversations and want to improve further.",
    },
    {
      code: "advanced",
      name: "Advanced",
      icon: "🌳",
      description:
        "For experienced learners looking to master complex topics and fluency.",
    },
  ];

  const handleSubmit = async () => {
    if (!selectedLanguage || !selectedLevel) {
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/profile/onboarding`,
        {
          language: selectedLanguage,
          language_level: selectedLevel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //navigate("/chat");
      setIsOnboarding(false);
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">
            Welcome to Language Learning! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Let's personalize your learning experience
          </p>
        </div>

        {/* Language Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Choose your language
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => setSelectedLanguage(language.code)}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                  selectedLanguage === language.code
                    ? "border-red-500 bg-gradient-to-br from-white to-red-50"
                    : "border-gray-200 hover:border-red-200"
                }`}
              >
                <div className="relative w-full h-24 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={language.flag}
                    alt={`${language.name} flag`}
                    className="w-full h-full object-cover shadow-md"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${language.color} opacity-20`}
                  ></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                  {language.name}
                </h3>
                <p className="text-sm text-gray-500">{language.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Level Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Select your level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {levels.map((level) => (
              <button
                key={level.code}
                onClick={() => setSelectedLevel(level.code)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedLevel === level.code
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-200"
                }`}
              >
                <div className="text-3xl mb-2">{level.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {level.name}
                </h3>
                <p className="text-sm text-gray-500">{level.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button and Settings Note */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedLanguage || !selectedLevel || isSubmitting}
            className={`px-8 py-3 rounded-full text-white font-medium text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
              !selectedLanguage || !selectedLevel
                ? "bg-gray-300 cursor-not-allowed"
                : isSubmitting
                ? "bg-gradient-to-r from-red-400 to-pink-400 cursor-wait"
                : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Setting up...
              </div>
            ) : (
              "Let's Start Learning!"
            )}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Don't worry! You can always change your language and level later in
            Settings ⚙️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
