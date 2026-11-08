# Snacc — Evidence Pack (verify every live claim yourself)

**Contract:** `snacc-v001.testnet` (NEAR testnet) · **Checked:** 2026-11-08 14:34 UTC, by calling the RPC (read-only; no transaction was sent to write this page) · **Track map:** `memecoins` · `nfts` · `games` · `privacy`/TEE · `thesis`

Every row is: **claim → evidence (tx hash with explorer link, or a view call) → the exact command → status**. A tx hash is listed only if RPC `tx` returned it with `SuccessValue`; a view is listed only if it returned the value shown. Anything that failed, was not found, or was never run is in [§7 Not yet proven live](#7-not-yet-proven-live), not here. `$SNACC` on testnet has no monetary value; nothing here is a promise of profit.

## 0. Setup and how to read this page

```bash
# 1) public testnet RPC (rpc.testnet.near.org now answers with a "DEPRECATED" error, code -429, when tested 2026-11-08, so use FastNEAR)
export RPC=https://test.rpc.fastnear.com
# 2) two helpers (bash or zsh; needs curl + python3)
view() { local a=${2:-'{}'}; curl -s "$RPC" -H 'content-type: application/json' -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"query\",\"params\":{\"request_type\":\"call_function\",\"finality\":\"final\",\"account_id\":\"snacc-v001.testnet\",\"method_name\":\"$1\",\"args_base64\":\"$(printf '%s' "$a" | base64 | tr -d '\n')\"}}" | python3 -c 'import sys,json;d=json.load(sys.stdin);print(bytes(d["result"]["result"]).decode() if "result" in d else d)'; }
tx() { curl -s "$RPC" -H 'content-type: application/json' -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tx\",\"params\":[\"$1\",\"${2:-snacc-v001.testnet}\"]}" | python3 -c '
import sys,json
r=json.load(sys.stdin).get("result")
if not r: sys.exit("tx not found")
t=r["transaction"]
print("status:",list(r["status"])[0],"| signer:",t["signer_id"],"| call:",[a["FunctionCall"]["method_name"] if "FunctionCall" in a else list(a)[0] for a in t["actions"]])
for o in [r["transaction_outcome"]]+r["receipts_outcome"]:
    for l in o["outcome"]["logs"]: print("  log:",l[:200])'; }
```

`view <method> '<json args>'` prints the contract's JSON. `tx <hash> [signer]` prints status, the called method and the contract's event logs (signer defaults to `snacc-v001.testnet`). Explorer links open in a browser (`testnet.nearblocks.io` blocks `curl` with HTTP 403, so the RPC commands are the machine-checkable path).

**Two epochs of evidence — read this before comparing numbers.** On 2026-11-08 the contract was **redeployed and migrated** (deploy [`A39Ca1gh…`](https://testnet.nearblocks.io/txns/A39Ca1ghQy1hWVtaiYjjWfmmHZRMzqd1krUZEm59f6cY) at 13:52 UTC, `migrate` [`87NUH93R…`](https://testnet.nearblocks.io/txns/87NUH93RBphe7YmAYm3KavACctbRgg1kjgYhvMybnkYq)), which **reset contract state** (strain ids restart at 1) and changed the code hash. So:

- **Post-redeploy ("current")** txs and all view values describe the current state. View values are point-in-time and can change when anyone transacts.
- **Pre-redeploy ("history")** txs stay valid on chain — RPC `tx` still returns them — but the state they changed no longer exists, so views will **not** reproduce their numbers. They are marked `history`. All 48 txs listed in `evidence/gladi-manifest.json` are pre-redeploy; each was re-fetched on 2026-11-08 and returned `SuccessValue`.
- `evidence/snacc.wasm` is the **pre-redeploy** build (its sha256 in base58 is `7xsoiDzw…`); the current on-chain `code_hash` differs (see C1). Do not expect that file to hash to the current deployment.
- `evidence/gladi-kpi.md` was generated at 04:49 UTC (pre-redeploy): it still shows KPI G-12 as BELUM and counts 16 PASS / 0 FAIL / **5 BELUM** of 21. The thermostat evidence below (M4) is newer than that file.

## 1. Chain and deployment (shared by all tracks)

| ID | Claim | Evidence | Verify | Status |
| --- | --- | --- | --- | --- |
| C1 | The contract is deployed on testnet and was migrated; it identifies itself as `snacc-v001`. | deploy [`A39Ca1gh…`](https://testnet.nearblocks.io/txns/A39Ca1ghQy1hWVtaiYjjWfmmHZRMzqd1krUZEm59f6cY) (`DeployContract`), migrate [`87NUH93R…`](https://testnet.nearblocks.io/txns/87NUH93RBphe7YmAYm3KavACctbRgg1kjgYhvMybnkYq) (`migrate`); view `protocol_version` = `"snacc-v001"`; on-chain `code_hash` `GdmJLh4CdqzyGnqYTQkNWxieA36K9fAN34vu6ibLM2C6` (read 2026-11-08) | `tx A39Ca1ghQy1hWVtaiYjjWfmmHZRMzqd1krUZEm59f6cY` · `tx 87NUH93RBphe7YmAYm3KavACctbRgg1kjgYhvMybnkYq` · `view protocol_version` · `curl -s $RPC -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"query","params":{"request_type":"view_account","finality":"final","account_id":"snacc-v001.testnet"}}'` | Verified |
| C2 | The books balance: global solvency view reports zero drift. | view `get_global_solvency` → `"drift":0,"solvent":true` (read 2026-11-08; `total_minted` 1.6e24, `total_burned` 1.47e22 yocto-$SNACC) | `view get_global_solvency` | Verified (view) |

## 2. Track `memecoins` — `$SNACC` (NEP-141) and the algorithmic thermostat (`CrucibleTemp`)

| ID | Claim | Evidence | Verify | Status |
| --- | --- | --- | --- | --- |
| M1 | `$SNACC` is a NEP-141 token with symbol `$SNACC`, 24 decimals. | view `ft_metadata` → `"symbol":"$SNACC","decimals":24` | `view ft_metadata` | Verified (view) |
| M2 | Supply is consistent: `ft_total_supply` equals the macro-state supply and equals minted − burned. | `ft_total_supply` = `"1585299999000000000000000"`; `get_macro_state.total_snacc_supply` = same; `1.6e24 − 14700001e15` = same (read 2026-11-08) | `view ft_total_supply` · `view get_macro_state` · `view get_global_solvency` | Verified (view) |
| M3 | Supply can only shrink after birth: an explicit burn is on chain and the burn counter is non-zero. | burn tx [`25N2nDfk…`](https://testnet.nearblocks.io/txns/25N2nDfkTmrmwQ81pq4TK2Z4cC97SRbh7MHKyFC9ZqQx) (`ft_burn`, event `ft_burn`, amount 1e15); `get_macro_state.total_snacc_burned` = 14700001000000000000000 (> 0) | `tx 25N2nDfkTmrmwQ81pq4TK2Z4cC97SRbh7MHKyFC9ZqQx` · `view get_macro_state` | Verified |
| M4 | The thermostat fired on chain: a feed pushed the Crucible temperature from the hypothermia zone into FEVER and the contract burned 350 bps of the fee. | feed tx [`68VA8Qm7…`](https://testnet.nearblocks.io/txns/68VA8Qm7fwLJZq3GWcvFLrEYG6eERxupVQJ77eHKJA6e) logs `zone_changed` `HYPO → FEVER`, `crucible_temp` 762 mK; `dividend_inflow` `fee` 4.2e23, `burned` 1.47e22 (= 350 bps, matching `params.fever_burn_bps` 350); preceding extract tx [`4CWowXhp…`](https://testnet.nearblocks.io/txns/4CWowXhpGW6vC2qyeYG4sxNSMtsRaXegnxVntmYfLVMu) (`extracted`, catalyst fee 3e23); view `get_crucible_temp` = 673 mK (read 2026-11-08 14:34 UTC; threshold `fever_threshold_mk` 610) | `tx 4CWowXhpGW6vC2qyeYG4sxNSMtsRaXegnxVntmYfLVMu` · `tx 68VA8Qm7fwLJZq3GWcvFLrEYG6eERxupVQJ77eHKJA6e` · `view get_crucible_temp` · `view get_appetite_meter` | Verified. Caveat: testnet scale is tiny — total supply is about 1.6 `$SNACC`, and the feed that triggered FEVER was 0.5 `$SNACC`. The live temperature reading will change over time; the tx logs are the durable proof. |
| M5 | An on-chain NPC merchant trades spores at a scarcity price. | tx [`7Bkdj7bY…`](https://testnet.nearblocks.io/txns/7Bkdj7bYxipkanxScKnV1tG4VSQ4G19HTfXNoyHJTAcC) (`npc_buy_spores`, event `npc_spores_bought`: 50 spores, `unit_price` 111, `total_cost` 5550); view `get_npc` → `"base_spore_price":100,"trades_executed":1,"snacc_reserve":5550` | `tx 7Bkdj7bYxipkanxScKnV1tG4VSQ4G19HTfXNoyHJTAcC` · `view get_npc '{"npc_id":"npc-extractor"}'` | Verified |

## 3. Track `nfts` — living Strain NFTs (NEP-171 / NEP-177 / NEP-181) with on-chain SVG

| ID | Claim | Evidence | Verify | Status |
| --- | --- | --- | --- | --- |
| N1 | Strains are NFTs whose image is an SVG generated on chain, within a 1,734-byte budget. | view `nft_total_supply` = `"8"`; `nft_token` for token 5 returns `media` as `data:image/svg+xml;base64,…`; decoded SVG = 480 bytes (tokens 1, 4, 5 = 441, 473, 480 B; contains the `ATP` and `mK` indicators) | `view nft_token '{"token_id":"5"}' \| python3 -c 'import sys,json,base64;m=json.load(sys.stdin)["metadata"];s=base64.b64decode(m["media"].split(",")[1]);print(len(s),"bytes");print(s[:200])'` | Verified (view) |
| N2 | `nft_transfer` works and moves ownership. | tx [`BJ691u7g…`](https://testnet.nearblocks.io/txns/BJ691u7gtsY1Bsx69DiEm9eH1bGABxR1rToDkoeGU3ym) (`nft_transfer`, `nep171` event: token `"4"` → `x207-demo-buyer.testnet`); view `nft_token` for token 4 → `"owner_id":"x207-demo-buyer.testnet"` | `tx BJ691u7gtsY1Bsx69DiEm9eH1bGABxR1rToDkoeGU3ym` · `view nft_token '{"token_id":"4"}'` | Verified |
| N3 | NEP-177 contract metadata and NEP-181 enumeration are exposed. | views `nft_metadata` (`"spec":"nft-1.0.0"`), `nft_tokens` (8 tokens), `nft_supply_for_owner` (`snacc-v001.testnet` → `"7"`, `x207-demo-buyer.testnet` → `"1"`), `nft_tokens_for_owner` | `view nft_metadata` · `view nft_tokens '{"from_index":"0","limit":20}'` · `view nft_supply_for_owner '{"account_id":"x207-demo-buyer.testnet"}'` | Verified (view) |
| N4 | NEP-145 storage registration works. | tx [`5PYErvAV…`](https://testnet.nearblocks.io/txns/5PYErvAVUFrsS4uoidx9eqUk6uYUbK9cLuup8aL74mzq) (`storage_deposit`, `registration_only:true`); view `storage_balance_of` → `{"total":"5000000000000000000000",…}`; `storage_balance_bounds` → `min` 5e21 | `tx 5PYErvAVUFrsS4uoidx9eqUk6uYUbK9cLuup8aL74mzq` · `view storage_balance_of '{"account_id":"snacc-v001.testnet"}'` | Verified |
| N5 | The NFT mirrors live organism state. | `nft_token` for token 5 says `role 7, gen 4`; `get_strain` for strain 5 returns `"role_mask":7,"generation":4` | `view nft_token '{"token_id":"5"}'` · `view get_strain '{"strain_id":5}'` | Verified (view) |

Scope note (not a claim): NEP-245 is only an *internal data model* (inventory ledger) — the contract has **no public `mt_*` interface**, and we do not claim NEP-245 compliance (check: the ABI from `cargo near abi` in the `contracts` repo lists no `mt_*` method).

## 4. Track `games` — the organism loop

| ID | Claim | Evidence | Verify | Status |
| --- | --- | --- | --- | --- |
| G1 | Birth: `incubate_strain` stakes `$SNACC` and creates a Strain NFT with its own vault sub-account name. | tx [`AMmAhZJF…`](https://testnet.nearblocks.io/txns/AMmAhZJFaywXGxJcFGaaMS1SMDUxcU4W2NDvcy2fRwdb) (event `strain_created`: strain 1, `role_mask` 2, stake 2.5e23, 10 spores); view `get_macro_state.total_births` = 8 | `tx AMmAhZJFaywXGxJcFGaaMS1SMDUxcU4W2NDvcy2fRwdb` · `view get_strain '{"strain_id":1}'` | Verified |
| G2 | Eating: feeding burns/pays a fee and mints ATP to the strain. | tx [`68VA8Qm7…`](https://testnet.nearblocks.io/txns/68VA8Qm7fwLJZq3GWcvFLrEYG6eERxupVQJ77eHKJA6e) (event `fed`: `atp_minted` 572880000); view `get_strain` strain 5 → `atp_balance` > 0 | `tx 68VA8Qm7fwLJZq3GWcvFLrEYG6eERxupVQJ77eHKJA6e` · `view get_strain '{"strain_id":5}'` | Verified |
| G3 | Supply chain: extract spores → transmute to enzymes (inventory ledger, ATP spent). | extract [`4CWowXhp…`](https://testnet.nearblocks.io/txns/4CWowXhpGW6vC2qyeYG4sxNSMtsRaXegnxVntmYfLVMu) (`extracted` `mt:spore-ignis`, `atp_spent`), transmute [`64zmPSxT…`](https://testnet.nearblocks.io/txns/64zmPSxTJPYr21gGSj3PEnZ5ozKYERpWz3vikEwRz45J) (`transmuted` → `mt:enzyme-amalgam`); view `get_inventory` | `tx 64zmPSxTJPYr21gGSj3PEnZ5ozKYERpWz3vikEwRz45J` · `view get_inventory '{"strain_id":5,"token_id":"mt:enzyme-amalgam"}'` | Verified |
| G4 | Last stage of the chain: synthesize an elixir from enzymes. `history` (pre-redeploy). | tx [`FHoCjjYT…`](https://testnet.nearblocks.io/txns/FHoCjjYTdnck3YoMh9CiVVaTF2iZ3LUfvHkqo7RpAcuN) (`synthesized` `mt:elixir-homeostasis`), tx [`3wCubACs…`](https://testnet.nearblocks.io/txns/3wCubACsn8KZYc8h9JSF85YM12VFMgtNWBhESM3z9uuE) (`synthesized` `mt:elixir-aether`) | `tx FHoCjjYTdnck3YoMh9CiVVaTF2iZ3LUfvHkqo7RpAcuN` · `tx 3wCubACsn8KZYc8h9JSF85YM12VFMgtNWBhESM3z9uuE` | Verified as history (the same call failed twice after the redeploy — see §7) |
| G5 | Fusion: `splice_strains` merges two strains and charges a merger tax. | tx [`6r4bgbZR…`](https://testnet.nearblocks.io/txns/6r4bgbZR9Ch9saAvwMUE94j3vXKL749tJHYzkuftg12L) and [`GbsZX59D…`](https://testnet.nearblocks.io/txns/GbsZX59DUA86DFqQmbSBbvFQ1gg69Duyya1s2GJViTGy) (event `strains_spliced` with `merger_tax`); view `get_macro_state.total_mergers` = 3 | `tx GbsZX59DUA86DFqQmbSBbvFQ1gg69Duyya1s2GJViTGy` · `view get_macro_state` | Verified |
| G6 | Reproduction: `divide_strain` creates a child strain. | tx [`93bSskkm…`](https://testnet.nearblocks.io/txns/93bSskkmXJRz9ayQNsPQNzHeH6DEVQ2r7akcq3o2wKjC) (event `strain_divided`: parent 1 → child 5, generation 3); view `get_macro_state.total_divides` = 1 | `tx 93bSskkmXJRz9ayQNsPQNzHeH6DEVQ2r7akcq3o2wKjC` | Verified |
| G7 | Organelle allocation costs ATP and is recorded. | tx [`BAhEyEzK…`](https://testnet.nearblocks.io/txns/BAhEyEzKWG3Tcj7R1kVMYQqyRm1WJm3t3k5qZkvWDYWW) (`allocate_atp`, event `atp_allocated` 1/1/1, cost 3); view `get_strain` strain 1 → `"organel":{"mitokondria":1,"nukleus":1,"lisosom":1}` | `tx BAhEyEzKWG3Tcj7R1kVMYQqyRm1WJm3t3k5qZkvWDYWW` · `view get_strain '{"strain_id":1}'` | Verified |
| G8 | Epochs close with a feast verdict and a dividend-pool snapshot. | tx [`B3PqaJuQ…`](https://testnet.nearblocks.io/txns/B3PqaJuQ2xTPeCjWEib8HjXYAJeQN9TCQ6x2pbW7BdH) and [`EyogjhyX…`](https://testnet.nearblocks.io/txns/EyogjhyXx7p2Gs1GkYB2t1MwSsM6AoAKpygGuNEp3d6s) (`advance_epoch` → events `feast_result` `UNDERFED`, `epoch_dividend_closed`); view `get_macro_state.last_zone` | `tx B3PqaJuQ2xTPeCjWEib8HjXYAJeQN9TCQ6x2pbW7BdH` | Verified |
| G9 | Each strain has a real sub-account vault on chain. `history` (pre-redeploy). | tx [`iADcpsuW…`](https://testnet.nearblocks.io/txns/iADcpsuWQUE4MWHfBnwhKvNjiawSRBEBg93sFeLgJqz) (`materialize_subaccount`, log `subaccount_materialized strain_id=1 sub_account_id=s-1.snacc-v001.testnet`); accounts `s-1.snacc-v001.testnet`, `s-5…`, `s-9…` exist (`view_account`) | `tx iADcpsuWQUE4MWHfBnwhKvNjiawSRBEBg93sFeLgJqz` · `curl -s $RPC -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"query","params":{"request_type":"view_account","finality":"final","account_id":"s-1.snacc-v001.testnet"}}'` | Verified as history |
| G10 | Industrial dividend: burning an aether elixir contributes, and the strain later claims a payout. `history` (pre-redeploy, epoch 4). | tx [`8umhfAmX…`](https://testnet.nearblocks.io/txns/8umhfAmX5g4pybRAbP6BQqXdcgoUBsGpoXv7fWM1LbpP) (`aether_burned_for_dividend`), tx [`4zaVoRcL…`](https://testnet.nearblocks.io/txns/4zaVoRcLA3GQBzRLKxRpEfDYqgzRTfNehVbe3vH3jVNs) (`dividend_claimed`, `payout` 1.4e13) | `tx 8umhfAmX5g4pybRAbP6BQqXdcgoUBsGpoXv7fWM1LbpP` · `tx 4zaVoRcLA3GQBzRLKxRpEfDYqgzRTfNehVbe3vH3jVNs` | Verified as history; payouts are mechanics evidence, not a return promise |

## 5. Track `privacy` — verifiable AI in a TEE (zero-trust genome mutation)

The flow: the contract stores a **commitment** to the request (`commit_genome_experiment`), a NEAR AI Cloud TEE model answers, and `apply_tee_mutation_zero_trust` applies the answer only together with the raw response and its `ed25519` signature.

| ID | Claim | Evidence | Verify | Status |
| --- | --- | --- | --- | --- |
| P1 | A real NEAR AI Cloud TEE response carries a valid `ed25519` signature over `<model>:<req_sha256>:<res_sha256>`, checkable offline with no key. | `evidence/tee-vector-live.json` (chat `14a1b709e99641f7afcaf0dfbe2dd0bd`, model `z-ai/glm-5.3-flash`, pubkey `5a0210f2…0caff`); re-verified 2026-11-08: response hash OK, signed text OK, signature OK | From the repo root: `node -e 'const c=require("node:crypto"),v=require("./evidence/tee-vector-live.json");const pk=c.createPublicKey({key:Buffer.concat([Buffer.from("302a300506032b6570032100","hex"),Buffer.from(v.tee_pubkey_hex,"hex")]),format:"der",type:"spki"});const sha=s=>c.createHash("sha256").update(s).digest("hex");console.log("res_sha256 ok:",sha(v.raw_response_body)===v.res_sha256_hex,"\| signed_text ok:",v.signed_text==="z-ai/glm-5.3-flash:"+v.req_sha256_hex+":"+v.res_sha256_hex,"\| ed25519 ok:",c.verify(null,Buffer.from(v.signed_text),pk,Buffer.from(v.signature_hex,"hex")))'` | Verified (offline). This proves the signature is valid under that pubkey; it does not by itself prove the pubkey belongs to a genuine enclave (see §7). |
| P2 | The TEE signer key is registered on chain (current deployment). | tx [`3u3RXdpC…`](https://testnet.nearblocks.io/txns/3u3RXdpCzYn1WFVnmvPFW2PxbFw52g8i9QqDmvLwo1kv) (`register_attested_signer`, event `signer_added`, pubkey `5a0210f2442c79355784f9de021985429561da5bacc3a4424b01ac52b7e0caff` = P1's pubkey) | `tx 3u3RXdpCzYn1WFVnmvPFW2PxbFw52g8i9QqDmvLwo1kv` | Verified |
| P3 | Commit-then-apply works on chain, and the bytes applied on chain are exactly the P1 vector. `history` (pre-redeploy, strain 5). | commit tx [`ExjLbB45…`](https://testnet.nearblocks.io/txns/ExjLbB45JBBJKmGR1tND5dFxrWLwYh8Qikf37jRF1XCR) (event `genome_committed`, `req_sha256_hex` `0be35bb4…ef17`); apply tx [`BqPy3ndK…`](https://testnet.nearblocks.io/txns/BqPy3ndKXtxeGSvhQyiiv2qDdMtzKGio5kN96Cq9PQye) (event `genome_mutated`: `efficiency_shift_bps` 450, `vitality_bonus` 200); its call args (`req_sha256_hex`, `raw_response_body`, `signature_hex`, `tee_pubkey_hex`) are byte-equal to `evidence/tee-vector-live.json` (compared 2026-11-08) | `tx ExjLbB45JBBJKmGR1tND5dFxrWLwYh8Qikf37jRF1XCR` · `tx BqPy3ndKXtxeGSvhQyiiv2qDdMtzKGio5kN96Cq9PQye` | Verified as history. The strain it mutated was wiped by the redeploy, so `get_strain` today shows `phenotype_trait: null`. On the current deployment this step is **not** proven (§7). |

## 6. Track `thesis` — measurable claims with falsifiers

| ID | Claim | Evidence | Verify | Status |
| --- | --- | --- | --- | --- |
| T1 | Storage economics: an NFT image budget of 1,734 bytes costs 0.01734 NEAR at the live mainnet price per byte. | mainnet `storage_amount_per_byte` = 1e19 yocto → 1,734 × 1e19 / 1e24 = 0.01734 NEAR; real SVGs are 441–480 B (N1). "84.42% saving" is arithmetic against an *assumed* static baseline of 11,129 bytes (`1 − 1734/11129`); the baseline is our assumption, not a measurement | `curl -s -X POST https://free.rpc.fastnear.com -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"EXPERIMENTAL_protocol_config","params":{"finality":"final"}}' \| python3 -c 'import sys,json;print(json.load(sys.stdin)["result"]["runtime_config"]["storage_amount_per_byte"])'` | Verified for the price and the 0.01734 figure; the 84.42% depends on the assumed baseline |
| T2 | Supply invariant (I-01): `ft_total_supply` = tracked supply, and burns are visible. | M2 + M3 above; `npm run verify:thesis` prints `LOLOS F-02` | the M2/M3 commands; optionally `npm run verify:thesis` | Verified by views. `verify:thesis` F-01 and F-02 re-run 2026-11-08 from a clean clone of the repository (F-02 reads `evidence/gladi-manifest.json`, see T5): both `LOLOS` |
| T3 | Solvency invariant (V-04): accounting drift is zero. | C2 above | `view get_global_solvency` | Verified (view) |
| T4 | "Central bank" thesis: the temperature mechanism changes behavior on chain. | M4 above (zone change + 350 bps burn) | see M4 | Verified for one live firing at testnet micro-scale. Model-level claims (long-run stability, profit distribution) are simulations in `docs/econ-*.md`, **not** live evidence. |
| T5 | Falsifier F-03 (TEE signature re-verification). | P1 above | use the P1 command | `npm run verify:thesis` F-03 reads `evidence/tee-vector-live.json` (the P1/P3 vector, chat `14a1b709…`) and F-02 reads `evidence/gladi-manifest.json`; both live inside this repository. Run from a clean clone 2026-11-08 (repo + `scripts/` repo, no install step): F-01, F-02, F-03 all `LOLOS`. F-01 and F-02 query public RPCs (mainnet `free.rpc.fastnear.com`, testnet `test.rpc.fastnear.com`); F-03 is fully offline. |

## 7. Not yet proven live

Nothing below is claimed as live. Failed attempts are listed only so you can see them; they are **not** evidence.

| Item | Status |
| --- | --- |
| **G-02** `ft_transfer` of `$SNACC` between accounts | Not run (no tx). The NEP-141 transfer path is covered by unit tests only. |
| **G-07** hostile takeover (115%, 95/5 split) | Not run. Needs a strain to age into a vulnerable zone; retry is planned for the aging window around 10–11 Nov 2026 (exact times: `npm run gladi:retry`, view-only preflight). |
| **G-08** adopt (`strain_adopted`) | Not run, same aging window (10–11 Nov). |
| **G-10** lysis / harvest of a starving strain (10% bounty) | Not run, same aging window (10–11 Nov). `get_macro_state.total_lyses` = 0. |
| TEE on-chain apply on the **current** deployment | The post-redeploy attempts failed: `commit_genome_experiment` [`GjXv6QoV…`](https://testnet.nearblocks.io/txns/GjXv6QoVsWYAHhFL5akCYEJXZUxKDMqzF9iQqEXTYHyD) and `apply_tee_mutation_zero_trust` [`3EYbLzke…`](https://testnet.nearblocks.io/txns/3EYbLzkESbYZwLzFyHZAjvLAvBd8ni2FtNUW5fr1BxRh) (both `Failure`: contract panic / WebAssembly trap; the cause is not established in this document). P3 is history only. |
| Elixir synthesis, aether redemption and dividend claim on the **current** deployment | Post-redeploy attempts `Failure` (contract panic, cause not established here): `synthesize_elixir` [`4udcaQsw…`](https://testnet.nearblocks.io/txns/4udcaQswn8TcqDZaPvKb6kSUqSFe1zPRSFxgRTRLBgJi), [`DnisxHhE…`](https://testnet.nearblocks.io/txns/DnisxHhERYWVS8am3vnVpVDh4kqEbLm6Q2jcwccrvmnQ); `synthesize_and_redeem_aether` [`4KmehgNS…`](https://testnet.nearblocks.io/txns/4KmehgNSuFYcPvy46rzwpEsdN1S5rZstJ9K89Z1GnhA3); `claim_industrial_dividend` [`7TML1q9c…`](https://testnet.nearblocks.io/txns/7TML1q9curqcM3C59yPzKLGLr942shxUq7Ks9yaggfXP). G4 and G10 are history only. |
| Vault sub-account creation on the **current** deployment | `materialize_subaccount` [`DDBDAtb3…`](https://testnet.nearblocks.io/txns/DDBDAtb35F7PEN3VYdyhwXpzruBh19VJaBX9HeSbFBkQ) returned status `SuccessValue` but logged `ERR_SUBACCOUNT_CREATION_FAILED_REFUNDED`; G9 rests on the pre-redeploy tx and the accounts that exist. |
| TEE **attestation** (is the signing key really inside an enclave?) | Not independently verified here. P1 shows a valid signature, not enclave attestation. |
| NEP-245 public `mt_*` interface | Absent by design today; no compliance claim. NEP-297 event structure is checked by our own tests only (no external parser). |
| Frontend, demo video, submission form | **Not done — deliberately sequenced last.** No FE screenshot or video exists yet. |
| Mainnet | Nothing deployed. All evidence is testnet. |

Related: submission summary in [`../HACKATHON.md`](../HACKATHON.md); security findings and their tests in [`security-audit.md`](security-audit.md).
