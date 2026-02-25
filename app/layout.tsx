import type { Metadata } from "next";
import "./globals.css";
import GenerativeGrid from "@/components/ui/GenerativeGrid";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "GarageFinder UAE — Find Auto Repair, Parts & Services",
  description:
    "AI-powered directory of UAE auto repair shops, spare parts stores, car services and more. Real reviews, live hours, all 7 emirates.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark bg-black">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="bg-[#000000] text-white font-mono antialiased min-h-screen selection:bg-white selection:text-black uppercase">
        <div className="noise-bg pointer-events-none opacity-[0.03] mix-blend-overlay z-50 pointer-events-none" />

        {/* Generative Structural Blueprint Grid Background */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
          <GenerativeGrid
            cellSize={80}
            highlightDensity={0.05}
            pulseSpeed={4}
            className="w-full h-full"
          />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
