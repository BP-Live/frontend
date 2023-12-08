import { Inter, Lora } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const caption = Lora({
  variable: "--font-caption",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});
