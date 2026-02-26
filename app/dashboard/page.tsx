"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import {
  TrendingUp, Wrench, Package, Car,
  Star, Activity, Calendar, ArrowRight,
  Newspaper, Zap, Globe, Shield,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ExtendedPlaceResult } from "@/lib/mock-data";

// UAE Emirate data with static estimates + live overlay
const EMIRATE_DATA = [
  { name: "Dubai", garages: 850, parts: 320, color: "#8b5cf6" },
  { name: "Abu Dhabi", garages: 620, parts: 210, color: "#06b6d4" },
  { name: "Sharjah", garages: 380, parts: 145, color: "#10b981" },
  { name: "Ajman", garages: 140, parts: 55, color: "#f59e0b" },
  { name: "RAK", garages: 95, parts: 38, color: "#ef4444" },
  { name: "Fujairah", garages: 75, parts: 28, color: "#ec4899" },
  { name: "UAQ", garages: 45, parts: 18, color: "#a78bfa" },
];

// Simulated 7-day search activity
const SEARCH_TREND = [
  { day: "Mon", searches: 1240, garages: 340, parts: 180 },
  { day: "Tue", searches: 1580, garages: 420, parts: 210 },
  { day: "Wed", searches: 1920, garages: 510, parts: 260 },
  { day: "Thu", searches: 2180, garages: 590, parts: 310 },
  { day: "Fri", searches: 2640, garages: 680, parts: 290 },
  { day: "Sat", searches: 3120, garages: 820, parts: 410 },
  { day: "Sun", searches: 1890, garages: 480, parts: 240 },
];

// Rating distribution (simulated realistic distribution)
const RATING_DIST = [
  { range: "3.0–3.4", count: 45, fill: "#ef4444" },
  { range: "3.5–3.9", count: 120, fill: "#f59e0b" },
  { range: "4.0–4.4", count: 385, fill: "#8b5cf6" },
  { range: "4.5–4.9", count: 510, fill: "#10b981" },
  { range: "5.0", count: 68, fill: "#8b5cf6" },
];

const SERVICE_MIX = [
  { name: "Service Centres", value: 62, fill: "#8b5cf6" },
  { name: "Parts Stores", value: 23, fill: "#f97316" },
  { name: "Tyres & Wheels", value: 9, fill: "#10b981" },
  { name: "Detailing", value: 6, fill: "#8b5cf6" },
];

// UAE Calendar helper
function getCalendarData() {
  // UAE is UTC+4
  const now = new Date(Date.now() + 4 * 60 * 60 * 1000);
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const today = now.getUTCDate();
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const monthName = now.toLocaleString("en-US", { month: "long", timeZone: "Asia/Dubai" });
  return { year, month, today, firstDay, daysInMonth, monthName };
}

