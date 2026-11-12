# Snacc — Event Catalogue (`NEP-297`)

> Every log line the contract emits, copied from the emit sites in [`contracts:snacc/src/lib.rs`](https://github.com/Snacc-near/contracts/blob/main/snacc/src/lib.rs) and the emitter in [`contracts:snacc/src/events.rs`](https://github.com/Snacc-near/contracts/blob/main/snacc/src/events.rs). Event and field names are verbatim from code; the example values illustrate the structure, they are not live data. The parser lives in [`sdk:src/events.ts`](https://github.com/Snacc-near/sdk/blob/main/src/events.ts), the poller in [`backend:src/events.ts`](https://github.com/Snacc-near/backend/blob/main/src/events.ts). Companion documents: [api-schemas.md](api-schemas.md) · [architecture.md](architecture.md) · [security.md](security.md).

## 1. Envelope

Every event is one log line:

```
EVENT_JSON:{"standard":"<standard>","version":"1.0.0","event":"<event>","data":[<payload>]}
```

| `standard` | Emitted through | Payload |
| --- | --- | --- |
| `snacc` | `events::emit_event_json` | a JSON object whose `kind` field is lifted into the envelope's `event`; the whole object (including `kind`) stays in `data[0]` |
| `nep141` | `events::emit_standard_event` | the plain `NEP-141` payload (no `kind`) |
| `nep171` | `events::emit_standard_event` | the plain `NEP-171` payload (no `kind`) |

One more log is **not** JSON: `subaccount_materialized strain_id=<id> sub_account_id=<s-id.contract>` (from `materialize_subaccount`).

**Number encoding.** `snacc` payloads write integers as bare JSON numbers, including `u128` amounts (`fee`, `payout`, `book_value`, …). Values above 2^53 lose precision in a plain `JSON.parse`; read them with a big-integer-aware parser. `nep141` payloads write `amount` as a decimal string, as the standard requires.

## 2. `standard: "snacc"` events

`Emitted by` is the contract method (or internal helper) containing the emit site. `SDK` marks whether `sdk:src/events.ts` has a typed parser for the kind.

### 2.1 Lifecycle and supply chain

| `kind` | Emitted by | Payload fields | SDK |
| --- | --- | --- | :-: |
| `strain_created` | `incubate_strain` | `strain_id`, `owner_id`, `role_mask`, `initial_snacc_stake`, `spores_minted` | ✅ |
| `extracted` | `extract_spores` | `strain_id`, `token`, `amount` (always `1`), `catalyst_fee` | ✅ |
| `transmuted` | `transmute_spores_to_enzyme` | `strain_id`, `burned_spores`, `token_out`, `minted`, `catalyst_fee`, `diet_bps` | ✅ |
| `synthesized` | `synthesize_elixir` | `strain_id`, `token_out`, `minted`, `enzymes_burned`, `catalyst_fee` | ✅ |
| `fed` | `feed_strain` | `strain_id`, `base_fee`, `effective_fee`, `burst_bps`, `rescue_bps`, `dormant`, `atp_minted` | ✅ |
| `atp_spent` | `extract_spores`, `transmute_spores_to_enzyme`, `synthesize_elixir`, `splice_strains`, `hostile_takeover_splice`, `divide_strain` | `strain_id`, `purpose`, `cost` | ✅ |
| `atp_allocated` | `allocate_atp` | `strain_id`, `mitokondria`, `nukleus`, `lisosom`, `cost`, `epoch` | ✅ |
| `strain_divided` | `divide_strain` | `parent_id`, `child_id`, `child_generation`, `parent_balance`, `child_balance`, `child_vitality`, `child_spores` | ✅ |
| `trait_conjugated` | `conjugate_traits` | `from_strain_id`, `to_strain_id`, `phenotype_trait` | ✅ |

`atp_spent.purpose` and `cost` come as fixed pairs in code: `extract` → `1`, `transmute` → `2`, `synthesize` → `3`, `divide` → `3`, `splice` → `5`, `hostile` → `10`.

### 2.2 Corporate actions and lysis

| `kind` | Emitted by | Payload fields | SDK |
| --- | --- | --- | :-: |
| `strains_spliced` | `splice_strains` | `dominant_id`, `absorbed_id`, `merger_tax` | ✅ |
| `hostile_takeover_spliced` | `hostile_takeover_splice` | `raider_id`, `target_id`, `book_value`, `payment`, `seller_payout`, `treasury_cut` | ✅ |
| `strain_adopted` | `adopt` | `target_id`, `adopter`, `raider_strain_id`, `book_value` | ✅ |
| `strain_liquidated` | `harvest_starving_strain` | `target_id`, `liquidator`, `bounty`, `treasury_recovery` | ✅ |
| `nutrient_burst_released` | `harvest_starving_strain` | `strain_id`, `epoch`, `released_vita`, `burst_bps`, `until_epoch` | ✅ |

### 2.3 Macro thermostat, epoch and dividend

| `kind` | Emitted by | Payload fields | SDK |
| --- | --- | --- | :-: |
| `zone_changed` | `apply_thermostat_fee` (every fee path), only when the computed zone differs from `last_zone` | `from_zone`, `to_zone`, `crucible_temp` | ✅ |
| `feast_result` | `advance_epoch` | `epoch`, `volume`, `target`, `verdict` | ✅ |
| `epoch_dividend_closed` | `advance_epoch` | `epoch`, `pool`, `total_burned`, `rate` | ✅ |
| `dividend_inflow` | `accrue_dividend_inflow` | `action` (`catalyst_fee`), `fee`, `burned`, `inflow`, `epoch` | ✅ |
| `aether_burned_for_dividend` | `synthesize_and_redeem_aether` | `strain_id`, `amount`, `epoch`, `cumulative` | ✅ |
| `dividend_claimed` | `claim_industrial_dividend` | `strain_id`, `epoch`, `contribution`, `payout`, `pool_after` | ✅ |

`zone_changed` zone strings are the canonical `MacroZone::as_str` values: `NORMAL`, `FEVER`, `HYPO` (the Hypothermia zone is spelled `HYPO` on the wire). `feast_result.verdict` is `GOLDILOCKS`, `OVERFED` or `UNDERFED`.

### 2.4 TEE genome, NPC, rehearsal controls

| `kind` | Emitted by | Payload fields | SDK |
| --- | --- | --- | :-: |
| `genome_committed` | `commit_genome_experiment` | `strain_id`, `req_sha256_hex` | ✅ |
| `genome_mutated` | `apply_tee_mutation_zero_trust` | `strain_id`, `efficiency_shift_bps`, `vitality_bonus` | ✅ |
| `signer_added` | `register_attested_signer` | `pubkey_hex`, `attested_at_sec` | — |
| `signer_removed` | `remove_attested_signer` | `pubkey_hex` | — |
| `npc_spores_bought` | `npc_buy_spores` | `strain_id`, `npc_id`, `amount`, `unit_price`, `total_cost` | ✅ |
| `sandbox_clock_advanced` | `advance_sandbox_clock` (owner-only; enabled only on `.testnet` contract accounts) | `hours`, `sandbox_time_offset_sec` | — |

## 3. Standard `NEP-141` / `NEP-171` events

| `standard` · `event` | Emitted by | Payload fields | SDK |
| --- | --- | --- | :-: |
| `nep141` · `ft_mint` | `incubate_strain` | `owner_id`, `amount` (string), `memo` (`"incubate_strain"`) | ✅ |
| `nep141` · `ft_burn` | `ft_burn` | `owner_id`, `amount` (string), `memo` (`null`) | ✅ |
| `nep141` · `ft_transfer` | `ft_transfer` | `old_owner_id`, `new_owner_id`, `amount` (string), `memo` | ✅ |
| `nep171` · `nft_transfer` | `nft_transfer`, `nft_resolve_transfer` | `old_owner_id`, `new_owner_id`, `token_ids` (array), `approved_account_ids` (`null`), `memo` | ✅ |

`nft_resolve_transfer` emits the same event in reverse (`memo`: `"nft_transfer_call rejected"`) when the receiver rejects an `nft_transfer_call`.

## 4. Example payloads

```json
EVENT_JSON:{"standard":"snacc","version":"1.0.0","event":"npc_spores_bought","data":[{"kind":"npc_spores_bought","strain_id":1,"npc_id":"npc-extractor","amount":50,"unit_price":111,"total_cost":5550}]}
EVENT_JSON:{"standard":"snacc","version":"1.0.0","event":"zone_changed","data":[{"kind":"zone_changed","from_zone":"NORMAL","to_zone":"FEVER","crucible_temp":650}]}
EVENT_JSON:{"standard":"nep141","version":"1.0.0","event":"ft_transfer","data":[{"old_owner_id":"alkemis.testnet","new_owner_id":"raider.testnet","amount":"1000","memo":null}]}
```

The first line is the output of the contract test `tc_npc_03_buy_spores_atomic_conservation_i15` (see `contracts:snacc/src/qa_npc_tests.rs`); the other two show the structure only.

## 5. Parser coverage and gaps

- `sdk:src/events.ts` types **28** kinds: 23 of the 26 `snacc` kinds above, plus `subaccount_materialized`, `ft_mint`, `ft_burn`, `ft_transfer` and `nft_transfer`.
- **Not typed in the SDK:** `signer_added`, `signer_removed`, `sandbox_clock_advanced` (operator and rehearsal controls, not gameplay). The backend poller forwards any event that carries a `kind`, so they still reach `GET /api/events` as raw payloads.
- The indexer is event-cache based; it is not a full history (`indexer_incomplete`, see [api-schemas.md](api-schemas.md) §2).
- This catalogue was derived from the code at the commit it was written; if the contract adds an emit site, this table and the SDK parser must be updated in the same change.
