import React from "react";
import Image from "next/image";
import LogoutIcon from "@/assets/images/logout.png";
import { logoutAPI } from "@/app/api";

export default function Header({ submitted }: { submitted: boolean }) {
  const handleLogout = async () => {
    await logoutAPI();
    window.location.href = "/";
  };

  return (
    <div
      className={`absolute top-0 w-[95%] md:w-[98%] lg:w-[49%] ${
        submitted ? "top-[75%]" : "top-[0%]"
      } lg:top-[0%] py-2 px-2 flex items-center justify-end z-40`}
    >
      <Image
        src={LogoutIcon}
        alt="Budapest Live"
        className="w-5 h-5 lg:w-8 lg:h-8 cursor-pointer hover:scale-125 scale-100 transition-all duration-300"
        onClick={handleLogout}
      />
    </div>
  );
}