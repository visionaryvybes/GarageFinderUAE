"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Newspaper, Car, Scale, Menu, X, Package,
  MapPin, LayoutDashboard, Gauge, Server
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "HOLO-MAP", icon: MapPin },
  { href: "/garages", label: "NODE DB", icon: Wrench },
  { href: "/parts", label: "HARDWARE", icon: Package },
  { href: "/my-car", label: "AI DIAGNOSTIC", icon: Car, badge: "AI" },
  { href: "/dashboard", label: "TELEMETRY", icon: LayoutDashboard },
  { href: "/news", label: "ARCHIVES", icon: Newspaper },
  { href: "/laws", label: "PROTOCOLS", icon: Scale },
  { href: "/services", label: "OPERATIONS", icon: Gauge },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#050505] border-grid-b font-mono">
        <div className="flex items-stretch h-14 border-grid-b bg-[#000]">
          {/* Logo Block */}
          <Link href="/" className="flex items-center gap-3 px-6 h-full border-r border-white/20 hover:bg-white hover:text-black transition-colors group relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-4 h-4 border-b border-l border-white/20 group-hover:border-black" />
            <Server className="w-4 h-4 text-white group-hover:text-black" />
            <span className="text-[11px] font-black tracking-widest uppercase">
              GARAGE<span className="text-zinc-500 group-hover:text-zinc-600">FINDER</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex flex-1 items-stretch overflow-x-auto scrollbar-none">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-6 h-full border-r transition-colors shrink-0 text-[10px] font-black tracking-widest uppercase ${active
                      ? "bg-white text-black border-white"
                      : "bg-[#050505] text-zinc-500 hover:text-white border-white/20 hover:bg-white/5"
                    }`}
                >
                  <link.icon className={`w-3.5 h-3.5 ${active ? "text-black" : "opacity-70"}`} />
                  {link.label}
                  {"badge" in link && link.badge && (
                    <span className={`px-1.5 py-0.5 border text-[9px] ${active ? "border-black bg-black text-white" : "border-white/20 bg-white/5 text-white"}`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center px-6 h-full border-l border-white/20 bg-[#050505] shrink-0 gap-3">
            <div className="w-2 h-2 bg-emerald-400 border border-black animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">SYSTEM ONLINE</span>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden ml-auto flex items-stretch border-l border-white/20">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="px-6 h-full flex items-center justify-center hover:bg-white hover:text-black transition-colors text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.2 }}
            className="fixed inset-0 bg-[#050505] z-50 flex flex-col font-mono"
          >
            <div className="flex items-center justify-between h-14 border-grid-b bg-white text-black px-6">
              <span className="text-[11px] font-black tracking-widest uppercase">MAIN TERMINAL</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto w-full">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 px-6 py-5 border-grid-b text-[11px] font-black uppercase tracking-widest transition-colors ${active
                        ? "bg-white text-black"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <link.icon className="w-5 h-5 shrink-0" />
                    <span>{link.label}</span>
                    {"badge" in link && link.badge && (
                      <span className={`ml-auto px-2 py-1 border text-[9px] ${active ? "border-black bg-black text-white" : "border-white/20 bg-white/5 text-white"}`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="p-6 border-grid-t bg-[#000] flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-400 border border-black animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">SYSTEM ONLINE · 2,200+ NODES</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
