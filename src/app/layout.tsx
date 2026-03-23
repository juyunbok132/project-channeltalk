import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ChatWidgetWrapper } from "@/components/chat";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "project-channeltalk",
  description: "MD 파일 하나면 웹사이트에 AI 챗봇 완성",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ChatWidgetWrapper />
      </body>
    </html>
  );
}
