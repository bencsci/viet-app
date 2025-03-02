import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { FaLanguage } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { IoSettingsSharp } from "react-icons/io5";
import { UserButton } from "@clerk/clerk-react";

const NavbarSI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Name */}
          <Link to="/" className="flex items-center space-x-2">
            <FaLanguage className="text-red-500 text-3xl" />
            <span className="text-red-500 font-bold text-xl">VietAI</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-red-500 px-3 py-2 rounded-md font-medium"
            >
              Chat
            </Link>
            <Link
              to="/review"
              className="text-gray-600 hover:text-red-500 px-3 py-2 rounded-md font-medium"
            >
              Review
            </Link>
            <Link
              to="/settings"
              className="text-gray-600 hover:text-red-500 px-3 py-2 rounded-md font-medium"
            >
              <IoSettingsSharp className="h-5 w-5" />
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-red-500 hover:text-red-600 focus:outline-none"
            >
              {isOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-red-500 px-3 py-2 rounded-md font-medium"
              >
                Chat
              </Link>
              <Link
                to="/review"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-red-500 px-3 py-2 rounded-md font-medium"
              >
                Review
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-red-500 px-3 py-2 rounded-md font-medium"
              >
                Settings
              </Link>
              <div className="px-3 py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarSI;
