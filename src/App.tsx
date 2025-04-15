import { BrowserRouter } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Button } from "./components/ui/button";

import { SignedInRoutes } from "./SignedInRoutes";

function App() {
  return (
    <main>
      <SignedOut>
        <div className="w-screen h-screen flex justify-center items-center">
          <SignInButton>
            <Button size="lg">Sign in</Button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        <BrowserRouter>
          <SignedInRoutes />
        </BrowserRouter>
      </SignedIn>
    </main>
  );
}

export default App;
