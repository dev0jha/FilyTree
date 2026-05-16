import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Shell } from "./shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="text-foreground min-h-screen bg-[#121212] antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
