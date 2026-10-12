import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { RoomsSection } from "@/components/home/RoomsSection";
import { StaySearch } from "@/components/rooms/StaySearch";
import { parseStay, stayQuery, type SearchParams } from "@/lib/booking-params";

export const metadata: Metadata = {
  title: "Rooms & cottages",
  description: "Compare the rooms at Rehoboth Stays, check your dates and book direct.",
};

export default async function RoomsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const stay = parseStay(await searchParams);
  return (
    <SiteShell>
      <section className="bg-mist">
        <div className="container-x flex flex-col gap-8 py-14">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Stay</p>
            <h1 className="h2">Rooms &amp; cottages</h1>
          </div>
          <StaySearch initial={stay} />
          <RoomsSection query={stayQuery(stay)} />
        </div>
      </section>
    </SiteShell>
  );
}
