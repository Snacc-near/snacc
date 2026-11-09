# KPI Gladi — Hasil Auto-Check (22 KPI, v4: deployment dengan jam sandbox)

Tanggal: 2026-11-09 12:31 UTC · kontrak: `snacc-v001.testnet`
Auto-check v3: tx wajib sukses + signer/receipt terikat kontrak + payload terikat entitas gladi +
angka Kamus diverifikasi (pajak 2,5% / premium 115% / bounty 10%) + hash unik anti-reuse.
$SNACC testnet tanpa nilai uang. Tanpa hash = tanpa klaim.

> **BATAS KLAIM (wajib dibaca):** PASS di sini = MEKANIK YANG SUDAH DIIMPLEMENTASIKAN terverifikasi on-chain.
> PERUBAHAN MAKNA KPI (model ATP, EN-117): G-12 kini memverifikasi jejak ATP
> (atp_minted × 6×10^14) pada V_epoch SNAPSHOT PASCA-FEED (manifest.bukti_feed) —
> V_epoch ter-reset tiap advance_epoch, jadi nilai V_epoch AKHIR BUKAN bukti jejak ATP.
> Zona bisa saja berbeda dari gladi sebelumnya (suhu kini digerakkan ATP + legs).
> JAM SANDBOX: G-07/G-08/G-10 dan penutupan epoch (G-19/G-11) dijalankan dengan `advance_sandbox_clock`
> (owner-only, hanya akun .testnet, maks 720 jam/panggilan): penuaan BMR dan gerbang epoch 24 jam dipercepat,
> BUKAN menunggu waktu nyata. Mekaniknya sama; kecepatan waktunya tidak mewakili produksi (mainnet tanpa jam ini).
> G-22 = trio NEP-177/145/181 (nft_metadata · storage_deposit registration_only · enumerasi nft_*).
> Ini BUKAN checklist kelengkapan produk. Yang TIDAK diuji di sini (dan harus dicek di Backlog Master):
> SDK lengkap (`SDK-101..106`), audit keamanan (`SEC-110..118`), integrasi NEAR AI (`RES-101..103` — Inference SDK,
> privacy/classify, verifikasi quote TDX), docs (`DOC-*`), ECON tails, e2e penuh, FE, video.
> Angka ketuntasan backlog yang benar ada di Backlog Master — bukan di baris ringkasan ini.

**Ringkasan: 22 PASS · 0 FAIL · 0 BELUM (dari 22)**

