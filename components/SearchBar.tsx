"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, X, Loader2, TrendingUp, Clock, Mic } from "lucide-react";

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
  "Search garages, parts, or describe your issue...",
  "BMW M3 specialist Dubai...",
  "AC repair Abu Dhabi...",
  "Oil change near me...",
  "Check engine light diagnosis...",
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
          className={`flex items-center gap-2 px-4 h-12 rounded-xl bg-[#111113] border transition-all duration-200 ${
            isFocused
              ? "border-orange-500/40 shadow-lg shadow-orange-500/10"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin shrink-0 text-orange-400" />
          ) : (
            <Search className="w-4 h-4 shrink-0 text-zinc-500" />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={PLACEHOLDER_EXAMPLES[placeholderIdx]}
            className="flex-1 bg-transparent outline-none text-white text-sm min-w-0 placeholder:text-zinc-600"
          />

          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="p-1 text-zinc-500 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            className="p-1.5 text-zinc-500 hover:text-white rounded-lg transition-colors"
            title="Voice search"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-md hover:shadow-orange-500/25 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {isFocused && !query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111113] border border-white/10 rounded-2xl z-50 overflow-hidden shadow-2xl shadow-black/50">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <span className="text-xs font-semibold text-zinc-500">Popular searches</span>
          </div>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.text}
              onClick={() => handleSuggestion(s.text)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors text-left group border-b border-white/[0.04] last:border-0"
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-800 group-hover:bg-orange-500/15 flex items-center justify-center transition-colors">
                <s.icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-orange-400 transition-colors" />
              </div>
              <span className="text-sm text-zinc-400 group-hover:text-white transition-colors truncate">{s.text}</span>
            </button>
          ))}
        </div>
      )}

      {isFocused && (
        <div className="fixed inset-0 z-40" onClick={() => setIsFocused(false)} />
      )}
    </div>
  );
}
