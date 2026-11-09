# Demo Replay — Snacc (OPS-113)

Replayed from the committed gladi evidence: `evidence/gladi-manifest.json` (51 tx) + TEE vector `evidence/tee-vector-live.json`.
NO keys · NO network · 0.01 s. Contract: `snacc-v001.testnet`. $SNACC testnet has no monetary value.

## 🥚 Birth

Three cells are born with different roles (Extractor/Fermenter/Synthesizer) — the `$SNACC` supply is formed from the NEAR stake.

- `9nn1E2DCSB35Neqs6KAuydiS8jw4EqUpsvPL1ibNshig` — incubate Extractor (strain 1)

## 🍽️ Feed → ATP → Allocate

Feed burns `$SNACC` → books `$ATP` (internal energy, non-transferable); temperature is now ATP-driven (EN-117: the atp_minted×6×10^14 trace enters V_epoch). `allocate_atp` powers organelles (EN-119): mitochondria +10%/level ATP minting, nucleus +10%/level output, lysosome −10%/level BMR.

- `DiyXo8hXwxP4HYXaJ6fbSoWHbMG41eKaCiQr4a6Y1uPY` — feed strain 1 (2e23)
- `44U2S2UasduPXXmmB4sGWMwMtSP6gtxjPQ88zKGHQ4UR` — feed strain 2 (5e22)

## 🧬 TEE zero-trust

The genome is executed in NEAR AI Cloud TEE: the contract re-verifies `ed25519` + chat_id anti-replay.

- `HQMjhnfRf2KYtainvPGpvAfABEunxUTqqf9nixZeSojr` — register_attested_signer
- `FnJmzrT4Z5AqdWMnVhumBKxPEUg64Azg2EUzGGYNb2tT` — commit_genome_experiment (strain 5)
- `6s7UFfjd8XBPZ6b9FK4tzGhEo6kstAVeNMCpdwAT9FCN` — apply_tee_mutation_zero_trust (strain 5)

## ⚙️ NEP-245 production chain

Spore → enzyme (amalgam/redactase/synthase) → elixir (`homeostasis` & `aether`) — ATP cost per job.

- `57tT5RhpeUEtfGMG1cUsQSPpYRP2fxXFrgWutHBbwc1Q` — extract ignis
- `D41NQxu9zegYC6Nk4foNiqBkwfECSp33rnmiQFkYaUVR` — extract lumin
- `5drdLCgcPCqhRsXWBX9gsQXjLm6CRarsfsVgXkJMrwb6` — transmute recipe1 (ignis→amalgam, iteration 1)
- … +10 more tx in the manifest

## 🏪 NPC market-maker

Price `P_base × S_target/S_after` — cash conservation I-15.

- `CM9GnmSe8T5XyGA1F1xcpXmjQUt35RU3hVds3V2GkDm6` — npc_buy_spores (npc-extractor, 50)

## 🔥 Shrinking supply

`ft_burn` — a volatility feature: supply drops as the economy turns.

- `HPe6gyyeN2vZKVNWVi9XuSgtuTxaDUHvP5wJrEq88UMV` — ft_burn (10^15 $SNACC)

## 🧫 Fusion & reproduction

Splice (2.5% tax, role_mask merges) → divide (cytokinesis, balance conservation).

- `8SuhDZL4e6Haw8Yed4VPFWMwmUTHH5PuL69QXnAX7TiD` — splice (1 absorbs 2 — role E|F)
- `5NKTunmRwgX8Wyee7BtT4RQTMNMX3Fa2zum6EMfUkHmv` — splice (1 absorbs 3 — role E|F|S)
- `jXccXny8Jp1z7hT1Pzj5nDYEAC5M2Cjrdrs3oiXeewn` — divide_strain (child = strain 6)
- … +1 more tx in the manifest

## 💰 Industrial dividend

`mt:elixir-aether` burned → epoch contribution → pro-rata claim.

- `7LEVs6SPwHtZahMufPBvStFigKRTnGnWxC8NiXmxJKET` — synthesize_and_redeem_aether (epoch 0 dividend contribution)
- `7J8X3ASJQFkUbUZFzWps5d5yjbybhgj5CY8Vat2TmSQY` — claim_industrial_dividend (strain 5, epoch 0)

## ⚔️ M&A & lysis

