# Snacc — Partner Onboarding Summary

**Snacc ($SNACC): NFTs that eat a memecoin. Feed your Snacc or it gets snacked.**

*This document is standalone — everything you need to understand Snacc end-to-end is here, with no references to other documents. Last updated: November 7, 2026.*

---

## 1. Executive summary

Snacc is an **on-chain economy game on NEAR** where every NFT is not a dead picture but a **living organism with a stomach, a metabolism, and its own balance sheet**. Every organism (a *Homunculus Strain*) **must eat the `$SNACC` memecoin** to stay alive. If its owner neglects it, the Strain can be **taken over by a rival while it starves**, or **harvested by anyone once it faints** — and its death actually feeds the whole ecosystem.

Behind it runs a full engine: an **algorithmic central bank** that manages the `$SNACC` supply automatically, a **3-stage multi-token supply chain**, **on-chain NFT-to-NFT M&A**, and **the verification of secret AI decisions in the NEAR AI Cloud TEE (Trusted Execution Environment) checked directly by the smart contract** — no admin, no committee, nobody who can rig the system, including its own creators.

One-line summary: *"Autonomous balance-sheet NFTs living on top of a memecoin with an algorithmic central bank — the rules are math, not operators."*

---

## 2. The problems it solves

Based on case studies of collapsed on-chain game tokens and first-generation memecoins (e.g. a game token that fell >99% within weeks):

1. **Memecoins & game tokens die because there is no automatic central bank.** When activity surges, the supply explodes with no proportional burn mechanism; when activity quiets, there is no stimulus. The result: hyperinflation then a death spiral.
2. **NFTs have been "dead JPEGs"** — passive ownership markers. An NFT cannot hold its own cash, has no cost of living, cannot acquire other NFTs, cannot go bankrupt.
3. **On-chain strategies/recipes always leak.** As soon as a winning formula exists, every transaction parameter is visible in the explorer and copied by bots within one block.
4. **Wallet-popup friction kills the game loop.** Signing repeated transactions makes an economy game unplayable smoothly.

Snacc answers all four: an automatic monetary thermostat, a balance-sheet NFT, secret recipe execution in the TEE, and popup-free play sessions (*signless*).

---

## 3. What exactly is the product?

Every **Homunculus Strain** is an NFT (`NEP-171`) with:

- **Its own NEAR sub-account** (`s-<id>.snacc-v001.near`) — a sovereign balance sheet holding the `$SNACC` cash and the molecule inventory.
- **Vitality & BMR (Basal Metabolic Rate)** — vitality decays in real time. Not fed → vitality 0 → faints/dies. That is the "must eat".
- **A production specialization (role bitmask)**: `Extractor` (the raw-material producer), `Fermenter` (the refiner), or `Synthesizer` (the final-product maker). Combining all three (`0b111`) is only possible through **M&A** — this is the core of the economics: vertical integration through mergers, not solo farming.
- **A multi-cell colony (`EN-08`)** — one alchemist can split a Strain (`divide_strain` → a child NFT that inherits the genome & organelles), adopt (`adopt`) or harvest (`snack`) a distressed Strain owned by someone else. Natural population fences: `MAX_COLONY_SIZE = 5`, `MAX_GENERATION = 8`, and `births ≤ merges + lyses` — the population only grows through work (mergers) and death (lyses), not minting.
- **Live visual metadata (`NEP-177`)** — an SVG with 8 indicators (a heartbeat, balance, energy, organelles, the economic temperature, the zone, the colony, the bounty) rendered directly from contract state (~1,734 bytes, 0 extra storage cost). The NFT "pulses" in real time.

### The 3-stage supply chain (9 `NEP-245` molecules)

`Raw Spores → Refined Enzymes → Philosopher Elixirs` — each stage **burns the input and mints the output** (`mt_burn` → `mt_mint`) with an efficiency produced from secret recipes. This is the "factory": players are supply-chain specialists who need each other.

### The 4 mechanism layers (a technical summary)

| Layer | Name | Function |
| --- | --- | --- |
| 1 | **Living NFT** | A balance-sheet organism, BMR, a sub-account, a live SVG |
| 2 | **Supply chain & corporates** | The 3-stage transmutation, the role bitmask, M&A (`splice_strains`), liquidation (`harvest_starving_strain`), a 3-rung solvency ladder |
| 3 | **Secret genome (TEE)** | The mutation formula is evaluated by AI inside the enclave; the contract verifies the result's authenticity itself |
| 4 | **Macro central bank** | The `CrucibleTemp` thermostat (burns 3.5% when hot / subsidizes 2% when cold) + the industrial dividend pool |

---

## 4. How to play (one epoch in a player's life)

