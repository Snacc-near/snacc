import { MobileBar, TopBar } from '@/components/top-bar';
import { SiteFooter } from '@/components/site-footer';

// The home page has its own top bar (fixed on desktop, compact on phones) and a footer, instead of
// the default Fumadocs home navbar.
export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <TopBar />
      <MobileBar />
      <div className="sn-home flex flex-1 flex-col md:pt-16">{children}</div>
      <SiteFooter />
    </>
  );
}
