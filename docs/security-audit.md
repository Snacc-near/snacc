# Snacc — Security Audit (SEC-110..118)

> The results of the SEC-110..118 security-audit batch (2026-11-08). All findings are honest: what
> could be fixed is fixed, and what needs an owner decision is reported open. References:
> the test modules in the [`contracts`](https://github.com/Snacc-near/contracts) repo (`snacc/src/`).
> `SEC-108` (state_nonce consistency) & `SEC-101` (ft_burn access) = the previous batch.

## SEC-110 — The gas profile (the ADR-01 policy: receipts < 6 TGas)

- Artifact: `scripts/gas-profile.mjs` (48 gladi txs measured per receipt; writes a local gas-profile report).
- **FINDING**: the largest receipt, `materialize_subaccount` = **7.423 TGas > 6 TGas**.
- Status: **ACCEPTED with a recorded exception** (the coordinator triage, Option b — see the "Coordinator triage" section below): `ADR-01` applies to contract-logic receipts (< 6 TGas); the `materialize_subaccount` exception is < 8 TGas because NEAR protocol costs (`create_account` + storage-staking + transfer) dominate — not logic bloat. The code was not changed.
  plus 2 sub-calls), (b) revise the ADR-01 policy for account-creation receipts (NEAR protocol costs
  dominate — `create_account` storage-ops), (c) raise the ADR-01 limit to < 8 TGas.
- The other methods (17 of 18): all receipts < 5 TGas ✓. Details: run
  `node scripts/gas-profile.mjs` (reads the 48 gladi tx receipts via the public RPC).

## SEC-111 — Reentrancy / the promise window

- **FIXED (the Option a triage — the contract commit `SEC-111: complete`)**: `pending_callbacks`
  is now a REAL lock — set to 1 while `materialize_subaccount`/`nft_transfer_call` builds the
  promise, reset to 0 in the `#[private]` callbacks (`on_subaccount_created` /
  `nft_resolve_transfer`, all paths). `assert_atomic_ready` now really rejects M&A mutations
  mid-promise-window.
- Status: **CLOSED** — the tests `sec111_kunci_nyata_set_dan_lepas` &
  `sec111_kunci_nft_transfer_call` (set, a lock panic, the callback, release, a valid M&A).
## SEC-112 — Ledger arithmetic overflow/underflow

A sweep of all `snacc_balances`/`account_balances`/ATP/treasury/pool/bounty arithmetic.
Every subtraction is **preceded by an assert** (fail-fast, never underflows):
`ft_burn` (bal ≥ amount), `feed_strain` (bal ≥ amount ≥ effective_fee), `splice_strains`
(the tax = abs_bal×2.5% < abs_bal), `hostile` (raider_bal ≥ payment), `divide` (child = bal/2),
`npc_buy` (bal ≥ total_cost), `ft_transfer`/`on_transfer_call` (balance ≥ amount). Additions use
`saturating_add`. The new pipeline #6 aggregates (`set_strain_snacc`/`set_account_balance`) use
`i128` arithmetic + a clamp at 0. **No risky line requiring a change was found** —
0 production changes from SEC-112. The aggregate bookkeeping is guarded by the
`pipeline6_solvency_*` tests (drift == 0; a manual injection is detected).

## SEC-113 — The complete access matrix

Document: `docs/security.md` §1 (≈45 methods: owner / anyone / permissionless-harvest /
keeper-advance / contract-owner register_signer + views). The internal/#[private] methods deliberately
left out of the matrix: `on_subaccount_created`, `on_transfer_call`, `nft_resolve_transfer`
(only the contract itself can call them — `#[private]`), `migrate` (init-like), `new`, `protocol_version`.
The SEC-113 completeness: a "Security note" column was added per method (the pipeline #7 refund,
EN-124, the `SEC-110` minimum deposit) — already in the current document version.

## SEC-114/115 — Commitment double-spend & TEE signature reuse

