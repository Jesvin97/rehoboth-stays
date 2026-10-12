import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutHeader } from "@/components/book/CheckoutHeader";
import { Checkout } from "@/components/book/Checkout";
import { parseSelection, type SearchParams } from "@/lib/booking-params";
import { getRoom } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "Review & book",
  robots: { index: false },
};

export default async function BookPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sel = parseSelection(await searchParams);
  const room = getRoom(sel.room);
  if (!room) redirect("/rooms");
  return (
    <>
      <CheckoutHeader />
      <main id="main">
        <Checkout room={room} initial={sel} />
      </main>
    </>
  );
}
