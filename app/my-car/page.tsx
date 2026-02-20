"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, Zap, ChevronRight, Star, AlertTriangle,
  CheckCircle, Clock, Wrench, Lock, BarChart3,
  ArrowRight, RefreshCw, Info, Shield, Gauge,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { CarAdvisorResponse, MaintenanceItem } from "@/app/api/car-advisor/route";

const CAR_BRANDS = [
  "Toyota", "Nissan", "Honda", "Hyundai", "Kia", "Mitsubishi", "Mazda",
  "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Porsche",
  "Ford", "Chevrolet", "Dodge", "Jeep", "GMC", "Cadillac",
  "Land Rover", "Jaguar", "Volvo", "Lexus", "Infiniti",
  "Ferrari", "Lamborghini", "Bentley", "Rolls-Royce",
  "Tesla", "Genesis", "Peugeot", "Renault", "Fiat",
  "Other",
];

const ENGINE_TYPES = [
  { value: "petrol", label: "Petrol / Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybrid (Petrol)" },
  { value: "plugin_hybrid", label: "Plug-in Hybrid" },
  { value: "electric", label: "Full Electric" },
];

const STATUS_CONFIG = {
  urgent: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: AlertTriangle, label: "Urgent" },
  due_soon: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Clock, label: "Due Soon" },
  ok: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle, label: "OK" },
  unknown: { color: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20", icon: Info, label: "Unknown" },
};

const CATEGORY_COLORS: Record<string, string> = {
  Engine: "#ef4444",
  Brakes: "#f59e0b",
  Suspension: "#10b981",
  Electrical: "#8b5cf6",
  "AC & Climate": "#06b6d4",
  Tyres: "#f97316",
  Fluids: "#3b82f6",
  Filters: "#a78bfa",
  Body: "#ec4899",
};

function MileageBar({ item, currentMileage }: { item: MaintenanceItem; currentMileage: number }) {
  const lastKm = item.lastDoneKm ?? (item.dueAtKm - item.intervalKm);
  const progress = Math.min(100, Math.max(0,
    ((currentMileage - lastKm) / item.intervalKm) * 100
  ));
  const isOverdue = currentMileage > item.dueAtKm;

  return (
    <div className="w-full mt-2">
      <div className="flex items-center justify-between text-[10px] text-zinc-600 mb-1">
        <span>{lastKm > 0 ? `${lastKm.toLocaleString()} km` : "—"}</span>
        <span>{isOverdue ? "OVERDUE" : `${(item.dueAtKm - currentMileage).toLocaleString()} km left`}</span>
        <span>{item.dueAtKm.toLocaleString()} km</span>
      </div>
      <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`h-full rounded-full ${
            isOverdue ? "bg-red-500" :
            progress > 80 ? "bg-amber-400" :
            progress > 50 ? "bg-blue-500" :
            "bg-emerald-500"
          }`}
        />
      </div>
    </div>
  );
}

