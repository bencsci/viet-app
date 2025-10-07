import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const chatService = {
  async getMessages(convoId, token) {
    const res = await axios.post(
      `${backendUrl}/api/history/get`,
      { convoId: convoId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },
  async generateTitle(messages, convoId, token) {
    await axios.post(
      `${backendUrl}/api/history/generate-title`,
      { messages: messages, convoId: convoId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },
  async saveNewConversation(messages, token) {
    const res = await axios.post(
      `${backendUrl}/api/history/save`,
      { messages: [messages[0]] },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  },
  async getResponse(messages, convoId, token) {
    const res = await axios.post(
      `${backendUrl}/api/chat/send`,
      { messages: messages, convoId: convoId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  },

  async updateConversation(messages, convoId, token) {
    await axios.post(
      `${backendUrl}/api/history/update`,
      { messages: messages, convoId: convoId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  async translateText(text, token) {
    const res = await axios.post(
      `${backendUrl}/api/chat/translate`,
      { words: text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.translation;
  },

  async getPronunciationAudio(text, token) {
    const res = await axios.post(
      `${backendUrl}/api/chat/tts`,
      { text },
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    return res.data;
  },
};
