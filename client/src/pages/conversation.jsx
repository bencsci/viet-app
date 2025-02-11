import React, { useState } from "react";
import Chat from "../components/chat";
import Sidebar from "../components/sidebar";

const Conversation = () => {
  return (
    <div className="pt-16 flex w-full">
      <Sidebar />
      <div className="flex-1">
        <Chat />
      </div>
    </div>
  );
};

export default Conversation;
