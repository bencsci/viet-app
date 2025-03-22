const getUserProfile = async (supabase, userId) => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return profile;
};

const getLanguageCode = (language) => {
  const languageCodes = {
    vietnamese: "vi-VN",
    french: "fr-FR",
    spanish: "es-ES",
    portuguese: "pt-BR",
    italian: "it-IT",
  };

  return languageCodes[language.toLowerCase()] || "en-US";
};

const getVoice = (language) => {
  const voices = {
    vietnamese: "vi-VN-Chirp3-HD-Aoede",
    french: "fr-FR-Chirp3-HD-Aoede",
    spanish: "es-ES-Chirp3-HD-Aoede",
    portuguese: "pt-BR-Chirp3-HD-Aoede",
    italian: "it-IT-Chirp3-HD-Aoede",
  };

  return voices[language.toLowerCase()] || "en-US-Neural2-F";
};

// Helper function to get both code and voice at once
const getLanguageSettings = (language) => {
  return {
    languageCode: getLanguageCode(language),
    voice: getVoice(language),
  };
};

export { getUserProfile, getLanguageCode, getVoice, getLanguageSettings };
