"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Clock, Award, MapPin, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    icon: Cpu,
    color: "text-blue-400",
    bg: "bg-blue-600/10 border-blue-600/20",
    title: "AI Diagnostics",
    desc: "Describe your problem in plain English. Our AI analyzes your issue and matches you instantly with the right specialist.",
    stat: "50+ data points",
  },
  {
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-600/10 border-emerald-600/20",
    title: "Verified Mechanics",
    desc: "Every shop is vetted for certifications, insurance, and customer satisfaction. No guesswork, no shady quotes.",
    stat: "450+ verified",
  },
  {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-600/10 border-amber-600/20",
    title: "Book in 60 Seconds",
    desc: "See real-time availability, compare transparent pricing, and book instantly. Average response time: 12 minutes.",
    stat: "12 min avg",
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-600/5 blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-3">Why Choose Us</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4">
            15,000+ Drivers Trust
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
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
              className="glow-card relative p-7 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-zinc-700/60 transition-all duration-300 group overflow-hidden"
            >
              {/* Top-right number */}
              <span className="absolute top-5 right-5 text-4xl font-black text-[#111] select-none group-hover:text-[#151515] transition-colors">
                0{i + 1}
              </span>

              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 ${feat.bg}`}>
                <feat.icon className={`w-6 h-6 ${feat.color}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-4">{feat.desc}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-blue-400">{feat.stat}</span>
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
              className="flex items-center gap-4 px-5 py-4 rounded-xl bg-[#080808] border border-[#1a1a1a] hover:border-zinc-800 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center shrink-0">
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
