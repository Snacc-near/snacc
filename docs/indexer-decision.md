# RES-117 — The M5 Indexer Engine Decision (recorded 2026-11-08)

> Status: a **recorded recommendation** (the final decision = the owner). The main hackathon criteria:
> time-to-demo, no API key, and evidence verifiable from the same on-chain data.

## 1. Candidates & real research results (checked 2026-11-08)

| Candidate | What was checked | Result |
| --- | --- | --- |
| **A. NEAR Indexer Framework** (near/ near-lake) | requires its own infrastructure (self-hosted Lambda/Pods + a Postgres DB); setup takes days | ⚠️ powerful but overkill for the demo window |
| **B. Goldsky NEAR** | requires a Goldsky account + an API key + pipeline config | ⚠️ requires signup; not "zero-config" — postponed to post-hackathon |
| **C. Envio HyperIndex** | requires codegen config + deploying a hosted service | ⚠️ same: requires an account & pipeline deployment |
| **D. Public explorer APIs (FastNEAR/NearBlocks/KitWallet/Pikespeak)** | probed directly with `curl` without a key: FastNEAR v0/v1 = 404 for the gladi account; NearBlocks v1 = 404; KitWallet = 404; Pikespeak = 401 (needs a key). **Re-checked 2026-11-09:** NearBlocks **v3** (deployed 2026-11-05, v1/v2 now return HTTP 410 "retired") serves the account tx feed without a key: `https://api-testnet.nearblocks.io/v3/accounts/<id>/txns` (newest-first, with `block_height` + `block_timestamp`); unauthenticated limit measured at ~4-request burst then 429, recovering in ~12 s. (Note: the v3 global `txns?account=` filter is broken — it returns other accounts' txs; the per-account path is the correct one.) | 🟡 works keyless for **tx-list discovery only** (no receipt logs in the list); still rate-limited |
| **E. Fallback: read receipts directly via RPC + `demo:replay` from the committed manifest** | already RUNNING: `gladi-kpi.mjs` + `demo-replay.mjs` + `gas-profile.mjs` read txs/receipts directly via the public RPC (0 API keys) | ✅ **proven to work in the gladi (48+ tx)** |

## 2. Recommendation (recorded)

- **Demo/judges (NOW)**: stay with **option E** — parsing `EVENT_JSON` directly from the
  `tx`/`EXPERIMENTAL_tx_status` RPC + the committed manifest. Already proven: the KPI auto-check,
  gas-profile, and demo:replay are all built on this path (zero-key, reproducible).
- **The production M5 backend (post-hackathon)**: **Indexer Framework (A)** for full historical
  data + aggregates, because our backend only needs a read-only event feed (no writes to
  the chain) — the NEAR Indexer-Lake Framework model (Lake prune) is the NEAR ecosystem default.
  Goldsky/Envio get re-evaluated IF the need for realtime subgraph-style queries arises.
- **Do not**: depend on third-party explorer APIs (D) as the source of truth for
  event CONTENT — the poller v2 (below) uses NearBlocks v3 only for *tx-list discovery*
  (1 bounded call per tick) and still reads every event from the NEAR `tx` RPC itself;
  a NearBlocks outage degrades the poller (it backs off honestly with `indexer_incomplete:true`),
  it cannot corrupt the event data.

## 3. Consequences & next steps

1. The backend `/api/events` is for now built on the event parser (path E) — see the schema in
   `docs/api-schemas.md` §event (parser: `sdk:src/events.ts`).
2. If the demo needs complex historical queries (e.g. all claims per epoch), add an
   on-chain cache (aggregate views) OR run the indexer framework locally in one container
   (option A) — not today's decision.
3. This document's falsifier: if one of the public APIs (D) starts returning our account data
   without a key, the recommendation may be revisited (the lightest fallback candidate).

## 4. Implementation record (2026-11-09): poller v2 — **recommended, not decided**

> Status: a **recommended** implementation, verified live; the final decision stays with the owner.
> The spike = the poller v2 in `backend:src/poller.ts` (backend PR #7, merged 2026-11-09),
> hardened against hangs/overlap (a follow-up backend branch, 2026-11-09).

### 4.1 What was actually implemented (the working path)

1. **Discovery = NearBlocks v3 account feed** (no API key): `GET https://api-testnet.nearblocks.io/v3/accounts/<contract>/txns` — newest-first, one call per poll tick (page 50 on the first tick = a small backfill, 25 afterwards). Why: the v1/v2 APIs are retired (HTTP 410 since 2026-11-05), and the earlier approach — scanning every block × every chunk on the free public RPC — made 10+ RPC calls per block and exhausted the 429 quota of `test.rpc.fastnear.com` within a minute of live deployment (observed live 2026-11-09: lag climbing ~2 blocks/s, other view endpoints returning 503 because the poller ate the quota).
2. **Event content = the NEAR `tx` RPC** (option E): for each NEW contract tx (≤ 5 per tick, plus 1 `block` call for the head), read the full outcome tree (`transaction_outcome` + `receipts_outcome`) and parse `EVENT_JSON` — this includes the cross-contract callback receipts (`subaccount_materialized` etc.), which `chunk` does NOT carry (its receipt `outcome` is empty by definition). The recorded decision's original insight (§1 row E) still holds; only the tx-discovery mechanism changed.
3. **Budget & backoff**: exactly 1 NearBlocks call per tick (the measured unauthenticated limit is a ~4-request burst with ~12 s recovery), ≤ 5 `tx` calls + 1 `block` call per tick on `test.rpc.fastnear.com`; any 429/5xx/network error arms a global exponential backoff (base = the poll interval, doubling per consecutive failure, cap 10 min) and backing-off ticks make **zero** API calls — other endpoints keep their RPC budget.
4. **Cursor & dedupe**: the cursor is the newest absorbed tx's `(block_timestamp_ns, block_height)`; it advances only after absorption; bounded `seenTx`/`seenReceipts` sets prevent duplicates (including delayed callback receipts, re-checked once on the following tick). Timeouts: a 10 s abort on the discovery fetch, a 10 s per-request timeout on the RPC client, and a 30 s watchdog per tick (a hanging tick is recorded as a failure + backoff, never a stall); the tick loop is a chained timeout that never overlaps.

### 4.2 Live evidence (read-only, 5.3 minutes, 22 ticks × 15 s, from a local machine, 2026-11-09)

- **HTTP 429 count: 0** (max consecutive: 0) — no sustained 429 spikes; one transient network
  failure was absorbed by 1 backed-off tick.
- **82 events absorbed** from the 50-tx backfill (the gladi txs from 2026-11-08, discovered
  through the NearBlocks feed and parsed through the `tx` path).
- Lag header (documented meaning: chain head − the block of the newest contract tx absorbed):
  grows while the contract is quiet — **this is not the old "lag < 2 blocks" target**; the health
  signal is `indexer_incomplete` (`false` once the backfill queue drains and the source is healthy).

### 4.3 Honest limits of poller v2

- **State is in-memory**: a restart re-runs the 50-tx backfill; there is no persistence and no
  gapless history across restarts.
- **No fallback discovery source**: if NearBlocks v3 is down/unreachable, the poller backs off
  and reports `indexer_incomplete:true` — it does not silently switch sources (and it never
  fabricates events).
- **The "lag < 2 blocks" DoD target is NOT met** (and cannot be, honestly, with a tx-feed
  design on a free keyless source): the feed's freshness depends on NearBlocks indexing, not on
  our poll loop.
- Backfill > 50 tx and historical gap-filling are not implemented (bounded by design).

### 4.4 Comparison with the other candidates (honest)

| Candidate | vs poller v2 (what we run now) | Verdict for this hackathon |
| --- | --- | --- |
| **A. NEAR Indexer Framework** | Gives gapless, self-hosted history + aggregates and real block-level lag; costs days of setup (Lambda/Pods + Postgres) and is not keyless to operate | Right choice post-hackathon for the production indexer (unchanged from §2); overkill for the demo window |
| **B. Goldsky NEAR** | Would give realtime subgraph-style queries with managed infra; needs an account + API key + pipeline config (none of which the demo budget allows) | Re-evaluate post-hackathon if realtime queries are needed |
| **C. Envio HyperIndex** | Same trade as B: codegen config + hosted deployment, keyed | Same as B |
| **D. Explorer APIs** | NearBlocks v3 now works keyless for tx-list discovery (the v1 probe result is obsolete); still rate-limited (~4-burst/12 s) and broken on the global `txns?account=` filter; we use it for discovery only — events still come from the NEAR `tx` RPC | Adopted for discovery in poller v2, with a bounded budget + honest degradation |
| **E. Direct RPC (option E) + discovery** | **Implemented** (`backend:src/poller.ts`): zero API keys, ≤ 7 RPC calls/tick worst case, live-verified (§4.2) | **Recommended** for the hackathon demo; the final decision = the owner |
