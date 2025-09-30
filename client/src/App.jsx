import { useEffect, useContext } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";
import Review from "./pages/Review";
import Conversation from "./pages/Conversation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NavbarSO from "./components/NavbarSO";
import NavbarSI from "./components/NavbarSI";
import Deck from "./pages/Deck";
import ReviewDeck from "./pages/ReviewDeck";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { UserContext } from "./context/userContext";
import ScrollToTop from "./components/ScrollToTop";

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
        <ScrollToTop>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ScrollToTop>
      </SignedOut>
    </div>
  );
}

export default App;
