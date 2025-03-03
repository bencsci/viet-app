// routes/chatRoutes.js
import express from "express";
import { requireAuth } from "@clerk/express";
import {
  createDeck,
  editDeckTitle,
  removeDeck,
  addFlashcard,
  removeFlashcard,
  editFront,
  editBack,
  getDeck,
  listDecks,
  listFlashcards,
} from "../controllers/deckController.js";

const decksRoute = express.Router();

decksRoute.post("/create", requireAuth(), createDeck);
decksRoute.post("/edit-title", requireAuth(), editDeckTitle);
decksRoute.post("/remove", requireAuth(), removeDeck);
decksRoute.post("/add-flashcard", requireAuth(), addFlashcard);
decksRoute.post("/remove-flashcard", requireAuth(), removeFlashcard);
decksRoute.post("/edit-front", requireAuth(), editFront);
decksRoute.post("/edit-back", requireAuth(), editBack);
decksRoute.post("/get", requireAuth(), getDeck);
decksRoute.get("/list", requireAuth(), listDecks);
decksRoute.post("/list-flashcards", requireAuth(), listFlashcards);

export default decksRoute;
