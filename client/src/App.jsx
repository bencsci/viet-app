import { SignIn, SignOutButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Routes, Route } from "react-router";
import Review from "./pages/review";
import Conversation from "./pages/conversation";
import Home from "./pages/home";
import Login from "./pages/login";
import NavbarSO from "./components/navbarSO";
import NavbarSI from "./components/navbarSI";
import Deck from "./pages/deck";
function App() {
  return (
    <div>
      <SignedIn>
        <NavbarSI />
        <Routes>
          <Route path="/" element={<Conversation />} />
          <Route path="/review" element={<Review />} />
          <Route path="/decks/:deckId" element={<Deck />} />
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
