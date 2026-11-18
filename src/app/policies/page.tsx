import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { houseRules } from "@/lib/content";
import { refundTiers } from "@/lib/cancellation";
import { site, PRIVACY_VERSION } from "@/lib/site";

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
            The full amount is paid online at the time of booking through Cashfree. Nothing is due at check-in.
          </p>
          <p className="text-ink-soft">The dates you book are held for you and shown as booked to everyone else, so a cancellation costs the homestay income. The earlier you cancel, the less is kept as a cancellation charge. Percentages are of the total you paid, GST included.</p>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[420px] text-left">
              <thead className="bg-mist text-sm">
                <tr><th className="p-3">If you cancel…</th><th className="p-3">Refund</th><th className="p-3">Kept as cancellation charge</th></tr>
              </thead>
              <tbody className="text-ink-soft">
                {refundTiers.map((t, i) => {
                  const prev = i > 0 ? refundTiers[i - 1].minDaysBefore : null;
                  const label = prev === null ? `${t.minDaysBefore} or more days before check-in` : t.minDaysBefore === 0 ? `Up to ${prev - 1} days before check-in, including the check-in day` : `${t.minDaysBefore} to ${prev - 1} days before check-in`;
                  return (
                    <tr key={t.minDaysBefore} className="border-t border-line"><td className="p-3">{label}</td><td className="p-3 font-semibold text-ink">{t.percent > 0 ? `${t.percent}%` : "No refund"}</td><td className="p-3">{100 - t.percent}%</td></tr>
                  );
                })}
                <tr className="border-t border-line"><td className="p-3">After your stay has started</td><td className="p-3 font-semibold text-ink">Please call us</td><td className="p-3">-</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-ink-soft">
            Cancel online any time before check-in at <Link href="/book/cancel">Cancel a booking</Link> with your booking ID and mobile number. You will see your exact refund before you confirm. If you book dates that someone else booked while you were paying, you are refunded in full automatically.
          </p>
          <p className="text-sm text-muted">
            Refunds go back to the original payment method through Cashfree within 5 to 7 working days. Questions? Call {site.phone} with your booking ID. Times are in IST.
          </p>
        </section>

        <section id="rules" className="flex flex-col gap-4">
          <h2 className="font-display text-[28px] font-medium">House rules</h2>
          <ul className="flex flex-col gap-2 pl-5 text-ink-soft [&>li]:list-disc">
            {houseRules.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </section>

        <section id="privacy" className="flex flex-col gap-4">
          <h2 className="font-display text-[28px] font-medium">Privacy notice</h2>
          <p className="text-ink-soft">
            {site.name} collects and uses your personal data only as described here, under India&apos;s Digital Personal Data Protection Act, 2023. Version {PRIVACY_VERSION}.
          </p>
          <h3 className="font-display text-xl font-medium">What we collect and why</h3>
          <ul className="flex flex-col gap-2 pl-5 text-ink-soft [&>li]:list-disc">
            <li><strong>Booking:</strong> your name, mobile number, email, dates and requests, plus a GST number and company name if you give them. We use these to confirm and manage your stay, contact you about it, and issue invoices.</li>
            <li><strong>Callback request:</strong> your name and mobile number, to call you back about a stay.</li>
            <li><strong>At check-in:</strong> a government ID, as the law requires of guest accommodation. [Confirm with the host: how it is recorded and kept.]</li>
          </ul>
          <h3 className="font-display text-xl font-medium">Who we share it with</h3>
          <p className="text-ink-soft">
            Cashfree processes your payment; card and UPI details go to Cashfree and are never stored by us. Your booking details are stored with our database and hosting providers (Cloudflare and Vercel), who handle them only for us. Phone, email, name and GST details are encrypted before they are stored. We do not sell your data.
          </p>
          <h3 className="font-display text-xl font-medium">How long we keep it</h3>
          <p className="text-ink-soft">
            [Booking records: 3 years, for accounts and tax. Callback requests: 90 days. Confirm these periods with the host.] After that we delete the data.
          </p>
          <h3 className="font-display text-xl font-medium">Your rights</h3>
          <p className="text-ink-soft">
            You can ask to see the data we hold about you, correct it, have it deleted, or withdraw your consent at any time. Withdrawing consent does not affect what we did before. Write to <a href={`mailto:${site.email}`}>{site.email}</a> or call {site.phone}; we aim to reply within [7] days.
          </p>
          <h3 className="font-display text-xl font-medium">Complaints</h3>
          <p className="text-ink-soft">
            Contact our grievance officer, [Name], at <a href={`mailto:${site.email}`}>{site.email}</a>. If you are not satisfied, you can complain to the Data Protection Board of India.
          </p>
        </section>
      </div>
    </SiteShell>
  );
}
