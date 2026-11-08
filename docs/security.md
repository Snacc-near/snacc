# Snacc — Keamanan

> Matriks akses method kontrak `snacc-v001.near`, invariant, dan kode error. Nama disalin **persis** dari `snacc-vault/04 Arsitektur/Snacc - Spec Antarmuka Kontrak.md` dan kode kontrak (`repos/Snacc/contracts/snacc/src`). Status implementasi per 2026-11-07: `VC-001..006` ter-merge.

## 1. Matriks akses method

Akses `owner` = `predecessor` adalah `owner_id` Strain (dicek via `ERR_NOT_OWNED_BY_CALLEE`). `contract owner` = pemilik kontrak (untuk method administratif terbatas seperti rotasi kunci TEE).

| Method | Akses | Status |
| --- | --- | :-: |
| `new` (`#[init]`) | siapa pun (sekali, saat deploy) | ✅ |
| `incubate_strain` | siapa pun yang melampirkan deposit | ✅ |
| `materialize_subaccount` | owner Strain (`#[payable]`, ≥ 0.02 NEAR) | ✅ |
| `extract_spores` / `transmute_spores_to_enzyme` / `synthesize_elixir` | owner Strain + role bitmask (`I-08`) | ✅ |
| `commit_genome_experiment` | owner Strain | ✅ |
| `apply_tee_mutation_zero_trust` | owner Strain + signature TEE valid (`I-07`, `I-16`) | ✅ |
| `splice_strains` | owner kedua Strain (voluntary merger) | ✅ |
| `hostile_takeover_splice` | owner raider; target wajib Tier 2 (`I-09`, `I-14`) | ✅ |
| `harvest_starving_strain` | siapa pun; target wajib Tier 3 (`I-10`) | ✅ |
| `advance_sandbox_clock` | demo/test only | ✅ |
| `advance_epoch` | siapa pun (keeper, `E5`) — transisi epoch | ✅ |
| `ft_burn` | **TEMUAN**: saat ini tidak mengecek pemanggil — melihat SEC-101 untuk pengetatan | ⚠️ |
| `owner_withdraw_snacc` | owner Strain (`ADR-29`, nonce naik) | spec v3.0 |
| `npc_quote_spores` / `npc_buy_spores` | view / owner Strain (`ADR-30`) | spec v3.0 |
| `register_attested_signer` | contract owner (`ADR-33`) | spec v3.0 |

> Catatan jujur: baris ⚠️ adalah temuan dokumentasi ini (sesuai `SEC-101`, `V-01`: semua penarikan/kontak kas wajib `predecessor == owner`). Tidak ada fungsi penarikan treasury admin (`I-05`).

## 2. Invariant (`I-01..I-10`, `I-14..I-16`)

Dari Spec Antarmuka Kontrak:

1. **`I-01`** — setiap pengurangan `total_snacc_supply` wajib tercatat di `total_snacc_burned`.
2. **`I-02`** — `0 <= effective_vitality <= 10000`; Tier 1 `>2000`, Tier 2 `1..=2000`, Tier 3 `0`.
3. **`I-03`** — `apply_tee_mutation_zero_trust` menolak `efficiency_shift_bps` di luar `[-1500, +1500]` dan `vitality_bonus > 500`.
4. **`I-04`** — per epoch: `epoch_treasury_spent <= initial_epoch_treasury * 500 / 10000` (maks 5%).
5. **`I-05`** — tidak ada fungsi yang mengizinkan owner menarik `$SNACC` dari `rule_bound_treasury`.
6. **`I-06`** — setiap `completion.id` (`chat_id`) hanya dapat dieksekusi satu kali.
7. **`I-07`** — `env::ed25519_verify` atas `<model>:<req_sha256>:<hex(env::sha256(raw_response_body))>` yang direkonstruksi on-chain (`ADR-21`).
8. **`I-08`** — Strain Genesis wajib 1 bit peran (`1`, `2`, atau `4`); multi-bit hanya via merger.
9. **`I-09`** — `hostile_takeover_splice` hanya sah bila target Tier 2 dan raider membayar `115%` dari `target.snacc_balance`.
10. **`I-10`** — `harvest_starving_strain` hanya sah bila target Tier 3 (`effective_vitality == 0`).
11. **`I-14`** (`ADR-29`) — beliout/hostile wajib `target.state_nonce == expected && pending_promises == 0 && keyless_locked == true` (`ERR_STATE_NONCE_CHANGED_SELLER_DRAIN_BLOCKED`).
12. **`I-15`** (`ADR-30`) — konservasi perdagangan NPC: Δ`npc.snacc_reserve` == Δ`strain.snacc_balance`, Δ`npc.spores_stock` == Δ`strain.spores_ignis`.
13. **`I-16`** (`ADR-33`) — TEE hanya menerima signature dari pubkey terdaftar di `attested_tee_signers`.

