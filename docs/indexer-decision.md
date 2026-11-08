# RES-117 — Keputusan Mesin Indexer M5 (tercatat 2026-11-08)

> Status: **rekomendasi tercatat** (keputusan final = pemilik). Kriteria utama hackathon:
> time-to-demo, tanpa API key, dan bukti dapat diverifikasi dari data on-chain yang sama.

## 1. Kandidat & hasil riset nyata (dicek 2026-11-08)

| Kandidat | Yang dicek | Hasil |
| --- | --- | --- |
| **A. NEAR Indexer Framework** (near/ near-lake) | butuh infrastructur sendiri (self-host Lambda/Pod + DB Postgres); setup jam-hari | ⚠️ powerful tapi overkill untuk demo window |
| **B. Goldsky NEAR** | butuh akun Goldsky + API key + pipeline config | ⚠️ butuh signup; tidak "zero-config" — ditunda pasca-hackathon |
| **C. Envio HyperIndex** | butuh config codegen + deploy hosted service | ⚠️ sama: butuh akun & deploy pipeline |
| **D. API explorer publik (FastNEAR/NearBlocks/KitWallet/Pikespeak)** | diprobe langsung dengan `curl` tanpa key: FastNEAR v0/v1 = 404 untuk akun gladi; NearBlocks = 404; KitWallet = 404; Pikespeak = 401 (butuh key) | ❌ tidak ada yang memberi data `snacc-v001.testnet` tanpa key/registrasi |
| **E. Fallback: baca receipt langsung via RPC + `demo:replay` dari manifest ter-commit** | sudah JALAN: `gladi-kpi.mjs` + `demo-replay.mjs` + `gas-profile.mjs` membaca tx/receipt langsung via RPC publik (0 API key) | ✅ **terbukti bekerja di gladi (48+ tx)** |

## 2. Rekomendasi (tercatat)

- **Demo/juri (SEKARANG)**: tetap **opsi E** — parsing `EVENT_JSON` langsung dari
  `tx`/`EXPERIMENTAL_tx_status` RPC + manifest yang di-commit. Sudah terbukti: KPI auto-check,
  gas-profile, dan demo:replay semuanya berbasis jalur ini (zero-key, reproducible).
- **Backend M5 produksi (pasca-hackathon)**: **Indexer Framework (A)** untuk data historis
  penuh + agregat, karena backend kita hanya perlu read-only feed event (tanpa write ke
  chain) — model NEAR Indexer-Lake Framework (Lake prune) adalah default ekosistem NEAR.
  Goldsky/Envio dievaluasi ulang BILA kebutuhan realtime subgraph-style query muncul.
- **Jangan**: bergantung pada explorer API pihak ketiga (D) — seluruh probe tanpa key
  menghasilkan 404/401 untuk akun kita (fragile, rate-limit, dan menambah dependensi
  pihak ketiga yang tidak dikontrol).

## 3. Konsekuensi & langkah lanjut

1. Backend `/api/events` sementara dibangun di atas parser event (jalur E) — skema lihat
   `docs/api-schemas.md` §event (parser: `sdk:src/events.ts`).
2. Bila demo butuh query historis kompleks (mis. semua klaim per epoch), tambahkan
   cache on-chain (view agregat) ATAU jalankan indexer framework lokal dalam satu container
   (opsi A) — bukan keputusan hari ini.
3. Falsifier dokumen ini: bila salah satu API publik (D) mulai mengembalikan data akun kita
   tanpa key, rekomendasi boleh ditinjau ulang (kandidat fallback paling ringan).
