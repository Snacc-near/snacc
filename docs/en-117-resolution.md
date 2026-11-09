# EN-117 — DoD vs Final Implementation Resolution (RESOLVED 2026-11-08)

> Status: **RESOLVED — the owner decision of 2026-11-08 (temperature is literal ATP, the "most
> exciting" choice) has been implemented & calibrated.** The history of the proposal resolutions is below.

## 1. The literal EN-117 DoD (Backlog Master §13a)

> "`VOLUME_SCALE` | `1000` temporary → final at `ECON-111`; `volume_epoch += atp_minted × VOLUME_SCALE`"

The literal interpretation: the **only** contributor to `volume_epoch` is `ATP_minted × VOLUME_SCALE`
with `VOLUME_SCALE` temporarily `1000`.

## 2. The final implementation (installed in the contract, pipeline #4)

Per the **econ-report-3 §1 sweep report** (public summary: `docs/econ-sweep-opsib.md`; ECON-111 Option B — the owner decision of 2026-11-07/08):

- `VOLUME_SCALE = 5` (not 1000) — the result of a sweep of 20 scales × 10,000 epochs;
- `V_epoch` = a **multi-leg gross economic turnover**:
  - K1 = `snacc_catalyst_fee` (the transmutation fee, ×1);
  - K2 = `mt_burn` units × `VOLUME_SCALE(5)` × `P_BASE(100)`;
  - K3 = `mt_mint` units × `VOLUME_SCALE(5)` × `P_BASE(100)`;
  - K4 = liquidation cash (bounty + recovery);
  - **anti-feedback exclusions**: the `I-04` rebate, dividend claims, `ft_transfer`, incubation capital;
- `ATP` does **not** add to `volume_epoch` — ATP is internal work energy (the cost of
  extract/transmute/synthesize/splice/hostile/divide), not a temperature component.

## 3. Why the literal DoD could not be used (technical reasons, from the calibration)

1. **Magnitude**: `ATP_minted = fee/10^15 × …` — with real gladi fees (10^13 yocto),
   `ATP_minted ≈ 0.01 → 0` after flooring; `× 1000` stays 0 → the thermostat **never comes alive**.
2. **Feedback loop**: ATP is minted FROM the fee — feeding it back into the temperature creates a
   fee→ATP→temperature→burn loop that can amplify itself (a thermostat anti-pattern).
3. **Empirical validation**: the ECON-111 sweep (20 scales × 10,000 epochs, a fixed seed) proves
   the multi-leg definition produces the target band (Fever 5–30%, a living population, a solvent
   treasury) — the literal definition has no healthy operating point.

## 4. The final resolution (ratified — the owner, 2026-11-08)

> **The final EN-117 DoD**: "`V_epoch` = **atp_minted × ATP_VOLUME_SCALE + the economic
> legs (K1 fee + K2/K3 molecules + K4 liquidation cash)**" — a hybrid composition: literal ATP as
> the main feed weight + the economic legs as companion weights; the old `VOLUME_SCALE(1000)` is
> withdrawn and replaced by **`ATP_VOLUME_SCALE = 6×10^14`** (contract) / `3000` (sim).

**The sweep numbers** (econ-report-4, the output of `scripts/econ-calib-atp.mjs`; 10 scales × 10,000 epochs): every scale is in-band
(fever 5.9→23.8%, no death spiral); the chosen **S=3000 → fever 8.5% (mid-band),
population 73, supply −17.7%, treasury solvent**; the freeze falsifier = the BMR property (not
a thermostat failure). The sim→contract mapping: the ATP share 0.370 → `S_c = 6×10^14`
(the contract share 0.375 — invariant to the feed size).

**Installed in the contract**: `feed_strain` computes `atp_minted` BEFORE the thermostat and
adds `atp_minted × ATP_VOLUME_SCALE` to the same epoch's `volume_epoch`
(`apply_thermostat_fee(strain_id, fee, extra_volume)`).

The history of the initial proposal resolution (the pure multi-leg Option) is kept below for the audit trail.

## 5. Trace

- Calibration: econ-report-3, the output of `scripts/econ-calib-opsib.mjs` (summary: `docs/econ-sweep-opsib.md`).
- Installation: pipeline #4 (the `EN-114..119` commit — `TermostatParams`, `add_volume_legs`).
- Locking tests: `qa_en117_tests::tc_en117_atp_enters_v_epoch` (the ATP leg lands in `V_epoch`),
  `econ111_volume_multi_legs_and_exclusions` (the K2/K3/K4 legs + the exclusions).
  Note: an earlier version of this line cited `qa_macro_tests::tc_macro_*` and
  `qa_svg_tests::tc_svg_02/03` — those test modules do not exist in the repo (stale citation, corrected).