> Catatan: penomoran spec melompat dari `I-10` ke `I-14` (tidak ada `I-11..I-13` di Spec Antarmuka Kontrak) — dipertahankan apa adanya demi stabilitas referensi.

- **Keputusan desain: NPC = market-maker TERISOLASI (TC-NPC-06)** — perdagangan NPC
  (`npc_buy_spores`) **tidak** memengaruhi `volume_epoch`/suhu/feast; suhu digerakkan
  aktivitas sel (fee katalis + ATP feed). Ini keputusan desain terdokumentasi — **bukan
  bug**: NPC hanyalah liquidity provider dengan kas terisolasi (`I-15`), bukan partisipan
  termostat. Bila kelak dirancang NPC ikut menggerakkan suhu, update spec + indexer
  (`tc_npc_06` sengaja gagal sebagai pengingat).
- **DK-030 lantai fee (pipeline #17)**: `effective_fee` feed di-floor ke **1 yocto** —
  kombinasi burst × dormansi × rescue tidak pernah menghasilkan feed gratis
  (`tc_dk030_feed_tidak_pernah_gratis`).

## 3. Kode error `ERR_*` (persis dari kode kontrak)

| Kode | Konteks |
| --- | --- |
| `ERR_STRAIN_ALREADY_INCUBATED` | `F1` — strain sudah pernah diinkubasi |
| `ERR_ROLE_MASK_NOT_SINGLE` | `F1` — role bitmask bukan tunggal bit (`I-08`) |
| `ERR_INSUFFICIENT_DEPOSIT` | `F1` — deposit `materialize_subaccount` < 0.02 NEAR |
| `ERR_NOT_OWNED_BY_CALLEE` | `F1..F6` — pemanggil bukan owner strain |
| `ERR_STAKE_DEPOSIT_MISMATCH` | `F1`/`F2` — deposit ≠ `initial_snacc_stake`/fee katalis |
| `ERR_STRAIN_NOT_FOUND` | semua — strain tidak ditemukan |
| `ERR_SUBACCOUNT_CREATION_FAILED_REFUNDED` | `F1` — callback pembuatan sub-account gagal (refund) |
| `ERR_STRAIN_STARVING` | `F2` — `effective_vitality == 0` (Lazy BMR) |
| `ERR_UNKNOWN_TOKEN` | `F2` — token `NEP-245` tidak dikenal |
| `ERR_ROLE_NOT_ALLOWED` | `F2` — role bitmask tidak memuat bit yang dibutuhkan |
| `ERR_INSUFFICIENT_BALANCE` | `F2`/`F4` — saldo inventori/kas kurang |
| `ERR_RECIPE_NOT_MET` | `F2` — resep transmutasi tidak terpenuhi |
| `ERR_REQUIRES_TEE_ATTESTATION` | `F2` — `mt:elixir-aether` butuh attestation TEE |
| `ERR_BAD_HEX` | `F3` — hex commitment/signature tidak valid |
| `ERR_BAD_SIGNATURE_LEN` | `F3` — signature bukan 64 byte |
| `ERR_SIGNER_NOT_REGISTERED` | `F3` — pubkey tidak ada di `attested_tee_signers` (`I-16`) |
| `ERR_COMMITMENT_ALREADY_PENDING` | `F3` — komitmen ganda pada strain yang sama |
| `ERR_COMMITMENT_MISMATCH` | `F3` — `req_sha256_hex` tidak cocok dengan komitmen |
| `ERR_TEE_REPLAY` | `F3` — `chat_id` sudah dipakai (`I-06`) |
| `ERR_PAYLOAD_STRAIN_MISMATCH` | `F3` — `payload.strain_id` ≠ `strain_id` |
| `ERR_GUARDRAIL_SHIFT` | `F3` — `|shift_bps| > 1500` (`I-03`) |
| `ERR_GUARDRAIL_VITALITY` | `F3` — `vitality_bonus > 500` (`I-03`) |
| `ERR_TEE_RESPONSE_HASH_OR_ED` | `F3` — verifikasi hash/ed25519 gagal (`I-07`) |
| `ERR_PENDING_ASYNC_CALLBACK_LOCKED` | `ADR-29` — ada cross-contract berjalan |
| `ERR_STATE_NONCE_CHANGED_SELLER_DRAIN_BLOCKED` | `ADR-29` — nonce berubah (anti seller-drain) |
| `ERR_NOT_CONTRACT_OWNER` | `ADR-33` — pemanggil bukan contract owner |

## 4. Pemetaan ke backlog keamanan

Temuan `V-01..V-06` (Audit Ronde 11) → `SEC-101..106` di Backlog Master. Status: `SEC-106` ✅; lainnya sesuai Papan Status. Audit akhir pre-submit: `SEC-116`.
