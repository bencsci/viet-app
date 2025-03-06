import { SignIn, SignOutButton, SignedIn, SignedOut } from "@clerk/clerk-react";
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
function App() {
  return (
    <div>
      <ToastContainer autoClose={1250} />
      <SignedIn>
        <NavbarSI />
        <Routes>
          <Route path="/" element={<Conversation />} />
          <Route path="/decks" element={<Review />} />
          <Route path="/decks/:deckId" element={<Deck />} />
          <Route path="/decks/:deckId/review" element={<ReviewDeck />} />
        </Routes>
      </SignedIn>
      <SignedOut>
        <NavbarSO />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </SignedOut>
    </div>
  );
}

export default App;
