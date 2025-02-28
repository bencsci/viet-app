import express from "express";
import { requireAuth } from "@clerk/express";
import {
  saveConversation,
  getConversation,
  deleteConversation,
  updateConversation,
  listConversations,
  generateTitle,
  updateTitle,
} from "../controllers/historyController.js";

const historyRoute = express.Router();

historyRoute.post("/save", requireAuth(), saveConversation);
historyRoute.post("/get", requireAuth(), getConversation);
historyRoute.post("/delete", requireAuth(), deleteConversation);
historyRoute.post("/update", requireAuth(), updateConversation);
historyRoute.get("/list", requireAuth(), listConversations);
historyRoute.post("/generate-title", requireAuth(), generateTitle);
historyRoute.post("/update-title", requireAuth(), updateTitle);

export default historyRoute;
