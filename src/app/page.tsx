import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { Hero } from "@/components/home/Hero";
import { RoomsSection } from "@/components/home/RoomsSection";
import { Experiences } from "@/components/home/Experiences";
import { Offers } from "@/components/home/Offers";
import { AroundUs } from "@/components/home/AroundUs";
import { Reviews } from "@/components/home/Reviews";
import { Faq } from "@/components/home/Faq";
import { Photo } from "@/components/ui/Photo";
import { faqs, stats } from "@/lib/content";
import { site, whatsappLink } from "@/lib/site";

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />

      <section aria-label="At a glance" className="border-b border-line-soft">
        <div className="container-x grid grid-cols-2 gap-5 py-7 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-[clamp(24px,2.6vw,34px)] font-bold">{s.value}</div>
              <div className="text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="story">
        <div className="container-x grid grid-cols-1 items-center gap-14 py-24 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">Our story</p>
            <h2 className="h2">Not a hotel. Our home, opened to a few guests at a time.</h2>
            <p className="text-lg text-ink-soft">[2–3 sentences on the house, the family and the land — when it was built, who lives here, and why you began hosting.]</p>
            <p className="text-ink-soft">[What a day here feels like — breakfast on the verandah, an estate walk, dinner cooked in the family kitchen.]</p>
            <div className="flex items-center gap-3.5 pt-2">
              <div className="h-14 w-14 rounded-full bg-sage" aria-hidden="true" />
              <div>
                <div className="font-semibold">{site.hosts}</div>
                <div className="text-sm text-muted">Your hosts</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="group row-span-2 overflow-hidden rounded-2xl"><Photo label="Hosts on the verandah" className="h-[380px]" zoom /></div>
            <div className="group overflow-hidden rounded-2xl"><Photo label="Kitchen" className="h-[183px]" zoom /></div>
            <div className="group overflow-hidden rounded-2xl"><Photo label="House exterior" className="h-[183px]" zoom /></div>
          </div>
        </div>
      </section>

      <section id="rooms" className="bg-mist">
        <div className="container-x flex flex-col gap-8 py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-3">
              <p className="eyebrow">Stay</p>
              <h2 className="h2">Rooms &amp; cottages</h2>
            </div>
            <Link href="/rooms" className="font-semibold">Check dates &amp; compare rooms →</Link>
          </div>
          <RoomsSection />
        </div>
      </section>

      <section id="experiences">
        <div className="container-x flex flex-col gap-8 py-24">
          <div className="flex max-w-[640px] flex-col gap-3">
            <p className="eyebrow">Experiences</p>
            <h2 className="h2">Things to do without leaving the home</h2>
            <p className="text-ink-soft">Pick what interests you and send the list to your hosts — they&apos;ll plan it before you arrive.</p>
          </div>
          <Experiences />
        </div>
      </section>

      <section id="food" className="bg-ink text-[#e6ece7]">
        <div className="container-x grid grid-cols-1 items-center gap-14 py-24 lg:grid-cols-2">
          <div className="group overflow-hidden rounded-2xl"><Photo label="Banana-leaf meal on the dining table" tone="#3e5a4c" dark className="h-[420px]" zoom /></div>
          <div className="flex flex-col gap-4">
            <p className="eyebrow text-gold-light">From our kitchen</p>
            <h2 className="h2 text-white">Home-cooked Kerala meals, made with what grows here</h2>
            <p className="text-[17px]">[Breakfast included. Lunch and dinner on request — vegetarian, Syrian Christian, Malabar or seafood menus.]</p>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>[Breakfast: puttu, appam, fruit from the garden]</li>
              <li>[Dinner: ₹[PRICE] per person, served family-style]</li>
              <li>[Dietary needs handled with notice]</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="offers">
        <div className="container-x flex flex-col gap-10 py-24">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Offers</p>
            <h2 className="h2">Book direct and get more</h2>
          </div>
          <Offers />
        </div>
      </section>

      <section id="around" className="bg-mist">
        <div className="container-x py-24">
          <AroundUs />
        </div>
      </section>

      <section aria-label="Guest reviews">
        <div className="container-x py-24">
          <Reviews />
        </div>
      </section>

      <section aria-label="Gallery" className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
        {["Instagram 1", "Instagram 2", "Instagram 3", "Instagram 4", "Instagram 5"].map((l, i) => (
          <div key={l} className={`group overflow-hidden ${i === 4 ? "max-lg:hidden" : ""}`}>
            <Photo label={l} className="h-[240px]" zoom />
          </div>
        ))}
      </section>

      <section id="faq">
        <div className="mx-auto flex max-w-[880px] flex-col gap-7 px-4 py-24 sm:px-6">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Before you come</p>
            <h2 className="h2">Questions guests ask</h2>
          </div>
          <Faq items={faqs} />
        </div>
      </section>

      <section className="bg-teal text-white">
        <div className="container-x flex flex-wrap items-center justify-between gap-6 py-[72px]">
          <h2 className="h2 max-w-[640px] text-white">Only a few rooms. Dates fill fast in season.</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/rooms" className="inline-flex min-h-12 items-center rounded-full bg-white px-6 font-semibold text-ink no-underline hover:bg-mist">Check availability</Link>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-white px-6 font-semibold text-white no-underline hover:bg-white/15">Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