function UAECalendar() {
  const [uaeTime, setUaeTime] = useState(new Date(Date.now() + 4 * 60 * 60 * 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setUaeTime(new Date(Date.now() + 4 * 60 * 60 * 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { today, firstDay, daysInMonth, monthName, year } = getCalendarData();
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null as null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const timeStr = uaeTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Dubai",
  });
  const dayName = uaeTime.toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Dubai" });

  return (
    <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-zinc-500 font-semibold flex items-center gap-1">
            <Calendar className="w-3 h-3" /> UAE Time
          </p>
          <p className="text-2xl font-black text-[var(--text)] mt-0.5 font-mono">{timeStr}</p>
          <p className="text-[11px] text-zinc-500">{dayName} · UTC+4</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-[var(--text)]">{monthName}</p>
          <p className="text-xs text-zinc-600">{year}</p>
          <div className="flex items-center gap-1 mt-1 justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-500">Live</span>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map(d => (
          <div key={d} className="text-center text-[9px] font-semibold text-zinc-600 pb-1">{d}</div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={`aspect-square flex items-center justify-center text-[11px] rounded-md font-semibold transition-colors ${
              day === null ? "" :
              day === today
                ? "bg-orange-500 text-white font-black"
                : day % 7 === 6 || day % 7 === 0
                  ? "text-zinc-600"
                  : "text-zinc-400 hover:bg-[var(--surface-2)]"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: string | number; sub?: string; color: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
      style={{ background: `linear-gradient(135deg, ${color}08 0%, var(--surface) 100%)`, borderColor: color + "20" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] text-zinc-500 font-medium mb-1">{label}</p>
          <p className="text-2xl font-black" style={{ color }}>{value}</p>
          {sub && <p className="text-[10px] text-zinc-500 mt-0.5">{sub}</p>}
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + "15" }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
}

function LiveFeed() {
  const feeds = [
    { icon: "🔧", text: "New garage added in Al Quoz, Dubai", time: "2m ago", color: "bg-orange-500/10 border-orange-500/20" },
    { icon: "⭐", text: "FastFix Auto Center rated 4.9 (412 reviews)", time: "5m ago", color: "bg-amber-500/10 border-amber-500/20" },
    { icon: "📦", text: "OEM parts stock updated in Mussafah", time: "12m ago", color: "bg-violet-500/10 border-violet-500/20" },
    { icon: "🛞", text: "Tyre deals live at Emirates Motors, RAK", time: "18m ago", color: "bg-cyan-500/10 border-cyan-500/20" },
    { icon: "🤖", text: "AI search: 1,240 queries today", time: "Live", color: "bg-violet-500/10 border-violet-500/20" },
  ];
  return (
    <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
      <p className="text-xs text-zinc-500 font-semibold mb-3 flex items-center gap-1.5">
        <Activity className="w-3 h-3 text-emerald-400" /> Live Feed
        <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">● LIVE</span>
      </p>
      <div className="space-y-2">
        {feeds.map((f, i) => (
          <div key={i} className={`flex items-start gap-2.5 p-2 rounded-xl border ${f.color}`}>
            <span className="text-sm shrink-0">{f.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-[var(--text-muted)] leading-snug">{f.text}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">{f.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickNav() {
  const links = [
    { href: "/garages", label: "Find Garages", icon: Wrench, color: "#f97316", desc: "Service centres UAE-wide" },
    { href: "/parts", label: "Spare Parts", icon: Package, color: "#f59e0b", desc: "OEM, new & used parts" },
    { href: "/my-car", label: "My Car Advisor", icon: Car, color: "#8b5cf6", desc: "AI maintenance assistant", badge: "AI" },
    { href: "/news", label: "Auto News", icon: Newspaper, color: "#06b6d4", desc: "UAE automotive news" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {links.map(l => (
        <Link
          key={l.href}
          href={l.href}
          className="flex flex-col gap-2 p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-glow)] transition-all group"
          style={{ background: `linear-gradient(135deg, ${l.color}08 0%, var(--surface) 100%)` }}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: l.color + "15" }}>
              <l.icon className="w-4.5 h-4.5" style={{ color: l.color }} />
            </div>
            {l.badge && (
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
                {l.badge}
              </span>
            )}
          </div>
          <div>
            <p className="text-[13px] font-bold text-[var(--text)] group-hover:text-white transition-colors">{l.label}</p>
            <p className="text-[10px] text-zinc-500">{l.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-2.5 text-xs shadow-xl">
      <p className="text-zinc-400 font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [liveGarages, setLiveGarages] = useState<ExtendedPlaceResult[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);

  // Fetch a sample of live garages for the top-rated table
  useEffect(() => {
    const fetchSample = async () => {
      try {
        const res = await fetch("/api/places?query=car+repair+Dubai&lat=25.2048&lng=55.2708&radius=30000");
        const data = await res.json();
        const sorted = (data.results || [])
          .filter((r: ExtendedPlaceResult) => r.rating && r.rating >= 4.0)
          .sort((a: ExtendedPlaceResult, b: ExtendedPlaceResult) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 5);
        setLiveGarages(sorted);
      } catch { /* ignore */ } finally {
        setLoadingLive(false);
      }
    };
    fetchSample();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-20 md:pb-8">

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0809] via-[var(--bg)] to-[#090a0b] border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-orange-500/4 pointer-events-none" />
        <div className="absolute top-0 left-1/3 w-56 h-56 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-3 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-violet text-[10px]">Real-time Analytics</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text)]">
                UAE Auto <span className="text-gradient-violet">Dashboard</span>
              </h1>
              <p className="text-xs text-zinc-500 mt-1">Auto repair ecosystem · live market overview</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Data
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 py-4 space-y-4">
        {/* Top KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Garages" value="2,205+" sub="Across UAE" color="#f97316" icon={Wrench} />
          <StatCard label="Parts Stores" value="814+" sub="New, OEM & Used" color="#f59e0b" icon={Package} />
          <StatCard label="Avg Rating" value="4.3★" sub="Verified reviews" color="#10b981" icon={Star} />
          <StatCard label="AI Searches" value="1,240" sub="Today" color="#8b5cf6" icon={Zap} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Calendar + live feed */}
          <div className="space-y-4">
            <UAECalendar />
            <LiveFeed />
          </div>

          {/* Center + right: Charts */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search trend area chart */}
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-zinc-500 font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-violet-400" /> Search Activity (7 days)
                </p>
                <span className="text-[10px] text-zinc-600">This week</span>
              </div>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SEARCH_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="gradSearches" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradGarages" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="searches" stroke="#8b5cf6" fill="url(#gradSearches)" strokeWidth={2} name="Total Searches" />
                    <Area type="monotone" dataKey="garages" stroke="#f97316" fill="url(#gradGarages)" strokeWidth={1.5} name="Garage Searches" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Emirate bar chart + rating dist side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Garages by Emirate */}
              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <p className="text-xs text-zinc-500 font-semibold mb-3 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-cyan-400" /> Garages by Emirate
                </p>
                <div style={{ height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={EMIRATE_DATA} layout="vertical" margin={{ top: 0, right: 4, bottom: 0, left: 0 }}>
                      <XAxis type="number" tick={{ fontSize: 9, fill: "#71717a" }} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} width={58} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="garages" name="Garages" radius={[0, 4, 4, 0]}>
                        {EMIRATE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Rating distribution */}
              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <p className="text-xs text-zinc-500 font-semibold mb-3 flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-amber-400" /> Rating Distribution
                </p>
                <div style={{ height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={RATING_DIST} margin={{ top: 0, right: 4, bottom: 0, left: -20 }}>
                      <XAxis dataKey="range" tick={{ fontSize: 9, fill: "#71717a" }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "#71717a" }} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" name="Garages" radius={[4, 4, 0, 0]}>
                        {RATING_DIST.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Service mix pie + Top garages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Service mix */}
              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <p className="text-xs text-zinc-500 font-semibold mb-3 flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-violet-400" /> Service Mix
                </p>
                <div style={{ height: 140 }} className="flex items-center">
                  <ResponsiveContainer width="60%" height="100%">
                    <PieChart>
                      <Pie data={SERVICE_MIX} cx="50%" cy="50%" outerRadius={55} innerRadius={30} dataKey="value" strokeWidth={0}>
                        {SERVICE_MIX.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-1.5">
                    {SERVICE_MIX.map(s => (
                      <div key={s.name} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.fill }} />
                        <span className="text-[10px] text-[var(--text-muted)]">{s.name}</span>
                        <span className="text-[10px] text-zinc-600 ml-auto">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top rated live */}
              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <p className="text-xs text-zinc-500 font-semibold mb-3 flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-orange-400" /> Top Rated · Dubai
                </p>
                {loadingLive ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="shimmer h-7 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {liveGarages.slice(0, 4).map((g, i) => (
                      <div key={g.place_id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[var(--surface-2)] transition-colors">
                        <span className={`text-[10px] font-black w-4 shrink-0 ${i === 0 ? "text-amber-400" : i === 1 ? "text-zinc-400" : "text-zinc-600"}`}>#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-[var(--text)] truncate">{g.name}</p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                          <span className="text-[11px] font-black text-amber-300">{g.rating}</span>
                        </div>
                      </div>
                    ))}
                    <Link href="/garages?q=Dubai" className="flex items-center gap-1 text-[11px] text-orange-400 hover:text-orange-300 mt-1 font-semibold">
                      See all <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick navigation */}
        <div className="pt-1">
          <p className="text-xs text-zinc-500 font-semibold mb-3 uppercase tracking-wide">Quick Access</p>
          <QuickNav />
        </div>
      </div>
    </div>
  );
}
