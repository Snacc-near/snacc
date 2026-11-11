# Snacc — API & JSON Schemas

> The contract view schemas that **already exist in code** + the planned backend `/api/crucible/*` endpoints. Field names are copied verbatim from [`contracts:snacc/src/state.rs`](https://github.com/Snacc-near/contracts/blob/main/snacc/src/state.rs) and `snacc-vault/04 Arsitektur/Snacc - Spec API Backend dan TEE.md`. The example numbers illustrate the structure, they are not live data.

## 1. Contract views (JSON-RPC `query` → `call_function`)

### `get_strain(strain_id: u64)` → `StrainVesselView`

```json
{
  "strain_id": 1,
  "owner_id": "alkemis.near",
  "vault_subaccount": "s-1.snacc-v001.near",
  "vitality": 8500,
  "efficiency_bps": 10000,
  "bmr_per_hour": 100,
  "last_fed_sec": 1730976000,
  "role_mask": 1,
  "state_nonce": 0,
  "pending_callbacks": 0,
  "atp_balance": "0",
  "generation": 0,
  "organel": { "mitokondria": 0, "nukleus": 0, "lisosom": 0 },
  "status": "Active",
  "effective_vitality": 8500
}
```

Notes: `status` ∈ `Active | Distressed | Liquidated | SplicedBurned` (the `ADR-26` solvency ladder). `effective_vitality` is computed lazily from `now` (`ADR-22`). `atp_balance` is a `u128` (it shows as a string over RPC when it exceeds the safe integer range).

### `get_crucible_temp()` → `u64` (mK)

```json
650
```

Formula: `floor(1000 × V_decayed / max(total_snacc_supply, 1))` with a lazy decay of `VOLUME_DECAY_PER_SEC = 50` per second (`ADR-04/27`). Zones: `>610` Fever · `<600` Hypothermia · `600..=610` neutral (`ECON-111` / Kamus Angka `D7`).

### `get_macro_state()` → `MacroStateView`

```json
{
  "current_epoch": 0,
  "last_update_ms": 1730976000000,
  "volume_epoch": "9000",
  "total_snacc_supply": "1000000",
  "total_snacc_burned": "0",
  "epoch_treasury_spent": "0",
  "epoch_treasury_initial": "200000",
  "nutrient_burst_bps": 0,
  "nutrient_burst_until": 0,
  "industrial_dividend_pool": "0",
  "epoch_dividend_inflow": "0",
  "epoch_aether_burned_total": "0",
  "last_closed_epoch": 0,
  "params": {
    "fever_threshold_mk": 610,
    "hypothermia_threshold_mk": 600,
    "fever_burn_bps": 350,
    "rebate_bps": 200,
    "max_epoch_treasury_drain_bps": 500,
    "volume_decay_per_sec": 50,
    "max_shift_bps": 1500
  },
  "crucible_temp": 605
}
```

Notes: `u128` fields show as strings in the JSON RPC. `params` = the thermostat parameters (`D7`, the Kamus Angka Resmi).

## 2. Backend endpoints `/api/crucible/*` (the `M5` plan)

Source: Spec API Backend dan TEE §2. The implementation status in the `backend` repo follows the Status Board.

| Method & Path | Main response | Status |
| --- | --- | :-: |
| `GET /api/health` | `{ ok, contractId, rpc, indexer_incomplete }` | ✅ live |
| `GET /api/crucible/macro` | `{ crucibleTemp, zone, totalSnaccSupply, totalSnaccBurned, ruleBoundTreasury, epochVolume, history[] }` | ✅ live |
| `GET /api/strains` | `{ strains: StrainVesselView[], starvingCount, liquidatedCount, splicedCount, totalMinted }` | ✅ live (contract views) |
| `GET /api/strains/:id` | `StrainVesselView` | ✅ live |
| `GET /api/strains/:id/svg` | `image/svg+xml` (from view `nft_token`) | ✅ live |
| `GET /api/colony/:owner` | `{ owner_id, strains: StrainVesselView[], colonyAtp }` | ✅ live |
| `GET /api/dividends` | `{ industrial_dividend_pool, epoch_dividend_inflow, last_closed_epoch, epoch_dividend_rate }` | ✅ live |
| `GET /api/zones` | `{ current, history: ZoneHistoryEntry[], history_complete, indexer_incomplete }` | ✅ live |
| `GET /api/appetite` | `AppetiteMeterView` (`zone, crucible_temp, current_epoch, burst_bps, dormant, feast_volume, ...`) | ✅ live |
| `GET /api/events` | `NEP-297` events from log polling | ✅ live |
| `GET /api/tee/attestation-report` | `{ model, signingAddress, gatewayAttestation, modelAttestations }` | ✅ live |
| `POST /api/tee/evaluate-genome` | `{ chatId, signedText, signatureHex, signingAddress, mutation, redactionReport }` | ✅ live (oracle-tee) |

Endpoints without active server keys respond `503` with `{ "error": "tee_not_configured" }` — they never invent data.

### 2.5 `GET /api/zones` (implemented, `EN-106`)

`{ current, history, history_complete, indexer_incomplete, history_note, contractId, blockHeight }`.
`history` flattens the absorbed `zone_changed` events (ascending by `block_height`); `block_height`
and `receipt_id` come from the poller, the zone fields are copied verbatim from the event payload.
`indexer_incomplete = !store.indexerComplete`: while the poller is incomplete, the history only
covers events captured since process start (the contract exposes no zone-history view). Missing
poller metadata is `null`, never fabricated. Example (from the network-free test fixture — the
numbers illustrate the shape, they are not live data):

```json
{
  "current": {
    "zone": "FEVER",
    "crucible_temp": 673,
    "current_epoch": 2,
    "last_zone": "Fever",
    "fever_threshold_mk": 610,
    "hypothermia_threshold_mk": 600
  },
  "history": [
    { "kind": "zone_changed", "block_height": 100, "receipt_id": "r1", "from_zone": "HYPOTHERMIA", "to_zone": "NORMAL", "crucible_temp": 650 },
    { "kind": "zone_changed", "block_height": 300, "receipt_id": "r2", "from_zone": "NORMAL", "to_zone": "FEVER", "crucible_temp": 1500 }
  ],
  "history_complete": false,
  "indexer_incomplete": true,
  "history_note": "zone_changed history only includes events captured by the poller since process start; the contract does not expose a zone history view.",
  "contractId": "snacc-v001.near",
  "blockHeight": 555
}
```

## 3. The `NEP-297` event format

The contract emits logs with JSON carrying a `kind` field (parser in [`sdk:src/events.ts`](https://github.com/Snacc-near/sdk/blob/main/src/events.ts); full catalogue in [events.md](events.md)):

```
{"kind":"strain_created","strain_id":1,"owner_id":"...","role_mask":1,"initial_snacc_stake":40000,"spores_minted":1}
{"kind":"extracted","strain_id":1,"token":"mt:spore-ignis","amount":1,"catalyst_fee":100}
{"kind":"transmuted","strain_id":1,"burned_spores":2,"token_out":"mt:enzyme-amalgam","minted":1,"catalyst_fee":100}
{"kind":"synthesized","strain_id":1,"token_out":"mt:elixir-homunculus","minted":1,"enzymes_burned":2,"catalyst_fee":100}
subaccount_materialized strain_id=1 sub_account_id=s-1.snacc-v001.near
```

The standard `EVENT_JSON:{standard, version, event, data:[...]}` wrapper is supported by the parser (VC-010).