function MaintenanceCard({ item, mileage, isPremium, index }: {
  item: MaintenanceItem;
  mileage: number;
  isPremium: boolean;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.unknown;
  const StatusIcon = cfg.icon;
  const isLocked = !isPremium && index >= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-xl border transition-all ${cfg.border} ${cfg.bg} ${isLocked ? "opacity-60" : ""}`}
    >
      <button
        onClick={() => !isLocked && setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <StatusIcon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] font-semibold text-zinc-100">{item.item}</p>
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${cfg.border} ${cfg.color} ${cfg.bg}`}>
              {cfg.label}
            </span>
            {isLocked && (
              <span className="flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <Lock className="w-2.5 h-2.5" /> Premium
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-600 mt-0.5">
            Every {item.intervalKm.toLocaleString()} km · AED {item.estimatedCostAed}
          </p>
        </div>
        {!isLocked && (
          <ChevronRight className={`w-3.5 h-3.5 text-zinc-600 transition-transform shrink-0 ${expanded ? "rotate-90" : ""}`} />
        )}
        {isLocked && <Lock className="w-3.5 h-3.5 text-violet-500 shrink-0" />}
      </button>

      {!isLocked && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 border-t border-[#1a1a1a] pt-3 space-y-2">
                <p className="text-[12px] text-zinc-400">{item.description}</p>
                <MileageBar item={item} currentMileage={mileage} />
                <div className="flex items-center gap-4 flex-wrap pt-1">
                  <div>
                    <p className="text-[9px] text-zinc-600 font-semibold">ESTIMATED COST</p>
                    <p className="text-[12px] font-black text-zinc-200">AED {item.estimatedCostAed}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-600 font-semibold">DIY DIFFICULTY</p>
                    <p className={`text-[12px] font-black ${
                      item.diyDifficulty === "Easy" ? "text-emerald-400" :
                      item.diyDifficulty === "Medium" ? "text-amber-400" :
                      item.diyDifficulty === "Hard" ? "text-red-400" :
                      "text-zinc-500"
                    }`}>{item.diyDifficulty}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-600 font-semibold">DUE AT</p>
                    <p className="text-[12px] font-black text-zinc-200">{item.dueAtKm.toLocaleString()} km</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

function HealthGauge({ score }: { score: number }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Attention";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a1a" strokeWidth="10" />
          <motion.circle
            cx="50" cy="50" r="40" fill="none"
            stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - score / 100) }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color }}>{score}</span>
          <span className="text-[9px] text-zinc-600 font-semibold">/100</span>
        </div>
      </div>
      <p className="text-[13px] font-bold mt-1" style={{ color }}>{label}</p>
    </div>
  );
}

function CarForm({ onSubmit, loading }: { onSubmit: (data: Record<string, unknown>) => void; loading: boolean }) {
  const [formData, setFormData] = useState({
    brand: "Toyota",
    model: "",
    year: new Date().getFullYear() - 3,
    mileage: 75000,
    engineType: "petrol",
    lastOilChangeMileage: "",
    lastServiceDate: "",
    additionalInfo: "",
  });

  const set = (key: string, value: string | number) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit(formData); }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] text-zinc-500 font-semibold block mb-1">Brand</label>
          <select
            value={formData.brand}
            onChange={e => set("brand", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] text-sm text-zinc-100 outline-none focus:border-blue-600/40 transition-colors"
          >
            {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] text-zinc-500 font-semibold block mb-1">Model</label>
          <input
            type="text"
            value={formData.model}
            onChange={e => set("model", e.target.value)}
            placeholder="e.g. Camry, X5..."
            required
            className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] text-sm text-white placeholder:text-zinc-600 outline-none focus:border-blue-600/40 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] text-zinc-500 font-semibold block mb-1">Year</label>
          <input
            type="number"
            value={formData.year}
            onChange={e => set("year", parseInt(e.target.value))}
            min={1990}
            max={new Date().getFullYear() + 1}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] text-sm text-white outline-none focus:border-blue-600/40 transition-colors"
          />
        </div>
        <div>
          <label className="text-[11px] text-zinc-500 font-semibold block mb-1">Engine Type</label>
          <select
            value={formData.engineType}
            onChange={e => set("engineType", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] text-sm text-zinc-100 outline-none focus:border-blue-600/40 transition-colors"
          >
            {ENGINE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-[11px] text-zinc-500 font-semibold block mb-1">
          Current Mileage: <span className="text-blue-400">{formData.mileage.toLocaleString()} km</span>
        </label>
        <input
          type="range"
          min={0}
          max={500000}
          step={1000}
          value={formData.mileage}
          onChange={e => set("mileage", parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-zinc-600 mt-0.5">
          <span>0 km</span><span>250,000 km</span><span>500,000 km</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] text-zinc-500 font-semibold block mb-1">
            Last Oil Change (km) <span className="text-zinc-700">optional</span>
          </label>
          <input
            type="number"
            value={formData.lastOilChangeMileage}
            onChange={e => set("lastOilChangeMileage", e.target.value)}
            placeholder="e.g. 70000"
            className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] text-sm text-white placeholder:text-zinc-600 outline-none focus:border-blue-600/40 transition-colors"
          />
        </div>
        <div>
          <label className="text-[11px] text-zinc-500 font-semibold block mb-1">
            Last Service Date <span className="text-zinc-700">optional</span>
          </label>
          <input
            type="date"
            value={formData.lastServiceDate}
            onChange={e => set("lastServiceDate", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] text-sm text-zinc-300 outline-none focus:border-blue-600/40 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] text-zinc-500 font-semibold block mb-1">
          Additional Info <span className="text-zinc-700">optional</span>
        </label>
        <textarea
          value={formData.additionalInfo}
          onChange={e => set("additionalInfo", e.target.value)}
          placeholder="Any issues, unusual sounds, warning lights..."
          rows={2}
          className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] text-sm text-white placeholder:text-zinc-600 outline-none focus:border-blue-600/40 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !formData.model}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Analyzing with AI...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Generate Maintenance Plan
          </>
        )}
      </button>
    </form>
  );
}

