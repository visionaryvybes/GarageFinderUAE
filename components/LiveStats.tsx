"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { TrendingUp } from "lucide-react";
import Sparkline from "./Sparkline";

const SPARKLINE_DATA = {
  repairs: [8200, 9100, 9800, 10400, 11200, 12100, 13500, 14200, 15420],
  satisfaction: [91, 93, 94, 95, 96, 97, 97, 98, 98],
  workshops: [280, 310, 330, 360, 390, 410, 430, 445, 450],
};

function Counter({
  value,
  label,
  suffix = "",
  prefix = "",
  sublabel,
  sparkData,
  sparkColor = "#8b5cf6",
}: {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  sublabel?: string;
  sparkData?: number[];
  sparkColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, value, spring]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-6 py-8">
      <motion.div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-1 tabular-nums">
        {prefix}
        <motion.span>{display}</motion.span>
        <span className="text-blue-400">{suffix}</span>
      </motion.div>
      <p className="text-zinc-400 font-semibold text-sm mb-1">{label}</p>
      {sublabel && <p className="text-zinc-700 text-[11px] mb-3">{sublabel}</p>}
      {sparkData && (
        <div className="opacity-60">
          <Sparkline data={sparkData} color={sparkColor} width={80} height={24} />
        </div>
      )}
    </div>
  );
}

export default function LiveStats() {
  return (
    <section className="py-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden backdrop-blur-sm">
          {/* Top label */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-zinc-800/60">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Platform Stats · Updated Daily</span>
            <span className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-zinc-700 font-medium">Live</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/60">
            <Counter
              value={15420}
              label="Repairs Completed"
              sublabel="across all UAE"
              sparkData={SPARKLINE_DATA.repairs}
              sparkColor="#8b5cf6"
            />
            <Counter
              value={98}
              label="Customer Satisfaction"
              suffix="%"
              sublabel="based on 8,200+ reviews"
              sparkData={SPARKLINE_DATA.satisfaction}
              sparkColor="#10b981"
            />
            <Counter
              value={450}
              label="Active Workshops"
              suffix="+"
              sublabel="in 7 emirates"
              sparkData={SPARKLINE_DATA.workshops}
              sparkColor="#f97316"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
