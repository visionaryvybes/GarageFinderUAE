"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 14 },
  },
};

const SHOP_CARDS = [
  { name: "FastFix Al Quoz", rating: "4.9", reviews: "342", open: true },
  { name: "Emirates Motors", rating: "4.8", reviews: "187", open: true },
  { name: "Gulf Auto Care", rating: "4.7", reviews: "521", open: false },
];

const TIMELINE_STEPS = [
  { label: "Booked", done: true },
  { label: "On the Way", done: true },
  { label: "In Progress", done: false, active: true },
  { label: "Done ✓", done: false },
];

export default function WhyUs() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 800, damping: 80 });
  const springY = useSpring(mouseY, { stiffness: 800, damping: 80 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <section className="bg-[#09090b] py-20 sm:py-24 lg:py-32 overflow-hidden">
      <motion.div
        className="mx-auto max-w-7xl px-5 md:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="text-center mb-12 lg:mb-16" variants={itemVariants}>
          <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-4">
            How GarageUAE Works
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Three moves.
            <br />
            <span className="text-zinc-500">Your car is sorted.</span>
          </h2>
          <p className="mt-5 text-lg text-zinc-500 max-w-lg mx-auto">
            From first symptom to confirmed booking — in minutes, not days.
          </p>
        </motion.div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">

          {/* Step 1 — Large hero card (left, 2/3 width, 2 rows tall) */}
          <motion.div
            ref={cardRef}
            variants={itemVariants}
            className="relative rounded-2xl border border-violet-500/20 bg-gradient-to-br from-[#111113] to-[#0d0d10] p-7 lg:p-9 lg:col-span-2 lg:row-span-2 flex flex-col overflow-hidden min-h-[360px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
          >
            {/* Cursor glow */}
            {isHovered && (
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(450px circle at ${springX.get()}px ${springY.get()}px, rgba(139,92,246,0.12) 0%, transparent 70%)`,
                }}
              />
            )}

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <span className="text-xs font-black tracking-widest text-violet-400 uppercase">Step 01</span>
              <div className="flex-1 h-px bg-violet-500/20" />
            </div>

            <div className="relative z-10 mb-8">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Describe the problem</h3>
              <p className="text-zinc-400">In plain language. Our AI handles the rest.</p>
            </div>

            {/* Mock chat UI */}
            <div className="relative z-10 flex flex-col gap-3 flex-1 justify-end">
              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-[75%] bg-violet-600/25 border border-violet-500/25 rounded-2xl rounded-br-md px-4 py-3 text-sm text-white leading-relaxed">
                  My car vibrates at 100km/h on Sheikh Zayed Road
                </div>
              </div>
              {/* AI response */}
              <div className="flex justify-start">
                <div className="max-w-[82%] bg-[#1a1a20] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3">
                  <p className="text-[11px] font-bold text-violet-400 mb-1.5 uppercase tracking-wide">AI Advisor</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Likely wheel balancing or alignment — common after UAE highway driving. Estimated cost: <span className="text-orange-400 font-semibold">AED 80–180</span>. I found 4 specialists near you open now.
                  </p>
                </div>
              </div>
              {/* Input bar */}
              <div className="flex items-center gap-2 bg-[#111113] border border-white/[0.07] rounded-xl px-4 py-3 mt-2">
                <span className="text-sm text-zinc-600 flex-1">Describe your car issue…</span>
                <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2 — Top-right card */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-[#111113] to-[#0d0d10] p-6 lg:col-span-1 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-black tracking-widest text-orange-400 uppercase">Step 02</span>
              <div className="flex-1 h-px bg-orange-500/20" />
            </div>
            <h3 className="text-xl font-black text-white mb-1">Pick your garage</h3>
            <p className="text-sm text-zinc-400 mb-5">Real ratings. Real prices. Available now.</p>

            {/* Mini shop cards */}
            <div className="space-y-2 flex-1">
              {SHOP_CARDS.map((shop, i) => (
                <div key={i} className="flex items-center justify-between bg-[#0f0f12] border border-white/[0.05] rounded-xl px-3 py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">{shop.name}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      <span className="text-orange-400">★</span> {shop.rating} ({shop.reviews})
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    shop.open
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : "bg-zinc-700/50 text-zinc-500 border border-zinc-700/50"
                  }`}>
                    {shop.open ? "Open" : "Closed"}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Step 3 — Bottom-right card */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#111113] to-[#0d0d10] p-6 lg:col-span-1 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">Step 03</span>
              <div className="flex-1 h-px bg-emerald-500/20" />
            </div>
            <h3 className="text-xl font-black text-white mb-1">Drive in, sorted.</h3>
            <p className="text-sm text-zinc-400 mb-6">Confirmed. Tracked. No surprises.</p>

            {/* Timeline */}
            <div className="flex-1 flex flex-col justify-center space-y-0">
              {TIMELINE_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      step.done
                        ? "bg-emerald-500 border-emerald-500"
                        : step.active
                          ? "border-orange-400 bg-orange-500/20"
                          : "border-zinc-700 bg-transparent"
                    }`}>
                      {step.done && (
                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {step.active && <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />}
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div className={`w-px h-8 mt-1 ${step.done ? "bg-emerald-500/40" : "bg-zinc-800"}`} />
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${
                    step.done ? "text-emerald-400" : step.active ? "text-orange-400" : "text-zinc-600"
                  }`}>
                    {step.label}
                  </span>
                  {step.active && (
                    <span className="ml-auto text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
