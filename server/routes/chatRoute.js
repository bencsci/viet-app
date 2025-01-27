// routes/chatRoutes.js
import express from "express";
import { requireAuth } from "@clerk/express";
import {
  sendMessageToOpenAI,
  translateWords,
  translateWordsGoogle,
} from "../controllers/chatController.js";

const chatRoute = express.Router();

chatRoute.post("/send", requireAuth(), sendMessageToOpenAI);
chatRoute.post("/translate", requireAuth(), translateWordsGoogle);

export default chatRoute;
