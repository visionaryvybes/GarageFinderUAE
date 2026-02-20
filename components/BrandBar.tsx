"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, LayoutGrid } from "lucide-react";
import { CAR_BRANDS } from "@/lib/brands";

interface BrandBarProps {
  activeBrand: string | null;
  onBrandSelect: (query: string, brandId: string | null) => void;
}

const BRAND_CATEGORIES = [
  { id: "german",   label: "German",    brands: ["bmw", "mercedes-benz", "audi", "volkswagen", "porsche", "mini"] },
  { id: "exotic",   label: "Exotic",    brands: ["ferrari", "lamborghini", "bentley", "rolls-royce", "maserati", "alfa-romeo"] },
  { id: "british",  label: "British",   brands: ["jaguar", "land-rover"] },
  { id: "european", label: "European",  brands: ["volvo", "peugeot", "renault", "fiat"] },
  { id: "electric", label: "Electric",  brands: ["tesla"] },
  { id: "japanese", label: "Japanese",  brands: ["toyota", "honda", "nissan", "mazda", "subaru", "mitsubishi", "lexus", "infiniti", "acura"] },
  { id: "korean",   label: "Korean",    brands: ["hyundai", "kia", "genesis"] },
  { id: "american", label: "American",  brands: ["ford", "chevrolet", "dodge", "ram", "jeep", "cadillac", "lincoln", "buick", "gmc", "chrysler"] },
];

function BrandLogo({ id, name }: { id: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    const brand = CAR_BRANDS.find(b => b.id === id);
    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
        style={{ background: brand?.color || "#1a1a1a", color: brand?.textColor || "#fff" }}
      >
        {brand?.initial || name[0]}
      </div>
    );
  }
  return (
    <img
      src={`/car-logos/${id}.png`}
      alt={name}
      className="w-8 h-8 object-contain brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-200"
      onError={() => setFailed(true)}
    />
  );
}

export default function BrandBar({ activeBrand, onBrandSelect }: BrandBarProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("german");
  const scrollRef = useRef<HTMLDivElement>(null);

  const allBrands = [...CAR_BRANDS, ...CAR_BRANDS]; // duplicated for marquee

  const currentBrand = activeBrand ? CAR_BRANDS.find(b => b.id === activeBrand) : null;

  return (
    <>
      <div className="relative w-full overflow-hidden border-b border-white/[0.04] bg-[#040404]">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[#040404] to-transparent pointer-events-none" />
        {/* Right fade + Browse button */}
        <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center gap-2 pr-3">
          <div className="w-20 absolute right-0 top-0 bottom-0 bg-gradient-to-l from-[#040404] to-transparent pointer-events-none" />
          <button
            onClick={() => setShowModal(true)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-violet-600/40 hover:text-violet-400 transition-all z-20 shrink-0"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Browse</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Marquee */}
        <div className="flex items-center gap-10 py-4 animate-marquee w-max pr-32">
          {allBrands.map((brand, i) => {
            const isSelected = activeBrand === brand.id;
            return (
              <button
                key={`${brand.id}-${i}`}
                onClick={() => onBrandSelect(brand.query, isSelected ? null : brand.id)}
                className={`group relative flex items-center gap-2.5 transition-all duration-200 ${
                  isSelected ? "opacity-100" : "opacity-50 hover:opacity-100"
                }`}
              >
                <div className={`transition-transform duration-200 ${isSelected ? "scale-110" : "group-hover:scale-105"}`}>
                  <BrandLogo id={brand.id} name={brand.name} />
                </div>
                <span className={`text-xs font-bold tracking-widest uppercase transition-colors duration-200 ${
                  isSelected ? "text-white" : "text-zinc-600 group-hover:text-zinc-300"
                }`}>
                  {brand.name}
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="brand-indicator"
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-500 rounded-full shadow-[0_0_8px_#3b82f6]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active brand pill */}
        {activeBrand && currentBrand && (
          <div className="absolute left-16 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-600/15 border border-violet-600/30 backdrop-blur-sm">
              <span className="text-xs font-bold text-violet-400">{currentBrand.name}</span>
              <button
                onClick={() => onBrandSelect("auto repair", null)}
                className="text-violet-400/60 hover:text-violet-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Brand Browser Modal ── */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 top-[5%] z-50 max-h-[85vh] max-w-2xl mx-auto bg-[#080808] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60 shrink-0">
                <div>
                  <h2 className="font-bold text-white text-lg">Browse by Brand</h2>
                  <p className="text-xs text-zinc-600 mt-0.5">41 brands — find your specialist</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full bg-[#1a1a1a] hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              {/* All button */}
              {activeBrand && (
                <div className="px-5 pt-4 shrink-0">
                  <button
                    onClick={() => { onBrandSelect("auto repair", null); setShowModal(false); }}
                    className="w-full py-2 rounded-xl border border-zinc-800 text-sm text-zinc-400 hover:border-zinc-700 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear brand filter
                  </button>
                </div>
              )}

              {/* Category tabs */}
              <div ref={scrollRef} className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto scrollbar-none shrink-0 border-b border-zinc-800/60">
                {BRAND_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                      activeCategory === cat.id
                        ? "bg-violet-600/15 border-violet-600/40 text-violet-400"
                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Brand grid */}
              <div className="flex-1 min-h-0 overflow-y-auto p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BRAND_CATEGORIES.find(c => c.id === activeCategory)?.brands.map(brandId => {
                    const brand = CAR_BRANDS.find(b => b.id === brandId);
                    if (!brand) return null;
                    const isActive = activeBrand === brandId;
                    return (
                      <button
                        key={brandId}
                        onClick={() => {
                          onBrandSelect(brand.query, isActive ? null : brandId);
                          setShowModal(false);
                        }}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isActive
                            ? "bg-violet-600/10 border-violet-600/30"
                            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center shrink-0 overflow-hidden border border-white/5">
                          <img
                            src={`/car-logos/${brandId}.png`}
                            alt={brand.name}
                            className="w-7 h-7 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                        <div className="text-left min-w-0">
                          <p className={`text-sm font-bold truncate ${isActive ? "text-violet-400" : "text-zinc-200"}`}>
                            {brand.name}
                          </p>
                          <p className="text-[10px] text-zinc-600 truncate">Find specialists</p>
                        </div>
                      </button>
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
