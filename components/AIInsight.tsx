"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  AlertTriangle,
  DollarSign,
  Wrench,
  X,
} from "lucide-react";

interface AIInsightProps {
  analysis: {
    possibleIssue: string;
    estimatedCostRange: string;
    urgency: "low" | "medium" | "high";
    serviceType: string;
  } | null;
  onDismiss: () => void;
}

export default function AIInsight({ analysis, onDismiss }: AIInsightProps) {
  if (!analysis || (!analysis.possibleIssue && !analysis.estimatedCostRange)) {
    return null;
  }

  const urgencyColors = {
    low: "text-blue-400 bg-blue-900/20 border-blue-500/50",
    medium: "text-amber-400 bg-amber-900/20 border-amber-500/50",
    high: "text-red-400 bg-red-900/20 border-red-500/50",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`p-4 border ${urgencyColors[analysis.urgency]} relative group flex flex-col font-mono`}
      >
        <button
          onClick={onDismiss}
          className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center border-l border-b border-inherit hover:bg-white hover:text-black transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4 bg-black/50 w-fit px-3 py-1 border border-inherit">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            AI DIAGNOSTIC MODULE
          </span>
        </div>

        <div className="space-y-3">
          {analysis.possibleIssue && (
            <div className="flex items-start gap-3 border-b border-inherit/30 pb-3">
              <Wrench className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
              <p className="text-xs uppercase tracking-widest leading-relaxed">
                <span className="font-black opacity-100 block mb-1">
                  DETECTED ANOMALY
                </span>
                <span className="opacity-80">{analysis.possibleIssue}</span>
              </p>
            </div>
          )}

          {analysis.estimatedCostRange && (
            <div className="flex items-start gap-3 border-b border-inherit/30 pb-3">
              <DollarSign className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
              <p className="text-xs uppercase tracking-widest leading-relaxed">
                <span className="font-black opacity-100 block mb-1">
                  REPAIR ESTIMATE
                </span>
                <span className="opacity-80 font-black">{analysis.estimatedCostRange}</span>
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <AlertTriangle className={`w-4 h-4 shrink-0 animate-pulse`} />
            <p className="text-xs uppercase tracking-widest">
              <span className="font-black opacity-100">PRIORITY LEVEL:</span>{" "}
              <span className="font-black">
                {analysis.urgency}
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
