# ECON-104..106 — Persamaan Profit PF-01..09 dari Parameter Final Simulasi

Dibuat otomatis oleh `scripts/econ-profit.mjs` (seed 2071114, 10000 epoch, skenario sumber: **opsib-scale5-fever610 (PF source)** — ECON-111 FINAL: definisi Opsi B (omset multi-kaki), VOLUME_SCALE=5, FEVER threshold usulan 610 mK; perbandingan: baseline-fixed). Semua angka **dihasilkan kode**, bukan diketik.

## 1. Sumber definisi (disalin, bukan dikarang)

- Definisi PF-01..09 + persamaan `Profit_epoch`: vault `03 Riset/Snacc - Model Profit dan Framing NEAR AI.md` §2.
- `DIVIDEND_INFLOW_BPS = 5000`, pro-rata per epoch, `MAX_DIVIDEND_CLAIM_EPOCHS = 8`: vault `04 Arsitektur/Snacc - Spec Industrial Dividend Pool DK-033 dan DK-044.md`.
- Pagar TEE `±1500 bps` (I-03/ADR-07), contoh shift `430 bps`: vault `04 Arsitektur/Snacc - Model Data.md`.
- Harga NPC `≥ P_base × S_target / max(S_after, 1)` (I-15/ADR-30): vault `04 Arsitektur/Snacc - Spec Antarmuka Kontrak.md`.
- Bounty 10%/90% (F6), premi 115% (ADR-26/I-09), vitality +500 per feed (F2).

## 2. Tabel profit = kode (per-epoch rata-rata, $SNACC testnet)

| ID | Aliran | Nilai terukur | Rincian perhitungan |
| --- | --- | --- | --- |
| PF-01 | Dividen industri (ADR-28/DK-033/044) | 23.5 $SNACC/strain/epoch | pool 2230/epoch = 50% × fee 4461; pro-rata 95 strain aktif |
| PF-02 | Capital gain nilai buku NFT | +0.3 $SNACC/strain/epoch (komponen cash) | EV = Cash + ΣInv·P + PV(...); rata-rata saldo 6126 vs modal awal 3200 |
| PF-03 | Premi IP genom rahasia (TEE) | +19 enzim/epoch (agregat) — per-tx floor = 0 | shift +430 bps (contoh vault, pagar ±1500); rantai TEE→eff→ATP→eliksir→dividen; CATATAN: floor per-tx 10 spora menghilangkan gain kecil — gain nyata hanya terlihat agregat/klaim besar |
| PF-04 | Arbitrase Chapter 11/7 (zero-sum) | bounty 0.1 $SNACC/epoch (realisasi sim); takeover: biaya 5692 vs salvage 4950 = margin -742 $SNACC | Ch.11 = 115% Book Value (ADR-26); bounty Ch.7 = 10% (F6); TIDAK menguntungkan per event — premi 15% murni biaya akuisisi |
| PF-05 | Adopsi & pulihkan (EN-08c) | biaya 2320 $SNACC per sel (adopt 320 + pulih 2000 = 20 feed) | tidak tersimulasi; ATP: 1/fee (ASUMSI EN-06 f tidak didefinisikan di spec) |
| PF-06 | Arbitrase waktu biaya makan | 46.7 $SNACC/strain/epoch (rebate Hypothermia) | DK-030 rebate<fee: LULUS |
| PF-07 | Market-making molekul (ADR-30) | 1000 $SNACC/siklus (teoretis) | harga ≥ P_base × S_target/max(S_after,1) (I-15); ASUMSI P_base=100, kelangkaan 2× |
| PF-08 | Integrasi vertikal koloni (EN-08a) | 3000 $SNACC/siklus (biaya dihindari, bukan kas) | coverage 0b111 tanpa merger = spread 3 tahap tak dibayar |
| PF-09 | Bonus The Great Feast (EN-02) | 3879 $SNACC/epoch (cap 5% treasury = 12930) | top-3 kontributor; ASUMSI share top-3 30% volume; redistribusi Pantry |

### Sisi biaya (pengurang persamaan)

| Komponen | Nilai | Catatan |
| --- | --- | --- |
| Feed/Katalis | 47.0 | biaya katalis per strain per epoch (dari sim) |
| Upkeep (BMR) | 0 (non-moneter) | BMR meluruhkan vitalitas, bukan kas — kehilangan nilai muncul saat lisis |
| Burn (Fever I-01) | 15.9 $SNACC/epoch (sistem) | dipotong dari fee epoch, bukan dari saldo strain |
| Rebate (I-04) | +46.7 | sudah dihitung di PF-06 (jangan dihitung dua kali) |

