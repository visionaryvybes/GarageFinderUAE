import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spare Parts Stores UAE — Engine, Brakes, Tyres & More | GarageUAE",
  description:
    "Find spare parts shops across Dubai, Abu Dhabi, Sharjah and all UAE. Browse by category: Engine, Brakes, Suspension, Electrical, Tyres, Used OEM & more.",
  keywords: [
    "spare parts UAE", "car parts Dubai", "auto parts Abu Dhabi",
    "used parts UAE", "OEM parts Dubai", "engine parts UAE", "brake parts UAE",
  ],
  openGraph: {
    title: "Spare Parts Stores in UAE | GarageUAE",
    description: "320+ spare parts stores across all UAE emirates. New, OEM & used parts.",
    type: "website",
  },
};

export default function PartsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
