# Snacc — Security

> The `snacc-v001.near` contract method access matrix, invariants, and error codes. Names are copied **verbatim** from `snacc-vault/04 Arsitektur/Snacc - Spec Antarmuka Kontrak.md` and the contract code (`repos/Snacc/contracts/snacc/src`). Implementation status as of 2026-11-07: `VC-001..006` merged.

## 1. The method access matrix

`owner` access = the `predecessor` is the Strain's `owner_id` (checked via `ERR_NOT_OWNED_BY_CALLEE`). `contract owner` = the contract owner (for limited administrative methods such as TEE key rotation).

| Method | Access | Status |
| --- | --- | :-: |
| `new` (`#[init]`) | anyone (once, at deploy) | ✅ |
| `incubate_strain` | anyone who attaches a deposit | ✅ |
| `materialize_subaccount` | the Strain owner (`#[payable]`, ≥ 0.02 NEAR) | ✅ |
| `extract_spores` / `transmute_spores_to_enzyme` / `synthesize_elixir` | the Strain owner + a role bitmask (`I-08`) | ✅ |
| `commit_genome_experiment` | the Strain owner | ✅ |
| `apply_tee_mutation_zero_trust` | the Strain owner + a valid TEE signature (`I-07`, `I-16`) | ✅ |
| `splice_strains` | the owner of both Strains (a voluntary merger) | ✅ |
| `hostile_takeover_splice` | the raider owner; the target must be Tier 2 (`I-09`, `I-14`) | ✅ |
| `harvest_starving_strain` | anyone; the target must be Tier 3 (`I-10`) | ✅ |
| `advance_sandbox_clock` | demo/test only | ✅ |
| `advance_epoch` | anyone (a keeper, `E5`) — the epoch transition | ✅ |
| `ft_burn` | **FINDING**: it currently does not check the caller — see SEC-101 for the tightening | ⚠️ |
| `owner_withdraw_snacc` | the Strain owner (`ADR-29`, the nonce rises) | spec v3.0 |
| `npc_quote_spores` / `npc_buy_spores` | view / the Strain owner (`ADR-30`) | spec v3.0 |
| `register_attested_signer` | the contract owner (`ADR-33`) | spec v3.0 |

> Honest note: the ⚠️ row is this document's finding (per `SEC-101`, `V-01`: every cash withdrawal/touch must have `predecessor == owner`). There is no admin treasury withdrawal function (`I-05`).

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
  (`tc_npc_06` deliberately fails as a reminder).
- **The DK-030 fee floor (pipeline #17)**: the `effective_fee` of a feed is floored at **1 yocto** —
  the burst × dormancy × rescue combination never produces a free feed
  (`tc_dk030_feed_tidak_pernah_gratis`).

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
