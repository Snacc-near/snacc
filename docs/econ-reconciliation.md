# Snacc — ECON Reconciliation: Kamus Angka ↔ Contract ↔ Simulation Scripts (ECON-101..106)

> Purpose (backlog `ECON-101..106`): reconcile every parameter that appears in the macro-economic simulation artifacts against the official numbers and the deployed contract source, so the profit equations (`PF-01..09`) rest on declared, comparable inputs. Sources checked on 2026-11-09: the **Kamus Angka Resmi** (vault `Snacc - Model Data.md` — dictionary `D7` + the `V_epoch`/epoch rows) and vault `§13a` for ATP/NPC numbers; the contract at `contracts` origin/main (`snacc/src/state.rs`, `snacc/src/lib.rs` — file:line as of that revision); the scripts `scripts/econ-*.mjs`; the generated docs `docs/econ-*.md`. **No code was changed** — differences are reported here, not silently fixed. `$SNACC` testnet has no monetary value; simulation outputs are model results, not live claims.

**Verdict legend:** `MATCH` = same number in all applicable sources · `DIFFERENCE` = numbers or models differ (explanation mandatory) · `NOT MODELED` = exists in the contract but the econ scripts do not model it (coverage limit, stated honestly).

## 1. Thermostat & guardrails (Kamus `D7` ↔ contract ↔ sim)

