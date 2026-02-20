"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { TrendingUp } from "lucide-react";

function Counter({
  value,
  label,
  suffix = "",
  prefix = "",
  sublabel,
}: {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  sublabel?: string;
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
        <span className="text-blue-500">{suffix}</span>
      </motion.div>
      <p className="text-zinc-400 font-semibold text-sm">{label}</p>
      {sublabel && <p className="text-zinc-700 text-[11px] mt-0.5">{sublabel}</p>}
    </div>
  );
}

export default function LiveStats() {
  return (
    <section className="py-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#080808] overflow-hidden">
          {/* Top label */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-[#1a1a1a]">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Platform Stats · Updated Daily</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1a1a1a]">
            <Counter
              value={15420}
              label="Repairs Completed"
              sublabel="across all UAE"
            />
            <Counter
              value={98}
              label="Customer Satisfaction"
              suffix="%"
              sublabel="based on 8,200+ reviews"
            />
            <Counter
              value={450}
              label="Active Workshops"
              suffix="+"
              sublabel="in 7 emirates"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
