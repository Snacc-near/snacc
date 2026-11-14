import Link from 'next/link';
import { BrandChip } from './brand';
import { links } from '@/lib/shared';

const nav = [
  { text: 'Docs', href: '/docs' },
  { text: 'Play in 60 seconds', href: '/docs/play' },
  { text: 'Architecture', href: '/docs/architecture' },
];

/** Compact bar for phones, used by the home page (docs pages use the Fumadocs mobile navbar). */
export function MobileBar() {
  return (
    <header className="sn-mobilebar md:hidden">
      <Link href="/" aria-label="Snacc docs home">
        <BrandChip size="sm" />
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/docs" className="sn-key sn-key--sm">
          Docs
        </Link>
        <a href={links.play} target="_blank" rel="noreferrer noopener" className="sn-key sn-key--primary sn-key--sm">
          Play <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}

// Fixed 64px bar in the landing page language: paper, a 1px ink rule, mono labels and a marigold keycap.
export function TopBar() {
  return (
    <header className="sn-topbar fixed inset-x-0 top-0 z-40 hidden h-16 items-center justify-between px-6 md:flex">
      <div className="flex items-center gap-6">
        <Link href="/" aria-label="Snacc docs home">
          <BrandChip />
        </Link>
        <span className="sn-chip-live" title="Everything described here runs on NEAR testnet only">
          <span className="sn-dot" aria-hidden="true" />
          testnet only
        </span>
        <nav className="flex items-center gap-1" aria-label="Main">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className="sn-navlink">
              {l.text}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <a href={links.github} target="_blank" rel="noreferrer noopener" className="sn-navlink">
          GitHub
        </a>
        <a href={links.play} target="_blank" rel="noreferrer noopener" className="sn-key sn-key--primary sn-key--sm">
          Play
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}
