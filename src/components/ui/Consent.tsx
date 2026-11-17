import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Consent checkbox (DPDP Act): says what the data is used for, how to withdraw,
 * and links to the full privacy notice. Must be ticked by the person; never pre-ticked.
 */
export function Consent({
  id,
  checked,
  onChange,
  purpose,
  tone = "light",
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  purpose: string;
  tone?: "light" | "dark";
}) {
  const text = tone === "dark" ? "text-white/80" : "text-ink-soft";
  const link = tone === "dark" ? "text-gold-light underline" : "underline";
  return (
    <label htmlFor={id} className={`flex cursor-pointer items-start gap-2.5 text-sm leading-snug ${text}`}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-accent" />
      <span>
        I agree that {site.name} may use {purpose}. I can withdraw consent or ask for my data to be corrected or deleted at any time by writing to {site.email}. Read the{" "}
        <Link href="/policies#privacy" className={link}>privacy notice</Link>.
      </span>
    </label>
  );
}
