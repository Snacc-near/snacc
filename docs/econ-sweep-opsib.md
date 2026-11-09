# ECON-111 — The VOLUME_SCALE Sweep (the Option B definition, seed 2071114)

Generated automatically by `scripts/econ-calib-opsib.mjs` — 20 scales × 10,000 epochs, the `legs` volume model (Option B).

## The Option B definition — V_epoch = a multi-leg gross economic turnover

Measured per epoch from the production actions recorded by the contract. The base unit: `$SNACC` (testnet).
`VOLUME_SCALE` (a unit) is the $SNACC-equivalent value multiplier **per molecule unit** on the K2/K3 legs —
a molecule economic unit, NOT a cash multiplier.

| Leg | On-chain source | Formula | Unit |
| --- | --- | --- | --- |
| K1 | `snacc_catalyst_fee` (F2/F4) | the fee per tx, summed | $SNACC (×1) |
| K2 | `mt_burn` of the 9 molecules (F2/F5/F6) | units_burned × VOLUME_SCALE × P_BASE | $SNACC-equivalent |
| K3 | `mt_mint` of the 9 molecules (F2/F5) | units_minted × VOLUME_SCALE × P_BASE | $SNACC-equivalent |
| K4 | non-fee $SNACC cash mutations: liquidation cash (F6) | the bounty + recovery that change hands | $SNACC (×1) |

**Inclusions:** all production actions (extract/transmute/synthesize) for K1–K3; liquidation for K4.
**Exclusions (anti-feedback into the temperature):** the I-04 rebate, the DK-033 dividend claims, transfers between accounts
(`ft_transfer`), and the F1 incubation capital — all internal/capital transfers, not production turnover.
The temperature formula is unchanged: `CrucibleTemp = floor(1000 × V_decayed / max(M,1))` (ADR-04),
`V_decayed = max(0, V_epoch − 3600 × 50)` (ADR-27); the 1400/600 thresholds are NOT changed.

The leg breakdown at scale 6 (the baseline): K1 fee: 40,883,600 · K2 mt_burn: 2,453,016,000 · K3 mt_mint: 2,453,016,000 · K4 liquidation: 10,288.

## The sweep table (a 10,000-epoch baseline, the legs model)

| VOLUME_SCALE | Fever | Hypo | Normal | Temp p50 | Temp p85 | Final population | Median balance | Final supply | Treasury min | Total burn | Total rebate | Treasury | In band? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.0% | 100.0% | 0.0% | 0 | 42 | 158 | 2,384 | 1,000,000 | 41,258 | 0 | 65,118,749 | solvent | — |
| 2 | 0.0% | 100.0% | 0.0% | 61 | 254 | 158 | 2,384 | 1,000,000 | 41,258 | 0 | 65,118,749 | solvent | — |
| 3 | 0.0% | 99.7% | 0.3% | 167 | 436 | 157 | 2,527 | 1,000,000 | 41,258 | 0 | 62,519,695 | solvent | — |
| 4 | 0.0% | 96.9% | 3.1% | 233 | 500 | 129 | 3,982 | 1,000,000 | 41,258 | 0 | 54,471,900 | solvent | — |
| 5 | 0.0% | 94.0% | 6.0% | 274 | 537 | 106 | 5,533 | 1,000,000 | 41,258 | 0 | 47,123,582 | solvent | — |
| 6 | 0.0% | 92.3% | 7.7% | 304 | 558 | 89 | 7,529 | 1,000,000 | 41,258 | 0 | 40,862,762 | solvent | — |
| 7 | 0.0% | 87.4% | 12.6% | 341 | 581 | 80 | 8,778 | 1,000,000 | 41,258 | 0 | 37,271,347 | solvent | — |
| 8 | 0.0% | 84.5% | 15.5% | 367 | 608 | 71 | 10,460 | 1,000,000 | 41,258 | 0 | 33,402,061 | solvent | — |
| 9 | 0.0% | 85.4% | 14.6% | 363 | 598 | 63 | 12,780 | 1,000,000 | 41,258 | 0 | 29,789,440 | solvent | — |
| 10 | 0.0% | 82.2% | 17.8% | 362 | 624 | 57 | 14,222 | 1,000,000 | 41,258 | 0 | 27,258,157 | solvent | — |
| 12 | 0.0% | 81.5% | 18.5% | 374 | 615 | 48 | 16,701 | 1,000,000 | 41,258 | 0 | 23,197,882 | solvent | — |
| 15 | 0.0% | 73.6% | 26.4% | 422 | 662 | 40 | 21,734 | 1,000,000 | 41,258 | 0 | 19,574,615 | solvent | — |
| 20 | 0.0% | 72.3% | 27.7% | 421 | 702 | 30 | 30,365 | 1,000,000 | 32,058 | 0 | 15,214,461 | solvent | — |
| 30 | 0.6% | 52.2% | 47.2% | 544 | 906 | 25 | 33,401 | 994,457 | 28,474 | 5,543 | 12,400,228 | solvent | — |
| 40 | 3.3% | 58.3% | 38.4% | 473 | 884 | 17 | 52,077 | 973,801 | 19,392 | 26,199 | 8,997,263 | solvent | — |
| 60 | 18.6% | 32.3% | 49.1% | 908 | 1,509 | 17 | 40,622 | 901,005 | 23,372 | 98,995 | 8,853,930 | solvent | — |
| 80 | 8.0% | 45.6% | 46.4% | 643 | 1,142 | 10 | 89,916 | 962,325 | 13,328 | 37,675 | 5,390,137 | solvent | — |
| 100 | 16.2% | 37.9% | 45.9% | 662 | 1,458 | 8 | 116,374 | 935,905 | 11,640 | 64,095 | 5,082,448 | solvent | — |
| 150 | 44.0% | 21.4% | 34.6% | 1,144 | 2,099 | 9 | 97,961 | 890,100 | 29,584 | 109,900 | 4,772,078 | solvent | — |
| 200 | 52.8% | 14.5% | 32.8% | 1,466 | 2,416 | 7 | 115,841 | 893,313 | 42,027 | 106,687 | 4,019,974 | solvent | — |

