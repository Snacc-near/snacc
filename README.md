# Snacc — a memecoin with a metabolism

*NFTs that eat a memecoin. Feed your Snacc or it gets snacked.* This is the umbrella repo of the Snacc polyrepo: judge README, docs, evidence and demo orchestration.

We did not paint biology on a memecoin; the constants are the biology. Each Snacc is a `NEP-171`/`NEP-177` NFT that holds its own `$SNACC` balance and inventory, has to be fed to stay alive, and can be harvested by anyone once it has fainted. Each row ties a law of cell biology to a method or constant of `snacc-v001.testnet` and to a transaction you can open (full hashes, caveats and what is not proven: [Live evidence](#live-evidence-testnet)):

| # | Law of the cell | In the contract (method / constant) | Proof (transaction) |
| --- | --- | --- | --- |
| L1 | Cytoplasm: a cell has its own contents | each NFT holds `$SNACC` and an inventory; hatching (`incubate_strain`) sends 20% of the stake to The Pantry (`STAKE_TREASURY_BPS 2000`) | [`5JCAmSL7…`](https://testnet.nearblocks.io/txns/5JCAmSL7pLTV8mShrNuEtG5WLPkCqKkYCZBf5WGtQ2wY) |
| L2 | Nutrient uptake → ATP | `feed_strain` → event `atp_minted` | [`4hnA4pEU…`](https://testnet.nearblocks.io/txns/4hnA4pEUqghdtN8WycJJXCnSYQSEZ9F5DQamAuEub3GF) |
| L3 | Basal metabolic rate | `bmr_per_hour` 100 / 120 / 150; Fed (> 20%) → Starving → Fainted, computed from block time, no keeper | sandbox clock: aging was compressed with `advance_sandbox_clock`, [`8YcqqVK3…`](https://testnet.nearblocks.io/txns/8YcqqVK35ubGVZLb1qj8ZLaqS6La7bAcGCafg3ohvuFA) |
| L4 | Organelles | `allocate_atp`: mitochondria +10% ATP, nucleus +10% output, lysosome −10% BMR per level, level ≤ 5 ([`docs/organel-effects.md`](docs/organel-effects.md)) | the allocation call is accepted on chain: [`2LnyPshQ…`](https://testnet.nearblocks.io/txns/2LnyPshQH5hqqiY9rERTeVCRWT9LkpEFd2kB1sEvZB3E); the effect formulas are unit tests |
| L5 | Quorum sensing: the colony senses its own activity | `CrucibleTemp = 1000 × V_decayed / supply`; Feeding Frenzy (`FEVER`) above 610 mK burns 350 bps of fees; Famine Relief (`HYPO`) below 600 mK pays 200 bps back, capped at 500 bps per epoch; no admin withdrawal | [`CfBR8pFN…`](https://testnet.nearblocks.io/txns/CfBR8pFNCGAjCAX21pSMQY9rdjQ2cVKonkzacFjmZpM8): `zone_changed` HYPO → FEVER at 916 mK. Sandbox: the heating fee was paid by the contract to itself. Reading on 2026-11-14: 960 mK |
| L6 | Lysis + nutrient release | `harvest_starving_strain`: 10% to the caller, 90% to The Pantry (`LIQUIDATOR_BOUNTY_BPS 1000`), then `nutrient_burst_released` (360 bps) | [`AhEk4TNN…`](https://testnet.nearblocks.io/txns/AhEk4TNNeTj4orchvXSuPood8vAxTiQNWhZZwSdD9JH9); the caller was the lab's own account |
| L7 | Paid phagocytosis / adoption | `hostile_takeover_splice` at book value + 15% (95% to the old owner, 5% to The Pantry); `adopt` at book value | takeover [`4o4qwoGZ…`](https://testnet.nearblocks.io/txns/4o4qwoGZtR7HE5E3VnjQZpXwDicpa9QVBzXHS1YP2v4f), signed by `x207-demo-buyer.testnet` (see [Disclosure](#disclosure-accounts-used-in-the-rehearsal)); adopt [`7w3tBNjL…`](https://testnet.nearblocks.io/txns/7w3tBNjLYFXKiUdmXtH1LhponGr6yhu1Q22xCFdLzo34) |
| L8 | Endosymbiosis: one cell absorbs another | `splice_strains`: `role_mask` of both combined (up to `0b111`), +800 bps efficiency, BMR × 0.85, 2.5% merger tax | [`4ABtdBdj…`](https://testnet.nearblocks.io/txns/4ABtdBdjYkynQXXMsYD8ZKUwMtNAWX1wgEpREsX3i4nH). The BMR effect comes from contract code and GLADI-7 evidence, not re-derived from this run |
| L9 | Mitosis, Hayflick limit, contact inhibition | `divide_strain`; `MAX_GENERATION 8`, `MAX_COLONY_SIZE 5`; a divide is allowed only while `total_divides ≤ total_mergers + total_lyses` | [`GVwhXD6k…`](https://testnet.nearblocks.io/txns/GVwhXD6kYyb9qDe2nDZMB6RUgsK5FqqTN51kVuYgnYWf) (parent 1 → child 6); the caps are unit tests |
| L10 | Genotype → phenotype | NEAR AI Cloud (`z-ai/glm-5.3-flash`) proposes a genome change; `apply_tee_mutation_zero_trust` recomputes `env::sha256` and runs `env::ed25519_verify` before anything changes (±1500 bps cap); the contract draws the NFT image (on-chain SVG) | [`B8xdaukd…`](https://testnet.nearblocks.io/txns/B8xdaukdnf3Fh9ZkMNfXxXW7TrHVLZLeXQNdYyBtD2AG): signature verified on chain; enclave attestation: **not yet verified** |
| L11 | Conservation of mass | `ft_total_supply` = minted − burned; `get_global_solvency` drift 0 | view calls and `npm run verify:thesis` (F-02) |

*sandbox* = a real testnet transaction with a caveat (sandbox clock, self-funded fee, one epoch). A row without a hash is a view call or a unit test, not a live transaction.

## Status, 2026-11-14

NEAR **testnet only** (nothing is on mainnet) · tracks `memecoins` + `nfts` · contract `snacc-v001.testnet` · 51 rehearsal transactions and 22/22 rehearsal checks, with their [claim limits](#claim-limits-read-before-the-numbers) · `$SNACC` testnet has no monetary value · no testnet hash means no live claim. Full evidence, deployment status and what is **not yet** done: [Live evidence](#live-evidence-testnet).

## How it fits together

One `Homunculus Strain` (`NEP-171`/`NEP-177`) has a `$SNACC` stomach and an internal inventory (a `NEP-245`-style data model: there is no public `mt_*` interface), a `BMR` metabolism, and internal `$ATP` energy (non-transferable) allocated to organelle slots every epoch. It can merge (`splice_strains`), be taken over while distressed (`hostile_takeover_splice`), be adopted (`adopt`), and be harvested by anyone once it has fainted (`harvest_starving_strain`; "snack it" in the UI is that method, there is no method named `snack`). It can divide (`divide_strain`) into a multi-cell colony under population fences (`MAX_COLONY_SIZE = 5`, `MAX_GENERATION = 8`, births ≤ merges + lyses). Behind it: the reactive central bank `CrucibleTemp` (above 610 mK a Feeding Frenzy burns 3.5% of fees; below 600 mK Famine Relief pays 2% back from The Pantry, capped at 5% per epoch), three on-chain NPC merchants (deterministic price curves that quote and fill only when a player calls; they are not AI agents), and an AI diet plan from `NEAR AI Cloud` whose signature the contract verifies on chain (`env::ed25519_verify`; enclave attestation is not yet verified). `$SNACC` volatility is a playable feature, not a return promise.

## Play it

**[snacc-nu.vercel.app](https://snacc-nu.vercel.app)** is the landing page; the game is at **[snacc-nu.vercel.app/app](https://snacc-nu.vercel.app/app)**. NEAR **testnet only**; `$SNACC` testnet has no monetary value. The landing page reads live testnet data (read-only). The game opens in `demo · simulated` (numbers from local constants, not the chain) and has a `live testnet` toggle. No transaction has been signed from the UI wallet flow yet (see step 3 below).

**Docs:** [snacc-docs.vercel.app](https://snacc-docs.vercel.app) explains the organism, the economy, the contract methods, the SDK and the backend API, with diagrams on every page.

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
| `contracts` | `M1` + `M2` | The `snacc-v001.testnet` contract (Rust, `near-sdk 5.29.1`) + the testnet marketplace crate `market/` (`snacc-market.testnet`) |
| `oracle-tee` | `M3` | Layer-1 local redaction + the `z-ai/glm-5.3-flash` client + the ed25519 verifier. Layer-2 cloud redaction does **not** run: `/v1/privacy/redact` answers 404 for `z-ai/glm-5.3-flash` (`docs/architecture.md`) |
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

## Live evidence (testnet)

Point-in-time transactions from the committed **GLADI-8** rehearsal run (2026-11-09, contract `snacc-v001.testnet`). Full hashes are copied from [`evidence/gladi-manifest.json`](evidence/gladi-manifest.json) (51 hashed transactions) and auto-checked in [`evidence/gladi-kpi.md`](evidence/gladi-kpi.md): **22 PASS · 0 FAIL · 0 not run (22 KPI rows)**, with the claim limits below. All 51 were read back as `SuccessValue` from the archival RPC `https://archival-rpc.testnet.fastnear.com` on 2026-11-14 (`rpc.testnet.near.org` is deprecated, and non-archival nodes have dropped these transactions). On 2026-11-14 `npm run verify:thesis` came back with none of the three falsifiers (F-01..F-03) triggered, and `npm run demo:replay` replayed the 51 transactions in 14 beats, both without a key. `$SNACC` testnet has no monetary value; no hash means no live claim.

| What | Transaction (NearBlocks testnet explorer) |
| --- | --- |
| GLADI-8 deploy + `migrate` (2026-11-09) | [BF3MfUnp…](https://testnet.nearblocks.io/txns/BF3MfUnpCtcqqXfBWnusDixvHHENBX2FrUHVhbEZQM7V) · [G4fLRtP7…](https://testnet.nearblocks.io/txns/G4fLRtP7RiPAWueNqHkgkao7NJKAmF3WtLks9jFwmF25) |
| Code upgrade without `migrate` (2026-11-13) | [8ydFE4Xj…](https://testnet.nearblocks.io/txns/8ydFE4XjpwYbnrPUULjvtbqbqwU4PYSJ3rJyyVimu4TL) |
| G-01 hatch (`incubate_strain`, `ft_mint` + `strain_created`) | [5JCAmSL7…](https://testnet.nearblocks.io/txns/5JCAmSL7pLTV8mShrNuEtG5WLPkCqKkYCZBf5WGtQ2wY) |
| G-03 feed (`atp_minted`) | [4hnA4pEU…](https://testnet.nearblocks.io/txns/4hnA4pEUqghdtN8WycJJXCnSYQSEZ9F5DQamAuEub3GF) |
| G-06 splice (`splice_strains`, 2.5% merger tax) | [4ABtdBdj…](https://testnet.nearblocks.io/txns/4ABtdBdjYkynQXXMsYD8ZKUwMtNAWX1wgEpREsX3i4nH) |
| G-07 hostile takeover (115% + nonce guard); signer `x207-demo-buyer.testnet` | [4o4qwoGZ…](https://testnet.nearblocks.io/txns/4o4qwoGZtR7HE5E3VnjQZpXwDicpa9QVBzXHS1YP2v4f) |
| G-08 `adopt` (book value to the old owner) | [7w3tBNjL…](https://testnet.nearblocks.io/txns/7w3tBNjLYFXKiUdmXtH1LhponGr6yhu1Q22xCFdLzo34) |
| G-09 divide (`divide_strain`) | [GVwhXD6k…](https://testnet.nearblocks.io/txns/GVwhXD6kYyb9qDe2nDZMB6RUgsK5FqqTN51kVuYgnYWf) |
| G-10 lysis + 10% bounty + Nutrient Burst | [AhEk4TNN…](https://testnet.nearblocks.io/txns/AhEk4TNNeTj4orchvXSuPood8vAxTiQNWhZZwSdD9JH9) |
| G-11 / G-19 dividend: contribute (`synthesize_and_redeem_aether`) → close epoch (`advance_epoch`) → claim (one epoch, one contributor, sandbox clock) | [GfqatLA7…](https://testnet.nearblocks.io/txns/GfqatLA7TMR9mGBsA4Fo9Z76dHWTKABJhu4v6nVCmXzG) → [9F4KGd9b…](https://testnet.nearblocks.io/txns/9F4KGd9bZXwtQEpvJGQYcx2Vz7fsa9LbyyTySxYhfLjW) → [6hPrMTJu…](https://testnet.nearblocks.io/txns/6hPrMTJubZTcRATiGQxYZNxcL4WGXA3KVpgHqtvoBWFq) |
| G-12 thermostat: `zone_changed` HYPO → FEVER at 916 mK (sandbox, self-funded heating fee) | [CfBR8pFN…](https://testnet.nearblocks.io/txns/CfBR8pFNCGAjCAX21pSMQY9rdjQ2cVKonkzacFjmZpM8) |
| G-15 `nft_transfer` of strain 4 (balance and organelles move with it) | [HfhZG6sA…](https://testnet.nearblocks.io/txns/HfhZG6sAdqpKRSJsYRagD9mapCq7JrJvPthkUxFUZQQn) |
| G-05 TEE: register signer → commit → apply (on-chain `env::ed25519_verify`, see [TEE](#tee-what-the-chain-and-the-vector-file-each-hold)) | [BovEAtK5…](https://testnet.nearblocks.io/txns/BovEAtK5gUZ6dthCX5Cn6qHnmZZ9bhtSTpGuYXRqYgfw) → [EnXBEETd…](https://testnet.nearblocks.io/txns/EnXBEETdyG4TcjmrzGgJxzczGcxMshXZuEBorG8yHwDC) → [B8xdaukd…](https://testnet.nearblocks.io/txns/B8xdaukdnf3Fh9ZkMNfXxXW7TrHVLZLeXQNdYyBtD2AG) |
| G-21 vault sub-account materialize | [HUqc4HUx…](https://testnet.nearblocks.io/txns/HUqc4HUxwaBpqbNdcbiHa2WFEGfeu6HN2hjkyxcnEKK6) |

Live reading on 2026-11-14: 11 Snaccs, total supply about 2.46 `$SNACC` (about 0.037 burned), `CrucibleTemp` 960 mK (Feeding Frenzy). The scale is tiny: this is a rehearsal colony, not a market. The read-only backend serves it at `/api/crucible/macro`.

### Claim limits (read before the numbers)

"22 of 22" means the mechanics that are implemented were verified on chain. It is **not** a product-completeness checklist.

- **Time was compressed.** Aging in G-07, G-08 and G-10 and the 24 h epoch gate (G-19 and G-11) ran with `advance_sandbox_clock` (owner-only, `.testnet` accounts only, at most 720 h per call). Nobody waited real time. The mechanics are the same, the speed is not representative, and mainnet would have no such clock.
- **Dividends:** one epoch, one contributor. Multi-epoch behaviour and claim expiry are unit tests only.
- **Thermostat:** the Frenzy in `CfBR8pFN…` was set up with a heating fee that the contract account paid to itself (a self-funded rehearsal). The burn was 175 bps, not 350: a held `mt:elixir-homeostasis` shield halves it.
- **Failed calls** show the error text `Unreachable` on chain.
- **Players:** no external player has played. The lab's own account owns all 11 strains except #4 (see [Disclosure](#disclosure-accounts-used-in-the-rehearsal)).
- **Not covered by these checks:** a complete SDK, the security audit, the NEAR AI integrations (Inference SDK, privacy/classify, TDX quote verification), the docs, long-run economic results, a full end-to-end run, the frontend and the demo video. Product completeness is tracked in the backlog, not in this table.

### Deployment status

Read from the RPC on 2026-11-14: `snacc-v001.testnet` has `code_hash` **`4m2z2PiZTa1mSG5A8cnr5b9fxDWY4n3HiPGzcP7EtwiH`** (wasm 426,017 B) since the code upgrade of 2026-11-13 (`8ydFE4Xj…`, deployed without `migrate`, so the rehearsal state stayed).

| Step | Date | Wasm | `code_hash` |
| --- | --- | --- | --- |
| GLADI-7 deploy (its state was later reset by `migrate`) | 2026-11-08 | 406,495 B | superseded |
| GLADI-8 redeploy + `migrate`: the 51 rehearsal transactions belong to this build | 2026-11-09 | 517,185 B | `DMRgsiLJy74V5RS8txLHeJL3T97ivLHuEtY56sSCYmcr` |
| Code upgrade (adds `nft_transfer_call` for the market): **current** | 2026-11-13 | 426,017 B | `4m2z2PiZTa1mSG5A8cnr5b9fxDWY4n3HiPGzcP7EtwiH` |

- [`evidence/snacc.wasm`](evidence/snacc.wasm) is the **GLADI-8** build (`DMRgsiLJ…`). It is **not** the code deployed now.
- For the GLADI-8 build, `evidence/snacc.wasm` matched the on-chain `code_hash` when read on 2026-11-09, but the public `contracts` source is a functional match only (`docs/evidence-pack.md`), not byte-identical. A Docker reproducible build was **not** run (`cargo near build non-reproducible-wasm`), so there is no byte-for-byte source verification. This README does not claim that the current `contracts` source reproduces the 2026-11-13 build.
- `npm run verify:thesis` does not compare code hashes.
- Market contract `snacc-market.testnet` (195,320 B): `code_hash` `Ff2fbYVTK1bcqSi7UhdTQRUQff8qyKFMgVdAaDFypgHQ`.

### TEE: what the chain and the vector file each hold

- **On chain:** register [`BovEAtK5…`](https://testnet.nearblocks.io/txns/BovEAtK5gUZ6dthCX5Cn6qHnmZZ9bhtSTpGuYXRqYgfw), commit [`EnXBEETd…`](https://testnet.nearblocks.io/txns/EnXBEETdyG4TcjmrzGgJxzczGcxMshXZuEBorG8yHwDC), apply [`B8xdaukd…`](https://testnet.nearblocks.io/txns/B8xdaukdnf3Fh9ZkMNfXxXW7TrHVLZLeXQNdYyBtD2AG) (`genome_mutated`: +450 bps efficiency, +200 vitality, model `z-ai/glm-5.3-flash`). The apply arguments carry the NEAR AI Cloud chat id **`14a1b709e99641f7afcaf0dfbe2dd0bd`**. The field `tee_chat_id` in the manifest is this same id.
- **In the repo:** [`evidence/tee-vector-live.json`](evidence/tee-vector-live.json), which `npm run verify:thesis` (F-03) and `npm run demo:replay` use, is a **different** NEAR AI Cloud response, chat id **`d1979ce2662d4da6ae7a931d1158656d`**. Both responses pass the `ed25519` and `sha256` check offline, but the on-chain arguments and the vector file are **not byte-equal**.
- **What this proves:** the contract checked a valid signature under the registered public key (`5a0210f2442c79355784f9de021985429561da5bacc3a4424b01ac52b7e0caff`) and recomputed the request hash before it changed the Snacc, within the ±1500 bps cap. **What it does not prove:** that the key lives in a genuine enclave. Attestation is **not yet verified**; the `dcap-qvl` quote check is skipped when the tool is not installed.
- **Not a private result:** the apply call carries the full response body in its public arguments; only the request is hashed. Layer-2 cloud redaction does not run (`/v1/privacy/redact` answers 404 for `z-ai/glm-5.3-flash`), so only the local Layer-1 redaction applies.

### Disclosure: accounts used in the rehearsal

`x207-demo-buyer.testnet` is a test account from the sibling project x207. It was reused here as the second NEAR account, the buyer and raider. It signed the hostile takeover [`4o4qwoGZ…`](https://testnet.nearblocks.io/txns/4o4qwoGZtR7HE5E3VnjQZpXwDicpa9QVBzXHS1YP2v4f), the hatch [`4jEVMFmu…`](https://testnet.nearblocks.io/txns/4jEVMFmusrwwWxN2i9kh5wuuemTbxS2L6VUyBxy6LbGk) of strain 9 (the manifest labels it the target for `adopt` and lysis), a Keypom starter-pack drop spike [`39BNhC4A…`](https://testnet.nearblocks.io/txns/39BNhC4AXERb8K5pds4k4pmW312WXexSm2TwA1Z2L3ED), and four deliberately failing non-owner calls ([`D7QUnBn2…`](https://testnet.nearblocks.io/txns/D7QUnBn2jRBgpL3WufyToyEw3XNzRtoD7jj1M52mGvNZ), [`96WagxUJ…`](https://testnet.nearblocks.io/txns/96WagxUJW3kKi1z2YMYoAwMmbobSRZ4n6Z5CLagkxAhU), [`AKESsSNP…`](https://testnet.nearblocks.io/txns/AKESsSNPyq1zuufgcPJks1bCCQzwiJ2xTm9nYWkQEkHd), [`EyTedFNi…`](https://testnet.nearblocks.io/txns/EyTedFNiP1QptrUwv34v7P2P6jEfGc5M66D7UsDEhk6d)). It also received strain 4 through `nft_transfer`. Everything else was signed by the lab's own account `snacc-v001.testnet`, including `adopt` (`7w3tBNjL…`) and the lysis `AhEk4TNN…`: the caller who received the 10% bounty was the lab itself. The rule does not care who calls, but this run does not show an outside "finder". All 11 strains are owned by `snacc-v001.testnet` except #4. The manifest field `counterparty` names `x207-demo-buyer.testnet`.

### On-chain SVG: size and storage cost

The contract draws the NFT image (NEP-177 `nft_token` returns `data:image/svg+xml;base64,…`, no SVG is stored). Live images are **448–482 B**, a plain monospace telemetry card with raw numbers, not artwork; the budget is **1,734 B**. The figure `1,734 B × 10^19 yocto/byte = 0.01734 NEAR` is the cost *at the budget*; at 482 B it is about 0.0048 NEAR. `npm run verify:thesis` F-01 reads the live mainnet storage price, and its "84.42% cheaper" is computed against an *assumed* static-NFT baseline of 11,129 B. That percentage is a baseline assumption, not a measurement.

### Test counts

As recorded by the owning sessions on 2026-11-14 and **not re-run for this README**: `contracts` 411 (`snacc`) + 38 (`market`); `frontend` 709 tests in 46 files; `sdk` 100 passed + 1 skipped; `oracle-tee` 28; `backend` 169. Run them yourself with `cargo test` in `contracts` and `npm test` in the other repos. Unit tests check code paths; they are not on-chain evidence. Older counts you may still see elsewhere (256, 288, 293) are superseded.

### Not yet

- Mainnet, a DEX listing and real liquidity. Nothing is on mainnet.
- Enclave attestation for the TEE signer (see above).
- Natural-time operation, multi-epoch dividends, any external player.
- A gameplay transaction signed with a function-call key (the key was added and removed in a spike; no one-tap transaction is recorded), and any transaction signed from the UI wallet flow.
- Autonomous NPCs: the three NPC merchants only quote and fill when a player calls them.
- The Keypom starter pack in the demo (the drop transaction exists, the demo does not use it), Chain Signatures, a public NEP-245 `mt_*` interface, NEP-178 approvals.
- Economic claims such as "the central bank prevents death spirals": `docs/econ-*.md` are simulations; the live proof is one micro-scale firing.

## Source of design truth

The design notes live in a **private** `snacc-vault/` (the team's Obsidian vault, not part of this repo, so judges cannot open it). Numbers follow its official number dictionary ("Kamus Angka Resmi", note `Snacc - Model Data`), and product completeness is tracked in its backlog master (about 300 items). What a judge can check without the vault is in `evidence/`, `docs/` and the transactions linked above.

**Partner onboarding (standalone, no links):** [`docs/partner-onboarding.md`](docs/partner-onboarding.md) — an end-to-end Snacc summary for outside parties.

**Launch checklist (RES-124 / RES-109):** [`docs/launch-checklist.md`](docs/launch-checklist.md) — the Meme.Cooking flow, pre-launch gates, the owner-decision liquidity parameters, and the testnet mock steps (documents only; no launch has been executed).

**Docs set:** [`docs/glossary.md`](docs/glossary.md) · [`docs/quickstart.md`](docs/quickstart.md) · [`docs/econ-incentives.md`](docs/econ-incentives.md) · [`docs/econ-falsifiers.md`](docs/econ-falsifiers.md) · [`docs/demo-walkthrough.md`](docs/demo-walkthrough.md) · [`docs/demo-evidence-pack.md`](docs/demo-evidence-pack.md) · [`docs/shade-agents-npc.md`](docs/shade-agents-npc.md) · [`docs/mintbase-listing-checklist.md`](docs/mintbase-listing-checklist.md) · [`docs/roadmap-post-hackathon.md`](docs/roadmap-post-hackathon.md) · [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) · [`docs/post-mortem-draft.md`](docs/post-mortem-draft.md) · replay: [`evidence/demo-replay.md`](evidence/demo-replay.md)

**Honesty rules:** no testnet hash means no live claim; profit = work + redistribution (the Industrial Dividend Pool), no profit guarantee; `$SNACC` testnet has no monetary value.
