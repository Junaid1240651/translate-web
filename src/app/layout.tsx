import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Video Translator — Local AI Dubbing for YouTube & Audiobooks",
  description:
    "Translate and dub YouTube videos on your Mac with local AI. Create audiobooks from text — private, fast, and entirely on your device.",
  keywords: [
    "video translator",
    "YouTube dubbing",
    "local AI",
    "audiobook creator",
    "Mac app",
    "video dubbing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${jetbrains.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
