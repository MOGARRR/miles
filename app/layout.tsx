import type { Metadata } from "next";

// Import Google Fonts using Next.js built-in font optimization system
import { Inter, Bebas_Neue } from "next/font/google";

import "./globals.css";

import { CartProvider } from "./components/CartContext";

import TopNavBar from "./components/TopNavBar";
import Footer from "./components/Footer";
import CartPopup from "./components/CartPopup";
import { SpeedInsights } from "@vercel/speed-insights/next";


// Initialize the Google fonts with variables for CSS usage
// These variables (--font-inter / --font-bebas) will be available globally.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });


// Define metadata for the entire app (SEO and browser tab titles)
export const metadata: Metadata = {
  title: "KiloBoy Artwork",
  description: "Official project site for KiloBoy Artwork",
};

// ROOT LAYOUT wraps every page in the app
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html 
      lang="en"
      className={`${inter.variable} ${bebas.variable}`} 
    >

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
        <CartProvider>
          {/* Top navigation bar and cart popup visible on every page */}
          <TopNavBar />
          <CartPopup />

          <main className="flex-grow mt-[60px] w-full">
            {children}

          </main>


          {/* 
            flex-grow → makes content area expand to fill leftover space 
            ensures the footer stays at the bottom when content is short.
          */}

        
          <Footer />

        </CartProvider>
        
        <SpeedInsights />
      

      </body>
    </html>
  );
}
