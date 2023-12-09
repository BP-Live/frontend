import React from "react";
import Image from "next/image";
import LogoutIcon from "@/assets/images/logout.png";
import { logoutAPI } from "@/app/api";

export default function Header({ submitted }: { submitted: boolean }) {
  const handleLogout = async () => {
    await logoutAPI();

    const rootUrl = process.env.NEXT_PUBLIC_ROOT_DOMAIN as string;
    window.location.href = rootUrl.startsWith("https")
      ? rootUrl
      : `https://${rootUrl}`;
  };

  return (
    <div
      className={`top-0 ${
        submitted ? "w-full relative top-[75%]" : "w-[97%] absolute top-[0%]"
      } lg:top-[0%] lg:w-full lg:relative py-2 px-2 flex items-center justify-end z-40 pointer-events-auto`}
    >
      <Image
        src={LogoutIcon}
        alt="Budapest Live"
        className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer hover:scale-125 scale-100 transition-all duration-300 pointer-events-auto"
        onClick={handleLogout}
      />
    </div>
  );
}
