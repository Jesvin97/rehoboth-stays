import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { Newsletter } from "./Newsletter";

const cols = [
  { title: "Stay", links: [{ href: "/rooms", label: "Rooms & cottages" }, { href: "/rooms/whole-home", label: "Book the whole home" }] },
  { title: "Discover", links: [{ href: "/#experiences", label: "Experiences" }, { href: "/#dining", label: "Dining" }, { href: "/#around", label: "Getting here" }] },
  { title: "Help", links: [{ href: "/#faq", label: "FAQs" }, { href: "/policies#cancellation", label: "Cancellation & refunds" }, { href: "/policies#rules", label: "House rules" }, { href: "/policies#privacy", label: "Privacy" }] },
];

export function Footer() {
  return (
    <footer className="bg-night text-[15px] text-[#c9d3ca]">
      <div className="border-b border-white/10">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-12 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-gold-light">Letters from Ambattu Rehoboth</p>
            <p className="font-display text-[28px] font-medium leading-tight text-white">Seasonal news from the estate, a few times a year.</p>
          </div>
          <Newsletter />
        </div>
      </div>

      <div className="container-x grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Logo light />
          <span className="mt-3">{site.address}</span>
          <a href={site.phoneHref} className="text-[#c9d3ca] no-underline hover:text-white">Reservations: {site.phone}</a>
          <a href={`mailto:${site.email}`} className="text-[#c9d3ca] no-underline hover:text-white">{site.email}</a>
          <span className="text-sm text-[#9fb0a5]">{site.registration}</span>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="flex flex-col gap-2.5">
            <strong className="mb-1 text-[12px] font-medium uppercase tracking-[0.24em] text-gold-light">{c.title}</strong>
            {c.links.map((l) => (
              <Link key={l.href} href={l.href} className="text-[#c9d3ca] no-underline hover:text-white">{l.label}</Link>
            ))}
          </div>
        ))}
      </div>

      <div className="container-x flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pb-10 pt-6 text-[13px] text-[#9fb0a5]">
        <span>© {new Date().getFullYear()} {site.name}. Payments secured by Razorpay.</span>
        <span className="flex flex-wrap gap-5 uppercase tracking-[0.16em]">
          <a href={site.social.instagram} className="text-[#9fb0a5] no-underline hover:text-white">Instagram</a>
          <a href={site.social.facebook} className="text-[#9fb0a5] no-underline hover:text-white">Facebook</a>
          <a href={site.social.youtube} className="text-[#9fb0a5] no-underline hover:text-white">YouTube</a>
          <a href={site.social.maps} className="text-[#9fb0a5] no-underline hover:text-white">Google Maps</a>
        </span>
      </div>
    </footer>
  );
}
