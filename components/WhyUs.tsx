"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Clock, Award, MapPin, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    icon: Cpu,
    color: "text-violet-400",
    bg: "bg-violet-600/10 border-violet-600/20",
    glowColor: "bg-violet-600/5",
    title: "AI Diagnostics",
    desc: "Describe your problem in plain English. Our AI analyzes your issue and matches you instantly with the right specialist.",
    stat: "50+ data points",
    statColor: "text-violet-400",
    dot: "bg-violet-500",
  },
  {
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-600/10 border-emerald-600/20",
    glowColor: "bg-emerald-600/5",
    title: "Verified Mechanics",
    desc: "Every shop is vetted for certifications, insurance, and customer satisfaction. No guesswork, no shady quotes.",
    stat: "450+ verified",
    statColor: "text-emerald-400",
    dot: "bg-emerald-500",
  },
  {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-600/10 border-amber-600/20",
    glowColor: "bg-amber-600/5",
    title: "Book in 60 Seconds",
    desc: "See real-time availability, compare transparent pricing, and book instantly. Average response time: 12 minutes.",
    stat: "12 min avg",
    statColor: "text-amber-400",
    dot: "bg-amber-500",
  },
];

const SECONDARY = [
  { icon: Award, label: "Top-rated only", desc: "4.3+ stars minimum" },
  { icon: MapPin, label: "All 7 Emirates", desc: "Dubai, Abu Dhabi, Sharjah & more" },
  { icon: TrendingUp, label: "Live data", desc: "Updated every 24h" },
];

export default function WhyUs() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/5 blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-violet-500 tracking-widest uppercase mb-3">Why Choose Us</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4">
            15,000+ Drivers Trust
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-200">
              GarageFinder
            </span>
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed">
            We built this because finding a trustworthy mechanic in the UAE shouldn&apos;t feel like a gamble.
          </p>
        </motion.div>

        {/* Primary features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-7 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 group overflow-hidden"
            >
              {/* Subtle bg glow per feature */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${feat.glowColor} blur-3xl pointer-events-none`} />

              {/* Top-right number */}
              <span className="absolute top-5 right-5 text-4xl font-black text-zinc-800 select-none group-hover:text-zinc-700 transition-colors">
                0{i + 1}
              </span>

              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 ${feat.bg}`}>
                <feat.icon className={`w-6 h-6 ${feat.color}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-4">{feat.desc}</p>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${feat.dot}`} />
                <span className={`text-xs font-semibold ${feat.statColor}`}>{feat.stat}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {SECONDARY.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 px-5 py-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-200">{item.label}</p>
                <p className="text-xs text-zinc-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
