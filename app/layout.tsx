import type { Metadata } from "next";
import "./globals.css";
import {Plus_Jakarta_Sans} from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const dmSans = Plus_Jakarta_Sans({
  variable:"--font-dm-sans",
  weight:["200","300","400","500","600","700","800",],
  subsets:["latin"]
})

export const metadata: Metadata = {
  title: "Chitti - Your Intelligent Companion",
  description: "Meet Chitti, the artificially intelligent chatbot inspired by the iconic robot from the movie Enthiran. Engage in conversations, get help with daily tasks, and explore the possibilities of AI-powered interactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className}  antialiased `}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
