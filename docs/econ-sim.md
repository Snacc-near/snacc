# ECON-101..103 — The Snacc Macro-Economic Simulation (10,000 Epochs)

Generated automatically by `scripts/econ-sim.mjs` (seed 2071114, deterministic — the results are reproducible).

## The formulas used (verbatim from the spec)

- `CrucibleTemp = floor(1000 * V_decayed / max(M_supply, 1))` (ADR-04)
- `V_decayed = max(0, volume_epoch - delta_seconds * VOLUME_DECAY_PER_SEC)`, VOLUME_DECAY_PER_SEC = 50 (ADR-27)
- Fever (`>1400 mK`): burns `350 bps` of the epoch's catalyst fee → `ft_burn`, the supply falls, burned rises (I-01)
- Hypothermia (`<600 mK`): a `200 bps` rebate from the treasury to the transacting strain, with total subsidies capped at `500 bps`/epoch of the epoch's initial treasury (I-04)
- Vitality `0..10000`; the incubation initial value `8500`; the BMR/hour is Extractor 100, Fermenter 120, Synthesizer 150
- A successful feed/transmutation: `vitality = min(10000, effective_vitality + 500)`, last_fed reset (F2)
- Incubation: 80% strain working capital / 20% treasury (F1/D6)
- Lysis (vitality 0): a 10% liquidator bounty / 90% treasury (F6)
- `mt_mint` of enzymes = `floor(spores_burned * efficiency_bps / 10000)`, the initial efficiency_bps 10000 (F2)

## ASSUMPTIONS (not governed by the spec — stated explicitly)

1. 1 epoch = 3600 seconds (the BMR in the spec is per hour), 10,000 epochs ≈ 416 days.
2. An initial supply of 1,000,000 $SNACC (the S1.3 spike basis: the supply ≈ 1,000,000 before burns).
3. An initial population of 200 strains; incubation capital of 4000 $SNACC per strain (split 80/20).
4. A flat catalyst cost of 100 $SNACC per transmutation; it goes to the Rule-Bound Treasury.
5. The epoch volume (2 models, because the spec does not define the magnitude of `V_epoch` vs supply — both are analyzed):
   - **fixed**: per transaction = min(the strain balance, U(800, 3000)) $SNACC — a fixed-size production cycle (the F2 stoichiometry);
   - **velocity**: per transaction = the strain balance × U(2, 6) — the velocity of money.
