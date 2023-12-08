"use client";

import { ThemeProvider as ThemeProviderSource } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeProviderSource
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      {...props}
    >
      {children}
    </ThemeProviderSource>
  );
}
