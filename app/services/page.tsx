import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/lib/services";

export const metadata = {
    title: "Services | GarageFinder UAE",
    description: "Browse 15+ automotive services across all UAE emirates — from oil changes and brake repair to dyno tuning and EV service.",
};

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-[#1a1a1a] px-6 py-4">
                <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">
                    ← Back to Home
                </Link>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-3">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">Services</span>
                </h1>
                <p className="text-zinc-500 text-lg mb-12 max-w-xl">
                    15 expert automotive solutions available across all 7 UAE emirates.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SERVICES.map((svc) => (
                        <Link
                            key={svc.id}
                            href={`/services/${svc.slug}`}
                            className="group relative rounded-2xl overflow-hidden border border-[#1a1a1a] hover:border-blue-600/30 transition-all duration-500"
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
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="p-5 bg-[#0a0a0a]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-9 h-9 rounded-xl bg-black border border-white/10 flex items-center justify-center">
                                        <svc.icon className={`w-4 h-4 ${svc.iconColor}`} />
                                    </div>
                                    <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                        {svc.name}
                                    </h2>
                                </div>
                                {svc.desc && (
                                    <p className="text-sm text-zinc-500">{svc.desc}</p>
                                )}
                                <span className="inline-block mt-3 text-xs font-semibold text-blue-500 group-hover:text-blue-400">
                                    Find shops →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