| KPI | Sumber | Status | Bukti auto-check |
| --- | --- | --- | --- |
| G-01 Lahir — `incubate_strain` + suplai `$SNACC` lahir | EN-08/F1, LC-01 | **PASS** | ft_total_supply=2214172107344538958560658 · tx 5JCAmSL7pLTV8mShrNuEtG5WLPkCqKkYCZBf5WGtQ2wY |
| G-02 `$SNACC` NEP-141 hidup (symbol `$SNACC`, decimals 24, `ft_transfer` sukses) | N141-101..106 | **PASS** | symbol=$SNACC decimals=24 · tx FQ6R9fmKWntSwQPjKchbd3EY8tnoZ3pvcNvSwZAtvXa8 |
| G-03 Makan → ATP (`fed`, `atp_minted > 0`, strain terikat) | EN-06/EN-115, LC-02 | **PASS** | atp_minted=880000 · tx 4hnA4pEUqghdtN8WycJJXCnSYQSEZ9F5DQamAuEub3GF,wiSd74Fqdoec7SSnPvXkkdfErJ7AwLpMLjyhe2oCdcr |
| G-04 Kerja 3-stage (`extracted`→`transmuted`→`synthesized`) + `atp_spent` | EN-02/03/04, LC-03 | **PASS** | tx 8dh9iuu1HaiFRFMSKiimnHj14saC3nqNRHz4yCiurYSf, E795BgG8pMz1ZGeU9Fuqbim4r6VoNXTkL5Q8Cakfbu6H, Eq3z68DvSBup2VNR84hocn8Roznv5xAy18GfMVfxWGv6, DzgG94RxfXjNBji58uhviE94Fwg6hKuYVzAHGycJ3qcm, 38Q7FX9pYrgXgqdAkqXj388hbUPZ97nmN6hmwAqTT1v6, 8M9jCPaTFaga9EPkMrpAAVZ7kuuMWGMskbNL4Cwx9HR8, 9bTCpP7FJfgTLmHw4vXJHPjpEiQEAdcosnS9iRoLuvY5, 8Zi3VxSmGrmWEZPM346XPQGt4DS1fAw1HnB3MicKtxCA, 4XApbSADhbNroP7d7u9sTNtnUTBuqoTKhrPEpvfcz1NQ, AUUYk6dn9LH3fe8WBNKVufmaJjUnoTKfTw1apxjC1FhW, FZa2XoEBSp25zG4GNXefaPXSBWnu7NP4ehp2B2MeJcu8, 3Efj27mtcRsipiqFr4yys7SxeWcJNFGp4FzUEmjkYTPM, q5nP4ygLrGdku9VomX2C5ebjPeaGfhVzXwR7cq5ShGt |
| G-05 TEE zero-trust (`genome_committed` → `genome_mutated`) + role unlock | EN-05, ADR-16, I-16 | **PASS** | tx BovEAtK5gUZ6dthCX5Cn6qHnmZZ9bhtSTpGuYXRqYgfw, EnXBEETdyG4TcjmrzGgJxzczGcxMshXZuEBorG8yHwDC, B8xdaukdnf3Fh9ZkMNfXxXW7TrHVLZLeXQNdYyBtD2AG · role_mask=? |
| G-06 Fusi — `strains_spliced` + pajak 2,5% + `role_mask` menyatu | F5, LC-06, I-02 | **PASS** | strains_spliced · tx 4ABtdBdjYkynQXXMsYD8ZKUwMtNAWX1wgEpREsX3i4nH,BrRsL5ndkeUPoRBBf7w5prMvstCc8Rz4yEh2VTFyKNmZ,8M41CAwAE2HY9twCsgz5fHWrt5j8UPV2i9vZmH6nQ2Nb · pajak merger_tax=4994610000000000000000 ✓ |
| G-07 Hostile 115% (95/5) — `hostile_takeover_spliced` + nonce anti-drain | ADR-03, I-09/I-14 | **PASS** | hostile_takeover_spliced · tx 4o4qwoGZtR7HE5E3VnjQZpXwDicpa9QVBzXHS1YP2v4f · premium115 payment=46000000000000000000000 ✓ |
| G-08 Adopt — `strain_adopted`, book_value 100% ke pemilik lama | EN-123, LC-05 | **PASS** | strain_adopted · tx 7w3tBNjLYFXKiUdmXtH1LhponGr6yhu1Q22xCFdLzo34 · book_value=40000000000000000000000 |
| G-09 Divide — `strain_divided` + konservasi saldo | EN-122/124, LC-01 | **PASS** | strain_divided · tx GVwhXD6kYyb9qDe2nDZMB6RUgsK5FqqTN51kVuYgnYWf |
| G-10 Lisis Tier 3 — `strain_liquidated` (bounty 10% / recovery 90%) | F6, I-10, LC-07b | **PASS** | strain_liquidated · tx AhEk4TNNeTj4orchvXSuPood8vAxTiQNWhZZwSdD9JH9 · bounty10 bounty=4000000000000000000000 ✓ |
| G-11 Dividen DK-033 — `dividend_claimed` + `aether_burned_for_dividend` | DK-033/044 | **PASS** | tx GfqatLA7TMR9mGBsA4Fo9Z76dHWTKABJhu4v6nVCmXzG,6hPrMTJubZTcRATiGQxYZNxcL4WGXA3KVpgHqtvoBWFq |
| G-12 Termostat ATP-driven — suhu >0, `V_epoch` >0, jejak ATP ≥ atp_minted×6×10^14 (pasca-feed), `zone_changed` pernah terjadi | ADR-04/27, ECON-111, EN-117 | **PASS** | temp=1037 mK (before=0) · V_epoch=2.296686581569915e+24 · jejak ATP pasca-feed: V_epoch=2296686581569915057078272 ≥ atp_min(166825016)×6×10^14=100095009600000000000000 → OK · tx CfBR8pFNCGAjCAX21pSMQY9rdjQ2cVKonkzacFjmZpM8,6ZXqq4uL9YkTyTU2djSzUk5pxodBVdNdvWBMJFgXCegZ |
| G-13 NPC ADR-30 — `npc_spores_bought` + konservasi I-15 | ADR-30, I-15 | **PASS** | npc_spores_bought · unit_price=111 · tx 2VCzPuL5imnFThJC479mzpF6mcQDcz8nhUvpmkvV1RFg |
| G-14 Koloni & risiko — `get_colony(owner)` terikat manifest + `risk_heat` terukur | EN-121/125, PF-06 | **PASS** | koloni(snacc-v001.testnet)=3 · risk_heat=10000 |
| G-15 NFT NEP-171 — byte SVG ≤1734 + `nft_transfer` sukses (transplantasi) | LC-16, VC-009, NFT track | **PASS** | svg 479 B · tx HfhZG6sAdqpKRSJsYRagD9mapCq7JrJvPthkUxFUZQQn |
| G-16 SVG indikator (needle, `$SNACC`, `$ATP`, `mK`, zona, organel) | VC-009, EN-113 | **PASS** | indikator 4/4 (SNACC,ATP,mK,🌡) + zona=true |
| G-17 Volatilitas = fitur — burn `I-01` terbukti (counter naik) + suplai konsisten | ADR-04, I-01, DK-010 | **PASS** | burned=3.582789265546104e+22 · ft_total_supply=2214172107344538958560658 konsisten=true · tx ERBRL4rTS6JHEKVsSumLYtru1hXsSYWdkGJH8d1krJaL |
| G-18 Solvabilitas — `epoch_treasury_spent ≤ epoch_treasury_initial` (I-04) + kolam dividen | I-04, DK-033 | **PASS** | spent=1.234128881122826e+21 / initial=4.713842024181975e+23 · dividen_pool=0 · tx BXSNviQVcvF7rDVp2sBTrD2nWkH8Nu4JXdMqXRezGo7s |
| G-19 Dinamika — `feast_result` (GOLDILOCKS/OVERFED/UNDERFED) tercatat per epoch | EN-105/106, LC-09/12 | **PASS** | feast=UNDERFED · zone_changed=false · tx 9F4KGd9bZXwtQEpvJGQYcx2Vz7fsa9LbyyTySxYhfLjW |
| G-20 Konsistensi suplai `I-01` — `ft_total_supply == total_snacc_supply` + burn monoton | DK-010, V-04 (J3.1) | **PASS** | ft=2214172107344538958560658 · macro.supply=2.214172107344539e+24 · burned=3.582789265546104e+22 · before=0 |
| G-21 Vault sub-account — `materialize_subaccount` + `s-<id>.*` terbentuk | ADR-02/29, F1 (J3.2) | **PASS** | vault_subaccount=s-5-276919939.snacc-v001.testnet akun_ada=true · tx HUqc4HUxwaBpqbNdcbiHa2WFEGfeu6HN2hjkyxcnEKK6 |
| G-22 Trio NEP — `nft_metadata` (NEP-177) + `storage_deposit` registration_only (NEP-145) + enumerasi `nft_tokens` (NEP-181) | NEP-177/145/181 | **PASS** | nft_metadata.spec=nft-1.0.0 · nft_tokens=5 · nft_supply_for_owner=8 · storage_balance_of=terdaftar · tx 9ToLDxMzyqRXM17NJNHd7CAHju8HxtoR2HZZVpUawH9g |

> FAIL = bukti ada tapi melanggar aturan / tx gagal / ERROR. BELUM = bukti belum tercatat / belum ter-index.