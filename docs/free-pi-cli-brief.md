# The `free-pi-cli` Brief & Prompt — the Snacc Project

> To be run **manually by the owner**. This document is self-contained: complete instructions for the `free-pi-cli` coding-agent CLI so it can work on the Snacc backlog right away without breaking the team's work.

---

## 0. The starter prompt (paste into `free-pi-cli` when a session starts)

```
You are working on the Snacc project (NEAR AI Hackathon, the deadline is Nov 14, 2026 23:59 UTC).
You MUST read first, in this order, before touching any code:
1. docs/free-pi-cli-brief.md (this file) — the rules & gotchas
2. CLAUDE.md (the umbrella repo root) — the hard rules
3. docs/partner-onboarding.md — an end-to-end understanding of the product
4. snacc-vault/09 Backlog/Snacc - Backlog Master.md — the Status Board + the item list
5. snacc-vault/09 Backlog/Snacc - Pembagian Tim.md — who owns what
6. snacc-vault/04 Arsitektur/Snacc - Model Data.md — §Kamus Angka Resmi (ALL numbers come from here)
7. snacc-vault/04 Arsitektur/Snacc - Spec Antarmuka Kontrak.md — the method/event/error names MUST be exact

Then: pick an item from Backlog Master (follow the Status Board ⏭️ Next; do not take
an item another session is working on — check `git status` in each repo first). Work
on the `item/<ID>` branch, commit with the message `<ID>: <summary>`, open a PR, wait for CI to be green,
update the Status Board + commit `docs: status <ID>` in snacc-vault. Follow every rule
in section 4 of this document WITHOUT exception.
```

---

## 1. What the project is (30 seconds)

**Snacc ($SNACC) — "NFTs that eat a memecoin. Feed your Snacc or it gets snacked."**
An on-chain economy game on NEAR: every NFT (`NEP-171`/`NEP-177`) is a living balance-sheet
organism (the `s-<id>.snacc-v001.near` sub-account) that **must eat the `$SNACC` memecoin**
(vitality decays via BMR), works in the 3-stage `NEP-245` molecule supply chain, can be merged
(`splice_strains`), hostile-taken-over while distressed, and harvested by anyone once fainted
(`harvest_starving_strain`). Behind it: the algorithmic central bank `CrucibleTemp`
(a 3.5% burn during Fever / a 2% rebate during Hypothermia), 3 autonomous NPCs, and the verification of secret
AI decisions in `NEAR AI Cloud TEE` checked directly by the contract (`env::ed25519_verify`).
Submission tracks: `memecoins` + `nfts`. Product details: `docs/partner-onboarding.md`.

---

## 2. MUST-READ before touching the backlog (in order, no skipping)

| # | Document | For what |
|---|---|---|
| 1 | `repos/Snacc/CLAUDE.md` | **The hard rules**: ID-prefixed commits, PR/CI, time limits, secrets, the honesty rules |
| 2 | `repos/Snacc/docs/partner-onboarding.md` | An end-to-end understanding of the product (mechanics, economy, technology) |
| 3 | `snacc-vault/09 Backlog/Snacc - Backlog Master.md` | **The Status Board** (where the project stands) + all items + the `@pemilik·Lx` labels + DoDs |
| 4 | `snacc-vault/09 Backlog/Snacc - Pembagian Tim.md` | The lane split — do not take another lane's work without coordination |
| 5 | `snacc-vault/04 Arsitektur/Snacc - Model Data.md` | **§Kamus Angka Resmi** — the source of ALL numbers (other values = superseded, banned) |
| 6 | `snacc-vault/04 Arsitektur/Snacc - Spec Antarmuka Kontrak.md` | The **method/event/field/error** names must come exactly from here |
| 7 | `snacc-vault/05 Fitur/Snacc - Fitur F<id>.md` | The feature spec for the item being worked on (F1–F7) |
| 8 | `snacc-vault/09 Backlog/Snacc - Test Case Kontrak dan TEE.md` | The test format & cases (`TC-*`) |
| 9 | `snacc-vault/08 Mapping/Snacc - Peta Resource NEAR.md` | The resources/integrations used vs deliberately not used |

