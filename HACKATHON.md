# Snacc — NEAR Hackathon submission notes

Status: evidence pack written; frontend, demo video and the submission form are still pending (see `docs/evidence-pack.md` §7).

- **Project:** Snacc (`$SNACC`) — *NFTs that eat a memecoin. Feed your Snacc or it gets snacked.*
- **Tracks:** `memecoins` + `nfts`. Other tracks are listed in the evidence pack only where a testnet tx hash or a view call backs them.
- **Window:** 1–14 Nov 2026 · **Org:** `Snacc-near` · **License:** MIT
- **Contract (testnet):** `snacc-v001.testnet` — one Rust contract (`near-sdk 5.29.1`). Nothing is deployed on mainnet.
- **Verify each claim yourself:** [`docs/evidence-pack.md`](docs/evidence-pack.md) — claim → tx hash or view call → exact command → status, per track, plus a "Not yet proven live" section.
- **Committed evidence:** `evidence/gladi-manifest.json` (51 hashed testnet txs from the rehearsal run), `evidence/gladi-kpi.md` (KPI auto-check output, with its own claim limits), `evidence/tee-vector-live.json` (a NEAR AI Cloud TEE response with its `ed25519` signature, re-verifiable offline), `evidence/snacc.wasm` (the deployed build; the base58 of its sha256 equals the on-chain `code_hash` — see the evidence pack C1).
- **NEP-245:** internal inventory data model only — there is no public `mt_*` interface and no compliance claim.

## Judge quickstart (Node.js 22+, no key, no `npm install`)

```bash
git clone https://github.com/Snacc-near/snacc.git && cd snacc
git clone https://github.com/Snacc-near/scripts.git scripts   # scripts/ is a separate repo
npm run demo:replay     # offline replay of the committed rehearsal tx
npm run verify:thesis   # falsifiers F-01..F-03 (F-01/F-02 read public RPCs, F-03 is offline)
```

Both commands read only files under `evidence/` and public RPCs.

## Honesty notes

- `$SNACC` on testnet has no monetary value. Volatility is a game mechanic, not a promise of returns.
- Simulation results in `docs/econ-*.md` are simulations, not live evidence.
- A claim without a testnet tx hash or a reproducible view call is not claimed as live.
