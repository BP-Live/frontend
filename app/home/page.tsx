"use client";

import { Button } from "@/components/ui/button";
import { googleAuthAPI } from "../api";
import { useToast } from "@/components/ui/use-toast";

export default function HomePage() {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      await googleAuthAPI();
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
      });
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <h1>Home Page - Hello World</h1>

      <Button onClick={handleGoogleLogin}>Login with Google</Button>
    </div>
  );
}
