"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, Sparkles, AlertTriangle, CheckCircle2, Clock, ChevronDown,
  Wrench, Thermometer, Wind, Gauge, Shield, Zap,
  MessageSquare, Send, BellRing, MapPin, Info, TrendingUp,
  RotateCcw, Star, X, Loader2, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import type {
  CarAdvisorResponse, MaintenanceItem, SafetyAlert,
  UAEClimateAlert, WarningLight,
} from "@/app/api/car-advisor/route";

/* ── Constants ── */
const CAR_BRANDS = [
  "Toyota", "Nissan", "Honda", "Mitsubishi", "Hyundai", "Kia",
  "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Porsche", "Ferrari",
  "Lamborghini", "Maserati", "Land Rover", "Jaguar", "Bentley", "Rolls-Royce",
  "Ford", "Chevrolet", "GMC", "Dodge", "Jeep", "Cadillac",
  "Lexus", "Infiniti", "Acura", "Mazda", "Subaru", "Volvo",
  "Peugeot", "Renault", "Fiat", "Alfa Romeo", "MINI",
];

const QUICK_QUESTIONS = [
  "My AC is blowing warm air, what should I do?",
  "How often should I change oil in UAE heat?",
  "What tyre brand is best for UAE summer?",
  "My car vibrates at high speed on the highway",
  "Battery keeps dying, is it the heat?",
  "Is it safe to drive with the check engine light on?",
];

