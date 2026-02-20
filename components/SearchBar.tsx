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

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200 ${
            isFocused
              ? "bg-[#0d0d0d] border-blue-600/40 shadow-lg shadow-blue-900/10"
              : "bg-[#0a0a0a] border-[#1a1a1a] hover:border-zinc-700/60"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
          ) : (
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search or describe your problem..."
            className="flex-1 bg-transparent text-white placeholder:text-zinc-600 outline-none text-sm min-w-0"
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
            className="p-1.5 hover:bg-zinc-800 rounded-full transition-colors shrink-0"
            title="Voice search"
          >
            <Mic className="w-3.5 h-3.5 text-zinc-600" />
          </button>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-default text-white rounded-lg text-xs font-bold transition-colors shrink-0"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {isFocused && !query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl z-50">
          <div className="px-4 py-2.5 border-b border-[#1a1a1a]">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Popular Searches
            </span>
          </div>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.text}
              onClick={() => handleSuggestion(s.text)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#111] transition-colors text-left group"
            >
              <s.icon className="w-3.5 h-3.5 text-zinc-700 shrink-0 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">{s.text}</span>
            </button>
          ))}
          <div className="px-4 py-2.5 border-t border-[#1a1a1a] flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-[#111] border border-[#222] text-[10px] text-zinc-600 font-mono">/</kbd>
            <span className="text-[11px] text-zinc-700">to focus search</span>
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
