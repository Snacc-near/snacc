# Snacc — Architecture

> A technical architecture summary of Snacc for judges & contributors. Source of design truth: the `snacc-vault` vault (private). Numbers follow the **Kamus Angka Resmi** (`snacc-vault/04 Arsitektur/Snacc - Model Data.md`). The implementation status follows Backlog Master — this document distinguishes what **already exists in code** vs **planned in the spec**.

## 1. Polyrepo (the GitHub org `Snacc-near`)

| Repo | Module | Contents | Status |
| --- | --- | --- | --- |
| [`snacc`](../README.md) (umbrella) | — | README, docs, demo orchestration | active |
| [`contracts`](https://github.com/Snacc-near/contracts) | `M1` + `M2` | The `snacc-v001.testnet` Rust contract (`near-sdk =5.29.1`, `rustc 1.99.1`) — all mechanics | `VC-001..006` merged, 53 tests |
| [`oracle-tee`](https://github.com/Snacc-near/oracle-tee) | `M3` | The TEE client + the ed25519 verifier + deterministic local redaction (Layer 1, `ADR-05`); the `/v1/privacy/redact` cloud call is attempted with *graceful fallback* — that endpoint 404s for `glm-5.3-flash` (Spike S2.2), so Layer 2 never runs on this model | `TEE-101..104` merged, 14 tests |
| [`sdk`](https://github.com/Snacc-near/sdk) | `M4` | `lab-sdk`: the NEP-297 event parser; `SnaccClient` + Function Call Keys to follow | `SDK-107..108` merged, 15 tests |
| [`backend`](https://github.com/Snacc-near/backend) | `M5` | The `NEP-297` indexer + the `/api/crucible/*` API; `supabase/`: player-profile migrations and Edge Functions (`near-auth`, `record-tx`, `notify-scan`, `starter-pack`, `track`, `chain-index`, `push`, `push-dispatch`) | scaffold (`INT-101..108` in progress); the `supabase/` part is deployed (starter pack not enabled: no faucet secret yet; account deletion migration not applied) |
| [`frontend`](https://github.com/Snacc-near/frontend) | `M6` | the landing page and the cell-cultivation game UI: isometric Colony Plate arena + Cell Lab bio-reactor (12 mechanism animations), keycap HUD, demo/live modes, NEAR wallet login (NEAR Connect, optional Privy email login) and signed testnet game actions | deployed at https://snacc-nu.vercel.app (game at `/app`); payloads of hatch, feed, allocate ATP and divide proven on chain (CLI-signed, README "On-chain proof"); UI wallet flow not yet exercised on chain; profile features live (Supabase, off-chain); opt-in one-tap play and a Market window (`snacc-market.testnet`) in the build, neither tried with a real wallet |
| [`scripts`](https://github.com/Snacc-near/scripts) | `M7` | `verify:thesis`, `demo:replay`, `gladi:retry`, economic simulations | active |

## 2. The four mechanism layers

| Layer | Name | Function | Module |
| --- | --- | --- | --- |
| 1 | **Living NFT** | A balance-sheet organism: the `s-<id>.snacc-v001.testnet` sub-account, vitality & BMR (lazy evaluation, `ADR-22`), a living `NEP-177` SVG | `M1`, `M2` |
| 2 | **Supply chain & corporates** | The 3-stage `NEP-245` transmutation (`mt_burn` → `mt_mint` × `efficiency_bps`), the Coasean role bitmask (`ADR-25`), mergers `splice_strains` + `hostile_takeover_splice` (`ADR-26`), liquidation `harvest_starving_strain`, a multi-cell colony under population fences | `M1` |
| 3 | **Secret genome (TEE)** | The mutation formula is evaluated by `z-ai/glm-5.3-flash` inside the NEAR AI Cloud enclave; the contract verifies it itself: `env::sha256` reconstruction + `env::ed25519_verify` + `chat_id` anti-replay + a ±1500 bps guardrail (`ADR-21`, `I-03`, `I-06`, `I-07`, `I-16`) | `M1`, `M3` |
| 4 | **Macro central bank** | The `CrucibleTemp` thermostat: Fever `>610 mK` → burns 350 bps of the fee; Hypothermia `<600 mK` → a 200 bps subsidy from the treasury, capped at 500 bps/epoch (`I-04`); the Industrial Dividend Pool takes 50% of the non-burned fee | `M1`, `M5` |

**Spec ↔ code mapping (rescue vs adoption — backlog `EN-123`):** the spec's `snack(target_id)` — finishing a dying cell — has **no method named `snack`** in the code; the F6 lysis path is the method `harvest_starving_strain` (`contracts:snacc/src/lib.rs`), callable by anyone once effective vitality is 0 (10% bounty to the caller, 90% to the treasury). The spec's `adopt(target_id)` is the method named exactly `adopt` (`contracts:snacc/src/lib.rs`) — **not** `adopt_strain` — and takes over a Distressed cell (vitality 1..=2000) at book value, preventing lysis. The two windows are disjoint by design, so at every state exactly one path applies (adoption in 1..=2000, harvest at 0); the race behavior is pinned by the regression tests `sec118_race_adopt_vs_harvest_windows_disjoint` and `sec118_race_adopt_vs_adopt_stale_nonce_single_winner`. See [nep-compliance.md](nep-compliance.md) for the standards checklist.

## 3. The main data flows

```
Alkemis (E1) --Function Call Keys (opt-in one-tap, deposit-free actions only)--> frontend (M6)
    --call--> snacc-v001.testnet (M1: state D1-D8, event NEP-297 -> D9)
    --Stage 1 redaction--> oracle-tee (M3) --POST /v1/chat/completions--> NEAR AI Cloud TEE (E3)
    <--{chat_id, signature ed25519}--  E3
    --apply_tee_mutation_zero_trust--> M1 (on-chain verification, guardrail)
backend (M5): poll block/event NEP-297 -> /api/crucible/* -> M6 & M7
scripts (M7): verify:thesis (RPC benchmark) + demo:replay (offline, 0 API key)
```

## 4. Key design decisions (ADR)

33 ADRs are documented in the vault; the ones that most shape the code:

- `ADR-04/27` — the `CrucibleTemp = floor(1000 × V_decayed / max(supply, 1))` formula with lazy decay (`VOLUME_DECAY_PER_SEC = 50`), cron-free.
- `ADR-21/33` — the 2-phase zero-trust TEE verification + a rotatable `attested_tee_signers` registry.
- `ADR-25/26` — the Coasean role bitmask (`1=Extractor`, `2=Fermenter`, `4=Synthesizer`); multi-bit only through mergers; a 3-rung solvency ladder.
- `ADR-29` — the anti-drain `state_nonce` + `pending_callbacks == 0` (prevents ERC-6551 seller front-running).
- `ADR-30/31` — 3 autonomous on-chain NPCs + a dual-skin UI (FinTech/Bio-Lab).

See also: [security.md](security.md) · [api-schemas.md](api-schemas.md) · [events.md](events.md) · [partner-onboarding.md](partner-onboarding.md)
