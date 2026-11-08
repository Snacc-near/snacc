# Sensitivitas Ambang Fever `CrucibleTemp > 1400 mK` (lanjutan temuan ECON-101..103)

Dibuat otomatis oleh `scripts/econ-fever-sensitivity.mjs` (seed 2071114, 10000 epoch, model utama: baseline-velocity). Tidak ada formula/parameter kontrak yang diubah — ini analisis untuk keputusan pemilik.

## 1. Ambang pasti (rumus, tanpa simulasi)

Dari ADR-04 + ADR-27 (formula kontrak, tidak diubah):

```
CrucibleTemp = floor(1000 × V_decayed / max(M_supply, 1)) > 1400 mK
⇔ V_decayed > 1,4 × M_supply          (threshold ">" ketat; 1400 mK tepat TIDAK Fever)
⇔ V_epoch  > 1,4 × M_supply + Δt_detik × VOLUME_DECAY_PER_SEC
```

Dengan supply awal M = 1.000.000 dan Δt = 3600 s (1 epoch):

- **V_decayed minimum untuk Fever: 1.401.000 $SNACC = 1,4× M_supply.**
- **V_epoch (bruto sebelum decay) minimum: 1.581.000 $SNACC per epoch** (= 1,4× M + 180.000 konsumsi decay).
- Artinya: **volume epoch harus lebih besar dari 140% total supply** agar burn I-01 aktif. Sebagai pembanding, batas atas Hypothermia: V_decayed ≤ 599.999 (0,6× M).
- Decay memakan 18.0% dari supply per epoch (180.000 $SNACC/epoch).

## 2. Sweep kalibrasi — % epoch per zona suhu

Interpretasi `volumeScale` (ASUMSI, eksplisit): V_epoch menghitung **volume bruto protokol** — satu aksi transmutasi melibatkan pembayaran $SNACC + transfer NEP-245 dua arah + kuitansi/verifikasi; bila semua kaki dihitung, volume terukur bernilai kelipatan nominal siklus. Skala TIDAK mengubah saldo/fee/perilaku — hanya pengukuran V_epoch.

| Model | Skala | Fever | Hypothermia | Normal | Temp rata² (mK) | Temp max (mK) | Total burn | Treasury min | Populasi akhir |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| velocity | ×1 | 37.60% | 31.44% | 30.96% | 1190 | 4594 | 58.214 | 20.248 | 6 |
| velocity | ×3 | 68.09% | 10.80% | 21.11% | 2274 | 8253 | 153.647 | 40.964 | 10 |
| velocity | ×5 | 69.47% | 9.09% | 21.44% | 2572 | 10360 | 144.086 | 41.800 | 8 |
| velocity | ×10 | 76.22% | 6.78% | 17.00% | 2910 | 12735 | 126.852 | 41.737 | 7 |
| velocity | ×25 | 79.07% | 10.06% | 10.87% | 3333 | 13761 | 109.358 | 41.737 | 4 |
| velocity | ×50 | 76.46% | 17.60% | 5.94% | 4077 | 21621 | 83.965 | 41.737 | 3 |
| velocity | ×100 | 71.78% | 24.47% | 3.75% | 5441 | 40234 | 68.422 | 41.737 | 2 |
| velocity | ×200 | 74.10% | 23.64% | 2.26% | 9611 | 71205 | 66.757 | 41.737 | 2 |
| velocity | ×500 | 63.68% | 35.24% | 1.08% | 15580 | 178283 | 51.844 | 41.737 | 1 |
| fixed | ×1 | 0.00% | 100.00% | 0.00% | 0 | 5 | 0 | 40.964 | 103 |
| fixed | ×10 | 0.00% | 100.00% | 0.00% | 0 | 48 | 0 | 10.386 | 9 |
| fixed | ×50 | 0.00% | 100.00% | 0.00% | 42 | 388 | 0 | 6.495 | 4 |
| fixed | ×100 | 0.00% | 99.46% | 0.54% | 125 | 737 | 0 | 6.045 | 3 |

### Rentang yang membuat Fever tercapai secara periodik wajar (target 5–30% epoch)

**tidak ditemukan dalam skala yang diuji**

## 3. Ekstrapolasi: bisakah Fever tercapai hanya karena supply menyusut?

