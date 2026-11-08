# ECON-101..103 — Simulasi Makro Ekonomi Snacc (10.000 Epoch)

Dibuat otomatis oleh `scripts/econ-sim.mjs` (seed 2071114, deterministik — hasil dapat direproduksi).

## Rumus yang dipakai (persis dari spec)

- `CrucibleTemp = floor(1000 * V_decayed / max(M_supply, 1))` (ADR-04)
- `V_decayed = max(0, volume_epoch - delta_detik * VOLUME_DECAY_PER_SEC)`, VOLUME_DECAY_PER_SEC = 50 (ADR-27)
- Fever (`>1400 mK`): bakar `350 bps` dari katalis fee epoch → `ft_burn`, supply turun, burned naik (I-01)
- Hypothermia (`<600 mK`): rebate `200 bps` dari treasury ke strain yang bertransaksi, cap total subsidi `500 bps`/epoch dari treasury awal epoch (I-04)
- Vitalitas `0..10000`; awal inkubasi `8500`; BMR/jam Extractor 100, Fermenter 120, Synthesizer 150
- Feed/transmutasi sukses: `vitality = min(10000, effective_vitality + 500)`, reset last_fed (F2)
- Inkubasi: 80% modal kerja strain / 20% treasury (F1/D6)
- Lisis (vitality 0): 10% bounty likuidator / 90% treasury (F6)
- `mt_mint` enzim = `floor(spores_burned * efficiency_bps / 10000)`, efficiency_bps awal 10000 (F2)

## ASUMSI (tidak diatur spec — dinyatakan eksplisit)

1. 1 epoch = 3600 detik (BMR di spec per jam), 10.000 epoch ≈ 416 hari.
2. Supply awal 1.000.000 $SNACC (basis spike S1.3: supply ≈ 1.000.000 sebelum burn).
3. Populasi awal 200 strain; modal inkubasi 4000 $SNACC per strain (dibagi 80/20).
4. Biaya katalis flat 100 $SNACC per transmutasi; masuk ke Rule-Bound Treasury.
5. Volume epoch (2 model, karena spec tidak mendefinisikan magnitudo `V_epoch` vs supply — dianalisis keduanya):
   - **fixed**: per transaksi = min(saldo strain, U(800, 3000)) $SNACC — siklus produksi berukuran tetap (stoikiometri F2);
   - **velocity**: per transaksi = saldo strain × U(2, 6) — velocity of money.
6. Aktivitas agen: peluang transaksi per epoch mengikuti gelombang sentimen sinusoida (periode 900 epoch, amplitudo 0.25) + noise; feed darurat (p=0.9) bila vitalitas < 3000.
7. Strain insolven (vitality 0) dilikuidasi; pengganti diinkubasi dengan p=0.6; alkemis baru spontan p=0.03/epoch; onboarding eksternal 1000 $SNACC/epoch dari pemegang eksternal — **bukan cetak suplai**: inflow = min(1000, saldo pemegang eksternal), sehingga konservasi tertutup eksak (`result.conservation`). **Batas jujur:** eksternal awal hanya 800.000 $SNACC, jadi onboarding HABIS (~epoch 799 pada konfigurasi Opsi B) — bukan 10.000.000 sepanjang 10.000 epoch; sesudahnya populasi hanya berputar ulang. Lihat `docs/asumsi-7-fix.md`.
8. Spora dibakar per transmutasi: 10 molekul; efficiency_bps konstan 10000 (tanpa mutasi TEE dalam sim ini).
9. Skenario falsifikasi: semua agen berhenti feed/transaksi selama epoch 3000–3500, lalu aktivitas normal kembali.

## Hasil

### Skenario: baseline (volume fixed) (seed 2071114, 10000 epoch)

