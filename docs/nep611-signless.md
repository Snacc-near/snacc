# RES-111 — Signless: the function-call key (sessions) — what works, what does not

> Status: **DOCUMENT + SDK (2026-11-08)**. Corrected from the early draft: the NEAR protocol constraint
> (a function-call access key cannot carry a deposit) means **deposit-bearing actions still go
> through the wallet**; signless is only for deposit-0 actions. A relayer / gas-station for deposit-bearing
> actions is a **post-hackathon plan, not an existing feature** (see §5).
> Update 2026-11-14: the app now has its own opt-in one-tap play (a separate implementation from the
> SDK's `SessionKeyManager`, described in §3). §§1-2 describe the SDK design; the app's method list is a
> subset of it, and deposit-bearing actions still go through the wallet.
> `$SNACC` testnet has no monetary value.

## 1. The protocol constraint (the core decision)

NEAR rejects transactions signed by a **function-call access key** when the transaction carries
a deposit (`DepositWithFunctionCall`). As a result:

| Action class | Example methods | Signer |
| --- | --- | --- |
| **Deposit-bearing** (`DEPOSIT_METHODS`) | `incubate_strain`, `materialize_subaccount`, `extract_spores`, `transmute_spores_to_enzyme`, `synthesize_elixir`, `ft_transfer`, `ft_transfer_call`, `nft_transfer`, `nft_transfer_call`, `storage_deposit` | **The wallet** (an approval popup). Cannot be signless. |
| **Deposit-0** (`SIGNLESS_METHODS`) | `feed_strain`, `allocate_atp`, `splice_strains`, `hostile_takeover_splice`, `adopt`, `divide_strain`, `harvest_starving_strain`, `conjugate_traits`, `commit_genome_experiment`, `apply_tee_mutation_zero_trust`, `npc_buy_spores`, `synthesize_and_redeem_aether`, `claim_industrial_dividend`, `advance_epoch`, `ft_burn` | **A session key** (a function-call key, no popup) via `SessionKeyManager`. |

The source of truth for these lists is `SIGNLESS_METHODS` / `DEPOSIT_METHODS` in
[`sdk:src/session-key.ts`](https://github.com/Snacc-near/sdk/blob/main/src/session-key.ts); this document is copied from there. The SDK enforces it in two places:
`createSession` rejects a method list containing a deposit-bearing method, and `call` rejects a deposit ≠ 0 —
both with the `DEPOSIT_NOT_ALLOWED` error code.

## 2. The player flow (what actually happens)

```
1. The player connects with their NEAR wallet (their own account; it already has a NEAR balance for the stake).
2. HATCHING = 1 wallet popup: incubate_strain(...) carries the deposit (the stake) → the NFT + the vault
   sub-account `s-<id>.snacc-v001.testnet`. A deposit-bearing action → cannot be signless.
3. Opening a session: SessionKeyManager.createSession({ accountId, registrar }) creates a local ed25519 keypair
   and registers it via AddKey (a restricted function-call key: the receiver
   snacc-v001.testnet, the methods = SIGNLESS_METHODS, a default allowance of 0.25 NEAR). AddKey
   is signed by the player's wallet, so this is one extra wallet approval, once per session
   (wallets that support multiple transactions in one approval could merge it
   with step 2 — not yet tested).
4. After that the DAILY SIGNLESS LOOP: feed_strain, allocate_atp, splice_strains, divide_strain,
   claim_industrial_dividend, … called via SessionKeyManager.call(...) / asTransport(...)
   without popups. Gas is cut from that key's allowance.
5. The session runs out / is revoked (the status `allowance_low`, `exhausted`, `revoked`) → the player opens a new
   session (step 3). Every subsequent deposit-bearing action (e.g. extract_spores, ft_transfer)
   still pops the wallet.
```

What is **not** claimed: "hatching without a NEAR balance", "hatching without a wallet", or "the whole game
without popups". Hatching and the production chain (`extract_spores` → `transmute_spores_to_enzyme` →
`synthesize_elixir`) carry deposits and still need the wallet.

## 3. The status (SDK part as of 2026-11-08, frontend part updated 2026-11-14; honest)

- SDK: `SessionKeyManager` (`createSession`, `call`, `asTransport`, `status`, `revoke`, `forget`),
  `fullAccessRegistrar` (for tests/backend), `KeyRegistrar` (the interface for wallets) — present in
  `sdk:src/session-key.ts` with unit tests (the RPC is mocked). Sessions on a real testnet account
  through a wallet have not been tested end-to-end in a browser.
- Contract: `incubate_strain` `#[payable]` — indeed deposit-bearing; unchanged.
- The spike `scripts/nep611-spike.mjs` (adding a restricted function-call key to a new testnet account then
  checking the access key on chain) only tests the AddKey step. Its result file is not committed
  in `evidence/`, so no claim leans on it. The method list in that spike
  (`incubate_strain`, `feed_strain`) comes from the early draft; `incubate_strain` cannot
  be called through that key because it is deposit-bearing.
- Frontend (updated 2026-11-14): the app has its own **one-tap play** (opt-in, Settings → One-tap play; frontend PR #32, merged 2026-11-13 and present in the production build at snacc-nu.vercel.app). It is a separate implementation in `frontend` (`src/chain/oneTap.ts`, `oneTapKeys.ts`, `oneTapSession.ts`); it does **not** use the SDK's `SessionKeyManager`. What it does:
  - The wallet adds ONE function-call access key to the player's own account: receiver `snacc-v001.testnet`, gas allowance 0.25 NEAR, and only the 8 deposit-free game methods the app sends: `allocate_atp`, `claim_industrial_dividend`, `divide_strain`, `feed_strain`, `harvest_starving_strain`, `npc_buy_spores`, `splice_strains`, `synthesize_and_redeem_aether` (`ONE_TAP_METHODS`, derived from `CONTRACT_METHOD_DEPOSIT`). This is a subset of the SDK's `SIGNLESS_METHODS` in §1.
  - Those transactions are signed in the browser with Web Crypto. The private key is a non-extractable key in IndexedDB, with a localStorage fallback only when IndexedDB cannot hold one. It is never sent anywhere.
  - Every action that attaches NEAR stays in the wallet: hatch (`incubate_strain`), `storage_deposit`, the catalyst fees (`extract_spores`, `transmute_spores_to_enzyme`, `synthesize_elixir`), the NEP-141/NEP-171 transfers and all market calls. So do `adopt` and `hostile_takeover_splice`: they attach no NEAR, but they pay another player, so a script on the site must not be able to run them with a popup-free key. In §1's table these two are listed under the SDK's deposit-0 methods; the app deliberately keeps them in the wallet.
  - If one-tap cannot be used (no key, key gone from the account, too little allowance, RPC unreachable, transaction invalid), the action falls back to one wallet popup. Once a broadcast may have reached the network, the app reports "not confirmed" with the locally computed hash and does not ask the wallet again, so an action is never sent twice.
  - The player's own account pays the gas, capped by the key's allowance. There is no relayer and no gas station; hatching without any NEAR is the post-hackathon plan in §5, not built.
  - **Not verified:** the covering tests use a fake RPC and a fake wallet. No one-tap transaction has been sent on testnet yet, and no real wallet has been seen accepting the `AddKey`.
- `@near-relay/sdk` / `near-relay`: present in the registry but empty/stale — not used.
- Keypom: the v2 contract is live on testnet (`v2.keypom.testnet`, RPC-verified) — a drop-based option,
  the spike `scripts/keypom-drop-spike.mjs` (RES-110; the drop is not yet used in the demo).

## 4. Fallbacks and limitations

- Without a session key, every action still works through the wallet (the path proven in the gladi:
  `evidence/gladi-manifest.json`). Signless = a convenience upgrade for deposit-0 actions, not
  a dependency.
- The session key is stored locally on the player's device (the storage is injected: memory or a
  `localStorage`-like object). Anyone holding that key can call the deposit-0 methods
  while the allowance lasts; that is why the allowance is bounded and the session can be revoked (`revoke` →
  DeleteKey).

## 5. The post-hackathon plan (NOT claims, no code)

If you want to hatch without a popup and without the player bearing the deposit/gas, you need one of:

1. **A relayer / meta-transaction** — the player signs an off-chain *intent*, the relayer wraps
   the tx with a relayer account as the signer and pays the gas + deposit. Requires an endpoint
   (e.g. `POST /api/onboard`), rate limiting, and anti-sybil.
2. **A gas-station / prepaid on-chain** — the contract accepts actions from registered accounts with
   a pre-deposited deposit (`prepaid_for`). This is a contract change and needs a separate decision (the V-04 invariant: the stake stays the source of supply).
3. **Keypom-based drops** — the spike `scripts/keypom-drop-spike.mjs` (no player flow yet).

None of the three exists today. Until one is built and proven with a testnet hash,
the §2 flow is the only one claimed.
