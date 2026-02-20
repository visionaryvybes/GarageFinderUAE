/**
 * GarageFinder – AI Image Generator
 * Uses Gemini 2.0 Flash Experimental Image Generation
 * Run: node scripts/generate-images.js
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// Load env
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌  GEMINI_API_KEY not set in .env.local");
  process.exit(1);
}

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${API_KEY}`;
const OUT_DIR = path.join(__dirname, "../public/images");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const IMAGES = [
  {
    name: "hero",
    prompt:
      "Ultra-realistic 4K cinematic automotive photography. A sleek matte-black Porsche 911 GT3 RS parked inside a state-of-the-art supercar workshop in Dubai. The workshop has polished concrete floors with blue LED lighting embedded in the ground. Carbon-fibre tool panels line the background. Dramatic volumetric lighting with deep shadows and cool blue-white accent lights reflecting off the car's surface. Shallow depth of field, bokeh on the background machinery. Shot at near-ground level, editorial quality, National Geographic automotive photography style. Ultra-photorealistic, 8K resolution.",
  },
  {
    name: "general-repair",
    prompt:
      "4K ultra-realistic professional automotive photography. Skilled mechanic's hands in clean blue nitrile gloves working precisely on a high-performance engine bay with aftermarket carbon-fibre parts visible. Overhead LED shop lights casting dramatic shadows inside a modern UAE workshop. Tools neatly arranged on a shadow board behind. Shallow depth of field, tack-sharp focus on the hands and engine, dark industrial background. Commercial photography quality.",
  },
  {
    name: "oil-change",
    prompt:
      "4K macro ultra-realistic photo of premium golden amber full-synthetic motor oil pouring in a perfect spiral stream from a high-end branded bottle into a clean stainless steel funnel. Pure black studio background with a single overhead diffused light source illuminating the oil stream, catching every droplet and ripple. The oil glows amber-gold in the light. Extreme close-up, tack-sharp, bokeh background. Product photography quality.",
  },
  {
    name: "brakes",
    prompt:
      "4K ultra-realistic close-up of a Brembo carbon-ceramic slotted brake disc with a vivid red 6-piston caliper on a Porsche 911 wheel. The rotor shows cross-drilled holes and radial slots. Dramatic side lighting in a dark garage, light raking across the surface to highlight texture and engraving. Heat shimmers visible from the rotor. Background is pure bokeh darkness. Automotive product photography, ultra-sharp, commercial editorial quality.",
  },
  {
    name: "ac-repair",
    prompt:
      "4K ultra-realistic photo of a car air conditioning system being serviced. Refrigerant gauges with blue and red dials in sharp focus in the foreground. Blurred engine bay with AC compressor, condenser and hoses visible behind. Cool blue ambient tones throughout. Professional automotive workshop lighting. Technical service photography, ultra-realistic, clean and clinical.",
  },
  {
    name: "engine",
    prompt:
      "4K ultra-realistic dramatic photo of a BMW M5 S63 twin-turbo V8 engine in pristine condition, photographed in a dark high-tech workshop. Dramatic single overhead spotlight illuminating the engine from above, casting strong shadows. Blue-anodized valve covers contrast with carbon-fibre intake. Engine bay is spotless, every surface polished. Low-angle close-up shot, shallow depth of field showing engine detail. Ultra-realistic, automotive magazine quality.",
  },
  {
    name: "tires",
    prompt:
      "4K ultra-realistic dramatic automotive photography. Four staggered Pirelli P Zero tires mounted on matte black 21-inch BBS forged alloy wheels arranged in a diamond formation on a polished dark reflective floor in a professional tyre showroom. Rim-level blue LED strip lighting glows underneath each wheel. Dark studio background with subtle gradient. Product photography, ultra-realistic, commercial quality.",
  },
  {
    name: "battery",
    prompt:
      "4K ultra-realistic photo of a premium VARTA EFB car battery on a dark textured metal surface. Electric blue energy arcs and lightning bolt effects emanate from the terminals as if the battery is fully charged. Dark studio background with blue-purple gradient lighting. The battery terminals glow with electric energy. Dramatic product photography, ultra-realistic.",
  },
  {
    name: "body-paint",
    prompt:
      "4K ultra-realistic photo inside a professional automotive spray booth. A masked-up skilled painter in full protective PPE applies mirror-effect midnight-blue metallic paint to the hood of a luxury car using a high-tech HVLP spray gun. The spray mist creates a fine blue cloud around the work area. Bright, clinical white booth lighting reflects off the freshly painted surface showing perfect metallic flake. Professional automotive photography.",
  },
  {
    name: "spare-parts",
    prompt:
      "4K ultra-realistic photo of a well-organised premium auto parts store interior in Dubai. Floor-to-ceiling industrial black metal shelving holds neatly arranged engine parts, brake components, filters, and accessories. Every shelf is labelled. Overhead warm white LED strip lighting. Foreground shows a crankshaft and brake caliper in sharp focus. Dark polished concrete floors. Commercial interior photography, ultra-realistic.",
  },
  {
    name: "dyno-tuning",
    prompt:
      "4K ultra-realistic dramatic photo of a low, wide sports car strapped onto a professional 4-wheel chassis dynamometer in a purpose-built performance tuning garage. The rear wheels spin at high speed with visible motion blur. Multiple large performance monitor screens on the wall show torque curves and power graphs in neon blue and orange. Exhaust smoke adds atmosphere. Dark room with dramatic rim lighting. Professional performance automotive photography.",
  },
  {
    name: "fuel-injector",
    prompt:
      "4K macro ultra-realistic photo of a Bosch fuel injector captured at the precise moment of fuel injection. The atomized fuel spray pattern fans out in a perfect cone shape, rendered in extreme close-up. Backlit with dramatic diffused light making each tiny droplet visible. Pure black background. The injector body is made of surgical-grade metal. Ultra-sharp macro photography, commercial quality.",
  },
  {
    name: "transmission",
    prompt:
      "4K ultra-realistic photo of a ZF 8-speed automatic transmission gearbox opened and laid on a clean illuminated workbench in a transmission specialist workshop. Internal planetary gears, clutch packs and torque converter are exposed and clearly visible. Overhead LED work lights cast clean even illumination. Dark workshop background. Mechanical precision photography, ultra-realistic.",
  },
  {
    name: "electrical",
    prompt:
      "4K ultra-realistic close-up photo of a BMW or Mercedes ECU engine control unit circuit board with glowing status LEDs and fine copper traces. The PCB is illuminated with dramatic blue-UV lighting making the soldered components glow. Connected wiring harness plugs into the side. Dark black background. Macro electronics photography, ultra-sharp, commercial quality.",
  },
  {
    name: "detailing",
    prompt:
      "4K ultra-realistic photo of a luxury matte black Lamborghini Urus in a premium car detailing studio in Dubai. A professional detailer in a clean black apron applies ceramic coating with an applicator pad, the surface showing a mirror-like wet-look finish. Water beads are visible on the hood. Studio rim lighting from above creates dramatic reflections. Ultra-realistic, luxury automotive photography.",
  },
  {
    name: "ev-service",
    prompt:
      "4K ultra-realistic futuristic photo of a Tesla Model S Plaid plugged into a high-power supercharger in a clean white and blue EV service centre. Electric blue energy pulses travel visibly through transparent charging cables. The service bay is ultra-clean and minimalist. Soft blue and white LED ambient lighting. The car's frunk is open showing high-voltage service components. Editorial automotive photography, ultra-realistic.",
  },
  {
    name: "suspension",
    prompt:
      "4K ultra-realistic dramatic close-up photo of a KW Clubsport coilover suspension kit installed on a BMW M3. The yellow adjustable spring contrasts sharply against the silver damper body and black lower mount. Shot from below looking up in a dark workshop. A single directional LED light rakes across the surface emphasising the machined-aluminium detail. Shallow depth of field. Professional automotive photography.",
  },
  {
    name: "window-tinting",
    prompt:
      "4K ultra-realistic photo of a professional technician applying dark ceramic window tint film to a luxury SUV side window using a precision squeegee tool. The film edge is perfectly aligned. Shot from outside the car, showing the technician's skilled hands in sharp focus. Soft natural light flooding through the workshop doors. Clean professional automotive service photography.",
  },
  {
    name: "roadside",
    prompt:
      "4K ultra-realistic dramatic night photography of a modern roadside assistance flatbed tow truck with bright amber warning lights illuminating the scene on a UAE highway. A stranded luxury SUV being loaded onto the truck. Distant Dubai skyscraper skyline with city lights in the background. Dramatic contrast between warm amber truck lights and cool blue night sky. Professional automotive service photography.",
  },
  {
    name: "vehicle-inspection",
    prompt:
      "4K ultra-realistic photo of a certified UAE RTA vehicle inspection being performed in a modern inspection lane. A professional inspector in uniform uses a digital tablet to log results while a car is raised on a hydraulic lift showing undercarriage. Clean clinical inspection bay lighting from above. Professional automotive service photography, ultra-realistic.",
  },
  {
    name: "exhaust",
    prompt:
      "4K ultra-realistic close-up photo of a stainless steel Akrapovic performance exhaust system with twin titanium tips installed on a Porsche 911. The exhaust tips are perfectly polished showing a mirror finish. Dramatic low-angle side lighting creating reflections. Dark garage background. Shallow depth of field with bokeh. Automotive product photography, ultra-realistic.",
  },
  {
    name: "car-wash",
    prompt:
      "4K ultra-realistic photo of a gleaming black luxury Range Rover being cleaned with a professional high-pressure steam pressure washer inside a premium car spa in Dubai. Water cascades in dramatic sheets over the bonnet. Steam mist fills the well-lit wash bay. Clean white and blue LED lighting. Water droplets catch the light like diamonds. Premium automotive detailing photography.",
  },
  {
    name: "fleet-service",
    prompt:
      "4K ultra-realistic wide-angle aerial photograph of a large modern fleet vehicle maintenance facility in the UAE. Ten identical white commercial SUVs lined up in individual service bays, each being worked on simultaneously by uniformed technicians. Clean industrial overhead fluorescent lighting. Polished concrete floors with yellow safety lines. Professional corporate automotive photography.",
  },
  {
    name: "insurance-repair",
    prompt:
      "4K ultra-realistic photo of a professional insurance accident damage assessment inside a premium UAE body shop. A formal inspector with a clipboard documents damage on a dented white luxury sedan while a uniformed technician stands nearby. Bright clinical overhead lighting. Clean professional body shop with a paint booth visible in the background. Commercial automotive photography.",
  },
];

function httpsPost(body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(ENDPOINT);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
    };
    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (d) => (raw += d));
      res.on("end", () => {
        try { resolve(JSON.parse(raw)); } catch (e) { reject(e); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateImage(item, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`  ↻  Generating ${item.name}.png (attempt ${attempt})...`);
      const body = {
        contents: [{ parts: [{ text: item.prompt }] }],
        generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
      };
      const result = await httpsPost(body);

      if (result.error) {
        console.error(`  ✗  API error: ${result.error.message}`);
        if (result.error.code === 429) {
          console.log(`  ⏳  Rate limited, waiting 20s...`);
          await sleep(20000);
          continue;
        }
        return false;
      }

      const parts = result.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"));
      if (!imgPart) {
        console.error(`  ✗  No image in response for ${item.name}`);
        return false;
      }

      const ext = imgPart.inlineData.mimeType.split("/")[1] || "png";
      const outPath = path.join(OUT_DIR, `${item.name}.png`);
      fs.writeFileSync(outPath, Buffer.from(imgPart.inlineData.data, "base64"));
      console.log(`  ✓  Saved ${item.name}.png`);
      return true;
    } catch (err) {
      console.error(`  ✗  Error on attempt ${attempt}: ${err.message}`);
      if (attempt < retries) await sleep(5000);
    }
  }
  return false;
}

async function main() {
  console.log(`\n🚗  GarageFinder Image Generator`);
  console.log(`📁  Output: ${OUT_DIR}`);
  console.log(`🖼️   Generating ${IMAGES.length} images...\n`);

  let success = 0;
  let fail = 0;

  for (const item of IMAGES) {
    const ok = await generateImage(item);
    if (ok) success++;
    else fail++;
    await sleep(2000); // polite delay between requests
  }

  console.log(`\n✅  Done: ${success}/${IMAGES.length} images generated`);
  if (fail > 0) console.log(`⚠️   Failed: ${fail} images`);
}

main();