/* ── HealthGauge ── */
function HealthGauge({ score }: { score: number }) {
  const s = Math.max(0, Math.min(100, score));
  const angle = -135 + (s / 100) * 270;
  const color = s >= 75 ? "#10b981" : s >= 50 ? "#f59e0b" : "#ef4444";
  const label = s >= 80 ? "Excellent" : s >= 65 ? "Good" : s >= 45 ? "Fair" : "Needs Attention";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-[135deg]">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#27272a" strokeWidth="8" strokeDasharray="213 300" strokeLinecap="round" />
          <motion.circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${(s / 100) * 213} 300`} strokeLinecap="round"
            initial={{ strokeDasharray: "0 300" }}
            animate={{ strokeDasharray: `${(s / 100) * 213} 300` }}
            transition={{ duration: 1.5, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div className="absolute w-0.5 h-10 origin-bottom "
            style={{ background: color, bottom: "50%" }}
            initial={{ rotate: -135 }} animate={{ rotate: angle }}
            transition={{ duration: 1.5, ease: "easeOut" }} />
          <div className="relative z-10 flex flex-col items-center mt-3">
            <motion.span className="text-2xl font-black" style={{ color }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {s}
            </motion.span>
            <span className="text-[10px] text-[#71717a] font-semibold">/100</span>
          </div>
        </div>
      </div>
      <motion.span className="text-xs font-bold mt-1" style={{ color }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        {label}
      </motion.span>
    </div>
  );
}

/* ── MileageBar ── */
function MileageBar({ item }: { item: MaintenanceItem }) {
  if (!item.intervalKm) return null;
  const used = item.overdueBy > 0 ? item.intervalKm : item.intervalKm - (item.dueAtKm - (item.lastDoneKm ?? (item.dueAtKm - item.intervalKm)));
  const pct = Math.min(100, Math.max(0, (used / item.intervalKm) * 100));
  const color = pct >= 100 ? "#ef4444" : pct >= 80 ? "#f59e0b" : "#10b981";
  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] text-[#52525b] mb-1">
        <span>Interval: {item.intervalKm.toLocaleString()} km</span>
        {item.overdueBy > 0
          ? <span className="text-red-400 font-bold">Overdue {item.overdueBy.toLocaleString()} km</span>
          : <span>Due at {item.dueAtKm.toLocaleString()} km</span>}
      </div>
      <div className="h-1.5 bg-[#27272a]  overflow-hidden">
        <motion.div className="h-full " style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }} />
      </div>
    </div>
  );
}

/* ── MaintenanceCard ── */
function MaintenanceCard({ item, index }: { item: MaintenanceItem; index: number }) {
  const [open, setOpen] = useState(false);
  const statusStyles: Record<string, { border: string; bg: string; badge: string; icon: React.ElementType; ic: string }> = {
    urgent: { border: "border-l-red-500", bg: "bg-red-500/5", badge: "bg-red-500/15 text-red-400 border-red-500/25", icon: AlertTriangle, ic: "text-red-400" },
    due_soon: { border: "border-l-amber-500", bg: "bg-amber-500/5", badge: "bg-amber-500/15 text-amber-400 border-amber-500/25", icon: Clock, ic: "text-amber-400" },
    ok: { border: "border-l-emerald-500", bg: "bg-emerald-500/5", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25", icon: CheckCircle2, ic: "text-emerald-400" },
    unknown: { border: "border-l-[#3f3f46]", bg: "", badge: "bg-[#27272a] text-[#71717a] border-[#3f3f46]", icon: Info, ic: "text-[#52525b]" },
  };
  const s = statusStyles[item.status] || statusStyles.unknown;
  const Icon = s.icon;
  const diffColors: Record<string, string> = { "Easy": "text-emerald-400", "Medium": "text-amber-400", "Hard": "text-orange-400", "Workshop Only": "text-red-400" };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.025 }}
      className={`rounded-2xl border-l-2 border border-[var(--border)] ${s.border} ${s.bg} overflow-hidden`}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/[0.02] transition-colors">
        <Icon className={`w-4 h-4 shrink-0 ${s.ic}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[#fafafa]">{item.item}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5  border ${s.badge}`}>
              {item.status === "urgent" ? "URGENT" : item.status === "due_soon" ? "DUE SOON" : item.status === "ok" ? "OK" : "CHECK"}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-[#71717a]">{item.category}</span>
            <span className="text-[11px] text-[#3f3f46]">·</span>
            <span className="text-[11px] font-semibold text-orange-400">{item.estimatedCostAed} AED</span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#52525b] shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-[var(--border)]/50">
              <p className="text-[13px] text-[#a1a1aa] leading-relaxed">{item.description}</p>
              {item.uaeNote && (
                <div className="flex gap-2 p-2.5  bg-orange-500/8 border border-orange-500/15">
                  <Thermometer className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-orange-300">{item.uaeNote}</p>
                </div>
              )}
              <div className="flex items-center gap-4 text-[11px]">
                <div><span className="text-[#52525b]">DIY: </span><span className={`font-bold ${diffColors[item.diyDifficulty] || "text-[#a1a1aa]"}`}>{item.diyDifficulty}</span></div>
                {item.intervalKm > 0 && <div><span className="text-[#52525b]">Interval: </span><span className="text-[#a1a1aa] font-semibold">{item.intervalKm.toLocaleString()} km</span></div>}
              </div>
              {item.intervalKm > 0 && <MileageBar item={item} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── TyrePressureCard ── */
function TyrePressureCard({ data }: { data: CarAdvisorResponse["tyrePressure"] }) {
  return (
    <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
        <Gauge className="w-4 h-4 text-orange-400" />
        <span className="text-sm font-bold text-[#fafafa]">Tyre Pressure</span>
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5  bg-orange-500/12 border border-orange-500/20 text-orange-400">UAE Adjusted</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Front", psi: data.frontPsi, bar: data.frontBar },
            { label: "Rear", psi: data.rearPsi, bar: data.rearBar },
            { label: "Spare", psi: data.sparePsi, bar: Math.round(data.sparePsi * 0.0689 * 10) / 10 },
          ].map(t => (
            <div key={t.label} className="text-center p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
              <div className="text-2xl font-black text-orange-400">{t.psi}</div>
              <div className="text-[10px] text-[#52525b] font-semibold">PSI</div>
              <div className="text-[10px] text-[#71717a] mt-0.5">{t.bar} bar</div>
              <div className="text-[11px] font-bold text-[#a1a1aa] mt-1">{t.label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 p-2.5  bg-amber-500/8 border border-amber-500/15">
          <Thermometer className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] text-amber-300 leading-relaxed">{data.uaeNote}</p>
            <p className="text-[11px] text-[#71717a] mt-1">Check frequency: {data.checkFrequency}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SafetySection ── */
function SafetySection({ alerts }: { alerts: SafetyAlert[] }) {
  if (!alerts?.length) return <p className="text-center py-8 text-[#52525b] text-sm">No critical safety alerts. Your vehicle appears safe.</p>;
  const cfg: Record<string, { bg: string; border: string; badge: string; icon: React.ElementType; ic: string }> = {
    critical: { bg: "bg-red-500/8", border: "border-red-500/25", badge: "bg-red-500/15 text-red-400", icon: Shield, ic: "text-red-400" },
    warning: { bg: "bg-amber-500/8", border: "border-amber-500/25", badge: "bg-amber-500/15 text-amber-400", icon: AlertTriangle, ic: "text-amber-400" },
    info: { bg: "bg-violet-500/8", border: "border-violet-500/25", badge: "bg-violet-500/15 text-violet-400", icon: Info, ic: "text-violet-400" },
  };
  const sorted = [...alerts].sort((a, b) => { const o = { critical: 0, warning: 1, info: 2 }; return o[a.severity] - o[b.severity]; });
  return (
    <div className="space-y-3">
      {sorted.map((alert, i) => {
        const c = cfg[alert.severity] || cfg.info;
        const Icon = c.icon;
        return (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className={` p-4 border ${c.bg} ${c.border}`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8  ${c.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${c.ic}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-[#fafafa]">{alert.item}</h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5  ${c.badge}`}>{alert.severity.toUpperCase()}</span>
                </div>
                <p className="text-[12px] text-[#a1a1aa] leading-relaxed mb-2">{alert.description}</p>
                <div className="p-2 rounded-xl bg-[var(--bg)]/20 border border-white/5">
                  <p className="text-[12px] text-[#fafafa] font-medium"><span className={`font-bold ${c.ic}`}>Action: </span>{alert.action}</p>
                </div>
                {alert.estimatedCostAed && <p className="text-[11px] text-[#71717a] mt-2">Est. cost: <span className="text-orange-400 font-semibold">{alert.estimatedCostAed} AED</span></p>}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── UAEClimateSection ── */
function UAEClimateSection({ alerts }: { alerts: UAEClimateAlert[] }) {
  if (!alerts?.length) return <p className="text-center py-8 text-[#52525b] text-sm">No climate alerts.</p>;
  const pOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...alerts].sort((a, b) => pOrder[a.priority] - pOrder[b.priority]);
  const sIcons: Record<string, React.ElementType> = { summer: Thermometer, winter: Wind, "year-round": TrendingUp };
  const pStyles: Record<string, string> = { high: "border-l-orange-500 bg-orange-500/5", medium: "border-l-amber-500 bg-amber-500/5", low: "border-l-[#3f3f46]" };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {sorted.map((alert, i) => {
        const Icon = sIcons[alert.season] || Info;
        return (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`rounded-2xl p-4 border-l-2 border border-[var(--border)] ${pStyles[alert.priority]}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${alert.priority === "high" ? "text-orange-400" : "text-amber-400"}`} />
              <h4 className="text-sm font-bold text-[#fafafa]">{alert.title}</h4>
              {alert.priority === "high" && <span className="ml-auto text-[9px] font-black px-1.5 py-0.5  bg-orange-500/15 text-orange-400 border border-orange-500/25">HIGH</span>}
            </div>
            <p className="text-[12px] text-[#a1a1aa] leading-relaxed">{alert.description}</p>
            <p className="text-[10px] text-[#52525b] mt-2 capitalize">{alert.season}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── WarningLightsSection ── */
function WarningLightsSection({ lights }: { lights: WarningLight[] }) {
  if (!lights?.length) return <p className="text-center py-8 text-[#52525b] text-sm">No warning light data.</p>;
  const uStyles: Record<string, { border: string; ic: string }> = {
    stop_now: { border: "border-l-red-500 bg-red-500/5", ic: "text-red-400" },
    service_soon: { border: "border-l-amber-500 bg-amber-500/5", ic: "text-amber-400" },
    informational: { border: "border-l-[#3f3f46]", ic: "text-[#52525b]" },
  };
  const cStyles: Record<string, string> = { red: "bg-red-500 text-white", amber: "bg-amber-500 text-black", green: "bg-emerald-500 text-white", blue: "bg-blue-500 text-white", orange: "bg-orange-500 text-white" };
  return (
    <div className="space-y-2">
      {lights.map((light, i) => {
        const st = uStyles[light.urgency] || uStyles.informational;
        return (
          <div key={i} className={`rounded-2xl p-3.5 border-l-2 border border-[var(--border)] ${st.border}`}>
            <div className="flex items-start gap-3">
              <div className={`px-2 py-1  text-[10px] font-black shrink-0 ${cStyles[light.color] || "bg-[#27272a] text-[#a1a1aa]"}`}>{light.color.toUpperCase()}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#fafafa]">{light.name}</h4>
                  {light.urgency === "stop_now" && <span className="text-[9px] font-black px-1.5 py-0.5  bg-red-500/15 text-red-400 border border-red-500/25 animate-pulse">STOP NOW</span>}
                </div>
                <p className="text-[12px] text-[#a1a1aa] mt-0.5 leading-relaxed">{light.meaning}</p>
                <p className="text-[12px] text-[#fafafa] mt-1.5 font-medium"><span className={`font-bold ${st.ic}`}>Action: </span>{light.action}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── ServiceReminderWidget ── */
function ServiceReminderWidget({ data, brand, model }: { data: CarAdvisorResponse; brand: string; model: string }) {
  const [reminderSet, setReminderSet] = useState(false);
  const [customKm, setCustomKm] = useState("");
  const key = `service-reminder-${brand}-${model}`;
  useEffect(() => { if (localStorage.getItem(key)) setReminderSet(true); }, [key]);
  const save = () => {
    const km = parseInt(customKm) || data.nextServiceKm;
    localStorage.setItem(key, JSON.stringify({ vehicle: `${brand} ${model}`, nextServiceKm: km, nextServiceDate: data.nextServiceEstimatedDate, setAt: new Date().toISOString() }));
    setReminderSet(true);
  };
  if (reminderSet) return (
    <div className=" bg-emerald-500/8 border border-emerald-500/20 p-4 flex items-center gap-3">
      <BellRing className="w-5 h-5 text-emerald-400 shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-bold text-emerald-400">Service Reminder Set</p>
        <p className="text-[12px] text-[#71717a]">Next service: {data.nextServiceKm.toLocaleString()} km · {data.nextServiceEstimatedDate}</p>
      </div>
      <button onClick={() => { localStorage.removeItem(key); setReminderSet(false); }} className="p-1 hover:bg-emerald-500/10  transition-colors">
        <X className="w-4 h-4 text-[#52525b]" />
      </button>
    </div>
  );
  return (
    <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4">
      <div className="flex items-center gap-2 mb-3"><BellRing className="w-4 h-4 text-orange-400" /><h3 className="text-sm font-bold text-[var(--text)]">Set Service Reminder</h3></div>
      <div className="flex gap-2 mb-3">
        <input type="number" value={customKm} onChange={e => setCustomKm(e.target.value)}
          placeholder={`e.g. ${data.nextServiceKm.toLocaleString()}`}
          className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] placeholder:text-[#52525b] outline-none focus:border-violet-500/40 transition-colors" />
        <span className="text-sm text-[#71717a] self-center">km</span>
      </div>
      <button onClick={save} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold transition-all">
        <BellRing className="w-4 h-4" />Save Reminder
      </button>
      <p className="text-[11px] text-[#52525b] mt-2 text-center">Saved locally to your browser</p>
    </div>
  );
}

/* ── AIChat ── */
function AIChat({ carDetails }: { carDetails: { brand: string; model: string; year: number; mileage: number; engineType: string } }) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text?: string) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput("");
    const newMsgs = [...messages, { role: "user" as const, content: q }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const res = await fetch("/api/car-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, carDetails, history: messages.slice(-4) }),
      });
      const d = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: d.answer || "Sorry, couldn't process that." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-violet-400" />
        <span className="text-sm font-bold text-[#fafafa]">Ask Your AI Advisor</span>
        <div className="ml-auto flex items-center gap-1.5"><span className="w-1.5 h-1.5  bg-emerald-400 animate-pulse" /><span className="text-[10px] text-[#71717a]">Online</span></div>
      </div>
      <div className="h-56 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center"><Sparkles className="w-5 h-5 text-violet-400" /></div>
            <p className="text-sm text-[#71717a] text-center">Ask me anything about your {carDetails.brand} {carDetails.model}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${m.role === "user" ? "bg-violet-600 text-white" : "bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[var(--surface-2)] rounded-2xl px-3.5 py-2.5 border border-[var(--border)] flex gap-1 items-center">
              <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" /><span className="text-[12px] text-[#52525b]">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      {messages.length === 0 && (
        <div className="px-4 pb-3">
          <p className="text-[10px] font-bold text-[#52525b] uppercase tracking-wider mb-2">Quick Questions</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.slice(0, 4).map(q => (
              <button key={q} onClick={() => send(q)}
                className="text-[11px] px-2.5 py-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[#71717a] hover:text-violet-400 hover:border-violet-500/30 transition-all">
                {q.length > 32 ? q.slice(0, 32) + "…" : q}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask about your car..."
            className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[#52525b] outline-none focus:border-violet-500/40 transition-colors" />
          <button onClick={() => send()} disabled={!input.trim() || loading}
            className="px-3.5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white transition-all">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function MyCarPage() {
  const [form, setForm] = useState({
    brand: "Toyota", model: "", year: new Date().getFullYear() - 2,
    mileage: 75000, engineType: "Petrol / Gasoline",
    lastOilChangeMileage: "", lastServiceDate: "", additionalInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CarAdvisorResponse | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"maintenance" | "safety" | "climate" | "warnings">("maintenance");
  const [filterStatus, setFilterStatus] = useState<"all" | "urgent" | "due_soon" | "ok">("all");

  const generate = async () => {
    if (!form.model.trim()) { setError("Please enter your car model"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/car-advisor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: form.brand, model: form.model, year: form.year, mileage: form.mileage,
          engineType: form.engineType,
          lastOilChangeMileage: form.lastOilChangeMileage ? parseInt(form.lastOilChangeMileage) : undefined,
          lastServiceDate: form.lastServiceDate || undefined,
          additionalInfo: form.additionalInfo || undefined,
        }),
      });
      if (!res.ok) throw new Error("error");
      setData(await res.json());
      setActiveTab("maintenance");
    } catch { setError("Failed to generate. Check API key and try again."); }
    finally { setLoading(false); }
  };

  const filtered = data?.maintenanceItems?.filter(i => filterStatus === "all" || i.status === filterStatus) || [];
  const urgentCount = data?.maintenanceItems?.filter(i => i.status === "urgent").length || 0;
  const dueSoonCount = data?.maintenanceItems?.filter(i => i.status === "due_soon").length || 0;


  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-20 md:pb-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-xl bg-violet-600 blur-md opacity-40" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#1c1c1f] to-[#09090b] border border-violet-500/30 flex items-center justify-center">
              <Car className="w-5 h-5 text-violet-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-white">My Car Advisor</h1>
            <p className="text-[12px] text-[#71717a]">Factory-based maintenance schedule optimised for UAE conditions</p>
          </div>
          <div className="ml-auto badge-violet flex items-center gap-1">
            <Sparkles className="w-3 h-3" />AI-POWERED
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* ── Left: Form ── */}
          <div className="space-y-4">
            <div className=" bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-[#71717a]" />
                <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-widest">Vehicle Details</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider block mb-1.5">Brand</label>
                    <select value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)]  px-3 py-2.5 text-sm text-[#fafafa] outline-none focus:border-violet-500/40 transition-colors">
                      {CAR_BRANDS.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider block mb-1.5">Model</label>
                    <input type="text" value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))}
                      placeholder="e.g. Camry, X5..." className="w-full bg-[var(--surface-2)] border border-[var(--border)]  px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#52525b] outline-none focus:border-violet-500/40 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider block mb-1.5">Year</label>
                    <input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || f.year }))}
                      min={1990} max={new Date().getFullYear()}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)]  px-3 py-2.5 text-sm text-[#fafafa] outline-none focus:border-violet-500/40 transition-colors" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider block mb-1.5">Engine</label>
                    <select value={form.engineType} onChange={e => setForm(f => ({ ...f, engineType: e.target.value }))}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)]  px-3 py-2.5 text-sm text-[#fafafa] outline-none focus:border-violet-500/40 transition-colors">
                      {["Petrol / Gasoline", "Diesel", "Hybrid", "Plug-in Hybrid (PHEV)", "Electric (EV)"].map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider">Mileage</label>
                    <span className="text-sm font-black text-orange-400">{form.mileage.toLocaleString()} km</span>
                  </div>
                  <input type="range" min={0} max={500000} step={5000} value={form.mileage}
                    onChange={e => setForm(f => ({ ...f, mileage: parseInt(e.target.value) }))}
                    className="w-full accent-violet-500" />
                  <div className="flex justify-between text-[10px] text-[#3f3f46] mt-0.5"><span>0</span><span>250k</span><span>500k km</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider block mb-1.5">Last Oil Change <span className="text-[#3f3f46] normal-case font-normal">optional</span></label>
                    <input type="number" value={form.lastOilChangeMileage} onChange={e => setForm(f => ({ ...f, lastOilChangeMileage: e.target.value }))}
                      placeholder="e.g. 70000" className="w-full bg-[var(--surface-2)] border border-[var(--border)]  px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#52525b] outline-none focus:border-violet-500/40 transition-colors" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider block mb-1.5">Last Service <span className="text-[#3f3f46] normal-case font-normal">optional</span></label>
                    <input type="date" value={form.lastServiceDate} onChange={e => setForm(f => ({ ...f, lastServiceDate: e.target.value }))}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)]  px-3 py-2.5 text-sm text-[#fafafa] outline-none focus:border-violet-500/40 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider block mb-1.5">Issues / Notes <span className="text-[#3f3f46] normal-case font-normal">optional</span></label>
                  <textarea value={form.additionalInfo} onChange={e => setForm(f => ({ ...f, additionalInfo: e.target.value }))}
                    placeholder="Any issues, warning lights, unusual sounds..." rows={2}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)]  px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#52525b] outline-none focus:border-violet-500/40 transition-colors resize-none" />
                </div>
                {error && <p className="text-sm text-red-400 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />{error}</p>}
                <button onClick={generate} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-violet-900/30">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing {form.brand} {form.model}...</> : <><Sparkles className="w-4 h-4" />Generate Full Analysis</>}
                </button>
              </div>
            </div>

            {/* Feature pills */}
            {!data && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Wrench, label: "30+ Checks" }, { icon: Thermometer, label: "UAE Climate" },
                  { icon: Gauge, label: "Tyre Pressure" }, { icon: Shield, label: "Safety Alerts" },
                  { icon: MessageSquare, label: "AI Chat" }, { icon: BellRing, label: "Reminders" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                    <Icon className="w-4 h-4 text-[#52525b]" />
                    <span className="text-[10px] font-semibold text-[#52525b] text-center">{label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* AI Chat */}
            {data && <AIChat carDetails={{ brand: form.brand, model: form.model, year: form.year, mileage: form.mileage, engineType: form.engineType }} />}
          </div>

          {/* ── Right: Results ── */}
          <div className="space-y-4">
            {!data && !loading && (
              <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-10 flex flex-col items-center justify-center min-h-[400px] text-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                  <Car className="w-8 h-8 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#fafafa] mb-1">Enter your car details</h3>
                  <p className="text-[13px] text-[#52525b] leading-relaxed max-w-xs mx-auto">
                    Get a complete AI-generated maintenance schedule with tyre pressure, safety alerts, UAE climate tips, warning lights guide, and live chat
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-1">
                  {[{ icon: Wrench, label: "30+ Checks", sub: "Comprehensive" }, { icon: Thermometer, label: "UAE Climate", sub: "Local conditions" }, { icon: MessageSquare, label: "AI Chat", sub: "Ask anything" }].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
                      <Icon className="w-5 h-5 text-[#3f3f46] mx-auto mb-1.5" />
                      <p className="text-[11px] font-bold text-[#71717a]">{label}</p>
                      <p className="text-[10px] text-[#3f3f46]">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-12 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/15 flex items-center justify-center"><Loader2 className="w-8 h-8 text-violet-400 animate-spin" /></div>
                  <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/20 animate-ping" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-[#fafafa]">AI analyzing your {form.brand} {form.model}</p>
                  <p className="text-[12px] text-[#52525b] mt-1">Generating factory schedule, tyre pressure, safety alerts & UAE climate advice...</p>
                </div>
              </div>
            )}

            {data && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {/* AI Summary */}
                  {data.aiSummary && (
                    <div className="rounded-2xl bg-[var(--surface)] border border-violet-500/20 p-4">
                      <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-violet-400" /><span className="text-sm font-bold text-violet-400">AI Advisor Says</span></div>
                      <p className="text-[13px] text-[#d4d4d8] leading-relaxed">{data.aiSummary}</p>
                      {data.estimatedAnnualCostAed && (
                        <div className="mt-3 pt-3 border-t border-violet-500/15 flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-[12px] text-[#a1a1aa]">Est. annual maintenance: </span>
                          <span className="text-[12px] font-bold text-orange-400">{data.estimatedAnnualCostAed} AED</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Score + KPI strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 flex items-center justify-center">
                      <HealthGauge score={data.overallScore} />
                    </div>
                    {[
                      { label: "Urgent", value: String(urgentCount), color: "text-red-400", ic: AlertTriangle, bg: "bg-red-500/10" },
                      { label: "Due Soon", value: String(dueSoonCount), color: "text-amber-400", ic: Clock, bg: "bg-amber-500/10" },
                      { label: "Next Service", value: data.nextServiceEstimatedDate || "—", color: "text-violet-400", ic: Zap, bg: "bg-violet-500/10" },
                    ].map(({ label, value, color, ic: Icon, bg }) => (
                      <div key={label} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 flex flex-col justify-between">
                        <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-2`}><Icon className={`w-4 h-4 ${color}`} /></div>
                        <div className={`text-lg font-black ${color} leading-none`}>{value}</div>
                        <div className="text-[11px] text-[#71717a] mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tyre Pressure */}
                  {data.tyrePressure && <TyrePressureCard data={data.tyrePressure} />}

                  {/* Service Reminder */}
                  <ServiceReminderWidget data={data} brand={form.brand} model={form.model} />

                  {/* Tabs */}
                  <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
                    <div className="flex border-b border-[var(--border)] overflow-x-auto scrollbar-none">
                      {[
                        { id: "maintenance", label: "Maintenance", icon: Wrench, count: data.maintenanceItems?.length },
                        { id: "safety", label: "Safety", icon: Shield, count: data.safetyAlerts?.length, alert: (data.safetyAlerts?.filter(a => a.severity === "critical").length ?? 0) > 0 },
                        { id: "climate", label: "UAE Climate", icon: Thermometer, count: data.uaeClimateAlerts?.length },
                        { id: "warnings", label: "Warning Lights", icon: AlertTriangle, count: data.warningLights?.length },
                      ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
                          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold transition-all shrink-0 relative ${activeTab === tab.id ? "text-violet-400 border-b-2 border-violet-500 bg-violet-500/5" : "text-[#71717a] hover:text-[#a1a1aa]"}`}>
                          <tab.icon className="w-3.5 h-3.5" />{tab.label}
                          {tab.count != null && <span className="text-[9px] font-black px-1 py-0.5 rounded bg-[var(--surface-2)] text-[#71717a]">{tab.count}</span>}
                          {tab.alert && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                        </button>
                      ))}
                    </div>
                    <div className="p-4">
                      {activeTab === "maintenance" && (
                        <div className="space-y-3">
                          <div className="flex gap-2 flex-wrap">
                            {[
                              { id: "all", label: "All", count: data.maintenanceItems?.length },
                              { id: "urgent", label: "Urgent", count: urgentCount },
                              { id: "due_soon", label: "Due Soon", count: dueSoonCount },
                              { id: "ok", label: "OK", count: (data.maintenanceItems?.filter(i => i.status === "ok").length ?? 0) },
                            ].map(f => (
                              <button key={f.id} onClick={() => setFilterStatus(f.id as typeof filterStatus)}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${filterStatus === f.id ? "bg-violet-600/12 border-violet-600/35 text-violet-400" : "bg-[var(--surface-2)] border-[var(--border)] text-[#71717a] hover:border-[var(--border-glow)]"}`}>
                                {f.label}<span className="text-[10px] opacity-70">{f.count}</span>
                              </button>
                            ))}
                          </div>
                          <div className="space-y-2">
                            {filtered.map((item, i) => <MaintenanceCard key={item.item} item={item} index={i} />)}
                            {filtered.length === 0 && <div className="text-center py-8 text-[#52525b] text-sm">No items in this category</div>}
                          </div>
                          {data.tips?.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-[var(--border)]">
                              <p className="text-[11px] font-bold text-[#52525b] uppercase tracking-wider mb-3">UAE Driving Tips</p>
                              <div className="space-y-2">
                                {data.tips.map((tip, i) => (
                                  <div key={i} className="flex gap-2 items-start">
                                    <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                    <p className="text-[12px] text-[#a1a1aa] leading-relaxed">{tip}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {activeTab === "safety" && <SafetySection alerts={data.safetyAlerts} />}
                      {activeTab === "climate" && <UAEClimateSection alerts={data.uaeClimateAlerts} />}
                      {activeTab === "warnings" && <WarningLightsSection lights={data.warningLights} />}
                    </div>
                  </div>

                  {/* Find garage CTA */}
                  <div className="rounded-2xl bg-[var(--surface)] border border-orange-500/20 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-orange-400" /></div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[#fafafa]">Ready to book a service?</h3>
                      <p className="text-[12px] text-[#71717a]">Find verified garages near you in the UAE</p>
                    </div>
                    <Link href="/garages" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold transition-all shrink-0">
                      Find Garages<ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <button onClick={generate} disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[#71717a] hover:text-[#a1a1aa] hover:border-[var(--border-glow)] text-sm font-semibold transition-all">
                    <RotateCcw className="w-4 h-4" />Regenerate Analysis
                  </button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
