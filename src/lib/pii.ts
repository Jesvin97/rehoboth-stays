import "server-only";
import crypto from "node:crypto";

/**
 * Field-level encryption for personal data (AES-256-GCM).
 * PII_ENCRYPTION_KEY must be 32 random bytes, base64-encoded. Generate one with:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 * Keep a safe copy of the key: without it the encrypted data cannot be read.
 *
 * Stored format: "v1:" + base64(iv[12] + ciphertext + tag[16]). The column name is
 * bound in as authenticated data, so a value can't be copied into another column.
 */
const PREFIX = "v1:";

function key(): Buffer | null {
  const raw = process.env.PII_ENCRYPTION_KEY;
  if (!raw) return null;
  const k = Buffer.from(raw, "base64");
  return k.length === 32 ? k : null;
}

export function piiConfigured() {
  return key() !== null;
}

export function encryptPII(plain: string | null | undefined, context: string): string | null {
  if (plain == null || plain === "") return null;
  const k = key();
  if (!k) throw new Error("PII_ENCRYPTION_KEY is missing or not 32 bytes of base64");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", k, iv);
  cipher.setAAD(Buffer.from(context));
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return PREFIX + Buffer.concat([iv, enc, cipher.getAuthTag()]).toString("base64");
}

export function decryptPII(value: string | null | undefined, context: string): string | null {
  if (value == null || value === "") return null;
  if (!value.startsWith(PREFIX)) return value; // unencrypted value from before encryption was added
  const k = key();
  if (!k) throw new Error("PII_ENCRYPTION_KEY is missing or not 32 bytes of base64");
  const buf = Buffer.from(value.slice(PREFIX.length), "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", k, buf.subarray(0, 12));
  decipher.setAAD(Buffer.from(context));
  decipher.setAuthTag(buf.subarray(buf.length - 16));
  return Buffer.concat([decipher.update(buf.subarray(12, buf.length - 16)), decipher.final()]).toString("utf8");
}