Note: `snacc-vault/` is the **source of design truth** (86 documents, a **private** repo,
read-only for you except the 2 status files governed by section 4). When other documents conflict
with the Kamus Angka + the Contract Spec, **the dictionary & the spec win**.

---

## 3. Repositories, toolchain, dependencies

**An x207-style polyrepo** in the GitHub org **`Snacc-near`** (7 public repos + a private vault). Clone them side by side:

```bash
mkdir -p snacc-work && cd snacc-work
for r in snacc contracts oracle-tee sdk backend frontend scripts; do
  git clone git@github.com:Snacc-near/$r.git
done
```

| Repo | Module | Contents | Status |
|---|---|---|---|
| `snacc` | umbrella | README, `docs/` (this brief, partner-onboarding, CLAUDE.md) | active |
| `contracts` | M1+M2 | The `snacc-v001.near` Rust contract — **the core of all mechanics** | VC-001..005 ✅/in progress, 34 tests |
| `oracle-tee` | M3 | Dual-Layer Redaction + the `z-ai/glm-5.3-flash` client + the ed25519 verifier | stub |
| `sdk` | M4 | `lab-sdk`: Function Call Keys + `SnaccClient` | stub |
| `backend` | M5 | The `NEP-297` indexer + the `/api/crucible/*` API | stub |
| `frontend` | M6 | the cell-cultivation game UI: isometric Colony Plate arena + Cell Lab bio-reactor, keycap HUD | live at https://snacc-nu.vercel.app (game at `/app`) |
| `scripts` | M7 | `verify:thesis`, `demo:replay`, `gladi:retry`, economic simulations | active |

**Toolchain & dependencies (locked, do not change without a reason):**
- `rustc 1.99.1` (pinned via `contracts:rust-toolchain.toml`), the `wasm32-unknown-unknown` target
- `near-sdk = "=5.29.1"` (an **exact** pin) + the `near-sdk` **`unit-testing`** feature in dev-dependencies
- Node.js LTS (plain, no heavy frameworks), the `gh` CLI (GitHub), git
- CI: GitHub Actions — `contracts`: `cargo test` + `cargo check --target wasm32-unknown-unknown` (must be green with 0 warnings); the other repos: placeholders to be expanded as code lands
- No external dependency may be added to the contract without the owner's approval

**The contract verification setup:**
```bash
cd contracts && cargo test && cargo check --target wasm32-unknown-unknown
```
Both commands must be **green** before every PR.

---

## 4. The rules of engagement (NO EXCEPTIONS — details in `CLAUDE.md`)

1. **Branches & PR**: work on `item/<ID>`; commit with the message **`<ID>: <summary>`** (partial items: the word "partial"); open a PR to `main`; **merge only after CI is green**. Do not push directly to `main` except small infra commits requested by the owner. No `git add -A` — explicit paths.
2. **Time limits**: one item at **most 45 minutes**; one problem at **most 3 runs** of the same test. Beyond that: commit what already passes, note the obstacle in the log, move to the next item.
3. **Names = the spec**: methods, events, fields, errors, endpoints, columns — copy **verbatim** from the `Spec Antarmuka Kontrak` / the feature spec. Numbers **only** from the Kamus Angka Resmi.
4. **Honesty**: no testnet transaction hash = **no live claim**; the words "GameFi/investment/yield" are banned (use "on-chain economy game"); profit = work + redistribution, no profit guarantee; `$SNACC` testnet has no monetary value; volatility is a feature, not a promise.
5. **Secrets**: only in `.env` (gitignored) and `.secrets/` — never displayed, recorded, or committed. These repositories are **public**. Run the secret scan before pushing.
6. **Status sync (MANDATORY after every finished item):**
   - update the **Status Board** + the item row in `snacc-vault/09 Backlog/Snacc - Backlog Master.md`
   - commit in `snacc-vault` with the message **`docs: status <ID>`**
   - append an entry to `Progress Snacc.md` (`vault/00 Log/Progress/`, the format: time from `date -u`, Done/Partial/Waiting/Decisions/Evidence) — commit `log: Snacc`
