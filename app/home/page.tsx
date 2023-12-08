"use client";

import { Button } from "@/components/ui/button";
import { googleAuthAPI } from "../api";

export default function HomePage() {
  const handleGoogleLogin = async () => {
    await googleAuthAPI();
  };

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <h1>Home Page - Hello World</h1>

      <Button onClick={handleGoogleLogin}>Login with Google</Button>
    </div>
  );
}
