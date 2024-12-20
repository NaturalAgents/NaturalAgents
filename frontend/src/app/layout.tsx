import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NaturalAgents",
  description: "NaturalAgents Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <Header /> {/* Add the header here */}
          <div className="flex h-full">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 h-full">{children}</div>
            <Toaster />
          </div>
        </div>
      </body>
    </html>
  );
}
