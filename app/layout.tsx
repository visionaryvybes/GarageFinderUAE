import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/app/providers";

// Body font: Inter — clean, readable, used by Google Maps & modern service apps
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Display font: Plus Jakarta Sans — premium automotive feel for headings
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GarageFinder UAE — Find Auto Repair, Parts & Services Near You",
  description:
    "Find top-rated auto repair shops, car service centres, and spare parts stores across all UAE — Dubai, Abu Dhabi, Sharjah, Ajman, RAK & more. AI-powered search, real reviews, live hours.",
  manifest: "/manifest.webmanifest",
  keywords: [
    "auto repair UAE", "car service Dubai", "garage Dubai", "spare parts UAE",
    "car repair Abu Dhabi", "auto workshop Sharjah", "mechanic near me UAE",
    "car service centre UAE", "automobile repair Dubai", "tyre shop UAE",
    "engine repair Dubai", "AC service car UAE", "brake repair UAE"
  ],
  openGraph: {
    title: "GarageFinder UAE — Find Top Auto Repair & Parts",
    description: "AI-powered directory of 850+ verified garages and parts stores across all 7 UAE emirates.",
    type: "website",
    locale: "en_AE",
    siteName: "GarageFinder UAE",
  },
  twitter: {
    card: "summary_large_image",
    title: "GarageFinder UAE",
    description: "Find top-rated auto repair shops & parts stores across all UAE emirates.",
  },
  alternates: {
    canonical: "https://garage-finder-uae.vercel.app",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GarageUAE",
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#09090b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GarageUAE" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-512.png" />
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('garage-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`,
          }}
        />
      </head>
      <body className="theme-bg theme-text antialiased min-h-screen font-sans">
        <ThemeProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
