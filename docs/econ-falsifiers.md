# ECON-110 — Falsifier Status (F-01..03)

> Falsifier summary from `scripts/verify-thesis.mjs` (run via `npm run verify:thesis`,
> exit 0 = not falsified). Operational definitions were set on 2026-11-08 (previously
> undefined). Principle: we are wrong IF the following condition holds — the latest status
> must be read from the output of the most recent run, not from this document.

## F-01 — SVG storage economics (LIVE mainnet benchmark)

- **Claim**: dynamic SVG is 1,734 bytes = 0.01734 NEAR/NFT; 84.42% cheaper than an equivalent static NFT.
- **Falsifier**: the storage cost of 1,734 bytes from **live mainnet** `storage_amount_per_byte = 10^19`
  ≠ 0.01734 NEAR, OR the 84.42% saving is unproven.
- **Method**: read-only mainnet RPC (`protocol_config` → runtime storage amount per byte) × 1,734.
- **Most recent run status (2026-11-08): NOT FALSIFIED** ✓ (numbers match exactly because the arithmetic
  is deterministic from protocol parameters).

## F-02 — Supply invariant (`I-01` / `DK-010`)

- **Claim**: "supply only shrinks after birth" — no minting after init.
- **Falsifier**: `ft_total_supply ≠ total_snacc_supply` (the two sources disagree), OR
  `total_snacc_burned == 0` forever (burning never happens), OR supply above the historical peak.
- **Method**: testnet views (`ft_total_supply`, `get_macro_state.total_snacc_supply/burned`).
- **Most recent run status (2026-11-08): NOT FALSIFIED** ✓ (supply == macro supply; burned > 0 —
  the Fever burn path has been active since the ECON-111 calibration).

## F-03 — TEE zero-trust (offline re-verification)

- **Claim**: the TEE proposal (`NEAR AI Cloud`) is verified by the contract; the gladi evidence can
  be re-verified offline.
- **Falsifier**: the gladi evidence vector FAILS ed25519 re-verification against the enclave pubkey.
- **Method**: reconstruct `<model>:<req_sha256>:<res_sha256>` + `ed25519_verify` offline over
  `evidence/tee-vector-live.json` (the real live vector from `cloud-api.near.ai`).
- **Most recent run status (2026-11-08): NOT FALSIFIED** ✓ (signature valid; the same vector
  the unit tests `qa_div`/`qa_tee` use — `strain_id:5`, trait `mitokondria-empyrean`).

## How to re-run

```bash
npm run verify:thesis   # exit 0 = all falsifiers NOT FALSIFIED
```

Full output: stdout of `npm run verify:thesis` (no separate report file is recorded).
These three falsifiers are the claims easiest for judges to check — if any one changes status,
the README must be revised the same day (vault honesty rule).
