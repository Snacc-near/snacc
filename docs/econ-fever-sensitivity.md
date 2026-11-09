# The `CrucibleTemp > 1400 mK` Fever-threshold sensitivity (a follow-up to the ECON-101..103 findings)

Generated automatically by `scripts/econ-fever-sensitivity.mjs` (seed 2071114, 10,000 epochs, the main model: baseline-velocity). No contract formula/parameter was changed — this is an analysis for the owner's decision.

## 1. The exact threshold (the formula, no simulation)

From ADR-04 + ADR-27 (the contract formula, unchanged):

```
CrucibleTemp = floor(1000 × V_decayed / max(M_supply, 1)) > 1400 mK
⇔ V_decayed > 1.4 × M_supply          (the threshold is a strict ">"; exactly 1400 mK is NOT Fever)
⇔ V_epoch  > 1.4 × M_supply + Δt_seconds × VOLUME_DECAY_PER_SEC
```

With an initial supply M = 1,000,000 and Δt = 3600 s (1 epoch):

- **The minimum V_decayed for Fever: 1,401,000 $SNACC = 1.4× M_supply.**
- **The minimum V_epoch (gross, before decay): 1,581,000 $SNACC per epoch** (= 1.4× M + 180,000 of decay consumption).
- Meaning: **the epoch volume must exceed 140% of the total supply** for the I-01 burn to activate. For comparison, the Hypothermia upper bound: V_decayed ≤ 599,999 (0.6× M).
- Decay consumes 18.0% of the supply per epoch (180,000 $SNACC/epoch).

## 2. The calibration sweep — % of epochs per temperature zone

The interpretation of `volumeScale` (an ASSUMPTION, explicit): V_epoch counts the **gross protocol volume** — one transmutation involves a $SNACC payment + two-way NEP-245 transfers + receipts/verification; when all legs are counted, the measured volume is a multiple of the cycle nominal. The scale does NOT change balances/fees/behavior — only the V_epoch measurement.

| Model | Scale | Fever | Hypothermia | Normal | Mean temp (mK) | Max temp (mK) | Total burn | Treasury min | Final population |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| velocity | ×1 | 37.60% | 31.44% | 30.96% | 1190 | 4594 | 58,214 | 20,248 | 6 |
| velocity | ×3 | 68.09% | 10.80% | 21.11% | 2274 | 8253 | 153,647 | 40,964 | 10 |
| velocity | ×5 | 69.47% | 9.09% | 21.44% | 2572 | 10360 | 144,086 | 41,800 | 8 |
| velocity | ×10 | 76.22% | 6.78% | 17.00% | 2910 | 12735 | 126,852 | 41,737 | 7 |
| velocity | ×25 | 79.07% | 10.06% | 10.87% | 3333 | 13761 | 109,358 | 41,737 | 4 |
| velocity | ×50 | 76.46% | 17.60% | 5.94% | 4077 | 21621 | 83,965 | 41,737 | 3 |
| velocity | ×100 | 71.78% | 24.47% | 3.75% | 5441 | 40234 | 68,422 | 41,737 | 2 |
| velocity | ×200 | 74.10% | 23.64% | 2.26% | 9611 | 71205 | 66,757 | 41,737 | 2 |
| velocity | ×500 | 63.68% | 35.24% | 1.08% | 15580 | 178283 | 51,844 | 41,737 | 1 |
| fixed | ×1 | 0.00% | 100.00% | 0.00% | 0 | 5 | 0 | 40,964 | 103 |
| fixed | ×10 | 0.00% | 100.00% | 0.00% | 0 | 48 | 0 | 10,386 | 9 |
| fixed | ×50 | 0.00% | 100.00% | 0.00% | 42 | 388 | 0 | 6,495 | 4 |
| fixed | ×100 | 0.00% | 99.46% | 0.54% | 125 | 737 | 0 | 6,045 | 3 |

### The range that makes Fever reach a sane periodic level (the 5–30% epoch target)

**not found within the tested scales**

## 3. Extrapolation: can Fever be reached just because the supply shrinks?

Without changing the volume: Fever is reached when M ≤ mean V_decayed / 1.4 ≈ **850,000 $SNACC**. With the baseline burn rate (5.8 $SNACC/epoch), from M = 1,000,000 it takes ≈**26 thousand epochs (≈3 years of epoch-time)** — far beyond the 10,000-epoch horizon. **Conclusion: supply shrinkage alone will never activate Fever within a relevant horizon.**

## 4. Recommendations — OPTIONS for the owner (without changing anything in the contract)

| Option | Contents | Trade-off |
| --- | --- | --- |
| **A. Accept as-is** | Document it honestly: the Snacc thermostat is effectively one-way (the Hypothermia rebate activates; Fever/burn is practically never triggered for a small-cycle economy). Fever becomes a "theoretical ceiling". | The most honest & zero work. But `ft_burn`/I-01 and "reactive supply" are weak as a `memecoins` track differentiator — competitors/judges could highlight an untested burn path on mainnet. |
| **B. Change the V_epoch definition (not the formula)** | Count V_epoch as a **multi-leg gross volume** (the $SNACC payment + the NEP-245 transfers + the TEE claim each counted) — equivalent to volumeScale 3–10 in the sweep. | It does not touch the ADR-04 formula/the 1400 threshold. But it requires deciding what "counts as volume" — there is a cosmetic metric-inflation risk (a strict per-leg definition is needed). |
| **C. Change the threshold/numbers (1400/600 mK)** | E.g. Fever > 140 mK (V_decayed > 0.14× M) so it is reached periodically by a real economy. | Changing the official dictionary numbers (Model Data) = a spec change + all derivative documents; the most invasive; needs a new design justification. |
| **D. Production scale (game-side)** | Raise the real production-cycle nominals (not just the measurement) — e.g. incubation capital & catalysts ×50 — so that the real V_epoch approaches 1.4× M. | It changes the whole economic balance (capital, fees, liquidation); the sweep shows fixed ×100 still gives 0% Fever (it needs > ×1000) — a full re-balancing & very invasive. |

**Patterns from the sweep (read before choosing):**

- The **fixed** model even at ×100 still gives 0.00% Fever (max 737 mK) — **the only realistic path to periodic Fever is the multi-leg gross-volume interpretation (Option B)**, not a small-cycle scale.
- The **velocity** model is already at 37.6% Fever at ×1 (the ECON-101..103 baseline) — but it is very sensitive: ×3 jumps to 68%, and at every velocity scale ≥ ×3 the population collapses (10 → 1 strain; extreme concentration).
- **No tested scale produces 5–30% Fever without population side effects.** The configuration closest to the target zone: velocity ×50–×100 (Fever 72–76%) — still far above the target; conversely, the fixed model needs an untested scale > ×1000.
- **The honest implication:** a threshold of 1400 mK = 140% supply per epoch sits between two regimes — a small-cycle economy (fixed) never touches it, a high-velocity economy blows right past it. The threshold design needs recalibrating against the chosen V_epoch definition (Option B), not just scaling. The decision stays with the owner; this document only lists options + numbers.

## 5. Honesty notes

- The sweep numbers depend on the ASSUMPTION of the agent activity model (sentiment waves, etc. — see the ECON-101..103 ASSUMPTIONS); the **non-linear** patterns (Fever rising sharply near the threshold) are more trustworthy than exact point values.
- No contract/spec change was made; the 1400/600 mK thresholds and VOLUME_DECAY_PER_SEC = 50 stay exactly as in the vault.
