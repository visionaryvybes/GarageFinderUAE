"use client";

import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";

const REVIEWS = [
  {
    name: "Mohammed Al Rashid",
    role: "BMW 5 Series · Dubai Marina",
    text: "Found the best BMW specialist in Dubai within minutes. Saved me hours of searching and the shop was verified and professional.",
    rating: 5,
    avatar: "M",
    color: "bg-orange-500",
  },
  {
    name: "Sarah Ahmed",
    role: "Toyota RAV4 · Abu Dhabi",
    text: "The AI search understood exactly what was wrong with my car — AC compressor issue. Directed me to the right specialist instantly.",
    rating: 5,
    avatar: "S",
    color: "bg-violet-500",
  },
  {
    name: "Khalid Hassan",
    role: "Mercedes GLC · Sharjah",
    text: "Best car service app in UAE. Found a certified Mercedes workshop near me with great reviews. Absolutely recommended.",
    rating: 5,
    avatar: "K",
    color: "bg-cyan-500",
  },
  {
    name: "Rania Yousef",
    role: "Honda CR-V · Ajman",
    text: "The parts search feature is incredible — found OEM parts for my Honda at a great price. Saved me a trip to 5 different shops.",
    rating: 5,
    avatar: "R",
    color: "bg-emerald-500",
  },
  {
    name: "Tariq Al Mansoori",
    role: "Nissan Patrol · Al Ain",
    text: "My Patrol had a transmission issue and this app found a specialist in under 3 minutes. Genuinely impressed with how fast it works.",
    rating: 5,
    avatar: "T",
    color: "bg-orange-500",
  },
  {
    name: "Fatima Al Zaabi",
    role: "Kia Sportage · Ras Al Khaimah",
    text: "Even in RAK, found great options. The app works across all 7 emirates which is amazing for those of us outside Dubai.",
    rating: 5,
    avatar: "F",
    color: "bg-pink-500",
  },
];

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  return (
    <div className="bg-[#111113] border border-white/[0.07] rounded-2xl p-5 w-[300px] shrink-0 hover:border-orange-500/20 transition-all">
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl ${review.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
          {review.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white leading-tight truncate">{review.name}</p>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{review.role}</p>
        </div>
        <Quote className="w-4 h-4 text-orange-500/30 ml-auto shrink-0" />
      </div>
      <div className="flex gap-0.5 mb-3">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">{review.text}</p>
    </div>
  );
}

export default function Testimonials() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <div className="py-20 bg-[#09090b] min-h-[400px]" />;

  const row1 = REVIEWS.slice(0, 3);
  const row2 = REVIEWS.slice(3, 6);

  return (
    <section className="py-20 md:py-28 bg-[#09090b] overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 md:px-8 mb-12 text-center">
        <span className="badge-orange mb-4 inline-block">User reviews</span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mt-3">
          Loved by UAE drivers
        </h2>
        <p className="text-zinc-500 mt-4 text-base">
          Thousands of happy customers across all 7 Emirates
        </p>
      </div>

      <div className="space-y-4 overflow-hidden">
        {/* Row 1 — forward */}
        <div className="flex gap-4 animate-marquee">
          {[...row1, ...row1].map((r, i) => (
            <ReviewCard key={`r1-${i}`} review={r} />
          ))}
        </div>
        {/* Row 2 — reverse */}
        <div className="flex gap-4" style={{ animation: "marquee 26s linear infinite reverse" }}>
          {[...row2, ...row2].map((r, i) => (
            <ReviewCard key={`r2-${i}`} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