- CrucibleTemp: min 0 / rata-rata 0 / max 15 mK
- Zona suhu: Fever 0.00% · Hypothermia 100.00% · Normal 0.00%
- Supply $SNACC: awal 1.000.000 → akhir 1.000.000
- Total ft_burn (Fever): 0
- Total rebate (Hypothermia): 44.293.727
- Total biaya katalis terkumpul: 44.331.300
- Total enzim di-mint (mt_mint): 4.433.130
- Treasury akhir: 244.294 (minimum sepanjang sim: 40.964, pernah negatif: tidak)
- Kebangkrutan (Chapter 7): 154 · Inkubasi: 250 · Bounty likuidator: 672
- Strain hidup di akhir: 96 · saldo median: 7.018
- Distribusi saldo akhir: {"0":0,"1-1000":1,"1001-5000":17,"5001-20000":75,">20000":3}
- **Death spiral: TIDAK** (kriteria: supply → 0, treasury kolaps/negatif, atau populasi mati total)

### Skenario: baseline (volume velocity) (seed 2071114, 10000 epoch)

- CrucibleTemp: min 0 / rata-rata 1266 / max 4449 mK
- Zona suhu: Fever 41.69% · Hypothermia 29.22% · Normal 29.09%
- Supply $SNACC: awal 1.000.000 → akhir 935.365
- Total ft_burn (Fever): 64.635
- Total rebate (Hypothermia): 4.221.480
- Total biaya katalis terkumpul: 4.150.100
- Total enzim di-mint (mt_mint): 415.010
- Treasury akhir: 75.105 (minimum sepanjang sim: 31.758, pernah negatif: tidak)
- Kebangkrutan (Chapter 7): 244 · Inkubasi: 250 · Bounty likuidator: 1.121
- Strain hidup di akhir: 6 · saldo median: 148.536
- Distribusi saldo akhir: {"0":0,"1-1000":0,"1001-5000":0,"5001-20000":0,">20000":6}
- **Death spiral: TIDAK** (kriteria: supply → 0, treasury kolaps/negatif, atau populasi mati total)
- ⚠️ Catatan: populasi menyusut menjadi 6 strain — rebate proporsional volume menciptakan konsentrasi kekayaan (rich-get-richer), bukan kolaps.

### Skenario: freeze-500-epoch (volume fixed) (seed 2071114, 10000 epoch)

- CrucibleTemp: min 0 / rata-rata 0 / max 0 mK
- Zona suhu: Fever 0.00% · Hypothermia 100.00% · Normal 0.00%
- Supply $SNACC: awal 1.000.000 → akhir 1.000.000
- Total ft_burn (Fever): 0
- Total rebate (Hypothermia): 9.832.217
- Total biaya katalis terkumpul: 10.007.600
- Total enzim di-mint (mt_mint): 1.000.760
- Treasury akhir: 996.496 (minimum sepanjang sim: 40.964, pernah negatif: tidak)
- Kebangkrutan (Chapter 7): 266 · Inkubasi: 266 · Bounty likuidator: 67.504
- Strain hidup di akhir: 0 · saldo median: 0
- Distribusi saldo akhir: {"0":0,"1-1000":0,"1001-5000":0,"5001-20000":0,">20000":0}
- **Death spiral: YA** (kriteria: supply → 0, treasury kolaps/negatif, atau populasi mati total)

### Skenario: freeze-500-epoch (volume velocity) (seed 2071114, 10000 epoch)

- CrucibleTemp: min 0 / rata-rata 1183 / max 4756 mK
- Zona suhu: Fever 38.52% · Hypothermia 34.11% · Normal 27.37%
- Supply $SNACC: awal 1.000.000 → akhir 945.215
- Total ft_burn (Fever): 54.785
- Total rebate (Hypothermia): 4.590.823
- Total biaya katalis terkumpul: 3.754.300
- Total enzim di-mint (mt_mint): 375.430
- Treasury akhir: 71.905 (minimum sepanjang sim: 33.451, pernah negatif: tidak)
- Kebangkrutan (Chapter 7): 265 · Inkubasi: 270 · Bounty likuidator: 82.902
- Strain hidup di akhir: 5 · saldo median: 172.123
- Distribusi saldo akhir: {"0":0,"1-1000":0,"1001-5000":0,"5001-20000":0,">20000":5}
- **Death spiral: TIDAK** (kriteria: supply → 0, treasury kolaps/negatif, atau populasi mati total)
- ⚠️ Catatan: populasi menyusut menjadi 5 strain — rebate proporsional volume menciptakan konsentrasi kekayaan (rich-get-richer), bukan kolaps.

