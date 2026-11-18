import { formatShort } from "@/lib/dates";
import { refundSchedule } from "@/lib/cancellation";

/** The refund timeline for a stay, in days before check-in, with real dates. */
export function RefundTimeline({ checkIn, today }: { checkIn: string; today: string }) {
  const rows = refundSchedule(checkIn, today);
  const tone = (p: number) => (p >= 75 ? "border-accent" : p > 0 ? "border-gold" : "border-rust");
  return (
    <div className="grid grid-cols-1 gap-y-2" style={{ gridTemplateColumns: `repeat(${Math.min(rows.length, 4)}, minmax(0, 1fr))` }}>
      {rows.map((r) => (
        <div key={r.until} className={`border-t-[5px] py-3 pr-3 ${tone(r.percent)}`}>
          <div className="font-semibold">{r.percent}% refund</div>
          <div className="text-sm text-muted">
            {r.from ? `${formatShort(r.from)} to ${formatShort(r.until)}` : `Until ${formatShort(r.until)}`}
          </div>
        </div>
      ))}
    </div>
  );
}
