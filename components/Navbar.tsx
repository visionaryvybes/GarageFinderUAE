"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Newspaper, Car, Scale, Menu, X, Package,
  MapPin, LayoutDashboard, Gauge, ChevronDown,
} from "lucide-react";

const NAV_PRIMARY = [
  { href: "/", label: "Find Shops", icon: MapPin },
  { href: "/garages", label: "Garages", icon: Wrench },
  { href: "/parts", label: "Parts", icon: Package },
  { href: "/my-car", label: "My Car", icon: Car, badge: "AI" },
];

const NAV_MORE = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/laws", label: "UAE Laws", icon: Scale },
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
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isMoreActive = NAV_MORE.some((l) => isActive(l.href));

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/60">
        {/* Bottom shimmer line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 bg-violet-600 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-7 h-7 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 rounded-xl flex items-center justify-center">
                <Wrench className="w-3.5 h-3.5 text-violet-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <span className="text-[15px] font-black tracking-tight leading-none text-white">
              Garage<span className="text-violet-400">Finder</span>
            </span>
          </Link>

          {/* Desktop nav — primary links */}
          <div className="hidden md:flex items-center gap-0.5 ml-3 flex-1">
            {NAV_PRIMARY.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? "text-violet-300"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <link.icon className="w-3 h-3" />
                  {link.label}
                  {"badge" in link && link.badge && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-400">
                      {link.badge}
                    </span>
                  )}
                  {/* Animated underline for active */}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-violet-400"
                    />
                  )}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  isMoreActive
                    ? "text-violet-300"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                More
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-44 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
                  >
                    {NAV_MORE.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-2.5 px-3 py-2.5 text-[12px] font-semibold transition-colors ${
                          isActive(link.href)
                            ? "bg-violet-600/10 text-violet-300"
                            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        }`}
                      >
                        <link.icon className="w-3.5 h-3.5" />
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile: current page label + hamburger */}
          <div className="md:hidden ml-auto flex items-center gap-2">
            <span className="text-[11px] text-zinc-600 hidden sm:block">
              {[...NAV_PRIMARY, ...NAV_MORE].find(l => isActive(l.href))?.label || "GarageFinder"}
            </span>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
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
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-zinc-950 border-r border-zinc-800 z-50 flex flex-col md:hidden"
            >
              {/* Gradient accent at top */}
              <div className="h-0.5 bg-gradient-to-r from-violet-600 via-violet-400 to-transparent" />

              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800/60">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <div className="relative w-7 h-7">
                    <div className="absolute inset-0 bg-violet-600 rounded-xl blur-md opacity-40" />
                    <div className="relative w-7 h-7 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 rounded-xl flex items-center justify-center">
                      <Wrench className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                  </div>
                  <span className="text-[15px] font-black text-white">
                    Garage<span className="text-violet-400">Finder</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Nav links */}
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
                            ? "bg-violet-600/12 text-violet-300 border border-violet-600/25"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
                        }`}
                      >
                        <link.icon className={`w-4 h-4 shrink-0 ${active ? "text-violet-400" : ""}`} />
                        <span className="flex-1">{link.label}</span>
                        {"badge" in link && link.badge && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-400">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-4 border-t border-zinc-800/60 space-y-2">
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/60">
        <div className="grid grid-cols-5 h-[60px]">
          {BOTTOM_TABS.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors min-h-[44px] ${
                  active ? "text-violet-400" : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`p-1.5 rounded-xl transition-colors ${active ? "bg-violet-500/10" : ""}`}
                >
                  <tab.icon className="w-5 h-5" />
                </motion.div>
                <span className={`text-[9px] font-semibold transition-all ${active ? "opacity-100" : "opacity-0"}`}>
                  {tab.label}
                </span>
                {/* Active glow dot */}
                {active && (
                  <motion.span
                    layoutId="bottom-tab-dot"
                    className="absolute bottom-1 w-1 h-1 rounded-full bg-violet-400"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom padding spacer for mobile tab bar */}
      <div className="md:hidden h-[60px]" />
    </>
  );
}