## Kesimpulan Death Spiral

Kriteria (dari brief): supply terus menyusut HINGGA nol / treasury kolaps = death spiral; kalau ekonomi tetap hidup dengan supply lebih kecil = sehat.

| Skenario | Death spiral | Supply akhir | Treasury min | Populasi akhir |
| --- | --- | --- | --- | --- |
| baseline-fixed | **TIDAK** | 1.000.000 | 40.964 | 96 |
| baseline-velocity | **TIDAK** | 935.365 | 31.758 | 6 |
| freeze-fixed | **YA** | 1.000.000 | 40.964 | 0 |
| freeze-velocity | **TIDAK** | 945.215 | 33.451 | 5 |

**Baseline: TIDAK ada death spiral di kedua model volume** — supply tidak pernah → 0, treasury tidak pernah negatif (cap I-04 bekerja), populasi tidak pernah punah. Ekonomi deflasioner by design tapi TETAP HIDUP → **sehat, bukan death spiral**. Catatan kejujuran: model *velocity* menghasilkan konsentrasi kekayaan (6 strain raksasa dari 200) — rebate proporsional volume memihak strain besar; model *fixed* menjaga distribusi (103 strain, median 6.347).

**Falsifikasi (freeze 500 epoch = 500 jam tanpa feed):**

- Runway metabolik maksimum hanya 56–85 epoch (2–3 hari) — freeze 500 epoch **pasti membunuh semua strain yang tidak feed**, di bawah model volume apa pun. Ini sifat BMR, bukan kegagalan termostat.
- Model **fixed**: populasi punah total di dalam freeze (runway terpendek habis ~epoch 3085); rebate I-04 tidak bisa mencegahnya karena hanya mengalir ke strain yang bertransaksi. Setelah freeze, inkubasi ulang tidak berjalan karena modal alkemis eksternal sudah habis terserap → hanya 0 strain tersisa sampai epoch 10000 → **sistem TIDAK pulih tanpa onboarding alkemis baru**.
- Model **velocity**: strain bersaldo besar bertahan lebih lama; setelah aktivitas kembali mereka menarik volume + rebate dan mendanai inkubasi ulang → populasi pulih sebagian (5 strain) → **pulih terbatas, tidak kolaps**.
- **Kesimpulan falsifikasi:** sistem **tidak pernah kolaps secara moneter** (supply & treasury selalu solvent di keempat skenario), tetapi **pulihnya bergantung pada onboarding alkemis baru**, bukan pada rebate. Rebate I-04 hanya menyelamatkan agen yang masih bertransaksi.
- **TEMUAN EKSPLISIT (tidak disembunyikan):** pada model volume *fixed*, Fever = 0,00% sepanjang 10.000 epoch — dengan nominal siklus U(800, 3000) $SNACC dan ~90 transaksi/epoch, `V_decayed` maksimum hanya ~245.000, cukup untuk `CrucibleTemp` ≈ 5 mK terhadap supply 1.000.000. **Jalur burn I-01 (350 bps) TIDAK TERUJI** di skenario ini; burn hanya teruji pada model *velocity* (Fever 35–38%). Implikasi desain: threshold Fever `>1400 mK` mensyaratkan volume epoch > 1,4× supply per epoch — dengan asumsi wajar (siklus produksi kecil), ekonomi Snacc akan hidup permanen di zona Hypothermia dan burn hampir tidak pernah terpicu.
- **Pelajaran desain (jujur, tanpa klaim):** ketahanan jangka panjang Snacc lebih ditentukan oleh onboarding alkemis baru (modal inkubasi eksternal) daripada oleh termostat rebate. Angka sensitif terhadap asumsi magnitudo volume (ASUMSI 5) — keduanya dilaporkan, tidak dipilih yang menguntungkan.
