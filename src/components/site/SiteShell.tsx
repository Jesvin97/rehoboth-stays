import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppChat } from "./WhatsAppChat";

export function SiteShell({ children, overlayHeader = false }: { children: React.ReactNode; overlayHeader?: boolean }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:p-3">
        Skip to content
      </a>
      <Header overlay={overlayHeader} />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppChat />
    </>
  );
}
