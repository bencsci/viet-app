// routes/chatRoutes.js
import express from "express";
import { requireAuth } from "@clerk/express";
import { test, handleUsers } from "../controllers/webhookController.js";

const webhooksRoute = express.Router();

webhooksRoute.post("/clerk", handleUsers);

export default webhooksRoute;
