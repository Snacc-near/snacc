# RES-120 — Post-Demo Listing Checklist: Mintbase & HOT Craft

**Status:** checklist only — **nothing has been listed** on either marketplace (verified 2026-11-08).
**Item:** RES-120 · 2026-11-08.
**Honesty:** `$SNACC` and all Snacc assets on testnet have no monetary value; any *mainnet* listing
step below requires **explicit owner approval** (project rule) and is therefore gated.

## 0. Link check (curl, 2026-11-08)

| URL | HTTP | Note |
|---|---|---|
| <https://hotcraft.art/> | 200 | HOT Craft marketplace (NFT marketplace on NEAR & multichain) |
| <https://docs.hotdao.ai/hot-kit/mint-nft-via-hot-craft> | 200 | official mint-via-HOT-Craft guide (authCall intents) |
| <https://www.mintbase.xyz/> | 402 | exists but bot-walled to our curl; treat docs links as needing a browser check |
| <https://docs.mintbase.xyz/> | 000 | unreachable from our network on 2026-11-08 — **re-verify before relying on it** |

## 1. Preconditions (before touching any marketplace)

- [ ] **Owner approval** recorded for anything beyond testnet (listing ≠ npm publish, but mainnet
      assets/royalties are a product decision — project rule: explicit approval required).
- [ ] **NEP-181 enumeration** (`nft_total_supply`, `nft_tokens`, `nft_supply_for_owner`,
      `nft_tokens_for_owner`) — per the public `docs/nep-compliance.md` (SEC-103), these views are
      **live-verified on the deployed wasm (KPI G-22 PASS)**. Until 2026-11-09 they were not yet
      present in the public contract source; contracts PR #21 added them, so the public source now
      exposes the same 67-function ABI as the deployed contract (structural ABI parity —
      function list unchanged, not byte-identical wasm: current deployed code_hash
      `DMRgsiLJy74V5RS8txLHeJL3T97ivLHuEtY56sSCYmcr`, 517,185 B, GLADI-8 redeploy 2026-11-09 —
      deploy `BF3MfUnpCtcqqXfBWnusDixvHHENBX2FrUHVhbEZQM7V`, migrate
      `G4fLRtP7RiPAWueNqHkgkao7NJKAmF3WtLks9jFwmF25`, built from contracts main `1281154`
      including PR #22; the earlier deployment, code_hash
      `3DCPVk658pGuRW1FrDZKwrXQr3UHfYG43MoQUfbCwJwt`, 406,495 B, is history). Contracts PR #22
      items (`ft_mint`, string `amount`) are live with the same redeploy — `ft_mint` tx
      `5JCAmSL7pLTV8mShrNuEtG5WLPkCqKkYCZBf5WGtQ2wY`, string-amount `ft_burn` tx
      `ERBRL4rTS6JHEKVsSumLYtru1hXsSYWdkGJH8d1krJaL` — marketplaces rely on the enumeration
      views for collection browsing.
- [ ] **NEP-177 `nft_metadata`** (contract-level metadata) — same status as above: verified live
      (KPI G-22 PASS); until 2026-11-09 it was not yet in the public source, now added in
      contracts PR #21 on the same parity terms (marketplace pages commonly fetch it).
- [ ] Contract standards pass: NEP-141/171/177/245/297 compliance check (`docs/nep-compliance.md`,
      SEC-103) — listing a non-compliant collection gets rejected mid-flow. Note the recorded
      design there: NEP-145 `storage_unregister` is now present in the public source (added in
      contracts PR #21; until then deregistration was via full `storage_withdraw`), and
      `storage_balance_bounds` is likewise present since contracts PR #21,
      NEP-245 is a data model, **not** a public `mt_*` interface.
- [ ] On-chain SVG/telemetry assets confirmed rendering (`nft_token` metadata; see the real SVG art
      in `docs/assets/`).
- [ ] Collection art & metadata finalized: name, description, media (IPFS/NEAR storage CID),
      royalty split (who receives it, in basis points).
- [ ] Honesty pass on all public copy: **no** banned framing terms (play-to-earn labels,
      capital-at-risk framing, APY/earnings promises — see `docs/CONTRIBUTING.md` §1.2); `$SNACC` testnet
      explicitly without monetary value; profit framing = work + redistribution, no guarantees.

## 2. Mintbase path (plan)

- [ ] Re-verify docs reachable from a normal browser (`docs.mintbase.xyz` was unreachable via curl).
- [ ] Create collection (factory) on the target network — **testnet first**; mainnet gated by §1.
- [ ] Set collection metadata + contract-level royalty.
- [ ] Mint the first items from the existing SNACC NFT contract (`nft_transfer` path already in the
      contract; use `cargo near` build hash already deployed — do not rebuild silently).
- [ ] Verify item page renders media + properties; check buy/sell flow on testnet.
- [ ] Record listing URLs + tx hashes in the deployment note (project vault Deployment doc, per
      rekap rule — coordinator handles vault commits).

## 3. HOT Craft path (plan)

- [ ] Follow the official guide <https://docs.hotdao.ai/hot-kit/mint-nft-via-hot-craft> (**200**):
      mint via `authCall` intent, with storage deposit computed from metadata size
      (`(JSON length × 8 / 100_000) × 10^24` yoctoNEAR per their formula).
- [ ] Decide collection contract to list: existing `snacc-v001.testnet` NFT contract (testnet) —
      HOT Craft is multichain; **testnet assets are typically not tradeable there**, so mainnet
      listing remains owner-gated.
- [ ] Add the recommended "Trade on HOT Craft" button in UI only after a real listing exists
      (no dead links in the frontend).
- [ ] Verify item pages: floor/volume shown correctly, transfer works end-to-end.

## 4. After listing (any marketplace)

- [ ] Screenshot + tx hash evidence stored (project `reports/` or vault, per rekap rule).
- [ ] `docs/quickstart.md` links updated to the live pages.
- [ ] If anything fails, mark the checklist item honestly (unchecked + reason) — never mark done
      without a link/tx.

## 5. Explicit non-claims

- No collection is live on Mintbase or HOT Craft as of 2026-11-08.
- No mainnet step has been approved or executed.
- Marketplace reach/volume numbers (e.g. HOT Craft site stats) are third-party and not ours.
