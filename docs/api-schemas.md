# Snacc — Skema API & JSON

> Skema view kontrak yang **sudah ada di kode** + endpoint `/api/crucible/*` rencana backend. Nama field disalin persis dari [`contracts:snacc/src/state.rs`](https://github.com/Snacc-near/contracts/blob/main/snacc/src/state.rs) dan `snacc-vault/04 Arsitektur/Snacc - Spec API Backend dan TEE.md`. Angka contoh bersifat ilustratif struktur, bukan data live.

## 1. View kontrak (JSON-RPC `query` → `call_function`)

### `get_strain(strain_id: u64)` → `StrainVesselView`

```json
{
  "strain_id": 1,
  "owner_id": "alkemis.testnet",
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

Catatan: `status` ∈ `Active | Distressed | Liquidated` (tangga solvensi `ADR-26`). `effective_vitality` dihitung lazy dari `now` (`ADR-22`). `atp_balance` bertipe `u128` (di RPC tampil sebagai string bila melebihi safe integer).

### `get_crucible_temp()` → `u64` (mK)

```json
1120
```

Rumus: `floor(1000 × V_decayed / max(total_snacc_supply, 1))` dengan lazy decay `VOLUME_DECAY_PER_SEC = 50` per detik (`ADR-04/27`). Zona: `>1400` Fever · `<600` Hypothermia · `600..=1400` netral.

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
    "fever_threshold_mk": 1400,
    "hypothermia_threshold_mk": 600,
    "fever_burn_bps": 350,
    "rebate_bps": 200,
    "max_epoch_treasury_drain_bps": 500,
    "volume_decay_per_sec": 50,
    "max_shift_bps": 1500
  },
  "crucible_temp": 900
}
```

Catatan: field `u128` tampil sebagai string di JSON RPC. `params` = parameter termostat (`D7`, Kamus Angka Resmi).

## 2. Endpoint backend `/api/crucible/*` (rencana `M5`)

Sumber: Spec API Backend dan TEE §2. Status implementasi di repo `backend` mengikuti Papan Status.

| Method & Path | Respons utama | Status |
| --- | --- | :-: |
| `GET /api/crucible/macro` | `{ crucibleTemp, zone, totalSnaccSupply, totalSnaccBurned, ruleBoundTreasury, epochVolume, history[] }` | ✅ scaffold |
| `GET /api/strains` | `{ strains: StrainVesselView[], starvingCount, splicedCount }` | ✅ scaffold (list dari event cache; indexer penuh = TODO) |
| `GET /api/strains/:id` | `StrainVesselView` | ✅ scaffold |
| `GET /api/strains/:id/svg` | `image/svg+xml` (dari `nft_token`) | stub |
| `GET /api/colony/:owner` | daftar Strain milik owner (`EN-08`) | stub |
| `GET /api/dividends` | `industrial_dividend_pool` + riwayat klaim (`DK-033`) | stub |
| `GET /api/zones` | riwayat transisi zona (`zone_changed`) | stub |
| `GET /api/appetite` | meteran selera makan (`EN-05`) | stub |
| `GET /api/events` | event `NEP-297` hasil poll log | ✅ scaffold |
| `POST /api/tee/evaluate-genome` | `{ chatId, signedText, signatureHex, signingAddress, mutation, redactionReport }` | stub (di `oracle-tee`) |
| `GET /api/tee/attestation-report` | `{ model, signingAddress, gatewayAttestation, modelAttestations }` | stub |

Endpoint stub merespons `501` dengan `{ "error": "not_implemented", "todo": "<ID backlog>" }` — tidak pernah mengarang data.

## 3. Format event `NEP-297`

Kontrak memancarkan log dengan JSON ber-field `kind` (parser di [`sdk:src/events.ts`](https://github.com/Snacc-near/sdk/blob/main/src/events.ts)):

```
{"kind":"strain_created","strain_id":1,"owner_id":"...","role_mask":1,"initial_snacc_stake":40000,"spores_minted":1}
{"kind":"extracted","strain_id":1,"token":"mt:spore-ignis","amount":1,"catalyst_fee":100}
{"kind":"transmuted","strain_id":1,"burned_spores":2,"token_out":"mt:enzyme-amalgam","minted":1,"catalyst_fee":100}
{"kind":"synthesized","strain_id":1,"token_out":"mt:elixir-homunculus","minted":1,"enzymes_burned":2,"catalyst_fee":100}
subaccount_materialized strain_id=1 sub_account_id=s-1.snacc-v001.near
```

Pembungkus baku `EVENT_JSON:{standard, version, event, data:[...]}` didukung parser (VC-010).