| # | Parameter | Kamus Angka | Contract (origin/main) | Econ script | Verdict |
| --- | --- | --- | --- | --- | --- |
| 1 | Fever threshold | `610` mK (`1400` superseded by `ECON-111`) | `snacc/src/state.rs:20` = `610` | `scripts/econ-sim.mjs:15` = **`1400`** (pre-ECON-111 baseline); `scripts/econ-profit.mjs:35` = `610` but labelled "fallback / proposal" | **DIFFERENCE (stale script)** — Kamus ↔ contract match; `econ-sim.mjs` still encodes the superseded threshold (its outputs in `docs/econ-sim.md` are historical baseline runs); the "proposal/fallback" label in `econ-profit.mjs` is stale — `610` is final (`D7`) |
| 2 | Hypothermia threshold | `600` mK | `snacc/src/state.rs:22` = `600` | `scripts/econ-sim.mjs:16` = `600` | MATCH |
| 3 | `FEVER_BURN_BPS` | `350` (3.5%) | `snacc/src/state.rs:24` = `350` | `scripts/econ-sim.mjs:17` = `350` | MATCH |
| 4 | `REBATE_BPS` | `200` (2.0%) | `snacc/src/state.rs:26` = `200` | `scripts/econ-sim.mjs:18` = `200` | MATCH |
| 5 | `MAX_EPOCH_TREASURY_DRAIN_BPS` (rebate cap) | `500` (5%/epoch, `I-04`) | `snacc/src/state.rs:28` = `500` | `scripts/econ-sim.mjs:19` `REBATE_CAP_BPS` = `500` | MATCH |
| 6 | `MAX_SHIFT_BPS` (TEE guardrail) | `1500` | `snacc/src/state.rs:16` = `1500` (mirror `TEE_SHIFT_LIMIT_BPS` at `snacc/src/state.rs:118`) | `scripts/econ-profit.mjs:26` `TEE_MAX_SHIFT_BPS` = `1500` | MATCH |
| 7 | Liquidation bounty | `1000` bps (10%) | `snacc/src/state.rs:32` `LIQUIDATOR_BOUNTY_BPS` = `1000` (90% counterpart = `10000 − 1000`) | `scripts/econ-sim.mjs:27-28` = `1000` / `9000` | MATCH |
| 8 | `EPOCH_DURATION_SEC` | `86400` (24 h) | `snacc/src/state.rs:46` = `86_400` | `scripts/econ-sim.mjs:33` `EPOCH_SEC` = **`3600`** (labelled ASSUMPTION #1 in `docs/econ-sim.md`) | **DIFFERENCE (declared assumption)** — the sim uses 1 epoch = 1 h so its step equals the per-hour BMR; the contract closes epochs every 24 h while decaying **per second** (`VOLUME_DECAY_PER_SEC = 50` matches the sim rate per wall-clock second: contract `snacc/src/state.rs:30` = sim `scripts/econ-sim.mjs:14`), so decay intensity per unit time is identical; epoch-gated mechanics (feast, dividend close) are stepped differently |

## 2. Metabolism & lifecycle

| # | Parameter | Vault number | Contract (origin/main) | Econ script | Verdict |
| --- | --- | --- | --- | --- | --- |
| 9 | `INITIAL_VITALITY` | `8500` (spec F1 — not a `D7` row) | `snacc/src/state.rs:55` = `8500` | `scripts/econ-sim.mjs:21` = `8500` | MATCH |
| 10 | BMR per role (Extractor/Fermenter/Synthesizer) | `100/120/150` per hour (spec F1 — not in `D7`) | `snacc/src/state.rs:59-61` = `100/120/150` | `scripts/econ-sim.mjs:20` = `100/120/150` | MATCH |
| 11 | Metabolic recovery per feed | `+500` vitality (spec F2) | `snacc/src/state.rs:95` `METABOLIC_RECOVERY_VITALITY` = `500` | `scripts/econ-sim.mjs:23` = `500` | MATCH |
| 12 | Vitality cap | `10000` (`I-02`) | `snacc/src/state.rs:97` `VITALITY_CAP` = `10000` | `scripts/econ-sim.mjs:24` = `10000` | MATCH |
| 13 | Incubation split strain/treasury | `80% / 20%` (spec F1/D6) | `snacc/src/state.rs:67` `STAKE_TREASURY_BPS` = `2000` (20%) | `scripts/econ-sim.mjs:25-26` = `8000/2000` | MATCH |
| 14 | `VOLUME_DECAY_PER_SEC` | `50` | `snacc/src/state.rs:30` = `50` | `scripts/econ-sim.mjs:14` = `50` | MATCH |

## 3. Money flows & fees

| # | Parameter | Vault number | Contract (origin/main) | Econ script | Verdict |
| --- | --- | --- | --- | --- | --- |
| 15 | `DIVIDEND_INFLOW_BPS` | `5000` (50% — spec DK-033/ADR-28, not a `D7` row) | `snacc/src/state.rs:175` = `5000` | `scripts/econ-profit.mjs:24` = `5000` | MATCH |
| 16 | `MAX_DIVIDEND_CLAIM_EPOCHS` | `8` (spec DK-033) | `snacc/src/state.rs:179` = `8` | cited in `docs/econ-profit.md` §1 | MATCH |
| 17 | Hostile-takeover premium | `115%` (ADR-26/`I-09`, vault §13b) | `snacc/src/state.rs:36` `HOSTILE_PREMIUM_BPS` = `1500` | `scripts/econ-profit.mjs:27` `TAKEOVER_PREMIUM_BPS` = `1500` | MATCH (the 95/5 payout split is NOT modeled — see row 31) |
| 18 | Merger tax `MERGER_TAX_BPS` | `250` bps (2.5%, ADR-25) | `snacc/src/state.rs:34` = `250` | — | NOT MODELED (no econ script covers the voluntary-merger tax) |
| 19 | Catalyst-fee model | fee of the 3 stages charged in `$SNACC` (vault §13d) | **parameterized per call** — `snacc_catalyst_fee` argument at `snacc/src/lib.rs:949/993/1083`; feed fee = the feed amount with burst/rescue/dormancy modifiers (`snacc/src/lib.rs:2358`) | **flat** `CATALYST_FEE = 100` at `scripts/econ-sim.mjs:38` (labelled ASSUMPTION #4; reused as feed cost in `scripts/econ-profit.mjs:138`) | **DIFFERENCE (declared assumption)** — a flat fee is a modeling simplification, not a Kamus number; the contract has no flat-fee constant |
| 20 | NPC base price `P_BASE` | `100` (vault §13a) | `snacc/src/state.rs:224` `P_BASE` = `100` (mirror `NPC_P_BASE` at `snacc/src/state.rs:226`) | `scripts/econ-sim.mjs:41` = `100` (originally an ASSUMPTION; now equal to the ratified §13a number) | MATCH |

## 4. Volume scale & ATP — the `S_c` bridge (the core open item of `ECON-104..106`)

| # | Parameter | Vault number | Contract (origin/main) | Econ script | Verdict |
| --- | --- | --- | --- | --- | --- |
| 21 | `VOLUME_SCALE` (Option B molecule legs) | `5` | `snacc/src/state.rs:229` = `5` | baseline `econ-sim.mjs` does not use it (fixed/velocity models); the Option B path: sweep `scripts/econ-calib-opsib.mjs` → `docs/econ-sweep-opsib.md`, default `OPSIB_SCALE` = `5` at `scripts/econ-profit.mjs:38` | MATCH (via the Option B scripts; the baseline scenarios use the older volume models by design) |
| 22 | `ATP_VOLUME_SCALE` (sim↔contract scale `S_c`) | **not in the Kamus** — recorded in the EN-117/ECON-111 decision (`docs/en-117-resolution.md` §4) and vault backlog §13a/EN-117 | `snacc/src/state.rs:242` = `600_000_000_000_000` (`6×10^14`) | sim `S = 3000` (sweep `scripts/econ-calib-atp.mjs:17` over 0–15,000; chosen `3000` — `docs/en-117-resolution.md` §4) | **DIFFERENCE BY DESIGN, BRIDGE DOCUMENTED** — share formulas: sim `S/(5100+S)` = 0.370 ↔ contract `S_c/(10^15+S_c)` = 0.375 (contract comment `snacc/src/state.rs:238-241`, `docs/en-117-resolution.md` §4); feeding `6e14` directly into the sim gives 0 population because the units differ (sim ATP/tx vs contract yocto-fee `10^15 → 1 ATP`) — a unit difference, stated in `docs/asumsi-7-fix.md` §4; the contract scale is live-verified by KPI G-12 (`evidence/gladi-kpi.md`). **Open recommendation:** add `ATP_VOLUME_SCALE = 6×10^14` to the Kamus Angka (`D7`-style row) |
| 23 | `INITIAL_ATP` | `50` (vault §13a) | `snacc/src/state.rs:244` = `50` | not modeled per-strain (ATP enters the sim only through row 22's volume share) | MATCH (Kamus ↔ contract) |
| 24 | `ATP_YOCTO_UNIT` | `10^15` (vault §13a) | `snacc/src/state.rs:246` = `1_000_000_000_000_000` | not modeled | MATCH (Kamus ↔ contract) |

## 5. Contract-only mechanics the econ scripts do not model

These constants exist in the contract (mostly added with the `EN-1xx` mechanics after the original simulation runs). The econ scripts neither use nor calibrate them — so the "no death spiral" result in `docs/econ-sim.md` was produced **without** these feedbacks in scope:

| # | Parameter | Contract (origin/main) | Econ script | Verdict |
| --- | --- | --- | --- | --- |
| 25 | `FEAST_TARGET_BPS = 500` / `FEAST_BAND_BPS = 2000` | `snacc/src/state.rs:201-202` | — | NOT MODELED |
| 26 | `DORMANCY_THRESHOLD_BPS = 100` / `UPKEEP_MIN_BPS = 50` | `snacc/src/state.rs:207` / `snacc/src/state.rs:206` | — | NOT MODELED |
| 27 | `RESCUE_MIN_FEE_BPS = 2000` | `snacc/src/state.rs:210` | only a proxy: PF-06 uses the Hypothermia rebate as the feed-subsidy signal (`scripts/econ-profit.mjs:110-114`) | NOT MODELED (proxy only) |
| 28 | `DIET_FEVER_EXTRACTOR_BPS = 2000` / `DIET_FAMINE_SYNTHESIZER_BPS = 2000` | `snacc/src/state.rs:213-214` | — | NOT MODELED |
| 29 | `BASE_BURST_BPS = 200` / `MAX_BURST_BPS = 2000` | `snacc/src/state.rs:183` / `snacc/src/state.rs:53` | — | NOT MODELED |
| 30 | `SPLICE_BMR_REDUCTION_BPS = 1500`; organel effects `NUCLEUS_OUTPUT_BPS_PER_LEVEL = 1000`, `LYSOSOME_BMR_BPS_PER_LEVEL = 1000` | `snacc/src/state.rs:42`, `snacc/src/state.rs:233`, `snacc/src/state.rs:236` | — | NOT MODELED |
| 31 | Hostile payout split `HOSTILE_SELLER_BPS = 9500` / `HOSTILE_TREASURY_BPS = 500` | `snacc/src/state.rs:193-194` | `econ-profit.mjs` models premium + salvage, not the 95/5 split | NOT MODELED (partial) |

## 6. Summary (honest)

- **31 rows checked: 19 `MATCH`, 4 `DIFFERENCE`, 8 `NOT MODELED`.**
- **The one stale number:** `scripts/econ-sim.mjs:15` still uses `FEVER_THRESHOLD = 1400`, superseded by the final `ECON-111` value `610` (Kamus `D7`, contract `snacc/src/state.rs:20`). Its historical outputs in `docs/econ-sim.md` were produced under the old threshold; the final calibration lives in `docs/econ-sweep-opsib.md` / `docs/econ-profit.md` (scenario `opsib-scale5-fever610`). The "fallback/proposal" wording for `610` in `scripts/econ-profit.mjs:35` is stale labelling — the decision is final. Reported, not silently changed.
- **The `S_c = 6×10^14` bridge (the `ECON-104..106` gap) is now written down:** sim `S = 3000` ↔ contract `6×10^14` via near-equal ATP shares (0.370 vs 0.375, contract comment `snacc/src/state.rs:238-241`); numeric substitution across units is invalid by construction (`docs/asumsi-7-fix.md` §4); the contract value is the one verified live (KPI G-12). Remaining recommendation: promote `ATP_VOLUME_SCALE` into the Kamus Angka.
- **Epoch step** (3600 s vs 86400 s) and the **flat fee** are declared sim assumptions, not conflicting official numbers; per-second decay rates agree between contract and sim.
- **Coverage limit:** 8 contract mechanics (rows 25–31) are outside every econ script — re-running the death-spiral check with burst/diet/rescue/dormancy/feast feedbacks enabled has not been done.
- Artifacts of this family on the public repo: `docs/econ-sim.md`, `docs/econ-profit.md`, `docs/econ-sweep-opsib.md`, `docs/econ-fever-sensitivity.md`, `docs/en-117-resolution.md`, `docs/asumsi-7-fix.md` — this document is the parameter cross-check between them, the Kamus, and `contracts` origin/main.

Related: [econ-sim.md](econ-sim.md) · [econ-profit.md](econ-profit.md) · [econ-sweep-opsib.md](econ-sweep-opsib.md) · [econ-fever-sensitivity.md](econ-fever-sensitivity.md) · [en-117-resolution.md](en-117-resolution.md) · [asumsi-7-fix.md](asumsi-7-fix.md) · [README](../README.md)