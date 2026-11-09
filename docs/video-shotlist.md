# Snacc Video Demo — 2:30 Shot-list + 30s Judge Hook (`DEMO-101` preparation)

Sources: `snacc-vault/10 Demo/Snacc - Storyboard Demo.md` (the 2:20 storyboard, status locked) and `docs/evidence-pack.md`. The evidence data comes from `docs/evidence-pack.md` (testnet tx hashes) and `scripts/demo-replay.mjs` (`npm run demo:replay`, reading `evidence/`).

Rules: no "GameFi/investment/yield" wording; `$SNACC` testnet has no monetary value; numbers/hashes only from real evidence (no hash = no live claim). EN narration (video), ID notes.

> Sync note: the storyboard uses the word "GameFi" in the shot 1 narration — **replace** it with "token games" / "on-chain economic game" at recording time. The numbers in the storyboard (e.g. `+430 bps`, `+800 bps`, the bounty `2,000`) must be re-checked against the latest replay output before recording.

## A. Judge Hook (0:00–0:30)

| # | Time | Duration | Visual / source | Short narration (EN) |
| - | --- | - | --- | --- |
| H1 | 0:00–0:10 | 10s | **API/UI:** a living NEP-177 SVG card from `nft_token` (strain #1, a `$SNACC` balance, inventory) | "This NFT is alive. It holds a balance and it eats." |
| H2 | 0:10–0:20 | 10s | **Terminal/UI:** `splice_strains` two strains → one Gen-2; the second strain `SplicedBurned` | "Two NFTs merge in one transaction. Balances combine, one is burned." |
| H3 | 0:20–0:30 | 10s | **Terminal:** `npm run verify:thesis` printing `PASS F-01..F-03` + the `CrucibleTemp` gauge | "Every claim is falsifiable. One command checks it." |

## B. The full 2:30 cut (150s)

| # | Time | Duration | Visual / source | Short narration (EN) | Evidence shown |
| - | --- | - | --- | --- | --- |
| 1 | 0:30–0:45 | 15s | **UI** title card + the NEP-177 card | "Snacc: an NFT that eats a memecoin. Feed it or it gets snacked." | the `nft_token` SVG |
| 2 | 0:45–1:05 | 20s | **Explorer** testnet.nearblocks.io the `snacc-v001.testnet` account + the incubate tx | "Each strain is born with its own sub-account and starter spores." | the incubate tx hash (taken from `evidence/gladi-manifest.json`) |
| 3 | 1:05–1:25 | 20s | **Terminal/UI** `transmute_spores_to_enzyme` + `synthesize_elixir`; **API** `GET /api/crucible/macro` | "A three-stage NEP-245-style supply chain, and an algorithmic thermostat, CrucibleTemp, that burns when hot." | the `transmuted`/`synthesized` events; the `crucibleTemp`, `zone` JSON |
| 4 | 1:25–1:55 | 30s | **Explorer** the genome mutation tx `BqPy3ndKXtxeGSvhQyiiv2qDdMtzKGio5kN96Cq9PQye` + **terminal** `evidence/tee-vector-live.json` | "Secret formulas run in NEAR AI Cloud TEE. The enclave signs; our contract verifies the ed25519 signature on-chain before applying the mutation." | the `genome_mutated`, `atp_spent` logs; the model `z-ai/glm-5.3-flash` |
| 5 | 1:55–2:10 | 15s | **Terminal** `npm run demo:replay` the fusion & reproduction beats (`splice_strains`, `divide_strain`) | "Strains can merge or divide. All 51 transactions replay offline in under a second." | the replay output of the "Fusion & reproduction" beat |
| 6 | 2:10–2:20 | 10s | **Explorer** the vault tx `iADcpsuWQUE4MWHfBnwhKvNjiawSRBEBg93sFeLgJqz` + the transfer `3fM5iK4dLLWiyHBAM2wqdMVHQbgLxc4VVsxndBZunFFm` | "A strain's sub-account moves with the NFT via NEP-171 transfer." | the `s-<id>` sub-account; the owner moves |
| 7 | 2:20–2:30 | 10s | **Terminal** the full `verify:thesis` + the repo URL | "Reproduce our thesis with one command. Testnet only, no monetary value." | `PASS F-01/F-02/F-03`; the `Snacc-near` repo URL |

Total: a 30s hook + a 120s cut = 150s. The full cut can also be used standalone (0:00–2:30 with the H1–H3 hook replacing shot 1 when a single video is used).

## C. Production notes

- A Cell Lysis (`harvest_starving_strain`) cutaway exists in the original storyboard (shot 6) but was cut from this 2:30 version in favor of the real txs that are available; add 15s if there is a testnet hash for the liquidation.
- Record the terminal at a font ≥18pt; show the full hash on screen for ≥2 seconds so judges can verify it.
- Verify before recording: `npm run demo:replay` and `npm run verify:thesis` must be green on a clean machine (not yet run by this session).
- The video has not been recorded; this document is a plan only.
