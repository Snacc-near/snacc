# Brief & Prompt `free-pi-cli` — Proyek Snacc

> Untuk dijalankan **manual oleh pemilik**. Dokumen ini berdiri sendiri: instruksi lengkap untuk CLI coding agent `free-pi-cli` agar bisa langsung mengerjakan backlog Snacc tanpa merusak kerja tim.

---

## 0. Prompt starter (tempel ke `free-pi-cli` saat mulai sesi)

```
Anda bekerja pada proyek Snacc (NEAR AI Hackathon, deadline 14 Nov 2026 23:59 UTC).
WAJIB baca dulu sebelum menyentuh kode, urutannya:
1. docs/free-pi-cli-brief.md (file ini) — aturan & gotchas
2. CLAUDE.md (root repo payung) — aturan keras
3. docs/partner-onboarding.md — pemahaman produk end-to-end
4. snacc-vault/09 Backlog/Snacc - Backlog Master.md — Papan Status + daftar item
5. snacc-vault/09 Backlog/Snacc - Pembagian Tim.md — siapa pegang apa
6. snacc-vault/04 Arsitektur/Snacc - Model Data.md — §Kamus Angka Resmi (SEMUA angka dari sini)
7. snacc-vault/04 Arsitektur/Snacc - Spec Antarmuka Kontrak.md — nama method/event/error WAJIB persis

Lalu: pilih item dari Backlog Master (ikuti Papan Status ⏭️ Berikutnya; jangan ambil
item yang sedang dikerjakan sesi lain — cek `git status` tiap repo dulu). Kerjakan
di branch `item/<ID>`, commit pesan `<ID>: <ringkasan>`, buka PR, tunggu CI hijau,
update Papan Status + commit `docs: status <ID>` di snacc-vault. Ikuti semua aturan
di bagian 4 dokumen ini TANPA kecuali.
```

---

## 1. Proyeknya apa (30 detik)

**Snacc ($SNACC) — "NFTs that eat a memecoin. Feed your Snacc or it gets snacked."**
Permainan ekonomi on-chain di NEAR: setiap NFT (`NEP-171`/`NEP-177`) adalah organisme hidup
ber-neraca (sub-account `s-<id>.snacc-v001.near`) yang **harus makan memecoin `$SNACC`**
(vitalitas meluruh via BMR), bekerja di rantai pasok 3-tahap molekul `NEP-245`, bisa di-merger
(`splice_strains`), di-hostile-takeover saat sekarat, dan dipanen siapa pun saat pingsan
(`harvest_starving_strain`). Di belakangnya: bank sentral algoritmik `CrucibleTemp`
(burn 3,5% saat Fever / rebate 2% saat Hypothermia), 3 NPC otonom, dan verifikasi keputusan
AI rahasia di `NEAR AI Cloud TEE` yang dicek langsung kontrak (`env::ed25519_verify`).
Track submission: `memecoins` + `nfts`. Detail produk: `docs/partner-onboarding.md`.

---

## 2. WAJIB BACA sebelum menyentuh backlog (urut, jangan dilompati)

| # | Dokumen | Untuk apa |
|---|---|---|
| 1 | `repos/Snacc/CLAUDE.md` | **Aturan keras**: commit ber-ID, PR/CI, batas waktu, secret, aturan kejujuran |
| 2 | `repos/Snacc/docs/partner-onboarding.md` | Paham produk end-to-end (mekanik, ekonomi, teknologi) |
| 3 | `snacc-vault/09 Backlog/Snacc - Backlog Master.md` | **Papan Status** (posisi proyek) + semua item + label `@pemilik·Lx` + DoD |
| 4 | `snacc-vault/09 Backlog/Snacc - Pembagian Tim.md` | Pembagian lane — jangan ambil kerjaan lane lain tanpa koordinasi |
| 5 | `snacc-vault/04 Arsitektur/Snacc - Model Data.md` | **§Kamus Angka Resmi** — sumber SEMUA angka (nilai lain = superseded, dilarang) |
| 6 | `snacc-vault/04 Arsitektur/Snacc - Spec Antarmuka Kontrak.md` | Nama **method/event/field/error** harus persis dari sini |
| 7 | `snacc-vault/05 Fitur/Snacc - Fitur F<id>.md` | Spec fitur untuk item yang dikerjakan (F1–F7) |
| 8 | `snacc-vault/09 Backlog/Snacc - Test Case Kontrak dan TEE.md` | Format & kasus test (`TC-*`) |
| 9 | `snacc-vault/08 Mapping/Snacc - Peta Resource NEAR.md` | Resource/integrasi yang dipakai vs sengaja tidak |

