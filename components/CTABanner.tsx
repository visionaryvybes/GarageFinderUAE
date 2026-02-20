"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Zap, ShieldCheck } from "lucide-react";

interface CTABannerProps {
  onSearch: (query: string, isAI?: boolean) => void;
}

export default function CTABanner({ onSearch }: CTABannerProps) {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-zinc-800"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900/80 to-zinc-950" />

          {/* Violet glow left */}
          <div className="absolute top-0 left-1/4 w-[300px] h-[200px] bg-violet-600/12 blur-[60px] rounded-full pointer-events-none" />
          {/* Orange glow right */}
          <div className="absolute bottom-0 right-1/4 w-[250px] h-[150px] bg-orange-600/8 blur-[50px] rounded-full pointer-events-none" />

          {/* Floating gear icon */}
          <div className="absolute top-6 right-8 text-5xl opacity-5 animate-[spin-slow_20s_linear_infinite] pointer-events-none select-none">⚙️</div>
          <div className="absolute bottom-6 left-8 text-4xl opacity-5 animate-[float_8s_ease-in-out_infinite] pointer-events-none select-none">🔧</div>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative z-10 p-10 md:p-16 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/25 bg-violet-600/8 mb-6">
              <Zap className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[11px] font-bold text-violet-400 tracking-wider uppercase">AI-Powered Search</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4 leading-tight">
              Ready to Get Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-200">
                Car Fixed Today?
              </span>
            </h2>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Tell us what&apos;s wrong in plain English. We&apos;ll instantly find the best verified mechanic near you.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <button
                onClick={() => onSearch("auto repair near me", false)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-bold text-sm shadow-xl shadow-violet-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Find a Mechanic Near Me
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSearch("spare parts UAE", false)}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 font-semibold text-sm hover:border-orange-500/30 hover:text-orange-300 transition-all"
              >
                Find Spare Parts
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-600">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-700" />
                Avg 12 min response
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                Verified shops only
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span>No registration required</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
