import { getBeginnerPrompt } from "./beginners.js";
import { getIntermediatePrompt } from "./intermediate.js";
import { getAdvancedPrompt } from "./advanced.js";

export const getLanguageTutorPrompt = (language, difficulty = "beginner") => {
  switch (difficulty.toLowerCase()) {
    case "intermediate":
      return getIntermediatePrompt(language);
    case "advanced":
      return getAdvancedPrompt(language);
    case "beginner":
    default:
      return getBeginnerPrompt(language);
  }
};

export const getTranslateWordsPrompt = (language) => `
  You are a helpful assistant that translates ${language} words to English. You will be given a list of words, and you need to translate them to English. 
  Don't use any other language, only English and ${language}. 
  
  *Just return the translation, don't add any other text.
  `;

export function getTranslatePromptWithContext(language, content) {
  return `
      ${getTranslateWordsPrompt(language)}
      Use this context to translate the words: ${content}
    `;
}

export const getTitleGeneratorPrompt = (language) => `
  You are a helpful assistant that generates titles for conversations.
  You will be given a conversation between two friends in ${language}, and you need to generate a title for the conversation.
  
  *the title should be short and concise, maximum 5 words.
  *the title is in English and only English.
  *analyze the main topic, tone, and key points, and then generate a title that captures its essence
  *do not add any other unrelated text or words.
  
  Just return the title, don't add any other text.
  `;

