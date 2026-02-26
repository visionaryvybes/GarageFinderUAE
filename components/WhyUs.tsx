"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useSpring } from "framer-motion";

/* ── Animated counter (same as in app/page.tsx) ─────────── */
function AnimCounter({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 55, damping: 15 });
  const [display, setDisplay] = useState("0");

  useEffect(() => spring.on("change", (v) =>
    setDisplay(decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString())
  ), [spring, decimals]);
  useEffect(() => { if (inView) spring.set(value); }, [inView, value, spring]);

  return <span ref={ref}>{display}{suffix}</span>;
}

const UAE_CITIES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "RAK", "Fujairah", "UAQ"];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 16 } },
};

export default function WhyUs() {
  return (
    <section className="bg-[#09090b] py-20 sm:py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-8">

        {/* Left-aligned heading (research: centered = generic) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 lg:mb-16"
        >
          <p className="text-xs font-black tracking-[0.2em] text-orange-500 uppercase mb-4">
            Why GarageUAE
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight max-w-2xl">
            The numbers
            <br />
            <span className="text-zinc-500">that matter.</span>
          </h2>
          <p className="mt-5 text-zinc-500 text-lg max-w-md">
            Real data. Live garages. No fluff.
          </p>
        </motion.div>

        {/* Asymmetric Bento Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ staggerChildren: 0.08 }}
        >

          {/* Hero cell — 8 cols, spans 2 rows: UAE Coverage */}
          <motion.div
            variants={cardVariants}
            className="sm:col-span-2 lg:col-span-8 lg:row-span-2 relative rounded-2xl border border-white/[0.06] bg-[#0f0f12] p-7 lg:p-9 overflow-hidden flex flex-col min-h-[260px] lg:min-h-[320px]"
          >
            {/* Subtle mesh gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-orange-500/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              <p className="text-xs font-bold tracking-widest text-zinc-600 uppercase mb-6">Coverage</p>

              {/* Big number */}
              <div className="mb-4">
                <p className="text-7xl sm:text-8xl font-black tracking-tighter text-white leading-none">
                  <AnimCounter value={850} suffix="+" />
                </p>
                <p className="text-lg text-zinc-400 font-medium mt-2">Verified garages across UAE</p>
              </div>

              {/* Emirates list */}
              <div className="mt-auto flex flex-wrap gap-2">
                {UAE_CITIES.map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1.5 rounded-full text-xs font-bold border border-white/[0.07] bg-white/[0.03] text-zinc-400"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stat: 15k+ Drivers */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-4 rounded-2xl border border-white/[0.06] bg-[#0f0f12] p-6 flex flex-col"
          >
            <p className="text-xs font-bold tracking-widest text-zinc-600 uppercase mb-4">Monthly Users</p>
            <p className="text-5xl sm:text-6xl font-black tracking-tighter text-orange-400 leading-none">
              <AnimCounter value={15} suffix="k+" />
            </p>
            <p className="text-zinc-500 text-sm font-medium mt-2 flex-1">UAE drivers trust GarageUAE every month</p>
          </motion.div>

          {/* Stat: 4.8★ Rating */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-4 rounded-2xl border border-white/[0.06] bg-[#0f0f12] p-6 flex flex-col"
          >
            <p className="text-xs font-bold tracking-widest text-zinc-600 uppercase mb-4">Avg. Rating</p>
            <p className="text-5xl sm:text-6xl font-black tracking-tighter text-amber-400 leading-none">
              <AnimCounter value={4.8} suffix="★" decimals={1} />
            </p>
            <p className="text-zinc-500 text-sm font-medium mt-2">Across 2,400+ verified reviews</p>
          </motion.div>

          {/* Feature: AI Diagnosis */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-4 rounded-2xl border border-white/[0.06] bg-[#0f0f12] p-6 flex flex-col"
          >
            <p className="text-xs font-bold tracking-widest text-zinc-600 uppercase mb-4">AI Search</p>
            <h3 className="text-xl font-black text-white mb-2 leading-tight">Diagnose before you book</h3>
            <p className="text-zinc-500 text-sm leading-relaxed flex-1">
              Describe any symptom. Our AI identifies the issue, estimates the AED cost, and matches the right workshop.
            </p>
            {/* Mini chat bubble visual */}
            <div className="mt-4 bg-[#0a0a0d] border border-white/[0.04] rounded-xl p-3 text-xs text-zinc-500">
              <span className="text-violet-400 font-semibold">AI: </span>
              Likely wheel balancing · Est. AED 80–180
            </div>
          </motion.div>

          {/* Stat: 12 min response */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-4 rounded-2xl border border-white/[0.06] bg-[#0f0f12] p-6 flex flex-col"
          >
            <p className="text-xs font-bold tracking-widest text-zinc-600 uppercase mb-4">Response Time</p>
            <p className="text-5xl sm:text-6xl font-black tracking-tighter text-emerald-400 leading-none">
              <AnimCounter value={12} suffix="min" />
            </p>
            <p className="text-zinc-500 text-sm font-medium mt-2">Average garage confirmation time</p>
          </motion.div>

          {/* Feature: Verified Only */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-4 rounded-2xl border border-white/[0.06] bg-[#0f0f12] p-6 flex flex-col"
          >
            <p className="text-xs font-bold tracking-widest text-zinc-600 uppercase mb-4">Quality</p>
            <h3 className="text-xl font-black text-white mb-2 leading-tight">Verified workshops only</h3>
            <p className="text-zinc-500 text-sm leading-relaxed flex-1">
              Every listed garage passes our quality check. Ratings are from real drivers — no fake reviews, no paid placements.
            </p>
            <div className="mt-4 flex gap-2">
              {["Vetted", "Real Reviews", "No Ads"].map((tag) => (
                <span key={tag} className="text-[10px] font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/8 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
