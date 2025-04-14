import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";

const login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <SignIn />
    </div>
  );
};

export default login;
