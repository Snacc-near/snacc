# Gladi KPI — Auto-Check Results (22 KPIs, v4: deployment with sandbox clock)

Date: 2026-11-09 00:36 UTC · contract: `snacc-v001.testnet`
Auto-check v3: tx must succeed + signer/receipt bound to the contract + payload bound to gladi entities +
Dictionary numbers verified (2.5% tax / 115% premium / 10% bounty) + unique anti-reuse hashes.
$SNACC testnet has no monetary value. No hash = no claim.

> **CLAIM LIMIT (must read):** PASS here = the ALREADY-IMPLEMENTED MECHANICS verified on-chain.
> KPI MEANING CHANGE (ATP model, EN-117): G-12 now verifies the ATP trace
> (atp_minted × 6×10^14) in the POST-FEED V_epoch SNAPSHOT (manifest.bukti_feed) —
> V_epoch is reset on every advance_epoch, so the FINAL V_epoch value is NOT evidence of the ATP trace.
> The zone may differ from the previous gladi (temperature is now driven by ATP + legs).
> SANDBOX CLOCK: G-07/G-08/G-10 and epoch closing (G-19/G-11) run with `advance_sandbox_clock`
> (owner-only, .testnet accounts only, max 720 hours/call): BMR aging and the 24-hour epoch gate are accelerated,
> NOT waiting for real time. The mechanics are the same; the speed of time does not represent production (mainnet has no such clock).
> G-22 = NEP-177/145/181 trio (nft_metadata · storage_deposit registration_only · nft_* enumeration).
> G-22 scope: on-chain evidence on the deployed wasm (sha256 in the manifest). Until 2026-11-09 the NEP-177/181 view code was not yet in the public `contracts` repo; contracts PR #21 added it, so the public source now exposes the same 67-function ABI as the deployed `snacc-v001.testnet`. Parity is structural (ABI identical), not byte-identical wasm: deployed code_hash 3DCPVk658pGuRW1FrDZKwrXQr3UHfYG43MoQUfbCwJwt (406,495 B, built 2026-11-08); a build of the new main is 418,327 B.
> This is NOT a product completeness checklist. What is NOT tested here (and must be checked in the Backlog Master):
> full SDK (`SDK-101..106`), security audit (`SEC-110..118`), NEAR AI integration (`RES-101..103` — Inference SDK,
> privacy/classify, TDX quote verification), docs (`DOC-*`), ECON tails, full e2e, FE, video.
> The correct backlog completeness numbers live in the Backlog Master — not in this summary line.

**Summary: 22 PASS · 0 FAIL · 0 NOT YET (of 22)**

