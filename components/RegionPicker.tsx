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
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors text-sm font-medium text-zinc-300"
            >
                <MapPin className="w-3.5 h-3.5 text-violet-500" />
                {current.label}
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-600 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute top-full mt-1 left-0 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
                    {Object.entries(UAE_REGIONS).map(([key, region]) => (
                        <button
                            key={key}
                            onClick={() => { onChange(key); setOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${key === value
                                    ? "bg-violet-600/10 text-violet-400 font-semibold"
                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                }`}
                        >
                            {region.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
