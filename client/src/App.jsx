import { SignIn, SignOutButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import Chat from "./components/chat";

function App() {
  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        {/* When user is signed out */}
        <SignedOut>
          <SignIn />
        </SignedOut>
        {/* When user is signed in */}
        <SignedIn>
          <div className="flex flex-col items-center justify-center p-4">
            <h1>Welcome! You are signed in.</h1>
            <SignOutButton />
          </div>

          <Chat />
        </SignedIn>
      </div>
    </div>
  );
}

export default App;
