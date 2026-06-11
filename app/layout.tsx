import type { Metadata } from "next";

// Import Google Fonts using Next.js built-in font optimization system
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

import { CartProvider } from "./components/CartContext";

import TopNavBar from "./components/TopNavBar";
import Footer from "./components/Footer";
import CartPopup from "./components/CartPopup";
import { Analytics } from "@vercel/analytics/next";

// Initialize the Google fonts with variables for CSS usage
// These variables (--font-inter / --font-bebas) will be available globally.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

// Define metadata for the entire app (SEO and browser tab titles)
export const metadata: Metadata = {
  title: {
    template: "%s | KiloBoy Artwork",
    default: "KiloBoy Artwork",
  },
  description:
    "Pop culture-inspired artworks that speak to the streets. Original prints by Miles Antwi — bold, expressive, and built to be felt.",
  metadataBase: new URL("https://kiloboyartworkstudio.com"),
  openGraph: {
    title: "KiloBoy Artwork",
    description:
      "Pop culture-inspired artworks that speak to the streets. Original prints by Miles Antwi — bold, expressive, and built to be felt.",
    url: "https://kiloboyartworkstudio.com",
    siteName: "KiloBoy Artwork",
    images: [
      {
        url: "/new-logo-2.png",
        width: 1200,
        height: 630,
        alt: "KiloBoy Artwork by Miles Antwi",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KiloBoy Artwork",
    description:
      "Pop culture-inspired artworks that speak to the streets. Original prints by Miles Antwi — bold, expressive, and built to be felt.",
    images: ["/new-logo-2.png"],
  },
  keywords: [
    "KiloBoy",
    "Miles Antwi",
    "pop culture art",
    "original art prints",
    "street art",
    "character art",
    "bold artwork",
    "visual storytelling",
  ],
};

// ROOT LAYOUT wraps every page in the app
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      {/* 
        min-h-screen → ensures page is at least the full viewport height (100vh)
        flex + flex-col → vertical stacking (Navbar → Content → Footer)
      */}
      <body
        className="
          antialiased 
          flex flex-col 
          min-h-screen
          font-sans "
      >
        <div className="hidden">
          <Analytics /> // To track analytics for visitors and page views
        </div>
        <CartProvider>
          {/* Top navigation bar and cart popup visible on every page */}
          <TopNavBar />
          <CartPopup />

          <main className="flex-grow mt-[60px] w-full">{children}</main>

          {/* 
            flex-grow → makes content area expand to fill leftover space 
            ensures the footer stays at the bottom when content is short.
          */}

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