export default function MyCarPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CarAdvisorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mileage, setMileage] = useState(75000);
  const [isPremium] = useState(false); // Toggle for premium users
  const [activeFilter, setActiveFilter] = useState<"all" | "urgent" | "due_soon" | "ok">("all");

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setMileage(data.mileage as number);
    try {
      const res = await fetch("/api/car-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setResult(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = result?.maintenanceItems.filter(
    item => activeFilter === "all" || item.status === activeFilter
  ) || [];

  // Category breakdown chart
  const categoryData = result ? Object.entries(
    result.maintenanceItems.reduce((acc, item) => {
      const cat = item.category || "Other";
      if (!acc[cat]) acc[cat] = { urgent: 0, due_soon: 0, ok: 0 };
      acc[cat][item.status === "unknown" ? "ok" : item.status]++;
      return acc;
    }, {} as Record<string, { urgent: number; due_soon: number; ok: number }>)
  ).map(([name, counts]) => ({ name, ...counts })) : [];

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-8">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] bg-[#050505]">
        <div className="max-w-5xl mx-auto px-3 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                  <Car className="w-4 h-4 text-violet-400" />
                </div>
                <h1 className="text-xl font-black tracking-tight text-white">
                  My <span className="text-violet-400">Car Advisor</span>
                </h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  AI-POWERED
                </span>
              </div>
              <p className="text-[12px] text-zinc-500">
                Enter your car details to get a complete factory-based maintenance schedule optimised for UAE conditions.
              </p>
            </div>
          </div>

          {/* Premium banner */}
          {!isPremium && (
            <div className="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-500/5 border border-violet-500/15">
              <Lock className="w-4 h-4 text-violet-400 shrink-0" />
              <div className="flex-1">
                <p className="text-[12px] text-zinc-300 font-semibold">
                  Unlock full maintenance history, cost tracking & garage booking
                </p>
                <p className="text-[10px] text-zinc-600">Premium · AED 9.99/month · Coming soon</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-[11px] font-bold hover:bg-violet-500 transition-colors shrink-0">
                Notify Me
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a]">
              <p className="text-xs text-zinc-500 font-semibold mb-3 flex items-center gap-1">
                <Car className="w-3 h-3" /> VEHICLE DETAILS
              </p>
              <CarForm onSubmit={handleSubmit} loading={loading} />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}

            {loading && (
              <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-zinc-300">AI is analyzing your vehicle...</p>
                  <p className="text-[12px] text-zinc-600 mt-1">Checking 24+ maintenance items for UAE conditions</p>
                </div>
              </div>
            )}

            {result && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Health score + summary */}
                  <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a]">
                    <div className="flex items-center gap-6">
                      <HealthGauge score={result.overallScore} />
                      <div className="flex-1">
                        <p className="text-[11px] text-zinc-500 font-semibold mb-2 flex items-center gap-1">
                          <Shield className="w-3 h-3" /> VEHICLE HEALTH
                        </p>
                        <p className="text-[13px] text-zinc-300 leading-relaxed">{result.summary}</p>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-[11px] text-zinc-400">{result.urgentCount} Urgent</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-[11px] text-zinc-400">{result.dueSoonCount} Due Soon</span>
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            Next service: {result.nextServiceKm.toLocaleString()} km
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category chart */}
                  {categoryData.length > 0 && (
                    <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a]">
                      <p className="text-[11px] text-zinc-500 font-semibold mb-3 flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" /> MAINTENANCE BY CATEGORY
                      </p>
                      <div style={{ height: 120 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 8, fill: "#71717a" }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 9, fill: "#71717a" }} tickLine={false} axisLine={false} />
                            <Tooltip
                              contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 8, fontSize: 11 }}
                            />
                            <Bar dataKey="urgent" fill="#ef4444" name="Urgent" radius={[2, 2, 0, 0]} stackId="a" />
                            <Bar dataKey="due_soon" fill="#f59e0b" name="Due Soon" radius={[2, 2, 0, 0]} stackId="a" />
                            <Bar dataKey="ok" fill="#10b981" name="OK" radius={[2, 2, 0, 0]} stackId="a" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {result.tips?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15">
                      <p className="text-[11px] text-blue-400 font-semibold mb-2 flex items-center gap-1">
                        <Info className="w-3 h-3" /> UAE DRIVING TIPS
                      </p>
                      <ul className="space-y-1.5">
                        {result.tips.slice(0, 3).map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-[12px] text-zinc-400">
                            <span className="text-blue-500 shrink-0 mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Filter tabs */}
                  <div className="flex gap-2 flex-wrap">
                    {(["all", "urgent", "due_soon", "ok"] as const).map(f => {
                      const counts: Record<string, number> = {
                        all: result.maintenanceItems.length,
                        urgent: result.maintenanceItems.filter(i => i.status === "urgent").length,
                        due_soon: result.maintenanceItems.filter(i => i.status === "due_soon").length,
                        ok: result.maintenanceItems.filter(i => i.status === "ok").length,
                      };
                      const labels = { all: "All", urgent: "Urgent", due_soon: "Due Soon", ok: "OK" };
                      const colors = { all: "text-zinc-400 border-zinc-700", urgent: "text-red-400 border-red-500/30", due_soon: "text-amber-400 border-amber-500/30", ok: "text-emerald-400 border-emerald-500/30" };
                      return (
                        <button
                          key={f}
                          onClick={() => setActiveFilter(f)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                            activeFilter === f ? colors[f] + " bg-[#1a1a1a]" : "text-zinc-600 border-[#1a1a1a] hover:border-zinc-700"
                          }`}
                        >
                          {labels[f]}
                          <span className="text-[10px] opacity-70">({counts[f]})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Maintenance items */}
                  <div className="space-y-2">
                    {filteredItems.map((item, i) => (
                      <MaintenanceCard
                        key={item.item}
                        item={item}
                        mileage={mileage}
                        isPremium={isPremium}
                        index={i}
                      />
                    ))}
                    {!isPremium && result.maintenanceItems.length > 5 && (
                      <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/15 text-center">
                        <Lock className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                        <p className="text-[13px] font-semibold text-zinc-300">
                          {result.maintenanceItems.length - 5} more items locked
                        </p>
                        <p className="text-[11px] text-zinc-600 mt-1">Upgrade to Premium to see full maintenance schedule</p>
                        <button className="mt-3 px-4 py-2 rounded-lg bg-violet-600 text-white text-[12px] font-bold hover:bg-violet-500 transition-colors">
                          Unlock Premium · AED 9.99/mo
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {!result && !loading && !error && (
              <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] text-center">
                <Car className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
                <p className="text-sm font-semibold text-zinc-400">Enter your car details</p>
                <p className="text-[12px] text-zinc-600 mt-1 max-w-xs mx-auto">
                  Get a personalized maintenance schedule with mileage tracking for every component
                </p>
                <div className="grid grid-cols-3 gap-3 mt-6 text-center">
                  {[
                    { icon: "🔧", label: "24+ Checks" },
                    { icon: "🇦🇪", label: "UAE Climate" },
                    { icon: "💰", label: "Cost Estimates" },
                  ].map(f => (
                    <div key={f.label} className="p-2 rounded-lg bg-[#111] border border-[#1a1a1a]">
                      <div className="text-xl mb-1">{f.icon}</div>
                      <p className="text-[10px] text-zinc-500 font-semibold">{f.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