| KPI | Source | Status | Auto-check evidence |
| --- | --- | --- | --- |
| G-01 Birth — `incubate_strain` + born `$SNACC` supply | EN-08/F1, LC-01 | **PASS** | ft_total_supply=2214131454347447129078242 · tx 9nn1E2DCSB35Neqs6KAuydiS8jw4EqUpsvPL1ibNshig |
| G-02 `$SNACC` NEP-141 alive (symbol `$SNACC`, decimals 24, `ft_transfer` succeeds) | N141-101..106 | **PASS** | symbol=$SNACC decimals=24 · tx 4t5LdFJtHeU69XaAHYS42PvLT1RVWJbZcnpD37YPtUEE |
| G-03 Feed → ATP (`fed`, `atp_minted > 0`, strain bound) | EN-06/EN-115, LC-02 | **PASS** | atp_minted=880000 · tx DiyXo8hXwxP4HYXaJ6fbSoWHbMG41eKaCiQr4a6Y1uPY,44U2S2UasduPXXmmB4sGWMwMtSP6gtxjPQ88zKGHQ4UR |
| G-04 3-stage work (`extracted`→`transmuted`→`synthesized`) + `atp_spent` | EN-02/03/04, LC-03 | **PASS** | tx 57tT5RhpeUEtfGMG1cUsQSPpYRP2fxXFrgWutHBbwc1Q, D41NQxu9zegYC6Nk4foNiqBkwfECSp33rnmiQFkYaUVR, 5drdLCgcPCqhRsXWBX9gsQXjLm6CRarsfsVgXkJMrwb6, 2Bfrwskc8UU8vh776u9ATWCDCN1ngBgWF9nyPsDGWfrg, 6NP2AqrM5MW9sCkEZpKpNn8xoDCDKMbiz5cUCshMFWX4, 5etxDL5E1pxypFxCCT9cqai5TV3MkugjgEsfZwJo5WKz, 5mEG1NNZxasUTDjbNA17LZVRUyXTH1gVJFJrNTJUpL9V, 3AAVo8njFvHTx5aZabGHodZ8cW9ZYbBQdvkffLEQsQtJ, BeMdYbCowF3LqL7QX6CLx42TryoLcRVoLzzRXDCYte8c, 64KwzKwacEnbzudzAsUVsn65pgcT7NMFtKhM5xBDFqYv, EVUEp26UJuPirGPznM6tQ1zNFAY69G43fDPBcwonRzVw, BYm3mRm197cwKA6mX872WDBYSpjKMJrLyASes6WH3Bto, AWdh3Wuhkr7E5PRyi1rw7Bg7FFyYcydt2CAPx39Yzd57 |
| G-05 TEE zero-trust (`genome_committed` → `genome_mutated`) + role unlock | EN-05, ADR-16, I-16 | **PASS** | tx HQMjhnfRf2KYtainvPGpvAfABEunxUTqqf9nixZeSojr, FnJmzrT4Z5AqdWMnVhumBKxPEUg64Azg2EUzGGYNb2tT, 6s7UFfjd8XBPZ6b9FK4tzGhEo6kstAVeNMCpdwAT9FCN · role_mask=? |
| G-06 Fusion — `strains_spliced` + 2.5% tax + `role_mask` merges | F5, LC-06, I-02 | **PASS** | strains_spliced · tx 8SuhDZL4e6Haw8Yed4VPFWMwmUTHH5PuL69QXnAX7TiD,5NKTunmRwgX8Wyee7BtT4RQTMNMX3Fa2zum6EMfUkHmv,Bo5WwpjnicshMczvrYpajxFTN9Kk4x9mEpcHPJLBfBpn · tax merger_tax=4994610000000000000000 ✓ |
| G-07 Hostile 115% (95/5) — `hostile_takeover_spliced` + anti-drain nonce | ADR-03, I-09/I-14 | **PASS** | hostile_takeover_spliced · tx FArXv6FTka21NjbCqo8gKaXXC6Gqzway7c7ppDgcbgFY · premium115 payment=46000000000000000000000 ✓ |
| G-08 Adopt — `strain_adopted`, book_value 100% to the old owner | EN-123, LC-05 | **PASS** | strain_adopted · tx 7uWckTNXSQx86f1Zwau6ehJXLZqCsjwkLBJocjsQNmRp · book_value=40000000000000000000000 |
| G-09 Divide — `strain_divided` + balance conservation | EN-122/124, LC-01 | **PASS** | strain_divided · tx jXccXny8Jp1z7hT1Pzj5nDYEAC5M2Cjrdrs3oiXeewn |
| G-10 Tier 3 lysis — `strain_liquidated` (10% bounty / 90% recovery) | F6, I-10, LC-07b | **PASS** | strain_liquidated · tx Ce5aRBZ7ES45YUukTxL2kFTDdT2qpxrSsFAx4UzY5owW · bounty10 bounty=4000000000000000000000 ✓ |
| G-11 DK-033 dividend — `dividend_claimed` + `aether_burned_for_dividend` | DK-033/044 | **PASS** | tx 7LEVs6SPwHtZahMufPBvStFigKRTnGnWxC8NiXmxJKET,7J8X3ASJQFkUbUZFzWps5d5yjbybhgj5CY8Vat2TmSQY |
| G-12 ATP-driven thermostat — temp >0, `V_epoch` >0, ATP trace ≥ atp_minted×6×10^14 (post-feed), `zone_changed` has occurred | ADR-04/27, ECON-111, EN-117 | **PASS** | temp=1040 mK (before=0) · V_epoch=2.30327103716559e+24 · post-feed ATP trace: V_epoch=2303271037165589965570048 ≥ atp_min(169699764)×6×10^14=101819858400000000000000 → OK · tx 9CEyL2r8mPArzrwjtiQoeejNGSTcDhdR7oLLnijyPUP1,8dFdgEN8K8ZjEUs64YTBvXL1h3Kz3jcAkPFu6fR34Lqp |
| G-13 NPC ADR-30 — `npc_spores_bought` + I-15 conservation | ADR-30, I-15 | **PASS** | npc_spores_bought · unit_price=111 · tx CM9GnmSe8T5XyGA1F1xcpXmjQUt35RU3hVds3V2GkDm6 |
| G-14 Colony & risk — `get_colony(owner)` bound to the manifest + measured `risk_heat` | EN-121/125, PF-06 | **PASS** | colony(snacc-v001.testnet)=3 · risk_heat=10000 |
| G-15 NFT NEP-171 — SVG bytes ≤1734 + `nft_transfer` succeeds (transplant) | LC-16, VC-009, NFT track | **PASS** | svg 482 B · tx 88fJz3kdyzr1ZuHHxeNEVBEVNLNRBiFTRunVHnaQdsR5 |
| G-16 SVG indicators (needle, `$SNACC`, `$ATP`, `mK`, zone, organelles) | VC-009, EN-113 | **PASS** | indicators 4/4 (SNACC,ATP,mK,🌡) + zone=true |
| G-17 Volatility = feature — `I-01` burn proven (counter rises) + supply consistent | ADR-04, I-01, DK-010 | **PASS** | burned=3.586854565255287e+22 · ft_total_supply=2214131454347447129078242 consistent=true · tx HPe6gyyeN2vZKVNWVi9XuSgtuTxaDUHvP5wJrEq88UMV |
| G-18 Solvency — `epoch_treasury_spent ≤ epoch_treasury_initial` (I-04) + dividend pool | I-04, DK-033 | **PASS** | spent=1.2632431329313775e+21 / initial=4.713842024181975e+23 · dividend_pool=0 · tx 9YhVkEXJS26jFS5MSpygTURxfDPsZ7i4gQ57ZmLi4b4d |
| G-19 Dynamics — `feast_result` (GOLDILOCKS/OVERFED/UNDERFED) recorded per epoch | EN-105/106, LC-09/12 | **PASS** | feast=UNDERFED · zone_changed=false · tx B9f8aEBEUW6TZZ8s8zPpB11MFum7L7yPrvXxYVDFADxE |
| G-20 Supply consistency `I-01` — `ft_total_supply == total_snacc_supply` + monotonic burn | DK-010, V-04 (J3.1) | **PASS** | ft=2214131454347447129078242 · macro.supply=2.214131454347447e+24 · burned=3.586854565255287e+22 · before=0 |
| G-21 Vault sub-account — `materialize_subaccount` + `s-<id>.*` is created | ADR-02/29, F1 (J3.2) | **PASS** | vault_subaccount=s-5-276801280.snacc-v001.testnet account_exists=true · tx G2zaGz4E3gLqyofxZNqXENu4WrcYxUrqVeW8dCgpwJEN |
| G-22 NEP trio — `nft_metadata` (NEP-177) + `storage_deposit` registration_only (NEP-145) + enumeration `nft_tokens` (NEP-181) | NEP-177/145/181 | **PASS** | nft_metadata.spec=nft-1.0.0 · nft_tokens=5 · nft_supply_for_owner=8 · storage_balance_of=registered · tx DneWt2NGzNeru3KBjPXVEnd1Mx5Ae92QuDcUAtL88MT2 |

> FAIL = evidence exists but violates a rule / tx failed / ERROR. NOT YET = evidence not yet recorded / not yet indexed.