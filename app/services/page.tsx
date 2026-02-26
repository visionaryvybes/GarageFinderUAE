import Image from "next/image";
import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services";

export const metadata = {
    title: "Services | GarageFinder UAE",
    description: "Browse 15+ automotive services across all UAE emirates — from oil changes and brake repair to dyno tuning and EV service.",
};

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">

            {/* ── Hero Banner ── */}
            <div className="border-b border-[var(--border)] bg-gradient-to-b from-orange-950/20 to-transparent">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 rounded-2xl bg-orange-500 blur-lg opacity-20" />
                            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-600/20 to-orange-900/20 border border-orange-500/20 flex items-center justify-center">
                                <Wrench className="w-6 h-6 text-orange-400" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Link href="/" className="text-xs text-[var(--text-subtle)] hover:text-[var(--text-muted)] transition-colors">Home</Link>
                                <span className="text-[var(--text-subtle)] text-xs">/</span>
                                <span className="text-xs text-[var(--text-muted)]">Services</span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black tracking-tighter">
                                Our <span className="text-gradient-orange">Services</span>
                            </h1>
                            <p className="text-[var(--text-muted)] text-sm mt-1 max-w-xl">
                                15 expert automotive solutions available across all 7 UAE emirates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {SERVICES.map((svc) => (
                        <Link
                            key={svc.id}
                            href={`/services/${svc.slug}`}
                            className="group relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] hover:border-orange-500/30 transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={svc.img}
                                    alt={svc.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-9 h-9 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0">
                                        <svc.icon className={`w-4 h-4 ${svc.iconColor}`} />
                                    </div>
                                    <h2 className="text-base font-bold text-[var(--text)] group-hover:text-orange-400 transition-colors">
                                        {svc.name}
                                    </h2>
                                </div>
                                {svc.desc && (
                                    <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">{svc.desc}</p>
                                )}
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-400 group-hover:gap-2 transition-all">
                                    Find shops <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
