import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/services";
import { CheckCircle2 } from "lucide-react";

const SERVICE_DETAILS: Record<string, {
    description: string;
    features: string[];
    priceRange: string;
    avgTime: string;
    faq: { q: string; a: string }[];
}> = {
    "general-repair": { description: "Complete automotive repair for all makes and models across UAE. Full diagnostics, engine work, suspension and roadworthiness checks by verified mechanics.", features: ["Full vehicle inspection", "Engine repair & overhaul", "Suspension & steering", "Exhaust systems", "Pre-purchase inspection", "All makes & models"], priceRange: "AED 150 – 5,000+", avgTime: "2–8 hours", faq: [{ q: "How often to service in UAE?", a: "Every 10,000 km or 6 months — more frequently recommended due to UAE heat." }, { q: "Do you use genuine OEM parts?", a: "Our shops stock genuine OEM, aftermarket and brand-new parts per your preference." }] },
    "oil-change": { description: "Fast oil changes using premium synthetic and conventional oils. Multi-point inspection and fluid top-ups included — done in 30 minutes or less.", features: ["Full synthetic & conventional", "Oil filter replacement", "Multi-point inspection", "Fluid top-up", "Dashboard reset"], priceRange: "AED 80 – 350", avgTime: "20–45 min", faq: [{ q: "How often in UAE heat?", a: "Every 5,000–10,000 km. Full-synthetic recommended for UAE temperatures." }] },
    "brake-service": { description: "Expert brake repair, pad replacement, disc skimming and ABS diagnostics with OEM-spec parts and a post-job test drive guarantee.", features: ["Brake pad replacement", "Disc skimming & replacement", "Caliper service", "Brake fluid flush", "ABS diagnostics"], priceRange: "AED 200 – 1,500", avgTime: "1–3 hours", faq: [{ q: "Signs brakes need service?", a: "Squealing, vibration or longer stopping distances all indicate brake service is needed." }] },
    "ac-repair": { description: "Car AC diagnostics, gas refill, compressor repair and full system service. Beat UAE's extreme heat with same-day repairs guaranteed.", features: ["AC gas refill", "Compressor repair", "Leak detection", "System flushing", "Cabin filter replacement"], priceRange: "AED 100 – 2,500", avgTime: "1–4 hours", faq: [{ q: "Why is my AC not cold?", a: "Usually low refrigerant, a failing compressor or blocked condenser. A diagnostic will identify the cause." }] },
    "engine-diagnostics": { description: "Advanced OBD-II scanning and fault code reading with dealer-level equipment. Diagnose check engine lights and performance issues fast.", features: ["OBD-II full scan", "Engine fault codes", "Live sensor data", "Fuel system testing", "Emissions testing"], priceRange: "AED 50 – 500", avgTime: "1–3 hours", faq: [{ q: "What does check engine light mean?", a: "Can range from a loose gas cap to serious engine fault. Scan reveals the exact code." }] },
    "tire-services": { description: "Complete tyre services — fitting, balancing, alignment and puncture repair. All major brands in stock including Pirelli, Michelin and Bridgestone.", features: ["Tyre mounting", "Wheel balancing", "4-wheel alignment", "Puncture repair", "Tyre rotation", "TPMS service"], priceRange: "AED 25 – 2,500", avgTime: "20 min – 2 hours", faq: [{ q: "How often to rotate tyres?", a: "Every 8,000–10,000 km. UAE heat accelerates tyre wear." }] },
    "battery": { description: "Battery testing, replacement and jump-start services. Stock covers all vehicles from budget to premium, same-day fitting available.", features: ["Battery health test", "Battery replacement", "Jump-start", "Alternator check", "Terminal cleaning"], priceRange: "AED 150 – 800", avgTime: "30–60 min", faq: [{ q: "Battery life in UAE?", a: "Typically 2–3 years in UAE heat vs 4–5 years in cooler climates." }] },
    "body-paint": { description: "Professional dent removal, panel repair and full resprays. Insurance-approved with computer colour-matching for factory-perfect finish.", features: ["Paintless dent removal", "Panel beating", "Scratch repair", "Full respray", "Paint protection film"], priceRange: "AED 100 – 15,000+", avgTime: "1 day – 2 weeks", faq: [{ q: "Does insurance cover body repairs?", a: "Comprehensive insurance covers most body repairs. Our approved shops handle claims directly." }] },
    "spare-parts": { description: "Genuine OEM, quality aftermarket and used spare parts for all brands. Stores in Dubai, Abu Dhabi and Sharjah with same-day delivery.", features: ["Genuine OEM parts", "Aftermarket alternatives", "Used & reconditioned", "Engine parts", "Wholesale available"], priceRange: "AED 5 – 50,000+", avgTime: "In stock", faq: [{ q: "Best parts market in UAE?", a: "Deira in Dubai and Mussafah in Abu Dhabi are the main automotive parts hubs." }] },
    "dyno-tuning": { description: "Dynamometer testing, ECU remapping and performance tuning for increased power and torque. Stage 1, 2 and 3 tunes for most performance vehicles.", features: ["Chassis dyno testing", "ECU remapping", "Stage 1, 2 & 3 tunes", "Turbo calibration", "Data logging"], priceRange: "AED 500 – 8,000", avgTime: "3–8 hours", faq: [{ q: "How much power gain from Stage 1?", a: "Typically 15–25% more power. Results vary by model and condition." }] },
    "fuel-injector": { description: "Ultrasonic injector cleaning, spray pattern testing and flow analysis. Restore fuel efficiency and eliminate rough idle without expensive replacement.", features: ["Ultrasonic cleaning", "Spray pattern testing", "Flow rate analysis", "Fuel system flush", "Carbon clean"], priceRange: "AED 200 – 800", avgTime: "2–4 hours", faq: [{ q: "How often to clean injectors?", a: "Every 50,000–80,000 km or when experiencing rough idle or poor fuel economy." }] },
    "transmission": { description: "Automatic and manual gearbox repair, fluid flush, clutch replacement and CVT service. Free towing with major repairs at select shops.", features: ["Transmission fluid change", "Gearbox rebuild", "Clutch replacement", "CVT service", "DSG/PDK service"], priceRange: "AED 300 – 12,000", avgTime: "1–5 days", faq: [{ q: "Signs of transmission trouble?", a: "Slipping gears, delayed engagement or shuddering are warning signs. Get a diagnostic immediately." }] },
    "auto-electrical": { description: "Full electrical diagnostics including wiring, ECU, sensors, starters and alternators. Dealer-level scan tools for all brands.", features: ["Wiring diagnosis & repair", "Starter & alternator", "ECU programming", "Sensor replacement", "Battery management"], priceRange: "AED 100 – 3,000", avgTime: "1–6 hours", faq: [{ q: "Car won't start — electrical?", a: "Often yes. Could be battery, starter motor or ignition. Diagnostic will identify the cause." }] },
    "detailing": { description: "Premium ceramic coating, PPF and interior detailing to keep your vehicle showroom-fresh. Available at specialist studios across Dubai and Abu Dhabi.", features: ["Machine polishing", "Ceramic coating", "Paint protection film", "Interior deep clean", "Engine bay detail", "Leather treatment"], priceRange: "AED 300 – 8,000", avgTime: "4 hours – 3 days", faq: [{ q: "How long does ceramic coating last?", a: "2–5 years with proper care. Some premium coatings offer 10-year warranties." }] },
    "ev-service": { description: "Tesla and EV specialists for battery diagnostics, motor repair and charging system service. Certified EV technicians across UAE.", features: ["Battery health check", "Motor diagnostics", "Charging port repair", "Regenerative brakes", "Software updates"], priceRange: "AED 200 – 5,000", avgTime: "1–6 hours", faq: [{ q: "Do EVs need regular service?", a: "Yes — tyre rotation, brake checks, cabin filters and annual battery health checks." }] },
    "suspension": { description: "Shock absorbers, coilovers, control arms and wheel alignment. Restore ride quality and handling precision for all makes.", features: ["Shock absorber replacement", "Coilover installation", "Control arm & bush", "Tie rod & ball joint", "4-wheel alignment"], priceRange: "AED 200 – 5,000", avgTime: "2–6 hours", faq: [{ q: "Signs suspension needs attention?", a: "Excessive bouncing, pulling to one side or knocking noises indicate suspension issues." }] },
    "window-tinting": { description: "UAE RTA-compliant ceramic window tint. Reduce heat, UV exposure and improve privacy with premium films carrying lifetime warranties.", features: ["UAE RTA-legal levels", "Ceramic film", "99% UV block", "Heat reduction", "Old film removal", "All vehicle types"], priceRange: "AED 300 – 2,500", avgTime: "2–4 hours", faq: [{ q: "Legal tint level in UAE?", a: "Minimum 50% VLT on side and rear windows. Front windshield must remain untinted per RTA rules." }] },
    "roadside": { description: "24/7 towing, battery jump-starts and emergency repair across all UAE emirates. Average response under 30 minutes in urban areas.", features: ["24/7 towing", "Battery jump-start", "Tyre change", "Fuel delivery", "Lockout service", "All UAE coverage"], priceRange: "AED 100 – 800", avgTime: "15–45 min response", faq: [{ q: "Do you cover UAE highways?", a: "Yes — all major highways including Sheikh Zayed Road, Emirates Road and inter-emirate routes." }] },
    "vehicle-inspection": { description: "RTA inspection, pre-purchase checks and full roadworthiness assessments. Get a detailed report before buying any used car in UAE.", features: ["RTA registration check", "100-point pre-purchase", "Engine & transmission", "Body & frame inspection", "Full written report", "Same-day certificate"], priceRange: "AED 100 – 600", avgTime: "1–3 hours", faq: [{ q: "Should I inspect before buying?", a: "Always. A pre-purchase inspection reveals hidden damage, flood damage and upcoming repair costs." }] },
    "exhaust": { description: "Exhaust repair, catalytic converter service and performance exhaust fitting. From standard repairs to full aftermarket systems for sports cars.", features: ["Exhaust leak repair", "Catalytic converter service", "DPF cleaning", "Custom fabrication", "Performance exhaust fitting"], priceRange: "AED 150 – 8,000", avgTime: "1–4 hours", faq: [{ q: "Signs of exhaust problems?", a: "Loud rumbling, hissing, loss of power or fumes inside the cabin are exhaust warning signs." }] },
    "car-wash": { description: "Premium hand wash, steam cleaning and interior deep clean. From express washes to full detail packages that restore your vehicle.", features: ["Hand wash", "Steam clean", "Interior vacuum", "Dashboard treatment", "Tyre dressing", "Glass cleaning"], priceRange: "AED 30 – 400", avgTime: "30 min – 3 hours", faq: [{ q: "How often in UAE?", a: "Weekly is ideal due to UAE sand and dust. More frequently during sandstorm season." }] },
    "fleet-service": { description: "Corporate fleet maintenance contracts for all UAE emirates. Dedicated account management, priority booking and bulk pricing.", features: ["Dedicated account manager", "Priority service slots", "Bulk pricing", "Scheduled maintenance", "Multi-brand capability", "Digital fleet reports"], priceRange: "Contract-based", avgTime: "Flexible", faq: [{ q: "What fleet sizes do you service?", a: "From 5 vehicles to 500+. Fleet centres in Dubai, Abu Dhabi and Sharjah." }] },
    "insurance-repair": { description: "Insurance-approved body and mechanical repair. Partner garages work directly with all major UAE insurers for hassle-free claims.", features: ["All UAE insurers accepted", "Direct billing", "Courtesy car available", "OEM parts", "Warranty preserved", "Full documentation"], priceRange: "Insurance covered", avgTime: "2 days – 2 weeks", faq: [{ q: "Which insurers accepted?", a: "AXA, Oman Insurance, RSA, Al Ain Al Ahlia and all major UAE insurance providers." }] },
};

