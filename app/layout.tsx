import type { Metadata } from "next";
import { display, sans, zh, mono } from "./fonts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "NSCD · North South Climate Dialogue",
  description:
    "Bridge the climate conversation across languages and cultures. NSCD is a bilingual platform connecting English and Chinese speakers through climate vocabulary, stories, and dialogue.",
  icons: { icon: "/logo/NSCD_Icon.svg" },
  openGraph: {
    title: "North South Climate Dialogue",
    description:
      "Bridge the climate conversation across languages and cultures. A bilingual platform connecting English and Chinese speakers through climate vocabulary, stories, and dialogue.",
    url: "https://www.nsclimatedialogue.org",
    siteName: "North South Climate Dialogue",
    images: [
      {
        url: "/logo/NSCD_Logo_Transparent.png",
        alt: "North South Climate Dialogue Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "North South Climate Dialogue",
    description:
      "Bridge the climate conversation across languages and cultures. A bilingual platform connecting English and Chinese speakers through climate vocabulary, stories, and dialogue.",
    images: ["/logo/NSCD_Logo_Transparent.png"],
  },
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
