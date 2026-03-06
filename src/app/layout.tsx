import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MSEUF University Libraries | AI-Powered Library Support",
    template: "%s | MSEUF University Libraries",
  },
  description:
    "AI-Powered University Library Support System for Manuel S. Enverga University Foundation. Search books, access digital resources, and get real-time assistance.",
  keywords: [
    "MSEUF",
    "library",
    "university library",
    "Enverga",
    "Lucena City",
    "book catalog",
    "AI assistant",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <ConvexClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
