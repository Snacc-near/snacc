import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Diagram } from './diagram';
import { Coin, Icon, IconRow } from './icons';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // ```pele fences compile to <Mermaid chart="..." /> (see source.config.ts)
    Mermaid: Diagram,
    Diagram,
    Icon,
    Coin,
    IconRow,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
