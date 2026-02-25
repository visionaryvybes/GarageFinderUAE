"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface GenerativeGridProps {
    className?: string;
    cellSize?: number;
    highlightDensity?: number; // 0.0 to 1.0 (percent of cells illuminated)
    pulseSpeed?: number;
}

export default function GenerativeGrid({
    className = "",
    cellSize = 60,
    highlightDensity = 0.05,
    pulseSpeed = 4,
}: GenerativeGridProps) {
    // Generate a random stable layout on mount
    const gridCells = useMemo(() => {
        // Arbitrary large grid to cover screens
        const cols = 20;
        const rows = 15;
        const cells = [];

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                // Determine if this cell should have a highlight element
                const isHighlighted = Math.random() < highlightDensity;

                // Determine the style of the highlight (crosshair, block, dot)
                const type = Math.random();

                if (isHighlighted) {
                    cells.push({
                        id: `${i}-${j}`,
                        x: i * cellSize,
                        y: j * cellSize,
                        type: type > 0.7 ? "cross" : type > 0.4 ? "block" : "dot",
                        delay: Math.random() * pulseSpeed
                    });
                }
            }
        }

        return cells;
    }, [cellSize, highlightDensity, pulseSpeed]);

    return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
                {/* Base Grid Pattern */}
                <defs>
                    <pattern id="generative-grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
                        <path
                            d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            className="text-white/10"
                        />
                    </pattern>
                </defs>

                <rect width="100%" height="100%" fill="url(#generative-grid)" />

                {/* Generative Elements */}
                {gridCells.map((cell) => {
                    if (cell.type === "cross") {
                        return (
                            <motion.g
                                key={cell.id}
                                initial={{ opacity: 0.1 }}
                                animate={{ opacity: [0.1, 0.8, 0.1] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: pulseSpeed,
                                    delay: cell.delay,
                                    ease: "easeInOut"
                                }}
                                className="text-white/40"
                                stroke="currentColor"
                                strokeWidth="1"
                            >
                                <path d={`M ${cell.x - 5} ${cell.y} L ${cell.x + 5} ${cell.y}`} />
                                <path d={`M ${cell.x} ${cell.y - 5} L ${cell.x} ${cell.y + 5}`} />
                            </motion.g>
                        );
                    }

                    if (cell.type === "block") {
                        return (
                            <motion.rect
                                key={cell.id}
                                x={cell.x + 1}
                                y={cell.y + 1}
                                width={cellSize - 2}
                                height={cellSize - 2}
                                className="fill-white/5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.2, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: pulseSpeed * 1.5,
                                    delay: cell.delay,
                                    ease: "linear"
                                }}
                            />
                        );
                    }

                    // Dot
                    return (
                        <motion.circle
                            key={cell.id}
                            cx={cell.x}
                            cy={cell.y}
                            r="1.5"
                            className="fill-white/60"
                            initial={{ opacity: 0.2 }}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{
                                repeat: Infinity,
                                duration: pulseSpeed * 0.8,
                                delay: cell.delay,
                                ease: "circInOut"
                            }}
                        />
                    );
                })}
            </svg>
        </div>
    );
}
