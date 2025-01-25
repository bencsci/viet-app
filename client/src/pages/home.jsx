import React from "react";
import { FaComments, FaBookOpen, FaLightbulb } from "react-icons/fa";
import { MdTranslate } from "react-icons/md";
import { Link } from "react-router";

const home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50">
      <div className="container mx-auto px-4 py-12 pt-40">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-red-600 mb-4">
            Học Tiếng Việt
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            Learn Vietnamese through natural conversations with AI
          </p>
          <Link
            to="/login"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
          >
            Start Chatting Now
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <FaComments className="text-4xl text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Natural Conversations
            </h2>
            <p className="text-gray-600">
              Practice Vietnamese with our AI chat partner in realistic,
              everyday conversations
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <MdTranslate className="text-4xl text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Instant Translations
            </h2>
            <p className="text-gray-600">
              Click on any word to see its translation and add it to your
              flashcards
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <FaBookOpen className="text-4xl text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Smart Flashcards
            </h2>
            <p className="text-gray-600">
              Review vocabulary with spaced repetition for optimal learning
            </p>
          </div>
        </div>

        {/* Learning Philosophy Section */}
        <div className="max-w-4xl mx-auto text-center mt-16 mb-16 bg-white p-10 rounded-xl shadow-lg">
          <FaLightbulb className="text-5xl text-red-500 mb-6 mx-auto" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            The Secret to Language Learning? Practice!
          </h2>
          <p className="text-xl text-gray-600">
            The most effective way to master any language is through active
            conversation. But finding a patient conversation partner can be
            challenging. Don't worry - we've created the perfect AI friend who's
            always ready to chat with you in Vietnamese!
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to start your Vietnamese journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of learners mastering Vietnamese through conversation
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default home;
