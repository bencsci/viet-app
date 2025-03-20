// routes/chatRoutes.js
import express from "express";
import { requireAuth } from "@clerk/express";
import addUser from "../controllers/webhookController.js";


const webhooksRoute = express.Router();

webhooksRoute.post("/clerk", addUser);

export default webhooksRoute;
