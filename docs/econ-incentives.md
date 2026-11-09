# ECON-109 — Long-Term Incentive Design (honest, no profit promise)

> Snacc incentive design summary for horizons beyond 1 month. All numbers from the Kamus Angka Resmi +
> ECON-111 FINAL + §13a. `$SNACC` on testnet has no monetary value; **no profit guarantee**; forbidden
> framing: the words investment and yield are banned (honesty rule). This is an economic design document —
> not a revenue projection.

## 1. Core principles

1. **Profit = work + redistribution** — no passive faucet. Every `PF-01..09` flow
   (vault Profit Model) demands a production/risk action: 3-stage `NEP-245`, M&A, liquidation,
   NPC market-making, feed timing.
2. **Supply only shrinks** (`DK-010`) — no minting after hatch; incentives come from *redistributing*
   burned/collected fees, not inflation.
3. **Anti-farming**: rebate/discount/dividends are always **below the fee** paid (`DK-030`; loop-tested
   1,000 actions — `qa_macro`/`sec109`); the subsidy quota is bounded by `I-04` (5% Pantry/epoch, shared
   with the burst discount).
4. **Controlled population** (`EN-124`): free reproduction (divide) needs a "demographic budget"
   from mergers/liquidations — growth without work is impossible.

## 2. The long-term incentive loop

| Loop | Incentive | The brake that guards it |
| --- | --- | --- |
| 3-stage production | Recipe margin × `efficiency_bps` (TEE can raise it up to +1500 bps) | ATP cost per job; catalyst fee; Fever burn when busy |
| Feed timing | Nutrient Burst (1-epoch discount), rescue feeding (cheap when starving), dormancy | the `I-04` quota cap; risk of being raided while starving |
| M&A | The dominant strain absorbs `role_mask`/efficiency (up to the `0b111` full stack) | 2.5% tax to Pantry; hostile premium +15% |
| Liquidation | Permissionless 10% bounty | only Tier 3; death = an economic event (burst), not a silent loss |
| Dividends | 50% of non-burn fees split pro-rata to aether contributors | 8-epoch claim window; the pool never goes negative; not a fixed return |
| NPC market-making | Scarcity spread `P_base × S_target/S_after` | exact cash conservation `I-15`; the NPC is not a faucet |
| Great Feast | Goldilocks bonus/verdict (collective coordination) | 5% Pantry cap; missing → Fever/Famine |

## 3. Long-term equilibrium (from the ECON-111 calibration)

- 10,000-epoch sweep at the chosen calibration (`VOLUME_SCALE = 5`, Fever 610 mK — see
  `docs/econ-sweep-opsib.md`): Fever 5.9%, Hypothermia 93.0%, final population 95, treasury solvent,
  **no death spiral**; the baseline-velocity run in `docs/econ-sim.md` ends at supply 883,956
  (−11.6% per 10k epochs), deflationary but alive.
- The Fever target (5.9% of epochs active) creates scarcity cycles without killing the population.
- Dormancy lets colonies run lean when quiet — the economy can "rest" without dying.

## 4. Known risks

1. **Wealth concentration**: volume-proportional rebate favors large strains (velocity model) —
   design mitigation: colony feed distribution + colony fences.
2. **Keeper indifference**: `advance_epoch` is permissionless — anyone may advance the epoch
   (incentive-neutral; the outcome is deterministic).
3. **NPC stock**: genesis stock is finite; the NPC restock mechanism is not yet specified —
   considered an open item, not a promise.
4. **Solvency aggregates**: `get_global_solvency` is valid for post-deploy ledger state;
   legacy state needs migration (reported in `docs/security-audit.md`).

## 5. What is NOT promised

- No fixed return / fixed payout rate; no target price; no buyback promise.
- Dividends can be 0 if nobody produces (empty pool — `ERR_DIVIDEND_POOL_EMPTY`).
- All mechanics can change via owner decision before mainnet.
