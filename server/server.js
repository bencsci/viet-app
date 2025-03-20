// server.js
import "dotenv/config"; // loads .env
import express from "express";
import cors from "cors";
import chatRoute from "./routes/chatRoute.js";
import historyRoute from "./routes/historyRoute.js";
import decksRoute from "./routes/decksRoute.js";
import webhooksRoute from "./routes/webhooksRoute.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Update Clerk middleware configuration
app.use(clerkMiddleware());

// Test route (unprotected) to confirm server runs
app.get("/", (req, res) => {
  res.send("Server is working...");
});

// Mount chat routes
app.use("/api/chat", chatRoute);
app.use("/api/history", historyRoute);
app.use("/api/decks", decksRoute);
app.use("/api/webhooks", webhooksRoute);

// app.post('/api/webhooks/clerk', (req, res) => {
//   console.log('Received Clerk webhook:', req.body);
//   res.status(200).send('OK');
// });


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
