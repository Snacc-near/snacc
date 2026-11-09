# OPS-110..111 — `$SNACC` Ticker & Account Name Research

> Availability research, not claims. Every finding comes with evidence (a URL / an RPC response) and a check time: **2026-11-07 ±14:30 UTC**. Method: JSON-RPC `query view_account` (testnet: `rpc.testnet.near.org`; mainnet: `free.rpc.fastnear.com`) + a web search.

## 1. The `$SNACC` ticker on meme.cooking & DEXs

| Place | Status | Evidence |
| --- | --- | --- |
| meme.cooking (NEAR) | **No evidence of a live `$SNACC` token found** — the web search only returns general launchpad docs (`docs.meme.cooking`), with no SNACC token page | A web search on 2026-11-07; the final verification still requires checking the meme.cooking token list directly before the launch ritual (`RES-109`) |
| SUI (Noodles DEX) | **TAKEN** — "SnaccCoin (SNACC)" `0x48b8…1703`, very low liquidity | https://app.noodles.fi/coins/0x48b8d32d4acd875f09613aea6853e44e1ffe861d4067a66b822ebe5502691703::snacc::SNACC |
| Solana | **TAKEN** — "Snacc Coin (SNACC)" `D3fy…pump` (market cap ≈$5.3K, 2 holders) | https://phantom.com/tokens/solana/D3fyxRFDPFRsxWrUac7youGPXbMUj9FUDLHE8SW9pump |
| BASE | **TAKEN** — "SnaccCoin (SNACC)" `0xbb96…b12a` (ERC-20, 7 holders) | https://thebittimes.com/token-SNACC-BASE-0xbb966a4053f4d0cfa3d8a9126192e42a84e4b12a.html |
| Other meme sites | **TAKEN** — `snacc.fun` ("The Juiciest Meme Coin in the Bowl"), `snacc.wtf` ("$SNACC … emotional support cat") | https://snacc.fun/ · https://snacc.wtf/ |

**Ticker conclusion:** within the NEAR/meme.cooking ecosystem there is no evidence of `$SNACC` being taken; the ticker remains usable for a NEAR launch. **The cross-chain homonym risk is real** (at least 4 other "SNACC" projects on SUI/Solana/BASE + 2 meme sites) — the branding should always name the chain: **"$SNACC on NEAR"** in the README/submission, plus a manual check of the meme.cooking token list right before `RES-109`.

## 2. NEAR account names (RPC evidence; `UNKNOWN_ACCOUNT` = available)

| Account | Chain | Status | Evidence |
| --- | --- | --- | --- |
| `snacc.near` | mainnet | **TAKEN** — the account exists (balance ≈67 NEAR, `code_hash` = an empty account without a contract) | RPC `view_account`, block `223481504` |
| `snacc-v001.near` | mainnet | **AVAILABLE** (`UNKNOWN_ACCOUNT`) | RPC `view_account`, block `223481505` |
| `snacc-token.near` | mainnet | **AVAILABLE** (`UNKNOWN_ACCOUNT`) | RPC `view_account`, block `223481505` |
| `snacc.testnet` | testnet | **AVAILABLE** (`UNKNOWN_ACCOUNT`) | RPC `view_account`, block `276646224` |
| `snacc-v001.testnet` | testnet | **AVAILABLE** (`UNKNOWN_ACCOUNT`) | RPC `view_account`, block `276646231` |
| `snacc-v1.testnet` | testnet | **AVAILABLE** (`UNKNOWN_ACCOUNT`) | RPC `view_account`, block `276646236` |

## 3. Short recommendations

1. **The testnet contract**: claim & deploy to `snacc-v001.testnet` (available; consistent with the `s-<id>.snacc-v001.near` format in the Kamus Angka) — per the `OPS-104..106` plan.
2. **Mainnet account names** (post-hackathon, requires the owner's approval): `snacc-v001.near` is still available if we want consistency with the contract; `snacc.near` cannot be used (taken by someone else — matches the Kamus Angka note).
3. **Ticker**: continue with `$SNACC` for NEAR, with the "$SNACC on NEAR" disambiguation in all public material because the cross-chain homonym is proven.
4. One final manual check of the meme.cooking token list right before the launch ritual (`RES-109`) — today's web search results are no substitute for a direct check.
