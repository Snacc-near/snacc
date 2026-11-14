import type { ReactElement, SVGProps } from 'react';

/**
 * The Snacc icon set: a bitten `$SNACC` coin, ATP, spores, enzymes, elixir and a generic NEAR mark.
 * Hand-drawn on a 32 x 32 grid, ink strokes in `currentColor`, marigold fills from `--sn-accent`
 * so they follow the light and dark themes. The NEAR mark is generic art, not the issuer logo.
 */
export const ICON_NAMES = ['snacc', 'atp', 'spores', 'enzymes', 'elixir', 'near'] as const;
export type IconName = (typeof ICON_NAMES)[number];

export function isIconName(name: string): name is IconName {
  return (ICON_NAMES as readonly string[]).includes(name);
}

const MARI = 'var(--sn-accent, #f8aa06)';
const MARI_HI = 'var(--sn-accent-hi, #ffd57a)';
const FROST = 'var(--sn-frost, #2b7a8c)';
const WARM = 'var(--sn-warm, #d94135)';

type SvgProps = Omit<SVGProps<SVGSVGElement>, 'name'>;

function Glyph({ name }: { name: IconName }): ReactElement {
  switch (name) {
    case 'snacc':
      // coin with a bite taken out of the upper right edge, an S and two crumbs
      return (
        <>
          <path
            d="M28.6 12.8A13 13 0 1 1 21.64 4.28A6 6 0 0 0 28.6 12.8Z"
            fill={MARI}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M16 6.2a9.8 9.8 0 1 0 9.8 9.8" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity=".45" strokeLinecap="round" />
          <path d="M19.6 12.4c-1-1.7-3-2.2-4.5-1.7-1.8.6-2.2 2.6-.7 3.7 1.5 1.1 3.8 1.2 4.6 3 .8 1.9-.9 3.5-2.8 3.5-1.4 0-2.7-.6-3.5-1.8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="29" cy="5.2" r="1.1" fill="currentColor" />
          <circle cx="26.2" cy="2.8" r=".8" fill="currentColor" />
        </>
      );
    case 'atp':
      // adenosine ring plus a chain of three phosphates
      return (
        <>
          <path d="M9 9.5l5.6 3.2v6.6L9 22.5l-5.6-3.2v-6.6Z" fill={MARI} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="9" cy="16" r="1.5" fill="currentColor" />
          <path d="M14.6 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="22.4" cy="16" r="2.6" fill={MARI_HI} stroke="currentColor" strokeWidth="1.6" />
          <path d="M25 16h1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="28.4" cy="16" r="1.9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="1.8 1.6" />
          <path d="M20 4.5l-3 5h3.4l-2.4 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case 'spores':
      // three spores: warm (ignis), frost (cryo), marigold (lumin)
      return (
        <>
          <g stroke="currentColor" strokeWidth="1.8">
            <circle cx="10.5" cy="11" r="6.3" fill={WARM} fillOpacity=".78" />
            <circle cx="22" cy="11.5" r="5.3" fill={FROST} fillOpacity=".72" />
            <circle cx="16.4" cy="22.4" r="6.1" fill={MARI} />
          </g>
          <g fill="currentColor">
            <circle cx="10.5" cy="11" r="1.6" />
            <circle cx="22" cy="11.5" r="1.4" />
            <circle cx="16.4" cy="22.4" r="1.6" />
          </g>
          <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
            <path d="M4.6 6.6l-1.8-1.6M9 3.4V1.4" />
            <path d="M27.4 8.2l1.7-1.4M26 15.6l2.2.6" />
            <path d="M10.4 27.6l-1.6 1.7M22 27.4l1.4 1.5" />
          </g>
        </>
      );
    case 'enzymes':
      // lock and key: a cupped enzyme with a hexagonal substrate docking in the notch
      return (
        <>
          <path
            d="M10 4.4c-4 1.4-6.2 5-6 9.4.2 4.8 3.2 9.2 7.8 12.2 3.2 2 7.6 1.2 8.6-2.4.6-2.2-.4-3.6-2-4.6-1.8-1.1-2.7-2.2-2.7-3.6s.9-2.5 2.7-3.6c1.6-1 2.6-2.4 2-4.6-1-3.6-5.6-4.2-8.4-2.8Z"
            fill={MARI}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M7.4 11.5c.4 2.6 2 4.7 4.2 6" fill="none" stroke="currentColor" strokeWidth="1.1" strokeOpacity=".45" strokeLinecap="round" />
          <path d="M26 11.4l3.4 2v4l-3.4 2-3.4-2v-4Z" fill={MARI_HI} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </>
      );
    case 'elixir':
      // Erlenmeyer flask with a marigold liquid line and two bubbles
      return (
        <>
          <path d="M13 3.6h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path
            d="M13.6 3.8v7.4L5.2 25c-.9 1.6.2 3.6 2 3.6h17.6c1.8 0 2.9-2 2-3.6l-8.4-13.8V3.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d="M8.6 20.4h14.8l3.5 5.6c.5.9-.1 2-1.1 2H6.2c-1 0-1.6-1.1-1.1-2Z" fill={MARI} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="13.2" cy="24.2" r="1.3" fill="currentColor" />
          <circle cx="18.6" cy="22.7" r=".9" fill="currentColor" />
          <circle cx="17.6" cy="8.2" r="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </>
      );
    case 'near':
      return (
        <>
          <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M11.2 22.2V9.8l9.6 12.4V9.8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
  }
}

const LABELS: Record<IconName, string> = {
  snacc: '$SNACC coin',
  atp: 'ATP',
  spores: 'Spores',
  enzymes: 'Enzymes',
  elixir: 'Elixir',
  near: 'NEAR',
};

/** One icon of the Snacc set. Decorative unless `title` is given. */
export function Icon({ name, size = 24, title, ...rest }: SvgProps & { name: IconName; size?: number; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <Glyph name={name} />
    </svg>
  );
}

/** The bitten `$SNACC` coin. */
export function Coin({ size = 32, ...rest }: SvgProps & { size?: number }) {
  return <Icon name="snacc" size={size} title={LABELS.snacc} {...rest} />;
}

/** A row of the whole set with labels, for the home page and the "Concepts at a glance" tables. */
export function IconRow({ names = ICON_NAMES as readonly IconName[], size = 36 }: { names?: readonly IconName[]; size?: number }) {
  return (
    <ul className="sn-iconrow not-prose">
      {names.map((n) => (
        <li key={n}>
          <Icon name={n} size={size} />
          <span>{LABELS[n]}</span>
        </li>
      ))}
    </ul>
  );
}
