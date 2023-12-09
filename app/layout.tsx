import { ThemeProvider } from "@/components/theme-provider";
import { caption, inter } from "@/lib/utils/typography";
import { Analytics } from "@vercel/analytics/react";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Budapest Live",
  description: "Budapest Live",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, caption.variable)}>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
