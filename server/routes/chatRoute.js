// routes/chatRoutes.js
import express from "express";
import { requireAuth } from "@clerk/express";
import { sendMessageToOpenAI } from "../controllers/chatController.js";

const chatRoute = express.Router();

chatRoute.post("/send", requireAuth(), sendMessageToOpenAI);

export default chatRoute;
