import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Picks the Prisma driver adapter from DATABASE_URL:
 * - Neon hosts (*.neon.tech) → serverless Neon driver
 * - anything else (local Postgres in development) → node-postgres
 * Moving to Neon later is just a DATABASE_URL change.
 */
export function createAdapter(connectionString: string) {
  return /\.neon\.tech\b/.test(connectionString)
    ? new PrismaNeon({ connectionString })
    : new PrismaPg({ connectionString });
}
