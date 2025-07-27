import React from "react";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-[#47A1BE] text-white rounded-lg font-medium hover:bg-[#3891AE]"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
