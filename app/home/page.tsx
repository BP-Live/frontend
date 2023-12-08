"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import BKLiveImage from "@/assets/images/bpLive.png";
import GoogleIcon from "@/assets/images/googleIcon.webp";

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
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex w-full min-h-[100vh] items-center justify-center gap-16 flex-col lg:justify-around lg:flex-row lg:gap-0">
        <Image src={BKLiveImage} width={300} height={300} alt="Budapest Live" />

        <div className="flex items-center justify-center flex-col">
          <h1 className="text-5xl font-bold font-caption mb-3 text-center">
            BP Live Project
          </h1>
          <h2 className="text-2xl font-caption mb-8 text-center">
            Making people&apos;s life easier
          </h2>
          <Button onClick={handleGoogleLogin} size="lg">
            <p className="font-bold mr-1">Login with Google</p>
            <Image src={GoogleIcon} width={35} height={35} alt="Google Icon" />
          </Button>
        </div>
      </div>
    </div>
  );
}
