# Snacc — Security Audit (SEC-110..118)

> Hasil audit keamanan batch SEC-110..118 (2026-11-08). Semua temuan jujur: yang
> bisa diperbaiki sudah, yang butuh keputusan pemilik dilaporkan terbuka. Referensi
> test: modul test di repo [`contracts`](https://github.com/Snacc-near/contracts) (`snacc/src/`).
> `SEC-108` (state_nonce konsisten) & `SEC-101` (akses ft_burn) = batch sebelumnya.

## SEC-110 — Profil gas (kebijakan ADR-01: receipt < 6 TGas)

- Artefak: `scripts/gas-profile.mjs` (48 tx gladi diukur per receipt; menulis laporan gas-profile lokal).
- **TEMUAN**: receipt terbesar `materialize_subaccount` = **7,423 TGas > 6 TGas**.
- Status: **DITERIMA dengan pengecualian tercatat** (triase koordinator, Opsi b - lihat seksi "Triase koordinator" di bawah): `ADR-01` berlaku untuk receipt logika kontrak (< 6 TGas); pengecualian `materialize_subaccount` < 8 TGas karena biaya protokol NEAR (`create_account` + storage-staking + transfer) mendominasi - bukan bloat logika. Kode tidak diubah.
  jadi 2 sub-call), (b) revisi kebijakan ADR-01 khusus receipt pembuatan akun (biaya protokol NEAR
  mendominasi — `create_account` storage-ops), (c) naikkan batas ADR-01 menjadi < 8 TGas.
- Method lain (17 dari 18): semua receipt < 5 TGas ✓. Detail: jalankan
  `node scripts/gas-profile.mjs` (membaca receipt 48 tx gladi lewat RPC publik).

## SEC-111 — Reentrancy / promise window

- **DIPERBAIKI (triase Opsi a - commit kontrak `SEC-111: complete`)**: `pending_callbacks`
  kini kunci NYATA - di-set 1 saat `materialize_subaccount`/`nft_transfer_call` membangun
  promise, di-reset 0 di callback `#[private]` (`on_subaccount_created` /
  `nft_resolve_transfer`, semua jalur). `assert_atomic_ready` kini benar-benar menolak mutasi
  M&A di tengah promise window.
- Status: **TERTUTUP** - test `sec111_kunci_nyata_set_dan_lepas` &
  `sec111_kunci_nft_transfer_call` (set, panik kunci, callback, lepas, M&A sah).
## SEC-112 — Overflow/underflow aritmetika ledger

Sweep seluruh aritmetika `snacc_balances`/`account_balances`/ATP/treasury/pool/bounty.
Semua operasi pengurangan **didahului assert** (fail-fast, tidak pernah underflow):
`ft_burn` (bal ≥ amount), `feed_strain` (bal ≥ amount ≥ effective_fee), `splice_strains`
(tax = abs_bal×2,5% < abs_bal), `hostile` (raider_bal ≥ payment), `divide` (child = bal/2),
`npc_buy` (bal ≥ total_cost), `ft_transfer`/`on_transfer_call` (saldo ≥ amount). Penambahan
memakai `saturating_add`. Agregat baru pipeline #6 (`set_strain_snacc`/`set_account_balance`)
memakai aritmetika `i128` + clamp 0. **Tidak ditemukan baris berisiko yang perlu diubah** —
0 perubahan produksi dari SEC-112. Pembukuan agregat dijaga test
`pipeline6_solvency_*` (drift == 0; suntikan manual terdeteksi).

## SEC-113 — Matriks akses lengkap

Dokumen: `docs/security.md` §1 (≈45 method: owner / siapa pun / permissionless-harvest /
keeper-advance / contract-owner register_signer + view). Metode internal/#[private] yang
sengaja tidak di matriks: `on_subaccount_created`, `on_transfer_call`, `nft_resolve_transfer`
(hanya bisa dipanggil kontrak sendiri — `#[private]`), `migrate` (init-like), `new`, `protocol_version`.
Lengkapan SEC-113: kolom "Catatan keamanan" ditambahkan per method (pipeline #7 refund,
EN-124, `SEC-110` deposit minimum) — sudah masuk versi dokumen terkini.

## SEC-114/115 — Double-spend komitmen & reuse signature TEE

