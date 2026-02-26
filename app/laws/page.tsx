"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Scale, AlertTriangle, RefreshCw, Shield, Car, DollarSign, Sparkles } from "lucide-react";
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
  low: "text-cyan-400 bg-cyan-600/10 border-cyan-600/20",
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">

      {/* ── Hero Banner ── */}
      <div className="border-b border-[var(--border)] bg-gradient-to-b from-amber-950/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-amber-500 blur-lg opacity-20" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600/20 to-amber-900/20 border border-amber-500/20 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link href="/" className="text-xs text-[var(--text-subtle)] hover:text-[var(--text-muted)] transition-colors">Home</Link>
                  <span className="text-[var(--text-subtle)] text-xs">/</span>
                  <span className="text-xs text-[var(--text-muted)]">UAE Traffic Laws</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-white">
                  UAE Traffic <span className="text-amber-400">Laws</span>
                </h1>
                <p className="text-sm text-[var(--text-muted)] mt-1">Know your rights and responsibilities on UAE roads.</p>
              </div>
            </div>
            <button onClick={load} disabled={loading}
              className="shrink-0 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-subtle)] hover:text-[var(--text)] hover:border-[var(--border-glow)] transition-all disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            {[
              { icon: AlertTriangle, label: "High Severity", color: "text-red-400", bg: "bg-red-500/10", count: laws.filter(l => l.severity === "high").length },
              { icon: Shield, label: "Medium Severity", color: "text-amber-400", bg: "bg-amber-500/10", count: laws.filter(l => l.severity === "medium").length },
              { icon: Car, label: "Low Severity", color: "text-cyan-400", bg: "bg-cyan-500/10", count: laws.filter(l => l.severity === "low").length },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center py-3 px-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center">
                <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center mb-1.5`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className="text-lg font-black text-white">{item.count}</span>
                <span className="text-[10px] text-[var(--text-subtle)] leading-tight">{item.label}</span>
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap shrink-0 transition-all ${
                category === cat
                  ? "bg-amber-600/15 border-amber-600/30 text-amber-400"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-subtle)] hover:border-[var(--border-glow)] hover:text-[var(--text-muted)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="rounded-2xl p-4 bg-amber-600/5 border border-amber-600/15 flex gap-3 mb-6">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/80 leading-relaxed">
            For guidance only. Always verify with official RTA and UAE government sources.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="shimmer h-28 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-12 text-center">
            <Scale className="w-10 h-10 text-[var(--border-glow)] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[var(--text-muted)]">No laws in this category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((law, i) => (
              <motion.div
                key={law.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.5) }}
                className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-glow)] transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${SEVERITY_COLORS[law.severity]}`}>
                      {law.severity.toUpperCase()}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-subtle)] font-semibold">
                      {law.category}
                    </span>
                  </div>
                  {law.fine && (
                    <div className="flex items-center gap-1 text-orange-400 text-xs font-bold shrink-0">
                      <DollarSign className="w-3 h-3" />
                      {law.fine}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-sm text-[var(--text)] mb-2">{law.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{law.rule}</p>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="mt-6 rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
            <p className="text-xs text-[var(--text-muted)]">
              Showing {filtered.length} law{filtered.length !== 1 ? "s" : ""}{category !== "All" ? ` in "${category}"` : ""}. Data sourced from UAE RTA guidelines.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
