# ASUMSI #7 (onboarding eksternal) — investigasi "kebocoran suplai" simulasi

Status: investigasi selesai 2026-11-08. Ruang lingkup: `scripts/econ-sim.mjs` + docs. Kontrak tidak disentuh. `$SNACC` testnet tanpa nilai uang.

## Kesimpulan jujur

**ASUMSI #7 tidak mencetak suplai. Selisih −44,2 juta di `demo:e2e` adalah salah ukur di rumus skrip demo e2e, bukan kebocoran model.** `econ-report-1..4` tidak terpengaruh: setelah investigasi, semua metrik kunci identik (diff = 0) untuk konfigurasi fixed, velocity, Opsi B (VOLUME_SCALE=5), dan varian ATP.

Ada satu masalah lain yang nyata dan sekarang didokumentasikan: onboarding **habis** di sekitar epoch 799, tidak berjalan 10.000 epoch seperti kesan dari teks lama.

## 1. Akar baris kode

`scripts/econ-sim.mjs`, fase 3 (onboarding):

```js
const extPool = totalSupply - treasury - alchemistPool - Σ strain.balance;   // residual pemegang eksternal
const inflow  = Math.min(A.EXTERNAL_INFLOW, Math.max(0, extPool));            // dibatasi extPool
alchemistPool += inflow;
```

Inflow diambil dari residual pemegang eksternal dan dibatasi olehnya, jadi `totalSupply` tidak berubah. Rumus di skrip demo e2e (beat 2) yang menghasilkan −44,2 juta:

```js
totalDistribusi = treasuryFinal + totalRebate + Σ finalBalances + bountyPaid
selisih = supplyFinal + totalBurned - totalDistribusi
```

salah karena dua hal: (a) `totalRebate` adalah **arus kumulatif** treasury → strain yang berputar ulang tiap epoch Hypothermia (44.401.753 pada Opsi B); menjumlahkannya dengan saldo akhir menghitung ulang uang yang sama; (b) `bountyPaid` sudah ada di `alchemistPool`, dan `alchemistPool`/pemegang eksternal tidak dihitung sama sekali. Angka hasilnya tepat 45.243.163 = 258.608 + 44.401.753 + 581.934 + 868, sama dengan temuan awal.

## 2. Bukti: konservasi tertutup eksak (Opsi B, seed 2071114)

Buku besar independen ditambahkan ke `runSimulation` (`result.conservation`): saldo pemegang eksternal dilacak eksplisit, lalu dibandingkan dengan residual tiap epoch. Hasil pada semua 4 konfigurasi: `maxAbsDrift = 0`, `minResidual = 0` (tidak pernah negatif), `closes = true`.

| Komponen (Opsi B, akhir 10.000 epoch) | $SNACC |
| --- | ---: |
| Treasury | 258.608 |
| Dompet alkemis | 868 |
| Σ saldo strain (95 hidup) | 581.934 |
| Pemegang eksternal | 0 |
| **Jumlah = `supplyFinal`** | **841.410** |
| `totalBurned` | 158.590 |
| Suplai awal (= 841.410 + 158.590) | 1.000.000 |

Rumus yang benar: `supply = treasury + alkemis + Σ strain + eksternal` (selisih 0). Rumus lama: selisih −44.243.163.

## 3. Dampak: before / after

"Before" = kode sebelum instrumentasi; "after" = sesudahnya. Metrik identik karena instrumentasi hanya membaca state (diverifikasi dengan perbandingan JSON seluruh metrik).

| Konfigurasi | Fever% | Hypo% | Suplai akhir | Hidup | Median saldo | Berubah? |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| fixed | 0,00 | 100,00 | 1.000.000 | 96 | 7.018 | tidak |
| velocity | 41,69 | 29,22 | 935.365 | 6 | 148.536 | tidak |
| Opsi B (report-3, VOLUME_SCALE=5, Fever 610) | 5,86 | 92,96 | 841.410 | 95 | 4.950 | tidak |

### Varian pembanding: bagaimana jika #7 benar-benar mencetak suplai?

`exogenousInflow: true` (opsional, bukan default) menyuntik 1.000/epoch tanpa sumber dan mencatatnya sebagai `totalExogenous`:

