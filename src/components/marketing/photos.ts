/** Local editorial photography (public/assets). */
export const PHOTOS = {
  tradesman: "/assets/hero_tradesman.jpg",
  solar: "/assets/solar_tech.jpg",
  interior: "/assets/interior_pop.jpg",
  hair: "/assets/hairstylist.jpg",
} as const;

const ROTATION = [PHOTOS.solar, PHOTOS.interior, PHOTOS.hair, PHOTOS.tradesman];

/** Stand-in photo for rows that have no imageUrl yet (e.g. regulated trades). */
export function fallbackPhoto(i: number) {
  return ROTATION[i % ROTATION.length]!;
}