Tercakup oleh test kontrak (mis. `sec107_anti_replay_chat_id_sama_ditolak`,
`vc006_komitmen_tidak_cocok_ditolak`, `vc006_payload_strain_lain_ditolak`,
`vc006_signer_tidak_terdaftar_ditolak`): komitmen ganda pending
(`ERR_COMMITMENT_ALREADY_PENDING`), apply req ≠ komitmen (`ERR_COMMITMENT_MISMATCH`),
**reuse signature/chat_id** → `ERR_TEE_REPLAY` (`I-06` — `used_tee_chat_ids` menyimpan
`chat_id` sejak apply pertama; replay dengan komitmen baru tetap tertangkap), payload
strain lain → `ERR_PAYLOAD_STRAIN_MISMATCH`, signer tak terdaftar → `ERR_SIGNER_NOT_REGISTERED`.
Status: **TERTUTUP** (4 test).

## SEC-117 — Batas klaim dividen

Tercakup oleh test kontrak `dk033_klaim_ganda_ditolak`, `dk033_klaim_kedaluwarsa_ditolak`,
`dk033_klaim_epoch_berjalan_ditolak`: `dividend_claimed` unik per `(epoch, strain)`
(`ERR_DIVIDEND_ALREADY_CLAIMED`), jendela 8 epoch (`ERR_DIVIDEND_CLAIM_EXPIRED` setelah
current−8 terlewat), epoch berjalan ditolak (`ERR_EPOCH_NOT_CLOSED`), payout cap pool +
sisa pembulatan dibawa. Status: **TERTUTUP** (4 test TC-DIV-01..07).

## SEC-118 — Race adopt vs harvest vs adopt-kedua

Test baru `qa_ma_tests.rs::sec118_race_adopt_vs_adopt_dan_harvest`:
- **adopt vs adopt**: raider A menang (nonce 0 → naik), raider B dengan expected nonce 0 →
  stale (`ERR_STATE_NONCE_CHANGED_SELLER_DRAIN_BLOCKED`) — satu pemenang, dijamin nonce.
- **adopt vs harvest**: jendela **disjoint by design** — adopt butuh `1..=2000`
  (`ERR_NOT_DISTRESSED` di luar), harvest butuh `== 0` (`ERR_STRAIN_NOT_INSOLVENT`).
  Tidak ada titik state yang memenuhi keduanya → tidak ada race; teruji dua arah.
Status: **TERTUTUP** (test).

## Ringkasan status

| Item | Temuan kunci | Status |
| --- | --- | --- |
| SEC-110 | receipt > 6 TGas hanya `materialize_subaccount` (biaya protokol create_account) | **DITERIMA** - amandemen ADR-01 (<8 TGas) |
| SEC-111 | `pending_callbacks` dekoratif (tak pernah di-set) | **DIPERBAIKI** - kunci nyata di promise boundary (SEC-111: complete) |
| SEC-112 | 0 baris berisiko (semua pengurangan ber-assert, penambahan saturating) | TERTUTUP |
| SEC-113 | Matriks lengkap `docs/security.md` | TERTUTUP |
| SEC-114/115 | TEE replay/commit ganda — 4 test | TERTUTUP |
| SEC-116 | dokumen ini | — |
| SEC-117 | klaim unik + jendela 8 epoch — 4 test | TERTUTUP |
| SEC-118 | race adopt/harvest — window disjoint + nonce | TERTUTUP |

Cek ulang di repo `contracts`: `cargo test` (0 gagal) +
`cargo clippy --all-targets -- -D warnings` (0 warning). $SNACC testnet tanpa nilai uang.

## Triase koordinator (2026-11-08)

| Temuan | Keputusan | Alasan | Status |
| --- | --- | --- | --- |
| SEC-110 (materialize 7,42 TGas > 6) | **Opsi (b) — diterima dengan pengecualian tercatat**: `ADR-01` berlaku untuk receipt logika kontrak (< 6 TGas); `materialize_subaccount` < 8 TGas (biaya protokol `create_account`/storage-staking NEAR mendominasi, bukan bloat logika) | 17/18 method lain < 5 TGas; memecah receipt tak menghapus biaya protokol | DITERIMA — amandemen `ADR-01` |
| SEC-111 (`pending_callbacks` dekoratif) | **Opsi (a) — kunci dibuat NYATA**: set 1 saat promise dibangun, reset 0 di callback `#[private]` | guard sesuai desain `ADR-29`; `state_nonce` tetap lapis kedua | **DIPERBAIKI** (commit SEC-111: complete; test sec111_*) |
