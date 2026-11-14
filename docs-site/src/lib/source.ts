import { llms, loader } from 'fumadocs-core/source';
import type { LoaderPlugin } from 'fumadocs-core/source';
import { icons as lucideIcons } from 'lucide-react';
import { createElement } from 'react';
import { docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { Icon, isIconName } from '@/components/icons';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

/**
 * Sidebar icons: the Snacc set first (`snacc`, `atp`, `spores`, `enzymes`, `elixir`, `near`),
 * then any Lucide icon name. Same shape as Fumadocs' own icon plugin.
 */
function resolveIcon(name: string | undefined) {
  if (name === undefined) return undefined;
  if (isIconName(name)) return createElement(Icon, { name, size: 16 });
  const Lucide = lucideIcons[name as keyof typeof lucideIcons];
  if (!Lucide) {
    console.warn(`[snacc-icons] Unknown icon: ${name}`);
    return undefined;
  }
  return createElement(Lucide);
}

const snaccIcons: LoaderPlugin = {
  name: 'snacc:icons',
  transformPageTree: {
    file(node) {
      if (node.icon === undefined || typeof node.icon === 'string') node.icon = resolveIcon(node.icon as string | undefined);
      return node;
    },
    folder(node) {
      if (node.icon === undefined || typeof node.icon === 'string') node.icon = resolveIcon(node.icon as string | undefined);
      return node;
    },
    separator(node) {
      if (node.icon === undefined || typeof node.icon === 'string') node.icon = resolveIcon(node.icon as string | undefined);
      return node;
    },
  },
};

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [snaccIcons],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
