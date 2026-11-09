# Demo Replay — Snacc (OPS-113)

Replayed from the committed gladi evidence: `reports/gladi-manifest.json` (51 tx) + TEE vector `tee-vector-live.json`.
NO keys · NO network · 0.00 s. Contract: `snacc-v001.testnet`. $SNACC testnet has no monetary value.

## 🥚 Birth

Three cells are born with different roles (Extractor/Fermenter/Synthesizer) — the `$SNACC` supply is formed from the NEAR stake.

- `5JCAmSL7pLTV8mShrNuEtG5WLPkCqKkYCZBf5WGtQ2wY` — incubate Extractor (strain 1)

## 🍽️ Feed → ATP → Allocate

Feed burns `$SNACC` → books `$ATP` (internal energy, non-transferable); temperature is now ATP-driven (EN-117: the atp_minted×6×10^14 trace enters V_epoch). `allocate_atp` powers organelles (EN-119): mitochondria +10%/level ATP minting, nucleus +10%/level output, lysosome −10%/level BMR.

- `4hnA4pEUqghdtN8WycJJXCnSYQSEZ9F5DQamAuEub3GF` — feed strain 1 (2e23)
- `wiSd74Fqdoec7SSnPvXkkdfErJ7AwLpMLjyhe2oCdcr` — feed strain 2 (5e22)

## 🧬 TEE zero-trust

The genome is executed in NEAR AI Cloud TEE: the contract re-verifies `ed25519` + chat_id anti-replay.

- `BovEAtK5gUZ6dthCX5Cn6qHnmZZ9bhtSTpGuYXRqYgfw` — register_attested_signer
- `EnXBEETdyG4TcjmrzGgJxzczGcxMshXZuEBorG8yHwDC` — commit_genome_experiment (strain 5)
- `B8xdaukdnf3Fh9ZkMNfXxXW7TrHVLZLeXQNdYyBtD2AG` — apply_tee_mutation_zero_trust (strain 5)

## ⚙️ NEP-245 production chain

Spore → enzyme (amalgam/redactase/synthase) → elixir (`homeostasis` & `aether`) — ATP cost per job.

- `8dh9iuu1HaiFRFMSKiimnHj14saC3nqNRHz4yCiurYSf` — extract ignis
- `E795BgG8pMz1ZGeU9Fuqbim4r6VoNXTkL5Q8Cakfbu6H` — extract lumin
- `Eq3z68DvSBup2VNR84hocn8Roznv5xAy18GfMVfxWGv6` — transmute resep1 (ignis→amalgam, iterasi 1)
- … +10 more tx in the manifest

## 🏪 NPC market-maker

Price `P_base × S_target/S_after` — cash conservation I-15.

- `2VCzPuL5imnFThJC479mzpF6mcQDcz8nhUvpmkvV1RFg` — npc_buy_spores (npc-extractor, 50)

## 🔥 Shrinking supply

`ft_burn` — a volatility feature: supply drops as the economy turns.

- `ERBRL4rTS6JHEKVsSumLYtru1hXsSYWdkGJH8d1krJaL` — ft_burn (10^15 $SNACC)

## 🧫 Fusion & reproduction

Splice (2.5% tax, role_mask merges) → divide (cytokinesis, balance conservation).

- `4ABtdBdjYkynQXXMsYD8ZKUwMtNAWX1wgEpREsX3i4nH` — splice (1 absorbs 2 — role E|F)
- `BrRsL5ndkeUPoRBBf7w5prMvstCc8Rz4yEh2VTFyKNmZ` — splice (1 absorbs 3 — role E|F|S)
- `GVwhXD6kYyb9qDe2nDZMB6RUgsK5FqqTN51kVuYgnYWf` — divide_strain (anak = strain 6)
- … +1 more tx in the manifest

## 💰 Industrial dividend

`mt:elixir-aether` burned → epoch contribution → pro-rata claim.

- `GfqatLA7TMR9mGBsA4Fo9Z76dHWTKABJhu4v6nVCmXzG` — synthesize_and_redeem_aether (kontribusi dividen epoch 0)
- `6hPrMTJubZTcRATiGQxYZNxcL4WGXA3KVpgHqtvoBWFq` — claim_industrial_dividend (strain 5, epoch 0)

## ⚔️ M&A & lysis