### Persamaan Profit_epoch (per strain, hanya komponen yang tersimulasi)

```
Profit_epoch(i) ≈ PF-01 (23.5) + ΔBookValue (0.3)
                + PF-04 bounty share (0.00)
                + PF-06 rebate (46.7)
                − Feed/Katalis (47.0) − Upkeep (0, non-moneter)
              = 23.5 $SNACC/strain/epoch (testnet, tanpa nilai uang)
```

**Catatan kejujuran:** PF-03/05/07/08/09 tidak mengalir kas di simulasi (dilaporkan sebagai unit teoretis/biaya yang dihindari). Profit positif kecil di sini BUKAN janji untung — ia bergantung pada asumsi aktivitas (ASUMSI 6 di econ-sim) dan sifatnya redistribusi (PF-04/06/07/09) atau transfer dari pool fee (PF-01), sesuai invarian I-01/DK-010: tidak ada mint $SNACC setelah init.

## 3. Rantai TEE → efficiency_bps → ATP → eliksir → dividen (PF-01/PF-03, tercakup)

```
TEE shift +430 bps (contoh terdokumentasi; pagar ±1500 bps, I-03)
→ efficiency_bps: 10000 → 10430
→ ATP_minted per fee naik proporsional (EN-06; ASUMSI 1 ATP/fee — fungsi f(spec) tidak mendefinisikan bentuk eksak)
→ mt_mint enzim: 10 per 10 spora (floor per-tx: gain 430 bps tak terlihat pada 10 spora)
→ gain agregat: +19 enzim/epoch (4.3% dari 446 enzim/epoch)
→ output eliksir Stage-3 naik → mt:elixir-aether tersedia lebih banyak
→ synthesize_and_redeem_aether (DK-044) → klaim PF-01 naik ±4.3% pro-rata
```

## 4. Perbandingan baseline-velocity vs baseline-fixed

| Metrik | velocity | fixed |
| --- | --- | --- |
| Fee/epoch | 4461 | 4433 |
| Dividen pool/epoch (50%) | 2231 | 2217 |
| PF-01 per strain/epoch | 23.5 | 23.1 |
| Rebate per strain/epoch | 46.7 | 46.1 |
| Burn total 10k epoch | 158.590 | 0 |
| Populasi akhir | 95 | 96 |

Model *fixed* membagi fee ke 96 strain (PF-01 per strain jauh lebih kecil tetapi distribusi sehat); model *velocity* menghasilkan fee lebih besar per strain tetapi terkonsentrasi (95 strain tersisa).

## 5. Asumsi eksplisit (selain ASUMSI ECON-101..103 yang diwarisi)

1. `P_base = 100` dan kelangkaan 2× untuk PF-07 — TIDAK ada nilai numerik P_base di vault (formula I-15 ada, angkanya tidak) → ditandai perlu keputusan pemilik.
2. ATP = 1 per fee (EN-06: `atp_minted = f(amount, efficiency_bps, level_mitokondria, zona)` — bentuk f tidak didefinisikan di vault).
3. Share top-3 Great Feast = 30% volume (PF-09); cap 5% treasury diambil dari EN-02/I-04.
4. Biaya adopt PF-05 = bounty 10% atas modal kerja; pemulihan = 20 feed (dari vitality 1 ke 10000, +500/feed — spec F2).
5. Chapter 11 tidak tersimulasi sebagai aksi agen; dihitung teoretis dari saldo median.
6. Dividen pool di sim masuk treasury 100% (ASUMSI ECON-101..103); untuk PF-01 dipotong 50% sesuai DK-033 (angka yang sama, dibagi dua tujuan).

## 6. Yang belum selesai / butuh keputusan pemilik

- Nilai numerik `P_base` (PF-07) dan bentuk fungsi `f` ATP (EN-06) belum ada di vault → perlu keputusan sebelum implementasi kontrak.
- PF-05 (adopt), PF-09 (Great Feast), dan aksi Chapter 11 belum dimodelkan sebagai perilaku agen di simulasi makro; angkanya teoretis.
- Semua nilai adalah $SNACC testnet tanpa nilai uang — bukan klaim yield/ROI (aturan kejujuran vault §6).