Tanpa mengubah volume: Fever tercapai bila M ≤ V_decayed_rata² / 1,4 ≈ **850.000 $SNACC**. Dengan laju burn baseline (5.8 $SNACC/epoch), dari M = 1.000.000 dibutuhkan ±**26 ribu epoch (±3 tahun jam-epoch)** — jauh di luar horizon 10.000 epoch. **Kesimpulan: penyusutan supply saja tidak akan pernah mengaktifkan Fever dalam horizon yang relevan.**

## 4. Rekomendasi — OPSI untuk pemilik (tanpa mengubah apa pun di kontrak)

| Opsi | Isi | Trade-off |
| --- | --- | --- |
| **A. Terima apa adanya** | Dokumentasikan jujur: termostat Snacc efektif satu-arah (Hypothermia rebate aktif; Fever/burn praktis tidak pernah terpicu untuk ekonomi siklus kecil). Fever jadi "ceiling teoretis". | Paling jujur & nol kerja. Tapi `ft_burn`/I-01 dan "reactive supply" lemah sebagai diferensiasi track `memecoins` — kompetitor/juri bisa menyorot jalur burn tak teruji di mainnet. |
| **B. Ubah definisi V_epoch (bukan formula)** | Hitung V_epoch sebagai **volume bruto multi-kaki** (pembayaran $SNACC + transfer NEP-245 + klaim TEE tiap dihitung) — ekuivalen volumeScale 3–10 pada sweep. | Tidak menyentuh formula ADR-04/threshold 1400. Tapi butuh keputusan apa yang "dihitung volume" — ada risiko inflasi metrik kosmetik (perlu definisi ketat per kaki). |
| **C. Ubah threshold/angka (1400/600 mK)** | Mis. Fever > 140 mK (V_decayed > 0,14× M) agar tercapai periodik oleh ekonomi nyata. | Mengubah angka kamus resmi (Model Data) = perubahan spec + semua dokumen turunan; paling invasif; perlu justifikasi desain baru. |
| **D. Skala produksi (game-side)** | Naikkan nominal siklus produksi nyata (bukan hanya pengukuran) — mis. modal inkubasi & katalis ×50 — sehingga V_epoch riil mendekati 1,4× M. | Mengubah seluruh keseimbangan ekonomi (modal, fee, likuidasi); sweep menunjukkan fixed ×100 masih 0% Fever (butuh > ×1000) — re-balancing penuh & sangat invasif. |

**Pola dari sweep (baca sebelum memilih):**

- Model **fixed** bahkan pada ×100 masih 0,00% Fever (max 737 mK) — **satu-satunya jalan realistis menuju Fever periodik adalah interpretasi volume-bruto multi-kaki (Opsi B)**, bukan skala siklus kecil.
- Model **velocity** sudah 37,6% Fever pada ×1 (baseline ECON-101..103) — tetapi sangat sensitif: ×3 melompat ke 68%, dan di semua skala velocity ≥ ×3 populasi runtuh (10 → 1 strain; konsentrasi ekstrem).
- **Tidak ada skala yang diuji menghasilkan 5–30% Fever tanpa efek samping populasi.** Konfigurasi terdekat dengan zona target: velocity ×50–×100 (Fever 72–76%) — masih jauh di atas target; sebaliknya, model fixed butuh skala > ×1000 yang tak teruji.
- **Implikasi jujur:** threshold 1400 mK = 140% supply per epoch berada di antara dua rezim — ekonomi siklus kecil (fixed) tak pernah menyentuhnya, ekonomi velocity tinggi justru melewatinya jauh. Desain threshold perlu dikalibrasi ulang terhadap definisi V_epoch yang dipilih (Opsi B), bukan sekadar discale. Keputusan tetap di pemilik; dokumen ini hanya opsi + angka.

## 5. Catatan kejujuran

- Angka sweep bergantung pada ASUMSI model aktivitas agen (gelombang sentimen, dst. — lihat ASUMSI ECON-101..103); pola **non-linear** (Fever naik tajam dekat ambang) lebih dapat dipercaya daripada nilai titik persis.
- Tidak ada perubahan kontrak/spesifikasi yang dilakukan; threshold 1400/600 mK dan VOLUME_DECAY_PER_SEC = 50 tetap persis dari vault.
