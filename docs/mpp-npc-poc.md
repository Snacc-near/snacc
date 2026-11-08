# RES-119 — Machine Payments Protocol (MPP) for Snacc NPCs: Research + Testnet PoC Plan

**Status:** research + plan. **No MPP code exists in this repository** (verified by search 2026-11-08).
**Item:** RES-119 · 2026-11-08.
**Honesty:** any PoC below is a *plan*; `$SNACC` testnet has no monetary value, and no payment flow
has been executed on-chain for this idea.

## 1. What MPP is (public sources, curl-checked 2026-11-08)

- **Machine Payments Protocol (MPP)** — an open protocol co-authored by **Tempo and Stripe** that
  lets a client (agent, app, or human) **pay for a service inside the same HTTP request** using
  status **402 Payment Required**. Source: <https://mpp.dev/overview> (**200**).
- Flow (from MPP overview + Tempo docs <https://tempo.xyz/developers/docs/guide/machine-payments> —
  **200**):

  ```
  Client ──► Server:  GET /resource
  Server ──► Client:  402 + WWW-Authenticate: Payment  (challenge: price, currency, recipient…)
  Client:            authorizes payment (credential)
  Client ──► Server:  retry + Authorization: Payment
  Server ──► Client:  resource + Payment-Receipt
  ```
- SDK/runtime surface exists: <https://machinepayments.dev/> (**200**) publishes `Intent.charge`
  (one-time), `Intent.session` (pay-as-you-go), transports (HTTP, MCP) and middleware for
  Express/Hono/Next.
- NEAR-specific settlement: **`nearintents` MPP method** by defuse —
  <https://github.com/defuse-protocol/nearintents-mpp-sdk> settles cross-chain HTTP 402 payments via
  NEAR Intents (client pays on its origin chain, merchant receives an exact amount on theirs).
  Raw HTML fetch of github.com was flaky (504) from our network on 2026-11-08 — **repo existence
  confirmed via search index, not re-verified by us; treat as unverified link until re-checked.**

## 2. Where MPP could touch Snacc (mapping — options, not commitments)

| Option | Description | Fit |
|---|---|---|
| A. Charge for the **reasoning endpoint** | The off-chain service that produces NPC reasoning tooltips (`ADR-30`) answers only paid 402 requests | plausible; today the endpoint is free and evidence is verified on-chain anyway |
| B. NPC as an **MPP merchant** for spore quotes | `npc_quote_spores` is an on-chain view — **no HTTP surface to charge**; MPP does not apply to contract views | poor fit for on-chain pricing (we deliberately keep pricing in-contract) |
| C. **Agent-to-agent** payments between NPC wallets post-`ADR-30` | future autonomous agents paying each other over HTTP | research only; would need an off-chain transport our contract does not have |

Fit assessment (honest): MPP monetizes **HTTP APIs**, while Snacc's economic surface is **on-chain
contract calls** (gas, not 402). The only realistic near-term use is **Option A** (metering our own
backend's paid tier), which is a product decision, not a hackathon requirement.

## 3. Planned testnet PoC (NOT started)

Goal: prove the 402 loop end-to-end with a Snacc-flavored resource — **no production code paths**.

1. **Server:** small local HTTP service exposing a read-only snapshot resource
   (`GET /npc-quote-reasoning`) with MPP middleware (`machinepayments` / `mppx`), configured with a
   fixed testnet price (e.g. 0.05 NEAR-equivalent testnet credit — amount arbitrary, testnet only).
2. **Client:** script issues unpaid request → receives 402 challenge → pays → retries → validates
   `Payment-Receipt`.
3. **Settlement choice (to decide during PoC):**
   - *mock rail:* in-memory ledger — proves protocol mechanics only;
   - *real testnet rail:* if the `nearintents` method supports testnet, settle a testnet NEAR
     transfer; **support unverified** — must be checked against the SDK before promising this.
4. **Success criteria:** receipt verifies against challenge; replaying the same credential fails;
   resource bytes are identical with and without MPP (payment gates access, not content).
5. **Non-goals:** mainnet payments, `$SNACC`-denominated prices, changes to `npc_buy_spores`.

## 4. Honest status

- Researched: yes (links above, checked 2026-11-08 except the noted GitHub flake).
- Implemented: **nothing**. No dependency added, no server, no transaction.
- Open questions: testnet availability of the NEAR settlement method; who would pay for what in a
  demo (our demo does not need paid HTTP).
