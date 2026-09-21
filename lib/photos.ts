import type { StaticImageData } from "next/image";
import { getStateSlugs } from "@/lib/states";
import contractDesk from "@/public/img/contract-desk.jpg";
import heroTrailer from "@/public/img/hero-trailer.jpg";
import pickupSunset from "@/public/img/pickup-sunset.jpg";
import rvHighway from "@/public/img/rv-highway.jpg";
import signatureLine from "@/public/img/signature-line.jpg";
import trailerMarina from "@/public/img/trailer-marina.jpg";
import trailerNight from "@/public/img/trailer-night.jpg";

/**
 * Every licensed photograph on the site, in one place.
 *
 * Pages refer to photos by key rather than importing files directly, so a
 * content file can name an image without reaching into the build graph, and so
 * a key that no longer exists fails the build instead of rendering a gap.
 */

export type PhotoKey =
  | "contract-desk"
  | "hero-trailer"
  | "pickup-sunset"
  | "rv-highway"
  | "signature-line"
  | "trailer-marina"
  | "trailer-night";

export type Photo = {
  src: StaticImageData;
  /** Describes the scene for a reader who cannot see it. */
  alt: string;
  /**
   * Pre-cut 1200x630 version for og:image. Social scrapers fetch a plain URL
   * and will not run next/image, so these are committed rather than generated.
   */
  og: string;
};

export const photos: Record<PhotoKey, Photo> = {
  "contract-desk": {
    src: contractDesk,
    alt: "A person at a desk holding a pen over a multi-page printed contract.",
    og: "/img/og/contract-desk.jpg",
  },
  "hero-trailer": {
    src: heroTrailer,
    alt: "A vintage travel trailer parked under an open sky.",
    og: "/img/og/hero-trailer.jpg",
  },
  "pickup-sunset": {
    src: pickupSunset,
    alt: "A weathered classic pickup truck parked on a rural road at sunset.",
    og: "/img/og/pickup-sunset.jpg",
  },
  "rv-highway": {
    src: rvHighway,
    alt: "A motorhome travelling down a highway in late afternoon light.",
    og: "/img/og/rv-highway.jpg",
  },
  "signature-line": {
    src: signatureLine,
    alt: "A pen resting on the signature and date lines of a printed form.",
    og: "/img/og/signature-line.jpg",
  },
  "trailer-marina": {
    src: trailerMarina,
    alt: "A white travel trailer parked beside moored sailboats at a marina.",
    og: "/img/og/trailer-marina.jpg",
  },
  "trailer-night": {
    src: trailerNight,
    alt: "A polished aluminium travel trailer lit by string lights at dusk.",
    og: "/img/og/trailer-night.jpg",
  },
};

export function getPhoto(key: PhotoKey): Photo {
  return photos[key];
}

export function isPhotoKey(value: string): value is PhotoKey {
  return value in photos;
}

/**
 * Photos of the property this agency actually bonds. State pages draw their
 * masthead backdrop from this set.
 *
 * hero-trailer is deliberately absent: it belongs to the homepage, and a state
 * page repeating it made the two look like the same page.
 */
const STATE_PHOTOS: PhotoKey[] = [
  "pickup-sunset",
  "rv-highway",
  "trailer-marina",
  "trailer-night",
];

/**
 * Pick a state's masthead photo from its slug.
 *
 * Deterministic on purpose: the same state gets the same photo on every build,
 * so a page's appearance never changes underneath a cached screenshot or a
 * visual diff, and neighbouring states in the footer list don't all match.
 */
export function statePhotoKey(slug: string): PhotoKey {
  // Dealt round-robin down the alphabetical state list rather than hashed: a
  // hash of 32 slugs across 5 photos clumps badly (a third of the states drew
  // the homepage hero), whereas this spreads them evenly and guarantees that
  // states sitting next to each other in a list never match. Still
  // deterministic, so a state keeps its photo from build to build.
  const index = getStateSlugs().indexOf(slug);
  if (index < 0) return STATE_PHOTOS[0];
  return STATE_PHOTOS[index % STATE_PHOTOS.length];
}

export function statePhoto(slug: string): Photo {
  return photos[statePhotoKey(slug)];
}
