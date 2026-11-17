/**
 * Applies the add_sent_reminder migration over the pg (TCP) path, since the
 * Prisma CLI can't reach this Neon endpoint from here. Idempotent: skips if the
 * table already exists, and records the migration in _prisma_migrations so
 * Prisma's own tooling later sees it as applied.
 *
 *   DATABASE_URL='postgresql://...neon.tech/...' npx tsx prisma/scripts/apply-sent-reminder.ts
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { Client } from "pg";

const MIGRATION_NAME = "20261117000000_add_sent_reminder";

async function main() {
  let url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");
  url = url.replace("-pooler.", ".").replace(/[?&]channel_binding=require/, "");

  const sql = readFileSync(join(__dirname, "..", "migrations", MIGRATION_NAME, "migration.sql"), "utf8");
  const checksum = createHash("sha256").update(sql).digest("hex");

  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const exists = await client.query(
      `SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'SentReminder'`,
    );
    if ((exists.rowCount ?? 0) > 0) {
      console.log("SentReminder table already exists — nothing to apply.");
      return;
    }

    await client.query("BEGIN");
    await client.query(sql);

    // Record it in Prisma's migration history so `prisma migrate` sees it as applied.
    await client.query(
      `INSERT INTO "_prisma_migrations"
         (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
       VALUES ($1, $2, now(), $3, NULL, NULL, now(), 1)`,
      [randomUUID(), checksum, MIGRATION_NAME],
    );
    await client.query("COMMIT");

    console.log(`Applied migration ${MIGRATION_NAME} and recorded it in _prisma_migrations.`);
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
