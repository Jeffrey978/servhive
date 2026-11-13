// Static marketplace reference data (Port Harcourt). Categories live in the DB
// (seeded from prisma/data/legacy-seed.json); this file holds the rest.

export const CITY = "Port Harcourt";

export const AREAS = [
  "Old GRA",
  "New GRA / Phase 2",
  "Peter Odili Road",
  "Trans-Amadi",
  "Woji",
  "D-Line",
  "Ada George",
  "Choba / Uniport",
  "Rumuodara",
  "Rumuola",
  "Alakahia",
  "Elelenwo",
] as const;

export type Landmark = {
  name: string;
  shortName: string;
  zone: string;
  lat: number;
  lng: number;
  popular: boolean;
};

export const LANDMARKS: Landmark[] = [
  { name: "Pleasure Park / Bori Camp", shortName: "Pleasure Park", zone: "Rumuola", lat: 4.832, lng: 7.0125, popular: true },
  { name: "Garrison Junction & D-Line", shortName: "Garrison", zone: "D-Line", lat: 4.8055, lng: 7.015, popular: true },
  { name: "Hotel Presidential & Rumuola", shortName: "Hotel Presidential", zone: "Rumuola", lat: 4.821, lng: 7.009, popular: true },
  { name: "Waterlines / Aba Road", shortName: "Waterlines", zone: "D-Line", lat: 4.814, lng: 7.0115, popular: true },
  { name: "Peter Odili Road & Trans-Amadi Gardens", shortName: "Peter Odili Road", zone: "Peter Odili Road", lat: 4.808, lng: 7.045, popular: true },
  { name: "Old GRA & Government House", shortName: "Old GRA", zone: "Old GRA", lat: 4.776, lng: 7.01, popular: true },
  { name: "New GRA (Tombia / Birabi)", shortName: "New GRA", zone: "New GRA / Phase 2", lat: 4.818, lng: 6.998, popular: true },
  { name: "Trans-Amadi & Slaughter Bridge", shortName: "Trans-Amadi", zone: "Trans-Amadi", lat: 4.819, lng: 7.035, popular: true },
  { name: "Woji & Golf Estate Gate", shortName: "Woji & Golf Estate", zone: "Woji", lat: 4.825, lng: 7.058, popular: true },
  { name: "Choba & Uniport Delta Park", shortName: "Choba & Uniport", zone: "Choba / Uniport", lat: 4.898, lng: 6.924, popular: true },
  { name: "UPTH Gate & Alakahia", shortName: "UPTH & Alakahia", zone: "Alakahia", lat: 4.8875, lng: 6.936, popular: true },
  { name: "RSU / UST Gate & Mile 3 Diobu", shortName: "RSU / UST", zone: "Mile 3 Diobu", lat: 4.8, lng: 6.985, popular: true },
  { name: "Rumuokoro Flyover & Roundabout", shortName: "Rumuokoro", zone: "Rumuokoro", lat: 4.871, lng: 6.994, popular: true },
  { name: "Air Force Base & Eliozu Flyover", shortName: "Air Force / Eliozu", zone: "Eliozu", lat: 4.845, lng: 7.025, popular: true },
  { name: "Artillery Junction & Okporo", shortName: "Artillery Junction", zone: "Rumuodara", lat: 4.838, lng: 7.032, popular: true },
  { name: "Oil Mill Junction & Elelenwo", shortName: "Oil Mill Market", zone: "Elelenwo", lat: 4.856, lng: 7.081, popular: true },
  { name: "Ada George & Wimpey Junction", shortName: "Ada George / Wimpey", zone: "Ada George", lat: 4.842, lng: 6.975, popular: true },
  { name: "Mile 1-3 Diobu & Education Bus Stop", shortName: "Diobu Markets", zone: "Diobu", lat: 4.789, lng: 6.998, popular: true },
  { name: "Port Harcourt Mall / Spar", shortName: "Spar / PH Mall", zone: "Old GRA", lat: 4.7675, lng: 7.014, popular: true },
  { name: "Agip Roundabout & Ikwerre Road", shortName: "Agip Roundabout", zone: "Rumueme", lat: 4.829, lng: 6.984, popular: false },
  { name: "Borokiri & Port Harcourt Township", shortName: "Borokiri / Town", zone: "Township", lat: 4.752, lng: 7.028, popular: false },
  { name: "Rukpokwu & Airport Road Roundabout", shortName: "Rukpokwu", zone: "Rukpokwu", lat: 4.899, lng: 7.022, popular: false },
  { name: "Rumuodara Junction", shortName: "Rumuodara", zone: "Rumuodara", lat: 4.851, lng: 7.042, popular: false },
];

/** City centre fallback used when geolocation is unavailable or > MAX_RADIUS_KM away. */
export const CITY_CENTER = { lat: 4.832, lng: 7.0125, label: "Pleasure Park" };
export const MAX_RADIUS_KM = 65;

export function coordsForArea(area: string) {
  const hit = LANDMARKS.find((l) => l.zone.toLowerCase() === area.toLowerCase());
  return hit ? { lat: hit.lat, lng: hit.lng } : { lat: CITY_CENTER.lat, lng: CITY_CENTER.lng };
}

/** Trades that need an uploaded professional licence before approval. */
export const REGULATED_CATEGORIES = [
  { id: "home-health", name: "Home Health Aide", reason: "Requires a verified Rivers State Nursing/Health Council licence." },
  { id: "laser-tech", name: "Laser Tech & Electrologist", reason: "Invasive cosmetic procedures — medical board certification required." },
  { id: "tattoo-piercing", name: "Tattoo & Body Piercer", reason: "Sanitation and bloodborne-pathogen compliance required." },
  { id: "funeral-director", name: "Funeral Director", reason: "Regulated mortuary and logistics licence required." },
] as const;

/** Trades we don't list at all (child safeguarding policy). */
export const BLOCKED_CATEGORIES = [
  { id: "nanny", name: "Nanny / Babysitter" },
  { id: "childcare", name: "Childcare / Daycare" },
  { id: "tutor", name: "Private Tutor" },
] as const;

export const BANKS = [
  { code: "access", name: "Access Bank" },
  { code: "gtbank", name: "Guaranty Trust Bank (GTBank)" },
  { code: "zenith", name: "Zenith Bank" },
  { code: "firstbank", name: "First Bank of Nigeria" },
  { code: "uba", name: "United Bank for Africa (UBA)" },
  { code: "kuda", name: "Kuda Microfinance Bank" },
  { code: "moniepoint", name: "Moniepoint MFB" },
  { code: "opay", name: "OPay" },
  { code: "stanbic", name: "Stanbic IBTC Bank" },
  { code: "fcmb", name: "First City Monument Bank (FCMB)" },
  { code: "fidelity", name: "Fidelity Bank" },
  { code: "sterling", name: "Sterling Bank" },
  { code: "union", name: "Union Bank" },
  { code: "wema", name: "Wema Bank / ALAT" },
] as const;

export const REPORT_REASONS = [
  "Price discrepancy / quoted higher",
  "No-show / failed to arrive",
  "Unprofessional behaviour",
  "Requested direct payment (escrow bypass)",
  "Poor workmanship",
] as const;

// Business rules — single source of truth (legacy had contradictory values).
export const RULES = {
  commissionPct: 5,
  monthlySubscription: 2000, // NGN
  freeTrialMonths: 1,
  boostPricePerWeek: 1500, // NGN
  autoReleaseHours: 48,
  disputeWindowHours: 48,
  disputeDecisionDays: 5,
  minWorkPhotosForReview: 3,
  minStartingPrice: 3000,
} as const;
