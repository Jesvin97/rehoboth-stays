// Applies db/schema.sql to Cloudflare D1.
// Usage: node --env-file=.env.local scripts/d1-migrate.mjs   (or: npm run db:migrate)
import { readFileSync } from "node:fs";

const { CF_ACCOUNT_ID, CF_D1_DATABASE_ID, CF_API_TOKEN } = process.env;
if (!CF_ACCOUNT_ID || !CF_D1_DATABASE_ID || !CF_API_TOKEN) {
  console.error("Set CF_ACCOUNT_ID, CF_D1_DATABASE_ID and CF_API_TOKEN in .env.local first.");
  process.exit(1);
}

const sql = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8")
  .split("\n")
  .filter((l) => !l.trim().startsWith("--"))
  .join("\n");
const statements = sql.split(";").map((s) => s.trim()).filter(Boolean);

for (const stmt of statements) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${CF_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ sql: stmt }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    console.error("Failed:", stmt.split("\n")[0], "\n", JSON.stringify(json?.errors ?? res.status));
    process.exit(1);
  }
  console.log("ok:", stmt.split("\n")[0].slice(0, 70));
}
console.log("Database is up to date.");