Covered by the contract tests (e.g. `sec107_anti_replay_chat_id_sama_ditolak`,
`vc006_komitmen_tidak_cocok_ditolak`, `vc006_payload_strain_lain_ditolak`,
`vc006_signer_tidak_terdaftar_ditolak`): a double pending commitment
(`ERR_COMMITMENT_ALREADY_PENDING`), an apply req ≠ the commitment (`ERR_COMMITMENT_MISMATCH`),
**signature/chat_id reuse** → `ERR_TEE_REPLAY` (`I-06` — `used_tee_chat_ids` stores the
`chat_id` since the first apply; a replay with a new commitment is still caught), a payload
for another strain → `ERR_PAYLOAD_STRAIN_MISMATCH`, an unregistered signer → `ERR_SIGNER_NOT_REGISTERED`.
Status: **CLOSED** (4 tests).

## SEC-117 — The dividend claim limits

Covered by the contract tests `dk033_klaim_ganda_ditolak`, `dk033_klaim_kedaluwarsa_ditolak`,
`dk033_klaim_epoch_berjalan_ditolak`: `dividend_claimed` is unique per `(epoch, strain)`
(`ERR_DIVIDEND_ALREADY_CLAIMED`), an 8-epoch window (`ERR_DIVIDEND_CLAIM_EXPIRED` after
current−8 is missed), a running epoch is rejected (`ERR_EPOCH_NOT_CLOSED`), the payout is capped at the pool +
the rounding remainder is carried. Status: **CLOSED** (4 tests TC-DIV-01..07).

## SEC-118 — The adopt vs harvest vs second-adopt race

The new test `qa_ma_tests.rs::sec118_race_adopt_vs_adopt_dan_harvest`:
- **adopt vs adopt**: raider A wins (nonce 0 → rises), raider B with the expected nonce 0 →
  stale (`ERR_STATE_NONCE_CHANGED_SELLER_DRAIN_BLOCKED`) — one winner, guaranteed by the nonce.
- **adopt vs harvest**: the windows are **disjoint by design** — adopt requires `1..=2000`
  (`ERR_NOT_DISTRESSED` outside), harvest requires `== 0` (`ERR_STRAIN_NOT_INSOLVENT`).
  No state point satisfies both → no race; tested in both directions.
Status: **CLOSED** (test).

## The status summary

| Item | Key finding | Status |
| --- | --- | --- |
| SEC-110 | a receipt > 6 TGas only `materialize_subaccount` (the create_account protocol cost) | **ACCEPTED** — an ADR-01 amendment (<8 TGas) |
| SEC-111 | `pending_callbacks` decorative (never set) | **FIXED** — a real lock at the promise boundary (SEC-111: complete) |
| SEC-112 | 0 risky lines (every subtraction asserted, additions saturating) | CLOSED |
| SEC-113 | the complete matrix `docs/security.md` | CLOSED |
| SEC-114/115 | TEE replay/double commitments — 4 tests | CLOSED |
| SEC-116 | this document | — |
| SEC-117 | unique claims + an 8-epoch window — 4 tests | CLOSED |
| SEC-118 | the adopt/harvest race — disjoint windows + the nonce | CLOSED |

A re-check in the `contracts` repo: `cargo test` (0 failures) +
`cargo clippy --all-targets -- -D warnings` (0 warnings). $SNACC testnet has no monetary value.

## Coordinator triage (2026-11-08)

| Finding | Decision | Reason | Status |
| --- | --- | --- | --- |
| SEC-110 (materialize 7.42 TGas > 6) | **Option (b) — accepted with a recorded exception**: `ADR-01` applies to contract-logic receipts (< 6 TGas); `materialize_subaccount` < 8 TGas (the NEAR `create_account`/storage-staking protocol costs dominate, not logic bloat) | the other 17/18 methods < 5 TGas; splitting the receipt does not remove the protocol cost | ACCEPTED — an `ADR-01` amendment |
| SEC-111 (`pending_callbacks` decorative) | **Option (a) — the lock is made REAL**: set to 1 while the promise is built, reset to 0 in the `#[private]` callback | the guard matches the `ADR-29` design; `state_nonce` remains the second layer | **FIXED** (the SEC-111: complete commit; the sec111_* tests) |
