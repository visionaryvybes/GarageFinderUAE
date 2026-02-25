"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Newspaper, Car, Scale, Package,
  LayoutDashboard, Gauge, X, ChevronRight,
  Home, MoreHorizontal, MapPin, Sun, Moon,
} from "lucide-react";
import { useTheme } from "@/app/providers";

const BOTTOM_TABS = [
  { href: "/", label: "Find", icon: Home },
  { href: "/garages", label: "Garages", icon: Wrench },
  { href: "/parts", label: "Parts", icon: Package },
  { href: "/my-car", label: "My Car", icon: Car, badge: "AI" },
  { href: "/more", label: "More", icon: MoreHorizontal, isMore: true },
];

const MORE_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Analytics & stats" },
  { href: "/news", label: "News", icon: Newspaper, desc: "UAE automotive news" },
  { href: "/laws", label: "UAE Laws", icon: Scale, desc: "Traffic regulations" },
  { href: "/services", label: "Services", icon: Gauge, desc: "Browse service types" },
];

const DESKTOP_NAV = [
  { href: "/", label: "Find", icon: MapPin },
  { href: "/garages", label: "Garages", icon: Wrench },
  { href: "/parts", label: "Parts", icon: Package },
  { href: "/my-car", label: "My Car", icon: Car, badge: "AI" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/laws", label: "Laws", icon: Scale },
  { href: "/services", label: "Services", icon: Gauge },
];

export default function Navbar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isMoreActive = MORE_LINKS.some((l) => pathname.startsWith(l.href));

  return (
    <>
      {/* ── Mobile Top Header ── */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-[#09090b]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">
            Garage<span className="text-orange-500">UAE</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-400">Live</span>
          </div>
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center hover:border-orange-500/40 transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark"
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-violet-400" />
            }
          </button>
        </div>
      </header>

      {/* ── Desktop Sticky Nav ── */}
      <nav className="hidden lg:flex sticky top-0 z-50 items-center h-14 px-6 bg-[#09090b]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5 mr-8 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <span className="text-[15px] font-bold text-white">
            Garage<span className="text-orange-500">UAE</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-none">
          {DESKTOP_NAV.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
                {"badge" in link && link.badge && (
                  <span className="badge-violet py-0 text-[10px]">{link.badge}</span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">450+ shops live</span>
          </div>
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center hover:border-orange-500/40 transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark"
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-violet-400" />
            }
          </button>
        </div>
      </nav>

      {/* ── Mobile Bottom Tab Bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="bg-[#09090b]/96 backdrop-blur-xl border-t border-white/[0.08] px-2 pt-2 pb-1">
          <div className="flex items-center justify-around">
            {BOTTOM_TABS.map((tab) => {
              const active = tab.isMore ? isMoreActive : isActive(tab.href);
              if (tab.isMore) {
                return (
                  <button
                    key="more"
                    onClick={() => setMoreOpen(true)}
                    className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                      active ? "text-orange-400" : "text-zinc-500"
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl transition-all ${active ? "bg-orange-500/15" : ""}`}>
                      <tab.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold">{tab.label}</span>
                  </button>
                );
              }
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] relative ${
                    active ? "text-orange-400" : "text-zinc-500"
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-all ${active ? "bg-orange-500/15" : ""}`}>
                    <tab.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold">{tab.label}</span>
                  {"badge" in tab && tab.badge && (
                    <span className="absolute top-0.5 right-1.5 badge-violet text-[9px] px-1.5 py-0">{tab.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── More Drawer ── */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60] lg:hidden"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden bg-[#111113] rounded-t-3xl border-t border-white/[0.08] pb-safe"
            >
              <div className="flex flex-col">
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-zinc-700" />
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="text-lg font-bold text-white">More</span>
                  <button
                    onClick={() => setMoreOpen(false)}
                    className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
                <div className="px-4 pb-6 grid grid-cols-1 gap-2">
                  {MORE_LINKS.map((link) => {
                    const active = pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                          active
                            ? "bg-orange-500/10 border border-orange-500/20"
                            : "bg-zinc-900/60 border border-white/[0.05] hover:bg-zinc-800/60"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          active ? "bg-orange-500/20" : "bg-zinc-800"
                        }`}>
                          <link.icon className={`w-5 h-5 ${active ? "text-orange-400" : "text-zinc-400"}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${active ? "text-orange-400" : "text-white"}`}>{link.label}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{link.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
