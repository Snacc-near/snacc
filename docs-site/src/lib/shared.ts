import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Snacc Docs';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

/** Public links used by the top bar, the home page and the "Edit on GitHub" link. */
export const gitConfig = {
  user: 'Snacc-near',
  repo: 'Snacc',
  branch: 'main',
  /** The docs site lives in this folder of the umbrella repo. */
  dir: 'docs-site',
};

export const links = {
  play: 'https://snacc-nu.vercel.app/app',
  landing: 'https://snacc-nu.vercel.app',
  github: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  org: `https://github.com/${gitConfig.user}`,
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
