# RES-117 — The M5 Indexer Engine Decision (recorded 2026-11-08)

> Status: a **recorded recommendation** (the final decision = the owner). The main hackathon criteria:
> time-to-demo, no API key, and evidence verifiable from the same on-chain data.

## 1. Candidates & real research results (checked 2026-11-08)

| Candidate | What was checked | Result |
| --- | --- | --- |
| **A. NEAR Indexer Framework** (near/ near-lake) | requires its own infrastructure (self-hosted Lambda/Pods + a Postgres DB); setup takes days | ⚠️ powerful but overkill for the demo window |
| **B. Goldsky NEAR** | requires a Goldsky account + an API key + pipeline config | ⚠️ requires signup; not "zero-config" — postponed to post-hackathon |
| **C. Envio HyperIndex** | requires codegen config + deploying a hosted service | ⚠️ same: requires an account & pipeline deployment |
| **D. Public explorer APIs (FastNEAR/NearBlocks/KitWallet/Pikespeak)** | probed directly with `curl` without a key: FastNEAR v0/v1 = 404 for the gladi account; NearBlocks = 404; KitWallet = 404; Pikespeak = 401 (needs a key) | ❌ none of them serves `snacc-v001.testnet` data without a key/registration |
| **E. Fallback: read receipts directly via RPC + `demo:replay` from the committed manifest** | already RUNNING: `gladi-kpi.mjs` + `demo-replay.mjs` + `gas-profile.mjs` read txs/receipts directly via the public RPC (0 API keys) | ✅ **proven to work in the gladi (48+ tx)** |

## 2. Recommendation (recorded)

- **Demo/judges (NOW)**: stay with **option E** — parsing `EVENT_JSON` directly from the
  `tx`/`EXPERIMENTAL_tx_status` RPC + the committed manifest. Already proven: the KPI auto-check,
  gas-profile, and demo:replay are all built on this path (zero-key, reproducible).
- **The production M5 backend (post-hackathon)**: **Indexer Framework (A)** for full historical
  data + aggregates, because our backend only needs a read-only event feed (no writes to
  the chain) — the NEAR Indexer-Lake Framework model (Lake prune) is the NEAR ecosystem default.
  Goldsky/Envio get re-evaluated IF the need for realtime subgraph-style queries arises.
- **Do not**: depend on third-party explorer APIs (D) — every keyless probe
  returned 404/401 for our accounts (fragile, rate-limited, and it adds a third-party
  dependency we do not control).

## 3. Consequences & next steps

1. The backend `/api/events` is for now built on the event parser (path E) — see the schema in
   `docs/api-schemas.md` §event (parser: `sdk:src/events.ts`).
2. If the demo needs complex historical queries (e.g. all claims per epoch), add an
   on-chain cache (aggregate views) OR run the indexer framework locally in one container
   (option A) — not today's decision.
3. This document's falsifier: if one of the public APIs (D) starts returning our account data
   without a key, the recommendation may be revisited (the lightest fallback candidate).
