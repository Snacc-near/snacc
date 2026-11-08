# ECON-111 — Sweep VOLUME_SCALE (Definisi Opsi B, seed 2071114)

Dihasilkan otomatis oleh `scripts/econ-calib-opsib.mjs` — 20 skala × 10000 epoch, model volume `legs` (Opsi B).

## Definisi Opsi B — V_epoch = omset ekonomi bruto multi-kaki

Diacu per epoch dari aksi produksi yang tercatat kontrak. Satuan dasar: `$SNACC` (testnet).
`VOLUME_SCALE` (unit) adalah pengali nilai $SNACC-ekuivalen **per unit molekul** pada kaki K2/K3 —
satuan ekonomi molekul, BUKAN pengali kas.

| Kaki | Sumber on-chain | Rumus | Satuan |
| --- | --- | --- | --- |
| K1 | `snacc_catalyst_fee` (F2/F4) | fee per tx, dijumlah | $SNACC (×1) |
| K2 | `mt_burn` 9 molekul (F2/F5/F6) | unit_dibakar × VOLUME_SCALE × P_BASE | $SNACC-ekuivalen |
| K3 | `mt_mint` 9 molekul (F2/F5) | unit_dicetak × VOLUME_SCALE × P_BASE | $SNACC-ekuivalen |
| K4 | mutasi kas $SNACC non-fee: kas likuidasi (F6) | bounty + recovery yang berpindah | $SNACC (×1) |

**Inklusi:** semua aksi produksi (extract/transmute/synthesize) untuk K1–K3; likuidasi untuk K4.
**Eksklusi (anti-feedback ke suhu):** rebate I-04, klaim dividen DK-033, transfer antar akun
(`ft_transfer`), dan modal inkubasi F1 — semua transfer internal/modal, bukan omset produksi.
Rumus suhu tidak berubah: `CrucibleTemp = floor(1000 × V_decayed / max(M,1))` (ADR-04),
`V_decayed = max(0, V_epoch − 3600 × 50)` (ADR-27); threshold 1400/600 TIDAK diubah.

Rincian kaki pada skala 6 (baseline): K1 fee: 40.883.600 · K2 mt_burn: 2.453.016.000 · K3 mt_mint: 2.453.016.000 · K4 likuidasi: 10.288.

## Tabel sweep (baseline 10.000 epoch, model legs)

| VOLUME_SCALE | Fever | Hypo | Normal | Temp p50 | Temp p85 | Populasi akhir | Median saldo | Supply akhir | Treasury min | Total burn | Total rebate | Treasury | Band? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.0% | 100.0% | 0.0% | 0 | 42 | 158 | 2.384 | 1.000.000 | 41.258 | 0 | 65.118.749 | solvent | — |
| 2 | 0.0% | 100.0% | 0.0% | 61 | 254 | 158 | 2.384 | 1.000.000 | 41.258 | 0 | 65.118.749 | solvent | — |
| 3 | 0.0% | 99.7% | 0.3% | 167 | 436 | 157 | 2.527 | 1.000.000 | 41.258 | 0 | 62.519.695 | solvent | — |
| 4 | 0.0% | 96.9% | 3.1% | 233 | 500 | 129 | 3.982 | 1.000.000 | 41.258 | 0 | 54.471.900 | solvent | — |
| 5 | 0.0% | 94.0% | 6.0% | 274 | 537 | 106 | 5.533 | 1.000.000 | 41.258 | 0 | 47.123.582 | solvent | — |
| 6 | 0.0% | 92.3% | 7.7% | 304 | 558 | 89 | 7.529 | 1.000.000 | 41.258 | 0 | 40.862.762 | solvent | — |
| 7 | 0.0% | 87.4% | 12.6% | 341 | 581 | 80 | 8.778 | 1.000.000 | 41.258 | 0 | 37.271.347 | solvent | — |
| 8 | 0.0% | 84.5% | 15.5% | 367 | 608 | 71 | 10.460 | 1.000.000 | 41.258 | 0 | 33.402.061 | solvent | — |
| 9 | 0.0% | 85.4% | 14.6% | 363 | 598 | 63 | 12.780 | 1.000.000 | 41.258 | 0 | 29.789.440 | solvent | — |
| 10 | 0.0% | 82.2% | 17.8% | 362 | 624 | 57 | 14.222 | 1.000.000 | 41.258 | 0 | 27.258.157 | solvent | — |
| 12 | 0.0% | 81.5% | 18.5% | 374 | 615 | 48 | 16.701 | 1.000.000 | 41.258 | 0 | 23.197.882 | solvent | — |
| 15 | 0.0% | 73.6% | 26.4% | 422 | 662 | 40 | 21.734 | 1.000.000 | 41.258 | 0 | 19.574.615 | solvent | — |
| 20 | 0.0% | 72.3% | 27.7% | 421 | 702 | 30 | 30.365 | 1.000.000 | 32.058 | 0 | 15.214.461 | solvent | — |
| 30 | 0.6% | 52.2% | 47.2% | 544 | 906 | 25 | 33.401 | 994.457 | 28.474 | 5.543 | 12.400.228 | solvent | — |
| 40 | 3.3% | 58.3% | 38.4% | 473 | 884 | 17 | 52.077 | 973.801 | 19.392 | 26.199 | 8.997.263 | solvent | — |
| 60 | 18.6% | 32.3% | 49.1% | 908 | 1.509 | 17 | 40.622 | 901.005 | 23.372 | 98.995 | 8.853.930 | solvent | — |
| 80 | 8.0% | 45.6% | 46.4% | 643 | 1.142 | 10 | 89.916 | 962.325 | 13.328 | 37.675 | 5.390.137 | solvent | — |
| 100 | 16.2% | 37.9% | 45.9% | 662 | 1.458 | 8 | 116.374 | 935.905 | 11.640 | 64.095 | 5.082.448 | solvent | — |
| 150 | 44.0% | 21.4% | 34.6% | 1.144 | 2.099 | 9 | 97.961 | 890.100 | 29.584 | 109.900 | 4.772.078 | solvent | — |
| 200 | 52.8% | 14.5% | 32.8% | 1.466 | 2.416 | 7 | 115.841 | 893.313 | 42.027 | 106.687 | 4.019.974 | solvent | — |

