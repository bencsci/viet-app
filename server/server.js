// server.js
import "dotenv/config"; // loads .env
import express from "express";
import cors from "cors";
import chatRoute from "./routes/chatRoute.js";
import historyRoute from "./routes/historyRoute.js";
import { clerkMiddleware} from "@clerk/express";
import OpenAI from "openai";

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Update Clerk middleware configuration
app.use(clerkMiddleware());

// Test route (unprotected) to confirm server runs
app.get("/", (req, res) => {
  res.send("Server is working...");
});

// Mount chat routes (protected inside chatRoutes)
app.use("/api/chat", chatRoute);
app.use("/api/history", historyRoute);


//app.post("/api/chat", chatRoute);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
