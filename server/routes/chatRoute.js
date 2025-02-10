// routes/chatRoutes.js
import express from "express";
import { requireAuth } from "@clerk/express";
import {
  sendMessageToOpenAI,
  translateWords,
  translateWordsGoogle,
  saveConversation,
  getConversation,
  deleteConversation,
  updateConversation,
} from "../controllers/chatController.js";

const chatRoute = express.Router();

chatRoute.post("/send", requireAuth(), sendMessageToOpenAI);
chatRoute.post("/translate", requireAuth(), translateWords);
chatRoute.post("/save", requireAuth(), saveConversation);
chatRoute.get("/get", requireAuth(), getConversation);
chatRoute.delete("/delete", requireAuth(), deleteConversation);
chatRoute.post("/update", requireAuth(), updateConversation);

export default chatRoute;
