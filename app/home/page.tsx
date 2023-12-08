"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import BKLiveImage from "@/assets/images/bpLive.png";

export default function HomePage() {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/accounts/google`;
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
      });
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-center min-h-[100vh]">
      <div className="flex w-full items-center justify-around">
        <Image src={BKLiveImage} width={300} height={300} alt="Budapest Live" />

        <Button onClick={handleGoogleLogin}>Login with Google</Button>
      </div>
    </div>
  );
}
