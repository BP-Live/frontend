import React from "react";
import Image from "next/image";
import LogoutIcon from "@/assets/images/logout_black.png";
import { logoutAPI } from "@/app/api";

export default function LogoutButton() {
  const handleLogout = async () => {
    await logoutAPI();

    const rootUrl = process.env.NEXT_PUBLIC_ROOT_DOMAIN as string;
    window.location.href = rootUrl.startsWith("https")
      ? rootUrl
      : `https://${rootUrl}`;
  };

  return (
    <Image
      src={LogoutIcon}
      alt="Budapest Live"
      className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer hover:scale-125 scale-100 transition-all duration-300 pointer-events-auto"
      onClick={handleLogout}
    />
  );
}
