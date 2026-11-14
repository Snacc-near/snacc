import Link from 'next/link';
import { BrandChip } from './brand';
import { Coin } from './icons';
import { links } from '@/lib/shared';

export function SiteFooter() {
  return (
    <footer className="sn-footer">
      <div className="sn-footer__inner">
        <div className="sn-footer__brand">
          <BrandChip />
          <p>
            NFTs that eat a memecoin. Feed your Snacc or it gets snacked.
          </p>
          <p className="sn-footer__fine">
            <Coin size={18} /> <span>NEAR testnet only. <code>$SNACC</code> on testnet has no monetary value. Volatility is a game feature, not a promise.</span>
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="sn-label">Docs</h2>
          <ul>
            <li><Link href="/docs">Introduction</Link></li>
            <li><Link href="/docs/play">Play in 60 seconds</Link></li>
            <li><Link href="/docs/organism">The Snacc organism</Link></li>
            <li><Link href="/docs/architecture">Architecture</Link></li>
          </ul>
        </nav>
        <nav aria-label="Elsewhere">
          <h2 className="sn-label">Elsewhere</h2>
          <ul>
            <li><a href={links.play} target="_blank" rel="noreferrer noopener">Play the game</a></li>
            <li><a href={links.landing} target="_blank" rel="noreferrer noopener">Landing page</a></li>
            <li><a href={links.github} target="_blank" rel="noreferrer noopener">GitHub: Snacc</a></li>
            <li><a href={links.org} target="_blank" rel="noreferrer noopener">GitHub organisation</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
