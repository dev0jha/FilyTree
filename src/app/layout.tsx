import { Geist, Geist_Mono } from "next/font/google";
import { Shell } from "./shell";
import "./globals.css";
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
      <body className="antialiased bg-[#121212] text-foreground min-h-screen">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
