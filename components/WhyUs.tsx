"use client";

import { motion } from "framer-motion";
import { Cpu, ShieldCheck, Clock, Award, MapPin, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    icon: Cpu,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    title: "AI-Powered Search",
    desc: "Describe your car problem in plain language. Our AI understands symptoms and finds the right specialists instantly.",
    stat: "50+ data signals",
    statColor: "text-violet-400",
  },
  {
    icon: ShieldCheck,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    title: "Verified Shops Only",
    desc: "Every listed shop is verified for certifications and service quality. No fake reviews, no misleading quotes.",
    stat: "450+ verified locations",
    statColor: "text-orange-400",
  },
  {
    icon: Clock,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    title: "Fast Response",
    desc: "Check live availability, compare pricing, and connect with the right shop. Average response in under 12 minutes.",
    stat: "12 min avg response",
    statColor: "text-cyan-400",
  },
];

const SECONDARY = [
  { icon: Award, label: "Top Quality Only", desc: "4.3+ rating minimum" },
  { icon: MapPin, label: "All 7 Emirates", desc: "UAE-wide coverage" },
  { icon: TrendingUp, label: "Live Data", desc: "Updated every 24h" },
];

export default function WhyUs() {
  return (
    <section className="py-20 md:py-28 bg-[#09090b] overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/4 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <span className="badge-orange mb-4 inline-block">Why GarageUAE</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mt-3">
            15,000+ drivers trust us
          </h2>
          <p className="text-zinc-500 mt-4 text-base max-w-xl mx-auto">
            The smarter way to find auto care across the UAE — from Dubai to Fujairah.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-[#111113] border ${feat.border} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-default`}
            >
              <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-5`}>
                <feat.icon className={`w-6 h-6 ${feat.color}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-5">{feat.desc}</p>
              <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${feat.statColor}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {feat.stat}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="bg-[#111113] border border-white/[0.07] rounded-2xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]"
        >
          {SECONDARY.map((item) => (
            <div key={item.label} className="flex items-center gap-4 p-5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
