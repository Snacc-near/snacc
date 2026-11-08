# EN-117 — Resolusi DoD vs Implementasi Final (RESOLVED 2026-11-08)

> Status: **RESOLVED — keputusan pemilik 2026-11-08 (suhu literal ATP, pilihan "paling
> seru") telah diimplementasikan & dikalibrasi.** Riwayat resolusi usulan ada di bawah.

## 1. Literal DoD EN-117 (Backlog Master §13a)

> "`VOLUME_SCALE` | `1000` sementara → final saat `ECON-111`; `volume_epoch += atp_minted × VOLUME_SCALE`"

Interpretasi literal: **satu-satunya** penyumbang `volume_epoch` adalah `ATP_minted × VOLUME_SCALE`
dengan `VOLUME_SCALE` sementara `1000`.

## 2. Implementasi final (terpasang di kontrak, pipeline #4)

Per **laporan sweep econ-report-3 §1** (ringkasan publik: `docs/econ-sweep-opsib.md`; ECON-111 Opsi B — keputusan pemilik 2026-11-07/08):

- `VOLUME_SCALE = 5` (bukan 1000) — hasil sweep 20 skala × 10.000 epoch;
- `V_epoch` = **omset ekonomi bruto multi-kaki**:
  - K1 = `snacc_catalyst_fee` (fee transmutasi, ×1);
  - K2 = `mt_burn` unit × `VOLUME_SCALE(5)` × `P_BASE(100)`;
  - K3 = `mt_mint` unit × `VOLUME_SCALE(5)` × `P_BASE(100)`;
  - K4 = kas likuidasi (bounty + recovery);
  - **eksklusi anti-feedback**: rebate `I-04`, klaim dividen, `ft_transfer`, modal inkubasi;
- `ATP` **tidak** menambah `volume_epoch` — ATP adalah energi kerja internal (biaya
  extract/transmute/synthesize/splice/hostile/divide), bukan komponen suhu.

## 3. Mengapa literal DoD tidak bisa dipakai (alasan teknis, dari kalibrasi)

1. **Magnitudo**: `ATP_minted = fee/10^15 × …` — dengan fee gladi riil (10^13 yocto),
   `ATP_minted ≈ 0,01 → 0` setelah floor; `× 1000` tetap 0 → termostat **tidak pernah hidup**.
2. **Feedback loop**: ATP dicetak DARI fee — memasukkannya lagi ke suhu menciptakan
   lingkaran fee→ATP→suhu→burn yang bisa diperbesar sendiri (anti-pattern termostat).
3. **Validasi empiris**: sweep ECON-111 (20 skala × 10.000 epoch, seed tetap) membuktikan
   definisi kaki multi-leg menghasilkan band target (Fever 5–30%, populasi hidup, treasury
   solvent) — definisi literal tidak punya titik operasi yang sehat.

## 4. Resolusi final (disahkan — pemilik, 2026-11-08)

> **DoD EN-117 final**: "`V_epoch` = **atp_minted × ATP_VOLUME_SCALE + kaki ekonomi
> (K1 fee + K2/K3 molekul + K4 kas likuidasi)**" — komposisi hybrid: ATP literal sebagai
> bobot utama feed + kaki ekonomi sebagai bobot pendamping; `VOLUME_SCALE(1000)` lama
> ditarik, diganti **`ATP_VOLUME_SCALE = 6×10^14`** (kontrak) / `3000` (sim).

**Angka sweep** (econ-report-4, keluaran `scripts/econ-calib-atp.mjs`; 10 skala × 10.000 epoch): semua skala in-band
(fever 5,9→23,8%, tanpa death spiral); terpilih **S=3000 → fever 8,5% (tengah band),
populasi 73, supply −17,7%, treasury solvent**; freeze falsifikasi = sifat BMR (bukan
kegagalan termostat). Pemetaan sim→kontrak: share ATP 0,370 → `S_c = 6×10^14`
(share kontrak 0,375 — invarian terhadap ukuran feed).

**Kontrak terpasang**: `feed_strain` menghitung `atp_minted` SEBELUM termostat dan
menambahkan `atp_minted × ATP_VOLUME_SCALE` ke `volume_epoch` epoch yang sama
(`apply_thermostat_fee(strain_id, fee, extra_volume)`).

Riwayat resolusi usulan awal (Opsi multi-kaki murni) dipertahankan di bawah untuk jejak.

## 5. Jejak

- Kalibrasi: econ-report-3, keluaran `scripts/econ-calib-opsib.mjs` (ringkasan: `docs/econ-sweep-opsib.md`).
- Pemasangan: pipeline #4 (commit `EN-114..119` — `TermostatParams`, `add_volume_legs`).
- Test pengunci: `qa_macro_tests::tc_macro_*`, `qa_svg_tests::tc_svg_02/03`,
  `econ111_volume_multikaki_dan_eksklusi`.
