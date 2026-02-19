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

export const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 }; // NYC default
export const DEFAULT_ZOOM = 13;
