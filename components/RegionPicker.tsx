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
                className={`flex items-center gap-2 px-6 h-full border-r border-white/20 transition-colors text-[10px] font-black tracking-widest uppercase ${open ? "bg-white text-black" : "bg-transparent text-white hover:bg-white/5 hover:border-white"
                    }`}
            >
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="inline sm:hidden">{current.shortLabel ?? current.label.slice(0, 3)}</span>
                <span className="hidden sm:inline">{current.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute top-full mt-0 left-0 w-56 bg-[#000] border border-t-0 border-white z-50 flex flex-col uppercase divide-y divide-white/20">
                    <div className="px-4 py-3 bg-[#050505] text-white text-[9px] font-black tracking-widest">
                        SELECT LOCATION NODE
                    </div>
                    {Object.entries(UAE_REGIONS).map(([key, region]) => (
                        <button
                            key={key}
                            onClick={() => { onChange(key); setOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-4 text-[10px] font-black tracking-widest transition-colors ${key === value
                                ? "bg-white text-black"
                                : "text-zinc-400 hover:bg-white/10 hover:text-white"
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
