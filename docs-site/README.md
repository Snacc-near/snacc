# Snacc docs site

The documentation site of [Snacc](https://github.com/Snacc-near/Snacc) (`$SNACC`, NFTs that eat a memecoin), built with [Fumadocs](https://fumadocs.dev) on Next.js. NEAR **testnet only**; `$SNACC` on testnet has no monetary value.

## Run it

```bash
cd docs-site
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run types:check  # next typegen + tsc
npm run check:diagrams
```

## Where things are

| Path | What it is |
| --- | --- |
| `content/docs/` | The pages, in MDX. `meta.json` sets the sidebar order |
| `source.config.ts` | MDX config. A fenced `pele` block becomes a themed diagram |
| `src/components/diagram.tsx` | The diagram component: pele renders Mermaid syntax to SVG on the server, no diagram code ships to the browser |
| `src/components/icons.tsx` | The Snacc icon set: `$SNACC` coin, ATP, spores, enzymes, elixir, NEAR |
| `src/app/global.css` | The Snacc theme (cream and amber paper, ink borders, keycap buttons), light and dark |
| `src/app/(home)` | The home page |
| `src/app/api/chat/route.ts` | The Ask AI assistant: retrieval over the docs, short answers, rate limits |
| `src/app/api/search/route.ts` | Search |
| `src/app/llms.txt`, `src/app/llms-full.txt` | The docs as plain text for language models |
| `src/app/figures/incubator/route.ts` | Serves `figures-src/incubator.svg` (a copy of the landing page figure) with its CSS variables resolved |

## Diagrams

Write a diagram as a fenced block. pele supports Mermaid syntax (flowchart, sequence, state and more). Put a comment above it naming the vault notes and code files it was checked against:

````mdx
{/* Diagram checked against: <notes>; code: <files> */}

```pele
flowchart LR
  A[Player] -->|feed_strain| B[Snacc]
```
````

A syntax error fails the build on purpose. `npm run check:diagrams` renders every block and lists pages without one.

## Ask AI (environment)

The assistant talks to any OpenAI-compatible provider. All settings are environment variables; with no key the chat panel says the assistant is not configured and `/api/chat` answers `503`.

| Variable | Meaning |
| --- | --- |
| `SNACC_DOCS_AI_API_KEY` | Provider key (falls back to `XKIRO_API_KEY`). Server side only; never prefix with `NEXT_PUBLIC_` |
| `SNACC_DOCS_AI_BASE_URL` | Provider base URL (default `https://api.xkiro.com/v1`) |
| `SNACC_DOCS_AI_MODEL` | Chat model ids, comma separated, tried in order |
| `SNACC_DOCS_ALLOWED_ORIGINS` | Extra origins allowed to call `/api/chat` (the same host is always allowed) |
| `NEXT_PUBLIC_SITE_URL` | Optional canonical site URL for metadata |
