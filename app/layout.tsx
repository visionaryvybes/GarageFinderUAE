import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GarageFinder — Find Auto Repair Shops Near You",
  description:
    "AI-powered search for auto repair shops, mechanics, and service centers. Describe your car problem and find the right specialist.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-zinc-950 text-zinc-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
