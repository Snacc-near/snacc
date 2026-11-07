# OPS-110..111 — Riset Ticker `$SNACC` & Nama Akun

> Riset ketersediaan, bukan klaim. Setiap temuan disertai bukti (URL / respons RPC) dan waktu cek: **2026-11-07 ±14:30 UTC**. Metode: JSON-RPC `query view_account` (testnet: `rpc.testnet.near.org`; mainnet: `free.rpc.fastnear.com`) + pencarian web.

## 1. Ticker `$SNACC` di meme.cooking & DEX

| Tempat | Status | Bukti |
| --- | --- | --- |
| meme.cooking (NEAR) | **Tidak ditemukan bukti token `$SNACC` live** — hasil pencarian web hanya docs umum launchpad (`docs.meme.cooking`), tanpa halaman token SNACC | Pencarian web 2026-11-07; verifikasi final tetap perlu cek langsung daftar token di meme.cooking sebelum launch ritual (`RES-109`) |
| SUI (Noodles DEX) | **TERPAKAI** — "SnaccCoin (SNACC)" `0x48b8…1703`, likuiditas sangat rendah | https://app.noodles.fi/coins/0x48b8d32d4acd875f09613aea6853e44e1ffe861d4067a66b822ebe5502691703::snacc::SNACC |
| Solana | **TERPAKAI** — "Snacc Coin (SNACC)" `D3fy…pump` (market cap ±$5.3K, 2 holder) | https://phantom.com/tokens/solana/D3fyxRFDPFRsxWrUac7youGPXbMUj9FUDLHE8SW9pump |
| BASE | **TERPAKAI** — "SnaccCoin (SNACC)" `0xbb96…b12a` (ERC-20, 7 holder) | https://thebittimes.com/token-SNACC-BASE-0xbb966a4053f4d0cfa3d8a9126192e42a84e4b12a.html |
| Situs meme lain | **TERPAKAI** — `snacc.fun` ("The Juiciest Meme Coin in the Bowl"), `snacc.wtf` ("$SNACC … emotional support cat") | https://snacc.fun/ · https://snacc.wtf/ |

**Kesimpulan ticker:** di dalam ekosistem NEAR/meme.cooking tidak ada bukti `$SNACC` terpakai; ticker tetap bisa dipakai untuk launch NEAR. **Risiko homonim lintas chain nyata** (minimal 4 proyek "SNACC" lain di SUI/Solana/BASE + 2 situs meme) — disarankan branding selalu menyebut rantai: **"$SNACC on NEAR"** di README/submission, dan cek manual daftar token meme.cooking tepat sebelum `RES-109`.

## 2. Nama akun NEAR (bukti RPC, `UNKNOWN_ACCOUNT` = tersedia)

| Akun | Chain | Status | Bukti |
| --- | --- | --- | --- |
| `snacc.near` | mainnet | **TERPAKAI** — akun ada (saldo ±67 NEAR, `code_hash` = akun kosong tanpa kontrak) | RPC `view_account`, block `223481504` |
| `snacc-v001.near` | mainnet | **TERSEDIA** (`UNKNOWN_ACCOUNT`) | RPC `view_account`, block `223481505` |
| `snacc-token.near` | mainnet | **TERSEDIA** (`UNKNOWN_ACCOUNT`) | RPC `view_account`, block `223481505` |
| `snacc.testnet` | testnet | **TERSEDIA** (`UNKNOWN_ACCOUNT`) | RPC `view_account`, block `276646224` |
| `snacc-v001.testnet` | testnet | **TERSEDIA** (`UNKNOWN_ACCOUNT`) | RPC `view_account`, block `276646231` |
| `snacc-v1.testnet` | testnet | **TERSEDIA** (`UNKNOWN_ACCOUNT`) | RPC `view_account`, block `276646236` |

## 3. Rekomendasi singkat

1. **Kontrak testnet**: klaim & deploy ke `snacc-v001.testnet` (tersedia; konsisten dengan format `s-<id>.snacc-v001.near` di Kamus Angka) — sesuai rencana `OPS-104..106`.
2. **Nama akun mainnet** (pasca-hackathon, butuh persetujuan pemilik): `snacc-v001.near` masih tersedia bila ingin konsisten dengan kontrak; `snacc.near` tidak bisa dipakai (terpakai pihak lain — cocok dengan catatan Kamus Angka).
3. **Ticker**: lanjut `$SNACC` untuk NEAR, dengan disambiguasi "$SNACC on NEAR" di semua materi publik karena homonim lintas chain sudah terbukti.
4. Cek manual terakhir daftar token meme.cooking tepat sebelum launch ritual (`RES-109`) — hasil pencarian web hari ini bukan substitusi cek langsung.
