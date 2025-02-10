import React, { useState } from "react";
import Chat from "../components/chat";
import Sidebar from "../components/sidebar";

const Conversation = () => {
  const [currentConversationId, setCurrentConversationId] = useState(null);

  return (
    <div className="pt-16">
      <Chat />
    </div>
  );
};

export default Conversation;
