import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { RoomsSection } from "@/components/home/RoomsSection";
import { Experiences } from "@/components/home/Experiences";
import { AroundUs } from "@/components/home/AroundUs";
import { Reviews } from "@/components/home/Reviews";
import { Faq } from "@/components/home/Faq";
import { Callback } from "@/components/home/Callback";
import { Photo } from "@/components/ui/Photo";
import { faqs } from "@/lib/content";
import { site } from "@/lib/site";

function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="section-title">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="h2">{title}</h2>
      <div className="ornament" aria-hidden="true">✦</div>
      {children ? <p className="text-[17px] text-ink-soft">{children}</p> : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <SiteShell overlayHeader>
      <Hero />

      {/* Welcome */}
      <section id="story" className="pt-28">
        <div className="container-x flex flex-col gap-16 pb-24">
          <SectionTitle eyebrow="Welcome to Ambattu Rehoboth" title="Not a hotel. Our home, opened to a few guests at a time.">
            [2–3 sentences on the house, the family and the land — when it was built, who lives here, and why you began hosting.]
          </SectionTitle>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div className="grid grid-cols-2 gap-4">
              <div className="group row-span-2 overflow-hidden"><Photo label="Hosts on the verandah" className="h-full min-h-[420px]" zoom /></div>
              <div className="group overflow-hidden"><Photo label="Kitchen" className="h-[202px]" zoom /></div>
              <div className="group overflow-hidden"><Photo label="House exterior" className="h-[202px]" zoom /></div>
            </div>
            <div className="flex flex-col gap-5">
              <p className="font-display text-[clamp(26px,2.6vw,34px)] font-medium italic leading-snug text-ink">
                &ldquo;[A line from the hosts — what they hope every guest feels when they leave.]&rdquo;
              </p>
              <p className="text-ink-soft">[What a day here feels like — breakfast on the verandah, an estate walk, dinner cooked in the family kitchen.]</p>
              <div className="flex items-center gap-4 border-t border-line pt-5">
                <div className="h-14 w-14 rounded-full bg-sage" aria-hidden="true" />
                <div>
                  <div className="font-display text-xl font-medium">{site.hosts}</div>
                  <div className="text-[12px] uppercase tracking-[0.2em] text-muted">Your hosts</div>
                </div>
              </div>
              <Link href="/rooms" className="more-link mt-2">Explore the rooms ›</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section aria-label="At a glance" className="border-y border-line bg-paper">
        <div className="container-x py-14">
          <TrustStrip />
        </div>
      </section>

      {/* Rooms */}
      <section id="rooms">
        <div className="container-x flex flex-col gap-14 py-28">
          <SectionTitle eyebrow="Stay" title="Rooms & cottages">
            Each room is different — pick the one that suits how you travel.
          </SectionTitle>
          <RoomsSection centered />
          <div className="flex justify-center">
            <Link href="/rooms" className="btn-outline">Check dates &amp; compare</Link>
          </div>
        </div>
      </section>


      {/* Experiences */}
      <section id="experiences">
        <div className="container-x flex flex-col gap-14 py-28">
          <SectionTitle eyebrow="Experiences" title="Explore more of the estate">
            Unhurried things to do, most of them without leaving the home.
          </SectionTitle>
          <Experiences />
        </div>
      </section>

      {/* Dining */}
      <section id="dining" className="bg-forest text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="group overflow-hidden">
            <Photo label="Banana-leaf meal on the dining table" tone="#56705f" dark className="h-full min-h-[460px]" zoom />
          </div>
          <div className="flex flex-col justify-center gap-6 px-6 py-20 sm:px-14 lg:px-20">
            <p className="eyebrow text-gold-light">Dining</p>
            <h2 className="h2 text-white">From our kitchen to your banana leaf</h2>
            <div className="ornament justify-start text-gold-light before:hidden after:bg-gold-light" aria-hidden="true">✦</div>
            <p className="text-[17px] text-white/85">[Breakfast is included with every stay. Lunch and dinner are cooked to order — vegetarian, Syrian Christian, Malabar or seafood menus, served family-style.]</p>
            <ul className="grid grid-cols-1 gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
              {[
                ["Breakfast", "[Puttu, appam, fruit from the garden]"],
                ["Kerala sadya", "[On request · ₹[PRICE] pp]"],
                ["Dinner", "[Family-style · ₹[PRICE] pp]"],
              ].map(([t, d]) => (
                <li key={t} className="flex flex-col gap-1">
                  <span className="font-display text-[22px]">{t}</span>
                  <span className="text-sm text-white/75">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>


      {/* Around us */}
      <section id="around" className="bg-paper">
        <div className="container-x py-28">
          <AroundUs />
        </div>
      </section>

      {/* Reviews */}
      <section aria-label="Guest reviews">
        <div className="container-x py-28">
          <Reviews />
        </div>
      </section>

      {/* Gallery */}
      <section aria-label="Gallery" className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
        {["Instagram 1", "Instagram 2", "Instagram 3", "Instagram 4", "Instagram 5"].map((l, i) => (
          <div key={l} className={`group overflow-hidden ${i === 4 ? "max-lg:hidden" : ""}`}>
            <Photo label={l} className="aspect-square" zoom />
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="mx-auto flex max-w-[880px] flex-col gap-12 px-4 py-28 sm:px-8">
          <SectionTitle eyebrow="Before you come" title="Questions guests ask" />
          <Faq items={faqs} />
        </div>
      </section>

      {/* Callback */}
      <section id="callback" className="bg-accent text-white">
        <div className="container-x flex flex-col items-center gap-8 py-20 text-center">
          <div className="flex max-w-[640px] flex-col items-center gap-3">
            <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-gold-light">Plan your stay</p>
            <h2 className="h2 text-white">Only a few rooms. Talk to your host.</h2>
            <p className="text-white/85">Leave your number and we&apos;ll call you back — or <Link href="/rooms" className="text-white underline hover:text-gold-light">book online</Link> now.</p>
          </div>
          <Callback />
        </div>
      </section>
    </SiteShell>
  );
}
