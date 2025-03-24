import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { HiMenu, HiX } from "react-icons/hi";
import Logo from "../assets/QilingoLogo.png";

const NavbarSO = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <nav className="bg-[#47A1BE] shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Name */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Qilingo" className="h-8 w-8" />
            <span className="text-[#FFFAE7] font-bold text-3xl">Qilingo</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoginPage && (
              <Link
                to="/login"
                className="bg-[#FFFAE7] text-[#47A1BE] px-6 py-2 rounded-full font-medium 
                  hover:bg-gray-300 transition duration-300"
              >
                Start Learning
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#F5E6D3] hover:[#F5E6D3] focus:outline-none"
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
            <div className="px-2 pt-2 pb-3 space-y-3 sm:px-3">
              {!isLoginPage && (
                <Link
                  to="/login"
                  className="block bg-[#FFFAE7] text-[#47A1BE] px-3 py-2 rounded-full text-center font-medium 
                    hover:bg-[#FFF2C2] transition duration-300"
                >
                  Start Learning
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
