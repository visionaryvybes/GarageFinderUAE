"use client";

import { Star, User, Quote, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const REVIEWS = [
  {
    name: "AHMED M.",
    role: "BMW M4 OWNER",
    text: "ACCOMPLISHED WHAT 3 OTHER GARAGES FAILED TO DO. DIAGNOSTICS WERE INSTANT AND ACCURATE. THE INTERFACE POINTED ME TO THE EXACT INDIVIDUAL CAPABLE OF REPAIRING THE S55 ENGINE.",
    rating: 5,
  },
  {
    name: "SARAH K.",
    role: "TESLA MODEL 3",
    text: "THE FILTERING SYSTEM IS FLAWLESS. EV-CERTIFIED LOCATIONS WERE DISPLAYED IMMEDIATELY. BOOKING SEQUENCE INITIATED AND RESOLVED WITHIN 15 MINUTES.",
    rating: 5,
  },
  {
    name: "OMAR R.",
    role: "FORD RAPTOR",
    text: "LOCATED A SPECIALIZED HARDWARE NODE FOR SUSPENSION COMPONENTS IN DUBAI AL QUOZ. PRICES WERE TRANSPARENT, SAVED 40% COMPARED TO DEALERSHIP THEFT.",
    rating: 5,
  },
  {
    name: "FAISAL T.",
    role: "PORSCHE 911",
    text: "THE RATING FLOOR IS LEGITIMATE. EVERY 4.5+ SHOP I'VE VISITED THROUGH THIS DIRECTORY HAS DELIVERED. NO EXPERIMENTATION REQUIRED.",
    rating: 5,
  },
  {
    name: "JOHN D.",
    role: "NISSAN PATROL",
    text: "UNCOMPROMISING PRECISION IN DATA. OPENING HOURS ARE ACCURATE. THE AI SUMMARY MODULE SAVES HOURS OF READING INDIVIDUAL GOOGLE REVIEWS.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <div className="py-24 bg-[#050505] min-h-[400px] border-grid-b" />;

  return (
    <section className="py-24 bg-[#050505] border-grid-b relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 mb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="border-l-4 border-white pl-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase leading-[0.9] mb-4">
              USER TELEMETRY
              <br />
              <span className="text-zinc-600">& EVALUATIONS</span>
            </h2>
            <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 max-w-lg">
              REAL-WORLD DATA SOURCED DIRECTLY FROM VERIFIED OPERATORS WITHIN THE NETWORK. NO SYNTHETIC REVIEWS PERMITTED.
            </p>
          </div>

          <button className="flex items-center gap-3 px-6 py-4 border border-white hover:bg-white hover:text-black transition-colors w-fit group">
            <span className="text-[11px] font-black tracking-widest uppercase">ACCESS ALL LOGS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Marquee Row */}
      <div className="relative flex overflow-x-hidden group border-y border-white/20 bg-[#000]">

        {/* Animated Tracker Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white opacity-20" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white opacity-20" />

        <div className="animate-marquee-fast flex shrink-0 items-center">
          {[...REVIEWS, ...REVIEWS].map((review, i) => (
            <div
              key={i}
              className="w-[320px] md:w-[400px] shrink-0 border-r border-white/20 p-8 flex flex-col hover:bg-white hover:text-black transition-colors group/card relative"
            >
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-l border-b border-inherit bg-[#050505] group-hover/card:bg-black group-hover/card:border-black transition-colors" />

              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current text-white group-hover/card:text-black" />
                ))}
              </div>

              <div className="mb-8">
                <Quote className="w-8 h-8 text-white/10 group-hover/card:text-black/10 mb-4" />
                <p className="text-[11px] font-bold tracking-widest uppercase leading-loose text-zinc-400 group-hover/card:text-zinc-700 min-h-[120px]">
                  {review.text}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-white/20 group-hover/card:border-black/20 mt-auto">
                <div className="w-10 h-10 border border-white/20 group-hover/card:border-black flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black tracking-widest uppercase text-white group-hover/card:text-black">
                    {review.name}
                  </h4>
                  <p className="text-[9px] font-bold tracking-widest uppercase text-zinc-500 group-hover/card:text-zinc-600">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
