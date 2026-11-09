# EN-119 — Organel Slot Effects: IMPLEMENTED (owner decision 2026-11-08)

> History: audit A-05 (vault) — "organelles other than mitochondria have 0 mechanical occurrences";
> the initial resolution: "not yet specified + a minimal proposal" (an older version of this document).
> **Owner decision 2026-11-08: "the effects must be used"** — the final numbers below are now
> INSTALLED in the contract and locked by tests (`qa_organel_tests::tc_organel_01..05`).

## Status per slot (IMPLEMENTED — the exact formulas)

| Slot | Effect (code, the owner's decision) | Formula | Test |
| --- | --- | --- | --- |
| Mitochondria | ATP minted +10%/level | `atp = fee/10^15 × eff × (10000+1000×mito)/10000` (§13a) | `tc_organel_01` + `atp115_formula_and_mitochondria_bonus` (the L1/L2/L5 bonus) + `atp114_feed_mints_atp_and_event` |
| Nucleus | Production output **+10%/level** — multiplies the result of `transmute_spores_to_enzyme` & `synthesize_elixir` | `minted = base × (10000 + 1000×nukleus)/10000` | `tc_organel_04` (8 spores: 8→12 @nuk5; elixirs 2→3 @nuk5) |
| Lysosome | Effective BMR **−10%/level** — a longer lifespan | `BMR_eff = bmr_per_hour × (10000 − 1000×lisosom)/10000` (min 0; the level cap 5 → BMR_eff ≥ 50%) | `tc_organel_05` (70 h: lysosome 4 → eff 4300 vs 1500 without) |

The allocation cost stays: **1 ATP per level increase**, level ≤ 5 (`ERR_ORGANEL_LEVEL_MAX`),
1×/epoch (`ERR_ALREADY_ALLOCATED`); merge inheritance `max(dom, abs)` + an allocation reset (`EN-120`).

## Proposal history (superseded — replaced by the owner decision above)

1. ~~Lysosome: nutrient burst +100 bps×level~~ → replaced by BMR −10%/level (the owner's decision).
2. ~~Nucleus: a TEE fence +50 bps×level~~ → replaced by production output +10%/level (the TEE
   fence `I-03` is NOT changed — a safe decision).
3. Other slots (Ribosome/Vacuole/Peroxisome/Golgi) = the `D` roadmap (vault) — outside the 3-slot MVP.

## What the tests already lock (no invented effects)

- The allocation cost = 1 ATP **per level increase**; level ≤ 5 (`ERR_ORGANEL_LEVEL_MAX`); 1×/epoch
  (`ERR_ALREADY_ALLOCATED`); lowering/resetting a level is free.
- Merge inheritance: `max(dom, abs)` per slot + an allocation reset (`EN-120`).

The number decisions = the owner; the implementation follows once the numbers are locked (rule: numbers only
from the vault/dictionary + recorded decisions).
