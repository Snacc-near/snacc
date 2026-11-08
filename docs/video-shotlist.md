# Video Demo Snacc — Shot-list 2:30 + 30s Judge Hook (`DEMO-101` persiapan)

Sumber: `snacc-vault/10 Demo/Snacc - Storyboard Demo.md` (storyboard 2:20, status locked) dan `docs/evidence-pack.md`. Data bukti diambil dari `docs/evidence-pack.md` (hash tx testnet) dan `scripts/demo-replay.mjs` (`npm run demo:replay`, membaca `evidence/`).

Aturan: tanpa kata "GameFi/investasi/yield"; `$SNACC` testnet tanpa nilai uang; angka/hash hanya dari bukti nyata (tanpa hash = tanpa klaim live). Narasi EN (video), catatan ID.

> Catatan sinkron: storyboard memakai kata "GameFi" di narasi shot 1 — **ganti** dengan "token games" / "on-chain economic game" saat rekaman. Angka di storyboard (mis. `+430 bps`, `+800 bps`, bounty `2,000`) harus dicocokkan ulang dengan output replay terbaru sebelum direkam.

## A. Judge Hook (0:00–0:30)

| # | Waktu | Durasi | Visual / sumber | Narasi singkat (EN) |
| - | --- | - | --- | --- |
| H1 | 0:00–0:10 | 10s | **API/UI:** kartu SVG NEP-177 hidup dari `nft_token` (strain #1, saldo `$SNACC`, inventori) | "This NFT is alive. It holds a balance and it eats." |
| H2 | 0:10–0:20 | 10s | **Terminal/UI:** `splice_strains` dua strain → satu Gen-2; strain kedua `SplicedBurned` | "Two NFTs merge in one transaction. Balances combine, one is burned." |
| H3 | 0:20–0:30 | 10s | **Terminal:** `npm run verify:thesis` baris `LOLOS F-01..F-03` + gauge `CrucibleTemp` | "Every claim is falsifiable. One command checks it." |

## B. Cut penuh 2:30 (150s)

| # | Waktu | Durasi | Visual / sumber | Narasi singkat (EN) | Bukti ditampilkan |
| - | --- | - | --- | --- | --- |
| 1 | 0:30–0:45 | 15s | **UI** kartu judul + kartu NEP-177 | "Snacc: an NFT that eats a memecoin. Feed it or it gets snacked." | `nft_token` SVG |
| 2 | 0:45–1:05 | 20s | **Explorer** testnet.nearblocks.io akun `snacc-v001.testnet` + tx incubate | "Each strain is born with its own sub-account and starter spores." | hash tx incubate (ambil dari `evidence/gladi-manifest.json`) |
| 3 | 1:05–1:25 | 20s | **Terminal/UI** `transmute_spores_to_enzyme` + `synthesize_elixir`; **API** `GET /api/crucible/macro` | "A three-stage NEP-245-style supply chain, and an algorithmic thermostat, CrucibleTemp, that burns when hot." | event `supply_chain_transmuted`; JSON `crucibleTemp`, `zone` |
| 4 | 1:25–1:55 | 30s | **Explorer** tx mutasi genom `BqPy3ndKXtxeGSvhQyiiv2qDdMtzKGio5kN96Cq9PQye` + **terminal** `evidence/tee-vector-live.json` | "Secret formulas run in NEAR AI Cloud TEE. The enclave signs; our contract verifies the ed25519 signature on-chain before applying the mutation." | log `genome_mutated`, `atp_spent`; model `z-ai/glm-5.3-flash` |
| 5 | 1:55–2:10 | 15s | **Terminal** `npm run demo:replay` beat fusi & reproduksi (`splice_strains`, `divide_strain`) | "Strains can merge or divide. All 48 transactions replay offline in under a second." | output replay beat "Fusi & reproduksi" |
| 6 | 2:10–2:20 | 10s | **Explorer** tx vault `iADcpsuWQUE4MWHfBnwhKvNjiawSRBEBg93sFeLgJqz` + transfer `3fM5iK4dLLWiyHBAM2wqdMVHQbgLxc4VVsxndBZunFFm` | "A strain's sub-account moves with the NFT via NEP-171 transfer." | sub-account `s-<id>`; owner pindah |
| 7 | 2:20–2:30 | 10s | **Terminal** `verify:thesis` penuh + URL repo | "Reproduce our thesis with one command. Testnet only, no monetary value." | `LOLOS F-01/F-02/F-03`; URL repo `Snacc-near` |

Total: hook 30s + cut 120s = 150s. Cut penuh bisa juga dipakai terpisah (0:00–2:30 dengan hook H1–H3 menggantikan shot 1 bila dipakai satu video).

## C. Catatan produksi

- Cutaway Cell Lysis (`harvest_starving_strain`) ada di storyboard asli (shot 6) tetapi dipotong di versi 2:30 ini demi tx nyata yang tersedia; tambahkan 15s bila ada hash testnet untuk likuidasi.
- Rekam terminal di font ≥18pt; tampilkan hash penuh di layar ≥2 detik agar bisa diverifikasi juri.
- Verifikasi sebelum rekam: `npm run demo:replay` dan `npm run verify:thesis` harus hijau di mesin bersih (belum dijalankan oleh sesi ini).
- Video belum direkam; dokumen ini hanya rencana.
