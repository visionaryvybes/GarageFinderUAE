"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Khalid A.",
    car: "BMW M5 · Dubai",
    text: "Saved 3,500 AED on a gearbox overhaul. The AI knew exactly which workshop specialises in M series. Incredible.",
    stars: 5,
    color: "from-blue-600/20 to-transparent",
  },
  {
    name: "Sarah M.",
    car: "Tesla Model Y · Abu Dhabi",
    text: "Finally a platform that actually understands EVs. Found a certified Tesla tech within 3 km of my flat in 2 minutes.",
    stars: 5,
    color: "from-emerald-600/20 to-transparent",
  },
  {
    name: "Marcus J.",
    car: "Land Rover Defender · Sharjah",
    text: "No more calling around garages all day. Booked a full service in under a minute. Shop was exactly as reviewed.",
    stars: 5,
    color: "from-amber-600/20 to-transparent",
  },
  {
    name: "Fatima R.",
    car: "Audi Q7 · Dubai",
    text: "Transparent pricing saved me from a massive overcharge at the dealership. The verified badge actually means something.",
    stars: 5,
    color: "from-purple-600/20 to-transparent",
  },
  {
    name: "David K.",
    car: "Porsche 911 · Abu Dhabi",
    text: "Used it for a pre-purchase inspection on a used 992. Mechanic was thorough and caught hidden rust damage. Worth every dirham.",
    stars: 5,
    color: "from-blue-600/20 to-transparent",
  },
  {
    name: "Omar H.",
    car: "Ferrari 488 · Dubai",
    text: "For exotic cars, finding a workshop you can trust is impossible. GarageFinder sent me to a specialist who actually knew the car.",
    stars: 5,
    color: "from-red-600/20 to-transparent",
  },
];

function ReviewCard({ review }: { review: (typeof REVIEWS)[0] }) {
  return (
    <div className="w-[360px] shrink-0 relative p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-zinc-700/50 transition-colors duration-300 overflow-hidden group">
      {/* Gradient tint */}
      <div className={`absolute inset-0 bg-gradient-to-br ${review.color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />

      <div className="relative z-10">
        {/* Quote icon */}
        <Quote className="w-6 h-6 text-zinc-800 mb-4" />

        {/* Stars */}
        <div className="flex gap-0.5 mb-3">
          {[...Array(review.stars)].map((_, j) => (
            <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          ))}
        </div>

        {/* Review text */}
        <p className="text-zinc-300 text-sm leading-relaxed mb-5 whitespace-normal">
          &ldquo;{review.text}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700 flex items-center justify-center text-sm font-black text-white">
            {review.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-white text-sm leading-tight">{review.name}</h4>
            <p className="text-zinc-600 text-xs mt-0.5">{review.car}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-2">Reviews</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-tight">
              Real Drivers,
              <br />
              Real Results.
            </h2>
          </div>
          <p className="text-zinc-500 max-w-xs text-sm leading-relaxed sm:text-right">
            Over 15,000 UAE drivers have found their trusted mechanic through GarageFinder.
          </p>
        </div>
      </div>

      {/* Scrolling ticker */}
      <div className="relative w-full">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-4"
          animate={{ x: [0, -((360 + 16) * REVIEWS.length)] }}
          transition={{ repeat: Infinity, duration: 55, ease: "linear" }}
        >
          {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
