import Link from 'next/link';
import { Icon, type IconName } from '@/components/icons';
import { links } from '@/lib/shared';

const steps: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'snacc',
    title: 'Hatch',
    text: 'Stake testnet NEAR to hatch a Snacc. 80% becomes its stomach of $SNACC, 20% goes to the Pantry, the rule-bound treasury.',
  },
  {
    icon: 'atp',
    title: 'Feed',
    text: 'A bite of $SNACC keeps it alive and mints $ATP, its internal energy. In a Feeding Frenzy 3.5% of the bite is burned.',
  },
  {
    icon: 'spores',
    title: 'Work',
    text: 'It extracts spores, ferments them into enzymes and synthesizes elixirs: a three-stage supply chain of nine molecules.',
  },
  {
    icon: 'elixir',
    title: 'Divide or get snacked',
    text: 'Fed Snaccs divide into a colony of up to 5. A starved Snacc can be harvested by anyone, so keep yours fed.',
  },
];

const glossary: { icon: IconName; term: string; text: string }[] = [
  { icon: 'snacc', term: '$SNACC', text: 'The memecoin (NEP-141). A Snacc holds its own balance, its stomach.' },
  { icon: 'atp', term: '$ATP', text: 'Internal energy. Not a token: it cannot be transferred and has no supply.' },
  { icon: 'spores', term: 'Spores', text: 'Stage 1 of the supply chain: ignis, cryo and lumin.' },
  { icon: 'enzymes', term: 'Enzymes', text: 'Stage 2: amalgam, redactase and synthase, fermented from spores.' },
  { icon: 'elixir', term: 'Elixirs', text: 'Stage 3: homunculus, homeostasis and aether.' },
  { icon: 'near', term: 'NEAR', text: 'One contract, snacc-v001.testnet, holds the whole game. Testnet only.' },
];

const pages: { href: string; kicker: string; title: string; text: string }[] = [
  { href: '/docs', kicker: '01', title: 'Introduction', text: 'What Snacc is, the four layers, and what is live today.' },
  { href: '/docs/play', kicker: '02', title: 'Play in 60 seconds', text: 'Demo, live read, then a wallet: hatch, feed and divide.' },
  { href: '/docs/organism', kicker: '03', title: 'The Snacc organism', text: 'Stomach, NEP-245 inventory, BMR, $ATP and organelles.' },
  { href: '/docs/architecture', kicker: '04', title: 'Architecture', text: 'Repos, the contract, the indexer, Supabase and the TEE.' },
];

const next = [
  'Colony actions',
  'CrucibleTemp',
  'Great Feast and dividends',
  'NPCs',
  'TEE verification',
  'Marketplace',
  'One-tap play',
  'Profiles and quests',
  'Contract reference',
  'SDK',
  'Backend API',
  'Security',
  'Evidence hashes',
  'FAQ',
  'Roadmap',
];

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="sn-hero">
        <div className="sn-hero__grid" aria-hidden="true" />
        <div className="sn-hero__dots" aria-hidden="true">
          <i /><i /><i /><i /><i /><i />
        </div>
        <div className="sn-hero__inner">
          <div className="sn-hero__copy">
            <span className="sn-chip sn-rise">
              <span className="sn-chip__ico"><span className="sn-dot" /></span>
              <span className="sn-chip__txt">NEAR testnet only</span>
            </span>
            <h1 className="sn-hero__title sn-rise" style={{ animationDelay: '80ms' }}>
              NFTs that eat a <em>memecoin</em>.
            </h1>
            <p className="sn-hero__line sn-rise" style={{ animationDelay: '160ms' }}>
              Feed your Snacc or it gets snacked.
            </p>
            <p className="sn-hero__text sn-rise" style={{ animationDelay: '220ms' }}>
              Snacc is an on-chain economy game on NEAR. Every NFT is a living organism with its own stomach of <code>$SNACC</code>, an inventory of nine molecules and a metabolism that never stops. Behind it run an algorithmic central bank, three autonomous NPCs and AI verification inside a TEE.
            </p>
            <div className="sn-cta sn-rise" style={{ animationDelay: '300ms' }}>
              <Link href="/docs" className="sn-key sn-key--primary sn-key--lg">
                Read the docs
              </Link>
              <a href={links.play} target="_blank" rel="noreferrer noopener" className="sn-key sn-key--lg">
                Play <span aria-hidden="true">↗</span>
              </a>
              <a href={links.github} target="_blank" rel="noreferrer noopener" className="sn-key sn-key--lg">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
            <p className="sn-hint sn-rise" style={{ animationDelay: '380ms' }}>
              Stuck? Use <b>Ask AI</b> or press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> <kbd>K</kbd> to search.
            </p>
          </div>

          <figure className="sn-figure sn-rise" style={{ animationDelay: '200ms' }}>
            <div className="sn-win">
              <div className="sn-win__bar">
                <span className="sn-win__dots" aria-hidden="true" />
                <span>FIG 01 · incubator</span>
                <span className="sn-win__tag">testnet</span>
              </div>
              <div className="sn-win__body">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figures/incubator"
                  alt="Isometric cutaway of a laboratory incubator. A petri dish on a shelf under a marigold lamp holds a small colony of cells: one hungry and cracked, a pair merging, and one opened to show its stomach, nucleus and a mitochondrion with ATP tokens. A thermometer with three zone bands stands inside."
                  width={1600}
                  height={1000}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
            <figcaption className="sn-caption">
              One dish, one colony. Hungry cell, merger and a cell opened to its stomach and mitochondrion.
            </figcaption>
          </figure>
        </div>
        <div className="sn-ruler" aria-hidden="true" />
      </section>

      <section className="sn-section">
        <header className="sn-section__head">
          <h2 className="sn-label">How it works</h2>
          <p className="sn-section__title">Hatch, feed, work, divide.</p>
        </header>
        <ol className="sn-steps">
          {steps.map((s, i) => (
            <li key={s.title} className="sn-step">
              <span className="sn-step__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="sn-step__icon"><Icon name={s.icon} size={34} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="sn-section">
        <header className="sn-section__head">
          <h2 className="sn-label">Concepts at a glance</h2>
          <p className="sn-section__title">Six words you will meet on every page.</p>
        </header>
        <ul className="sn-glossary">
          {glossary.map((g) => (
            <li key={g.term}>
              <Icon name={g.icon} size={30} />
              <div>
                <strong>{g.term}</strong>
                <span>{g.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="sn-section">
        <header className="sn-section__head">
          <h2 className="sn-label">Start here</h2>
          <p className="sn-section__title">Four pages, each with a diagram.</p>
        </header>
        <div className="sn-cards">
          {pages.map((p) => (
            <Link key={p.href} href={p.href} className="sn-card">
              <span className="sn-card__kicker">{p.kicker}</span>
              <span className="sn-card__title">{p.title}</span>
              <span className="sn-card__text">{p.text}</span>
              <span className="sn-card__go" aria-hidden="true">Open →</span>
            </Link>
          ))}
        </div>
        <div className="sn-next">
          <span className="sn-label">Planned for this site</span>
          <ul>
            {next.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sn-section sn-section--last">
        <div className="sn-honest">
          <Icon name="snacc" size={28} />
          <p>
            <strong>Honest status.</strong> Everything here runs on NEAR testnet only. <code>$SNACC</code> on testnet has no monetary value, and a feature counts as live only when the{' '}
            <a href={`${links.github}#whats-in-the-app`} target="_blank" rel="noreferrer noopener">status table in the README</a>{' '}
            says so. Plans are marked as plans.
          </p>
        </div>
      </section>
    </main>
  );
}
