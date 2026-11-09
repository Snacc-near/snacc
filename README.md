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
| `frontend` | `M6` | `biolab-ui`: the 3-Column Console + 30s Judge Walkthrough |
| `scripts` | `M7` | `verify:thesis`, `demo:replay`, `gladi:retry`, economic simulations |

## Quick start (judges: Node.js 22+, no keys, no `npm install`)

```bash
git clone https://github.com/Snacc-near/snacc.git && cd snacc
git clone https://github.com/Snacc-near/scripts.git scripts
npm run demo:replay      # offline replay from the committed evidence in evidence/
npm run verify:thesis    # falsifiers F-01..F-03
```

Contract: clone the `contracts` repo, then `cargo test`. Evidence per claim: [`docs/evidence-pack.md`](docs/evidence-pack.md) · submission summary: [`HACKATHON.md`](HACKATHON.md).

## Source of design truth

The `snacc-vault/` vault — start from [[Snacc Hub]]. Numbers follow the **Kamus Angka Resmi** ([[Snacc - Model Data]]). Backlog & execution order: [[Snacc - Backlog Master]] (±300 items).

**Partner onboarding (standalone, no links):** [`docs/partner-onboarding.md`](docs/partner-onboarding.md) — an end-to-end Snacc summary for outside parties.

**Honesty rules:** no testnet hash means no live claim; profit = work + redistribution (the Industrial Dividend Pool), no profit guarantee; `$SNACC` testnet has no monetary value.
