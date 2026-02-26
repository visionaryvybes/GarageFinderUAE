"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { UAE_REGIONS } from "@/lib/google-maps";

interface RegionPickerProps {
  value: string;
  onChange: (regionKey: string) => void;
}

export default function RegionPicker({ value, onChange }: RegionPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = UAE_REGIONS[value] || UAE_REGIONS.dubai;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 h-10 px-3 rounded-xl border text-xs font-semibold transition-all ${
          open
            ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
            : "bg-[var(--surface)] border-[var(--border)] text-zinc-400 hover:border-orange-500/30 hover:text-orange-400"
        }`}
      >
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden xs:inline sm:hidden">{current.shortLabel ?? current.label.slice(0, 5)}</span>
        <span className="sm:inline hidden">{current.label}</span>
        <span className="inline xs:hidden sm:hidden">{current.shortLabel ?? current.label.slice(0, 3)}</span>
        <ChevronDown className={`w-3 h-3 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 min-w-[160px] bg-[#111113] border border-[var(--border)] rounded-2xl z-50 overflow-hidden shadow-xl shadow-black/50 py-1">
          {Object.entries(UAE_REGIONS).map(([key, region]) => (
            <button
              key={key}
              onClick={() => { onChange(key); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                key === value
                  ? "text-orange-400 bg-orange-500/10"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              {region.label}
              {key === value && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 ml-2 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
