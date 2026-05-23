import { Bricolage_Grotesque, Plus_Jakarta_Sans, Noto_Sans_SC, JetBrains_Mono } from "next/font/google";

// Display: bold, characterful, slightly weird — matches the "Civic Poster" aesthetic.
export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

// Body: humanist, warm — Plus Jakarta Sans is Google Fonts' closest cousin to General Sans.
export const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

// Chinese body — weight-matched to the body font.
export const zh = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-zh",
});

// Numerals + micro-labels only.
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});
