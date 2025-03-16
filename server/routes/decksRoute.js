// routes/chatRoutes.js
import express from "express";
import { requireAuth } from "@clerk/express";
import {
  createDeck,
  editDeck,
  removeDeck,
  addFlashcard,
  removeFlashcard,
  getDeck,
  listDecks,
  listFlashcards,
  editFlashcard,
  updateFlashcard,
} from "../controllers/deckController.js";

const decksRoute = express.Router();

decksRoute.post("/create", requireAuth(), createDeck);
decksRoute.post("/edit", requireAuth(), editDeck);
decksRoute.post("/remove", requireAuth(), removeDeck);
decksRoute.post("/add-flashcard", requireAuth(), addFlashcard);
decksRoute.post("/remove-flashcard", requireAuth(), removeFlashcard);
decksRoute.post("/get", requireAuth(), getDeck);
decksRoute.get("/list", requireAuth(), listDecks);
decksRoute.post("/list-flashcards", requireAuth(), listFlashcards);
decksRoute.post("/edit-flashcard", requireAuth(), editFlashcard);
decksRoute.post("/update-flashcard", requireAuth(), updateFlashcard);

export default decksRoute;
