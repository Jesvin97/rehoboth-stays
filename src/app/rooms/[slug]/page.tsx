import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/SiteShell";
import { RoomGallery } from "@/components/rooms/RoomGallery";
import { RoomBooking } from "@/components/rooms/RoomBooking";
import { Faq } from "@/components/home/Faq";
import { amenities, getRoom, rooms } from "@/lib/rooms";
import { parseSelection, type SearchParams } from "@/lib/booking-params";
import { faqs, houseRules } from "@/lib/content";
import { inr } from "@/lib/pricing";

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const room = getRoom((await params).slug);
  return room ? { title: room.name, description: room.tagline } : {};
}

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();
  const sel = { ...parseSelection(await searchParams), room: room.slug };
  const index = rooms.indexOf(room);
  const others = rooms.filter((r) => r.slug !== room.slug);

  return (
    <SiteShell>
      <div className="container-x flex flex-col gap-4 pt-5">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/" className="text-muted">Home</Link> / <Link href="/rooms" className="text-muted">Rooms</Link> / <span className="text-ink">{room.name}</span>
        </nav>
        <RoomGallery room={room} />
      </div>

      <div className="container-x pb-24 pt-10">
        <RoomBooking room={room} initial={sel}>
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Room {index + 1} of {rooms.length}</p>
            <h1 className="font-display text-[clamp(36px,4vw,48px)] font-medium leading-[1.05]">{room.name}</h1>
            <ul className="flex flex-wrap gap-2.5 text-[15px] text-ink-soft">
              {room.chips.map((c) => (
                <li key={c} className="rounded-full border border-line px-3 py-1.5">{c}</li>
              ))}
            </ul>
            <p className="mt-2 text-lg text-ink-soft">{room.description}</p>
          </div>

          <section className="flex flex-col gap-4 border-t border-line-soft pt-8">
            <h2 className="font-display text-[26px] font-medium">In the room</h2>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-3 text-ink-soft sm:grid-cols-2">
              {amenities.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </section>

          <section className="flex flex-col gap-4 border-t border-line-soft pt-8">
            <h2 className="font-display text-[26px] font-medium">House rules</h2>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2 pl-5 text-ink-soft sm:grid-cols-2 [&>li]:list-disc">
              {houseRules.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </section>
        </RoomBooking>

        <section className="mt-16 flex flex-col gap-4 border-t border-line-soft pt-8 lg:max-w-[760px]">
          <h2 className="font-display text-[26px] font-medium">Questions guests ask</h2>
          <Faq items={faqs.slice(0, 4)} />
        </section>

        <section className="mt-16 flex flex-col gap-4">
          <h2 className="font-display text-[26px] font-medium">Other rooms</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((r) => (
              <Link key={r.slug} href={`/rooms/${r.slug}`} className="lift flex items-center gap-3.5 rounded-[3px] border border-line p-3 text-ink no-underline">
                <div className="h-[72px] w-24 shrink-0 rounded-[3px]" style={{ backgroundColor: r.photos[0].tone }} aria-hidden="true" />
                <div>
                  <strong>{r.name}</strong>
                  <div className="text-sm text-muted">From {inr(r.rates.bb)} / night</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
