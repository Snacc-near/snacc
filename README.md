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

## What's in the app

Status markers: **live** = present in the production build at snacc-nu.vercel.app (checked by fetching the deployed bundle on 2026-11-13). Live does not mean "exercised on chain": that is the last column. **built, enabling after database deploy** = the code is merged but the database it needs is not deployed, so it is not live.

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
| Player profiles with usernames, "Save progress" NEAR sign-in (NEP-413), achievements, feed streak, notifications, extra leaderboards, testnet starter pack | **built, enabling after database deploy** | none: needs the Supabase database and Edge Functions, which are not deployed yet |

The Supabase part lives in the `backend` repo under `supabase/` (migrations with row-level security, every table ending in `_snacc`, and the Edge Functions `near-auth`, `record-tx`, `notify-scan` and `starter-pack`). On 2026-11-13 the four function URLs answered HTTP 404, and the production build carries no Supabase configuration, so those features stay hidden. Nothing in this paragraph is a live claim.

### On-chain proof: the UI's transaction payloads

Four transactions to `snacc-v001.testnet` carrying exactly the arguments, attached NEAR and prepaid gas that the UI's call builders produce. **They were signed with the CLI using those payloads, not through the UI wallet flow.** Each hash was read back from the testnet RPC (`tx`, sender `snacc-v001.testnet`): final status `FINAL`, `SuccessValue`, no failed receipt.

| UI action | Payload sent (method, arguments, attached NEAR, gas) | What the chain recorded | Transaction |
| --- | --- | --- | --- |
| Hatch | `incubate_strain` `{"initial_snacc_stake":"250000000000000000000000","initial_spores":10,"role":"Extractor"}`, 0.25 NEAR, 100 TGas | `strain_created` for strain #10 | [`zx8ASZjoPypzWc9TwjUumKZWo8thNAoKTutpqyy3kVa`](https://testnet.nearblocks.io/txns/zx8ASZjoPypzWc9TwjUumKZWo8thNAoKTutpqyy3kVa) |
| Feed | `feed_strain` `{"amount":"50000000000000000000000","strain_id":10}`, 0 NEAR, 100 TGas | `fed` for strain #10 | [`EbYbVWzVDnTd5im3wf1TPVS5r4ff1GbZw2QFjTntoiZ3`](https://testnet.nearblocks.io/txns/EbYbVWzVDnTd5im3wf1TPVS5r4ff1GbZw2QFjTntoiZ3) |
| Allocate ATP | `allocate_atp` `{"lisosom":0,"mitokondria":1,"nukleus":1,"strain_id":10}`, 0 NEAR, 50 TGas | `atp_allocated` for strain #10 | [`2LnyPshQH5hqqiY9rERTeVCRWT9LkpEFd2kB1sEvZB3E`](https://testnet.nearblocks.io/txns/2LnyPshQH5hqqiY9rERTeVCRWT9LkpEFd2kB1sEvZB3E) |
| Divide | `divide_strain` `{"strain_id":10}`, 0 NEAR, 100 TGas | `strain_divided`: parent 10, child 11 | [`81vVZ5cu8ofeKtBB3WskHjjjWU8mmQQ9wxpAYb3hkZgi`](https://testnet.nearblocks.io/txns/81vVZ5cu8ofeKtBB3WskHjjjWU8mmQQ9wxpAYb3hkZgi) |

What this does and does not show: it shows the contract accepts the exact payloads the UI builds. It does not show that a browser wallet signed them. The other action builders have no such hash yet.

## Repo layout (owner decision 2026-11-06: `x207`-style polyrepo)

| Repo | Module | Contents |
| --- | --- | --- |
| `Snacc` (this umbrella) | — | Judge README, docs, demo orchestration, submission assets |
| `contracts` | `M1` + `M2` | The `snacc-v001.near` contract (Rust, `near-sdk 5.29.1`) |
| `oracle-tee` | `M3` | Dual-Layer Redaction + the `z-ai/glm-5.3-flash` client + the ed25519 verifier |
| `sdk` | `M4` | `lab-sdk`: Function Call Keys (0-popup) + `SnaccClient` |
| `backend` | `M5` | The `NEP-297` indexer + the `/api/crucible/*` API (read-only); `supabase/`: profile migrations and Edge Functions, **not deployed yet** |
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
