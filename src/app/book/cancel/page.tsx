import type { Metadata } from "next";
import { CheckoutHeader } from "@/components/book/CheckoutHeader";
import { CancelForm } from "@/components/book/CancelForm";

export const metadata: Metadata = { title: "Cancel a booking", robots: { index: false } };

export default async function CancelPage({ searchParams }: { searchParams: Promise<{ ref?: string | string[] }> }) {
  const sp = await searchParams;
  const ref = (Array.isArray(sp.ref) ? sp.ref[0] : sp.ref) ?? "";
  return (
    <>
      <CheckoutHeader />
      <main id="main" className="bg-paper">
        <div className="mx-auto flex max-w-[640px] flex-col gap-6 px-4 pb-24 pt-14 sm:px-6">
          <h1 className="font-display text-[clamp(32px,5vw,42px)] font-medium leading-[1.05]">Cancel a booking</h1>
          <p className="text-lg text-ink-soft">Enter your booking ID and the mobile number you booked with. You will see exactly how much is refunded before you confirm.</p>
          <CancelForm initialRef={ref.toUpperCase().slice(0, 9)} />
        </div>
      </main>
    </>
  );
}
