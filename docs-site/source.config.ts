import { defineConfig } from 'fumadocs-mdx/config';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';

// A fenced ```pele block becomes <Mermaid chart="..." />, which src/components/mdx.tsx maps to the
// themed <Diagram /> (pele renders Mermaid syntax to SVG on the server, see src/components/diagram.tsx).
export default defineConfig({
  mdxOptions: {
    remarkPlugins: [[remarkMdxMermaid, { lang: 'pele' }]],
  },
});
