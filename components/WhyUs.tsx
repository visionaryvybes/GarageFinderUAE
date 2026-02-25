"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Clock, Award, MapPin, TrendingUp, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: Cpu,
    title: "AI DIAGNOSTICS",
    desc: "INPUT YOUR AUTOMOTIVE ANOMALY IN PLAIN TEXT. OUR ALGORITHM PROCESSES THE SYMPTOMS AND DIRECTS YOU TO THE APPROPRIATE SPECIALIST INSTANTLY.",
    stat: "50+ DATA VECTORS",
  },
  {
    icon: ShieldCheck,
    title: "VERIFIED NODES",
    desc: "EVERY LISTED FACILITY HAS BEEN AUDITED FOR CERTIFICATIONS AND SERVICE QUALITY. NO UNVERIFIED PROTOCOLS. NO UNDOCUMENTED QUOTES.",
    stat: "450+ SECURE LOCATIONS",
  },
  {
    icon: Clock,
    title: "RAPID DEPLOYMENT",
    desc: "MONITOR LIVE AVAILABILITY STATUS, ANALYZE PRICING METRICS, AND INITIATE BOOKING SEQUENCES. AVERAGE RESPONSE LATENCY IS 12 MINUTES.",
    stat: "12 MIN PING",
  },
];

const SECONDARY = [
  { icon: Award, label: "ELITE STATUS ONLY", desc: "4.3+ RATING FLOOR" },
  { icon: MapPin, label: "FULL GRID COVERAGE", desc: "ALL 7 EMIRATES ACTIVE" },
  { icon: TrendingUp, label: "LIVE TELEMETRY", desc: "24HR SYNC CYCLE" },
];

export default function WhyUs() {
  return (
    <section className="py-24 bg-[#0a0a0a] border-grid-t border-grid-b overflow-hidden relative">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 border-l-4 border-white pl-6"
        >
          <div className="flex items-center gap-3 mb-6 bg-white text-black w-fit px-4 py-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-widest">
              SYSTEM INTEGRITY
            </h2>
          </div>
          <h3 className="text-3xl md:text-6xl font-black tracking-tighter text-white uppercase leading-[0.9] max-w-4xl">
            15,000+ OPERATORS
            <br />
            RELY ON THIS INTERFACE
          </h3>
        </motion.div>

        {/* Primary features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white bg-[#000] mb-12">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 md:p-12 relative group hover:bg-white transition-colors duration-500 border-b md:border-b-0 ${i !== 2 ? "md:border-r border-white/20 hover:border-white" : "border-white/20 hover:border-white"
                }`}
            >
              <div className="absolute top-0 right-0 w-12 h-12 border-l border-b border-white/20 group-hover:border-black flex items-center justify-center bg-[#050505] group-hover:bg-black transition-colors">
                <span className="text-[10px] font-black text-white">0{i + 1}</span>
              </div>

              <div className="w-16 h-16 border border-white/20 group-hover:border-black flex items-center justify-center mb-8 bg-[#050505] group-hover:bg-transparent transition-colors">
                <feat.icon className="w-8 h-8 text-white group-hover:text-black" />
              </div>
              <h4 className="text-2xl font-black text-white group-hover:text-black uppercase tracking-tighter mb-4">{feat.title}</h4>
              <p className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-800 uppercase tracking-widest leading-loose mb-8 h-24">
                {feat.desc}
              </p>

              <div className="pt-6 border-t border-white/20 group-hover:border-black/20 mt-auto">
                <span className="text-[11px] font-black text-white group-hover:text-black uppercase tracking-widest">
                  &gt; {feat.stat}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary metric datablocks */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-white/20 bg-[#050505]"
        >
          {SECONDARY.map((item, i) => (
            <div
              key={item.label}
              className={`flex items-start gap-4 p-6 hover:bg-white/5 transition-colors border-b sm:border-b-0 ${i !== 2 ? "sm:border-r border-white/20" : ""
                }`}
            >
              <div className="w-10 h-10 border border-white/20 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-black tracking-widest uppercase text-white mb-1">{item.label}</p>
                <p className="text-[9px] font-bold tracking-widest uppercase text-zinc-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
