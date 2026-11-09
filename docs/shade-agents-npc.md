# RES-118 — Shade Agents Architecture for ADR-30 NPCs (Research)

**Status:** research only — nothing in this document is implemented in Snacc.
**Item:** RES-118 · 2026-11-08.
**Scope:** how NEAR *Shade Agents* would map onto the three autonomous Alchemist NPCs (`ADR-30`), compared with our current design. All external links below were checked with `curl` on 2026-11-08 (HTTP status noted).

## 1. What Shade Agents are (public sources)

From the NEAR blog post *"Shade Agents: The First Truly Autonomous AI Agents"*
(<https://www.near.org/blog/shade-agents-the-first-truly-autonomous-ai-agents> — **200**):

- Shade Agents are **multichain AI-powered smart contracts**, verified on-chain, designed to remove single points of failure.
- Two components per agent:
  1. **Worker agent** — an off-chain component running **inside a TEE**; can query data sources, call AI models, and propose transactions on any chain.
  2. **Smart contract** — stores the **expected code hash** of the worker agent.
- **Registration flow:** anyone can run a worker agent by deploying the correct codebase into a TEE, generating a keypair, and submitting a **remote-attestation proof** to the contract; the contract verifies the TEE signature and compares the code hash against the stored expectation. Only then may the worker propose transactions.
- **Key management** uses NEAR **Chain Signatures**; a decentralized group of worker agents can collectively control one key, so there is no single custodial key server.

**Maintenance status (important, checked 2026-11-08):** the Shade Agent **Framework** is **deprecated as standalone developer tooling after 2026-04-19**. The official docs page
<https://docs.near.org/ai/shade-agents/getting-started/introduction> (**200**) states documentation moved to the monorepo
<https://github.com/NearDeFi/shade-agent-framework/tree/main/docs> (raw README of that repo: **200**; the github.com HTML page itself returned 504 from our network during checks — flaky, not proof of removal). Anyone adopting it must self-maintain.

## 2. How it would map onto ADR-30 (design mapping — NOT implemented)

Current Snacc design (`ADR-30`, `I-15`): three on-chain NPCs (`npc-extractor`, `npc-central-arb`, `npc-vulture-ma`) whose **pricing rules live 100% in the Rust contract** (`npc_quote_spores`, `npc_buy_spores`), with reasoning tooltips produced through **NEAR AI Cloud TEE** off-chain and evidence verified by `env::ed25519_verify` (see `docs/security.md`, `ADR-21/30/33`).

Mapping if we ever adopted Shade Agents:

```
                 ┌──────────────────────────────────────────────┐
                 │  Shade Agent smart contract (NEAR)           │
                 │  - stores expected worker code hash          │
                 │  - verifies TEE remote attestation proofs    │
                 │  - Chain Signatures key for the agent        │
                 └───────────────▲───────────────┬──────────────┘
                                 │ attest        │ propose tx (quote / buy)
                 ┌───────────────┴───────────────▼──────────────┐
                 │  Worker agent in TEE (off-chain)             │
                 │  - runs NPC pricing reasoning                │
                 │  - reads market data, calls an LLM           │
                 └──────────────────────────────────────────────┘

Snacc today (ADR-30, no Shade):
  NEAR AI Cloud TEE  ──signed reasoning──►  off-chain backend  ──►  anyone verifies
                                                                    ed25519 on-chain
  pricing math itself: IN the Rust contract (npc_quote_spores) — no off-chain price server
```

| Aspect | Shade Agents | Snacc `ADR-30` today |
|---|---|---|
| Price rules | wherever the worker code puts them (off-chain code, hash-pinned) | **in-contract**, enforced by `I-15` conservation |
| Worker trust | TEE attestation + code hash registered on-chain | NEAR AI Cloud TEE bundle + `ADR-33` signer rotation, verified by `ed25519_verify` |
| Key custody | Chain Signatures (multi-party) | contract holds reserves; TEE only signs evidence payloads |
| Maintenance | framework deprecated 2026-04-19, self-maintained | our own code |

**Honest conclusion:** Shade Agents would mainly buy us *off-chain* autonomy with attested code. Our current design deliberately keeps the economic rules on-chain (the architectural claim we make against off-chain pricing in `ADR-30`), so adopting Shade Agents for pricing would **weaken** that claim. Plausible future use: Shade-style attested workers for *proposing* optional market data to the NPC oracle path — a research item only, blocked on the framework being self-maintained.

## 3. Links checked (curl, 2026-11-08)

| URL | HTTP | Note |
|---|---|---|
| <https://www.near.org/blog/shade-agents-the-first-truly-autonomous-ai-agents> | 200 | architecture source |
| <https://docs.near.org/ai/shade-agents/getting-started/introduction> | 200 | deprecation notice + monorepo link |
| <https://github.com/NearDeFi/shade-agent-framework/tree/main/docs> | 000/504 from our network | raw `README.md` of `main` → **200**; page fetch flaky |
| <https://docs.near.org/llms.txt> | 200 | docs index; no other Shade section |

**Not claimed:** no integration, no PoC, no dependency added to any Snacc package.
