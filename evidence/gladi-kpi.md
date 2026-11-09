# KPI Gladi — Hasil Auto-Check (22 KPI, v4: deployment dengan jam sandbox)

Tanggal: 2026-11-08 16:57 UTC · kontrak: `snacc-v001.testnet`
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
> Cakupan G-22: bukti on-chain atas wasm ter-deploy (sha256 di manifest). Kode view NEP-177/181 belum ada di repo `contracts` publik, jadi bagian ini belum bisa dibangun ulang dari sumber publik.
> Ini BUKAN checklist kelengkapan produk. Yang TIDAK diuji di sini (dan harus dicek di Backlog Master):
> SDK lengkap (`SDK-101..106`), audit keamanan (`SEC-110..118`), integrasi NEAR AI (`RES-101..103` — Inference SDK,
> privacy/classify, verifikasi quote TDX), docs (`DOC-*`), ECON tails, e2e penuh, FE, video.
> Angka ketuntasan backlog yang benar ada di Backlog Master — bukan di baris ringkasan ini.

**Ringkasan: 22 PASS · 0 FAIL · 0 BELUM (dari 22)**

| KPI | Sumber | Status | Bukti auto-check |
| --- | --- | --- | --- |
| G-01 Lahir — `incubate_strain` + suplai `$SNACC` lahir | EN-08/F1, LC-01 | **PASS** | ft_total_supply=2214131454347447129078242 · tx 9nn1E2DCSB35Neqs6KAuydiS8jw4EqUpsvPL1ibNshig |
| G-02 `$SNACC` NEP-141 hidup (symbol `$SNACC`, decimals 24, `ft_transfer` sukses) | N141-101..106 | **PASS** | symbol=$SNACC decimals=24 · tx 4t5LdFJtHeU69XaAHYS42PvLT1RVWJbZcnpD37YPtUEE |
| G-03 Makan → ATP (`fed`, `atp_minted > 0`, strain terikat) | EN-06/EN-115, LC-02 | **PASS** | atp_minted=880000 · tx DiyXo8hXwxP4HYXaJ6fbSoWHbMG41eKaCiQr4a6Y1uPY,44U2S2UasduPXXmmB4sGWMwMtSP6gtxjPQ88zKGHQ4UR |
| G-04 Kerja 3-stage (`extracted`→`transmuted`→`synthesized`) + `atp_spent` | EN-02/03/04, LC-03 | **PASS** | tx 57tT5RhpeUEtfGMG1cUsQSPpYRP2fxXFrgWutHBbwc1Q, D41NQxu9zegYC6Nk4foNiqBkwfECSp33rnmiQFkYaUVR, 5drdLCgcPCqhRsXWBX9gsQXjLm6CRarsfsVgXkJMrwb6, 2Bfrwskc8UU8vh776u9ATWCDCN1ngBgWF9nyPsDGWfrg, 6NP2AqrM5MW9sCkEZpKpNn8xoDCDKMbiz5cUCshMFWX4, 5etxDL5E1pxypFxCCT9cqai5TV3MkugjgEsfZwJo5WKz, 5mEG1NNZxasUTDjbNA17LZVRUyXTH1gVJFJrNTJUpL9V, 3AAVo8njFvHTx5aZabGHodZ8cW9ZYbBQdvkffLEQsQtJ, BeMdYbCowF3LqL7QX6CLx42TryoLcRVoLzzRXDCYte8c, 64KwzKwacEnbzudzAsUVsn65pgcT7NMFtKhM5xBDFqYv, EVUEp26UJuPirGPznM6tQ1zNFAY69G43fDPBcwonRzVw, BYm3mRm197cwKA6mX872WDBYSpjKMJrLyASes6WH3Bto, AWdh3Wuhkr7E5PRyi1rw7Bg7FFyYcydt2CAPx39Yzd57 |
| G-05 TEE zero-trust (`genome_committed` → `genome_mutated`) + role unlock | EN-05, ADR-16, I-16 | **PASS** | tx HQMjhnfRf2KYtainvPGpvAfABEunxUTqqf9nixZeSojr, FnJmzrT4Z5AqdWMnVhumBKxPEUg64Azg2EUzGGYNb2tT, 6s7UFfjd8XBPZ6b9FK4tzGhEo6kstAVeNMCpdwAT9FCN · role_mask=? |
| G-06 Fusi — `strains_spliced` + pajak 2,5% + `role_mask` menyatu | F5, LC-06, I-02 | **PASS** | strains_spliced · tx 8SuhDZL4e6Haw8Yed4VPFWMwmUTHH5PuL69QXnAX7TiD,5NKTunmRwgX8Wyee7BtT4RQTMNMX3Fa2zum6EMfUkHmv,Bo5WwpjnicshMczvrYpajxFTN9Kk4x9mEpcHPJLBfBpn · pajak merger_tax=4994610000000000000000 ✓ |
| G-07 Hostile 115% (95/5) — `hostile_takeover_spliced` + nonce anti-drain | ADR-03, I-09/I-14 | **PASS** | hostile_takeover_spliced · tx FArXv6FTka21NjbCqo8gKaXXC6Gqzway7c7ppDgcbgFY · premium115 payment=46000000000000000000000 ✓ |
| G-08 Adopt — `strain_adopted`, book_value 100% ke pemilik lama | EN-123, LC-05 | **PASS** | strain_adopted · tx 7uWckTNXSQx86f1Zwau6ehJXLZqCsjwkLBJocjsQNmRp · book_value=40000000000000000000000 |
| G-09 Divide — `strain_divided` + konservasi saldo | EN-122/124, LC-01 | **PASS** | strain_divided · tx jXccXny8Jp1z7hT1Pzj5nDYEAC5M2Cjrdrs3oiXeewn |
| G-10 Lisis Tier 3 — `strain_liquidated` (bounty 10% / recovery 90%) | F6, I-10, LC-07b | **PASS** | strain_liquidated · tx Ce5aRBZ7ES45YUukTxL2kFTDdT2qpxrSsFAx4UzY5owW · bounty10 bounty=4000000000000000000000 ✓ |
| G-11 Dividen DK-033 — `dividend_claimed` + `aether_burned_for_dividend` | DK-033/044 | **PASS** | tx 7LEVs6SPwHtZahMufPBvStFigKRTnGnWxC8NiXmxJKET,7J8X3ASJQFkUbUZFzWps5d5yjbybhgj5CY8Vat2TmSQY |
| G-12 Termostat ATP-driven — suhu >0, `V_epoch` >0, jejak ATP ≥ atp_minted×6×10^14 (pasca-feed), `zone_changed` pernah terjadi | ADR-04/27, ECON-111, EN-117 | **PASS** | temp=1040 mK (before=0) · V_epoch=2.30327103716559e+24 · jejak ATP pasca-feed: V_epoch=2303271037165589965570048 ≥ atp_min(169699764)×6×10^14=101819858400000000000000 → OK · tx 9CEyL2r8mPArzrwjtiQoeejNGSTcDhdR7oLLnijyPUP1,8dFdgEN8K8ZjEUs64YTBvXL1h3Kz3jcAkPFu6fR34Lqp |
| G-13 NPC ADR-30 — `npc_spores_bought` + konservasi I-15 | ADR-30, I-15 | **PASS** | npc_spores_bought · unit_price=111 · tx CM9GnmSe8T5XyGA1F1xcpXmjQUt35RU3hVds3V2GkDm6 |
| G-14 Koloni & risiko — `get_colony(owner)` terikat manifest + `risk_heat` terukur | EN-121/125, PF-06 | **PASS** | koloni(snacc-v001.testnet)=3 · risk_heat=10000 |
| G-15 NFT NEP-171 — byte SVG ≤1734 + `nft_transfer` sukses (transplantasi) | LC-16, VC-009, NFT track | **PASS** | svg 480 B · tx 88fJz3kdyzr1ZuHHxeNEVBEVNLNRBiFTRunVHnaQdsR5 |
| G-16 SVG indikator (needle, `$SNACC`, `$ATP`, `mK`, zona, organel) | VC-009, EN-113 | **PASS** | indikator 4/4 (SNACC,ATP,mK,🌡) + zona=true |
| G-17 Volatilitas = fitur — burn `I-01` terbukti (counter naik) + suplai konsisten | ADR-04, I-01, DK-010 | **PASS** | burned=3.586854565255287e+22 · ft_total_supply=2214131454347447129078242 konsisten=true · tx HPe6gyyeN2vZKVNWVi9XuSgtuTxaDUHvP5wJrEq88UMV |
| G-18 Solvabilitas — `epoch_treasury_spent ≤ epoch_treasury_initial` (I-04) + kolam dividen | I-04, DK-033 | **PASS** | spent=1.2632431329313775e+21 / initial=4.713842024181975e+23 · dividen_pool=0 · tx 9YhVkEXJS26jFS5MSpygTURxfDPsZ7i4gQ57ZmLi4b4d |
| G-19 Dinamika — `feast_result` (GOLDILOCKS/OVERFED/UNDERFED) tercatat per epoch | EN-105/106, LC-09/12 | **PASS** | feast=UNDERFED · zone_changed=false · tx B9f8aEBEUW6TZZ8s8zPpB11MFum7L7yPrvXxYVDFADxE |
| G-20 Konsistensi suplai `I-01` — `ft_total_supply == total_snacc_supply` + burn monoton | DK-010, V-04 (J3.1) | **PASS** | ft=2214131454347447129078242 · macro.supply=2.214131454347447e+24 · burned=3.586854565255287e+22 · before=0 |
| G-21 Vault sub-account — `materialize_subaccount` + `s-<id>.*` terbentuk | ADR-02/29, F1 (J3.2) | **PASS** | vault_subaccount=s-5-276801280.snacc-v001.testnet akun_ada=true · tx G2zaGz4E3gLqyofxZNqXENu4WrcYxUrqVeW8dCgpwJEN |
| G-22 Trio NEP — `nft_metadata` (NEP-177) + `storage_deposit` registration_only (NEP-145) + enumerasi `nft_tokens` (NEP-181) | NEP-177/145/181 | **PASS** | nft_metadata.spec=nft-1.0.0 · nft_tokens=5 · nft_supply_for_owner=8 · storage_balance_of=terdaftar · tx DneWt2NGzNeru3KBjPXVEnd1Mx5Ae92QuDcUAtL88MT2 |

> FAIL = bukti ada tapi melanggar aturan / tx gagal / ERROR. BELUM = bukti belum tercatat / belum ter-index.