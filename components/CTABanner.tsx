"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Zap, ShieldCheck } from "lucide-react";

interface CTABannerProps {
  onSearch: (query: string, isAI?: boolean) => void;
}

export default function CTABanner({ onSearch }: CTABannerProps) {
  return (
    <section className="py-24 bg-[#0a0a0a] border-grid-b border-grid-t">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden border border-white bg-[#000]"
        >
          {/* Custom Structural UI Elements */}
          <div className="absolute top-0 right-0 w-16 h-16 border-l border-b border-white/20 bg-white/5" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-r border-t border-white/20 bg-white/5" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          <div className="relative z-10 p-12 md:p-24 flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-white bg-white text-black mb-10">
              <Zap className="w-4 h-4 text-black" />
              <span className="text-xs font-black tracking-widest uppercase">DIRECT AI INTERFACE</span>
            </div>

            <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-6 uppercase leading-[0.9]">
              INITIALIZE
              <br />
              <span className="text-zinc-600">
                REPAIR SEQUENCE
              </span>
            </h2>
            <p className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase leading-relaxed mb-12 max-w-lg mx-auto">
              INPUT DIAGNOSTIC DATA AND WE WILL INSTANTLY PROCESS AND LOCATE VERIFIED MECHANICAL FACILITIES IN YOUR PROXIMITY.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full max-w-2xl">
              <button
                onClick={() => onSearch("auto repair near me", false)}
                className="group flex-1 w-full inline-flex items-center justify-center gap-3 px-8 py-5 border border-white bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                <span className="text-xs font-black tracking-widest uppercase">SCAN FOR MECHANICS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onSearch("spare parts UAE", false)}
                className="flex-1 w-full inline-flex items-center justify-center gap-3 px-8 py-5 border border-white/20 bg-[#050505] text-white hover:border-white hover:bg-white/5 transition-colors"
              >
                <span className="text-xs font-black tracking-widest uppercase">LOCATE HARDWARE</span>
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center flex-wrap gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-white" />
                <span>12 MINUTE PING</span>
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>SECURE FACILITIES</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