**The band criteria** (stated explicitly): Fever 5–30% · a final population ≥ 100 (≥50% of 200) and
a median balance > 0 · the treasury never negative and a minimum > 0 · no death spiral.
"Hypothermia when idle" is verified separately via the freeze scenario below.

## The freeze falsification (epochs 3000–3500 without activity) on the band candidates

| VOLUME_SCALE | Fever | Hypo | Final population | Treasury min | Death spiral |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.0% | 100.0% | 0 | 41,258 | YES |
| 2 | 0.0% | 100.0% | 0 | 41,258 | YES |
| 3 | 0.0% | 100.0% | 0 | 41,258 | YES |

### The fallback search (a healthy scale × FEVER' > 600; HYPOTHERMIA stays 600)

| Scale | FEVER' | Fever | Population | In band (fever 5–30%, no spiral, normal > 0) |
| --- | --- | --- | --- | --- |
| 6 | 610 | 6.9% | 80 | ✅ |
| 6 | 620 | 4.4% | 82 | — |
| 6 | 650 | 3.4% | 85 | — |
| 5 | 610 | 5.9% | 95 | ✅ |
| 5 | 620 | 4.3% | 97 | — |
| 5 | 650 | 2.1% | 100 | — |
| 4 | 610 | 2.5% | 118 | — |
| 4 | 620 | 1.6% | 122 | — |
| 4 | 650 | 0.6% | 125 | — |
| 3 | 610 | 0.2% | 153 | — |
| 3 | 620 | 0.1% | 153 | — |
| 3 | 650 | 0.0% | 157 | — |
| 2 | 610 | 0.0% | 158 | — |
| 2 | 620 | 0.0% | 158 | — |
| 2 | 650 | 0.0% | 158 | — |
| 1 | 610 | 0.0% | 158 | — |
| 1 | 620 | 0.0% | 158 | — |
| 1 | 650 | 0.0% | 158 | — |

## Verification of the proposed fallback threshold (if the band is unreachable)

- `FEVER=610 mK, HYPOTHERMIA=600 mK (unchanged), scale 5`: Fever 5.9% · Hypo 93.0% · Normal 1.2% · population 95 · median 4,950 · treasury min 41,258 · burn 158,590 · rebate 44,401,753 · death spiral NO — **IN BAND**
- `FEVER=610 mK, HYPOTHERMIA=600 mK (unchanged), scale 5, FREEZE`: Fever 0.7% · Hypo 99.1% · Normal 0.1% · population 0 · median 0 · treasury min 41,258 · burn 20,242 · rebate 12,165,018 · death spiral YES

## The NPC P_base (proposed)

Derived from the sweep economy — see econ-report-3 (the output of `scripts/econ-calib-opsib.mjs`) for the full argument.
The catalyst fee per tx = 100 $SNACC; one cycle turns over 10 molecules;
the turnover per tx at scale 6 ≈ 12,100 $SNACC-equivalent.
