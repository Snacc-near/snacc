# RES-116 — OpenChainBench & "NEAR Validate": Endpoint Audit and Verification Stage

**Status:** OpenChainBench public endpoints **verified reachable, no key** → informational stage
added to `scripts/verify-thesis.mjs` (see §3). "NEAR Validate" — **no public no-key service found**
(see §2). Research only; no benchmark claims added to the thesis.
**Item:** RES-116 · 2026-11-08.

## 1. OpenChainBench — curl audit (2026-11-08)

| URL | HTTP | Notes |
|---|---|---|
| <https://openchainbench.com/> | 200 | site live |
| <https://openchainbench.com/llms.txt> | 200 | index: 234 benchmarks, CC-BY-4.0, 60s ISR refresh |
| <https://openchainbench.com/api/citable> | 200 | flat JSON index of all benchmarks (no key) |
| <https://openchainbench.com/api/stat/near-rpc> | 200 | **NEAR-scoped live JSON** (no key) |
| <https://openchainbench.com/benchmarks/near-rpc> | 200 | human page for the same benchmark |
| <https://github.com/chainbench/openchainbench> | reachable via search index; HTML fetch flaky from our network | source repo (Go harnesses, Prometheus, YAML specs) |

Sample payload from `/api/stat/near-rpc` (captured 2026-11-08):
`{"slug":"near-rpc","title":"NEAR RPC endpoints: free public URLs by latency","status":"live",
"metric":"RPC latency","unit":"ms","value":31.6454,"leader":{"name":"FastNEAR",...},
"rankings":[{"name":"FastNEAR","ms":{"p50":31.6,"p90":48.4,"p99":143.7},"successRate":100,...},
{"name":"dRPC","ms":{"p50":108.6,...},...}]}` — audited every 60 s from 3 regions.

Conclusion: **public, keyless, JSON, has a NEAR benchmark** → eligible for an automated stage.

## 2. "NEAR Validate" — honest result: not found as a public service

Searched 2026-11-08: `validate.near.org` and `near-validate.xyz` do not resolve (HTTP 000); no
public no-key product named "NEAR Validate" appears in NEAR's docs index
(<https://docs.near.org/llms.txt>) or web results. Closest real tools (none named that):

- **NEP-330 reproducible-build verification** — <https://github.com/near/near-verify-rs> (rebuilds
  a contract from its on-chain source metadata in Docker and compares wasm); relevant to *source*
  verification, not a benchmark API.
- **NEAR security checklist** — <https://docs.near.org/smart-contracts/security/checklist> (manual).
- `near-contract-standards` / NEP compliance checks — handled by SEC-103 (ABI-based, via
  `cargo near abi` in the `contracts` repo); NEP status per track is in `docs/evidence-pack.md`.

**Decision:** no stage was added for "NEAR Validate" — there is no endpoint to call. If a public
service appears later, wire it the same way as OCB-01 below.

## 3. What was added to `scripts/verify-thesis.mjs`

Stage **`OCB-01`** (informational, **not** a falsifier):

- Fetches `https://openchainbench.com/api/stat/near-rpc` (no key) and prints the live NEAR RPC
  latency leader + our primary testnet RPC provider's standing, with the payload's `asOf` context.
- **Deliberately outside `results[]`:** it does not change the `X/Y falsifier` count and does **not**
  affect the exit code. Rationale: the thesis falsifiers F-01..F-03 are *about our claims*; a
  third-party infra benchmark going down must not flip "thesis falsified".
- On fetch failure it prints `OCB-01 GAGAL (konteks saja…)` and still exits by F-01..F-03 only.

This matches the task rule: *add a stage only when a public no-key endpoint exists* — OpenChainBench
qualified, NEAR Validate did not.

## 4. What this does NOT claim

- No OpenChainBench number is part of our thesis (no "fastest RPC" style claim).
- OpenChainBench data is third-party and changes every 60 s; we only read it, never publish it as ours.
- The OCB-01 stage is context for reproducibility (which infra the ecosystem uses), not evidence of
  Snacc correctness.
