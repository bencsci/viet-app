import React from "react";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Page not found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't seem to exist
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#47A1BE] text-white rounded-full font-medium 
              transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
