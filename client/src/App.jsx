import { useState, useEffect, useContext } from "react";
import {
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";
import Review from "./pages/review";
import Conversation from "./pages/conversation";
import Home from "./pages/home";
import Login from "./pages/login";
import NavbarSO from "./components/navbarSO";
import NavbarSI from "./components/navbarSI";
import Deck from "./pages/deck";
import ReviewDeck from "./pages/reviewDeck";
import Settings from "./pages/settings";
import Onboarding from "./pages/onboarding";
import NotFound from "./pages/notFound";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import { UserContext } from "./context/userContext";

function App() {
  const { user } = useUser();
  const { isOnboarding } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      document.title = "Qilingo";
    } else {
      document.title =
        "Qilingo - Learn Languages Through Natural Conversations";
    }
  }, [user]);

  if (isOnboarding) {
    return (
      <div>
        <Onboarding />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer autoClose={1250} />
      <SignedIn>
        <NavbarSI />
        <Routes>
          <Route path="/" element={<Conversation />} />
          <Route path="/c/:convoId" element={<Conversation />} />
          <Route path="/decks" element={<Review />} />
          <Route path="/decks/:deckId" element={<Deck />} />
          <Route path="/decks/:deckId/review" element={<ReviewDeck />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SignedIn>
      <SignedOut>
        <NavbarSO />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SignedOut>
    </div>
  );
}

export default App;
