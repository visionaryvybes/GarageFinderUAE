"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Scale, AlertTriangle, ChevronRight, RefreshCw, Shield, Car, DollarSign } from "lucide-react";
import Link from "next/link";

type Law = {
  id: string;
  title: string;
  rule: string;
  fine?: string;
  category: string;
  severity: "high" | "medium" | "low";
};

const SEVERITY_COLORS: Record<string, string> = {
  high: "text-red-400 bg-red-600/10 border-red-600/20",
  medium: "text-amber-400 bg-amber-600/10 border-amber-600/20",
  low: "text-blue-400 bg-blue-600/10 border-blue-600/20",
};

export default function LawsPage() {
  const [laws, setLaws] = useState<Law[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(laws.map(l => l.category)))];

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setLaws(data.laws || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = category === "All" ? laws : laws.filter(l => l.category === category);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="border-b border-[#1a1a1a] bg-[#050505]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-2 text-xs text-zinc-600">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-400">UAE Laws</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-white mb-2">
                UAE Traffic <span className="text-amber-400">Laws</span>
              </h1>
              <p className="text-sm text-zinc-500">Know your rights and responsibilities on UAE roads.</p>
            </div>
            <button onClick={load} disabled={loading} className="shrink-0 p-2.5  border border-[#1a1a1a] bg-[#0a0a0a] text-zinc-500 hover:text-white hover:border-zinc-700 transition-all disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: AlertTriangle, label: "High Severity", color: "text-red-400", count: laws.filter(l => l.severity === "high").length },
              { icon: Shield, label: "Medium Severity", color: "text-amber-400", count: laws.filter(l => l.severity === "medium").length },
              { icon: Car, label: "Low Severity", color: "text-blue-400", count: laws.filter(l => l.severity === "low").length },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center py-3 px-2  bg-[#0a0a0a] border border-[#1a1a1a] text-center">
                <item.icon className={`w-4 h-4 ${item.color} mb-1`} />
                <span className="text-lg font-black text-white">{item.count}</span>
                <span className="text-[10px] text-zinc-600 leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none mb-6 pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5  text-xs font-semibold border whitespace-nowrap shrink-0 transition-all ${
                category === cat
                  ? "bg-amber-600/15 border-amber-600/30 text-amber-400"
                  : "bg-[#0a0a0a] border-[#1a1a1a] text-zinc-500 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="p-4  bg-amber-600/5 border border-amber-600/15 flex gap-3 mb-6">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/80 leading-relaxed">
            For guidance only. Always verify with official RTA and UAE government sources.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-28 " />)}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((law, i) => (
              <motion.div
                key={law.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-5  bg-[#0a0a0a] border border-[#1a1a1a] hover:border-zinc-700/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5  border ${SEVERITY_COLORS[law.severity]}`}>
                      {law.severity.toUpperCase()}
                    </span>
                    <span className="text-[10px] px-2 py-0.5  bg-[#111] border border-[#1e1e1e] text-zinc-500 font-semibold">
                      {law.category}
                    </span>
                  </div>
                  {law.fine && (
                    <div className="flex items-center gap-1 text-red-400 text-xs font-bold shrink-0">
                      <DollarSign className="w-3 h-3" />
                      {law.fine}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-sm text-white mb-2">{law.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{law.rule}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
