import { NextResponse } from "next/server";
import { d1, d1Configured } from "@/lib/d1";
import { encryptPII, piiConfigured } from "@/lib/pii";
import { PRIVACY_VERSION } from "@/lib/site";

/** Stores "request a callback" requests. */
export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as { kind?: string; name?: string; phone?: string; note?: string; consent?: boolean } | null;
  if (!b || b.kind !== "callback") return NextResponse.json({ ok: false }, { status: 400 });

  // Personal data is only taken with the person's consent.
  if (b.consent !== true) return NextResponse.json({ ok: false }, { status: 400 });

  const name = b.name?.trim().slice(0, 100) || null;
  const phone = b.phone?.replace(/\D/g, "") || null; // must be exactly 10 digits; no trimming
  if (!name || !phone || !/^[6-9]\d{9}$/.test(phone)) return NextResponse.json({ ok: false }, { status: 400 });

  // Without a database the form still works (the callback also opens WhatsApp).
  if (!d1Configured() || !piiConfigured()) return NextResponse.json({ ok: true, stored: false });
  try {
    const now = Date.now();
    await d1("INSERT INTO leads (kind, name, phone, email, note, created_at, consent_at, consent_version) VALUES (?,?,?,?,?,?,?,?)", [
      b.kind, encryptPII(name, "leads.name"), encryptPII(phone, "leads.phone"), null,
      b.note?.slice(0, 300) ?? null, now, now, PRIVACY_VERSION,
    ]);
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
