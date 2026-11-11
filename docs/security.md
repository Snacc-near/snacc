# Snacc — Security

> The `snacc-v001.near` contract method access matrix, invariants, and error codes. Names are copied **verbatim** from `snacc-vault/04 Arsitektur/Snacc - Spec Antarmuka Kontrak.md` and the contract code (`repos/Snacc/contracts/snacc/src`). Implementation status as of 2026-11-09: `VC-001..006` merged; access matrix verified against contracts main (SEC-113).

Verified against contracts main @ cabe745 (contracts origin/main, contracts PR #21 merge). Every `pub fn` in `contracts:snacc/src/lib.rs` at that revision has a row below; line numbers are contracts:snacc/src/lib.rs at that revision.

## 1. The method access matrix

`owner` access = the `predecessor` is the Strain's `owner_id` (checked via `ERR_NOT_OWNED_BY_CALLEE`, or `ERR_NOT_STRAIN_OWNER` via `assert_strain_owner`). `contract owner` = the contract owner stored at deploy (`owner_id`, `ERR_NOT_CONTRACT_OWNER`; for limited administrative methods such as TEE key rotation). `anyone` = any predecessor account, subject to the stated deposit / state gates. Views (`&self`, no `#[payable]`) are callable by anyone and change no state.

| Method | Access | Status |
| --- | --- | :-: |
| `new` (`#[init]`, contracts:snacc/src/lib.rs:287) | anyone (once, at deploy); sets `owner_id` to the predecessor | ✅ |
| `protocol_version` (view, contracts:snacc/src/lib.rs:324) | anyone (view) | ✅ |
| `incubate_strain` (`#[payable]`, contracts:snacc/src/lib.rs:334) | anyone; attached deposit must equal the stake (or stake debited from caller `$SNACC` balance when deposit is 0) | ✅ |
| `materialize_subaccount` (`#[payable]`, contracts:snacc/src/lib.rs:471) | the Strain owner (`ERR_NOT_OWNED_BY_CALLEE`), ≥ 0.02 NEAR | ✅ |
| `on_subaccount_created` (`#[private]`, contracts:snacc/src/lib.rs:518) | private callback — only the contract itself | ✅ |
| `get_strain` (view, contracts:snacc/src/lib.rs:548) | anyone (view) | ✅ |
| `get_solvency_tier` (view, contracts:snacc/src/lib.rs:558) | anyone (view) | ✅ |
| `get_crucible_temp` (view, contracts:snacc/src/lib.rs:571) | anyone (view) | ✅ |
| `get_macro_state` (view, contracts:snacc/src/lib.rs:577) | anyone (view) | ✅ |
| `advance_epoch` (contracts:snacc/src/lib.rs:590) | anyone (a keeper, `E5`); 24 h epoch gate | ✅ |
| `ft_burn` (contracts:snacc/src/lib.rs:669) | the Strain owner (`ERR_NOT_OWNED_BY_CALLEE`; fixed per `SEC-101`, test `sec101_ft_burn_non_owner_rejected`) | ✅ |
| `extract_spores` (`#[payable]`, contracts:snacc/src/lib.rs:945) | the Strain owner (`assert_strain_owner` → `ERR_NOT_STRAIN_OWNER`) + a role bitmask (`I-08`) | ✅ |
| `transmute_spores_to_enzyme` (`#[payable]`, contracts:snacc/src/lib.rs:989) | the Strain owner (`ERR_NOT_STRAIN_OWNER`) + a role bitmask (`I-08`) | ✅ |
| `synthesize_elixir` (`#[payable]`, contracts:snacc/src/lib.rs:1078) | the Strain owner (`ERR_NOT_STRAIN_OWNER`) + a role bitmask (`I-08`) | ✅ |
| `commit_genome_experiment` (contracts:snacc/src/lib.rs:1278) | the Strain owner (`ERR_NOT_OWNED_BY_CALLEE`) | ✅ |
| `apply_tee_mutation_zero_trust` (contracts:snacc/src/lib.rs:1306) | the Strain owner (`ERR_NOT_OWNED_BY_CALLEE`) + a valid TEE signature (`I-07`, `I-16`) | ✅ |
| `register_attested_signer` (contracts:snacc/src/lib.rs:1399) | the contract owner (`ERR_NOT_CONTRACT_OWNER`, `ADR-33`) | ✅ |
| `remove_attested_signer` (contracts:snacc/src/lib.rs:1425) | the contract owner (`ERR_NOT_CONTRACT_OWNER`) | ✅ |
| `splice_strains` (contracts:snacc/src/lib.rs:1460) | the owner of both Strains (`ERR_NOT_OWNED_BY_CALLEE` + `ERR_NOT_SAME_OWNER`); voluntary merger | ✅ |
| `hostile_takeover_splice` (contracts:snacc/src/lib.rs:1581) | the raider owner (`ERR_NOT_OWNED_BY_CALLEE`); the target must be Tier 2 (`I-09`, `I-14`); seller credited via `set_account_balance` (contracts:snacc/src/lib.rs:1668) | ✅ |
| `harvest_starving_strain` (contracts:snacc/src/lib.rs:1736) | anyone; the target must be Tier 3 (`I-10`) | ✅ |
| `nft_token` (view, contracts:snacc/src/lib.rs:1827) | anyone (view) | ✅ |
| `nft_metadata` (view, contracts:snacc/src/lib.rs:1884) | anyone (view) | ✅ |
| `nft_total_supply` (view, contracts:snacc/src/lib.rs:1901) | anyone (view) | ✅ |
| `nft_tokens` (view, contracts:snacc/src/lib.rs:1906) | anyone (view) | ✅ |
| `nft_supply_for_owner` (view, contracts:snacc/src/lib.rs:1922) | anyone (view) | ✅ |
| `nft_tokens_for_owner` (view, contracts:snacc/src/lib.rs:1935) | anyone (view) | ✅ |
| `ft_balance_of` (view, contracts:snacc/src/lib.rs:1979) | anyone (view) | ✅ |
| `ft_total_supply` (view, contracts:snacc/src/lib.rs:1984) | anyone (view) | ✅ |
| `get_total_wealth` (view, contracts:snacc/src/lib.rs:1990) | anyone (view) | ✅ |
| `ft_transfer` (`#[payable]`, contracts:snacc/src/lib.rs:2006) | anyone as sender (= predecessor); exactly 1 yoctoNEAR (`assert_one_yocto`); receiver must be storage-registered | ✅ |
| `ft_transfer_call` (`#[payable]`, contracts:snacc/src/lib.rs:2053) | anyone as sender (= predecessor); exactly 1 yoctoNEAR via `ft_transfer`; then a promise to `ft_on_transfer` | ✅ |
| `on_transfer_call` (`#[private]`, contracts:snacc/src/lib.rs:2082) | private callback — only the contract itself | ✅ |
| `ft_metadata` (view, contracts:snacc/src/lib.rs:2106) | anyone (view) | ✅ |
| `storage_deposit` (`#[payable]`, contracts:snacc/src/lib.rs:2126) | anyone, for self or a named `account_id`; ≥ 5 milliNEAR on first registration; `registration_only` refunds excess | ✅ |
| `storage_withdraw` (`#[payable]`, contracts:snacc/src/lib.rs:2182) | own account only (caller = predecessor); full withdrawal deregisters when no `$SNACC` balance | ✅ |
| `storage_balance_of` (view, contracts:snacc/src/lib.rs:2225) | anyone (view) | ✅ |
| `storage_balance_bounds` (view, contracts:snacc/src/lib.rs:2237) | anyone (view) | ✅ |
| `storage_unregister` (`#[payable]`, contracts:snacc/src/lib.rs:2250) | own account only (caller = predecessor); exactly 1 yoctoNEAR (`assert_one_yocto`); `force` required when `$SNACC` balance > 0 | ✅ |
| `synthesize_and_redeem_aether` (contracts:snacc/src/lib.rs:2324) | the Strain owner (`ERR_NOT_STRAIN_OWNER`) + Synthesizer role bit | ✅ |
| `claim_industrial_dividend` (`#[payable]`, contracts:snacc/src/lib.rs:2379) | the Strain owner (`ERR_NOT_STRAIN_OWNER`); attached deposit is refunded defensively | ✅ |
| `get_dividend_pool` (view, contracts:snacc/src/lib.rs:2457) | anyone (view) | ✅ |
| `get_epoch_dividend_rate` (view, contracts:snacc/src/lib.rs:2466) | anyone (view) | ✅ |
| `get_dividend_contribution` (view, contracts:snacc/src/lib.rs:2471) | anyone (view) | ✅ |
| `get_burst_state` (view, contracts:snacc/src/lib.rs:2491) | anyone (view) | ✅ |
| `feed_strain` (`#[payable]`, contracts:snacc/src/lib.rs:2513) | the Strain owner (`ERR_NOT_OWNED_BY_CALLEE`); attached deposit is refunded defensively | ✅ |
| `get_top_feeder` (view, contracts:snacc/src/lib.rs:2639) | anyone (view) | ✅ |
| `get_appetite_meter` (view, contracts:snacc/src/lib.rs:2645) | anyone (view) | ✅ |
| `migrate` (`#[init(ignore_state)]` + `#[private]`, contracts:snacc/src/lib.rs:2711) | private — only the contract itself | ✅ |
| `get_colony` (view, contracts:snacc/src/lib.rs:2765) | anyone (view) | ✅ |
| `get_colony_atp` (view, contracts:snacc/src/lib.rs:2784) | anyone (view) | ✅ |
| `divide_strain` (contracts:snacc/src/lib.rs:2805) | the Strain owner (`ERR_NOT_OWNED_BY_CALLEE`) | ✅ |
| `adopt` (contracts:snacc/src/lib.rs:2942) | the raider Strain owner (`ERR_NOT_OWNED_BY_CALLEE`); the target must be Tier 2 (`I-14` nonce) | ✅ |
| `conjugate_traits` (contracts:snacc/src/lib.rs:3040) | the owner of both Strains (`ERR_NOT_OWNED_BY_CALLEE` + `ERR_NOT_SAME_OWNER`) | ✅ |
| `get_risk_heat` (view, contracts:snacc/src/lib.rs:3106) | anyone (view) | ✅ |
| `get_npc` (view, contracts:snacc/src/lib.rs:3123) | anyone (view) | ✅ |
| `npc_quote_spores` (view, contracts:snacc/src/lib.rs:3161) | anyone (view, `ADR-30`) | ✅ |
| `npc_buy_spores` (contracts:snacc/src/lib.rs:3174) | the Strain owner (`ERR_NOT_OWNED_BY_CALLEE`, `ADR-30`) | ✅ |
| `allocate_atp` (contracts:snacc/src/lib.rs:3235) | the Strain owner (`ERR_NOT_OWNED_BY_CALLEE`) | ✅ |
| `nft_transfer` (`#[payable]`, contracts:snacc/src/lib.rs:3322) | the Strain owner (`ERR_NOT_OWNED_BY_CALLEE`); exactly 1 yoctoNEAR (`assert_one_yocto`) | ✅ |
| `nft_transfer_call` (`#[payable]`, contracts:snacc/src/lib.rs:3387) | the Strain owner (via `nft_transfer`); exactly 1 yoctoNEAR; then a promise to `nft_on_transfer` | ✅ |
| `nft_resolve_transfer` (`#[private]`, contracts:snacc/src/lib.rs:3432) | private callback — only the contract itself | ✅ |
| `get_inventory` (view, contracts:snacc/src/lib.rs:3483) | anyone (view) | ✅ |
| `get_global_solvency` (view, contracts:snacc/src/lib.rs:3496) | anyone (view) | ✅ |
| `advance_sandbox_clock` (contracts:snacc/src/lib.rs:249) | the contract owner (`ERR_NOT_CONTRACT_OWNER`); non-mainnet sandbox only — demo/test | ✅ |
| `get_sandbox_clock` (view, contracts:snacc/src/lib.rs:278) | anyone (view) | ✅ |

> Honest note: the `ft_burn` row was previously this document's finding (per `SEC-101`, `V-01`: every cash withdrawal/touch must have `predecessor == owner`); the contract now enforces it (see `fn ft_burn` in `contracts:snacc/src/lib.rs` — it asserts the caller against the Strain owner, error `ERR_NOT_OWNED_BY_CALLEE`). There is no admin treasury withdrawal function (`I-05`).

## 2. Invariants (`I-01..I-10`, `I-14..I-16`)

From the Spec Antarmuka Kontrak:

1. **`I-01`** — every `total_snacc_supply` decrease must be recorded in `total_snacc_burned`.
2. **`I-02`** — `0 <= effective_vitality <= 10000`; Tier 1 `>2000`, Tier 2 `1..=2000`, Tier 3 `0`.
3. **`I-03`** — `apply_tee_mutation_zero_trust` rejects an `efficiency_shift_bps` outside `[-1500, +1500]` and a `vitality_bonus > 500`.
4. **`I-04`** — per epoch: `epoch_treasury_spent <= initial_epoch_treasury * 500 / 10000` (a max of 5%).
5. **`I-05`** — no function allows the owner to withdraw `$SNACC` from the `rule_bound_treasury`.
6. **`I-06`** — every `completion.id` (`chat_id`) can be executed only once.
7. **`I-07`** — `env::ed25519_verify` over `<model>:<req_sha256>:<hex(env::sha256(raw_response_body))>` reconstructed on-chain (`ADR-21`).
8. **`I-08`** — a Genesis Strain must have 1 role bit (`1`, `2`, or `4`); multi-bit only via a merger.
9. **`I-09`** — `hostile_takeover_splice` is valid only when the target is Tier 2 and the raider pays `115%` of `target.snacc_balance`.
10. **`I-10`** — `harvest_starving_strain` is valid only when the target is Tier 3 (`effective_vitality == 0`).
11. **`I-14`** (`ADR-29`) — adopt/hostile requires `target.state_nonce == expected && pending_promises == 0 && keyless_locked == true` (`ERR_STATE_NONCE_CHANGED_SELLER_DRAIN_BLOCKED`).
12. **`I-15`** (`ADR-30`) — NPC trade conservation: Δ`npc.snacc_reserve` == Δ`strain.snacc_balance`, Δ`npc.spores_stock` == Δ`strain.spores_ignis`.
13. **`I-16`** (`ADR-33`) — the TEE only accepts signatures from pubkeys registered in `attested_tee_signers`.

> Note: the spec numbering jumps from `I-10` to `I-14` (there is no `I-11..I-13` in the Spec Antarmuka Kontrak) — kept as-is for reference stability.

- **A design decision: the NPC = an ISOLATED market-maker (TC-NPC-06)** — NPC trading
  (`npc_buy_spores`) does **not** affect `volume_epoch`/temperature/the feast; the temperature is driven by
  cell activity (catalyst fees + ATP feeds). This is a documented design decision — **not
  a bug**: the NPC is just a liquidity provider with isolated cash (`I-15`), not a
  thermostat participant. If the NPC is later designed to move the temperature too, update the spec + the indexer
  and add the regression test (no such test exists yet — the earlier "`tc_npc_06` deliberately fails" note
  referenced a test that was never written).
- **The DK-030 fee floor (pipeline #17)**: the `effective_fee` of a feed is floored at **1 yocto** —
  the burst × dormancy × rescue combination never produces a free feed
  (`tc_dk030_feeding_is_never_free`).
- **Official NEAR AI verifier references (RES-104)** — NEAR AI's official repositories for
  TDX/DCAP attestation verification (existence verified via the GitHub API, 2026-11-08):
  - [`nearai/nearai-cloud-verifier`](https://github.com/nearai/nearai-cloud-verifier) — "NEAR AI Cloud Verifier";
  - [`nearai/tee-attestation-server`](https://github.com/nearai/tee-attestation-server) — "Lightweight TEE attestation sidecar for dstack CVM deployments";
  - [`nearai/cloud-api`](https://github.com/nearai/cloud-api) — cloud API (the attestation endpoint that `demo:replay` RES-103 uses);
  - `dcap-qvl` (Rust/CLI verifier for DCAP quotes) — when available, install via `cargo install`; at audit time it was **not installed** on the gladi machine → offline verification is honestly reported `SKIPPED` (see `demo:replay` RES-103).

## 3. The `ERR_*` error codes (verbatim from the contract code)

| Code | Context |
| --- | --- |
| `ERR_STRAIN_ALREADY_INCUBATED` | `F1` — the strain was already incubated |
| `ERR_ROLE_MASK_NOT_SINGLE` | `F1` — the role bitmask is not a single bit (`I-08`) |
| `ERR_INSUFFICIENT_DEPOSIT` | `F1` — the `materialize_subaccount` deposit < 0.02 NEAR |
| `ERR_NOT_OWNED_BY_CALLEE` | `F1..F6` — the caller is not the strain owner |
| `ERR_STAKE_DEPOSIT_MISMATCH` | `F1`/`F2` — the deposit ≠ `initial_snacc_stake`/the catalyst fee |
| `ERR_STRAIN_NOT_FOUND` | all — the strain is not found |
| `ERR_SUBACCOUNT_CREATION_FAILED_REFUNDED` | `F1` — the sub-account creation callback failed (refunded) |
| `ERR_STRAIN_STARVING` | `F2` — `effective_vitality == 0` (Lazy BMR) |
| `ERR_UNKNOWN_TOKEN` | `F2` — an unknown `NEP-245` token |
| `ERR_ROLE_NOT_ALLOWED` | `F2` — the role bitmask lacks the required bit |
| `ERR_INSUFFICIENT_BALANCE` | `F2`/`F4` — insufficient inventory/cash balance |
| `ERR_RECIPE_NOT_MET` | `F2` — the transmutation recipe is not met |
| `ERR_REQUIRES_TEE_ATTESTATION` | `F2` — `mt:elixir-aether` requires a TEE attestation |
| `ERR_BAD_HEX` | `F3` — an invalid commitment/signature hex |
| `ERR_BAD_SIGNATURE_LEN` | `F3` — the signature is not 64 bytes |
| `ERR_SIGNER_NOT_REGISTERED` | `F3` — the pubkey is not in `attested_tee_signers` (`I-16`) |
| `ERR_COMMITMENT_ALREADY_PENDING` | `F3` — a double commitment on the same strain |
| `ERR_COMMITMENT_MISMATCH` | `F3` — `req_sha256_hex` does not match the commitment |
| `ERR_TEE_REPLAY` | `F3` — the `chat_id` was already used (`I-06`) |
| `ERR_PAYLOAD_STRAIN_MISMATCH` | `F3` — `payload.strain_id` ≠ `strain_id` |
| `ERR_GUARDRAIL_SHIFT` | `F3` — `|shift_bps| > 1500` (`I-03`) |
| `ERR_GUARDRAIL_VITALITY` | `F3` — `vitality_bonus > 500` (`I-03`) |
| `ERR_TEE_RESPONSE_HASH_OR_ED` | `F3` — the hash/ed25519 verification failed (`I-07`) |
| `ERR_PENDING_ASYNC_CALLBACK_LOCKED` | `ADR-29` — a cross-contract call is running |
| `ERR_STATE_NONCE_CHANGED_SELLER_DRAIN_BLOCKED` | `ADR-29` — the nonce changed (anti seller-drain) |
| `ERR_NOT_CONTRACT_OWNER` | `ADR-33` — the caller is not the contract owner |

## 4. Mapping to the security backlog

The `V-01..V-06` findings (Audit Round 11) → `SEC-101..106` in Backlog Master. Status: `SEC-106` ✅; the rest per the Status Board. The final pre-submit audit: `SEC-116`.
