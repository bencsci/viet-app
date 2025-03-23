// routes/chatRoutes.js
import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getProfile,
  updateLanguage,
  updateDifficulty,
  completeOnboarding,
} from "../controllers/profileController.js";
const profileRoute = express.Router();

profileRoute.get("/get", requireAuth(), getProfile);
profileRoute.post("/language", requireAuth(), updateLanguage);
profileRoute.post("/difficulty", requireAuth(), updateDifficulty);
profileRoute.post("/onboarding", requireAuth(), completeOnboarding);

export default profileRoute;
