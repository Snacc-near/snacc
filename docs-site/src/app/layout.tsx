import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './global.css';

// The same three bundled fonts as the Snacc landing page: DM Sans for text, JetBrains Mono for labels
// and code, Young Serif for display headings.
const sans = localFont({
  src: './fonts/dm-sans-latin.woff2',
  variable: '--font-dm-sans',
  weight: '400 800',
  display: 'swap',
});
const mono = localFont({
  src: './fonts/jetbrains-mono-latin.woff2',
  variable: '--font-jetbrains',
  weight: '400 700',
  display: 'swap',
});
const serif = localFont({
  src: './fonts/young-serif-latin.woff2',
  variable: '--font-young-serif',
  weight: '400',
  display: 'swap',
});

const siteTitle = 'Snacc docs: NFTs that eat a memecoin';
const siteDescription =
  'Docs of Snacc ($SNACC), an on-chain economy game on NEAR: living NFT organisms with a stomach, an inventory and a metabolism, a supply chain of NEP-245 molecules, an algorithmic central bank and secret AI verification in a TEE. NEAR testnet only.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snacc-docs.vercel.app'),
  title: { default: siteTitle, template: '%s | Snacc docs' },
  description: siteDescription,
  icons: { icon: '/brand/favicon-48.png' },
  openGraph: {
    type: 'website',
    siteName: 'Snacc docs',
    url: '/',
    title: siteTitle,
    description: siteDescription,
    images: [{ url: '/brand/og-image.png', width: 1200, height: 630, alt: 'Snacc: NFTs that eat a memecoin.' }],
  },
  twitter: { card: 'summary_large_image', title: siteTitle, description: siteDescription, images: ['/brand/og-image.png'] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#efefec' },
    { media: '(prefers-color-scheme: dark)', color: '#14120f' },
  ],
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider theme={{ defaultTheme: 'light' }}>{children}</RootProvider>
      </body>
    </html>
  );
}
