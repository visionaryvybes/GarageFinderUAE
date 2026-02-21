"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShieldCheck, Users, ArrowRight, Sparkles, Zap } from "lucide-react";

interface HeroProps {
  onSearch: (query: string, isAI?: boolean) => void;
}

const TICKER_ITEMS = [
  "BMW M3 oil leak",
  "AC not cooling",
  "Check engine light",
  "Brake noise on turn",
  "Transmission service",
  "Tyre rotation Dubai",
  "Ceramic coating",
  "Pre-purchase inspection",
];

const QUICK_TAGS = [
  { label: "Oil Change", emoji: "🛢️" },
  { label: "Brake Repair", emoji: "🔧" },
  { label: "Engine Check", emoji: "⚙️" },
  { label: "AC Service", emoji: "❄️" },
  { label: "Tyre Change", emoji: "🏎️" },
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
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{ minHeight: "90vh" }}
    >
      {/* ── Background image ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="Premium automotive workshop"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Multi-layer overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Animated gradient blobs ── */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] z-0 pointer-events-none animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute top-20 left-80 w-[300px] h-[300px] rounded-full bg-orange-600/6 blur-[80px] z-0 pointer-events-none animate-[float_10s_ease-in-out_infinite_2s]" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-start justify-center min-h-[90vh] px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="w-full max-w-2xl space-y-7">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-600/8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-blue-300/80">
              Live · AI-Powered · 450+ Verified UAE Shops
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-[76px] font-black tracking-tighter leading-[0.9] text-white">
              Find the Best
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-white">
                Auto Care
              </span>
              <br />
              in the UAE.
            </h1>
          </motion.div>

          {/* Animated ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-3"
          >
            <span className="text-sm text-zinc-500 shrink-0">Drivers searching:</span>
            <div className="overflow-hidden h-6 flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={tickerIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-semibold text-zinc-300 whitespace-nowrap"
                >
                  &ldquo;{TICKER_ITEMS[tickerIndex]}&rdquo;
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Search input ── */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="w-full max-w-xl"
          >
            <div className="relative group">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-600/40 via-blue-400/20 to-blue-600/40 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
              <div className="relative flex items-center bg-zinc-950/90 backdrop-blur-md border border-zinc-800 group-focus-within:border-blue-500/50 rounded-2xl p-1.5 shadow-2xl transition-all duration-300">
                <Sparkles className="w-4 h-4 text-blue-500/60 ml-3 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your car problem or service needed..."
                  className="flex-1 bg-transparent border-none outline-none text-white px-3 py-3 placeholder:text-zinc-600 text-sm"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">AI Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.form>

          {/* Quick tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag.label}
                onClick={() => onSearch(tag.label, true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-black/50 backdrop-blur-sm text-xs font-semibold text-zinc-400 hover:text-white hover:border-blue-500/30 hover:bg-blue-600/8 transition-all duration-200"
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
            transition={{ delay: 0.62 }}
            className="flex flex-wrap gap-6 pt-5 border-t border-zinc-800/60"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 border-2 border-black" />
                ))}
              </div>
              <span className="text-zinc-500 text-xs font-medium">15k+ drivers</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>4.9 avg rating</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Verified shops only</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>All 7 Emirates</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom stats bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 z-10"
      >
        <div className="backdrop-blur-md bg-black/70 border-t border-zinc-800/60 px-6 md:px-16 lg:px-24 py-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "450+", label: "Verified Shops" },
              { value: "23", label: "Service Types" },
              { value: "7", label: "Emirates" },
              { value: "< 2min", label: "Avg Response" },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="text-lg sm:text-2xl font-black text-white tabular-nums">{stat.value}</p>
                <p className="text-[11px] text-zinc-600 font-medium tracking-wide uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
