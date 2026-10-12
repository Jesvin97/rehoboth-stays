import Link from "next/link";
import { site } from "@/lib/site";

const cols = [
  { title: "Stay", links: [{ href: "/rooms", label: "Rooms" }, { href: "/#offers", label: "Offers" }, { href: "/policies", label: "Cancellation policy" }] },
  { title: "Discover", links: [{ href: "/#experiences", label: "Experiences" }, { href: "/#food", label: "Food" }, { href: "/#around", label: "Getting here" }] },
  { title: "Help", links: [{ href: "/#faq", label: "FAQs" }, { href: "/policies#rules", label: "House rules" }, { href: "/policies#privacy", label: "Privacy" }] },
];

export function Footer() {
  return (
    <footer className="bg-ink text-[15px] text-sage">
      <div className="container-x grid grid-cols-1 gap-8 pb-8 pt-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2.5">
          <strong className="font-display text-[22px] text-white">{site.name}</strong>
          <span>{site.address}</span>
          <a href={site.phoneHref} className="text-sage no-underline hover:text-white">{site.phone}</a>
          <a href={`mailto:${site.email}`} className="text-sage no-underline hover:text-white">{site.email}</a>
          <span>{site.registration}</span>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="flex flex-col gap-2">
            <strong className="text-white">{c.title}</strong>
            {c.links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sage no-underline hover:text-white">{l.label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="container-x flex flex-wrap justify-between gap-3 border-t border-[#34463c] pb-8 pt-5 text-[13px]">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span className="flex gap-4">
          <a href={site.social.instagram} className="text-sage hover:text-white">Instagram</a>
          <a href={site.social.facebook} className="text-sage hover:text-white">Facebook</a>
          <a href={site.social.youtube} className="text-sage hover:text-white">YouTube</a>
          <a href={site.social.maps} className="text-sage hover:text-white">Google Maps</a>
        </span>
      </div>
    </footer>
  );
}
