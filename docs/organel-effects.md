# EN-119 — Efek Slot Organel: IMPLEMENTED (keputusan pemilik 2026-11-08)

> Riwayat: audit A-05 (vault) — "organel selain mitokondria 0 kemunculan mekanik";
> resolusi awal: "belum dispesifikasikan + usulan minimal" (versi lama dokumen ini).
> **Keputusan pemilik 2026-11-08: "harus pakai efek"** — angka final di bawah kini
> TERPASANG di kontrak dan terkunci test (`qa_organel_tests::tc_organel_01..05`).

## Status per slot (IMPLEMENTED — rumus persis)

| Slot | Efek (kode, keputusan pemilik) | Rumus | Test |
| --- | --- | --- | --- |
| Mitokondria | ATP minted +10%/level | `atp = fee/10^15 × eff × (10000+1000×mito)/10000` (§13a) | `tc_organel_01` + `tc_f2_06` |
| Nukleus | Output produksi **+10%/level** — mengalikan hasil `transmute_spores_to_enzyme` & `synthesize_elixir` | `minted = base × (10000 + 1000×nukleus)/10000` | `tc_organel_04` (8 spora: 8→12 @nuk5; eliksir 2→3 @nuk5) |
| Lisosom | BMR efektif **−10%/level** — umur lebih panjang | `BMR_eff = bmr_per_hour × (10000 − 1000×lisosom)/10000` (min 0; level cap 5 → BMR_eff ≥ 50%) | `tc_organel_05` (70 jam: lisosom 4 → eff 4300 vs 1500 tanpa) |

Biaya alokasi tetap: **1 ATP per kenaikan level**, level ≤ 5 (`ERR_ORGANEL_LEVEL_MAX`),
1×/epoch (`ERR_ALREADY_ALLOCATED`); warisan merge `max(dom, abs)` + reset alokasi (`EN-120`).

## Riwayat usulan (superseded — diganti keputusan pemilik di atas)

1. ~~Lisosom: nutrient burst +100 bps×level~~ → diganti BMR −10%/level (keputusan pemilik).
2. ~~Nukleus: pagar TEE +50 bps×level~~ → diganti output produksi +10%/level (pagar TEE
   `I-03` TIDAK diubah — keputusan aman).
3. Slot lain (Ribosom/Vakuola/Peroksisom/Golgi) = roadmap `D` (vault) — di luar MVP 3 slot.

## Yang sudah terkunci test (tanpa efek dikarang)

- Biaya alokasi = 1 ATP **per kenaikan level**; level ≤ 5 (`ERR_ORGANEL_LEVEL_MAX`); 1×/epoch
  (`ERR_ALREADY_ALLOCATED`); penurunan/reset level gratis.
- Warisan merge: `max(dom, abs)` per slot + reset alokasi (`EN-120`).

Keputusan angka = pemilik; implementasi mengikuti setelah angka mengunci (aturan: angka hanya
dari vault/kamus + keputusan tercatat).
