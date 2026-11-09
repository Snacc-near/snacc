# DOC-116 — Post-Mortem Draft (hackathon build window)

**Status:** DRAFT — facts below were verified in this repository on 2026-11-08; wording is open for
the owner's review before submission. Covers findings that actually happened, including the ones
that hurt.
**Item:** DOC-116 · 2026-11-08.

## 1. What went well (short)

- 293 contract tests (contracts PR #22) with 0 warnings (`cargo test -p snacc`, verified
  2026-11-09 against contracts origin/main) plus a keyless thesis verifier (`npm run verify:thesis`,
  falsifiers F-01..F-03) and a zero-key offline demo replay.
- Zero-key TEE evidence path: signed reasoning bundles re-verifiable with `env::ed25519_verify`
  without any API key.

## 2. Finding — `migrate()` silently kept old collection data (fixed)

**What happened.** Early `migrate()` was implemented as `Self::new()` — it constructed *fresh*
collections with the **same prefixes** (e.g. `used_tee_chat_ids: LookupSet::new(b"u")`). On NEAR,
collections with an identical prefix read the **pre-migrate state**, so "cleared" data was still
there. During gladi this surfaced as a **false `ERR_TEE_REPLAY`** (stale TEE chat ids looked like
replays) and every keyed collection (`strains`, `snacc_balances`, `inventories`, `strains_by_owner`,
`account_balances`, dividend/epoch maps, `npc_agents`, …) carried the same latent risk.

**Fix (SEC-112).** Generation-prefixed collections: a `prefix_gen` counter is
stored in state and `migrate()` increments it, so each generation reads a *different* prefix;
`LookupSet::new([b"u", GEN])` etc., `Vector` inner prefixes include the generation, plus a
`__snacc_prefix_gen_v1` marker. Regression test `tc_migrate_membersihkan_collection` (in
the contracts `qa_en104_tests.rs`): build 5 strains + live TEE data → `migrate()` → **all collections empty**.
Verified green 2026-11-08. (Original contracts commit hash unverified against that repo from this
document — see the note in §6b.)

**Lesson.** On NEAR, "new collection" ≠ "empty collection" unless the prefix changes. Migration
review must include a prefix audit, not just borsh compatibility.

## 3. Finding — `V-04` solvency drift ≈ 1.58e24 (diagnosed, patch applied)

**What happened.** Live `get_global_solvency` on `snacc-v001.testnet` returned
`solvent: false, drift: 1579999998983471999994450` (captured 2026-11-08; earlier deployment).
Root cause (read-only diagnosis): in `hostile_takeover_splice` the seller's payout
(95% of payment) was credited with a **direct `account_balances.insert`**, bypassing
`set_account_balance` — the only writer that maintains the `sum_account_balances` accumulator. Every
hostile takeover therefore added `seller_payout` to `drift`. Local replication: an integration test
showed a normal gladi sequence keeps drift 0 at every step while a single takeover reproduces drift
exactly.

**Honest scope.** This was a **bookkeeping-accumulator** bug: the seller's real balance *was* credited;
the published invariant sum was what lied. Still a broken invariant — we publish `V-04` as "drift
must be 0", so the claim failed on the live state of that deployment.

**Status at first draft (kept as history).** Diagnosis + exact patch text done; patch not yet applied.

**Status update (2026-11-08/09): code FIXED and live state healthy.** The seller credit now routes
through the accumulator (SEC-104), and the contract was **redeployed** on 2026-11-08 with the
audit-fix bundle; `get_global_solvency` on the current deployment reports `drift: 0, solvent: true`
(`evidence/gladi-manifest.json` `solvency_final`; `docs/evidence-pack.md` C2). Solvency asserts
live in the contracts QA suites (the `qa_audit_tests.rs` and `qa_regression_tests.rs`
suites — the original v04 integration-test path no longer exists under that name on contracts
origin/main; original commit hash unverified here). Public-source parity also landed:
`hostile_takeover_splice` now credits the seller via `set_account_balance`
(contracts:snacc/src/lib.rs:1668) in contracts PR #21 (V-04 parity).

**Lesson.** An accumulator invariant needs a *single* write path and an audit of every mutation
point; we audited the others (`splice`, `lysis`, `adopt`, `divide`, dividends, NPC, ft_*) — one
bypass was enough to falsify the invariant.

## 4. Finding — `DK-030` corner: feed could be free (fixed)

