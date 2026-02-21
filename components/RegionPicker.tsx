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
        <div ref={ref} className="relative h-full flex items-stretch">
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-1.5 px-3 sm:px-6 h-full border-r border-white/10 transition-colors text-xs font-black tracking-widest uppercase ${open ? "bg-white text-black" : "bg-[#050505] text-zinc-400 hover:text-white hover:bg-[#0a0a0a]"
                    }`}
            >
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="inline sm:hidden text-[10px]">{current.shortLabel ?? current.label.slice(0, 3).toUpperCase()}</span>
                <span className="hidden sm:inline">{current.label}</span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute top-full mt-0 left-0 w-56 bg-[#050505] border border-white z-50 flex flex-col uppercase divide-y divide-white/10">
                    <div className="px-4 py-3 bg-white text-black text-[10px] font-black tracking-widest">
                        SELECT REGION
                    </div>
                    {Object.entries(UAE_REGIONS).map(([key, region]) => (
                        <button
                            key={key}
                            onClick={() => { onChange(key); setOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 text-xs font-black tracking-widest transition-colors ${key === value
                                    ? "bg-white text-black"
                                    : "text-zinc-500 hover:bg-[#0a0a0a] hover:text-white"
                                }`}
                        >
                            {region.label}
                            {key === value && <span className="text-[10px]">&lt;</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
