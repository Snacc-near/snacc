# Snacc — $SNACC Launch Checklist (RES-124 / RES-109)

> **Documents only.** Writing this file performed no transaction, created no account, and deployed nothing. `$SNACC` on testnet has no monetary value; nothing here promises profit or a price.
> **Hard gate:** any mainnet deployment, listing, or mainnet transaction requires the explicit approval of the project owner (vault Backlog §13b; the vault's DEX-listing readiness note; decision table `RES-125`). This checklist is neither an approval nor a launch-readiness claim.

## 1. The Meme.Cooking flow (public research, checked 2026-11-09)

| Fact | Source |
| --- | --- |
| Meme.Cooking is a **permissionless meme-token launchpad on NEAR** with a fair **auction** model: every depositor during an auction buys at the same price (not a bonding-curve model). | https://docs.meme.cooking/ |
| **Create-a-token inputs:** logo, token name, ticker, description; social links (X / Telegram / website); auction duration **5 minutes to 1 day**; a **soft cap** (minimum required to launch on Ref Finance) and an optional **hard cap** (reaching it launches early); an optional **team allocation** with a cliff and a linear vesting period. | https://docs.meme.cooking/for-cooks/create-a-token/ |
| **On a successful auction:** the deposited NEAR (minus a protocol fee) plus **~50% of the distributed supply** become the liquidity pool on Ref Finance; the **LP shares are locked for 69 years**; the other ~50% is distributed to depositors pro-rata (exact shares shift with any team allocation); below the soft cap all deposits are refundable; the docs state a launch needs **at least ~4k NEAR** deposited. | https://docs.meme.cooking/for-buyers/how-it-works/ |
| **Ticker reality (repo research, 2026-11-07):** no evidence of an existing `$SNACC` token on NEAR / Meme.Cooking; at least four homonyms were found on other chains → always brand **"$SNACC on NEAR"** and re-check the live token board immediately before any launch step. | `docs/ops-ticker-check.md` |

**Unverified — must be confirmed before touching any launch step:**

- Whether Meme.Cooking can host an **existing** NEP-141 contract ($SNACC lives inside the atomic contract `contracts:snacc/src/lib.rs` — there is no separate token contract) or whether its flow only mints **factory-created** auction tokens. The public docs describe "Create a Token" only. This unresolved question decides the route in §3.
- Whether a **testnet** environment or test board exists — no public evidence was found (as of 2026-11-09). Until confirmed, treat Meme.Cooking as mainnet-only.
- The current protocol fee percentage, and any soft/hard-cap bounds beyond the wording above — re-read the live docs at execution time.

## 2. Pre-launch checklist (technical readiness — status taken from existing documents)

- [x] **Fungible-token metadata (NEP-148)** — the `ft_metadata` view with `spec: "ft-1.0.0"`: NEP-148 official text at https://github.com/near/NEPs/blob/master/neps/nep-0148.md and the FT standard overview at https://docs.near.org/primitives/ft/standard. Implemented as `ft_metadata` in `contracts:snacc/src/lib.rs` — `name: Snacc`, `symbol: $SNACC`, `decimals: 24`; live-verified on testnet (KPI G-02; details in `docs/evidence-pack.md` M1).
- [x] **Storage deposit (NEP-145)** — a receiver must be registered before `ft_transfer` (`ERR_ACCOUNT_NOT_REGISTERED`); the first-registration minimum is `STORAGE_DEPOSIT_MILLINEAR = 5` (`contracts:snacc/src/state.rs`). Unit tests: `n141_storage_full_cycle`, `n141_transfer_to_unregistered_rejected`. Live: the registration transaction recorded in `docs/evidence-pack.md` M1.
- [x] **Icon** — an inline SVG data URL inside `ft_metadata` (`contracts:snacc/src/lib.rs`). The **same icon bytes** must be reused for the mainnet deployment (still pending).
- [x] **Explorer proof (testnet)** — https://testnet.nearblocks.io/account/snacc-v001.testnet (contract + FT behavior verified in `docs/evidence-pack.md`).
- [x] **Supply invariant** — `ft_total_supply` equals the macro supply; checked by `verify:thesis` F-02 (`docs/evidence-pack.md` M2).
- [ ] **Read the audit pack without over-claiming:** security findings and their recorded exception live in `docs/security-audit.md`; NEP coverage and its honest gaps in `docs/nep-compliance.md`; the exact scope of the KPI run in `evidence/gladi-kpi.md`. **None of these documents states that an external audit was completed** — do not describe the project as externally audited.
- [ ] **Mainnet account / contract** — owner decision (`RES-125`): at the 2026-11-07 check `snacc-v001.near` was still available and `snacc.near` was already taken (`docs/ops-ticker-check.md`).
- [ ] **Reproducible build + source verification** for the mainnet wasm — the testnet build used a non-reproducible build (recorded in `docs/evidence-pack.md` §1).

## 3. Initial liquidity plan — OWNER DECISION REQUIRED (no final numbers)

> Every row is a **decision input**, not a decided value. Nothing in this table may be quoted as a final parameter. Numbers appear only where an official vault source already fixes them (disclosure facts), never as a proposed amount or price.

| Parameter | Options / notes | Anchor (only if it exists in the Kamus) | Status |
| --- | --- | --- | --- |
| Route | (a) Meme.Cooking auction → Ref pool, **if** an existing contract can be hosted (§1 is unverified); (b) a direct pool for the existing NEP-141 token on Ref / NEAR Intents; (c) defer entirely | — | **PENDING OWNER** |
| Trading pair | `$SNACC`/`wNEAR` is the working assumption in vault Backlog §13b; alternatives open | — | **PENDING OWNER** |
| Liquidity size + source | must be documented at execution time; vault principle: liquidity comes from protocol activity (fees), the team sells **no allocation**; **no price and no minimum value is promised** | — | **PENDING OWNER** |
| Team allocation (launchpad option) | the launchpad supports team allocation with cliff + vesting; the vault plan states no team allocation for sale → propose **0%** | — | **PENDING OWNER** |
| Soft cap / hard cap / auction duration | launchpad inputs (duration 5 min – 1 day per the official docs); exact bounds unverified (§1) | — | **PENDING OWNER** |
| Timing | post-hackathon window; any mainnet step needs explicit owner approval | vault Backlog §13b | **PENDING OWNER** |
| Disclosure that must accompany any launch | on-chain mechanics, quoted exactly: `ft_burn` 350 bps during Fever when the temperature is above 610 mK; Hypothermia rebate 200 bps capped at 500 bps/epoch; `$SNACC` testnet has no monetary value; volatility is a mechanic, not a promise | Kamus `D7` (610 / 350 / 200 / 500) | **FIXED FACTS — disclose, do not tune** |
| Internal quote ≠ listing price | `P_BASE = 100` is the **internal NPC quote unit** (`contracts:snacc/src/state.rs`, vault §13a) — it is not a listing price and not a valuation of anything | vault §13a | **FIXED FACT** |

## 4. Testnet mock steps (contract `snacc-v001.testnet`) — documented, NOT executed here

> This change is documents-only: the steps below were **not** run while writing it. Whoever runs them later must follow the project's testnet rules and record every resulting transaction hash as evidence (the same manifest style as `evidence/gladi-manifest.json`).

1. **Read-only checks (no transaction):** view `ft_metadata`, `ft_total_supply`, `storage_balance_of` with the ready-made RPC snippets in `docs/evidence-pack.md`.
2. **Registration + transfer smoke (2 testnet transactions):** account A registers through `storage_deposit`, then A sends a small `ft_transfer` to B. The same flow was already exercised by KPI G-02 (transaction `4t5LdFJt…` recorded in `docs/evidence-pack.md` M1); a repeat would use whatever test accounts are chosen at run time.
3. **Pool-presence probe:** `npm run dex-check` (script `scripts/dex-check.mjs`) queries DEX pools **by contract address**. Honest expected output for a testnet contract: **not present in mainnet pools** — that is information, not a failure.
4. **Internal quote simulation for UI widgets:** `npc_quote_spores` (`P_BASE × S_target / max(S_after,1)`, `contracts:snacc/src/lib.rs`) can feed a mock price input in testnet widgets (`RES-107`/`RES-108`, frontend still pending).
5. **Meme.Cooking mock: cannot be confirmed** — no public testnet board was found (§1, unverified). Do not create accounts or send transactions there to "test" it; confirm with the platform first.

## 5. Explicit gates

- **A mainnet deployment, a listing, or any mainnet transaction requires the owner's explicit approval** (vault Backlog §13b; the vault's DEX-listing readiness note; the `RES-125` decision table).
- Completing a checkbox in §2 or running a step in §4 does **not** authorize any number from §3 or a launch date.
- `$SNACC` testnet has no monetary value; this document makes no profit claim and no price claim.

Back to [README](../README.md) · evidence: [docs/evidence-pack.md](evidence-pack.md) · ticker research: [docs/ops-ticker-check.md](ops-ticker-check.md) · NEP checklist: [docs/nep-compliance.md](nep-compliance.md) · security: [docs/security-audit.md](security-audit.md)