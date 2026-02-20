import { Loader } from "@googlemaps/js-api-loader";

let loaderInstance: Loader | null = null;

export function getLoader(): Loader {
  if (!loaderInstance) {
    loaderInstance = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
      libraries: ["places", "marker", "geometry"],
    });
  }
  return loaderInstance;
}

export async function loadGoogleMaps(): Promise<typeof google.maps> {
  const loader = getLoader();
  const google = await loader.load();
  return google.maps;
}

export function getPhotoUrl(
  photoReference: string,
  maxWidth: number = 400
): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${apiKey}`;
}

export const SERVICE_TYPE_KEYWORDS: Record<string, string> = {
  all: "auto repair",
  general: "auto repair mechanic",
  body_shop: "auto body shop collision repair",
  oil_change: "oil change service",
  tires: "tire shop wheel alignment",
  transmission: "transmission repair specialist",
  brakes: "brake repair service",
  electrical: "auto electrical repair",
  diagnostics: "car diagnostic service",
  dealer: "car dealership service center",
};

export const UAE_REGIONS: Record<string, { lat: number; lng: number; label: string }> = {
  all: { lat: 24.4539, lng: 54.3773, label: "All UAE" },
  dubai: { lat: 25.2048, lng: 55.2708, label: "Dubai" },
  abudhabi: { lat: 24.4539, lng: 54.3773, label: "Abu Dhabi" },
  sharjah: { lat: 25.3463, lng: 55.4209, label: "Sharjah" },
  ajman: { lat: 25.4052, lng: 55.5136, label: "Ajman" },
  rak: { lat: 25.7895, lng: 55.9432, label: "Ras Al Khaimah" },
  fujairah: { lat: 25.1288, lng: 56.3264, label: "Fujairah" },
  uaq: { lat: 25.5647, lng: 55.5554, label: "Umm Al Quwain" },
};

export const DEFAULT_CENTER = UAE_REGIONS.dubai;
export const DEFAULT_ZOOM = 12;