**What happened.** Iterating the fee logic found a corner where **dormancy × Nutrient Burst**
combined so that `feed_strain` charged **0** (a free feed) — violating `DK-030` ("feed must never
be free") and making the worst-case economics depend on an accident of parameter stacking.

**Fix (EN-104).** Effective fee floors at **1 yoctoNEAR**
(`effective_fee = max(fee, 1)`), so every feed debits ≥ 1 regardless of diet/burst/dormancy.
Regression `tc_dk030_feeding_is_never_free` (dormant × burst worst case) plus loop tests
(`en104_tc_nb01_loop_1000_feeds_stay_net_loss`, `sec109_dk030_feed_loop_and_dividend_nets_loss`)
are green as of 2026-11-09 (names as on contracts origin/main).

**Lesson.** Invariant words like "never" must be machine-checked across the *cross product* of
features, not each feature alone.

## 5. Finding — spec threshold `1400 mK` was unreachable → recalibrated to `610 mK`

**What happened.** The original spec set Fever at `CrucibleTemp > 1400 mK`
(= volume > 1.4× supply per epoch). Simulation (`docs/econ-sim.md`, explicit finding): under a
fixed-size cycle economy the temperature peaked around **~5 mK over 10,000 epochs — Fever fired
0.00%** of the time, i.e. the 350 bps burn path was effectively dead. `docs/econ-fever-sensitivity.md`
showed the problem was the *definition of `V_epoch`*, not just the number.

**Resolution (ECON-111, FINAL).** `V_epoch` redefined as **multi-leg turnover** (fee legs + molecule
legs × 5 + liquidation treasury leg; exclusions for rebate/dividend/transfers),
`VOLUME_SCALE = 5`, and the threshold recalibrated to **Fever above 610 mK** (Normal `[600, 610]`,
Hypothermia below 600) with the sweep evidence in `docs/econ-sweep-opsib.md`. Current contract params
report `fever_threshold_mk: 610` via `get_macro_state` (live-verified in the gladi run; the
thermostat even crossed into Fever on chain, `docs/evidence-pack.md` M4).

**Lesson.** A spec number must be *reachable under honest base-rate activity*, or the mechanic it
gates is decoration. Sweep before locking the number — and when the number changes, every derived
document must move with it (drift here was caught only because we re-ran the sim).

## 6. Finding — NEP compliance gaps found by the ABI audit (NEP-145 / 177 / 181)

**What happened.** `SEC-103` (public report: `docs/nep-compliance.md`, reviewed 2026-11-09) compared
the contract ABI against the NEP method lists. Honest result — **no automated NEP
validator exists that we could run; this was a name/signature comparison, not behavioral tests**:

| Gap | Status (2026-11-09) | Consequence |
|---|---|---|
| **NEP-181 enumeration** (`nft_total_supply`, `nft_tokens`, `nft_supply_for_owner`, `nft_tokens_for_owner`) | live-verified on the deployed wasm (KPI G-22 PASS); until 2026-11-09 **not yet in the public contract source** — **closed by contracts PR #21** (public source now exposes the same 67-function ABI; structural ABI parity — function list unchanged, not byte-identical wasm: current deployed code_hash `DMRgsiLJy74V5RS8txLHeJL3T97ivLHuEtY56sSCYmcr`, 517,185 B, GLADI-8 redeploy 2026-11-09, deploy `BF3MfUnpCtcqqXfBWnusDixvHHENBX2FrUHVhbEZQM7V` + migrate `G4fLRtP7RiPAWueNqHkgkao7NJKAmF3WtLks9jFwmF25`; the earlier deployment, code_hash `3DCPVk658pGuRW1FrDZKwrXQr3UHfYG43MoQUfbCwJwt`, 406,495 B, is history). Contracts PR #22 items (`ft_mint`, string `amount`) went live with the same GLADI-8 redeploy (tx `5JCAmSL7`, `ERBRL4rT`, `FQ6R9fmK`), so source and deployment are in parity on events too (functional, not byte-identical) | the marketplace-listing block that applied while the gap was open no longer applies on parity grounds (Mintbase/HOT Craft browse views are present in the public source) |
| **NEP-177 contract-level `nft_metadata`** | live-verified on the deployed wasm (KPI G-22 PASS); until 2026-11-09 **not yet in the public source** — **closed by contracts PR #21** on the same parity terms | the "NEP-177 compliant" claim for the public source, false while the gap was open, is now supported by the source |
| **NEP-145 storage management** | was **partial** — no `storage_unregister` by design (deregistration via full `storage_withdraw`), `storage_balance_bounds` deployed-wasm-only — **closed by contracts PR #21**: `storage_balance_bounds` (contracts:snacc/src/lib.rs:2237) and `storage_unregister` (contracts:snacc/src/lib.rs:2250) are now in the public source | wallets/DEX calling those methods failed while the gap was open; both are present since PR #21 |

Also recorded there (context, not findings-in-code): NEP-141/171/177/297 pass the method/shape
check with notes (`ft_burn` is a non-standard extension; `ft_mint` added in contracts PR #22 and
live on chain since the GLADI-8 redeploy 2026-11-09 — tx `5JCAmSL7pLTV8mShrNuEtG5WLPkCqKkYCZBf5WGtQ2wY`;
no NEP-178 approvals; NEP-245 is a data
model, not a public `mt_*` interface — the README must say so).

**Lesson.** "Standards supported" is a per-NEP matrix with evidence, not a checkbox. Optional-by-spec
can still be *operationally mandatory* (NEP-181 for marketplaces).

## 6b. Correction — `ASUMSI #7` "supply leak" was a measurement error, not a leak

**What happened.** `demo:e2e` printed `supply+burned = 1,000,000` vs `distribution = 45,243,163`
(difference −44.2M) and flagged it as a leak of simulation assumption #7 (external onboarding
minting supply from nowhere). Because the same simulation feeds the `econ-report-1..4` series, that
looked like it could invalidate the calibration.

