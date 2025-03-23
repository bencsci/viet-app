import OpenAI from "openai";
import {
  getLanguageTutorPrompt,
  getTranslatePromptWithContext,
  getTitleGeneratorPrompt,
} from "../prompts/prompts.js";
import { TranslationServiceClient } from "@google-cloud/translate";
import textToSpeech from "@google-cloud/text-to-speech";
import { getUserProfile, getLanguageSettings } from "../functions/user.js";
import { supabaseClient } from "../config/supabaseClient.js";

const translationClient = new TranslationServiceClient();
const speechClient = new textToSpeech.TextToSpeechClient();

// Add error checking for credentials
if (
  !process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  !process.env.GOOGLE_CLOUD_PROJECT_ID
) {
  console.error("Missing Google Cloud credentials or project ID");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sendMessageToOpenAI = async (req, res) => {
  try {
    console.log("Received chat request");
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array" });
    }

    // Get user profile to get language and difficulty
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;
    const profile = await getUserProfile(supabase, userId);

    // Get the appropriate tutor prompt based on user's settings
    const tutorPrompt = getLanguageTutorPrompt(
      profile.language,
      profile.language_level
    );

    // Get the last messages from the conversation
    const recentMessages = messages.slice(-10);
    console.log("Messages:", recentMessages);

    const conversationContext = {
      role: "system",
      content: tutorPrompt,
    };

    const fullMessages = [conversationContext, ...recentMessages];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: fullMessages,
      temperature: 0.6,
    });

    const aiReply = response.choices[0]?.message?.content;
    console.log("OpenAI response:", aiReply);
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({
      error: "OpenAI API Error",
      details: error.message,
    });
  }
};

const translateWords = async (req, res) => {
  try {
    const { words, context } = req.body;
    if (!words || !context) {
      return res.status(400).json({ error: "Invalid words format" });
    }

    // Get user's language preference
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;
    const profile = await getUserProfile(supabase, userId);

    const messages = [
      {
        role: "system",
        content: getTranslatePromptWithContext(profile.language, context),
      },
      {
        role: "user",
        content: words,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.3,
    });

    const translation = response.choices[0]?.message?.content;
    res.json({ translation });
  } catch (error) {
    console.error("OpenAI Translation error:", error);
    res.status(500).json({
      error: "OpenAI Translation Error",
      details: error.message,
    });
  }
};

const translateWordsGoogle = async (req, res) => {
  try {
    const { words } = req.body;
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );
    const userId = req.auth.userId;
    const profile = await getUserProfile(supabase, userId);
    const { languageCode } = getLanguageSettings(profile.language);

    const request = {
      parent: `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/locations/${process.env.GOOGLE_CLOUD_LOCATION}`,
      contents: [words],
      mimeType: "text/plain",
      sourceLanguageCode: languageCode.split("-")[0], // Get just the language code part (e.g., 'vi' from 'vi-VN')
      targetLanguageCode: "en",
    };

    const [response] = await translationClient.translateText(request);
    const translation = response.translations[0].translatedText;
    res.json({ translation: translation });
  } catch (error) {
    console.error("Google Translate error:", error);
    res.status(500).json({ error: "Google Translate API Error" });
  }
};

const textToSpeechGoogle = async (req, res) => {
  try {
    const supabase = await supabaseClient(
      req.auth.getToken({ template: "supabase" })
    );

    const userId = req.auth.userId;

    const { text } = req.body;

    const profile = await getUserProfile(supabase, userId);
    const { languageCode, voice } = getLanguageSettings(profile.language);
    console.log(languageCode, voice);

    const request = {
      input: { text },
      voice: { languageCode, name: voice },
      audioConfig: { audioEncoding: "MP3", speakingRate: 1 },
    };

    const [response] = await speechClient.synthesizeSpeech(request);
    const audioContent = response.audioContent;
    //res.json({ audioContent });
    res.setHeader("Content-Type", "audio/mp3");
    res.send(audioContent);
  } catch (error) {
    console.error("Text to Speech error:", error);
  }
};

export {
  sendMessageToOpenAI,
  translateWords,
  translateWordsGoogle,
  textToSpeechGoogle,
};
