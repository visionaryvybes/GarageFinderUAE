import {
    Wrench, Disc, Droplets, Gauge, Snowflake, CircleDot,
    BatteryCharging, Paintbrush, Package, Activity, Fuel, Cog,
    Zap, Sparkles, Settings2, Tally4, Truck, ClipboardCheck,
    Wind, FlameKindling, Users, ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServiceItem {
    id: string;
    name: string;
    slug: string;
    icon: LucideIcon;
    colSpan: number;
    rowSpan: number;
    iconColor: string;
    desc: string;
    img: string;
    query: string;
    category: "mechanical" | "tyres" | "body" | "performance" | "parts" | "care" | "specialist";
}

export const SERVICES: ServiceItem[] = [
    // ── HERO CARDS ──
    { id: "mechanic",        name: "General Repair",        slug: "general-repair",      icon: Wrench,         colSpan: 2, rowSpan: 2, iconColor: "text-zinc-400",   desc: "Full diagnostics & repair for all makes and models.",            img: "/images/general-repair.png",    query: "auto repair mechanic",                   category: "mechanical"   },
    { id: "engine",          name: "Engine Diagnostics",    slug: "engine-diagnostics",  icon: Gauge,          colSpan: 2, rowSpan: 1, iconColor: "text-amber-400",   desc: "OBD scanning, fault codes & performance analysis.",              img: "/images/engine.png",            query: "engine diagnostics service",             category: "mechanical"   },
    { id: "dyno",            name: "Dyno Tuning",           slug: "dyno-tuning",         icon: Activity,       colSpan: 2, rowSpan: 1, iconColor: "text-red-500",     desc: "ECU remapping & performance dyno testing.",                      img: "/images/dyno-tuning.png",       query: "dyno tuning ECU remap",                  category: "performance"  },

    // ── STANDARD ──
    { id: "oil",             name: "Oil Change",            slug: "oil-change",          icon: Droplets,       colSpan: 1, rowSpan: 1, iconColor: "text-blue-400",    desc: "Synthetic & conventional oil with multi-point check.",          img: "/images/oil-change.png",        query: "oil change service",                     category: "mechanical"   },
    { id: "brakes",          name: "Brake Service",         slug: "brake-service",       icon: Disc,           colSpan: 1, rowSpan: 2, iconColor: "text-red-400",     desc: "Pads, rotors, calipers & ABS diagnostics.",                     img: "/images/brakes.png",            query: "brake repair service",                   category: "mechanical"   },
    { id: "ac",              name: "AC Repair",             slug: "ac-repair",           icon: Snowflake,      colSpan: 1, rowSpan: 1, iconColor: "text-cyan-400",    desc: "Gas refill, compressor & leak detection.",                       img: "/images/ac-repair.png",         query: "car AC repair service",                  category: "mechanical"   },
    { id: "tires",           name: "Tyre Services",         slug: "tire-services",       icon: CircleDot,      colSpan: 1, rowSpan: 1, iconColor: "text-emerald-400", desc: "Mounting, balancing, alignment & puncture repair.",             img: "/images/tires.png",             query: "tyre shop wheel alignment",              category: "tyres"        },
    { id: "battery",         name: "Battery",               slug: "battery",             icon: BatteryCharging,colSpan: 1, rowSpan: 1, iconColor: "text-yellow-400",  desc: "Testing, replacement & alternator check.",                       img: "/images/battery.png",           query: "car battery replacement service",        category: "mechanical"   },
    { id: "transmission",    name: "Transmission",          slug: "transmission",        icon: Cog,            colSpan: 1, rowSpan: 1, iconColor: "text-zinc-300",    desc: "Auto/manual gearbox, clutch & CVT service.",                    img: "/images/transmission.png",      query: "transmission repair specialist",         category: "mechanical"   },
    { id: "electrical",      name: "Auto Electrical",       slug: "auto-electrical",     icon: Zap,            colSpan: 1, rowSpan: 1, iconColor: "text-blue-300",    desc: "Wiring, ECU, sensors, starters & alternators.",                 img: "/images/electrical.png",        query: "auto electrical repair",                 category: "mechanical"   },
    { id: "fuel-injector",   name: "Fuel Injector",         slug: "fuel-injector",       icon: Fuel,           colSpan: 1, rowSpan: 1, iconColor: "text-amber-500",   desc: "Ultrasonic cleaning & spray pattern testing.",                  img: "/images/fuel-injector.png",     query: "fuel injector cleaning service",         category: "mechanical"   },
    { id: "suspension",      name: "Suspension",            slug: "suspension",          icon: Settings2,      colSpan: 1, rowSpan: 1, iconColor: "text-violet-400",  desc: "Shocks, coilovers, bushes & steering components.",              img: "/images/suspension.png",        query: "suspension steering repair service",     category: "mechanical"   },
    { id: "exhaust",         name: "Exhaust Systems",       slug: "exhaust",             icon: FlameKindling,  colSpan: 1, rowSpan: 1, iconColor: "text-orange-400",  desc: "Exhaust repair, custom pipes & performance exhausts.",          img: "/images/exhaust.png",           query: "exhaust system repair service",          category: "performance"  },
    { id: "ev",              name: "EV Service",            slug: "ev-service",          icon: Zap,            colSpan: 1, rowSpan: 1, iconColor: "text-green-400",   desc: "Tesla & EV specialists — battery & motor service.",              img: "/images/ev-service.png",        query: "electric car EV service repair",         category: "specialist"   },

    // ── BODY & APPEARANCE ──
    { id: "body",            name: "Body & Paint",          slug: "body-paint",          icon: Paintbrush,     colSpan: 1, rowSpan: 1, iconColor: "text-pink-400",    desc: "Dent removal, full resprays & paint protection.",               img: "/images/body-paint.png",        query: "auto body shop paint repair",            category: "body"         },
    { id: "detailing",       name: "Detailing & Coating",   slug: "detailing",           icon: Sparkles,       colSpan: 1, rowSpan: 1, iconColor: "text-purple-400",  desc: "Ceramic coating, PPF & interior detailing.",                    img: "/images/detailing.png",         query: "car detailing ceramic coating",          category: "care"         },
    { id: "window-tinting",  name: "Window Tinting",        slug: "window-tinting",      icon: Tally4,         colSpan: 1, rowSpan: 1, iconColor: "text-slate-400",   desc: "UAE-legal ceramic window film, UV protection.",                 img: "/images/window-tinting.png",    query: "window tinting film service",            category: "care"         },
    { id: "car-wash",        name: "Car Wash & Steam",      slug: "car-wash",            icon: Wind,           colSpan: 1, rowSpan: 1, iconColor: "text-sky-400",     desc: "High-pressure steam wash & interior deep clean.",               img: "/images/car-wash.png",          query: "car wash steam clean detail",            category: "care"         },

    // ── SPECIALIST ──
    { id: "spare-parts",     name: "Spare Parts",           slug: "spare-parts",         icon: Package,        colSpan: 2, rowSpan: 1, iconColor: "text-orange-400",  desc: "OEM, aftermarket & used parts for all vehicles.",               img: "/images/spare-parts.png",       query: "auto spare parts store",                 category: "parts"        },
    { id: "inspection",      name: "Vehicle Inspection",    slug: "vehicle-inspection",  icon: ClipboardCheck, colSpan: 1, rowSpan: 1, iconColor: "text-teal-400",    desc: "RTA inspection, pre-purchase checks & roadworthiness.",         img: "/images/vehicle-inspection.png",query: "vehicle inspection RTA check",           category: "specialist"   },
    { id: "roadside",        name: "Roadside Assistance",   slug: "roadside",            icon: Truck,          colSpan: 1, rowSpan: 1, iconColor: "text-rose-400",    desc: "24/7 towing, jump starts & emergency repair.",                  img: "/images/roadside.png",          query: "roadside assistance towing recovery",     category: "specialist"   },
    { id: "fleet",           name: "Fleet Service",         slug: "fleet-service",       icon: Users,          colSpan: 1, rowSpan: 1, iconColor: "text-indigo-400",  desc: "Corporate fleet maintenance contracts across UAE.",              img: "/images/fleet-service.png",     query: "fleet vehicle maintenance service",      category: "specialist"   },
    { id: "insurance",       name: "Insurance Repair",      slug: "insurance-repair",    icon: ShieldCheck,    colSpan: 1, rowSpan: 1, iconColor: "text-lime-400",    desc: "Insurance-approved body & mechanical repair.",                  img: "/images/insurance-repair.png",  query: "insurance approved car repair garage",   category: "body"         },
];

export const SERVICE_CATEGORIES = [
    { id: "all",         label: "All Services"     },
    { id: "mechanical",  label: "Mechanical"       },
    { id: "tyres",       label: "Tyres & Wheels"   },
    { id: "body",        label: "Body & Paint"     },
    { id: "performance", label: "Performance"      },
    { id: "parts",       label: "Spare Parts"      },
    { id: "care",        label: "Detailing & Care" },
    { id: "specialist",  label: "Specialist"       },
] as const;
