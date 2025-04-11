import React from "react";
import {
  FaComments,
  FaBookOpen,
  FaLightbulb,
  FaHeadphones,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router";
import Qilin from "../assets/QilingoMD.svg";
import ConversationImg from "../assets/home/Main.png";
import TranslationImg from "../assets/home/Translation.png";
import DecksImg from "../assets/home/Decks.png";
import FlashcardImg from "../assets/home/Flashcard.png";
import ReviewImg from "../assets/home/Review.png";
import Footer from "../components/footer";

const languages = [
  { code: "us", name: "English", flag: "us.svg" },
  { code: "fr", name: "French", flag: "fr.svg" },
  { code: "es", name: "Spanish", flag: "es.svg" },
  { code: "br", name: "Portuguese", flag: "br.svg" },
  { code: "vn", name: "Vietnamese", flag: "vn.svg" },
  { code: "it", name: "Italian", flag: "it.svg" },
];

const home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Qilin */}
      <div className="bg-[#489DBA] text-white py-20 md:pt-30 overflow-hidden lg:py-0">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2">
            {/* Qilin Image - Left side */}
            <div className="flex justify-center md:justify-start">
              <img
                src={Qilin}
                alt="Qilingo Mascot"
                className="w-full object-contain"
              />
            </div>

            {/* Text Content - Right side */}
            <div className="text-left max-w-xl md:pl-4 lg:pl-6">
              <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Learn Languages
                <br className="hidden md:block" /> Through Natural
                <br className="hidden md:block" /> Conversations
                <span className="block mt-2 text-[#F5E6D3]">with Qilingo</span>
              </h1>
              <p className="text-lg mt-4 mb-6 text-blue-100 leading-relaxed max-w-lg">
                Experience the joy of learning languages naturally through
                AI-powered conversations, personalized to your pace.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="bg-white text-[#47A1BE] hover:bg-gray-300 px-6 py-2.5 rounded-full font-bold transition-colors duration-300 flex items-center gap-2"
                >
                  Start Learning <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Flags Section */}
      <div className="container mx-auto px-4 py-12 border-b border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Available Languages
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            Start your journey with any of these languages
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 sm:gap-2 md:gap-8 max-w-4xl mx-auto">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-all duration-300"
            >
              <div className="w-16 sm:w-20 h-12 sm:h-14 overflow-hidden rounded-lg shadow-md mb-3 hover:shadow-lg transition-shadow duration-300">
                <img
                  src={`https://flagcdn.com/${lang.flag}`}
                  alt={`${lang.name} Flag`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="font-medium text-gray-700 text-sm sm:text-base">
                {lang.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20">
        {/* How It Works Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Your Language Learning Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn naturally through conversation, just like you would with a
            native speaker
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-md transition-all duration-300 border border-gray-100">
            <FaComments className="text-5xl text-[#47A1BE] mb-6" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              AI Chat Partner
            </h3>
            <p className="text-gray-600">
              Chat naturally with our AI in your target language, available 24/7
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md transition-all duration-300 border border-gray-100">
            <FaLightbulb className="text-5xl text-[#47A1BE] mb-6" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Personalized Pace
            </h3>
            <p className="text-gray-600">
              Select your level and progress at your own comfortable speed
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md transition-all duration-300 border border-gray-100">
            <FaBookOpen className="text-5xl text-[#47A1BE] mb-6" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Smart Flashcards
            </h3>
            <p className="text-gray-600">
              Master vocabulary with our spaced repetition learning system
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md transition-all duration-300 border border-gray-100">
            <FaHeadphones className="text-5xl text-[#47A1BE] mb-6" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Interactive Tools
            </h3>
            <p className="text-gray-600">
              Instant pronunciation and one-click vocabulary saving
            </p>
          </div>
        </div>

        {/* Features Showcase with Images */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">
            Explore Our Features
          </h2>

          {/* Conversation Feature */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Natural Conversations
              </h3>
              <p className="text-gray-600 text-lg mb-4">
                Practice your language skills with AI-powered conversations that
                feel like chatting with a native speaker. You can choose your
                level and progress at your own comfortable pace. Conversation
                history is saved so you can review your progress.
              </p>
            </div>
            <div className="order-1 md:order-2 shadow-xl rounded-xl overflow-hidden">
              <img
                src={ConversationImg}
                alt="Conversation Feature"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Translation Feature */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div className="shadow-xl rounded-xl overflow-hidden">
              <img
                src={TranslationImg}
                alt="Translation Feature"
                className="w-full h-auto object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                One-Click Translations
              </h3>
              <p className="text-gray-600 text-lg mb-4">
                Get instant translations with one click. Our contextual
                translation system helps you understand meanings better than
                traditional dictionaries.
              </p>
            </div>
          </div>

          {/* Decks Feature */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Customized Decks
              </h3>
              <p className="text-gray-600 text-lg mb-4">
                Organize your vocabulary by topics, difficulty, or any system
                that works for you. Create personalized decks to focus on areas
                you want to improve.
              </p>
            </div>
            <div className="order-1 md:order-2 shadow-xl rounded-xl overflow-hidden">
              <img
                src={DecksImg}
                alt="Vocabulary Decks"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Flashcards Feature */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div className="shadow-xl rounded-xl overflow-hidden">
              <img
                src={FlashcardImg}
                alt="Flashcard System"
                className="w-full h-auto object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Interactive Flashcards
              </h3>
              <p className="text-gray-600 text-lg mb-4">
                Master vocabulary with our interactive flashcard system. Add new
                words from conversations and review them with visual and audio
                cues.
              </p>
            </div>
          </div>

          {/* Spaced Repetition Feature */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Spaced Repetition
              </h3>
              <p className="text-gray-600 text-lg mb-4">
                Our intelligent review system ensures you review words just when
                you're about to forget them, optimizing your memory retention
                and learning efficiency.
              </p>
            </div>
            <div className="order-1 md:order-2 shadow-xl rounded-xl overflow-hidden">
              <img
                src={ReviewImg}
                alt="Spaced Repetition System"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Learning Process Section */}
        <div className="bg-gradient-to-br from-[#47A1BE]/10 to-blue-50 rounded-3xl p-12 max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Natural Learning, Powered by AI
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our AI provides natural conversations that will help you learn just
            like you would with a native speaker. Save new words, practice
            pronunciation, and track your progress - all in one place.
          </p>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Start Your Language Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of learners already mastering new languages with
            Qilingo
          </p>
          <Link
            to="/login"
            className="bg-[#47A1BE] hover:bg-[#3891AE] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md inline-flex items-center gap-2"
          >
            Get Started Free <FaArrowRight />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default home;