**What the investigation found (`docs/asumsi-7-fix.md`).** The simulation never minted: onboarding is
capped by the external holders' residual balance. The *check itself* was wrong — it added the
**cumulative** rebate flow (44,401,753, money that recirculates every Hypothermia epoch) to the final
balances, double-counting, and left out the alchemist wallet and external holders. With the correct
identity `supply = treasury + alchemist + Σ strains + external` (841,410 = 258,608 + 868 + 581,934 + 0)
the difference is exactly 0; an independent ledger showed `maxAbsDrift = 0` in 4 configurations, and all
calibration metrics were identical before/after. The e2e snapshot now prints the closed-conservation line
and exits 0.

**What was real.** The onboarding pool is finite: 800,000 external $SNACC run out around epoch 799,
so "1,000 per epoch" did not last 10,000 epochs. That is now documented in the model assumptions.
A counterfactual that *did* mint (10M) collapses Fever to 0% — kept only as a comparison option.

**Lesson.** We labeled our own check's bug as the model's bug for a while. Before reporting a
"leak", re-derive the invariant independently of the code that reported it. (We still got the benefit:
the investigation added a real conservation ledger and exposed the finite-onboarding limit.)

## 6c. Process finding — "completed" ≠ "the task was done"

**What happened (per the owner's account of a delegated child-thread incident; thread ids not
re-verified in this draft).** A delegated child run returned status *completed*, but it had executed
an **old task / the wrong context**, not the one just assigned. A related observed symptom in the
handoff log: a delegated thread whose last run ended `failed` (quota 403) still showed intermediate
items as `completed`, so status alone did not say which deliverables actually existed.

**Mitigation.** Treat run status as *liveness*, not *delivery*. Verify the **artifact**: does the
expected file exist at the expected path, does the commit hash exist, did the named test actually run
and pass (we re-checked the diagnosis report, the QA test suites and the commit log before
continuing the cut-off task). Give each task a unique ID and require the report to cite the artifact
path + hash.

**Lesson.** The same rule as the project's claim honesty: "no hash = no claim" applies to our own
agents' completion reports too.

## 7. Meta-lessons

1. **Claim honesty.** Several near-misses (drift live, unreachable threshold, untested burn path)
   were only visible because we wrote *falsifiers* and negative findings down. Publish the misses.
2. **Backlog = completeness, tests = depth.** Passing tests never implied the product was done; the
   completeness audit table does.
3. **Migration and accumulators deserve their own checklist** items in future contract reviews
   (findings §2 and §3 were both "invisible" to feature tests).

## 8. Open items (updated 2026-11-09; first-draft entries kept with their new status)

- `V-04`: code patch **merged** (SEC-104, §3); live deployment redeployed 2026-11-08 and
  `get_global_solvency` reports `drift: 0`. **Closed on chain and in the public source** —
  `hostile_takeover_splice` credits the seller via `set_account_balance`
  (contracts:snacc/src/lib.rs:1668) in contracts PR #21 (V-04 parity, §3).
- SEC-103 NEP report: written and published as `docs/nep-compliance.md`; NEP-145/177/181
  live-verified on the deployed wasm (KPI G-22). Until 2026-11-09 the NEP views were **not yet
  in the public contract source** (§6); contracts PR #21 added them, so the public source now
  exposes the same 67-function ABI (structural ABI parity — function list unchanged, not
  byte-identical wasm). The GLADI-8 redeploy on 2026-11-09 brought contracts PR #22 live as
  well: current deployed code_hash `DMRgsiLJy74V5RS8txLHeJL3T97ivLHuEtY56sSCYmcr` (517,185 B;
  deploy `BF3MfUnpCtcqqXfBWnusDixvHHENBX2FrUHVhbEZQM7V`, migrate
  `G4fLRtP7RiPAWueNqHkgkao7NJKAmF3WtLks9jFwmF25`) emits `ft_mint` (tx
  `5JCAmSL7pLTV8mShrNuEtG5WLPkCqKkYCZBf5WGtQ2wY`) and string `amount` on `ft_burn` (tx
  `ERBRL4rTS6JHEKVsSumLYtru1hXsSYWdkGJH8d1krJaL`) / `ft_transfer` (tx
  `FQ6R9fmKWntSwQPjKchbd3EY8tnoZ3pvcNvSwZAtvXa8`). The earlier deployment (code_hash
  `3DCPVk658pGuRW1FrDZKwrXQr3UHfYG43MoQUfbCwJwt`, 406,495 B, built 2026-11-08) ran numeric
  amounts with no `ft_mint` and is history (see `docs/nep-compliance.md`). NEP-178 **not done** (optional).
- Align `README.md` NEP-245 wording with the corrected claim (§6) — the README describes
  "a `NEP-245` inventory"; the public scope note ("no public `mt_*` surface") lives in
  `docs/nep-compliance.md` — keep both in sync going forward.
- Verify child-run deliverables by artifact, not status (§6c) — process rule, adopt going forward.
- Any wording changes requested by the owner before this leaves draft.
