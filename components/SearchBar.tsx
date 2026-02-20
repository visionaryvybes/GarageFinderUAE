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
  "Search garages, parts, or describe a problem...",
  "BMW M3 specialist in Dubai...",
  "AC not cooling in summer heat...",
  "Oil change near Dubai Marina...",
  "Check engine light is on...",
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

  // Cycle placeholder text
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
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div
          className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 transition-all duration-200 ${
            isFocused
              ? "bg-zinc-900 border-violet-500/40 shadow-[0_0_0_2px_rgba(139,92,246,0.15),0_0_24px_rgba(139,92,246,0.08)]"
              : "bg-zinc-900/70 border-zinc-800 hover:border-zinc-700"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-violet-400 animate-spin shrink-0" />
          ) : (
            <Search className="w-4 h-4 text-zinc-500 shrink-0" />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={PLACEHOLDER_EXAMPLES[placeholderIdx]}
            className="flex-1 bg-transparent text-white placeholder:text-zinc-600 outline-none text-sm min-w-0 transition-placeholder duration-500"
          />

          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="p-1 hover:bg-zinc-800 rounded-full transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          )}

          <button
            type="button"
            className="p-1.5 hover:bg-zinc-800 rounded-full transition-colors shrink-0 group"
            title="Voice search"
          >
            <Mic className="w-3.5 h-3.5 text-zinc-600 group-hover:text-violet-400 transition-colors" />
          </button>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:opacity-40 disabled:cursor-default text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-lg shadow-violet-900/20"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {isFocused && !query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 z-50">
          <div className="px-4 py-2.5 border-b border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Popular Searches
            </span>
          </div>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.text}
              onClick={() => handleSuggestion(s.text)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800/60 transition-colors text-left group"
            >
              <div className="w-6 h-6 rounded-lg bg-zinc-800 group-hover:bg-violet-600/15 flex items-center justify-center transition-colors">
                <s.icon className="w-3 h-3 text-zinc-600 group-hover:text-violet-400 transition-colors" />
              </div>
              <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">{s.text}</span>
            </button>
          ))}
          <div className="px-4 py-2.5 border-t border-zinc-800 flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-500 font-mono">/</kbd>
            <span className="text-[11px] text-zinc-600">to focus search</span>
          </div>
        </div>
      )}

      {/* Overlay to close */}
      {isFocused && (
        <div className="fixed inset-0 z-40" onClick={() => setIsFocused(false)} />
      )}
    </div>
  );
}
