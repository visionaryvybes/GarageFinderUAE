"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Shield, Star, Users, Zap } from "lucide-react";

interface HeroProps {
  onSearch: (query: string, isAI?: boolean) => void;
}

const TICKER_ITEMS = [
  "BMW oil change Dubai",
  "AC repair Abu Dhabi",
  "Check engine light",
  "Brake service Sharjah",
  "Tyre replacement",
  "Pre-purchase inspection",
];

const QUICK_TAGS = [
  { label: "Oil Change", emoji: "🛢️" },
  { label: "Brake Repair", emoji: "🔧" },
  { label: "AC Service", emoji: "❄️" },
  { label: "Engine Check", emoji: "⚙️" },
  { label: "Tyre Change", emoji: "🏎️" },
  { label: "Car Wash", emoji: "✨" },
];

export default function Hero({ onSearch }: HeroProps) {
  const [query, setQuery] = useState("");
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((i) => (i + 1) % TICKER_ITEMS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query, true);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#09090b]" style={{ minHeight: "85vh" }}>
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="Premium automotive workshop"
          fill
          priority
          className="object-cover object-center opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/70 via-[#09090b]/40 to-[#09090b]" />
      </div>

      {/* Glow blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-orange-500/8 blur-3xl z-0 pointer-events-none" />
      <div className="absolute top-[-50px] right-[-100px] w-[400px] h-[400px] rounded-full bg-violet-500/6 blur-3xl z-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-center min-h-[85vh] px-5 md:px-12 lg:px-20 max-w-6xl mx-auto pb-20 md:pb-0">
        <div className="w-full max-w-xl space-y-6">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="text-[11px] font-semibold text-orange-300">
              Live · AI-Powered · 450+ Verified UAE Shops
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
              Book UAE&apos;s Top
              <br />
              <span className="text-gradient-orange">Garages.</span>
              <br />
              Instantly.
            </h1>
          </motion.div>

          {/* Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2.5"
          >
            <span className="text-sm text-zinc-500 shrink-0">Drivers searching:</span>
            <div className="overflow-hidden h-6 flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={tickerIndex}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="text-sm font-semibold text-zinc-300 whitespace-nowrap"
                >
                  &ldquo;{TICKER_ITEMS[tickerIndex]}&rdquo;
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Search input */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            onSubmit={handleSubmit}
            className="w-full"
          >
            <div className="relative flex items-center bg-[#111113] border border-white/10 rounded-2xl p-1.5 shadow-xl focus-within:border-orange-500/40 focus-within:shadow-orange-500/10 focus-within:shadow-2xl transition-all duration-300">
              <Sparkles className="w-4 h-4 text-orange-500/60 ml-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your car issue or service..."
                className="flex-1 bg-transparent border-none outline-none text-white px-3 py-3 placeholder:text-zinc-600 text-sm"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/25 active:scale-95 shrink-0"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Find Open Garages</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>

          {/* Quick tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.44 }}
            className="flex flex-wrap gap-2"
          >
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag.label}
                onClick={() => onSearch(tag.label, true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs font-medium text-zinc-400 hover:text-white hover:border-orange-500/30 hover:bg-orange-500/8 transition-all duration-200 active:scale-95"
              >
                <span>{tag.emoji}</span>
                {tag.label}
              </button>
            ))}
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap gap-4 pt-4 border-t border-white/[0.07]"
          >
            {/* Open Now — #1 urgency signal */}
            <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>89 open right now</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-medium">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>4.9 avg · 2,400+ reviews</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-medium">
              <Shield className="w-3.5 h-3.5 text-orange-400" />
              <span>Verified shops only</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-medium">
              <Users className="w-3.5 h-3.5 text-orange-400" />
              <span>15,000+ UAE drivers</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        className="absolute bottom-16 md:bottom-0 left-0 right-0 z-10"
      >
        <div className="bg-[#09090b]/90 backdrop-blur-xl border-t border-white/[0.07] px-5 md:px-12 lg:px-20 py-4">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "450+", label: "Verified Shops" },
              { value: "23", label: "Service Types" },
              { value: "7", label: "Emirates" },
              { value: "< 2min", label: "Response Time" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">{stat.value}</p>
                <p className="text-[11px] text-zinc-400 font-medium tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
