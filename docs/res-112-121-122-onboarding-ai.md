# RES-112, RES-121, RES-122 — Onboarding, Recipe Search & Identity Options

**Scope.** What the `frontend` honestly ships for onboarding, recipe search and 1Click quoting, what is only planned, and why. Everything runs against **NEAR testnet** (`snacc-v001.testnet`); there is no mainnet deployment.

**Honesty notes**
- `$SNACC` on testnet has no monetary value. Volatility is an on-chain game mechanic, not a promise of return.
- Offline and demo paths never fabricate transaction hashes. A feature with no live evidence is labelled as local, planned or not verified below.
- Wording rule: Snacc is an on-chain economic game; this page uses no financial-product language.

## At a glance

| Item | What ships | What does **not** ship (yet) |
| --- | --- | --- |
| RES-112 sign-in | **Guest label — local only.** A name stored in the browser. No on-chain account is created, nothing is signed, no key leaves the browser. | `near.email` / Auth0 login: **planned, not wired.** No 1Click or Defuse account endpoint is called. |
| RES-121 recipe search | **Local recipe search (keyword)**, no LLM call and no network request. | No Qwen (or other model) connector, no API key, no embedding service. |
| RES-122 identity options | A written comparison (§3). | No `near.email` / Auth0 integration. |
| 1Click | **Quote preview** via the public 1Click `/v0/quote` dry-run. If the API requires a key, the UI says so instead of failing silently. | No swap execution, no deposit address handling, no `defuse` endpoint. A dry-run quote moves no funds and is not a transaction. |

## 1. RES-112 — Onboarding: guest label

### Problem
Web3 onboarding loses people at wallet installation, seed phrase handling and gas funding. For a judge opening the demo, the first screen should not require any of that.

### What ships
- A **guest label**: the user types (or accepts) a display name. It is kept in browser storage (`localStorage`) and used only to label the UI session.
- It is **not an account**. No `.testnet` account is created or implied by the label, no key pair is registered, no message is signed and no request is sent to any identity service.
- On-chain actions still need a real testnet wallet or the rehearsal accounts. The UI does not pretend otherwise.

### Planned, not wired
- `near.email` and Auth0 (social / email) logins would give a real account with recoverable access. They need a relayer or tenant configuration that is outside this hackathon's scope, and **nothing in the current build calls them**. See §3.

### Evaluation
- A label gives zero-friction browsing but zero security properties. It must never be described as authentication.
- Because nothing leaves the browser, the demo works offline and with no keys, in line with the keyless judging path (`npm run demo:replay`).

## 2. RES-121 — Recipe search: local keyword search

### Problem
The supply chain has three spore, enzyme and elixir tiers plus organelle allocation and two thermostat regimes (FEVER above `610 mK` burns part of the catalyst fee; Hypothermia below `600 mK` pays a bounded rebate). Players searching for "how to survive fever" or "redeem industrial dividend" cannot easily find the right multi-step recipe.

### What ships
- **Local recipe search (keyword).** The query is matched in the browser against a fixed list of recipes (title, tags, steps). Results show the recipe steps and the contract method names to call (copied from the contract, for example `synthesize_elixir`).
- **No LLM call.** There is no model, embedding service, API key or network request, so results are instant, deterministic and identical offline.
- Both display skins (Bio-Lab and FinTech labels) use the same recipe data.

### Not shipped
- A semantic or LLM-backed search (for example a Qwen connector). It was considered and **not built**: it would need a key that offline judges do not have, and it adds latency and an external dependency to the HUD. If added later it should be an optional layer over the local search.

## 3. RES-122 — Identity options considered

| Option | What it gives | Status in this build |
| --- | --- | --- |
| Guest label (local) | Zero-friction browsing | **Shipped** (§1); not an account |
| `near.email` (email login with passkey-based recovery) | A real NEAR account without a seed phrase | **Planned, not wired** |
| Auth0 / social login | Familiar Web2 sign-in mapped to an account | **Planned, not wired** |
| Standard NEAR wallet | Full self-custody; signs transactions | Used for real on-chain actions, outside this page's scope |

Why `near.email` and Auth0 are not wired: both require a relayer or tenant setup and cross-origin redirects that break sandboxed and headless runs. They are post-hackathon work (see [roadmap-post-hackathon.md](roadmap-post-hackathon.md)).

## 4. 1Click quote preview

### What ships
- The frontend asks the public 1Click quote endpoint (`POST /v0/quote`) with the **dry-run** flag set, and shows the returned quote (amounts, fee, estimated time) as a **preview**.
- A dry-run returns a quote only. It does not create a deposit address that is acted on, does not move funds and produces no transaction hash. The UI labels it "quote preview".
- If the API answers that it needs an authentication key, or is unreachable, the UI **says so** (for example "the 1Click API requires a key") and shows no quote. It does not substitute a made-up number.

### Not shipped
- Swap execution, deposit handling and status polling.
- Any `defuse` account or user endpoint.
- Any claim that Snacc is integrated with, listed on or endorsed by a DEX or intents network. The quote preview is a read-only convenience.

### Not verified
- The request/response shape follows the public 1Click documentation; it has **not** been replayed in the 2026-11-09 rehearsal, and there is no tx hash for it.

## 5. Verification

- Unit tests for these features live in the `frontend` repo (`npm run test`, vitest). Run them yourself; this page does not quote a test count.
- The honest-labelling points above (guest label is local, search makes no network request, quote is a dry-run preview) are the behaviours to check in the UI.