**Kriteria band** (dinyatakan eksplisit): Fever 5–30% · populasi akhir ≥ 100 (≥50% dari 200) dan
median saldo > 0 · treasury tidak pernah negatif dan minimum > 0 · bukan death spiral.
"Hypothermia saat sepi" diverifikasi terpisah lewat skenario freeze di bawah.

## Falsifikasi freeze (epoch 3000–3500 tanpa aktivitas) pada kandidat band

| VOLUME_SCALE | Fever | Hypo | Populasi akhir | Treasury min | Death spiral |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.0% | 100.0% | 0 | 41.258 | YA |
| 2 | 0.0% | 100.0% | 0 | 41.258 | YA |
| 3 | 0.0% | 100.0% | 0 | 41.258 | YA |

### Pencarian fallback (skala sehat × FEVER' > 600; HYPOTHERMIA tetap 600)

| Skala | FEVER' | Fever | Populasi | In-band (fever 5–30%, bukan spiral, normal > 0) |
| --- | --- | --- | --- | --- |
| 6 | 610 | 6.9% | 80 | ✅ |
| 6 | 620 | 4.4% | 82 | — |
| 6 | 650 | 3.4% | 85 | — |
| 5 | 610 | 5.9% | 95 | ✅ |
| 5 | 620 | 4.3% | 97 | — |
| 5 | 650 | 2.1% | 100 | — |
| 4 | 610 | 2.5% | 118 | — |
| 4 | 620 | 1.6% | 122 | — |
| 4 | 650 | 0.6% | 125 | — |
| 3 | 610 | 0.2% | 153 | — |
| 3 | 620 | 0.1% | 153 | — |
| 3 | 650 | 0.0% | 157 | — |
| 2 | 610 | 0.0% | 158 | — |
| 2 | 620 | 0.0% | 158 | — |
| 2 | 650 | 0.0% | 158 | — |
| 1 | 610 | 0.0% | 158 | — |
| 1 | 620 | 0.0% | 158 | — |
| 1 | 650 | 0.0% | 158 | — |

## Verifikasi usulan fallback threshold (bila band tak tercapai)

- `FEVER=610 mK, HYPOTHERMIA=600 mK (tetap), skala 5`: Fever 5.9% · Hypo 93.0% · Normal 1.2% · populasi 95 · median 4.950 · treasury min 41.258 · burn 158.590 · rebate 44.401.753 · death spiral TIDAK — **IN BAND**
- `FEVER=610 mK, HYPOTHERMIA=600 mK (tetap), skala 5, FREEZE`: Fever 0.7% · Hypo 99.1% · Normal 0.1% · populasi 0 · median 0 · treasury min 41.258 · burn 20.242 · rebate 12.165.018 · death spiral YA

## P_base NPC (usulan)

Dihasilkan dari ekonomi sweep — lihat econ-report-3 (keluaran `scripts/econ-calib-opsib.mjs`) untuk argumen lengkap.
Katalis fee per tx = 100 $SNACC; satu siklus memutar 10 molekul;
omset per tx pada skala 6 ≈ 12.100 $SNACC-ekuivalen.
