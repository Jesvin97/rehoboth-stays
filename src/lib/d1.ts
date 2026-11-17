import "server-only";

/**
 * Minimal Cloudflare D1 client over Cloudflare's HTTP API, so the Vercel-hosted
 * site can use D1. Set CF_ACCOUNT_ID, CF_D1_DATABASE_ID and CF_API_TOKEN
 * (token permission: Account > D1 > Edit).
 */
export function d1Configured() {
  return Boolean(process.env.CF_ACCOUNT_ID && process.env.CF_D1_DATABASE_ID && process.env.CF_API_TOKEN);
}

export type D1Param = string | number | null;
export type D1Result<T> = { results: T[]; meta: { changes: number } };

export async function d1<T = Record<string, unknown>>(sql: string, params: D1Param[] = []): Promise<D1Result<T>> {
  const { CF_ACCOUNT_ID, CF_D1_DATABASE_ID, CF_API_TOKEN } = process.env;
  if (!CF_ACCOUNT_ID || !CF_D1_DATABASE_ID || !CF_API_TOKEN) throw new Error("D1 is not configured");
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${CF_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ sql, params }),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => null)) as { success?: boolean; errors?: { message: string }[]; result?: D1Result<T>[] } | null;
  if (!res.ok || !json?.success || !json.result?.[0]) {
    throw new Error(`D1 query failed (${res.status}): ${json?.errors?.map((e) => e.message).join("; ") ?? "no response"}`);
  }
  return json.result[0];
}
