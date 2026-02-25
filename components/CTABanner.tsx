"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Wrench, Sparkles, Package, Clock, ShieldCheck } from "lucide-react";

interface CTABannerProps {
  onSearch: (query: string, isAI?: boolean) => void;
}

export default function CTABanner({ onSearch }: CTABannerProps) {
  return (
    <section className="py-20 md:py-28 bg-[#09090b] relative overflow-hidden">
      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/8 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-orange-500/10 via-[#111113] to-violet-500/8 border border-orange-500/20 rounded-3xl p-8 md:p-14 text-center relative overflow-hidden"
        >
          {/* Floating icons */}
          <div className="absolute top-6 left-6 w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
            <Wrench className="w-7 h-7 text-orange-400 animate-[float_6s_ease-in-out_infinite]" />
          </div>
          <div className="absolute top-6 right-6 w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
            <Package className="w-7 h-7 text-violet-400 animate-[float_8s_ease-in-out_infinite_2s]" />
          </div>

          <span className="badge-orange mb-5 inline-block">Get started free</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mt-2 mb-4">
            Find your perfect garage
            <br />
            <span className="text-gradient-orange">anywhere in the UAE</span>
          </h2>
          <p className="text-zinc-500 text-base max-w-md mx-auto mb-8">
            AI-powered search across 450+ verified workshops. From Dubai to Ras Al Khaimah — we&apos;ve got you covered.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <button
              onClick={() => onSearch("auto repair near me", false)}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              Find Garages
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/my-car"
              className="flex items-center gap-2.5 px-6 py-3.5 bg-violet-500/10 border border-violet-500/25 hover:bg-violet-500/15 text-violet-400 font-semibold rounded-2xl transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Try AI Car Advisor
            </Link>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-6 text-xs text-zinc-600">
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              12 min avg response
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
              Verified shops only
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
