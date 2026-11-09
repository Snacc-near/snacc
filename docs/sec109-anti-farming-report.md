# SEC-109 — Anti-Farming Numbers Report (DK-030)

Only numbers observed in the test runs below are reported. `$SNACC` is testnet-only and has no
monetary value; this report makes no claim about real-world returns.

## Test under measurement

- `contracts:snacc/src/lib.rs` — `sec109_dk030_feed_loop_and_dividend_nets_loss` (SEC-109 / DK-030).
- Setup in the test: strain 1 (Extractor) incubated with 1,000,000,000; strain 2 (Synthesizer)
  incubated with 1,000,000,000; `dormancy_threshold_bps = 0`; `epoch_treasury_initial = treasury`.
- Action: 1,000 × `feed_strain(1, U128(1_000))`, then the dividend path
  (`synthesize_and_redeem_aether(2, 1)` → `advance_epoch()` → `claim_industrial_dividend(2, 0)`).

## How the numbers were obtained

1. `cargo test sec109 -- --nocapture` in `contracts:` — the test passes (1 passed, 261 filtered out).
   The shipped test prints no numbers, so its assertions alone do not satisfy the backlog DoD.
2. The same test source was copied to a scratch directory (`/tmp/snacc-scratch-sec109`, never
   committed) and instrumented to write the observed balances to `/tmp/sec109-numbers.txt`.
   The contract code is unchanged; only balance reads were added around the existing loop and claim.
3. The instrumented run was executed twice; both runs produced byte-identical numbers.

## Observed numbers (yocto-$SNACC, integers, no decimals)

| Measure | Value |
| --- | --- |
| Starting strain-1 balance (`bal0`) | 800,000,000 |
| Strain-1 balance after the 1,000-feed loop (`bal1`) | 799,020,234 |
| Loop cost paid, net balance change (`bal0 − bal1`) | 979,766 |
| Sum of effective fees debited (`epoch_feast_volume`, Σ fees) | 999,760 |
| Total Hypothermia rebate received (`epoch_treasury_spent`) | 19,994 |
| Check: fees − rebates | 999,760 − 19,994 = 979,766 (equals the net loop cost) |
| Per-iteration net balance loss, minimum over 1,000 iterations | 863 |
| Per-iteration net balance loss, maximum over 1,000 iterations | 980 |
| Dividend payout to strain 2 (single 1-aether redemption, full pro-rata claim) | 499,880 |
| Dividend pool collected over the loop (= 50% of effective fees) | 999,760 / 2 = 499,880 (exact) |
| Total received, rebate + dividend | 19,994 + 499,880 = 519,874 |
| Total paid (effective fees) | 999,760 |
| Final net loss counting the full dividend (`bal0 − (bal1 + payout)`) | 479,886 |
| Treasury bound asserted in the test | `epoch_treasury_spent` (19,994) ≤ `epoch_feast_volume` (999,760) |
| Temperature during the loop | 0 mK (Hypothermia, rebate branch active) |
| Loop/assertion failures | 0 |

Reading: every one of the 1,000 iterations lost at least 863 (of the 1,000 fed) even after the
~2% Hypothermia rebate, and even crediting the entire dividend pool to the claiming strain, the
farming side ends 479,886 below its starting balance. The 200 bps rebate is bounded by the 500 bps
per-epoch Treasury quota (`I-04`) and can never exceed the fee it subsidizes
(`DK-030` fee floor ≥ 1 yocto in `feed_strain`).

## What is NOT covered

- Single epoch and single configuration: no nutrient burst, no dormancy (threshold forced to 0),
  Hydrolysis/fever burn branch never taken (temperature stayed at 0 mK), rescue-fee curve sampled
  only along the one vitality trajectory the 1,000 feeds produce.
- Two strains, one owner, one 1-unit aether redemption; no multi-account/Sybil aggregation, no
  price paid for `mt:elixir-aether` or `mt:spore-*` inputs, no NEAR deposit/storage cost.
- Only the `$SNACC` ledger is measured; `get_top_feeder` Great Feast payouts and `atp_minted`
  volume effects are not part of this balance accounting.
- The volatility claims in `docs/econ-profit.md` are not evaluated here: this report only checks
  that repeated feeding in one epoch cannot be self-financing.

## Reproduce

```bash
cargo test sec109 -- --nocapture   # in the contracts repo; 1 passed, rest filtered out
```

The exact numbers above come from the instrumented scratch run described in the previous
section. The shipped test asserts the inequalities (`bal1 < bal0`, `bal2 + payout < bal0`,
`epoch_treasury_spent <= epoch_feast_volume`) but prints nothing; re-running the assertions
above reproduces every figure.
