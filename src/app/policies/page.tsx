import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { houseRules } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Policies",
  description: "Cancellation policy, house rules and privacy at Ambattu Rehoboth Stays.",
};

export default function PoliciesPage() {
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-[820px] flex-col gap-14 px-4 py-16 sm:px-6">
        <h1 className="h2">Policies</h1>

        <section id="cancellation" className="flex flex-col gap-4">
          <h2 className="font-display text-[28px] font-medium">Payment &amp; cancellation</h2>
          <p className="text-ink-soft">
            The full amount is paid online at the time of booking through Razorpay. Nothing is due at check-in.
          </p>
          <p className="text-ink-soft">Refunds are counted from the day you book, not from your check-in date:</p>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[480px] text-left">
              <thead className="bg-mist text-sm">
                <tr><th className="p-3">If you cancel…</th><th className="p-3">Refund</th><th className="p-3">Example (booked on the 6th)</th></tr>
              </thead>
              <tbody className="text-ink-soft">
                <tr className="border-t border-line"><td className="p-3">On the booking day or within the next 2 days</td><td className="p-3 font-semibold text-ink">50%</td><td className="p-3">6th – 8th</td></tr>
                <tr className="border-t border-line"><td className="p-3">On the 3rd or 4th day after booking</td><td className="p-3 font-semibold text-ink">25%</td><td className="p-3">9th – 10th</td></tr>
                <tr className="border-t border-line"><td className="p-3">From the 5th day after booking</td><td className="p-3 font-semibold text-ink">No refund</td><td className="p-3">11th onwards</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted">
            Refunds go back to the original payment method through Razorpay within 5–7 working days. To cancel, message us on WhatsApp or call {site.phone} with your booking ID. Times are in IST.
          </p>
        </section>

        <section id="rules" className="flex flex-col gap-4">
          <h2 className="font-display text-[28px] font-medium">House rules</h2>
          <ul className="flex flex-col gap-2 pl-5 text-ink-soft [&>li]:list-disc">
            {houseRules.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </section>

        <section id="privacy" className="flex flex-col gap-4">
          <h2 className="font-display text-[28px] font-medium">Privacy</h2>
          <p className="text-ink-soft">
            [Privacy policy to be supplied by the client — what guest data is collected (name, phone, email, ID at check-in), why, how long it is kept, and who it is shared with (Razorpay for payments). Card details are handled by Razorpay and never stored by us.]
          </p>
        </section>
      </div>
    </SiteShell>
  );
}
