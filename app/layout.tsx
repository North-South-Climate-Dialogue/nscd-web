import type { Metadata } from "next";
import { display, sans, zh, mono } from "./fonts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "NSCD · North South Climate Dialogue",
  description:
    "A bilingual climate learning and language exchange platform. Learn the words that decide our future — English ⇄ 中文.",
  icons: { icon: "/logo/NSCD_Icon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${zh.variable} ${mono.variable}`}
    >
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
