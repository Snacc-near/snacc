# KPI Gladi — Hasil Auto-Check (21 KPI, v3 pasca-audit 3-POV ganda)

Tanggal: 2026-11-08 04:49 UTC · kontrak: `snacc-v001.testnet`
Auto-check v3: tx wajib sukses + signer/receipt terikat kontrak + payload terikat entitas gladi +
angka Kamus diverifikasi (pajak 2,5% / premium 115% / bounty 10%) + hash unik anti-reuse.
$SNACC testnet tanpa nilai uang. Tanpa hash = tanpa klaim.

**Ringkasan: 16 PASS · 0 FAIL · 5 BELUM (dari 21)**

| KPI | Sumber | Status | Bukti auto-check |
| --- | --- | --- | --- |
| G-01 Lahir — `incubate_strain` + suplai `$SNACC` lahir | EN-08/F1, LC-01 | **PASS** | ft_total_supply=2499999999000000000000000 · tx GyqJPisauHaehAcjH8mZCNTrtYhS8MXUGH9T1WstbKoN |
| G-02 `$SNACC` NEP-141 hidup (symbol `$SNACC`, decimals 24, `ft_transfer` sukses) | N141-101..106 | **BELUM** | symbol=$SNACC decimals=24 · tx belum ada |
| G-03 Makan → ATP (`fed`, `atp_minted > 0`, strain terikat) | EN-06/EN-115, LC-02 | **PASS** | atp_minted=2 · tx D9m2w4JgAoNbjMXkPJHY1qFRFb7rhQJUBbkaJ2vsdgS1,DKiCD9b294gPbj79YpNJ4zhWiSjNsALXJ7G1SJ2J4zBP |
| G-04 Kerja 3-stage (`extracted`→`transmuted`→`synthesized`) + `atp_spent` | EN-02/03/04, LC-03 | **PASS** | tx CNhhdEbHd229TU3wDfhySTHuM7JvEvAN1vQcs3qRR5Lx, FyGgHZ4t3QSCZmAUEtdAgwAYQKZFAJPYMbMu9NEJWS3Z, 9kf9Dtuvxkx4mkpFcJcKCEun1aKTUaaF5pK91RubsPUQ, HMpKk7hwhtZj8b1okAuR7gyJt56B6CoJfCDBBaZfZsuv, DeGnbgCtxKx74Cftt6iZhBRf1TYvEthrarBkbgVvGTYM, F9uTS8DpZqTQM8HxR5nMSzXU7eo8CYXYVxnKDWZbbyUZ, Ag71EgGZ3LLK1thmU7y3seWUzM5HacnGUXvTeeFWfbZS, EutTEoCPGwjQDiiS3aBV2TkjVDetkEZe8Qtzp1YSNYfn, CQ9DndtfB9G1d1BBfrSRMv7MQMSQCMpga3u5H3wyaxUr, HXXrQLjasSBBoVhJsCHr8oz4HxQ3kSELyTJZq5tZ1zK6, WfXrVezY8ssUUU43JqtRgJtm9xDvwxFwEJFX1WRqkCP, J2b1wGKZYTK2ZzLnuGPtLKnduoAk93uG6oGXFUK2qHKJ, HZAAwS8CrFEFqbBivHfi1vLYbW7dhqyaSppws6szZqRG, Htx8cxDKrNAck4wJGi4Z6hgtFtdm5Xaub5BSP6s71Bgx, FHoCjjYTdnck3YoMh9CiVVaTF2iZ3LUfvHkqo7RpAcuN, FDnYLDqtgm2FsVJg1eMDkh5mCvvt8PzapS5Ev9J8VSgj, 9FpumptS8RgQhNmYGagnDYTyqVY6TNi4bNHkU1WexmJi, 29PkYsJDamD1trpqndQi5UE7CtYjjFmhEDiQssNd7csb, 5MjMdL9Exrr2hhuVzdqbfhdJwVTWuwF1zbZRwGTUAiYY, 3wCubACsn8KZYc8h9JSF85YM12VFMgtNWBhESM3z9uuE |
| G-05 TEE zero-trust (`genome_committed` → `genome_mutated`) + role unlock | EN-05, ADR-16, I-16 | **PASS** | tx GPu7dmTE4v8fDD4j2FX7gGMdXCsevdcFfycXMG9Z1w35, HwmdggtNXGxMLyz5jdJ1DTsMgBx3jBak26mkHNrEcxXD, BFpjSQTjYuHL55AqGCXeW7fwahAizXRu5ZwLSTdE3kEv, ExjLbB45JBBJKmGR1tND5dFxrWLwYh8Qikf37jRF1XCR, BqPy3ndKXtxeGSvhQyiiv2qDdMtzKGio5kN96Cq9PQye · role_mask=? |
| G-06 Fusi — `strains_spliced` + pajak 2,5% + `role_mask` menyatu | F5, LC-06, I-02 | **PASS** | strains_spliced · tx FDWRaf2ydJXa23XjeGJbSWqEYC3ogPiGYdS11qKSoggP,37aHp3bBTpo3U79jNuBAXkS2PPrpWZLvBffB3fqGtnyE,4n1r2rA4ceZTr7v8asFcZcEKg5DRoaGHSt998AtKoCPs · pajak merger_tax=1e+22 ✓ |
| G-07 Hostile 115% (95/5) — `hostile_takeover_spliced` + nonce anti-drain | ADR-03, I-09/I-14 | **BELUM** | hostile_takeover_spliced · tx belum ada · payment tak tersedia |
| G-08 Adopt — `strain_adopted`, book_value 100% ke pemilik lama | EN-123, LC-05 | **BELUM** | strain_adopted · tx belum ada · book_value=? |
| G-09 Divide — `strain_divided` + konservasi saldo | EN-122/124, LC-01 | **PASS** | strain_divided · tx J1XbTVEhUP7XNSmPDvqzCuDK5xCdXkSpDbPvnkzu61VT |
| G-10 Lisis Tier 3 — `strain_liquidated` (bounty 10% / recovery 90%) | F6, I-10, LC-07b | **BELUM** | strain_liquidated · tx belum ada · bounty tak tersedia |
| G-11 Dividen DK-033 — `dividend_claimed` + `aether_burned_for_dividend` | DK-033/044 | **PASS** | tx 8umhfAmX5g4pybRAbP6BQqXdcgoUBsGpoXv7fWM1LbpP,4zaVoRcLA3GQBzRLKxRpEfDYqgzRTfNehVbe3vH3jVNs |
| G-12 Termostat — suhu >0, `V_epoch` >0 (skala 5), `zone_changed` pernah terjadi | ADR-04/27, ECON-111 | **BELUM** | temp=0 mK (before=0) · V_epoch=2691600000060950 |
| G-13 NPC ADR-30 — `npc_spores_bought` + konservasi I-15 | ADR-30, I-15 | **PASS** | npc_spores_bought · unit_price=111 · tx G2UZG95WSDBPryDKGhbLdJHYEYKsA3MppRjJTSuaBS5D |
| G-14 Koloni & risiko — `get_colony(owner)` terikat manifest + `risk_heat` terukur | EN-121/125, PF-06 | **PASS** | koloni(snacc-v001.testnet)=3 · risk_heat=0 |
| G-15 NFT NEP-171 — byte SVG ≤1734 + `nft_transfer` sukses (transplantasi) | LC-16, VC-009, NFT track | **PASS** | svg 437 B · tx 3fM5iK4dLLWiyHBAM2wqdMVHQbgLxc4VVsxndBZunFFm |
| G-16 SVG indikator (needle, `$SNACC`, `$ATP`, `mK`, zona, organel) | VC-009, EN-113 | **PASS** | indikator 4/4 (SNACC,ATP,mK,🌡) + zona=true |
| G-17 Volatilitas = fitur — burn `I-01` terbukti (counter naik) + suplai konsisten | ADR-04, I-01, DK-010 | **PASS** | burned=1000000000000000 · ft_total_supply=2499999999000000000000000 konsisten=true · tx FakVfyiLRF2EmcTN9z5DFwxumDsRGymrbMaxkWU3trLn |
| G-18 Solvabilitas — `epoch_treasury_spent ≤ epoch_treasury_initial` (I-04) + kolam dividen | I-04, DK-033 | **PASS** | spent=0 / initial=5.397500012793114e+23 · dividen_pool=1331800000000000 · tx 6ytHSFbgb9CbYJS5ReyUtwcpELHoGJWtt37xj4SEvwpE |
| G-19 Dinamika — `feast_result` (GOLDILOCKS/OVERFED/UNDERFED) tercatat per epoch | EN-105/106, LC-09/12 | **PASS** | feast=UNDERFED · zone_changed=false · tx 5WRJ3etNUiGa9kQEoqeADHoA88BDcW27t8pJgbATJdAi,GiRD2hB4QXaSJxGGasUV3W8jPwxZkrCNdEv5qU3WzSux,8iU7HDC67mHmCX5WErsCUPntiN7eUoXZKQy8xfjemy53,8HMiQe1roPAu7skBS6jn7RWrMGHWWGxQ9t8kGw3TYuen,D1VzPiQtKyiL4Ph5Nwt7EkvmD3tuqMVFDtjBkpCZPnUC,HcAme8wYBdbQNWha8XdufamqaByuRQGWqaHRifVH6k5n |
| G-20 Konsistensi suplai `I-01` — `ft_total_supply == total_snacc_supply` + burn monoton | DK-010, V-04 (J3.1) | **PASS** | ft=2499999999000000000000000 · macro.supply=2.499999999e+24 · burned=1000000000000000 · before=0 |
| G-21 Vault sub-account — `materialize_subaccount` + `s-<id>.*` terbentuk | ADR-02/29, F1 (J3.2) | **PASS** | vault_subaccount=s-5.snacc-v001.testnet · tx iADcpsuWQUE4MWHfBnwhKvNjiawSRBEBg93sFeLgJqz |

> FAIL = bukti ada tapi melanggar aturan / tx gagal / ERROR. BELUM = bukti belum tercatat / belum ter-index.