"use client";

import {
  Wrench,
  Car,
  Droplets,
  CircleDot,
  Zap,
  Settings,
  ScanLine,
  Building2,
  PaintBucket,
  LayoutGrid,
} from "lucide-react";
import type { ServiceType } from "@/types";

interface FilterBarProps {
  activeFilter: ServiceType;
  onFilterChange: (filter: ServiceType) => void;
  openNow: boolean;
  onOpenNowChange: (value: boolean) => void;
}

const filters: { id: ServiceType; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All", icon: <LayoutGrid className="w-4 h-4" /> },
  { id: "general", label: "General", icon: <Wrench className="w-4 h-4" /> },
  { id: "body_shop", label: "Body Shop", icon: <PaintBucket className="w-4 h-4" /> },
  { id: "oil_change", label: "Oil Change", icon: <Droplets className="w-4 h-4" /> },
  { id: "tires", label: "Tires", icon: <CircleDot className="w-4 h-4" /> },
  { id: "transmission", label: "Transmission", icon: <Settings className="w-4 h-4" /> },
  { id: "brakes", label: "Brakes", icon: <Car className="w-4 h-4" /> },
  { id: "electrical", label: "Electrical", icon: <Zap className="w-4 h-4" /> },
  { id: "diagnostics", label: "Diagnostics", icon: <ScanLine className="w-4 h-4" /> },
  { id: "dealer", label: "Dealer", icon: <Building2 className="w-4 h-4" /> },
];

export default function FilterBar({
  activeFilter,
  onFilterChange,
  openNow,
  onOpenNowChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {/* Open Now toggle */}
      <button
        onClick={() => onOpenNowChange(!openNow)}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
          whitespace-nowrap border transition-all shrink-0
          ${
            openNow
              ? "bg-success/15 border-success/30 text-success"
              : "bg-surface border-border text-text-secondary hover:border-border-light"
          }
        `}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${openNow ? "bg-success" : "bg-text-muted"}`}
        />
        Open Now
      </button>

      <div className="w-px h-6 bg-border shrink-0" />

      {/* Service type filters */}
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
            whitespace-nowrap border transition-all shrink-0
            ${
              activeFilter === filter.id
                ? "bg-accent/15 border-accent/30 text-accent"
                : "bg-surface border-border text-text-secondary hover:border-border-light"
            }
          `}
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
    </div>
  );
}