Catatan: `snacc-vault/` adalah **sumber kebenaran desain** (86 dokumen, repo **private**,
read-only untuk Anda kecuali 2 file status yang diatur bagian 4). Kalau ada konflik antara
dokumen lain dan Kamus Angka + Spec Kontrak, **kamus & spec yang menang**.

---

## 3. Repositori, toolchain, dependensi

**Polyrepo gaya x207** di GitHub org **`Snacc-near`** (7 repo public + vault private). Clone berdampingan:

```bash
mkdir -p snacc-work && cd snacc-work
for r in snacc contracts oracle-tee sdk backend frontend scripts; do
  git clone git@github.com:Snacc-near/$r.git
done
```

| Repo | Modul | Isi | Status |
|---|---|---|---|
| `snacc` | payung | README, `docs/` (brief ini, partner-onboarding, CLAUDE.md) | aktif |
| `contracts` | M1+M2 | Kontrak Rust `snacc-v001.near` — **inti semua mekanik** | VC-001..005 ✅/berjalan, 34 test |
| `oracle-tee` | M3 | Dual-Layer Redaction + klien `z-ai/glm-5.3-flash` + verifiktor ed25519 | stub |
| `sdk` | M4 | `lab-sdk`: Function Call Keys + `SnaccClient` | stub |
| `backend` | M5 | Indexer `NEP-297` + API `/api/crucible/*` | stub |
| `frontend` | M6 | `biolab-ui`: 3-Column Console + 30s Judge Walkthrough | stub |
| `scripts` | M7 | `verify:thesis`, `demo:replay`, `demo-e2e.mjs`, simulasi ekonomi | aktif |

**Toolchain & dependensi (terkunci, jangan diubah tanpa alasan):**
- `rustc 1.99.1` (dipin via `rust-toolchain.toml`), target `wasm32-unknown-unknown`
- `near-sdk = "=5.29.1"` (pin **eksak**) + `near-sdk` feature **`unit-testing`** di dev-dependencies
- Node.js LTS (murni, tanpa framework berat), `gh` CLI (GitHub), git
- CI: GitHub Actions — `contracts`: `cargo test` + `cargo check --target wasm32-unknown-unknown` (wajib hijau 0 warning); repo lain: placeholder yang diperluas saat kode masuk
- Tidak ada dependensi eksternal yang boleh ditambah ke kontrak tanpa persetujuan pemilik

**Setup verifikasi kontrak:**
```bash
cd contracts && cargo test && cargo check --target wasm32-unknown-unknown
```
Dua perintah ini harus **keduanya hijau** sebelum setiap PR.

---

## 4. Aturan main (TANPA KECUALI — detail di `CLAUDE.md`)

1. **Branch & PR**: kerjakan di `item/<ID>`; commit pesan **`<ID>: <ringkasan>`** (item sebagian: kata "partial"); buka PR ke `main`; **merge hanya setelah CI hijau**. Jangan push langsung ke `main` kecuali commit infra kecil yang diminta pemilik. Jangan `git add -A` — path eksplisit.
2. **Batas waktu**: satu item **maksimal 45 menit**; satu masalah **maksimal 3 kali** menjalankan test yang sama. Lewat itu: commit yang sudah lulus, catat kendala di log, pindah item.
3. **Nama = spec**: method, event, field, error, endpoint, kolom — salin **persis** dari `Spec Antarmuka Kontrak` / spec fitur. Angka **hanya** dari Kamus Angka Resmi.
4. **Kejujuran**: tanpa hash transaksi testnet = **tanpa klaim live**; dilarang kata "GameFi/investasi/yield" (pakai "permainan ekonomi on-chain"); profit = kerja + redistribusi, tanpa jaminan untung; `$SNACC` testnet tanpa nilai uang; volatilitas = fitur, bukan janji.
5. **Secret**: hanya di `.env` (gitignored) dan `.secrets/` — jangan pernah ditampilkan, dicatat, atau di-commit. Repositori ini **public**. Jalankan pindai secret sebelum push.
6. **Sinkronisasi status (WAJIB setelah tiap item selesai):**
   - update **Papan Status** + baris item di `snacc-vault/09 Backlog/Snacc - Backlog Master.md`
   - commit di `snacc-vault` dengan pesan **`docs: status <ID>`**
   - tambah entri `Progress Snacc.md` (`vault/00 Log/Progress/`, format: waktu `date -u`, Selesai/Sebagian/Menunggu/Keputusan/Bukti) — commit `log: Snacc`