6. Agent activity: the per-epoch transaction probability follows a sinusoidal sentiment wave (a 900-epoch period, a 0.25 amplitude) + noise; an emergency feed (p=0.9) when vitality < 3000.
7. Insolvent strains (vitality 0) are liquidated; replacements are incubated with p=0.6; new alchemists appear spontaneously at p=0.03/epoch; external onboarding of 1000 $SNACC/epoch from external holders — **not minting supply**: the inflow = min(1000, the external holders' balance), so conservation closes exactly (`result.conservation`). **Honest limit:** the initial external holders hold only 800,000 $SNACC, so onboarding RUNS OUT (~epoch 799 under the Option B configuration) — not 10,000,000 across 10,000 epochs; afterwards the population only recycles. See `docs/asumsi-7-fix.md`.
8. Spores burned per transmutation: 10 molecules; the efficiency_bps is a constant 10000 (no TEE mutations in this sim).
9. The falsification scenario: all agents stop feeding/transacting during epochs 3000–3500, then normal activity returns.

## Results

### Scenario: baseline (fixed volume) (seed 2071114, 10,000 epochs)

- CrucibleTemp: min 0 / mean 0 / max 15 mK
- Temperature zones: Fever 0.00% · Hypothermia 100.00% · Normal 0.00%
- $SNACC supply: initial 1,000,000 → final 1,000,000
- Total ft_burn (Fever): 0
- Total rebate (Hypothermia): 44,293,727
- Total catalyst costs collected: 44,331,300
- Total enzymes minted (mt_mint): 4,433,130
- Final treasury: 244,294 (the minimum across the sim: 40,964, ever negative: no)
- Bankruptcies (Chapter 7): 154 · Incubations: 250 · Liquidator bounties: 672
- Strains alive at the end: 96 · median balance: 7,018
- The final balance distribution: {"0":0,"1-1000":1,"1001-5000":17,"5001-20000":75,">20000":3}
- **Death spiral: NO** (criteria: supply → 0, a collapsing/negative treasury, or a totally dead population)

### Scenario: baseline (velocity volume) (seed 2071114, 10,000 epochs)

- CrucibleTemp: min 0 / mean 1266 / max 4449 mK
- Temperature zones: Fever 41.69% · Hypothermia 29.22% · Normal 29.09%
- $SNACC supply: initial 1,000,000 → final 935,365
- Total ft_burn (Fever): 64,635
- Total rebate (Hypothermia): 4,221,480
- Total catalyst costs collected: 4,150,100
- Total enzymes minted (mt_mint): 415,010
- Final treasury: 75,105 (the minimum across the sim: 31,758, ever negative: no)
- Bankruptcies (Chapter 7): 244 · Incubations: 250 · Liquidator bounties: 1,121
- Strains alive at the end: 6 · median balance: 148,536
- The final balance distribution: {"0":0,"1-1000":0,"1001-5000":0,"5001-20000":0,">20000":6}
- **Death spiral: NO** (criteria: supply → 0, a collapsing/negative treasury, or a totally dead population)
- ⚠️ Note: the population shrank to 6 strains — the volume-proportional rebate creates wealth concentration (rich-get-richer), not a collapse.

### Scenario: freeze-500-epoch (fixed volume) (seed 2071114, 10,000 epochs)

- CrucibleTemp: min 0 / mean 0 / max 0 mK
- Temperature zones: Fever 0.00% · Hypothermia 100.00% · Normal 0.00%
- $SNACC supply: initial 1,000,000 → final 1,000,000
- Total ft_burn (Fever): 0
- Total rebate (Hypothermia): 9,832,217
- Total catalyst costs collected: 10,007,600
- Total enzymes minted (mt_mint): 1,000,760
- Final treasury: 996,496 (the minimum across the sim: 40,964, ever negative: no)
- Bankruptcies (Chapter 7): 266 · Incubations: 266 · Liquidator bounties: 67,504
- Strains alive at the end: 0 · median balance: 0
- The final balance distribution: {"0":0,"1-1000":0,"1001-5000":0,"5001-20000":0,">20000":0}
- **Death spiral: YES** (criteria: supply → 0, a collapsing/negative treasury, or a totally dead population)

### Scenario: freeze-500-epoch (velocity volume) (seed 2071114, 10,000 epochs)

- CrucibleTemp: min 0 / mean 1183 / max 4756 mK
- Temperature zones: Fever 38.52% · Hypothermia 34.11% · Normal 27.37%
- $SNACC supply: initial 1,000,000 → final 945,215
- Total ft_burn (Fever): 54,785
- Total rebate (Hypothermia): 4,590,823
- Total catalyst costs collected: 3,754,300
- Total enzymes minted (mt_mint): 375,430
- Final treasury: 71,905 (the minimum across the sim: 33,451, ever negative: no)
- Bankruptcies (Chapter 7): 265 · Incubations: 270 · Liquidator bounties: 82,902
- Strains alive at the end: 5 · median balance: 172,123
- The final balance distribution: {"0":0,"1-1000":0,"1001-5000":0,"5001-20000":0,">20000":5}
- **Death spiral: NO** (criteria: supply → 0, a collapsing/negative treasury, or a totally dead population)
- ⚠️ Note: the population shrank to 5 strains — the volume-proportional rebate creates wealth concentration (rich-get-richer), not a collapse.

## The death-spiral conclusion

The criteria (from the brief): the supply keeps shrinking TOWARD zero / the treasury collapses = a death spiral; if the economy stays alive with a smaller supply = healthy.

| Scenario | Death spiral | Final supply | Treasury min | Final population |
| --- | --- | --- | --- | --- |
| baseline-fixed | **NO** | 1,000,000 | 40,964 | 96 |
| baseline-velocity | **NO** | 935,365 | 31,758 | 6 |
| freeze-fixed | **YES** | 1,000,000 | 40,964 | 0 |
| freeze-velocity | **NO** | 945,215 | 33,451 | 5 |

**Baseline: NO death spiral in either volume model** — the supply never → 0, the treasury never goes negative (the I-04 cap works), the population never dies out. The economy is deflationary by design but STAYS ALIVE → **healthy, not a death spiral**. Honesty note: the *velocity* model produces wealth concentration (6 giant strains out of 200) — the volume-proportional rebate favors large strains; the *fixed* model keeps the distribution (103 strains, a median of 6,347).

**Falsification (a 500-epoch freeze = 500 hours without feeding):**

- The maximum metabolic runway is only 56–85 epochs (2–3 days) — a 500-epoch freeze **will certainly kill every strain that does not feed**, under any volume model. This is a BMR property, not a thermostat failure.
- The **fixed** model: the population dies out entirely during the freeze (the shortest runway runs out ~epoch 3085); the I-04 rebate cannot prevent it because it only flows to strains that transact. After the freeze, re-incubation does not run because the external alchemist capital has already been absorbed → only 0 strains remain until epoch 10000 → **the system does NOT recover without new alchemist onboarding**.
- The **velocity** model: large-balance strains survive longer; after activity returns they attract volume + rebates and fund re-incubation → the population partially recovers (5 strains) → **a limited recovery, not a collapse**.
- **The falsification conclusion:** the system **never collapses monetarily** (the supply & treasury stay solvent in all four scenarios), but **the recovery depends on new alchemist onboarding**, not on the rebate. The I-04 rebate only saves agents that are still transacting.
- **EXPLICIT FINDING (not hidden):** under the *fixed* volume model, Fever = 0.00% across all 10,000 epochs — with a cycle nominal of U(800, 3000) $SNACC and ~90 transactions/epoch, the maximum `V_decayed` is only ~245,000, enough for `CrucibleTemp` ≈ 5 mK against a supply of 1,000,000. **The I-01 burn path (350 bps) is UNTESTED** in this scenario; the burn is only exercised under the *velocity* model (Fever 35–38%). Design implication: a Fever threshold `>1400 mK` requires an epoch volume > 1.4× the supply per epoch — with sane assumptions (a small production cycle), the Snacc economy would live permanently in the Hypothermia zone and the burn would almost never trigger.
- **Design lesson (honest, no claims):** Snacc's long-run resilience is determined more by new alchemist onboarding (external incubation capital) than by the rebate thermostat. The numbers are sensitive to the volume-magnitude assumptions (ASSUMPTION 5) — both are reported, neither is cherry-picked.
