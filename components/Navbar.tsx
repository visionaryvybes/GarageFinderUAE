"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Newspaper, Car, Scale, Menu, X, Package,
  MapPin, LayoutDashboard, Gauge,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Find Shops", icon: MapPin },
  { href: "/garages", label: "Garages", icon: Wrench },
  { href: "/parts", label: "Parts", icon: Package },
  { href: "/my-car", label: "My Car", icon: Car, badge: "AI" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/laws", label: "Laws", icon: Scale },
  { href: "/services", label: "Services", icon: Gauge },
];

const MOBILE_NAV = [
  { href: "/", label: "Find Shops", icon: MapPin },
  { href: "/garages", label: "Garages", icon: Wrench },
  { href: "/parts", label: "Spare Parts", icon: Package },
  { href: "/my-car", label: "My Car Advisor", icon: Car, badge: "AI" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/services", label: "Services", icon: Gauge },
  { href: "/news", label: "News & Events", icon: Newspaper },
  { href: "/laws", label: "UAE Laws", icon: Scale },
];

const BOTTOM_TABS = [
  { href: "/", icon: MapPin, label: "Find" },
  { href: "/garages", icon: Wrench, label: "Garages" },
  { href: "/parts", icon: Package, label: "Parts" },
  { href: "/my-car", icon: Car, label: "My Car" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Stats" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur-xl border-b border-[#1a1a1a]">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-3 h-14 flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative w-7 h-7 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 rounded-xl flex items-center justify-center">
                <Wrench className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <span className="text-[15px] font-black tracking-tight leading-none text-white shrink-0">
              Garage<span className="text-blue-400">Finder</span>
            </span>
          </Link>

          {/* Desktop nav — ALL links flat, no More dropdown */}
          <div className="hidden md:flex items-center gap-0.5 ml-2 flex-1 overflow-x-auto scrollbar-none">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-blue-600/15 text-blue-400 border border-blue-600/25"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-[#111] border border-transparent"
                  }`}
                >
                  <link.icon className="w-3 h-3" />
                  {link.label}
                  {"badge" in link && link.badge && (
                    <span className="text-[9px] font-black px-1 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-400">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden ml-auto flex items-center gap-2">
            <span className="text-[11px] text-zinc-600 hidden sm:block">
              {NAV_LINKS.find(l => isActive(l.href))?.label || "GarageFinder"}
            </span>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-xl bg-[#111] border border-[#1a1a1a] text-zinc-400 hover:text-white transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileOpen ? "x" : "menu"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#060606] border-r border-[#1a1a1a] z-50 flex flex-col md:hidden"
            >
              <div className="h-0.5 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

              <div className="flex items-center justify-between px-4 py-4 border-b border-[#1a1a1a]">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <div className="relative w-7 h-7">
                    <div className="absolute inset-0 bg-blue-600 rounded-xl blur-md opacity-40" />
                    <div className="relative w-7 h-7 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 rounded-xl flex items-center justify-center">
                      <Wrench className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                  </div>
                  <span className="text-[15px] font-black text-white">
                    Garage<span className="text-blue-400">Finder</span>
                  </span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg bg-[#111] border border-[#1a1a1a] text-zinc-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
                {MOBILE_NAV.map((link, i) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                          active
                            ? "bg-blue-600/15 text-blue-400 border border-blue-600/25"
                            : "text-zinc-400 hover:text-white hover:bg-[#111] border border-transparent"
                        }`}
                      >
                        <link.icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{link.label}</span>
                        {"badge" in link && link.badge && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-400">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="px-4 py-4 border-t border-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[11px] text-zinc-600">UAE · AI-Powered · 2,200+ Shops</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-[#1a1a1a]">
        <div className="grid grid-cols-5 h-14">
          {BOTTOM_TABS.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex flex-col items-center justify-center gap-1 transition-colors min-h-[44px] ${
                  active ? "text-blue-400" : "text-zinc-600"
                }`}
              >
                <motion.div whileTap={{ scale: 0.85 }}>
                  <tab.icon className="w-5 h-5" />
                </motion.div>
                <span className="text-[9px] font-semibold">{tab.label}</span>
                {active && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute bottom-1 w-4 h-0.5 rounded-full bg-blue-500"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

    </>
  );
}
