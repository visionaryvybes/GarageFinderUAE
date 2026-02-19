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
    low: "text-success",
    medium: "text-warning",
    high: "text-danger",
  };

  const urgencyBg = {
    low: "bg-success/10 border-success/20",
    medium: "bg-warning/10 border-warning/20",
    high: "bg-danger/10 border-danger/20",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`p-3 rounded-xl border ${urgencyBg[analysis.urgency]} relative`}
      >
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-3 h-3 text-text-muted" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
            AI Analysis
          </span>
        </div>

        <div className="space-y-2">
          {analysis.possibleIssue && (
            <div className="flex items-start gap-2">
              <Wrench className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
              <p className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">
                  Possible issue:
                </span>{" "}
                {analysis.possibleIssue}
              </p>
            </div>
          )}

          {analysis.estimatedCostRange && (
            <div className="flex items-start gap-2">
              <DollarSign className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
              <p className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">
                  Est. cost:
                </span>{" "}
                {analysis.estimatedCostRange}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <AlertTriangle
              className={`w-4 h-4 ${urgencyColors[analysis.urgency]} shrink-0`}
            />
            <p className="text-sm">
              <span className="font-medium text-text-primary">Urgency:</span>{" "}
              <span className={urgencyColors[analysis.urgency]}>
                {analysis.urgency.charAt(0).toUpperCase() + analysis.urgency.slice(1)}
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