A starving strain (Distressed, 1..2000 vitality) is taken over: hostile 115% (95% to the old owner, 5% treasury) or adopt at 100% book value; Insolvent (0) is lysed permissionlessly — 10% bounty, 90% to treasury + Nutrient Burst. Aging is accelerated by the sandbox clock (`advance_sandbox_clock`, owner-only, .testnet accounts).

- `FArXv6FTka21NjbCqo8gKaXXC6Gqzway7c7ppDgcbgFY` — gladi-retry hostile_takeover_splice 2026-11-08T16:51Z
- `7uWckTNXSQx86f1Zwau6ehJXLZqCsjwkLBJocjsQNmRp` — gladi-retry adopt 2026-11-08T16:51Z
- `Ce5aRBZ7ES45YUukTxL2kFTDdT2qpxrSsFAx4UzY5owW` — gladi-retry harvest_starving_strain 2026-11-08T16:52Z

## 💸 `$SNACC` transfer

NEP-141 `ft_transfer` of the balance from the M&A payout to another account.

- `4t5LdFJtHeU69XaAHYS42PvLT1RVWJbZcnpD37YPtUEE` — gladi-retry ft_transfer 2026-11-08T16:51Z

## 🏦 Vault sub-account

The NFT has its own account: `s-<id>-<tag>.<contract-account>`.

- `G2zaGz4E3gLqyofxZNqXENu4WrcYxUrqVeW8dCgpwJEN` — materialize_subaccount (strain 5, deposit 20 mN)

## 🫀 NFT transplant

NEP-171 `nft_transfer` — the NFT (living cell + gut + organelles) changes owner.

- `88fJz3kdyzr1ZuHHxeNEVBEVNLNRBiFTRunVHnaQdsR5` — nft_transfer (strain 4 → x207-demo-buyer)

## 📊 Consistency & solvency

`ft_total_supply == total_snacc_supply`; treasury never negative; `V_epoch` alive (ATP-driven temperature — the zone may differ from the previous gladi).

- `9YhVkEXJS26jFS5MSpygTURxfDPsZ7i4gQ57ZmLi4b4d` — feed strain 5 (Hypothermia temp=18 + Nutrient Burst active)
- `9CEyL2r8mPArzrwjtiQoeejNGSTcDhdR7oLLnijyPUP1` — extract_spores(5, ignis, fee 1912499999150000000000000 — Hypothermia→Fever, breaks dormancy EN-108)
- `8dFdgEN8K8ZjEUs64YTBvXL1h3Kz3jcAkPFu6fR34Lqp` — feed_strain(5) — full fee after leaving dormancy, ATP trace

## 📜 NEP compliance

NEP-177 `nft_metadata` (spec nft-1.0.0) · NEP-145 `storage_deposit(registration_only)` + bounds · NEP-181 enumeration `nft_tokens`/`nft_supply_for_owner` — the entry point for wallets & marketplaces. Verified on the deployed wasm. Until 2026-11-09 the view code was not yet in the public repo; contracts PR #21 added it, so the public source now exposes the same 67-function ABI (structural ABI parity, not byte-identical wasm: deployed code_hash 3DCPVk658pGuRW1FrDZKwrXQr3UHfYG43MoQUfbCwJwt 406,495 B, build of new main 418,327 B).

- `DneWt2NGzNeru3KBjPXVEnd1Mx5Ae92QuDcUAtL88MT2` — storage_deposit registration_only=true (NEP-145, 5 mN)

## TEE evidence (offline replay)

- chat_id: `14a1b709e99641f7afcaf0dfbe2dd0bd` · signed_text: `z-ai/glm-5.3-flash:0be35bb4fad42ae022d03747f9b6f63154ef7a7aecc1d4f9c1698588ca1cef17:73fb314237579e3513d72d25ee0b0fd798c2cbe47dcac3ffe31b854924a23c15`
- enclave pubkey: `5a0210f2442c79355784f9de021985429561da5bacc3a4424b01ac52b7e0caff` — the ed25519 re-verification lives in `verify-thesis.mjs` (F-03 PASSED).

### RES-103 - TDX attestation (DCAP)

  - Local quote fixture: `evidence/tee-vector-live.json`
  - **Offline DCAP verification: SKIPPED (dcap-qvl is not installed)**
    - Install: `cargo install dcap-qvl` (follow the NEAR AI Cloud TDX attestation docs), then run `npm run demo:replay` again.
  - Quote source: evidence/tee-vector-live.json
> Re-record: `node scripts/demo-replay.mjs` — deterministic output from the evidence files.
