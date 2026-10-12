import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="container-x flex flex-col items-start gap-4 py-28">
        <p className="eyebrow">Page not found</p>
        <h1 className="h2">This path doesn&apos;t lead anywhere.</h1>
        <p className="text-ink-soft">The page may have moved. Head back home or look at the rooms.</p>
        <div className="flex gap-3">
          <Link href="/" className="btn-primary no-underline">Home</Link>
          <Link href="/rooms" className="btn-outline no-underline">See rooms</Link>
        </div>
      </div>
    </SiteShell>
  );
}
