"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Newspaper, Car, Scale, Menu, X, Package, MapPin, CalendarDays } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Find Shops", icon: MapPin },
  { href: "/garages", label: "Garages", icon: Wrench },
  { href: "/parts", label: "Spare Parts", icon: Package },
  { href: "/services", label: "Services", icon: Car },
  { href: "/news", label: "News & Events", icon: Newspaper },
  { href: "/laws", label: "UAE Laws", icon: Scale },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur-xl border-b border-[#1a1a1a]">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur opacity-40" />
              <div className="relative w-8 h-8 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 rounded-xl flex items-center justify-center">
                <Wrench className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <span className="text-[16px] font-black tracking-tight leading-none text-white hidden sm:block">
              Garage<span className="text-blue-500">Finder</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 ml-2 flex-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600/15 text-blue-400 border border-blue-600/25"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-[#111]"
                  }`}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu btn */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden ml-auto p-2 rounded-lg bg-[#111] border border-[#1a1a1a] text-zinc-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
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
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#080808] border-r border-[#1a1a1a] z-50 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
                <span className="text-[16px] font-black text-white">
                  Garage<span className="text-blue-500">Finder</span>
                </span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg bg-[#111] text-zinc-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-blue-600/15 text-blue-400 border border-blue-600/25"
                          : "text-zinc-400 hover:text-white hover:bg-[#111]"
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <div className="p-4 border-t border-[#1a1a1a]">
                <p className="text-xs text-zinc-700">UAE · AI-Powered · 450+ Shops</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
