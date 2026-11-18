import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutHeader } from "@/components/book/CheckoutHeader";
import { confirmPayment } from "@/lib/payments";
import { cashfreeConfigured } from "@/lib/cashfree-server";
import { d1Configured } from "@/lib/d1";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Confirming your payment", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * Where Cashfree sends the guest after paying (for example after a UPI app opens).
 * Asks Cashfree whether the order is paid, then shows the confirmation or a clear message.
 */
export default async function ReturnPage({ searchParams }: { searchParams: Promise<{ ref?: string | string[] }> }) {
  const sp = await searchParams;
  const ref = (Array.isArray(sp.ref) ? sp.ref[0] : sp.ref) ?? "";
  if (!/^RS-[0-9A-Z]{6}$/.test(ref) || !cashfreeConfigured() || !d1Configured()) redirect("/");

  const result = await confirmPayment(ref).catch(() => "failed" as const);
  if (result === "paid") redirect(`/book/confirmed?ref=${ref}`);

  const message =
    result === "pending"
      ? { h: "We're still confirming your payment", p: "This can take a minute. Refresh this page. If money was deducted, you do not need to pay again." }
      : result === "needs_review"
        ? { h: "Payment received, one quick check needed", p: "Your payment went through but the dates need a quick check by our team. We will contact you shortly." }
        : { h: "The payment didn't go through", p: "No booking was made. You can go back and try again." };

  return (
    <>
      <CheckoutHeader />
      <main id="main" className="bg-paper">
        <div className="mx-auto flex max-w-[620px] flex-col items-center gap-5 px-4 pb-24 pt-16 text-center">
          <h1 className="font-display text-[clamp(30px,5vw,40px)] font-medium leading-[1.1]">{message.h}</h1>
          <p className="text-lg text-ink-soft">{message.p}</p>
          <p className="text-sm text-muted">Reference {ref}. Questions? Call {site.phone}.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {result === "pending" ? <Link href={`/book/return?ref=${ref}`} className="btn-primary">Refresh</Link> : <Link href="/rooms" className="btn-primary">Back to rooms</Link>}
          </div>
        </div>
      </main>
    </>
  );
}
