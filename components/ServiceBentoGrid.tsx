"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Wrench } from "lucide-react";
import { SERVICES } from "@/lib/services";

interface ServiceBentoGridProps {
    onSearch: (query: string, isAI?: boolean) => void;
}

export default function ServiceBentoGrid({ onSearch }: ServiceBentoGridProps) {
    return (
        <section className="relative z-10 w-full max-w-7xl mx-auto px-4 py-16">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">Services</span>
                    </h2>
                    <p className="text-zinc-500 font-medium max-w-md text-sm md:text-base">
                        23 expert solutions across all 7 UAE emirates.
                    </p>
                </div>
                <a
                    href="/services"
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-[#1a1a1a] hover:bg-zinc-900 hover:border-zinc-700 transition-all text-sm font-bold text-zinc-300"
                >
                    View All <Wrench className="w-4 h-4" />
                </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[160px] md:auto-rows-[180px]">
                {SERVICES.map((svc, i) => (
                    <motion.div
                        key={svc.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => onSearch(svc.query, false)}
                        className={`
              relative group cursor-pointer overflow-hidden rounded-2xl border border-[#1a1a1a] hover:border-blue-600/30 transition-all duration-500
              ${svc.colSpan === 2 ? "col-span-2" : "col-span-1"}
              ${svc.rowSpan === 2 ? "row-span-2" : "row-span-1"}
            `}
                    >
                        {/* Background Image */}
                        <Image
                            src={svc.img}
                            alt={svc.name}
                            fill
                            className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                        <div className="relative h-full flex flex-col p-5 md:p-6 z-10">
                            <div className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                <svc.icon className={`w-5 h-5 ${svc.iconColor}`} />
                            </div>
                            <div className="mt-auto">
                                <h3 className="text-base md:text-lg font-bold text-white leading-tight drop-shadow-lg">
                                    {svc.name}
                                </h3>
                                {svc.desc && (
                                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{svc.desc}</p>
                                )}
                            </div>
                            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <div className="w-7 h-7 rounded-full bg-blue-600/20 backdrop-blur-sm flex items-center justify-center border border-blue-600/30">
                                    <Search className="w-3.5 h-3.5 text-blue-400" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
