// routes/chatRoutes.js
import express from "express";
import { requireAuth } from "@clerk/express";
import { test, handleUsers } from "../controllers/webhookController.js";

const webhooksRoute = express.Router();

// Add raw body parser middleware for Clerk webhooks
//webhooksRoute.use(express.raw({ type: "application/json" }));

//webhooksRoute.post("/clerk", express.raw({ type: "application/json" }), test);

webhooksRoute.post("/clerk", handleUsers);

export default webhooksRoute;
