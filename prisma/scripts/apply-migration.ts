/**
 * Applies a single migration folder over the pg (TCP) path, since the Prisma CLI
 * can't reach this Neon endpoint from here. Idempotent via _prisma_migrations:
 * skips a migration already recorded there. Records it so Prisma later sees it
 * as applied.
 *
 *   DATABASE_URL='postgresql://...' npx tsx prisma/scripts/apply-migration.ts <migration_folder_name>
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { Client } from "pg";

async function main() {
  const name = process.argv[2];
  if (!name) throw new Error("Usage: apply-migration.ts <migration_folder_name>");
  let url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");
  // Keep the pooler host (it resolves); just drop channel_binding for node-postgres.
  url = url.replace(/[?&]channel_binding=require/, "");

  const sql = readFileSync(join(__dirname, "..", "migrations", name, "migration.sql"), "utf8");
  const checksum = createHash("sha256").update(sql).digest("hex");

  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const already = await client.query(`SELECT 1 FROM "_prisma_migrations" WHERE migration_name = $1`, [name]);
    if ((already.rowCount ?? 0) > 0) {
      console.log(`Migration ${name} is already recorded — skipping.`);
      return;
    }

    await client.query("BEGIN");
    await client.query(sql);
    await client.query(
      `INSERT INTO "_prisma_migrations"
         (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
       VALUES ($1, $2, now(), $3, NULL, NULL, now(), 1)`,
      [randomUUID(), checksum, name],
    );
    await client.query("COMMIT");
    console.log(`Applied migration ${name}.`);
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
