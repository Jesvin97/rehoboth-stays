import Link from "next/link";
import { StageProvider } from "@/components/stage/StageContext";
import { Stage } from "@/components/stage/Stage";
import { Reveal } from "@/components/stage/Reveal";
import { Picture } from "@/components/stage/Picture";
import { HeroFinder } from "@/components/home/HeroFinder";
import { RoomsList } from "@/components/home/RoomsList";
import { ExperienceShowcase } from "@/components/home/ExperienceShowcase";
import { GalleryRow } from "@/components/home/GalleryRow";
import { WhatsAppChat } from "@/components/site/WhatsAppChat";
import { faqs, houseRules, places, experiences } from "@/lib/content";
import { rooms } from "@/lib/rooms";
import { site, whatsappLink } from "@/lib/site";

const headClass = "font-display text-[clamp(2rem,1.3rem+2vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em]";

// Every photo the fixed stage can show, in reading order.
const stageKeys = ["house", "verandah", ...rooms.map((r) => `room-${r.slug}`), ...experiences.map((e) => `exp-${e.id}`), "kitchen"];

const faqItems = [
  ...faqs,
  { q: "When can we arrive and leave?", a: `Check-in is from ${site.checkInTime} and check-out is by ${site.checkOutTime}. Ask us if you need earlier or later; we can often manage it.` },
  { q: "What do we need to bring?", a: "Government ID for every guest. [Anything else the hosts recommend: a rain jacket in the monsoon, walking shoes for the estate.]" },
  { q: "Are there house rules?", a: houseRules.join(". ") + "." },
];

