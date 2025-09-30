import React from "react";
import { Link } from "react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#489DBA] text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">
              <Link to="/">Qilingo</Link>
            </h3>

            <p className="text-blue-100 text-sm max-w-xs">
              Learn languages naturally through conversations.
            </p>
          </div>

          <div className="text-center md:text-right">
            <div className="flex space-x-4 text-sm">
              <Link
                to="/privacy"
                className="text-blue-100 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-blue-100 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
            <p className="text-xs text-blue-100 mt-2">
              © {currentYear} Qilingo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
