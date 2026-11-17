import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { houseRules } from "@/lib/content";
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
            The full amount is paid online at the time of booking through Razorpay. Nothing is due at check-in.
          </p>
          <p className="text-ink-soft">Refunds are counted from the day you book, not from your check-in date:</p>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[480px] text-left">
              <thead className="bg-mist text-sm">
                <tr><th className="p-3">If you cancel…</th><th className="p-3">Refund</th><th className="p-3">Example (booked on the 6th)</th></tr>
              </thead>
              <tbody className="text-ink-soft">
                <tr className="border-t border-line"><td className="p-3">On the booking day or within the next 2 days</td><td className="p-3 font-semibold text-ink">50%</td><td className="p-3">6th to 8th</td></tr>
                <tr className="border-t border-line"><td className="p-3">On the 3rd or 4th day after booking</td><td className="p-3 font-semibold text-ink">25%</td><td className="p-3">9th to 10th</td></tr>
                <tr className="border-t border-line"><td className="p-3">From the 5th day after booking</td><td className="p-3 font-semibold text-ink">No refund</td><td className="p-3">11th onwards</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted">
            Refunds go back to the original payment method through Razorpay within 5 to 7 working days. To cancel, message us on WhatsApp or call {site.phone} with your booking ID. Times are in IST.
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
            <li><strong>Newsletter:</strong> your email address, to send you news and offers a few times a year.</li>
            <li><strong>At check-in:</strong> a government ID, as the law requires of guest accommodation. [Confirm with the host: how it is recorded and kept.]</li>
          </ul>
          <h3 className="font-display text-xl font-medium">Who we share it with</h3>
          <p className="text-ink-soft">
            Razorpay processes your payment; card and UPI details go to Razorpay and are never stored by us. Your booking details are stored with our database and hosting providers (Cloudflare and Vercel), who handle them only for us. Phone, email, name and GST details are encrypted before they are stored. We do not sell your data.
          </p>
          <h3 className="font-display text-xl font-medium">How long we keep it</h3>
          <p className="text-ink-soft">
            [Booking records: 3 years, for accounts and tax. Callback requests: 90 days. Newsletter addresses: until you unsubscribe. Confirm these periods with the host.] After that we delete the data.
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
