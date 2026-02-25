"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper, CalendarDays, Scale, AlertTriangle, Clock,
  ChevronRight, ExternalLink, RefreshCw, MapPin, Zap,
  TrendingUp, Shield, Car, Flame, Tag,
} from "lucide-react";
import Link from "next/link";

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  date: string;
  readTime: string;
  urgent: boolean;
  imageKeyword: string;
  url?: string;
  isLive?: boolean;
};

type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  venue: string;
  type: string;
  description: string;
  free: boolean;
};

type Law = {
  id: string;
  title: string;
  rule: string;
  fine?: string;
  blackPoints?: number;
  category: string;
  severity: "high" | "medium" | "low";
};

const TAB_ICONS = { news: Newspaper, events: CalendarDays, laws: Scale };

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Laws:    { color: "text-amber-400",   bg: "bg-amber-600/10",   border: "border-amber-600/20",   icon: Scale      },
  Events:  { color: "text-purple-400",  bg: "bg-purple-600/10",  border: "border-purple-600/20",  icon: CalendarDays },
  Market:  { color: "text-blue-400",    bg: "bg-blue-600/10",    border: "border-blue-600/20",    icon: TrendingUp },
  EV:      { color: "text-emerald-400", bg: "bg-emerald-600/10", border: "border-emerald-600/20", icon: Zap        },
  Safety:  { color: "text-red-400",     bg: "bg-red-600/10",     border: "border-red-600/20",     icon: Shield     },
  Traffic: { color: "text-orange-400",  bg: "bg-orange-600/10",  border: "border-orange-600/20",  icon: Car        },
};

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  high:   { color: "text-red-400",    bg: "bg-red-600/10",    border: "border-red-600/20",    label: "HIGH RISK"  },
  medium: { color: "text-amber-400",  bg: "bg-amber-600/10",  border: "border-amber-600/20",  label: "MEDIUM"     },
  low:    { color: "text-blue-400",   bg: "bg-blue-600/10",   border: "border-blue-600/20",   label: "LOW RISK"   },
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  Race:       "bg-red-600/15 border-red-600/30 text-red-400",
  Exhibition: "bg-blue-600/15 border-blue-600/30 text-blue-400",
  Show:       "bg-purple-600/15 border-purple-600/30 text-purple-400",
  Meetup:     "bg-emerald-600/15 border-emerald-600/30 text-emerald-400",
  Auction:    "bg-amber-600/15 border-amber-600/30 text-amber-400",
};

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const cfg = CATEGORY_CONFIG[item.category] || {
    color: "text-zinc-400", bg: "bg-zinc-800/30", border: "border-zinc-700/30", icon: Tag,
  };
  const Icon = cfg.icon;

  return (
    <motion.a
      href={item.url || "#"}
      target={item.url ? "_blank" : undefined}
      rel={item.url ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group flex flex-col h-full p-5  bg-[#0a0a0a] border border-[#1a1a1a] hover:border-zinc-700/60 hover:bg-[#0d0d0d] transition-all cursor-pointer"
    >
      {/* Category bar */}
      <div className={`flex items-center gap-1.5 px-2.5 py-1  ${cfg.bg} border ${cfg.border} w-fit mb-4`}>
        <Icon className={`w-3 h-3 ${cfg.color}`} />
        <span className={`text-[10px] font-bold tracking-wider uppercase ${cfg.color}`}>{item.category}</span>
      </div>

      {/* Breaking indicator */}
      {item.urgent && (
        <div className="flex items-center gap-1.5 mb-3">
          <Flame className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Breaking</span>
        </div>
      )}

      {/* Title */}
      <h3 className="font-bold text-[15px] text-zinc-100 group-hover:text-white transition-colors leading-snug mb-3 flex-1">
        {item.title}
      </h3>

      {/* Summary */}
      <p className="text-[13px] text-zinc-500 leading-relaxed mb-4 line-clamp-2">{item.summary}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-zinc-500">{item.source}</span>
          <span className="w-1 h-1  bg-zinc-800" />
          <span className="flex items-center gap-1 text-[11px] text-zinc-700">
            <Clock className="w-3 h-3" />
            {item.readTime}
          </span>
          <span className="w-1 h-1  bg-zinc-800" />
          <span className="text-[11px] text-zinc-700">{item.date}</span>
        </div>
        <div className="flex items-center gap-2">
          {item.isLive && (
            <span className="text-[9px] font-bold px-1.5 py-0.5  bg-emerald-600/15 border border-emerald-600/25 text-emerald-400 uppercase tracking-wider">
              Live
            </span>
          )}
          <ExternalLink className={`w-3.5 h-3.5 transition-colors ${item.url ? "text-zinc-600 group-hover:text-blue-400" : "text-zinc-800"}`} />
        </div>
      </div>
    </motion.a>
  );
}

function EventCard({ ev, index }: { event?: never; ev: Event; index: number }) {
  const typeColor = EVENT_TYPE_COLORS[ev.type] || "bg-zinc-800 border-zinc-700 text-zinc-400";
  const monthPart = ev.date.split(" ")[0];
  const yearPart = ev.date.split(" ").slice(1).join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group flex gap-5 p-5  bg-[#0a0a0a] border border-[#1a1a1a] hover:border-zinc-700/50 hover:bg-[#0d0d0d] transition-all cursor-pointer"
    >
      {/* Date block */}
      <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16     border border-zinc-700/50 text-center">
        <span className="text-xl font-black text-white leading-none">{monthPart}</span>
        <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">{yearPart}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Tags row */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5  border ${typeColor}`}>
            {ev.type}
          </span>
          {ev.free && (
            <span className="text-[10px] font-bold px-2 py-0.5  bg-emerald-600/10 border border-emerald-600/20 text-emerald-400">
              Free Entry
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-bold text-[15px] text-white mb-1 group-hover:text-white leading-tight">{ev.name}</h3>
        <p className="text-[13px] text-zinc-500 leading-relaxed mb-2 line-clamp-2">{ev.description}</p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{ev.venue}, {ev.location}</span>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-blue-400 transition-colors shrink-0 self-center hidden sm:block" />
    </motion.div>
  );
}

function LawCard({ law, index }: { law: Law; index: number }) {
  const sev = SEVERITY_CONFIG[law.severity] || SEVERITY_CONFIG.low;
  const catCfg = Object.entries(CATEGORY_CONFIG).find(([k]) =>
    k.toLowerCase() === law.category.toLowerCase()
  )?.[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`p-5  bg-[#0a0a0a] border transition-colors ${
        law.severity === "high"
          ? "border-red-600/15 hover:border-red-600/30"
          : law.severity === "medium"
            ? "border-amber-600/15 hover:border-amber-600/25"
            : "border-[#1a1a1a] hover:border-zinc-700/40"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Severity pill */}
          <span className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1  border ${sev.bg} ${sev.border} ${sev.color}`}>
            <span className={`w-1.5 h-1.5  ${law.severity === "high" ? "bg-red-400 animate-pulse" : law.severity === "medium" ? "bg-amber-400" : "bg-blue-400"}`} />
            {sev.label}
          </span>
          {/* Category pill */}
          <span className={`text-[10px] font-bold px-2 py-0.5  border ${catCfg ? `${catCfg.bg} ${catCfg.border} ${catCfg.color}` : "bg-[#111] border-[#1e1e1e] text-zinc-500"}`}>
            {law.category}
          </span>
        </div>

        {/* Fine + black points */}
        <div className="flex items-center gap-2 shrink-0">
          {law.blackPoints ? (
            <div className="flex items-center gap-1 px-2.5 py-1  bg-zinc-800/60 border border-zinc-700/50">
              <span className="text-[10px] font-bold text-zinc-300">{law.blackPoints}</span>
              <span className="text-[10px] text-zinc-500">pts</span>
            </div>
          ) : null}
          {law.fine && (
            <div className="flex items-center gap-1 px-2.5 py-1  bg-red-950/40 border border-red-700/30">
              <span className="text-[10px] font-bold text-red-400">{law.fine}</span>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-[15px] text-white mb-2 leading-snug">{law.title}</h3>

      {/* Rule text */}
      <p className="text-[13px] text-zinc-400 leading-relaxed">{law.rule}</p>
    </motion.div>
  );
}

export default function NewsPage() {
  const [tab, setTab] = useState<"news" | "events" | "laws">("news");
  const [data, setData] = useState<{ news: NewsItem[]; events: Event[]; laws: Law[] }>({
    news: [], events: [], laws: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/news");
      const json = await res.json();
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const TABS = [
    { id: "news"   as const, label: "UAE Auto News", count: data.news.length   },
    { id: "events" as const, label: "Car Events",    count: data.events.length },
    { id: "laws"   as const, label: "Laws & Rules",  count: data.laws.length   },
  ];

  const highCount = data.laws.filter(l => l.severity === "high").length;
  const medCount  = data.laws.filter(l => l.severity === "medium").length;

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* ── Page header ── */}
      <div className="border-b border-[#1a1a1a] bg-[#050505]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-3 text-xs text-zinc-600">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-400">News & Events</span>
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-white mb-1">
                UAE Auto <span className="text-blue-400">Hub</span>
              </h1>
              <p className="text-sm text-zinc-500">
                Live news, upcoming car events, and UAE traffic laws — all in one place.
              </p>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2  border border-[#1a1a1a] bg-[#0a0a0a] text-xs font-semibold text-zinc-500 hover:text-white hover:border-zinc-700 transition-all disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Summary stats */}
          {!loading && !error && (
            <div className="flex gap-3 mt-4 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-2  bg-[#0a0a0a] border border-[#1a1a1a]">
                <Newspaper className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-bold text-zinc-300">{data.news.length} Articles</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2  bg-[#0a0a0a] border border-[#1a1a1a]">
                <CalendarDays className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-bold text-zinc-300">{data.events.length} Events</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2  bg-[#0a0a0a] border border-[#1a1a1a]">
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs font-bold text-zinc-300">{highCount} High-Risk Laws</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2  bg-[#0a0a0a] border border-[#1a1a1a]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-zinc-300">{medCount} Medium Laws</span>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 mt-5">
            {TABS.map((t) => {
              const Icon = TAB_ICONS[t.id];
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5  text-sm font-semibold border transition-all ${
                    isActive
                      ? "bg-blue-600/15 border-blue-600/30 text-blue-400"
                      : "bg-[#0a0a0a] border-[#1a1a1a] text-zinc-500 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.label}</span>
                  {t.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5  font-bold transition-colors ${
                      isActive ? "bg-blue-600/20 text-blue-300" : "bg-[#111] text-zinc-600"
                    }`}>
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-20 md:pb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-52 " />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16  bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-zinc-700" />
            </div>
            <p className="text-zinc-400 mb-4 font-semibold">Failed to load content</p>
            <button
              onClick={loadData}
              className="px-5 py-2.5 bg-blue-600 text-white  text-sm font-semibold hover:bg-blue-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* ── NEWS TAB ── */}
            {tab === "news" && (
              <motion.div
                key="news"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {data.news.length === 0 ? (
                  <p className="text-zinc-600 text-center py-16">No news available</p>
                ) : (
                  <>
                    {/* Featured (first card full width) */}
                    {data.news[0] && (
                      <div className="mb-4">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Flame className="w-3.5 h-3.5 text-orange-400" /> Featured
                        </p>
                        <NewsCard item={data.news[0]} index={0} />
                      </div>
                    )}

                    {data.news.length > 1 && (
                      <>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 mt-6 flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Latest Updates
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {data.news.slice(1).map((item, i) => (
                            <NewsCard key={item.id} item={item} index={i + 1} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* ── EVENTS TAB ── */}
            {tab === "events" && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {data.events.length === 0 ? (
                  <p className="text-zinc-600 text-center py-16">No events available</p>
                ) : (
                  <>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 text-purple-400" /> Upcoming Events — 2026
                    </p>
                    {data.events.map((ev, i) => (
                      <EventCard key={ev.id} ev={ev} index={i} />
                    ))}
                  </>
                )}
              </motion.div>
            )}

            {/* ── LAWS TAB ── */}
            {tab === "laws" && (
              <motion.div
                key="laws"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Disclaimer */}
                <div className="p-4  bg-amber-600/5 border border-amber-600/15 flex gap-3 mb-6">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300/80 leading-relaxed">
                    This information is for guidance only. Always refer to official RTA and UAE government sources for the most up- regulations and fines.
                  </p>
                </div>

                {/* Stats row */}
                {data.laws.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: "High Risk", count: highCount, color: "text-red-400", bg: "bg-red-600/10", border: "border-red-600/20" },
                      { label: "Medium",    count: medCount,  color: "text-amber-400", bg: "bg-amber-600/10", border: "border-amber-600/20" },
                      { label: "Low Risk",  count: data.laws.filter(l => l.severity === "low").length, color: "text-blue-400", bg: "bg-blue-600/10", border: "border-blue-600/20" },
                    ].map(s => (
                      <div key={s.label} className={`text-center p-4  ${s.bg} border ${s.border}`}>
                        <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5 font-semibold">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {data.laws.length === 0 ? (
                  <p className="text-zinc-600 text-center py-16">No laws available</p>
                ) : (
                  <div className="space-y-3">
                    {/* High severity first */}
                    {["high", "medium", "low"].map(sev => {
                      const group = data.laws.filter(l => l.severity === sev);
                      if (!group.length) return null;
                      const sevCfg = SEVERITY_CONFIG[sev];
                      return (
                        <div key={sev}>
                          <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${sevCfg.color}`}>
                            <span className={`w-1.5 h-1.5  ${sev === "high" ? "bg-red-400" : sev === "medium" ? "bg-amber-400" : "bg-blue-400"}`} />
                            {sevCfg.label}
                          </p>
                          <div className="space-y-3 mb-6">
                            {group.map((law, i) => (
                              <LawCard key={law.id} law={law} index={i} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
