"use client";

import { Star, Quote, CheckCircle2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const REVIEWS = [
  {
    name: "Mohammed Al Rashid",
    role: "BMW 5 Series",
    location: "Dubai Marina",
    text: "Found the best BMW specialist in Dubai within minutes. Saved me hours of searching and the shop was verified and professional. The AI actually knew what it was doing.",
    rating: 5,
    avatar: "MA",
    color: "from-orange-500 to-orange-600",
    service: "Engine Overhaul",
    saved: "AED 800",
  },
  {
    name: "Sarah Ahmed",
    role: "Toyota RAV4",
    location: "Abu Dhabi",
    text: "The AI search understood exactly what was wrong with my car — AC compressor issue. Directed me to the right specialist instantly. No more guessing or calling around.",
    rating: 5,
    avatar: "SA",
    color: "from-violet-500 to-violet-600",
    service: "AC Repair",
    saved: "AED 1,200",
  },
  {
    name: "Khalid Hassan",
    role: "Mercedes GLC",
    location: "Sharjah",
    text: "Best car service app in UAE. Found a certified Mercedes workshop near me with great reviews. Booking was seamless and the price was exactly as quoted — no surprises.",
    rating: 5,
    avatar: "KH",
    color: "from-cyan-500 to-cyan-600",
    service: "Full Service",
    saved: "AED 600",
  },
  {
    name: "Rania Yousef",
    role: "Honda CR-V",
    location: "Ajman",
    text: "The parts search feature is incredible — found OEM parts for my Honda at a great price. Saved me a trip to 5 different shops. Genuinely life-changing for anyone who owns a car in UAE.",
    rating: 5,
    avatar: "RY",
    color: "from-emerald-500 to-emerald-600",
    service: "Parts & Fitting",
    saved: "AED 450",
  },
  {
    name: "Tariq Al Mansoori",
    role: "Nissan Patrol",
    location: "Al Ain",
    text: "My Patrol had a transmission issue and this app found a specialist in under 3 minutes. Genuinely impressed. The 24/7 support and verified reviews gave me full confidence.",
    rating: 5,
    avatar: "TA",
    color: "from-orange-500 to-amber-500",
    service: "Transmission",
    saved: "AED 2,000",
  },
  {
    name: "Fatima Al Zaabi",
    role: "Kia Sportage",
    location: "Ras Al Khaimah",
    text: "Even in RAK, found great options. The app works across all 7 emirates which is amazing. I'd been struggling to find a reliable service centre outside Dubai — problem solved.",
    rating: 5,
    avatar: "FA",
    color: "from-pink-500 to-rose-500",
    service: "Brake Service",
    saved: "AED 350",
  },
];

function ReviewCard({ review, featured = false }: { review: typeof REVIEWS[0]; featured?: boolean }) {
  return (
    <div
      className={`relative group flex flex-col rounded-2xl border border-white/[0.07] bg-[#111113] hover:border-white/[0.14] transition-all duration-300 shrink-0 overflow-hidden ${
        featured ? "w-[340px] p-6" : "w-[300px] p-5"
      }`}
      style={{
        background: "linear-gradient(145deg, #111113 0%, #0f0f11 100%)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Subtle top accent */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${review.color} opacity-60`} />

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${review.color} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg`}>
          {review.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-sm font-bold text-white leading-tight truncate">{review.name}</p>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>
          <p className="text-xs text-zinc-500 truncate">{review.role} · {review.location}</p>
        </div>
        <Quote className="w-5 h-5 text-orange-500/20 ml-auto shrink-0 group-hover:text-orange-500/40 transition-colors" />
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Review text */}
      <p className={`text-zinc-400 leading-relaxed flex-1 ${featured ? "text-sm" : "text-xs"}`}>{review.text}</p>

      {/* Footer: service + savings */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.05]">
        <span className="text-[11px] text-zinc-600 font-medium">{review.service}</span>
        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Saved {review.saved}
        </span>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <div className="py-20 bg-[#09090b] min-h-[400px]" />;

  const row1 = [...REVIEWS, ...REVIEWS];
  const row2 = [...REVIEWS.slice(3), ...REVIEWS.slice(0, 3), ...REVIEWS.slice(3), ...REVIEWS.slice(0, 3)];

  return (
    <section className="py-20 md:py-28 bg-[#09090b] overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-3"
            >
              Real Drivers · Real Results
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight"
            >
              Trusted by drivers
              <br />
              <span className="text-zinc-500">across all 7 Emirates</span>
            </motion.h2>
          </div>

          {/* Aggregate score — right side on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4 bg-[#111113] border border-white/[0.07] rounded-2xl px-5 py-4 shrink-0"
          >
            <div>
              <p className="text-4xl font-black text-white">4.9</p>
              <div className="flex gap-0.5 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-500">2,400+ reviews</p>
            </div>
            <div className="w-px h-12 bg-white/[0.07]" />
            <div className="text-center">
              <p className="text-2xl font-black text-orange-400">97%</p>
              <p className="text-xs text-zinc-500 mt-1">Would<br />recommend</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-4 overflow-hidden">
        {/* Row 1 — left to right */}
        <div className="flex gap-4 animate-marquee w-max">
          {row1.map((r, i) => (
            <ReviewCard key={`r1-${i}`} review={r} featured={i % 4 === 0} />
          ))}
        </div>
        {/* Row 2 — right to left */}
        <div
          className="flex gap-4 w-max"
          style={{ animation: "marquee 26s linear infinite reverse" }}
        >
          {row2.map((r, i) => (
            <ReviewCard key={`r2-${i}`} review={r} featured={i % 3 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
