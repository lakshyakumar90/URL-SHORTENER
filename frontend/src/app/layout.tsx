import type { Metadata } from "next";
import { DM_Sans } from "next/font/google"; // Changed from Inter
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const dmSans = DM_Sans({ subsets: ["latin"] }); // Initialize DM Sans

export const metadata: Metadata = {
  title: "ShortLink - URL Shortener",
  description: "Shorten, share, and track your links with ShortLink",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Navbar />
          <main className="pt-16 min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