A starving strain (Distressed, 1..2000 vitality) is taken over: hostile 115% (95% to the old owner, 5% treasury) or adopt at 100% book value; Insolvent (0) is lysed permissionlessly — 10% bounty, 90% to treasury + Nutrient Burst. Aging is accelerated by the sandbox clock (`advance_sandbox_clock`, owner-only, .testnet accounts).

- `4o4qwoGZtR7HE5E3VnjQZpXwDicpa9QVBzXHS1YP2v4f` — gladi-retry hostile_takeover_splice 2026-11-09T12:29Z
- `7w3tBNjLYFXKiUdmXtH1LhponGr6yhu1Q22xCFdLzo34` — gladi-retry adopt 2026-11-09T12:30Z
- `AhEk4TNNeTj4orchvXSuPood8vAxTiQNWhZZwSdD9JH9` — gladi-retry harvest_starving_strain 2026-11-09T12:30Z

## 💸 `$SNACC` transfer

NEP-141 `ft_transfer` of the balance from the M&A payout to another account.

- `FQ6R9fmKWntSwQPjKchbd3EY8tnoZ3pvcNvSwZAtvXa8` — gladi-retry ft_transfer 2026-11-09T12:30Z

## 🏦 Vault sub-account

The NFT has its own account: `s-<id>-<tag>.<contract-account>`.

- `HUqc4HUxwaBpqbNdcbiHa2WFEGfeu6HN2hjkyxcnEKK6` — materialize_subaccount (strain 5, deposit 20 mN)

## 🫀 NFT transplant

NEP-171 `nft_transfer` — the NFT (living cell + gut + organelles) changes owner.

- `HfhZG6sAdqpKRSJsYRagD9mapCq7JrJvPthkUxFUZQQn` — nft_transfer (strain 4 → x207-demo-buyer)

## 📊 Consistency & solvency

`ft_total_supply == total_snacc_supply`; treasury never negative; `V_epoch` alive (ATP-driven temperature — the zone may differ from the previous gladi).

- `BXSNviQVcvF7rDVp2sBTrD2nWkH8Nu4JXdMqXRezGo7s` — feed strain 5 (Hypothermia temp=18 + Nutrient Burst aktif)
- `CfBR8pFNCGAjCAX21pSMQY9rdjQ2cVKonkzacFjmZpM8` — extract_spores(5, ignis, fee 1912499999150000000000000 — Hypothermia→Fever, pecah dormansi EN-108)
- `6ZXqq4uL9YkTyTU2djSzUk5pxodBVdNdvWBMJFgXCegZ` — feed_strain(5) — fee penuh pasca-non-dormansi, jejak ATP

## 📜 NEP compliance

NEP-177 `nft_metadata` (spec nft-1.0.0) · NEP-145 `storage_deposit(registration_only)` + bounds · NEP-181 enumeration `nft_tokens`/`nft_supply_for_owner` — the entry point for wallets & marketplaces. Verified on the deployed wasm; the view code is in the public repo (contracts PR #21, GLADI-8).

- `9ToLDxMzyqRXM17NJNHd7CAHju8HxtoR2HZZVpUawH9g` — storage_deposit registration_only=true (NEP-145, 5 mN)

## TEE evidence (offline replay)

- chat_id: `d1979ce2662d4da6ae7a931d1158656d` · signed_text: `z-ai/glm-5.3-flash:32f8060d4c516ed0b85f0a67e23a3f86bb469f58ac68004e75044f6a4628fd1e:795cf769d6ebbacdbd77b067c412a88329a65e8343964fd8a8663d04fe7f9393`
- enclave pubkey: `5a0210f2442c79355784f9de021985429561da5bacc3a4424b01ac52b7e0caff` — the ed25519 re-verification lives in `verify-thesis.mjs` (F-03 PASSED).

### RES-103 - TDX attestation (DCAP)

  - Local quote fixture: `/Users/Shenhan/HansProject/NEAR-AI-Hackathon/.worktrees/umb-gladi8/evidence/tee-vector-live.json`
  - **Offline DCAP verification: SKIPPED (dcap-qvl is not installed)**
    - Install: `cargo install dcap-qvl` (follow the NEAR AI Cloud TDX attestation docs), then run `npm run demo:replay` again.
  - Quote source: /Users/Shenhan/HansProject/NEAR-AI-Hackathon/.worktrees/umb-gladi8/evidence/tee-vector-live.json
> Re-record: `node scripts/demo-replay.mjs` — deterministic output from the evidence files.