export default function HomePage() {
  return (
    <StageProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:p-3">
        Skip to content
      </a>
      <Reveal />
      <main id="main">
        {/* The split stage: a fixed photograph on the left, the reading column on the right */}
        <div className="lg:grid lg:grid-cols-[47fr_53fr]">
          <div className="hidden bg-night lg:block">
            <Stage keys={stageKeys} />
          </div>

          <div className="relative min-w-0">
            <HeroFinder />

            {/* Intro: what the name means, what the place is */}
            <section data-stage="verandah" className="bg-paper px-5 pb-40 pt-24 lg:pl-[12%] lg:pr-10">
              <div className="flex max-w-[44ch] flex-col gap-5 text-[18px] text-ink">
                <p data-reveal className="font-medium">
                  Rehoboth means room enough. Ambattu is our family name. Together they are the house: four rooms, a working estate and a kitchen that has fed visitors for [years].
                </p>
                <p data-reveal style={{ ["--i" as string]: 1 }}>[When the house was built, by whom, and what it was before it took in guests.]</p>
                <p data-reveal style={{ ["--i" as string]: 2 }}>
                  You stay as guests of the family, not of a hotel. Breakfast is on the verandah. Dinner, if you want it, is whatever we are eating.
                </p>
                <p data-reveal style={{ ["--i" as string]: 3 }}>
                  [What the estate grows, what you can walk to, and what the mornings sound like.]{" "}
                  <a href="#letter" className="link-quiet text-accent">Read the hosts&apos; letter</a>
                </p>
              </div>
            </section>

            <RoomsList />
            <ExperienceShowcase />

            {/* The hosts' letter, with the kitchen */}
            <section id="letter" data-stage="kitchen" className="bg-paper px-5 py-40 lg:pl-[12%] lg:pr-10">
              <div className="max-w-[520px]">
                <div data-reveal className="h-11 w-11 rounded-full" style={{ backgroundColor: "#6f7a68" }} role="img" aria-label="Photograph to come: your hosts" />
                <h2 className="sr-only">A letter from your hosts</h2>
                <div className="mt-7 flex flex-col gap-5 text-[18px] leading-[1.55] text-ink">
                  <p data-reveal style={{ ["--i" as string]: 1 }}>Dear guest,</p>
                  <p data-reveal style={{ ["--i" as string]: 2 }}>[Two or three lines in the hosts&apos; own words: how the family came to the house, and why they open it to visitors.]</p>
                  <p data-reveal style={{ ["--i" as string]: 3 }}>
                    We cook what the estate and the market give us. Breakfast comes with every room: puttu or appam, fruit from the garden, coffee we grew. If you choose the all-meals plan, lunch and dinner are served at our table. [Vegetarian, Syrian Christian or Malabar dishes; tell us what you can&apos;t eat.]
                  </p>
                  <p data-reveal style={{ ["--i" as string]: 4 }}>[A line on what guests usually do on their first evening.]</p>
                  <p data-reveal style={{ ["--i" as string]: 5 }}>We look forward to having you.</p>
                </div>
                <p data-reveal className="mt-8 font-display text-[24px] italic text-ink">{site.hosts}</p>
                <p className="text-[14px] text-muted">Your hosts at {site.name}</p>
              </div>
            </section>
          </div>
        </div>

        <GalleryRow />

        {/* Getting here: places and drive times as a two-ended list */}
        <section id="getting-here" className="bg-mist px-5 py-36 lg:px-[6vw]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 data-reveal className={headClass}>Getting here</h2>
              <p data-reveal style={{ ["--i" as string]: 1 }} className="mt-5 max-w-[34ch] text-[18px] text-ink">
                {site.locationLine}. We can arrange a car from the airport or the station.
              </p>
              <a href={site.social.maps} className="link-quiet mt-4 inline-block text-[18px] text-accent">Open in Google Maps</a>
            </div>
            <div className="lg:col-span-6 lg:col-start-6">
              <p className="mb-3 text-[14px] text-muted">By car from the house</p>
              <ul className="flex flex-col">
                {places.map((p, i) => (
                  <li key={p.name} data-reveal style={{ ["--i" as string]: i }} className="flex items-start justify-between gap-6 py-3">
                    <div>
                      <p className="text-[18px] text-ink">{p.name}</p>
                      <p className="text-[14px] text-muted">{p.note}</p>
                    </div>
                    <p className="shrink-0 text-[18px] tabular-nums text-ink">{p.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Questions, answered as reading text */}
        <section id="faq" className="bg-paper px-5 py-36 lg:px-[6vw]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h2 data-reveal className={`${headClass} lg:col-span-3`}>Before you come</h2>
            <div className="text-[18px] leading-[1.55] text-ink lg:col-span-8 lg:col-start-5 lg:columns-2 lg:gap-14">
              {faqItems.map((f, i) => (
                <p key={f.q} data-reveal style={{ ["--i" as string]: i % 4 }} className="mb-5 break-inside-avoid">
                  <span className="font-medium">{f.q}</span> {f.a}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section aria-labelledby="contact-h" className="bg-night px-5 pb-28 pt-36 text-paper lg:px-[6vw]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <p id="contact-h" data-reveal className="max-w-[26ch] text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)] leading-[1.2] lg:col-span-5">
              Write or ring for anything the booking can&apos;t answer. We usually reply within the hour.
            </p>
            <Picture k="contact" className="aspect-square w-24 lg:col-span-2 lg:col-start-8 lg:w-[160px]" caption={false} />
            <div className="flex flex-col gap-3 lg:col-span-3 lg:col-start-10">
              <p className="text-[18px] font-medium">Rather talk first?</p>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="text-[18px] text-paper underline decoration-paper/40 underline-offset-4 hover:text-white hover:decoration-white">
                Message us on WhatsApp
              </a>
              <a href={site.phoneHref} className="text-[18px] text-paper underline decoration-paper/40 underline-offset-4 hover:text-white hover:decoration-white">
                Call {site.phone}
              </a>
              <p className="mt-2 text-[14px] text-sage">{site.region} · replies within the hour, 8 am to 9 pm</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer: the name across the last photograph */}
      <footer className="relative h-[88svh] min-h-[560px] overflow-hidden text-paper lg:h-svh">
        <Picture k="footer" fill caption={false} className="brightness-[0.62]" />
        <div className="relative flex h-full flex-col justify-between px-5 pt-8 lg:px-8">
          <div className="flex flex-col justify-between gap-8 sm:flex-row">
            <ul className="flex flex-col gap-1 text-[18px]">
              <li><Link href="/rooms" className="link-quiet text-paper hover:text-white">Rooms and prices</Link></li>
              <li><Link href="/policies#cancellation" className="link-quiet text-paper hover:text-white">Cancellation and refunds</Link></li>
              <li><Link href="/policies#rules" className="link-quiet text-paper hover:text-white">House rules</Link></li>
              <li><Link href="/policies#privacy" className="link-quiet text-paper hover:text-white">Privacy</Link></li>
            </ul>
            <address className="flex flex-col gap-1 text-[18px] not-italic sm:text-right">
              <span>{site.address}</span>
              <a href={site.phoneHref} className="link-quiet text-paper hover:text-white">{site.phone}</a>
              <a href={`mailto:${site.email}`} className="link-quiet text-paper hover:text-white">{site.email}</a>
            </address>
          </div>
          <div>
            <p aria-hidden="true" className="footer-mark select-none whitespace-nowrap font-display text-[11.6vw] font-medium lowercase leading-[0.8] tracking-[-0.035em] lg:text-[12.4vw]">
              ambattu rehoboth
            </p>
            <p className="pb-6 pt-4 text-[14px] text-sage">
              © {new Date().getFullYear()} {site.name} · {site.registration} · Payments by Razorpay
            </p>
          </div>
        </div>
      </footer>

      <WhatsAppChat />
    </StageProvider>
  );
}
