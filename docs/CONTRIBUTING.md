# DOC-115 — Contributing to Snacc

**Item:** DOC-115 · 2026-11-08.
Thanks for wanting to improve Snacc — an on-chain economic game on NEAR. This guide is short on
purpose; the vault documents are the source of truth for design.

## 1. Ground rules (non-negotiable)

1. **Honest claims.** "Passes test X" never means "product is complete." Every status claim must say
   what was tested *and what was not*. Without a tx/testnet hash, do not claim "live".
2. **Wording bans.** No play-to-earn style labels, no capital-at-risk framing, and no APY/earnings
   promises anywhere in docs/READMEs (the exact banned terms are listed in the project rules —
   treat synonyms as banned too). Snacc is an *on-chain economic game*; profit framing = work + redistribution, **no guarantees**;
   `$SNACC` on testnet has **no monetary value**; volatility is a feature, not a promise.
3. **Spec names are exact.** Method/event/field/error/endpoint names are copied verbatim from the
   design vault (`snacc-vault/04 Arsitektur/…`) — don't paraphrase or invent.
4. **Numbers come from the official Kamus Angka** (`snacc-vault/04 Arsitektur/Snacc - Model Data.md`).
   A number not in the spec is a spec question, not an implementation choice — ask first.
5. **Secrets never enter git.** Keys live in `.secrets/` / `.env` (gitignored) at the project root.
   Scan before pushing.

## 2. Repos & branches

- Umbrella repo `Snacc/` plus `contracts`, `oracle-tee`, `sdk`, `backend`, `frontend`, `scripts`
  (GitHub org `Snacc-near`). `snacc-vault` stays **private** — never publish it.
- One backlog item = one branch `item/<ID>` = one PR. Commit messages start with the item ID:
  `<ID>: <summary>` (partial work says `partial`). Never `git add -A` in shared repos — stage
  explicit paths.
- Merge to `main` only after CI is green (or owner approval). Direct pushes to `main` are for small
  owner-requested infra/docs commits only.

## 3. Working on the contract (`contracts/`)

```bash
cd contracts
cargo test -p snacc          # must pass with 0 warnings (257 tests on contracts origin/main, 2026-11-09)
cargo check -p snacc --target wasm32-unknown-unknown   # must be clean
cargo near build             # when producing a wasm artifact
```

- `near-sdk` is pinned (`=5.29.1`); don't bump it in a feature PR.
- Contract struct uses `#[near(contract_state)]` + `#[near]` on the impl (not `#[near_bindgen]`).
- New state structs: `#[near(serializers = [borsh, json])]`, following `state.rs`.
- Collections must be generation-prefixed (`prefix_gen`, see SEC-112) — plain `LookupSet::new(b"u")`
  across a `migrate()` is the bug we already fixed once; don't reintroduce it.
- New tests go next to existing ones (`lib.rs` `tests` module or `qa_*_tests.rs` files); old tests
  are never deleted to make room.

## 4. Tests, evidence, and docs

- A test claim requires the command + output you actually saw; otherwise write "not run".
- Evidence hashes and live-tx claims belong in `evidence/` (e.g. `evidence/gladi-manifest.json`,
  `evidence/gladi-kpi.md`).
- Docs in `docs/` are English, technical, concise; each claim = fact + status
  (research ≠ implementation).
- When an item changes status: commit the repo change with its ID, then update the Backlog Master /
  Hub and the progress log (project rekap rule — coordinator handles vault commits).

## 5. PR checklist

- [ ] Branch `item/<ID>`, commits prefixed with the ID, explicit paths only.
- [ ] `cargo test -p snacc` green, **0 warnings**; wasm `cargo check` clean (for contract changes).
- [ ] No banned wording; no unproven "done/complete" claims; spec names/numbers verbatim.
- [ ] New behavior has tests; existing tests untouched except for mechanical field adjustments.
- [ ] Secrets scanned out; `snacc-vault` untouched unless you're the coordinator.

## 6. Where things live

| Topic | Location |
|---|---|
| Design source of truth | `snacc-vault/` (start at `Snacc Hub.md`; private) |
| Backlog & owners | `snacc-vault/09 Backlog/Snacc - Backlog Master.md` (private) |
| Architecture summary | `docs/architecture.md` |
| API surfaces | `docs/api-schemas.md` |
| NEP compliance status | `docs/nep-compliance.md` |
| Security findings | `docs/security-audit.md` |
| Progress log | `snacc-vault/00 Log/Progress/Progress Snacc.md` (private) |

Questions that change spec belong in the vault (or to the owner) — not in a PR review thread.
