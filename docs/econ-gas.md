# Snacc — Protocol Gas Profile & Epoch Loop Analysis (`ECON-107..108`)

> Honesty principle (Backlog Master, `ECON-107..108`): **full transparency, no false claim of gas savings**. Every metric in this report is measured directly from the on-chain execution outcomes of the rehearsal transactions recorded in `evidence/gladi-manifest.json` via the explorer API. State mutations in a multi-token biological simulation naturally consume more gas than a standard fungible token transfer. `$SNACC` has no monetary value; fee figures denote protocol execution costs in yoctoNEAR and TGas.

## 1. Methodology & Data Source

- **Rehearsal Manifest**: `evidence/gladi-manifest.json` (51 unique transaction hashes).
- **Measurement Tool**: `scripts:econ-gas.mjs` + unit suite `scripts:econ-gas.test.mjs` (in the `scripts` repo).
- **Baseline**: `ft_transfer` standard Fungible Token transfer (`2.833 TGas`, fee `0.000261 NEAR`).
- **Policy reference**: `ADR-01` (single receipt `< 6 TGas`). The figures below are summed over the whole receipt tree of each transaction, not per receipt, so they are not a per-receipt compliance test. Only `materialize_subaccount` (13.628 TGas, several receipts) is above 6 TGas in total.
- **Scope**: measured on the `snacc-v001.testnet` rehearsal of 2026-11-09 (NEAR testnet); gas prices and fees on mainnet are not measured here.

Across 40 measured function-call transactions, all smart contract receipts completed with 0 execution failures.

## 2. Per-Method Gas Burnt vs Baseline

| Method | n | Burnt Mean (TGas) | Burnt Min..Max (TGas) | Prepaid Mean (TGas) | Fee Mean (NEAR) | vs `ft_transfer` |
| --- | ---: | ---: | --- | ---: | ---: | ---: |
| `materialize_subaccount` | 1 | 13.628 | 13.628..13.628 | 300.000 | 0.007576 | 4.81x |
| `adopt` | 1 | 5.925 | 5.925..5.925 | 200.000 | 0.000570 | 2.09x |
| `harvest_starving_strain` | 1 | 4.794 | 4.794..4.794 | 150.000 | 0.000457 | 1.69x |
| `hostile_takeover_splice` | 1 | 4.315 | 4.315..4.315 | 200.000 | 0.000409 | 1.52x |
| `splice_strains` | 2 | 4.256 | 4.256..4.256 | 300.000 | 0.000403 | 1.50x |
| `synthesize_elixir` | 2 | 3.617 | 3.615..3.619 | 300.000 | 0.000339 | 1.28x |
| `incubate_strain` | 8 | 3.597 | 3.542..3.612 | 300.000 | 0.000337 | 1.27x |
| `transmute_spores_to_enzyme` | 6 | 3.471 | 3.394..3.620 | 300.000 | 0.000325 | 1.23x |
| `feed_strain` | 4 | 3.358 | 3.326..3.378 | 300.000 | 0.000314 | 1.19x |
| `npc_buy_spores` | 1 | 3.262 | 3.262..3.262 | 300.000 | 0.000304 | 1.15x |
| `extract_spores` | 4 | 3.184 | 3.171..3.199 | 300.000 | 0.000296 | 1.12x |
| `claim_industrial_dividend` | 1 | 3.129 | 3.129..3.129 | 300.000 | 0.000291 | 1.10x |
| `synthesize_and_redeem_aether` | 1 | 2.984 | 2.984..2.984 | 300.000 | 0.000276 | 1.05x |
| **`ft_transfer` (baseline)** | 1 | **2.833** | **2.833..2.833** | **100.000** | **0.000261** | **1.00x** |
| `ft_burn` | 1 | 2.780 | 2.780..2.780 | 300.000 | 0.000256 | 0.98x |
| `allocate_atp` | 1 | 2.640 | 2.640..2.640 | 300.000 | 0.000242 | 0.93x |
| `storage_deposit` | 2 | 2.482 | 2.479..2.485 | 200.000 | 0.000226 | 0.88x |
| `advance_sandbox_clock` | 2 | 2.361 | 2.361..2.361 | 100.000 | 0.000214 | 0.83x |

## 3. Epoch Loop Compositions

To model realistic player routines, three operational compositions are defined. These represent behavioural assumptions using spec methods:

| Epoch Loop Profile | Included Methods | Burnt Gas (TGas) | Transaction Fee (NEAR) | vs `ft_transfer` Baseline |
| --- | --- | ---: | ---: | ---: |
| **1. Keep-Alive (Passive)** | `feed_strain` | 3.358 TGas | ~0.000314 NEAR | 1.19x |
| **2. Minimal Active** | `feed_strain` + `allocate_atp` | 5.998 TGas | ~0.000555 NEAR | 2.12x |
| **3. Full Production Cycle** | `feed_strain` + `allocate_atp` + `extract_spores` + `transmute_spores_to_enzyme` + `synthesize_elixir` | 16.270 TGas | ~0.001515 NEAR | 5.74x |

### Observations:
- **Baseline Overhead**: Regular cellular upkeep (`feed_strain`) requires only 19% more compute than a basic token transfer (`3.358` vs `2.833 TGas`), despite performing Lazy BMR deduction, vitality recalculation, ATP minting, thermostat volume injection, and NEP-297 event generation.
- **Full Production Economy**: Running an entire multi-stage chemical synthesis cycle (`spores` -> `enzyme` -> `elixir`) plus daily feeding and mitochondrial allocation costs ~16.27 TGas (~0.0015 NEAR), staying well under NEAR's 300 TGas transaction block limit.
- **Sub-Account Creation**: `materialize_subaccount` registers the highest single-operation gas footprint (13.628 TGas) due to cross-contract account creation, storage reservation, and multi-receipt asynchronous execution.
