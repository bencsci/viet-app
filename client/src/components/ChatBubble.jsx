import React, { useState, useEffect, memo } from "react";
import { MdTranslate, MdClear, MdAdd, MdVolumeUp } from "react-icons/md";

const ChatBubble = memo(
  ({ message, index, onTranslateText, onPlayAudio, onShowFlashcardModal }) => {
    const [selectedWords, setSelectedWords] = useState(new Map());
    const [translation, setTranslation] = useState(null);
    const [translationType, setTranslationType] = useState(null);
    const [isTranslationLoading, setIsTranslationLoading] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    // Clear local state if the message content changes
    useEffect(() => {
      setSelectedWords(new Map());
      setTranslation(null);
      setTranslationType(null);
      setIsTranslationLoading(false);
      setIsPlayingAudio(false);
    }, [message.content]);

    const handleWordClick = (word, wordPosition) => {
      if (message.role === "user" || isTranslationLoading) {
        return;
      }

      setSelectedWords((prev) => {
        const newSelectedWords = new Map(prev);

        if (newSelectedWords.has(wordPosition)) {
          newSelectedWords.delete(wordPosition);
        } else {
          newSelectedWords.set(wordPosition, word);
        }

        if (newSelectedWords.size > 0) {
          translateWord("word", newSelectedWords);
        } else {
          setTranslation(null);
          setTranslationType(null);
        }

        return newSelectedWords;
      });
    };

    const getSelectedText = (wordMap) => {
      if (!wordMap || wordMap.size === 0) return "";
      return Array.from(wordMap.keys())
        .sort((a, b) => a - b)
        .map((item) => wordMap.get(item))
        .join(" ");
    };

    const translateWord = async (type, currentSelectedWords = "") => {
      let textToTranslate;
      if (type == "word") {
        textToTranslate = getSelectedText(currentSelectedWords);
        setTranslationType("word");
      } else {
        textToTranslate = message.content;
        setTranslationType("full");
        setSelectedWords(new Map());
      }

      if (!textToTranslate || !onTranslateText) return;

      setIsTranslationLoading(true);
      try {
        const result = await onTranslateText(textToTranslate);
        setTranslation(result);
      } catch (error) {
        console.error("Translation failed in bubble:", error);
        setTranslation("Error translating.");
      } finally {
        setIsTranslationLoading(false);
      }
    };

    const clearTranslation = () => {
      setTranslation(null);
      setTranslationType(null);
      setIsTranslationLoading(false);
      setSelectedWords(new Map());
    };

    const handlePlayAudio = async () => {
      if (isPlayingAudio || !translation || !onPlayAudio) return;

      const textToPlay =
        translationType === "full"
          ? message.content
          : getSelectedText(selectedWords);
      if (!textToPlay) return;

      setIsPlayingAudio(true);
      try {
        await onPlayAudio(textToPlay);
      } catch (error) {
        console.error("Audio playback failed in bubble:", error);
      } finally {
        setIsPlayingAudio(false);
      }
    };

    const handleAddToFlashcards = () => {
      if (!translation || !onShowFlashcardModal) return;
      const frontText =
        translationType === "full"
          ? message.content
          : getSelectedText(selectedWords);
      onShowFlashcardModal(frontText, translation);
      clearTranslation();
    };

    const isAssistant = message.role === "assistant";
    const isUser = message.role === "user";
    const showTranslationBox =
      isAssistant && (translation || isTranslationLoading);

    return (
      <div className="space-y-2">
        {showTranslationBox && (
          <div
            className={`flex ${
              isUser ? "justify-end" : "justify-start"
            } lg:px-5`}
          >
            <div className="bg-white shadow-md border border-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 max-w-[70%] relative animate-fade-in-scale">
              <div className="text-xs text-gray-400 mb-1 font-medium">
                Message Translation
              </div>
              {isTranslationLoading ? (
                <div className="flex justify-center py-2">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-[#47A1BE] rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="min-h-[20px] py-2">{translation}</div>
              )}

              <div className="mt-2 pt-2 border-t border-gray-200/80 flex items-center space-x-2">
                <button
                  className={`p-1.5 rounded-full transition-colors ${
                    isPlayingAudio
                      ? "bg-blue-200 text-blue-600 animate-pulse cursor-not-allowed"
                      : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                  }`}
                  title={isPlayingAudio ? "Playing..." : "Play original audio"}
                  onClick={handlePlayAudio}
                  disabled={isPlayingAudio || isTranslationLoading}
                >
                  <MdVolumeUp className="w-3.5 h-3.5" />
                </button>
                <button
                  className="p-1.5 bg-green-100 hover:bg-green-200 rounded-full text-green-600 transition-colors"
                  title="Add to flashcards"
                  onClick={handleAddToFlashcards}
                  disabled={isTranslationLoading}
                >
                  <MdAdd className="w-3.5 h-3.5" />
                </button>
                <div className="flex-grow"></div>
                <button
                  onClick={clearTranslation}
                  className="p-1.5 bg-red-100 hover:bg-red-200 rounded-full text-red-500 transition-colors"
                  title="Clear translation"
                  disabled={isTranslationLoading}
                >
                  <MdClear className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className={`flex ${isUser ? "justify-end" : "justify-start"} lg:px-5`}
        >
          <div
            className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
              isUser
                ? "bg-[#3E89A3] text-white rounded-br-none"
                : "bg-gray-200 text-black rounded-bl-none"
            }`}
          >
            <div>
              {isUser
                ? message.content
                : message.content.split(/(\s+)/).map((word, wordIndex) => {
                    if (word.match(/^\s+$/)) {
                      return word;
                    }
                    const isSelected = selectedWords.has(wordIndex);
                    return (
                      <span
                        key={wordIndex}
                        onClick={() => handleWordClick(word, wordIndex)}
                        className={`mx-[-0.75px] transition-colors duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-[#aededc] rounded px-0.5"
                            : "hover:bg-gray-300 rounded px-0.5"
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
            </div>

            {isAssistant && selectedWords.size > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-400/30 flex justify-end">
                <button
                  onClick={() => translateWord("full")}
                  className="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors text-blue-600"
                  title="Translate full message"
                >
                  <MdTranslate className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default ChatBubble;
