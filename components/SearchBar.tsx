"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Mic,
  Sparkles,
  X,
  Loader2,
  Camera,
} from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string, isAI?: boolean) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    "BMW specialist near me",
    "Cheap oil change",
    "My car is making a grinding noise when braking",
    "Transmission repair",
    "Check engine light is on",
    "Tire rotation and alignment",
    "Emergency tow service",
    "Car AC not working",
  ];

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
      if (e.key === "/" && !isFocused) {
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
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
            flex items-center gap-3 bg-surface border rounded-2xl px-4 py-3
            transition-all duration-200
            ${
              isFocused
                ? "border-accent shadow-lg shadow-accent-dim"
                : "border-border hover:border-border-light"
            }
          `}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-accent animate-spin shrink-0" />
          ) : (
            <Search className="w-5 h-5 text-text-muted shrink-0" />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search shops or describe your car problem..."
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none text-[15px]"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 hover:bg-surface-hover rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-text-muted" />
            </button>
          )}

          <button
            type="button"
            className="p-1.5 hover:bg-surface-hover rounded-full transition-colors"
            title="Image search"
          >
            <Camera className="w-4 h-4 text-text-muted" />
          </button>

          <button
            type="button"
            className="p-1.5 hover:bg-surface-hover rounded-full transition-colors"
            title="Voice search"
          >
            <Mic className="w-4 h-4 text-text-muted" />
          </button>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover disabled:opacity-40 text-zinc-950 rounded-xl text-sm font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Search
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {isFocused && !query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-2xl overflow-hidden shadow-xl z-50">
          <div className="px-4 py-2.5 border-b border-border">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Try searching for
            </span>
          </div>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover transition-colors text-left"
            >
              <Search className="w-4 h-4 text-text-muted shrink-0" />
              <span className="text-sm text-text-primary">{s}</span>
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isFocused && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsFocused(false)}
        />
      )}
    </div>
  );
}