7. **Anti-tabrakan**: sebelum mulai item, cek `git status` tiap repo — kalau ada file sudah ter-modifikasi oleh sesi lain (child session/anggota tim), **jangan sentuh file itu**; pilih item lain atau tunggu. `snacc-vault` boleh diubah HANYA untuk 2 file status di poin 6.
8. **snacc-vault = private, jangan pernah dijadikan public.**

---

## 5. Gotchas teknis (pelajaran mahal — JANGAN diulangi)

| Jebakan | Kebenarannya |
|---|---|
| `#[near_bindgen]` di struct kontrak | **SALAH** untuk near-sdk 5 → build wasm gagal `E0277: ContractState`. Pakai `#[near(contract_state)]` + `#[near]` di impl |
| `near-sdk = "5.29.1"` biasa | Cargo resolve ke `5.30.x` yang punya `compile_error!` guard. Pakai pin eksak `=5.29.1` + feature `unit-testing` di dev-deps |
| `env::mock` / `MockEnv` untuk test | **Tidak ada** di near-sdk 5.29. Pakai `testing_env!` + `near_sdk::test_utils::VMContextBuilder` (lihat helper `set_context` di `contracts/snacc/src/lib.rs`) |
| `LookupMap::get(...)` dianggap `Option<V>` | Salah — hasilnya `Option<&V>`: pakai `.copied()` / `.cloned()` / assert `Some(&nilai)` |
| `AccountId::new_unvalidated` | Deprecated — pakai `"....".parse::<AccountId>().unwrap()` |
| YAML CI: `name: Foo: bar` | Titik-dua+spasi di skalar tak-kuot = parse error. Kutip nilainya |
| Mengarang angka/nama | Dilarang. Tidak ada di spec/kamus → pilih solusi sederhana + **catat sebagai ambiguitas** di laporan/PR |
| Merusak test lama | Dilarang. Test yang ada hanya boleh bertambah (penyesuaian kecil field boleh) |

**Referensi pola yang benar**: `contracts/snacc/src/state.rs` + `lib.rs` (hasil VC-001..005,
34 test hijau) — ikuti struktur, gaya komentar, dan pola test-nya.

---

## 6. Backlog: cara memilih & dependensi

- **Backlog Master** = master tunggal (~300 item, keluarga `VC/DK/EN/SEC/QA/UI/TEE/SDK/INT/OPS/DEMO/DOC/ECON/RES`, label `@pemilik·Lx`). **Papan Status** di puncaknya = posisi proyek saat ini — baca dulu, jangan kerjakan item yang ✅ atau 🔄.
- **Urutan kerja yang disarankan** (ikuti §11–§12 Backlog Master): `VC-006..010` (F3 TEE, F5/F6 M&A & lisis, SVG, event) → `EN-1xx` (mekanik ekonomi) → `SEC-1xx` (keamanan) → `QA-1xx` (test) → `OPS/DEMO/DOC` (submission & juri).
- **Dependensi penting**: `EN` butuh state `D1–D8` (sudah ada) + F2 (sudah ada) · `DK-033/044` (dividen) butuh `advance_epoch` · test `QA` butuh method terkait selesai · `OPS` (deploy/gladi) butuh kontrak lengkap · `README/DEMO` butuh hash testnet.
- **Jangan tabrakan**: `VC-005` & `ECON-101..103` sedang dikerjakan sesi lain (cek `git status`) — hindari file yang sama.
- Item P2 = pasca-hackathon, jangan dulu.

---

## 7. Format laporan akhir per item (konsistensi tim)

```
## <ID> — <nama item>
- Perubahan: <file + fungsi/struktur>
- Bukti: cargo test <N> lulus 0 warning; cargo check wasm hijau; CI <link>
- Ambiguitas/keputusan: <kalau ada — wajib disebut>
- Status: selesai / partial (sisa apa)
```
