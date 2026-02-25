import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Garages in UAE — Dubai, Abu Dhabi, Sharjah & More | GarageUAE",
  description:
    "Browse 850+ verified auto repair shops and service centres across all UAE emirates. Filter by rating, location, and opening hours. Real reviews, live data.",
  keywords: [
    "garages UAE", "auto repair Dubai", "car service centre Abu Dhabi",
    "auto workshop Sharjah", "mechanic near me UAE", "car repair UAE",
  ],
  openGraph: {
    title: "Find Garages in UAE | GarageUAE",
    description: "850+ verified auto repair shops across Dubai, Abu Dhabi, Sharjah & all UAE.",
    type: "website",
  },
};

export default function GaragesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
