# Snacc — Polyrepo Umbrella

**Snacc ($SNACC): NFTs that eat a memecoin.** *Feed your Snacc or it gets snacked.*
One `Homunculus Strain` (`NEP-171`/`NEP-177`) has a `$SNACC` stomach + a `NEP-245` inventory, a `BMR` metabolism, and internal `$ATP` energy (non-transferable) allocated to organel slots every epoch; it can merge (`splice_strains`), be taken over while distressed, and be harvested by anyone once fainted — a multi-cell colony (`divide_strain`, `adopt` vs `snack`) running under natural population fences (`MAX_COLONY_SIZE = 5`, `MAX_GENERATION = 8`, `births ≤ merges + lyses`). Behind it: the reactive central bank `CrucibleTemp` (Fever burns 3.5% of fees / Hypothermia subsidizes 2%), 3 autonomous NPCs, and AI verification in `NEAR AI Cloud TEE` (`env::ed25519_verify` on-chain). `$SNACC` volatility is a playable feature — not a return promise.

## Play it

**[snacc-nu.vercel.app](https://snacc-nu.vercel.app)** is the landing page; the game is at **[snacc-nu.vercel.app/app](https://snacc-nu.vercel.app/app)**. NEAR **testnet only**; `$SNACC` testnet has no monetary value.

What you can do in 60 seconds:

1. **No wallet (demo mode, the default).** Open `/app`: it starts in `demo · simulated`. Tap a cell on the Colony Plate, watch the Cell Lab bio-reactor open, press a keycap. The numbers come from a local simulation and are labelled as such.
2. **No wallet (live read mode).** Switch the mode to `live testnet`: the strains, the `CrucibleTemp` reading and the Great Feast board come from `snacc-v001.testnet` through the read-only backend and contract views. Where the chain gives no value the UI shows `—`, never an invented number.
3. **With a wallet or an email (live mode, signed transactions).** Press `connect wallet` and pick a NEAR testnet wallet from the NEAR Connect list (for example Meteor or Intear), or use email or social login (Privy). A new account needs testnet NEAR first: use the [NEAR testnet faucet](https://docs.near.org/getting-started/faucet). Then hatch a Snacc, feed it and use the other actions listed below. Your first signed action also registers your account with the contract (`storage_deposit`).

Honest status of step 3: the payloads the UI sends for hatch, feed, allocate ATP and divide were accepted by the contract on testnet (see [On-chain proof](#on-chain-proof-the-uis-transaction-payloads)), but those four transactions were signed with the CLI, not through the UI wallet flow. **The UI wallet flow itself has not been exercised on chain yet.**

Optional **one-tap play** (Settings → One-tap play): the wallet adds one restricted access key once, and eight deposit-free game actions then go out without a wallet popup each time. Hatching and every action that attaches NEAR still open the wallet. Details and what is not verified are in the table below.

## What's in the app

Status markers:

- **live** = present in the production build at snacc-nu.vercel.app. Checked by fetching the deployed bundle and all 39 of its JavaScript chunks and searching them for each feature (2026-11-13 and 2026-11-14), plus read-only checks that the Supabase Edge Function URLs answer and that the share-preview endpoints return an image.
- **live, opt-in** = live, and each player switches it on.
- **deployed, not enabled** = the code is in the production build or backend, but a secret or key is not configured, so it does nothing yet.
- **not live** = merged in the repos, but a deployment step is still missing.

Live in the build does not mean "exercised on chain" or "tried with a real wallet": that is the last column.

| Feature | Status | On-chain evidence |
| --- | --- | --- |
| Landing page `/` (scroll story through the incubator, live testnet gallery) | live | reads only |
| Game `/app`: isometric Colony Plate arena, Cell Lab, `demo · simulated` mode | live | none needed (simulation) |
| `live testnet` mode: strains, macro state, Great Feast, NPC quotes from contract views and the read-only backend | live | reads only |
| Wallet login with NEAR Connect (testnet); account chip with NEAR and `$SNACC` balances; automatic `storage_deposit` on the first signed call | live | UI wallet flow not yet exercised on chain |
| Optional email or social login (Privy); a Privy account starts with 0 NEAR | live (enabled in the production build) | not yet exercised on chain |
| Game actions from the UI: hatch (`incubate_strain`), feed, `allocate_atp`, divide | live | payloads accepted on chain, signed with the CLI (table below) |
| Game actions from the UI: splice, extract / transmute / synthesize, `npc_buy_spores`, adopt / takeover / harvest, claim dividend, redeem aether, gift (`nft_transfer`), send (`ft_transfer`) | live | no UI-payload hash yet; the contract methods themselves are covered by the gladi evidence below |
| Transaction status with explorer links and plain-English contract errors | live | follows the actions above |
| My collection; first-run intro, How to play, Settings; PWA manifest | live | reads only |
| Terms, Privacy, 404; public pages `/p/<account>` and `/snacc/<id>` (Snaccs and on-chain SVG read from the contract) | live | reads only |
| One-tap play (Settings → One-tap play): the wallet adds ONE function-call access key to your account (gas allowance 0.25 NEAR, may call only `snacc-v001.testnet`, only the 8 deposit-free game methods `allocate_atp`, `claim_industrial_dividend`, `divide_strain`, `feed_strain`, `harvest_starving_strain`, `npc_buy_spores`, `splice_strains`, `synthesize_and_redeem_aether`). Those actions are then signed in the browser with Web Crypto (the private key is a non-extractable key in IndexedDB, with a localStorage fallback). **Still the wallet:** every action that attaches NEAR (hatch = `incubate_strain`, storage deposit, catalyst fees, NEP-141/NEP-171 transfers, market calls), and `adopt` and `hostile_takeover_splice`, which pay another player. If one-tap cannot be used, the action falls back to one wallet popup and is never sent twice. Hatching without any NEAR (a relayer or meta-transactions) is post-hackathon work and is not built | live, opt-in | **Not verified:** no one-tap transaction has been sent on testnet yet; no real wallet has been seen accepting the `AddKey`. Covered by unit tests with a fake RPC and a fake wallet only. See [`docs/nep611-signless.md`](docs/nep611-signless.md) |
| Market window (toolbar `market`): browse, sell and my listings for the testnet marketplace contract `snacc-market.testnet` (0% fee, the listed Snacc is held in escrow, testnet NEAR only) | live | The contract itself was exercised on chain with CLI-signed transactions (table below). **Not verified:** the market from the UI with a real wallet |
| Player profiles with usernames; "Save progress" NEAR sign-in (NEP-413); achievements; feed streaks; in-app notifications; extra leaderboards | live (Supabase) | off-chain data, so no chain hash applies. A full sign-in with a real wallet is not verified here |
| Daily quests with XP and levels; weekly leaderboard seasons with a hall of fame | live (Supabase) | off-chain data |
| Snacc detail view: lineage tree and feed history; graveyard of dead / snacked Snaccs (who, when, why) | live | reads only |
| Share previews: `/snacc/<id>` and `/p/<account>` answer link-preview crawlers with an `og:image` PNG rendered from the on-chain SVG | live | reads only. Checked 2026-11-14: a crawler request for `/snacc/11` returns an `og:image` that points to `/api/og/snacc/11`, and that URL returns `image/png` |
| Invite links `?ref=<account>`; the inviter gets a cosmetic "Recruiter" badge when a friend hatches (no token, no XP) | live | off-chain data |
| Urgent "about to be snacked" alert with a direct feed button | live | reads only; the feed button is the normal feed action |
| Web Push on this device (service worker `sw.js`, opt-in toggle in Settings) | live, opt-in | **Not verified:** real push delivery to a device |
| Name moderation and admin announcements | live | off-chain data |
| Usage and error telemetry: first-party, goes through the Supabase Edge Function `track`, respects opt-out and Do Not Track | live | off-chain data |
| "Download my data" (JSON export) in Settings | live | off-chain data |
| Testnet starter pack | **deployed, not enabled** | The `starter-pack` function is deployed, but its faucet account secret is not configured, so it answers `not_configured`. Nothing is sent to anyone |
| Optional Cloudflare Turnstile check on the starter-pack claim | **deployed, not enabled** | Inactive until the owner sets the Turnstile keys |
| Account deletion (a "Delete my profile" button) | **not live** | Its database migration is not applied yet. The Terms and Privacy text that mentions the button is ahead of what works |

The Supabase part lives in the `backend` repo under `supabase/`: migrations with row-level security (every table ends in `_snacc`) and eight Edge Functions, `near-auth`, `record-tx`, `notify-scan`, `starter-pack`, `track`, `chain-index`, `push` and `push-dispatch`. It **is deployed**: the production build carries the Supabase project URL and its publishable key (public by design; row-level security guards the data), and on 2026-11-14 a read-only CORS preflight to each function URL got a non-404 answer. Scheduled database jobs run `notify-scan` and `chain-index` every 10 minutes and `push-dispatch` every minute. Two things in this part are **not** active: the starter pack (no faucet secret yet) and account deletion (migration not applied yet). Nothing in this part is on-chain evidence: it stores profile data off-chain and does not change what the contract proves.

### On-chain proof: the UI's transaction payloads

Four transactions to `snacc-v001.testnet` carrying exactly the arguments, attached NEAR and prepaid gas that the UI's call builders produce. **They were signed with the CLI using those payloads, not through the UI wallet flow.** Each hash was read back from the testnet RPC (`tx`, sender `snacc-v001.testnet`): final status `FINAL`, `SuccessValue`, no failed receipt.

| UI action | Payload sent (method, arguments, attached NEAR, gas) | What the chain recorded | Transaction |
| --- | --- | --- | --- |
| Hatch | `incubate_strain` `{"initial_snacc_stake":"250000000000000000000000","initial_spores":10,"role":"Extractor"}`, 0.25 NEAR, 100 TGas | `strain_created` for strain #10 | [`zx8ASZjoPypzWc9TwjUumKZWo8thNAoKTutpqyy3kVa`](https://testnet.nearblocks.io/txns/zx8ASZjoPypzWc9TwjUumKZWo8thNAoKTutpqyy3kVa) |
| Feed | `feed_strain` `{"amount":"50000000000000000000000","strain_id":10}`, 0 NEAR, 100 TGas | `fed` for strain #10 | [`EbYbVWzVDnTd5im3wf1TPVS5r4ff1GbZw2QFjTntoiZ3`](https://testnet.nearblocks.io/txns/EbYbVWzVDnTd5im3wf1TPVS5r4ff1GbZw2QFjTntoiZ3) |
| Allocate ATP | `allocate_atp` `{"lisosom":0,"mitokondria":1,"nukleus":1,"strain_id":10}`, 0 NEAR, 50 TGas | `atp_allocated` for strain #10 | [`2LnyPshQH5hqqiY9rERTeVCRWT9LkpEFd2kB1sEvZB3E`](https://testnet.nearblocks.io/txns/2LnyPshQH5hqqiY9rERTeVCRWT9LkpEFd2kB1sEvZB3E) |
| Divide | `divide_strain` `{"strain_id":10}`, 0 NEAR, 100 TGas | `strain_divided`: parent 10, child 11 | [`81vVZ5cu8ofeKtBB3WskHjjjWU8mmQQ9wxpAYb3hkZgi`](https://testnet.nearblocks.io/txns/81vVZ5cu8ofeKtBB3WskHjjjWU8mmQQ9wxpAYb3hkZgi) |

What this does and does not show: it shows the contract accepts the exact payloads the UI builds. It does not show that a browser wallet signed them. The other action builders have no such hash yet.

### On-chain proof: the market contract

The marketplace contract `snacc-market.testnet` (the `contracts` repo, `market/` crate) was deployed on testnet, and `snacc-v001.testnet` got a code upgrade that adds the NEP-171 `nft_transfer_call` the market needs. A list, delist and buy run on strain 11 was then done with transactions **signed with the CLI, not through the UI**. Each hash below was read back from the testnet RPC on 2026-11-14: final status `FINAL`, no failed receipt. Testnet NEAR has no monetary value.

| Step | What the chain recorded | Transaction |
| --- | --- | --- |
| Deploy and `new` of the market contract | `DeployContract` + `new`, on `snacc-market.testnet` | [`BTymNHdjr5D746phRx3H2BQn3zG5bzDGdKpv8BujcGMz`](https://testnet.nearblocks.io/txns/BTymNHdjr5D746phRx3H2BQn3zG5bzDGdKpv8BujcGMz) |
| Code upgrade of the Snacc contract | `DeployContract` on `snacc-v001.testnet` (adds `nft_transfer_call`) | [`8ydFE4XjpwYbnrPUULjvtbqbqwU4PYSJ3rJyyVimu4TL`](https://testnet.nearblocks.io/txns/8ydFE4XjpwYbnrPUULjvtbqbqwU4PYSJ3rJyyVimu4TL) |
| List strain 11 | `nft_transfer_call` to `snacc-market.testnet` with price 0.1 NEAR; events `nft_transfer` and `listed` | [`6JF7XvVDJhxax2hxXF57WuzH1JrSkaz12TRPzmegTPwN`](https://testnet.nearblocks.io/txns/6JF7XvVDJhxax2hxXF57WuzH1JrSkaz12TRPzmegTPwN) |
| Delist strain 11 | `delist` by the seller (1 yoctoNEAR); events `nft_transfer` back and `delisted` | [`8Q3p33jwX8sfugNy5eMQ64aZJoUydm8kCrUJMXxHZv41`](https://testnet.nearblocks.io/txns/8Q3p33jwX8sfugNy5eMQ64aZJoUydm8kCrUJMXxHZv41) |
| Buy strain 11 | `buy` by `snacc-starter.testnet` attaching 0.1 NEAR; events `nft_transfer` to the buyer and `sold` | [`86HXrAAQ3WTpBYTBwAJ3yeNbUev9ttdLRvFUpDZ8VkAd`](https://testnet.nearblocks.io/txns/86HXrAAQ3WTpBYTBwAJ3yeNbUev9ttdLRvFUpDZ8VkAd) |

What this does and does not show: it shows the market contract and the upgraded Snacc contract work together on testnet. The run also listed the strain a second time and moved it back; those two hashes are not cited here. It does **not** show that the UI's Market window works with a real wallet. Because of the upgrade, the code on `snacc-v001.testnet` is no longer the build that `evidence/snacc.wasm` and the gladi evidence below describe: the live on-chain `code_hash` `4m2z2PiZTa1mSG5A8cnr5b9fxDWY4n3HiPGzcP7EtwiH` (read from the RPC on 2026-11-14) differs from the `code_hash` `DMRgsiLJy74V5RS8txLHeJL3T97ivLHuEtY56sSCYmcr` that `evidence/snacc.wasm` hashes to.

## Repo layout (owner decision 2026-11-06: `x207`-style polyrepo)

| Repo | Module | Contents |
| --- | --- | --- |
| `Snacc` (this umbrella) | — | Judge README, docs, demo orchestration, submission assets |
| `contracts` | `M1` + `M2` | The `snacc-v001.near` contract (Rust, `near-sdk 5.29.1`) + the testnet marketplace crate `market/` (`snacc-market.testnet`) |
| `oracle-tee` | `M3` | Dual-Layer Redaction + the `z-ai/glm-5.3-flash` client + the ed25519 verifier |
| `sdk` | `M4` | `lab-sdk`: Function Call Keys (`SessionKeyManager`, deposit-free methods only) + `SnaccClient` |
| `backend` | `M5` | The `NEP-297` indexer + the `/api/crucible/*` API (read-only); `supabase/`: the profile migrations and eight Edge Functions, **deployed** (the starter pack and account deletion are not active yet, see [What's in the app](#whats-in-the-app)) |
| `frontend` | `M6` | the landing page (scroll story through the incubator, live testnet gallery) and the cell-cultivation game (isometric Colony Plate arena + Cell Lab bio-reactor + tool windows, NEAR wallet login and signed game actions on testnet) — live at [snacc-nu.vercel.app](https://snacc-nu.vercel.app), game at [`/app`](https://snacc-nu.vercel.app/app) |
| `scripts` | `M7` | `verify:thesis`, `demo:replay`, `gladi:retry`, economic simulations |

**Play in the browser:** see [Play it](#play-it) above — `demo · simulated` with no wallet, `live testnet` reads without a wallet, and wallet or email login for signed testnet transactions.

## Quick start (judges: Node.js 22+, no keys, no `npm install`)

```bash
git clone https://github.com/Snacc-near/snacc.git && cd snacc
git clone https://github.com/Snacc-near/scripts.git scripts
npm run demo:replay      # offline replay from the committed evidence in evidence/
npm run verify:thesis    # falsifiers F-01..F-03
```

Contract: clone the `contracts` repo, then `cargo test`. Evidence per claim: [`docs/evidence-pack.md`](docs/evidence-pack.md) · submission summary: [`HACKATHON.md`](HACKATHON.md).

## Live evidence (testnet `snacc-v001.testnet`)

Point-in-time transactions from the committed gladi run — full hashes copied from [`evidence/gladi-manifest.json`](evidence/gladi-manifest.json) / [`docs/evidence-pack.md`](docs/evidence-pack.md), auto-checked in [`evidence/gladi-kpi.md`](evidence/gladi-kpi.md) (22 KPI rows). `$SNACC` testnet has no monetary value; no hash means no live claim.

| What | Transaction (NearBlocks testnet explorer) |
| --- | --- |
| Contract deploy + state migration | [6ky2mYRK…](https://testnet.nearblocks.io/txns/6ky2mYRKE15gv7FrThSsuuQBNfXpNCGPZT1iywybPfd) · [CYfbeyVw…](https://testnet.nearblocks.io/txns/CYfbeyVwWwvqGUBbt63W9wbfV3JTJM9seTbky3QgiPFf) |
| G-07 hostile takeover (115% + nonce guard) | [FArXv6FT…](https://testnet.nearblocks.io/txns/FArXv6FTka21NjbCqo8gKaXXC6Gqzway7c7ppDgcbgFY) |
| G-08 `adopt` (book value to the old owner) | [7uWckTNX…](https://testnet.nearblocks.io/txns/7uWckTNXSQx86f1Zwau6ehJXLZqCsjwkLBJocjsQNmRp) |
| G-10 lysis + 10% bounty | [Ce5aRBZ7…](https://testnet.nearblocks.io/txns/Ce5aRBZ7ES45YUukTxL2kFTDdT2qpxrSsFAx4UzY5owW) |
| G-11 dividend claim | [7J8X3ASJ…](https://testnet.nearblocks.io/txns/7J8X3ASJQFkUbUZFzWps5d5yjbybhgj5CY8Vat2TmSQY) |
| TEE commit → apply (on-chain `env::ed25519_verify`) | [FnJmzrT4…](https://testnet.nearblocks.io/txns/FnJmzrT4Z5AqdWMnVhumBKxPEUg64Azg2EUzGGYNb2tT) → [6s7UFfjd…](https://testnet.nearblocks.io/txns/6s7UFfjd8XBPZ6b9FK4tzGhEo6kstAVeNMCpdwAT9FCN) |
| Vault sub-account materialize | [G2zaGz4E…](https://testnet.nearblocks.io/txns/G2zaGz4E3gLqyofxZNqXENu4WrcYxUrqVeW8dCgpwJEN) |

## Source of design truth

The `snacc-vault/` vault — start from [[Snacc Hub]]. Numbers follow the **Kamus Angka Resmi** ([[Snacc - Model Data]]). Backlog & execution order: [[Snacc - Backlog Master]] (±300 items).

**Partner onboarding (standalone, no links):** [`docs/partner-onboarding.md`](docs/partner-onboarding.md) — an end-to-end Snacc summary for outside parties.

**Launch checklist (RES-124 / RES-109):** [`docs/launch-checklist.md`](docs/launch-checklist.md) — the Meme.Cooking flow, pre-launch gates, the owner-decision liquidity parameters, and the testnet mock steps (documents only; no launch has been executed).

**Docs set:** [`docs/glossary.md`](docs/glossary.md) · [`docs/quickstart.md`](docs/quickstart.md) · [`docs/econ-incentives.md`](docs/econ-incentives.md) · [`docs/econ-falsifiers.md`](docs/econ-falsifiers.md) · [`docs/demo-walkthrough.md`](docs/demo-walkthrough.md) · [`docs/demo-evidence-pack.md`](docs/demo-evidence-pack.md) · [`docs/shade-agents-npc.md`](docs/shade-agents-npc.md) · [`docs/mintbase-listing-checklist.md`](docs/mintbase-listing-checklist.md) · [`docs/roadmap-post-hackathon.md`](docs/roadmap-post-hackathon.md) · [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) · [`docs/post-mortem-draft.md`](docs/post-mortem-draft.md) · replay: [`evidence/demo-replay.md`](evidence/demo-replay.md)

**Honesty rules:** no testnet hash means no live claim; profit = work + redistribution (the Industrial Dividend Pool), no profit guarantee; `$SNACC` testnet has no monetary value.