7. **Anti-collision**: before starting an item, check `git status` in each repo — if files are already modified by another session (a child session/a team member), **do not touch those files**; pick another item or wait. `snacc-vault` may be changed ONLY for the 2 status files in point 6.
8. **snacc-vault = private, never make it public.**

---

## 5. Technical gotchas (expensive lessons — DO NOT repeat)

| Trap | The truth |
|---|---|
| `#[near_bindgen]` on the contract struct | **WRONG** for near-sdk 5 → the wasm build fails with `E0277: ContractState`. Use `#[near(contract_state)]` + `#[near]` on the impl |
| A plain `near-sdk = "5.29.1"` | Cargo resolves to `5.30.x` which has a `compile_error!` guard. Use the exact pin `=5.29.1` + the `unit-testing` feature in dev-deps |
| `env::mock` / `MockEnv` for tests | **Does not exist** in near-sdk 5.29. Use `testing_env!` + `near_sdk::test_utils::VMContextBuilder` (see the `set_context` helper in [`contracts:snacc/src/lib.rs`](https://github.com/Snacc-near/contracts/blob/main/snacc/src/lib.rs)) |
| `LookupMap::get(...)` assumed to be `Option<V>` | Wrong — the result is `Option<&V>`: use `.copied()` / `.cloned()` / assert `Some(&nilai)` |
| `AccountId::new_unvalidated` | Deprecated — use `"....".parse::<AccountId>().unwrap()` |
| YAML CI: `name: Foo: bar` | A colon+space in an unquoted scalar = a parse error. Quote the value |
| Inventing numbers/names | Banned. If it is not in the spec/dictionary → pick a simple solution + **record it as an ambiguity** in the report/PR |
| Breaking existing tests | Banned. Existing tests may only grow (small field adjustments are allowed) |

**The reference for the correct patterns**: [`contracts:snacc/src/state.rs`](https://github.com/Snacc-near/contracts/blob/main/snacc/src/state.rs) + `contracts:snacc/src/lib.rs` (the result of VC-001..005,
34 green tests) — follow their structure, comment style, and test patterns.

---

## 6. The backlog: how to pick & the dependencies

- **Backlog Master** = the single master (~300 items, the `VC/DK/EN/SEC/QA/UI/TEE/SDK/INT/OPS/DEMO/DOC/ECON/RES` families, the `@pemilik·Lx` labels). **The Status Board** at its top = where the project stands now — read it first, do not work on ✅ or 🔄 items.
- **The recommended work order** (follow §11–§12 of Backlog Master): `VC-006..010` (F3 TEE, F5/F6 M&A & lysis, SVG, events) → `EN-1xx` (economic mechanics) → `SEC-1xx` (security) → `QA-1xx` (tests) → `OPS/DEMO/DOC` (submission & judges).
- **Important dependencies**: `EN` needs the `D1–D8` state (already present) + F2 (already present) · `DK-033/044` (dividends) needs `advance_epoch` · the `QA` tests need the related methods finished · `OPS` (deploy/gladi) needs the complete contract · `README/DEMO` needs testnet hashes.
- **Do not collide**: `VC-005` & `ECON-101..103` are being worked on by other sessions (check `git status`) — avoid the same files.
- P2 items = post-hackathon, do not start them yet.

---

## 7. The final report format per item (team consistency)

```
## <ID> — <the item name>
- Changes: <files + functions/structures>
- Evidence: cargo test <N> passed 0 warnings; cargo check wasm green; CI <link>
- Ambiguities/decisions: <if any — must be stated>
- Status: done / partial (what remains)
```
