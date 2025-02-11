import express from "express";
import { requireAuth } from "@clerk/express";
import {
  saveConversation,
  getConversation,
  deleteConversation,
  updateConversation,
  listConversations,
} from "../controllers/historyController.js";

const historyRoute = express.Router();

historyRoute.post("/save", requireAuth(), saveConversation);
historyRoute.post("/get", requireAuth(), getConversation);
historyRoute.post("/delete", requireAuth(), deleteConversation);
historyRoute.post("/update", requireAuth(), updateConversation);
historyRoute.get("/list", requireAuth(), listConversations);

export default historyRoute;
