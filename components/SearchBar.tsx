"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Mic, Sparkles, X, Loader2, TrendingUp, Clock } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string, isAI?: boolean) => void;
  isLoading: boolean;
}

const SUGGESTIONS = [
  { text: "BMW M3 specialist near me", icon: TrendingUp },
  { text: "Oil change near me", icon: Clock },
  { text: "Car making grinding noise when braking", icon: TrendingUp },
  { text: "Check engine light is on", icon: TrendingUp },
  { text: "AC not working in summer heat", icon: TrendingUp },
  { text: "Emergency towing UAE", icon: Clock },
];

const PLACEHOLDER_EXAMPLES = [
  "INPUT QUERY OR DESCRIBE SYMPTOM...",
  "BMW M3 SPECIALIST DUBAI...",
  "AC FAILURE IN SUMMER HEAT...",
  "OIL MAINTENANCE DUBAI MARINA...",
  "DIAGNOSE ENGINE LIGHT...",
];

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), true);
      setIsFocused(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion, true);
    setIsFocused(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_EXAMPLES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !isFocused && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFocused]);

  return (
    <div className="relative w-full z-50">
      <form onSubmit={handleSubmit}>
        <div
          className={`group flex items-center gap-3 px-4 h-12 border bg-[#050505] transition-colors duration-200 ${isFocused
              ? "border-white bg-white"
              : "border-white/20 hover:border-white"
            }`}
        >
          {isLoading ? (
            <Loader2 className={`w-4 h-4 animate-spin shrink-0 ${isFocused ? 'text-black' : 'text-zinc-500'}`} />
          ) : (
            <Search className={`w-4 h-4 shrink-0 transition-colors ${isFocused ? 'text-black' : 'text-zinc-500 group-hover:text-white'}`} />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={PLACEHOLDER_EXAMPLES[placeholderIdx]}
            className={`flex-1 bg-transparent outline-none text-xs font-black tracking-widest uppercase min-w-0 transition-colors duration-200 ${isFocused ? 'text-black placeholder:text-zinc-500' : 'text-white placeholder:text-zinc-600'
              }`}
          />

          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className={`p-1 shrink-0 ${isFocused ? 'text-black hover:bg-black hover:text-white' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}
            >
              <X className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            className={`p-1.5 shrink-0 transition-colors ${isFocused ? 'text-black hover:bg-black hover:text-white' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}
            title="Voice search"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={`flex items-center gap-2 px-4 h-full border-l text-[10px] font-black tracking-widest uppercase transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${isFocused
                ? 'border-black text-black hover:bg-black hover:text-white'
                : 'border-white/20 text-white hover:bg-white hover:text-black hover:border-white'
              }`}
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">EXECUTE</span>
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {isFocused && !query && (
        <div className="absolute top-full left-0 right-0 mt-0 bg-[#000] border border-t-0 border-white z-50">
          <div className="px-4 py-3 border-b border-white/20 bg-[#050505]">
            <span className="text-[9px] font-black text-white uppercase tracking-widest">
              FREQUENT QUERIES
            </span>
          </div>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.text}
              onClick={() => handleSuggestion(s.text)}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white hover:text-black transition-colors text-left group text-zinc-400 text-xs font-bold tracking-widest uppercase border-b border-white/5 last:border-0"
            >
              <div className="w-6 h-6 border border-white/20 group-hover:border-black flex items-center justify-center transition-colors">
                <s.icon className="w-3 h-3 text-zinc-500 group-hover:text-black transition-colors" />
              </div>
              <span className="group-hover:text-black transition-colors truncate">{s.text}</span>
            </button>
          ))}
          <div className="px-4 py-3 border-t border-white/20 flex items-center gap-2 bg-[#050505]">
            <kbd className="px-1.5 py-0.5 border border-zinc-700 bg-[#000] text-[9px] text-zinc-500 font-mono">/</kbd>
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">TO FOCUS SEARCH INPUT</span>
          </div>
        </div>
      )}

      {isFocused && (
        <div className="fixed inset-0 z-40" onClick={() => setIsFocused(false)} />
      )}
    </div>
  );
}
