import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { FaLanguage } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

const NavbarSO = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <nav className="bg-red-500 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Name */}
          <Link to="/" className="flex items-center space-x-2">
            <FaLanguage className="text-[#FFF9C4] text-3xl" />
            <span className="text-[#FFF9C4] font-bold text-xl">
              VietAI
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoginPage && (
              <Link
                to="/login"
                className="bg-[#FFF9C4] text-red-500 px-4 py-2 rounded-md font-medium 
                  hover:bg-[#FFF5B6] transition duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#FFFF00] hover:text-yellow-400 focus:outline-none"
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
              {!isLoginPage && (
                <Link
                  to="/login"
                  className="block bg-[#FFF9C4] text-[#DA251D] px-3 py-2 rounded-md text-center font-medium 
                    hover:bg-[#FFF5B6] transition duration-300"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarSO;
