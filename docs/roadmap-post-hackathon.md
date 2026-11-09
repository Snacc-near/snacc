# DOC-114 — Post-Hackathon Roadmap (draft)

**Status:** draft for discussion — dates are phases, not commitments. Build window of the hackathon
closes 2026-11-14; this document covers what comes *after*, and what must not be claimed before it
exists.
**Item:** DOC-114 · 2026-11-08.

## Phase 0 — Close the known gaps (before submission)

Ordered by risk to the *claims we already make*:

1. **`V-04` drift fix** — patch `hostile_takeover_splice` to credit the seller via
   `set_account_balance` (the diagnosis is recorded in `docs/post-mortem-draft.md` §3). Until merged,
   `get_global_solvency → solvent:false` stays visible and must stay disclosed.
2. **Live-state reconciliation** — decide repair vs. redeploy for testnet state.
3. **SEC-103 NEP compliance report** — `docs/nep-compliance.md` (status per NEP, no overclaim;
   published 2026-11-09).
4. **Backlog completeness audit** — the completeness table in the Backlog Hub, not test counts,
   decides what "done" means (project honesty rule).

## Phase 1 — Right after the demo (weeks 1–2)

- **CI hardening:** keep `cargo test` (257 tests, 0 warnings on contracts origin/main as of
  2026-11-09) + wasm `cargo check` + `npm run verify:thesis` as merge gates; add the NEP compliance
  check to CI once SEC-103 tooling is chosen.
- **Indexer decision** (`docs/indexer-decision.md`) — poller v2 is already live and recommended
  (backend `backend:src/poller.ts`); the remaining decision is the long-term indexer engine.
- **SocialDB leaderboard spike**   — one testnet `set()` round-trip (the socialdb-leaderboard doc is still a planned doc;
  not yet on the public repo).
- **Gladi evidence refresh** — rerun `verify:thesis` + demo replay after every state-affecting merge;
  store hashes (no claim without hash).

## Phase 2 — Testnet → mainnet readiness (weeks 3–6, gated)

- **Owner-approval gate:** mainnet deploy, `npm publish`, repo-visibility changes all require
  explicit owner sign-off (standing project rule).
- **External audit** of the contract (economic invariants `I-01/I-04/I-14/I-15`, TEE paths, M&A
  races already partly covered by SEC items) before any mainnet value is at stake.
- **Key management:** deployer/owner key separation, `ADR-33` signer rotation drill on testnet first.
- **DEX / listing readiness:** `docs/mintbase-listing-checklist.md` — testnet verification first;
  marketplaces only after approval. `$SNACC` mainnet semantics (no price promises, no
  earnings/APY framing — banned terms per project rule) reviewed by owner before any announcement.

## Phase 3 — Product bets (only if Phase 1–2 hold)

- **MPP experiment** — paid HTTP tier for the NPC reasoning endpoint
  (`docs/mpp-npc-poc.md`); explicitly optional.
- **Shade Agents reassessment** — framework is self-maintained-after-deprecation; revisit only if we
  need attested off-chain workers (`docs/shade-agents-npc.md`).
- **Backend read-only API → full API** (Railway deployment exists without keys; writes stay
  client-side via wallet).

## Explicit non-claims

- No mainnet date, no token distribution plan, and no monetary expectations are made here;
  `$SNACC` testnet has no value.
- "Roadmap" ≠ "committed schedule": items may be cut; the Backlog Master remains the source of truth
  for what is actually done.
