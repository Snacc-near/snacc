# Snacc — Thesis Metrics (`RES-115`)

> Track: `thesis` ("judged on the evidence").
> This page lists four thesis metrics, what backs each one, and what does **not**. Everything is on **NEAR testnet** (`snacc-v001.testnet`); there is no mainnet deployment. `$SNACC` on testnet has no monetary value. Evidence is the 2026-11-09 rehearsal recorded in [`evidence/gladi-manifest.json`](../evidence/gladi-manifest.json) and [evidence-pack.md](evidence-pack.md) (the pack lists each row's replay commands). Simulations in `docs/econ-*.md` are simulations, not live evidence.

**Status key.** *Verified in rehearsal 2026-11-09* = a transaction on `snacc-v001.testnet` backs the claim (explorer link ↗). *Recorded view* = read from a contract view, no transaction hash exists. *Computed* = arithmetic on stated constants, not a measurement. *Not verified* = no evidence yet.

## 1. Summary

| Metric | Claim | Evidence | Status |
| --- | --- | --- | :-- |
| **M1: Storage economics** | An on-chain SVG within a 1,734-byte budget costs 0.01734 NEAR per NFT at the mainnet storage price (`10^19` yoctoNEAR/byte). | Arithmetic only. Real rehearsal SVGs were 448–480 bytes (evidence-pack N1, view). The **84.42% saving** compares the budget with an **assumed** 11,129-byte baseline; the baseline is our assumption, not a measurement. | Computed (no tx). Savings figure: assumption, not verified. |
| **M2: Supply contraction** | `$SNACC` supply can shrink after birth: an explicit burn is on chain, and the thermostat burned part of a catalyst fee in the FEVER zone. | `ft_burn` [`ERBRL4rT…`](https://testnet.nearblocks.io/txns/ERBRL4rTS6JHEKVsSumLYtru1hXsSYWdkGJH8d1krJaL) · FEVER burn [`CfBR8pFN…`](https://testnet.nearblocks.io/txns/CfBR8pFNCGAjCAX21pSMQY9rdjQ2cVKonkzacFjmZpM8) (evidence-pack M3, M4). `total_snacc_burned` = 3.58 × 10^22 yocto-`$SNACC` is a recorded view. | [Verified in rehearsal 2026-11-09 ↗](https://testnet.nearblocks.io/txns/ERBRL4rTS6JHEKVsSumLYtru1hXsSYWdkGJH8d1krJaL) at testnet micro-scale: one explicit burn and one FEVER firing. |
| **M3: TEE signature** | A real NEAR AI Cloud TEE response carries a valid `ed25519` signature that the contract verifies before applying a mutation. | Offline re-verification of `evidence/tee-vector-live.json` (evidence-pack P1). On chain: signer registered [`BovEAtK5…`](https://testnet.nearblocks.io/txns/BovEAtK5gUZ6dthCX5Cn6qHnmZZ9bhtSTpGuYXRqYgfw), commit [`EnXBEETd…`](https://testnet.nearblocks.io/txns/EnXBEETdyG4TcjmrzGgJxzczGcxMshXZuEBorG8yHwDC), apply [`B8xdaukd…`](https://testnet.nearblocks.io/txns/B8xdaukdnf3Fh9ZkMNfXxXW7TrHVLZLeXQNdYyBtD2AG) (evidence-pack P2, P3). | [Verified in rehearsal 2026-11-09 ↗](https://testnet.nearblocks.io/txns/B8xdaukdnf3Fh9ZkMNfXxXW7TrHVLZLeXQNdYyBtD2AG) for the signature. **Not verified:** that the signing key lives inside an enclave (no attestation check), and the replay guard (no rejection tx recorded). |
| **M4: Solvency** | The accounting books balance: global drift is zero. | View `get_global_solvency` → `"drift":0,"solvent":true`, read 2026-11-09 (evidence-pack C2). Conservation in an NPC trade: [`2VCzPuL5…`](https://testnet.nearblocks.io/txns/2VCzPuL5imnFThJC479mzpF6mcQDcz8nhUvpmkvV1RFg) (evidence-pack M5). | Recorded view (no tx hash for the drift number). NPC trade: [verified in rehearsal 2026-11-09 ↗](https://testnet.nearblocks.io/txns/2VCzPuL5imnFThJC479mzpF6mcQDcz8nhUvpmkvV1RFg). Treasury cap `I-04` over many epochs: not verified live. |

Falsifier conditions (`F-01`..`F-03`) are re-checked by `npm run verify:thesis` in the umbrella repo; `scripts:thesis-dashboard.mjs` (in the `scripts` repo) prints the same table with these statuses and fails closed (missing input means *not verified*).

## 2. Notes per metric

### 2.1 M1: storage arithmetic
- Budget: 1,734 bytes (`VC-009`); measured SVGs were 448, 476 and 480 bytes (evidence-pack N1).
- Price: mainnet `storage_amount_per_byte` = `10^19` yoctoNEAR, so `1734 × 10^19 yoctoNEAR = 0.01734 NEAR`. The price read is replayable with the RPC command in evidence-pack T1. No Snacc contract is deployed on mainnet.
- `93.95 NEAR` per 10,000 NFTs is `(11,129 − 1,734) × 10^19 × 10,000 / 10^24`. It inherits the assumed baseline, so it is an illustration, not a measured saving.

### 2.2 M2: thermostat and burns
- FEVER zone: temperature above `610 mK` burns `350 bps` of the catalyst fee; a strain holding one `mt:elixir-homeostasis` halves it (evidence-pack M4: `175 bps`).
- The rehearsal fee in M4 was paid by the contract account to itself, so it moved no value between parties; the live temperature changes over time and the tx logs are the durable proof.

### 2.3 M3: TEE
- Model `z-ai/glm-5.3-flash`. Signed text: `<model>:<req_sha256>:<res_sha256>`; the contract checks it with `env::ed25519_verify` against a registered signer key.
- Offline replay: `npm run demo:replay` (no API key). A gas figure for the verification is not measured here (not verified).

### 2.4 M4: solvency
- The drift value is a view, so no transaction hash backs it; re-read it with `view get_global_solvency` (evidence-pack C2).

## 3. Query templates (not executed)

These are SQL **templates** for a public indexer. They were **not executed** for this project and Snacc is testnet-only; adapt the table and account names to an indexer that covers NEAR testnet before using them. Column names are illustrative and not validated against any indexer schema; for example `epoch`, `effective_fee` and `atp_minted` are fields of the `fed` event log (see [events.md](events.md)), not call arguments.

### Query 1: storage arithmetic
```sql
-- query template — not executed; Snacc is testnet-only
SELECT
  1734 AS snacc_svg_bytes_budget,
  11129 AS assumed_static_baseline_bytes,
  (1 - (1734.0 / 11129.0)) * 100 AS storage_savings_percent_vs_assumed_baseline,
  (1734 * 1e19) / 1e24 AS near_cost_per_nft;
```

### Query 2: `ft_burn` receipts
```sql
-- query template — not executed; Snacc is testnet-only
SELECT
  block_timestamp,
  tx_hash,
  (args->>'amount')::numeric / 1e24 AS burned_snacc_amount,
  args->>'memo' AS burn_reason
FROM near.receipt_actions
WHERE receiver_id = 'snacc-v001.testnet'
  AND method_name = 'ft_burn'
ORDER BY block_timestamp DESC;
```

### Query 3: feeding velocity
```sql
-- query template — not executed; Snacc is testnet-only
SELECT
  (args->>'epoch')::integer AS epoch,
  args->>'strain_id' AS strain_id,
  (args->>'effective_fee')::numeric / 1e18 AS fee_snacc,
  args->>'atp_minted' AS atp_minted
FROM near.receipt_actions
WHERE receiver_id = 'snacc-v001.testnet'
  AND method_name = 'feed_strain'
ORDER BY epoch DESC, fee_snacc DESC;
```
