import { useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { chatService } from "../services/chatService";

export const useChat = (setPrevConvoId, setIsNewConversation, listDecks) => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isAudioPlayingGlobally, setIsAudioPlayingGlobally] = useState(false);

  const loadMessages = useCallback(
    async (currentConvoId) => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const data = await chatService.getMessages(currentConvoId, token);
        if (data && data.messages) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
        toast.error("Failed to load conversation.");
        setMessages([]);
        setPrevConvoId(null);
        navigate("/404-not-found");
      } finally {
        setIsLoading(false);
      }
    },
    [getToken, setPrevConvoId, navigate]
  );

  const generateTitle = useCallback(
    async (currentMessages, currentConvoId) => {
      if (!currentMessages || currentMessages.length < 2 || !currentConvoId)
        return;

      setIsGeneratingTitle(true);
      try {
        const token = await getToken();
        await chatService.generateTitle(currentMessages, currentConvoId, token);
        console.log("Title generation request sent for:", currentConvoId);
        listDecks();
      } catch (error) {
        console.error("Error generating title:", error);
      } finally {
        setIsGeneratingTitle(false);
      }
    },
    [getToken, listDecks]
  );

  const sendMessage = useCallback(
    async (messagesToSend, currentConvoId) => {
      setIsTyping(true);
      let newConvoId = currentConvoId;
      try {
        const token = await getToken();

        // Create a new conversation, if new
        if (!currentConvoId && messagesToSend.length > 0) {
          const data = await chatService.saveNewConversation(
            messagesToSend,
            token
          );
          if (data && data.id) {
            newConvoId = data.id;
            navigate(`/c/${newConvoId}`, { replace: true });
            setIsNewConversation(false);
            setPrevConvoId(newConvoId);
            listDecks();
          } else {
            throw new Error("Failed to create conversation.");
          }
        }

        // Send message
        const chatData = await chatService.getResponse(
          messagesToSend,
          newConvoId,
          token
        );

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: chatData.reply },
        ]);

        // Generate title after a few messages
        if (newConvoId && messagesToSend.length === 4 && !isGeneratingTitle) {
          generateTitle(messagesToSend, newConvoId);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message. Please try again.");
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsTyping(false);
      }
    },
    [
      getToken,
      navigate,
      setIsNewConversation,
      setPrevConvoId,
      listDecks,
      isGeneratingTitle,
      generateTitle,
    ]
  );

  const updateConversation = useCallback(
    async (currentMessages, currentConvoId) => {
      if (updateConversation.timeoutId) {
        clearTimeout(updateConversation.timeoutId);
      }
      updateConversation.timeoutId = setTimeout(async () => {
        try {
          const token = await getToken();
          await chatService.updateConversation(
            currentMessages,
            currentConvoId,
            token
          );
        } catch (error) {
          console.error("Error updating conversation in DB:", error);
        }
      }, 1500);
    },
    [getToken]
  );

  const translateText = useCallback(
    async (text) => {
      if (!text) return null;
      try {
        const token = await getToken();
        return await chatService.translateText(text, token);
      } catch (error) {
        console.error("Translation API error:", error);
        toast.error("Translation failed.");
        throw error;
      }
    },
    [getToken]
  );

  const playAudio = useCallback(
    async (text) => {
      if (!text || isAudioPlayingGlobally) {
        console.log("playAudio blocked:", {
          textExists: !!text,
          isAudioPlayingGlobally,
        });
        return;
      }

      setIsAudioPlayingGlobally(true);
      let audioUrl = null;

      try {
        const token = await getToken();
        console.log("Requesting TTS blob from backend...");
        const audioData = await chatService.getPronunciationAudio(text, token);

        console.log(
          "Received TTS blob, type:",
          audioData.type,
          "size:",
          audioData.size
        );
        const audioBlob = new Blob([audioData], { type: "audio/mp3" });
        audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        console.log("Attempting to play audio...");
        await audio.play();

        audio.onended = () => {
          console.log("Audio playback finished.");
          URL.revokeObjectURL(audioUrl);
          setIsAudioPlayingGlobally(false);
        };

        audio.onerror = (err) => {
          console.error("Audio element error:", err);
          if (audioUrl) URL.revokeObjectURL(audioUrl);
          setIsAudioPlayingGlobally(false);
          toast.error("Error playing audio.");
        };
      } catch (error) {
        console.error("TTS Error in playAudio:", error);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setIsAudioPlayingGlobally(false);
        toast.error("Failed to fetch audio.");
        throw error;
      }
    },
    [getToken, isAudioPlayingGlobally]
  );

  return {
    messages,
    setMessages,
    isTyping,
    isLoading,
    setIsLoading,
    isGeneratingTitle,
    isAudioPlayingGlobally,
    loadMessages,
    sendMessage,
    updateConversation,
    translateText,
    playAudio,
  };
};
