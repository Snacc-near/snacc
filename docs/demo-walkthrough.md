# Snacc — Demo Walkthrough: *Do X → See Y* (`DEMO-105..106`)

> Every step can be followed **without an account** — Node.js 22+ plus reading the evidence is enough. Every "See Y" carries **real evidence** (tx hash / output / explorer link). $SNACC testnet has no monetary value.
>
> **Full written evidence (real output per step + the original SVGs from chain):** [`docs/demo-evidence-pack.md`](demo-evidence-pack.md).

## 1 · See the machine alive on chain (no setup)
**Do X:** open `https://testnet.nearblocks.io/account/snacc-v001.testnet`
**See Y:** the contract account with real gameplay transactions — birth, feeding, TEE, fusion, divide, dividend, NFT transplant.

## 2 · Replay the whole demo from evidence (offline, <1 second)
**Do X:**
```bash
git clone https://github.com/Snacc-near/scripts.git scripts   # once, from the repo root (scripts/ is a separate repo)
npm run demo:replay
```
**See Y:** 14 story beats (Birth → Feed→ATP → TEE → NEP-245 chain → NPC → Shrinking supply → Fusion & reproduction → Dividend → M&A & lysis → `$SNACC` transfer → Vault → Transplant → Consistency → NEP compliance) — 51 tx replayed from `evidence/gladi-manifest.json`. Original output: `demo-evidence-pack.md` §E2.

## 3 · Prove the thesis is falsifiable (falsifiers, no keys, <5 seconds)
**Do X:**
```bash
npm run verify:thesis
```
**See Y:** `PASSED F-01` (storage cost 0.01734 NEAR/NFT from LIVE mainnet parameters), `PASSED F-02` (`ft_total_supply == total_snacc_supply`, real burn), `PASSED F-03` (TEE signature re-verified with ed25519 offline). Original output: `demo-evidence-pack.md` §E3.

## 4 · See one zero-trust TEE transaction in detail
**Do X:** open `https://testnet.nearblocks.io/txns/6s7UFfjd8XBPZ6b9FK4tzGhEo6kstAVeNMCpdwAT9FCN` (genome mutation)
**See Y:** the `genome_mutated` log (`strain_id: 5`, `efficiency_shift_bps: 450`, `vitality_bonus: 200`) — the mutation was applied ONLY after the contract verified `ed25519` over `z-ai/glm-5.3-flash:<req_sha>:<res_sha>` (supporting evidence: `evidence/tee-vector-live.json`; raw RPC log: `demo-evidence-pack.md` §E4).

## 5 · See the NEP-245 production chain (spore → enzyme → elixir)
**Do X:** `https://testnet.nearblocks.io/txns/AWdh3Wuhkr7E5PRyi1rw7Bg7FFyYcydt2CAPx39Yzd57` (synthesize elixir)
**See Y:** the `synthesized` + `atp_spent` logs — the elixir is born from transmute enzymes (amalgam/redactase/synthase), all recorded in the NFT inventory.

## 6 · See the NFT own an account & be transplantable
**Do X:** `https://testnet.nearblocks.io/txns/G2zaGz4E3gLqyofxZNqXENu4WrcYxUrqVeW8dCgpwJEN` (vault) then `https://testnet.nearblocks.io/txns/88fJz3kdyzr1ZuHHxeNEVBEVNLNRBiFTRunVHnaQdsR5` (transfer)
**See Y:** the sub-account `s-5-276801280.snacc-v001.testnet` materialized; the NFT (living cell + stomach + organelles) changes owner via `nft_transfer` NEP-171.

## 7 · See the cloud API (read-only)
**Do X:**
```bash
curl -s https://8787-agq3sgcdseushmj4q73lv3xqea.instabox.tech/api/crucible/macro
```
**See Y:** live macro-state JSON from testnet (`crucibleTemp`, `zone`, `epochVolume`, `blockHeight`). Original output: `demo-evidence-pack.md` §E7.

## 8 · Read the claims & their limits (honest)
**Do X:** read `README.md` *Live evidence* section + `docs/evidence-pack.md`
**See Y:** every claim carries a hash/link; the **CLAIM LIMIT** block in `evidence/gladi-kpi.md` says what is NOT yet tested. No hash = no claim.

---
*Teams PNG screenshot for README are taken from steps 1–4 and 7 (waiting on the FE visual for the UI parts — `DEMO-101..104` video to follow after acc). **The substitute that already exists today:** [`demo-evidence-pack.md`](demo-evidence-pack.md) — real output per step + 4 original SVGs extracted from `nft_token` in [`docs/assets/`](assets/).*