export async function generateStaticParams() {
    return SERVICES.map((svc) => ({ slug: svc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const svc = SERVICES.find((s) => s.slug === slug);
    if (!svc) return {};
    return {
        title: `${svc.name} in UAE | GarageFinder`,
        description: SERVICE_DETAILS[slug]?.description || `Find ${svc.name} services across UAE.`,
    };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const svc = SERVICES.find((s) => s.slug === slug);
    if (!svc) notFound();
    const details = SERVICE_DETAILS[slug];

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative h-64 md:h-80 overflow-hidden">
                <Image src={svc.img} alt={svc.name} fill className="object-cover opacity-40" sizes="100vw" priority />
                <div className="absolute inset-0    " />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
                    <Link href="/services" className="text-xs text-zinc-600 hover:text-zinc-400 mb-4 inline-block">← All Services</Link>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12  bg-black/60 backdrop- border border-white/10 flex items-center justify-center shrink-0">
                            <svc.icon className={`w-6 h-6 ${svc.iconColor}`} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter">{svc.name}</h1>
                            {details && <p className="text-zinc-500 text-sm mt-1 hidden sm:block">{details.avgTime} · {details.priceRange}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
                {details && (
                    <>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 px-4 py-2  bg-[#0a0a0a] border border-[#1a1a1a]">
                                <span className="text-xs text-zinc-600">Price range</span>
                                <span className="text-sm font-bold">{details.priceRange}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2  bg-[#0a0a0a] border border-[#1a1a1a]">
                                <span className="text-xs text-zinc-600">Typical time</span>
                                <span className="text-sm font-bold">{details.avgTime}</span>
                            </div>
                        </div>
                        <p className="text-zinc-400 leading-relaxed">{details.description}</p>
                        <div>
                            <h2 className="text-xl font-bold mb-4">What's Included</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {details.features.map(f => (
                                    <div key={f} className="flex items-center gap-3 p-3.5  bg-[#0a0a0a] border border-[#1a1a1a]">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                        <span className="text-sm text-zinc-300">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {details.faq.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Frequently Asked</h2>
                                <div className="space-y-3">
                                    {details.faq.map(item => (
                                        <div key={item.q} className="p-5  bg-[#0a0a0a] border border-[#1a1a1a]">
                                            <h3 className="font-semibold text-sm mb-2">{item.q}</h3>
                                            <p className="text-sm text-zinc-400 leading-relaxed">{item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="p-8     border border-blue-600/20">
                    <h2 className="text-2xl font-bold mb-2">Find {svc.name} Near You</h2>
                    <p className="text-zinc-500 mb-5">Verified shops across Dubai, Abu Dhabi, Sharjah and all UAE emirates.</p>
                    <Link href={`/?q=${encodeURIComponent(svc.query)}`} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white  font-semibold text-sm transition-all">
                        Search {svc.name} shops →
                    </Link>
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4">Related Services</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {SERVICES.filter(s => s.slug !== slug && s.category === svc.category).slice(0, 3).map(rel => (
                            <Link key={rel.id} href={`/services/${rel.slug}`} className="group flex items-center gap-3 p-3.5  bg-[#0a0a0a] border border-[#1a1a1a] hover:border-zinc-700 transition-all">
                                <div className="w-8 h-8  bg-black border border-white/5 flex items-center justify-center shrink-0">
                                    <rel.icon className={`w-4 h-4 ${rel.iconColor}`} />
                                </div>
                                <span className="text-sm font-semibold text-zinc-300 group-hover:text-white line-clamp-1">{rel.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
