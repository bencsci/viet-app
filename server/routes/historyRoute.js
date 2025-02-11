import express from "express";
import { requireAuth } from "@clerk/express";
import {
  saveConversation,
  getConversation,
  deleteConversation,
  updateConversation,
} from "../controllers/historyController.js";

const historyRoute = express.Router();

historyRoute.post("/save", requireAuth(), saveConversation);
historyRoute.get("/get", requireAuth(), getConversation);
historyRoute.delete("/delete", requireAuth(), deleteConversation);
historyRoute.post("/update", requireAuth(), updateConversation);

export default historyRoute;
