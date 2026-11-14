# Snacc — NEAR Hackathon submission notes

Status (2026-11-14): evidence pack written; the frontend is deployed at https://snacc-nu.vercel.app (NEAR testnet only; game at `/app`); the demo video and the submission form are still pending (see `docs/evidence-pack.md` §7). The player-profile part (Supabase: eight Edge Functions plus the database) is deployed; the starter pack and account deletion are not active yet (see the README table "What's in the app").

- **Project:** Snacc (`$SNACC`) — *a memecoin with a metabolism.* NFTs that eat a memecoin: feed your Snacc or it gets snacked. The README maps eleven laws of cell biology to contract methods and constants, each with a testnet transaction where one exists.
- **Tracks:** `memecoins` + `nfts`. Other tracks are listed in the evidence pack only where a testnet tx hash or a view call backs them.
- **Window:** 1–14 Nov 2026 · **Org:** `Snacc-near` · **License:** MIT
- **Contract (testnet):** `snacc-v001.testnet` — one Rust contract (`near-sdk 5.29.1`). Nothing is deployed on mainnet. `code_hash` read on 2026-11-14: `4m2z2PiZTa1mSG5A8cnr5b9fxDWY4n3HiPGzcP7EtwiH` (code upgrade of 2026-11-13).
- **Verify each claim yourself:** [`docs/evidence-pack.md`](docs/evidence-pack.md) — claim → tx hash or view call → exact command → status, per track, plus a "Not yet proven live" section.
- **Committed evidence:** `evidence/gladi-manifest.json` (51 hashed testnet txs from the GLADI-8 rehearsal run of 2026-11-09), `evidence/gladi-kpi.md` (KPI auto-check output: 22 PASS · 0 FAIL · 0 not run, with its own claim limits), `evidence/tee-vector-live.json` (a NEAR AI Cloud response with its `ed25519` signature, re-verifiable offline; its chat id `d1979ce2…` is **not** the one in the on-chain apply `B8xdaukd…`, which carries `14a1b709…`), `evidence/snacc.wasm` (the **GLADI-8** build, `code_hash` `DMRgsiLJ…`, deployed on 2026-11-09; it is **not** the code deployed now, because the contract was upgraded on 2026-11-13).
- **NEP-245:** internal inventory data model only — there is no public `mt_*` interface and no compliance claim.
- **Claim limits:** "22 of 22" covers implemented mechanics only. Aging and the epoch gate ran on a sandbox clock (`advance_sandbox_clock`), the dividend ran for one epoch with one contributor, the thermostat firing used a fee the contract paid to itself, and no external player has played. Details: README [Claim limits](README.md#claim-limits-read-before-the-numbers).
- **Disclosure:** the sibling project's test account `x207-demo-buyer.testnet` was the second account in the rehearsal (hostile takeover, a hatch, a Keypom drop spike, four rejected non-owner calls, receiver of `nft_transfer`). Everything else was signed by `snacc-v001.testnet`. See README [Disclosure](README.md#disclosure-accounts-used-in-the-rehearsal).
- **TEE:** the contract verifies an `ed25519` signature and recomputes the request hash on chain. Enclave attestation is **not yet verified**, and the result is **not private** (the apply call carries the response body in public arguments; Layer-2 cloud redaction does not run, `/v1/privacy/redact` answers 404). See README [TEE section](README.md#tee-what-the-chain-and-the-vector-file-each-hold).
- **On-chain SVG:** live images are 448–482 B (a plain telemetry card); 1,734 B is the budget, not the live size. The "84.42% cheaper" figure in `verify:thesis` F-01 is computed against an assumed baseline of 11,129 B.

## Judge quickstart (Node.js 22+, no key, no `npm install`)

```bash
git clone https://github.com/Snacc-near/snacc.git && cd snacc
git clone https://github.com/Snacc-near/scripts.git scripts   # scripts/ is a separate repo
npm run demo:replay     # offline replay of the committed rehearsal tx
npm run verify:thesis   # falsifiers F-01..F-03 (F-01/F-02 read public RPCs, F-03 is offline)
```

Both commands read only files under `evidence/` and public RPCs.

## Frontend (deployed: https://snacc-nu.vercel.app)

The frontend is a landing page plus a cell-cultivation game (isometric Colony
Plate arena + Cell Lab bio-reactor) on NEAR testnet. Open the game at
https://snacc-nu.vercel.app/app:

- **No wallet:** the landing page `/` reads live testnet data (read-only). The game opens in `demo · simulated` (a local simulation, not the chain) by default; a `live testnet` toggle reads from `snacc-v001.testnet`.
- **With a NEAR testnet wallet (NEAR Connect) or email or social login (Privy):** signed game actions: hatch, feed, allocate ATP, divide, splice, extract / transmute / synthesize, buy spores, adopt / takeover / harvest, claim dividend, redeem aether, gift a Snacc, send `$SNACC`. A new account needs testnet NEAR from the [NEAR testnet faucet](https://docs.near.org/getting-started/faucet).
- **On-chain proof, stated exactly:** the payloads the UI builds for hatch, feed, allocate ATP and divide were accepted by `snacc-v001.testnet` (four hashes in the README table "On-chain proof"), signed with the CLI, not through the UI wallet flow. The UI wallet flow itself has not been exercised on chain yet.
- **Player profiles and social features (Supabase, `backend` repo `supabase/`) are live in the production build:** profiles with usernames, "Save progress" NEAR sign-in (NEP-413), achievements, feed streaks, in-app notifications, daily quests with XP and levels, weekly leaderboard seasons with a hall of fame, Snacc lineage and feed history, a graveyard, share previews, invite links, an "about to be snacked" alert, opt-in Web Push, name moderation, announcements, privacy-respecting telemetry and a "Download my data" export. All of it is off-chain data, not on-chain evidence.
- **One-tap play (opt-in, Settings):** one wallet approval adds a restricted function-call key; the 8 deposit-free game actions then go out without a popup. Hatching and every action that attaches NEAR (and `adopt` / `hostile_takeover_splice`, which pay another player) stay in the wallet. **Not verified:** no one-tap transaction has been sent on testnet, no real wallet has been seen accepting the key, and real push delivery to a device is unverified.
- **Market window** for the testnet marketplace contract `snacc-market.testnet`: the contract was exercised on chain with CLI-signed transactions (README table "On-chain proof: the market contract"); the market from the UI with a real wallet is not verified.
- **Not active yet:** the testnet starter pack (its faucet account secret is not configured, the function answers `not_configured`), the optional Turnstile check on it, and account deletion (its database migration is not applied).

Run it locally:

```bash
git clone https://github.com/Snacc-near/frontend.git frontend && cd frontend
cp .env.example .env.local   # all variables optional; empty VITE_API_BASE = simulated demo mode only
npm ci && npm run dev
```

See the `Snacc-near/frontend` README for routes, environment variables, the
source layout, the organelle → contract-method map, and the 60-second
walkthrough in `docs/quickstart.md` here.

## Honesty notes

- `$SNACC` on testnet has no monetary value. Volatility is a game mechanic, not a promise of returns.
- Simulation results in `docs/econ-*.md` are simulations, not live evidence.
- A claim without a testnet tx hash or a reproducible view call is not claimed as live.
- "Passes a check" is not "the product is done": the KPI table counts implemented mechanics, and product completeness is tracked separately in the team's backlog. Not yet: mainnet, a DEX listing, enclave attestation, natural-time operation, multi-epoch dividends, any external player, and a transaction signed through the UI wallet flow. See README ["Not yet"](README.md#not-yet).
