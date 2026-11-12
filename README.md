# Snacc — Polyrepo Umbrella

**Snacc ($SNACC): NFTs that eat a memecoin.** *Feed your Snacc or it gets snacked.*
One `Homunculus Strain` (`NEP-171`/`NEP-177`) has a `$SNACC` stomach + a `NEP-245` inventory, a `BMR` metabolism, and internal `$ATP` energy (non-transferable) allocated to organel slots every epoch; it can merge (`splice_strains`), be taken over while distressed, and be harvested by anyone once fainted — a multi-cell colony (`divide_strain`, `adopt` vs `snack`) running under natural population fences (`MAX_COLONY_SIZE = 5`, `MAX_GENERATION = 8`, `births ≤ merges + lyses`). Behind it: the reactive central bank `CrucibleTemp` (Fever burns 3.5% of fees / Hypothermia subsidizes 2%), 3 autonomous NPCs, and AI verification in `NEAR AI Cloud TEE` (`env::ed25519_verify` on-chain). `$SNACC` volatility is a playable feature — not a return promise.

## Repo layout (owner decision 2026-11-06: `x207`-style polyrepo)

| Repo | Module | Contents |
| --- | --- | --- |
| `Snacc` (this umbrella) | — | Judge README, docs, demo orchestration, submission assets |
| `contracts` | `M1` + `M2` | The `snacc-v001.near` contract (Rust, `near-sdk 5.29.1`) |
| `oracle-tee` | `M3` | Dual-Layer Redaction + the `z-ai/glm-5.3-flash` client + the ed25519 verifier |
| `sdk` | `M4` | `lab-sdk`: Function Call Keys (0-popup) + `SnaccClient` |
| `backend` | `M5` | The `NEP-297` indexer + the `/api/crucible/*` API |
| `frontend` | `M6` | the landing page (scroll story through the incubator, live testnet gallery) and the cell-cultivation game (isometric Colony Plate arena + Cell Lab bio-reactor + tool windows) — live at [snacc-nu.vercel.app](https://snacc-nu.vercel.app), game at [`/app`](https://snacc-nu.vercel.app/app) |
| `scripts` | `M7` | `verify:thesis`, `demo:replay`, `gladi:retry`, economic simulations |

**Play in the browser:** [snacc-nu.vercel.app/app](https://snacc-nu.vercel.app/app) — opens in `demo · simulated`; switch to `live testnet` to read `snacc-v001.testnet` through the read-only backend (no wallet needed to look around).

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
