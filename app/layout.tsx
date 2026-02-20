import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "GarageFinder UAE — Find Auto Repair, Parts & Services",
  description:
    "AI-powered directory of UAE auto repair shops, spare parts stores, car services and more. Real reviews, live hours, all 7 emirates.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="bg-black text-zinc-50 font-sans antialiased">
        <div className="noise-bg" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