1. **Popup-free onboarding** — sign in with a Function Call Access Key (a *signless* session) and incubate a new Strain: 80% of the deposit becomes Strain capital, 20% goes to the rule-bound treasury.
2. **Allocate energy (`$ATP`)** — once per epoch, the player splits internal energy across the 3 organel slots: **Mitochondria** (production rises), **Nucleus** (resilience), **Lysosome** (an effect at harvest time). *This is the player's main decision.*
3. **Transmute** — burn a lower-stage molecule → mint the higher stage × efficiency; every bit of work books `$ATP`.
4. **Feed (`feed`)** — pay a `$SNACC` fee; this is where the thermostat works: when the economy is in "Fever" part of the fee is automatically **burned**; during "Hypothermia" the treasury **subsidizes**.
5. **Execute secret recipes in the TEE** — compose a mutation formula → the AI evaluates it in a private enclave → the result is applied to `efficiency_bps` (a ±15% limit) after the contract verifies the enclave's digital signature.
6. **Social & PvP** — merge with your own Strains (voluntary), a **hostile takeover** of someone else's distressed Strain (pay the book value + 15%), `adopt` (rescue), or `snack` (harvest — a 10% bounty).
7. **Claim dividends** — burn the peak elixir (`mt:elixir-aether`) to receive a **pro-rata** share of 50% of the industrial fee each epoch. *This is the "earning loop": profit comes from work and redistribution, not a return promise.*
8. The epoch closes → a new zone, a Nutrient Burst event, a leaderboard, repeat.

Total: **±7 meaningful decisions per epoch** — not empty clicking.

---

## 5. The `$SNACC` economy — volatility as a feature

`$SNACC` **is not a stablecoin and does not peg to any price.** Only issuance & incentives are managed automatically. The market price stays fully volatile like any memecoin — and that is deliberate: the appeal of a memecoin is the gamble (*luck → a big win, misfortune → ruin*).

**Three volatility engines:**

| Engine | Rule | Effect |
| --- | --- | --- |
| **Calcination Fever** | The economic temperature > 1400 mK → every transaction burns 3.5% of the fee | The busier it gets → the supply shrinks → an upward scarcity spiral |
| **Hypothermia Rebate** | The temperature < 600 mK → a 2% subsidy from the treasury (capped at 5%/epoch) | A utility floor when activity is quiet — not a price floor |
| **Events** | Nutrient Burst, the Great Feast, takeover windows, dividend claims | ±7 betting moments per epoch |

**The luck-vs-ruin map** (examples): buying a cheap distressed Strain → lucky: it recovers + you catch the Nutrient Burst; ruin: a rival snacks it first. Burning an elixir for dividends → lucky: a large rate when there are few competitors; ruin: diluted when it is crowded. Betting on a Great Feast zone → a bonus when you time it right, swelling costs when you miss. Even **another player's death is your opportunity**: one Strain dies → 90% of its cash returns to the treasury and the whole ecosystem gets a **1-epoch feeding discount** ("one dies, everyone is fed").

What separates it from a junk memecoin: (1) its volatility has a **playable mechanical source**, not just pump-and-dump; (2) the system is **anti-death-spiral** (an algorithmic central bank), but **not anti-loss** — bad decisions are still punished; (3) every risk is **visible live** (the temperature meter, zones, countdowns); (4) there is no admin who can pull cash or change the rules silently.

> *The pitch to judges: "$SNACC is deliberately volatile — but the source of that volatility is mechanics you can read and play (the temperature meter, zones, countdowns), and nobody can change the rules, including us."*

**The honesty limits:** at this stage the test token has **no monetary value**; profit claims = work + redistribution, **no profit guarantee**; volatility is a feature, not a promise.

---

## 6. The memecoin mechanics in brief (11 mechanics)

1. A reactive supply (`CrucibleTemp` → a 3.5% burn / a 2% rebate) · 2. **Nutrient Burst** — death grants a global feeding discount · 3. **The Great Feast** — a community volume target per epoch (a "Goldilocks" bonus / the Fever-Famine zone, the top-3 contributors) · 4. **Rescue feeding** — the closer to death, the cheaper to feed (with the risk of being left to die) · 5. **A per-caste diet** — different discounts per specialization in extreme zones · 6. **Watchability** — an appetite meter + live events · 7. **`$ATP`** — internal non-transferable energy (not a token!) that makes the `$SNACC` supply genuinely felt · 8. **Organel slots** — an energy allocation per epoch · 9. **A multi-cell colony** — split yourself (`divide_strain`, child NFTs), adoption (`adopt`) vs harvest (`snack`), under natural population fences: `MAX_COLONY_SIZE = 5`, `MAX_GENERATION = 8`, `births ≤ merges + lyses` (not the old "the population only shrinks" version) · 10. **The Industrial Dividend Pool** — 50% of the non-burned fee is distributed pro-rata to elixir holders · 11. **Autonomous NPCs** — 3 on-chain AI merchants (*Pyre-X, Myco-7, Void-0*) that provide two-way liquidity at scarcity prices, so the economy stays alive 24/7 without dev patches.

---

## 7. Technology & integrations

**Built on NEAR, and only possible on NEAR:**

