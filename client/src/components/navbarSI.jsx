import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router";
import { IoSettingsSharp } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { UserButton } from "@clerk/clerk-react";
import { UserContext } from "../context/userContext";

const NavbarSI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { prevConvoId } = useContext(UserContext);

  return (
    <nav className="bg-[#FFFAE7] shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to={prevConvoId ? `/c/${prevConvoId}` : "/"}
            className="flex items-center"
          >
            <span className="text-[#489DBA] font-bold text-2xl">Qilingo</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to={prevConvoId ? `/c/${prevConvoId}` : "/"}
              className="text-gray-600 hover:text-[#47A1BE] px-3 py-2 rounded-md font-medium transition-colors duration-300"
            >
              Chat
            </Link>
            <Link
              to="/decks"
              className="text-gray-600 hover:text-[#47A1BE] px-3 py-2 rounded-md font-medium transition-colors duration-300"
            >
              Review
            </Link>
            <Link
              to="/settings"
              className="text-gray-600 hover:text-[#47A1BE] px-3 py-2 rounded-md font-medium transition-colors duration-300"
            >
              <IoSettingsSharp className="h-5 w-5" />
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#489DBA] hover:text-[#47A1BE] focus:outline-none transition-colors duration-300"
            >
              {isOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-[#FFFAE7]">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to={prevConvoId ? `/c/${prevConvoId}` : "/"}
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-[#47A1BE] hover:bg-gray-50 px-3 py-2 rounded-md font-medium transition-colors duration-300"
              >
                Chat
              </Link>
              <Link
                to="/decks"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-[#47A1BE] hover:bg-gray-50 px-3 py-2 rounded-md font-medium transition-colors duration-300"
              >
                Review
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600 hover:text-[#47A1BE] hover:bg-gray-50 px-3 py-2 rounded-md font-medium transition-colors duration-300"
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
