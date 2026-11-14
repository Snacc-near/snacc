'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import './figure.css';

export type FigureName = 'organism' | 'hatch' | 'crucible' | 'colony' | 'market';

/**
 * An interactive isometric figure, drawn by a self-contained page in /public/figures (built on the Colorfigures engine).
 *
 * - Light on the page: the figure is an <iframe loading="lazy">, so nothing of it is fetched or run until it nears the viewport,
 *   and none of its code is in the page bundle.
 * - The frame height follows the figure's own content (it is same-origin), so there is no inner scrollbar on a phone.
 * - The figure keeps its cream paper in both themes, like the hero drawing; the frame around it follows the theme.
 */
export function Figure({
  name,
  title,
  label,
  caption,
  tag = 'testnet',
}: {
  name: FigureName;
  title: string;
  label: string;
  caption?: string;
  tag?: string;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const watcher = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const src = `/figures/snacc-${name}.html`;

  const onLoad = useCallback(() => {
    const doc = frame.current?.contentDocument;
    if (!doc || !doc.body) return;
    watcher.current?.disconnect();
    const measure = () => setHeight(Math.ceil(doc.body.getBoundingClientRect().height) + 2);
    measure();
    watcher.current = new ResizeObserver(measure);
    watcher.current.observe(doc.body);
  }, []);

  useEffect(() => () => watcher.current?.disconnect(), []);

  return (
    <figure className="sn-fig not-prose">
      <div className="sn-win">
        <div className="sn-win__bar">
          <span className="sn-win__dots" aria-hidden="true" />
          <span>{label}</span>
          <span className="sn-win__tag">{tag}</span>
        </div>
        <div className="sn-fig__body">
          <iframe
            ref={frame}
            src={src}
            title={title}
            loading="lazy"
            onLoad={onLoad}
            className="sn-fig__frame"
            style={height ? { height } : undefined}
          />
        </div>
      </div>
      <figcaption className="sn-caption">
        {caption ? <>{caption} </> : null}
        <a href={src} target="_blank" rel="noreferrer noopener">
          Open full size
        </a>
        . Drag to turn it, use See-through and Labels, and zoom with the − / + chip.
      </figcaption>
    </figure>
  );
}
