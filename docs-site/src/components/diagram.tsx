import { render } from 'pele';

/**
 * A diagram from Mermaid-syntax source, rendered to inline SVG on the server by pele (https://pele.run).
 *
 * - No diagram code ships to the browser: the SVG is produced at build time.
 * - Colours and fonts come from the --pele-* CSS variables set in global.css, so the SVG follows the
 *   light and dark themes without being rendered again.
 * - Lazy: `.sn-diagram` uses `content-visibility: auto`, so the browser skips layout and paint of a
 *   diagram until it is scrolled near the viewport.
 * - A syntax error fails the build on purpose, so a broken diagram never ships.
 *
 * Use it from MDX either as a fenced block (```pele ... ```) or as <Diagram chart={`...`} title="..." />.
 */
export function Diagram({ chart, title }: { chart: string; title?: string }) {
  const { svg, width, height } = render(chart.trim());
  return (
    <figure className="sn-diagram not-prose">
      {title ? (
        <figcaption className="sn-diagram__bar">
          <span className="sn-diagram__dots" aria-hidden="true" />
          <span>{title}</span>
        </figcaption>
      ) : null}
      <div
        className="sn-diagram__body"
        style={{ maxWidth: Math.max(width + 28, 320), containIntrinsicSize: `auto ${Math.max(Math.round(height) + 36, 160)}px` }}
        // pele output of our own, trusted, build-time source
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  );
}