- **NEAR standards**: `NEP-141` (the `$SNACC` token + burn), `NEP-171` (NFT), `NEP-177` (dynamic SVG metadata), `NEP-245` (9 multi-token molecules), `NEP-297` (events), **Sub-Accounts** (a balance sheet per organism), **Function Call Access Keys** (popup-free play sessions), the native crypto host functions `env::ed25519_verify` + `env::sha256`.
- **NEAR AI Cloud TEE** (`cloud-api.near.ai`): the `z-ai/glm-5.3-flash` model runs in an Intel TDX enclave + an NVIDIA confidential GPU with a per-request hardware signature. **The 2-phase zero-trust mechanism**: (1) the request hash is committed on-chain before the AI speaks; (2) once the answer arrives, the contract **recomputes its hash itself inside the WASM**, verifies the enclave's 64-byte ed25519 signature, rejects replays, then parses the result on-chain with a ±15% guardrail. Meaning: **there is no oracle to trust** — even a malicious relayer cannot fake the AI result. Dual redaction (wallet identities removed, recipe dosages hidden behind a SHA-256 commitment) keeps the recipes secret.
- **Value-add integrations**: Ref/Rhea swap widgets + NEAR Intents (buying `$SNACC` including cross-chain), Meme Cooking (the memecoin launch ritual), Keypom/Linkdrops (`NEP-452` — instant "starter packs" for new players/judges), gas keys (`NEP-611`) & meta-transactions (onboarding without a balance), SocialDB (a social leaderboard), Chain Signatures (cross-chain EVM identities for Strains), FastNEAR/NearBlocks (clickable hash evidence), Phala `dcap-qvl` (an offline verification of the TDX hardware quote).
- **The stack**: Rust (`near-sdk 5.29.1`, `rustc 1.99.1`) for the single atomic `snacc-v001.near` contract; TypeScript (the SDK, oracle-tee, the backend indexer); React + Vite (the cell-cultivation game: isometric Colony Plate arena + Cell Lab bio-reactor, demo/live modes, NEAR testnet wallet login and signed game actions, deployed on Vercel). A **polyrepo** architecture: `contracts`, `oracle-tee`, `sdk`, `backend`, `frontend`, `scripts` + the umbrella repo.

---

## 8. The competitive position

- **The main tracks: `memecoins` ("the joke needs rules") and `nfts` ("what comes after the JPEG")** — Snacc answers both precisely: real memecoin mechanics (the 11 mechanics above) + an NFT that actually *does something* (holds a balance sheet, M&A, bankruptcy). The `privacy`, `games`, `thesis` tracks are supported by separate evidence.
- **An audit of 184 participating projects** shows this gap is real: `$SNACC` is the only NEP-141 reactive-supply contract completed in the memecoin track, and no NFT participant gives its NFTs a balance sheet + M&A + bankruptcy.
- **The philosophical differentiation**: Snacc's macro economy is **self-contained** (no manipulable external price oracle), monetary policy is **algorithmic** (no slow committee voting), and every claim is backed by on-chain evidence anyone can verify in seconds (including a one-command verification script for AI & human judges).

---

## 9. Project status & roadmap (honest)

| Aspect | Status as of Nov 7, 2026 |
| --- | --- |
| Design | **Complete** — 86 specification documents (7 features, 33 design decisions, DFDs, sequences, test matrices) |
| Code | The contract foundation is green (`cargo test` passes); the mechanics implementation is in progress per the backlog of ±323 items |
| On-chain evidence | **No live claims yet** — our principle: no real transaction hash, no claim. All evidence will follow on testnet before Nov 13 |
| Timeline | The NEAR Hackathon (Nov 1–14, 2026, a total prize pool of $250K). The clean rehearsal + the demo video + the judge README: Nov 12–13. **Submission: Nov 14, 2026 23:59 UTC** |
| Post-hackathon | A Meme Cooking/DEX listing, a molecule market, cross-season colony tournaments, full TDX quote verification, an independent security audit |

---

## 10. Frequently asked partner questions

**Is this gambling?**
It is an on-chain economy game with real risk and masterable mechanics (timing, information, supply-chain strategy). Nobody promises profit; what is sold is the *game mechanics*, not the potential for returns.

**Who controls the cash/treasury?**
Nobody. The treasury is governed by rules inside the contract (it only leaves when the economic temperature < 600, max 5%/epoch). There is no admin withdrawal function. Monetary policy is run by the algorithmic thermostat, not voting.

**What keeps it from collapsing like other game tokens?**
When activity surges the supply is automatically burned, when it quiets it is automatically subsidized — the opposite direction to classic game-token hyperinflation. Players can still lose from bad decisions; what is prevented is system death from careless issuance design.

**Why is the AI essential, not a sticker?**
Secret recipes are a player's competitive advantage; only a TEE can evaluate them without leaking them, and only NEAR can verify the result's authenticity directly in the contract. The chain is real: AI → production efficiency → energy → product → dividends.

**How do I try it?**
A public testnet rehearsal will open with a "starter pack" link (click → you instantly own a Strain) ahead of the demo, along with a one-command verification anyone can run to check all of the above.

---

*This summary is composed from Snacc's design specifications (86 documents), the project's single source of truth. The numbers follow the official number dictionary: the Fever burn 350 bps, the rebate 200 bps, a 500 bps/epoch cap, an AI mutation guardrail of ±1,500 bps, a 10%/90% liquidation bounty, a 2.5% merger tax, a 15% takeover premium, a colony max of 5 cells/a generation max of 8, an SVG of 1,734 bytes.*
