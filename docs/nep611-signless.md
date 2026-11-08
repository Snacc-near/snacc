# RES-111 — Signless: function-call key (sesi) — apa yang bisa, apa yang tidak

> Status: **DOKUMEN + SDK (2026-11-08)**. Dikoreksi dari draf awal: batas protokol NEAR
> (function-call access key tidak boleh membawa deposit) berarti **aksi berdeposit tetap
> lewat dompet**; signless hanya untuk aksi deposit-0. Relayer / gas-station untuk aksi
> berdeposit adalah **rencana pasca-hackathon, bukan fitur yang ada** (lihat §5).
> `$SNACC` testnet tanpa nilai uang.

## 1. Batas protokol (inti keputusan)

NEAR menolak transaksi yang ditandatangani **function-call access key** bila transaksi itu membawa
deposit (`DepositWithFunctionCall`). Akibatnya:

| Kelas aksi | Contoh method | Penandatangan |
| --- | --- | --- |
| **Berdeposit** (`DEPOSIT_METHODS`) | `incubate_strain`, `materialize_subaccount`, `extract_spores`, `transmute_spores_to_enzyme`, `synthesize_elixir`, `ft_transfer`, `ft_transfer_call`, `nft_transfer`, `nft_transfer_call`, `storage_deposit` | **Dompet** (popup persetujuan). Tidak bisa signless. |
| **Deposit-0** (`SIGNLESS_METHODS`) | `feed_strain`, `allocate_atp`, `splice_strains`, `hostile_takeover_splice`, `adopt`, `divide_strain`, `harvest_starving_strain`, `conjugate_traits`, `commit_genome_experiment`, `apply_tee_mutation_zero_trust`, `npc_buy_spores`, `synthesize_and_redeem_aether`, `claim_industrial_dividend`, `advance_epoch`, `ft_burn` | **Kunci sesi** (function-call key, tanpa popup) lewat `SessionKeyManager`. |

Sumber kebenaran daftar ini adalah `SIGNLESS_METHODS` / `DEPOSIT_METHODS` di
[`sdk:src/session-key.ts`](https://github.com/Snacc-near/sdk/blob/main/src/session-key.ts); dokumen ini disalin dari sana. SDK menegakkannya di dua tempat:
`createSession` menolak daftar method yang memuat method berdeposit, dan `call` menolak deposit ≠ 0 —
keduanya dengan kode galat `DEPOSIT_NOT_ALLOWED`.

## 2. Alur pemain (apa yang sungguh terjadi)

```
1. Pemain terhubung dengan dompet NEAR-nya (akun sendiri; sudah punya saldo NEAR untuk stake).
2. MENETAS = 1 popup dompet: incubate_strain(...) membawa deposit (stake) → NFT + vault
   sub-account `s-<id>.snacc-v001.testnet`. Aksi berdeposit → tidak bisa signless.
3. Membuka sesi: SessionKeyManager.createSession({ accountId, registrar }) membuat keypair
   ed25519 lokal dan mendaftarkannya lewat AddKey (function-call key terbatas: receiver
   snacc-v001.testnet, method = SIGNLESS_METHODS, allowance default 0,25 NEAR). AddKey
   ditandatangani dompet pemain, jadi ini satu persetujuan dompet tambahan, sekali per sesi
   (dompet yang mendukung beberapa transaksi dalam satu persetujuan bisa menggabungkannya
   dengan langkah 2 — belum diuji).
4. Setelah itu LOOP HARIAN signless: feed_strain, allocate_atp, splice_strains, divide_strain,
   claim_industrial_dividend, … dipanggil lewat SessionKeyManager.call(...) / asTransport(...)
   tanpa popup. Gas dipotong dari allowance kunci itu.
5. Sesi habis / dicabut (status `allowance_low`, `exhausted`, `revoked`) → pemain membuka sesi
   baru (langkah 3). Setiap aksi berdeposit berikutnya (mis. extract_spores, ft_transfer)
   tetap memunculkan popup dompet.
```

Yang **tidak** diklaim: "menetas tanpa saldo NEAR", "menetas tanpa dompet", atau "seluruh permainan
tanpa popup". Hatch dan rantai produksi (`extract_spores` → `transmute_spores_to_enzyme` →
`synthesize_elixir`) membawa deposit dan tetap butuh dompet.

## 3. Status per 2026-11-08 (jujur)

- SDK: `SessionKeyManager` (`createSession`, `call`, `asTransport`, `status`, `revoke`, `forget`),
  `fullAccessRegistrar` (untuk tes/backend), `KeyRegistrar` (antarmuka untuk dompet) — ada di
  `sdk:src/session-key.ts` dengan unit test (RPC dimock). Sesi pada akun testnet sungguhan
  melalui dompet belum diuji end-to-end di browser.
- Kontrak: `incubate_strain` `#[payable]` — memang berdeposit; tidak diubah.
- Spike `scripts/nep611-spike.mjs` (menambah function-call key terbatas ke akun testnet baru lalu
  memeriksa access key di chain) hanya menguji langkah AddKey. Berkas hasilnya tidak ter-commit
  di `evidence/`, jadi tidak ada klaim yang bersandar padanya. Daftar method di spike itu
  (`incubate_strain`, `feed_strain`) berasal dari draf awal; `incubate_strain` tidak bisa
  dipanggil lewat kunci itu karena berdeposit.
- Frontend: wiring `SessionKeyManager` ke UI belum ada (urutan kerja: FE terakhir).
- `@near-relay/sdk` / `near-relay`: ada di registry tetapi kosong/stale — tidak dipakai.
- Keypom: kontrak v2 live di testnet (`v2.keypom.testnet`, terverifikasi RPC) — opsi drop-based,
  spike `scripts/keypom-drop-spike.mjs` (RES-110; drop belum dipakai di demo).

## 4. Fallback dan keterbatasan

- Tanpa kunci sesi, semua aksi tetap bisa lewat dompet (jalur yang terbukti di gladi:
  `evidence/gladi-manifest.json`). Signless = peningkatan kenyamanan untuk aksi deposit-0, bukan
  ketergantungan.
- Kunci sesi disimpan lokal di perangkat pemain (penyimpanan disuntik: memori atau
  `localStorage`-like). Siapa pun yang memegang kunci itu bisa memanggil method deposit-0
  selama allowance ada; karena itu allowance dibatasi dan sesi bisa dicabut (`revoke` →
  DeleteKey).

## 5. Rencana pasca-hackathon (BUKAN klaim, tidak ada kode)

Bila ingin menetas tanpa popup dan tanpa pemain menanggung deposit/gas, perlu salah satu dari:

1. **Relayer / meta-transaction** — pemain menandatangani *intent* off-chain, relayer membungkus
   tx dengan akun relayer sebagai penandatangan dan membayar gas + deposit. Butuh endpoint
   (mis. `POST /api/onboard`), pembatasan laju, dan anti-sybil.
2. **Gas-station / prepaid on-chain** — kontrak menerima aksi dari akun terdaftar dengan
   deposit yang sudah disetor sebelumnya (`prepaid_for`). Ini perubahan kontrak dan perlu
   keputusan terpisah (invarian V-04: stake tetap sumber suplai).
3. **Drop berbasis Keypom** — spike `scripts/keypom-drop-spike.mjs` (belum ada alur pemain).

Tidak satu pun dari ketiganya ada saat ini. Hingga dibangun dan dibuktikan dengan hash testnet,
alur di §2 adalah satu-satunya yang diklaim.
