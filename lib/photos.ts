import type { StaticImageData } from "next/image";
import calculatorDesk from "@/public/img/calculator-desk.jpg";
import carKeys from "@/public/img/car-keys.jpg";
import deskCalendar from "@/public/img/desk-calendar.jpg";
import documentsLaptop from "@/public/img/documents-laptop.jpg";
import letterDesk from "@/public/img/letter-desk.jpg";
import manufacturedHomes from "@/public/img/manufactured-homes.jpg";
import readingPaperwork from "@/public/img/reading-paperwork.jpg";
import carLotSale from "@/public/img/car-lot-sale.jpg";
import damagedCar from "@/public/img/damaged-car.jpg";
import handshakeSale from "@/public/img/handshake-sale.jpg";
import motorboatWater from "@/public/img/motorboat-water.jpg";
import worriedPaperwork from "@/public/img/worried-paperwork.jpg";
import boatTrailer from "@/public/img/boat-trailer.jpg";
import classicTruck from "@/public/img/classic-truck.jpg";
import contractDesk from "@/public/img/contract-desk.jpg";
import heroTrailer from "@/public/img/hero-trailer.jpg";
import motorcycleRoad from "@/public/img/motorcycle-road.jpg";
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
 * Each state and post names its own key; nothing here assigns them.
 *
 * hero-trailer is the homepage's — don't pin it to a state as well, or the two
 * pages read as the same page.
 */

export type PhotoKey =
  | "car-lot-sale"
  | "damaged-car"
  | "handshake-sale"
  | "motorboat-water"
  | "worried-paperwork"
  | "calculator-desk"
  | "car-keys"
  | "desk-calendar"
  | "documents-laptop"
  | "letter-desk"
  | "manufactured-homes"
  | "reading-paperwork"
  | "boat-trailer"
  | "classic-truck"
  | "contract-desk"
  | "hero-trailer"
  | "motorcycle-road"
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
  "car-lot-sale": {
    src: carLotSale,
    alt: "A seller holding a sale sign between cars on a dealership lot.",
    og: "/img/og/car-lot-sale.jpg",
  },
  "damaged-car": {
    src: damagedCar,
    alt: "A crash-damaged silver car standing in a repair workshop.",
    og: "/img/og/damaged-car.jpg",
  },
  "handshake-sale": {
    src: handshakeSale,
    alt: "Two people shaking hands beside a red car.",
    og: "/img/og/handshake-sale.jpg",
  },
  "motorboat-water": {
    src: motorboatWater,
    alt: "A white motorboat at anchor on flat water at sunset.",
    og: "/img/og/motorboat-water.jpg",
  },
  "worried-paperwork": {
    src: worriedPaperwork,
    alt: "An older man at a kitchen table frowning at a letter beside a laptop.",
    og: "/img/og/worried-paperwork.jpg",
  },
  "calculator-desk": {
    src: calculatorDesk,
    alt: "A hand working a desk calculator beside printed figures.",
    og: "/img/og/calculator-desk.jpg",
  },
  "car-keys": {
    src: carKeys,
    alt: "One person handing a car key to another in front of a vehicle.",
    og: "/img/og/car-keys.jpg",
  },
  "desk-calendar": {
    src: deskCalendar,
    alt: "A year planner standing on a bare wooden desk.",
    og: "/img/og/desk-calendar.jpg",
  },
  "documents-laptop": {
    src: documentsLaptop,
    alt: "A person leafing through a clipped stack of documents beside a laptop.",
    og: "/img/og/documents-laptop.jpg",
  },
  "letter-desk": {
    src: letterDesk,
    alt: "A person at a desk reading a letter taken from its envelope.",
    og: "/img/og/letter-desk.jpg",
  },
  "manufactured-homes": {
    src: manufacturedHomes,
    alt: "An aerial view of a manufactured home community in rural America.",
    og: "/img/og/manufactured-homes.jpg",
  },
  "reading-paperwork": {
    src: readingPaperwork,
    alt: "A person at a home office desk reading through paperwork.",
    og: "/img/og/reading-paperwork.jpg",
  },
  "boat-trailer": {
    src: boatTrailer,
    alt: "A powerboat sitting on its trailer beside the water under a broken sky.",
    og: "/img/og/boat-trailer.jpg",
  },
  "classic-truck": {
    src: classicTruck,
    alt: "A restored red stake-bed pickup truck parked on grass under trees.",
    og: "/img/og/classic-truck.jpg",
  },
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
  "motorcycle-road": {
    src: motorcycleRoad,
    alt: "A motorcyclist riding away down a two-lane road through summer woodland.",
    og: "/img/og/motorcycle-road.jpg",
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
