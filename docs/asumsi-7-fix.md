# ASSUMPTION #7 (external onboarding) — investigating a "supply leak" in the simulation

Status: the investigation finished on 2026-11-08. Scope: `scripts/econ-sim.mjs` + docs. The contract was not touched. `$SNACC` testnet has no monetary value.

## The honest conclusion

**ASSUMPTION #7 does not mint supply. The −44.2 million discrepancy in `demo:e2e` is a measuring error in the demo e2e script's formula, not a model leak.** `econ-report-1..4` are unaffected: after the investigation, all key metrics are identical (diff = 0) for the fixed, velocity, Option B (VOLUME_SCALE=5), and ATP-variant configurations.

There is one other real problem, now documented: onboarding **runs out** around epoch 799; it does not run for 10,000 epochs as the old text suggested.

## 1. The root code line

`scripts/econ-sim.mjs`, phase 3 (onboarding):

```js
const extPool = totalSupply - treasury - alchemistPool - Σ strain.balance;   // the external-holder residual
const inflow  = Math.min(A.EXTERNAL_INFLOW, Math.max(0, extPool));            // capped by extPool
alchemistPool += inflow;
```

The inflow is taken from the external-holder residual and capped by it, so `totalSupply` does not change. The formula in the demo e2e script (beat 2) that produced −44.2 million:

```js
totalDistribusi = treasuryFinal + totalRebate + Σ finalBalances + bountyPaid
selisih = supplyFinal + totalBurned - totalDistribusi
```

is wrong for two reasons: (a) `totalRebate` is a **cumulative flow** of treasury → strain that recycles every Hypothermia epoch (44,401,753 under Option B); summing it with the final balances counts the same money twice; (b) `bountyPaid` is already inside `alchemistPool`, and `alchemistPool`/the external holders are not counted at all. The resulting figure is exactly 45,243,163 = 258,608 + 44,401,753 + 581,934 + 868 — the same as the initial finding.

## 2. Evidence: exact closed conservation (Option B, seed 2071114)

An independent ledger was added to `runSimulation` (`result.conservation`): the external-holder balance is tracked explicitly, then compared against the residual every epoch. The result on all 4 configurations: `maxAbsDrift = 0`, `minResidual = 0` (never negative), `closes = true`.

| Component (Option B, after 10,000 epochs) | $SNACC |
| --- | ---: |
| Treasury | 258,608 |
| The alchemist wallet | 868 |
| Σ strain balances (95 alive) | 581,934 |
| External holders | 0 |
| **Sum = `supplyFinal`** | **841,410** |
| `totalBurned` | 158,590 |
| Initial supply (= 841,410 + 158,590) | 1,000,000 |

The correct formula: `supply = treasury + alchemists + Σ strains + external` (a 0 discrepancy). The old formula: a −44,243,163 discrepancy.

## 3. Impact: before / after

"Before" = the code before instrumentation; "after" = after it. The metrics are identical because the instrumentation only reads state (verified with a JSON comparison of all metrics).

| Configuration | Fever% | Hypo% | Final supply | Alive | Median balance | Changed? |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| fixed | 0.00 | 100.00 | 1,000,000 | 96 | 7,018 | no |
| velocity | 41.69 | 29.22 | 935,365 | 6 | 148,536 | no |
| Option B (report-3, VOLUME_SCALE=5, Fever 610) | 5.86 | 92.96 | 841,410 | 95 | 4,950 | no |

### The comparison variant: what if #7 really did mint supply?

`exogenousInflow: true` (optional, not the default) injects 1,000/epoch from nowhere and records it as `totalExogenous`:

| Option B | Default (finite, no minting) | Exogenous (mints) |
| --- | ---: | ---: |
| Final supply | 841,410 | 11,000,000 (10,000,000 minted) |
| Fever% | 5.86 | **0.00** |
| Alive | 95 | 323 |
| Median balance | 4,950 | 2,846 |
| Inside the 5–30% Fever band | yes | **no** |

That means: if #7 minted, `CrucibleTemp = 1000 × V/M` would be diluted 11× by the supply and the Fever zone would vanish across the whole ATP sweep (Fever ≤ 0.43%). This is the reason the default option was chosen: **an honest funding source (finite external holders)**, not an exogenous injection. The exogenous option is kept only as a comparison.

## 4. A light re-sweep — `econ-report-4` (ATP, Option B, `S` = ATP_VOLUME_SCALE)

All default rows match the pre-fix values; Fever stays inside 5–30% for every tested S:

| S | Fever% | Hypo% | Alive | Median | The 5–30% band |
| ---: | ---: | ---: | ---: | ---: | :-: |
| 0 | 5.86 | 92.96 | 95 | 4,950 | yes |
| 1,000 | 5.24 | 93.49 | 87 | 6,209 | yes |
| 3,000 | 8.46 | 89.98 | 73 | 7,564 | yes |
| 5,000 | 10.99 | 87.57 | 63 | 8,652 | yes |
| 10,000 | 16.22 | 82.15 | 49 | 12,427 | yes |
| 15,000 | 23.77 | 74.87 | 40 | 14,624 | yes |

A limitation of this sweep: the `S` scale used by `econ-calib-atp.mjs` (0–15,000) is the sim scale; the contract uses ATP with a different unit (see `docs/en-117-resolution.md`, `S_c = 6e14`). Running `S = 6e14` directly in the sim kills the whole population (0 alive) because V far exceeds the supply; that is a unit difference between the sim and the contract, not a consequence of this fix, and it has not been reconciled here.

## 5. What changed in the code

- `scripts/econ-sim.mjs`: an independent conservation ledger + the `result.conservation`, `alchemistPoolFinal`, `strainsBalanceFinal`, `externalPoolFinal`, `totalInflow`, `externalExhaustedEpoch` fields; the `exogenousInflow` option (for comparison); the ASSUMPTION #7 text clarified. The default behavior did not change.
- `docs/econ-sim.md`: ASSUMPTION #7 updated (regenerated from the template).

## 6. The honest limits of ASSUMPTION #7 (a model, not a bug)

1. The initial external holders hold only 800,000 $SNACC, so onboarding runs out around epoch ~799 (Option B). After that there is no new money; "1,000/epoch" does not run for the full 10,000 epochs.
2. The flow is one-way: no holder ever sells out. The model does not capture sell pressure.
3. The alchemist/incubation selection is gated by `alchemistPool ≥ INCUBATION_STAKE`, so the population size depends directly on this assumption.

## 7. Recommendations

- **Keep the calibration** `VOLUME_SCALE = 5` (report-3) and the ATP scale (report-4). No numbers moved; no recalibration needed.
- **Fix the beat 2 formula in the demo e2e script**: the correct identity is `supplyFinal == treasuryFinal + alchemistPoolFinal + strainsBalanceFinal + externalPoolFinal` plus an assertion `sim.conservation.closes === true` (hard fail when it does not); drop the `totalRebate`/`bountyPaid` summing and the "ASSUMPTION #7 leak" text. The demo e2e script and the conservation ledger (`result.conservation`) are not yet in the public `scripts` repo; this section only records the diagnosis and the correct formula.
- If you want onboarding to run for the full 10,000 epochs, raise `ALCHEMIST_POOL_INIT`/the external holders or model the inflow as an exogenous injection **and** report it separately as "an exogenous injection" — but that changes the calibration (see the variant table, Fever collapses) and must be re-swept.
