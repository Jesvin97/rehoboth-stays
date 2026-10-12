import { Logo } from "../site/Logo";
import { Lock } from "../ui/Icons";

/** Slim header used on checkout pages so guests aren't pulled away mid-booking. */
export function CheckoutHeader() {
  return (
    <header className="border-b border-line-soft bg-white">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          <Lock size={18} className="text-teal" /> Secure checkout · no booking fees
        </div>
      </div>
    </header>
  );
}
