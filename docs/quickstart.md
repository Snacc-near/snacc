# Snacc — Developer Quickstart (DOC-108..110)

> Fastest path from zero to a green test suite + a working demo. Prerequisites: **Node.js 22+**,
> **Rust (rustup, stable + `wasm32-unknown-unknown` target)**, **cargo-near** (for building wasm).

## 1. Build & test the contract

```bash
cd contracts
cargo test                                     # 293 unit tests (contracts origin/main, 2026-11-09)
cargo check --target wasm32-unknown-unknown    # 0-warning gate (must pass)
cargo near build                               # wasm for deployment (snacc.wasm)
```

- 0 warnings required before commit (CI gate).
- Structure: `contracts:snacc/src/lib.rs` (methods), `contracts:snacc/src/state.rs` (D1–D8),
  `contracts:snacc/src/events.rs` (NEP-297), `contracts:snacc/src/svg.rs` (NEP-177),
  `contracts:snacc/src/qa_*_tests.rs` (per-feature QA test batches).

## 2. Repos & layout

```
snacc/               # this umbrella (public)
├── contracts/       # Rust contract (single atomic unit: NEP-141 + NEP-171/177 + NEP-245 + mechanics)
├── sdk/             # lab-sdk (TS): NEP-297 event parser + SnaccClient (npm test)
├── backend/         # indexer + /api/crucible/* (M5)
├── frontend/        # biolab-ui (M6)
├── oracle-tee/      # NEAR AI Cloud TEE client + redaction (M3, npm test)
├── scripts/         # economic simulations, gladi runner/KPI, verify:thesis, demo (M7)
├── docs/            # architecture/security/api-schemas/glossary/quickstart
└── evidence/        # gladi evidence (manifest, KPI report, TEE vector) — committed
```

Root umbrella: no dependencies (no `npm install`/`npm ci` needed; `npm ci` fails because there is
no lockfile). `scripts/` is a separate repo: after `git clone` of the umbrella, run
`git clone https://github.com/Snacc-near/scripts.git scripts` once. npm scripts: `demo:replay`,
`verify:thesis`, `gladi:retry`, `dex-check`, `check:claims`, `check-links`. `demo:replay` and
`verify:thesis` only read `evidence/` inside this repo + public RPC (OPS-119).

## 3. Demo (no keys, no API key)

```bash
npm run demo:replay    # replay the demo story from committed gladi evidence (offline, <1 s)
npm run verify:thesis  # falsifiers F-01..F-03
```

- `demo:replay` also runs the **TDX attestation stage (RES-103)**: local fixture → best-effort live
  fetch → `dcap-qvl` cross-check **when installed** (otherwise: `SKIPPED` +
  `cargo install dcap-qvl` instructions).
- All output is written to `reports/` (project root) and `evidence/` (committed evidence).

## 4. Verify thesis (falsifiers F-01..03)

```bash
npm run verify:thesis   # live mainnet RPC storage benchmark + offline TEE ed25519 check
```

Exit 0 = not falsified. Details: `docs/econ-falsifiers.md`.

## 5. Short contribution guide

1. Pick a backlog item from the vault Backlog Master (owner label + priority).
2. Take numbers ONLY from the **Kamus Angka Resmi** + §13a; never invent a number.
3. Test: add to `qa_*_tests.rs` matching the feature (helper patterns `ctx`/`baru`); negative tests
   use `catch_unwind`/`should_panic`.
4. Gates before commit: `cargo test` + `cargo check --target wasm32-unknown-unknown`
   both green and **0 warning**; event/error names copied verbatim from the code.
5. Commit: message starts with the item ID (`<ID>: complete - <summary>`); push only via the coordinator.

## 6. Testnet deploy (brief)

```bash
cd contracts
cargo near build                       # snacc.wasm
# deploy with a testnet deployer account (see ops docs / vault) — NEVER use mainnet keys
```

After deploy: `init` → gladi per runbook → `migrate()` on upgrade when the state layout changed
(controlled reset; read the related pipeline notes).