| Opsi B | Default (finite, tanpa cetak) | Eksogen (mencetak) |
| --- | ---: | ---: |
| Suplai akhir | 841.410 | 11.000.000 (10.000.000 tercetak) |
| Fever% | 5,86 | **0,00** |
| Hidup | 95 | 323 |
| Median saldo | 4.950 | 2.846 |
| Dalam band Fever 5–30% | ya | **tidak** |

Artinya: seandainya #7 mencetak, `CrucibleTemp = 1000 × V/M` akan diencerkan 11× oleh suplai dan zona Fever hilang di seluruh sweep ATP (Fever ≤ 0,43%). Ini alasan memilih opsi default: **sumber dana jujur (pemegang eksternal yang finite)**, bukan injeksi eksogen. Opsi eksogen dipertahankan hanya sebagai pembanding.

## 4. Sweep ulang ringan — `econ-report-4` (ATP, Opsi B, `S` = ATP_VOLUME_SCALE)

Semua baris default sama dengan sebelum perbaikan; Fever tetap dalam 5–30% untuk seluruh S yang diuji:

| S | Fever% | Hypo% | Hidup | Median | Band 5–30% |
| ---: | ---: | ---: | ---: | ---: | :-: |
| 0 | 5,86 | 92,96 | 95 | 4.950 | ya |
| 1.000 | 5,24 | 93,49 | 87 | 6.209 | ya |
| 3.000 | 8,46 | 89,98 | 73 | 7.564 | ya |
| 5.000 | 10,99 | 87,57 | 63 | 8.652 | ya |
| 10.000 | 16,22 | 82,15 | 49 | 12.427 | ya |
| 15.000 | 23,77 | 74,87 | 40 | 14.624 | ya |

Catatan keterbatasan sweep ini: skala `S` yang dipakai `econ-calib-atp.mjs` (0–15.000) adalah skala sim; kontrak memakai ATP dengan satuan berbeda (lihat `docs/en-117-resolution.md`, `S_c = 6e14`). Menjalankan `S = 6e14` langsung di sim membuat populasi mati total (0 hidup) karena V jauh melampaui suplai; itu perbedaan satuan antara sim dan kontrak, bukan akibat perbaikan ini, dan belum direkonsiliasi di sini.

## 5. Yang berubah di kode

- `scripts/econ-sim.mjs`: buku besar konservasi independen + field `result.conservation`, `alchemistPoolFinal`, `strainsBalanceFinal`, `externalPoolFinal`, `totalInflow`, `externalExhaustedEpoch`; opsi `exogenousInflow` (pembanding); teks ASUMSI #7 diperjelas. Perilaku default tidak berubah.
- `docs/econ-sim.md`: ASUMSI #7 diperbarui (regenerasi dari template).

## 6. Batas jujur ASUMSI #7 (model, bukan bug)

1. Pemegang eksternal awal hanya 800.000 $SNACC, jadi onboarding habis di epoch ~799 (Opsi B). Sesudahnya tidak ada dana baru; "1.000/epoch" tidak berlangsung sepanjang 10.000 epoch.
2. Arus hanya satu arah: tidak ada pemegang yang menjual keluar. Model tidak menangkap tekanan jual.
3. Pemilihan alkemis/inkubasi dibatasi `alchemistPool ≥ INCUBATION_STAKE`, jadi ukuran populasi bergantung langsung pada asumsi ini.

## 7. Rekomendasi

- **Pertahankan kalibrasi** `VOLUME_SCALE = 5` (report-3) dan skala ATP (report-4). Tidak ada angka yang bergeser; tidak perlu rekalibrasi.
- **Perbaiki rumus beat 2 di skrip demo e2e**: identitas yang benar adalah `supplyFinal == treasuryFinal + alchemistPoolFinal + strainsBalanceFinal + externalPoolFinal` + asersi `sim.conservation.closes === true` (fail keras bila tidak); penjumlahan `totalRebate`/`bountyPaid` dan teks "kebocoran ASUMSI #7" dibuang. Skrip demo e2e dan buku besar konservasi (`result.conservation`) belum ada di repo `scripts` publik; bagian ini hanya mencatat diagnosis dan rumus yang benar.
- Bila ingin onboarding berkelanjutan sepanjang 10.000 epoch, naikkan `ALCHEMIST_POOL_INIT`/pemegang eksternal atau modelkan arus masuk sebagai injeksi eksogen **dan** laporkan terpisah sebagai "injeksi eksogen" — tetapi itu mengubah kalibrasi (lihat tabel varian, Fever runtuh) dan harus di-sweep ulang.
