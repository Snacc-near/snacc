# Snacc — 3-Layer Glossary (DOC-105..107)

> Every core term has three isomorphic 1:1 name skins (`ADR-31`): **Bio-Lab** (game theme,
> used by UI/frontend), **FinTech** (used by README for DeFi/VC judges), and **Rust/on-chain** (field
> names in code). Numbers follow the **Kamus Angka Resmi** (`snacc-vault/04 Arsitektur/Snacc - Model Data.md` —
> private design vault); macro calibration follows **ECON-111 FINAL** (Fever above 610 mK,
> `VOLUME_SCALE = 5` — see `docs/econ-reconciliation.md` row 1, RESOLVED 2026-11-09).

## 1. Ecosystem & cell core

| Bio-Lab 🔬 | FinTech 📊 | Rust/on-chain | Meaning & numbers |
| --- | --- | --- | --- |
| Snacc (organism) | Balance-sheet company | `StrainVessel` (`D2`) | Living `NEP-171` NFT; initial vitality **8500** (85%) |
| Dynamic SVG | Live financial report | `NEP-177` dynamic SVG | **1734 bytes** (Kamus Angka canonical budget); rendered from on-chain state |
| Fullness / Vitalitas | Solvency | `effective_vitality` | `vitality − elapsed_hours × bmr_per_hour` (Lazy, `ADR-22`); Tier 1 above 2000 / Tier 2 1..2000 / Tier 3 0 |
| Basal metabolism | Fixed cost | `bmr_per_hour` | Extractor **100** · Fermenter **120** · Synthesizer **150** per hour |
| `$SNACC` (food) | Equity token | `snacc_balances` + `account_balances` | `NEP-141`, 24 decimals; supply only shrinks after hatch (`DK-010`) |
| Hatch | IPO / seed | `incubate_strain` | stake: **80%** cell stomach, **20%** Pantry (treasury) |
| Feed | Capital expenditure | `feed_strain` | fee → thermostat (also mints `$ATP`) |
| `$ATP` (energy) | Working capital | `atp_balance` | non-transferable, no total_supply; **50** at birth; 0.001 catalyst units = 1 ATP |
| Mitokondria / Nukleus / Lisosom | Operating division | `organel.{mitokondria,nukleus,lisosom}` | slots up to **5** (`allocate_atp` 1×/epoch, cost 1 per upgrade) |

## 2. Production, M&A, population

| Bio-Lab 🔬 | FinTech 📊 | Rust/on-chain | Numbers |
| --- | --- | --- | --- |
| Spore → Enzyme → Elixir | Production stages 1→2→3 | `extract_spores` → `transmute_spores_to_enzyme` → `synthesize_elixir` | 3-stage `NEP-245` recipe; output × `efficiency_bps` |
| Lysis / *snack it* | Chapter 7 liquidation | `harvest_starving_strain` | liquidator bounty **10%**, Pantry **90%**; only at eff = 0 (`I-10`) |
| Endosymbiosis (fusion) | Voluntary merger | `splice_strains` | **2.5%** tax, `role_mask \|=`, Gen+1, **+800 bps** efficiency |
| Raider (Chapter 11) | Hostile takeover | `hostile_takeover_splice` | pay **book value + 15%** (95% seller / 5% Pantry); must be Tier 2 + nonce (`I-14`) |
| Adopt (phagocytosis) | Cheap acquisition | `adopt` | book value **without premium**; Tier 2 window |
| Cytokinesis / mitosis | Spin-off | `divide_strain` | balance/vitality/spores **halved**; organelles ÷2; Gen+1; ATP **3** |
| Plasmid conjugation | Borrowed IP license | `conjugate_traits` | copy `phenotype_trait` without merging; ATP **2** |
| Colony | Business group | `get_colony` | up to **5** cells (`MAX_COLONY_SIZE`); gen up to **8** (`MAX_GENERATION`); demographics `divides ≤ merges + lyses` |

## 3. Macro, thermostat, dividends, NPCs

| Bio-Lab 🔬 | FinTech 📊 | Rust/on-chain | Numbers |
| --- | --- | --- | --- |
| Crucible temperature | Activity index | `CrucibleTemp` | `1000 × V_decayed / supply`; decay **50/sec** (`ADR-27`) |
| Fermentation fever | Overheating | Fever (zone above 610 mK, ECON-111) | **350 bps** fee burn (`I-01`); homeostasis holders −50% |
| Famine relief | Counter-cyclical subsidy | Hypothermia (below 600 mK) | **200 bps** rebate, **500 bps** cap per epoch treasury (`I-04`) |
| Nutrient Burst | Post-lysis systemic discount | `nutrient_burst_bps/until` | 1 epoch; shares the `I-04` quota cap |
| Great Feast | Quorum ritual | `feast_result` | verdict `GOLDILOCKS/OVERFED/UNDERFED`; top-3 feeder |
| Dormancy / sporulation | Austerity mode | dormancy (volume below 1% of supply) | upkeep drops to **50 bps** |
| Pantry | Rule-bound treasury | `treasury` | no admin withdrawal (`I-05`); subsidies up to **500 bps**/epoch |
| Industrial dividend | Profit distribution | `industrial_dividend_pool` | **50%** of non-burn fees (`ADR-28`); golden claim pro-rata via burning `mt:elixir-aether`; **8-epoch** window |
| NPC merchant | Autonomous market-maker | `NpcMerchantAgent` (`D4`) | price `P_base(100) × S_target / S_after` (`I-15`); Pyre-X / Myco-7 / Void-0 |
| Secret genome | Production IP | `phenotype_trait` + TEE | `z-ai/glm-5.3-flash` on NEAR AI Cloud; guardrail ±**1500 bps**/vitality ≤**500** (`I-03`) |
| Cell account | NFT custody | `vault_subaccount` | `s-<id>-<tag>.<contract-account>` keyless (`ADR-02`) |
| Transplantation | Asset ownership transfer | `nft_transfer(_call)` | whole cell (stomach+inventory+organelles+ATP) moves together; 1 yoctoNEAR |

## 4. References

- Kamus Angka Resmi: `snacc-vault/04 Arsitektur/Snacc - Model Data.md` (the single source of numbers; private vault).
- Calibration decision: ECON-111 Option B, recorded publicly in `docs/econ-reconciliation.md` (row 1, RESOLVED 2026-11-09).
- ATP & reproduction decisions: Backlog Master §13a (private vault).
- API schema tables: `docs/api-schemas.md`.

> Honesty rules: `$SNACC` on testnet has **no monetary value**; profit = work + redistribution inside the
> on-chain economy game, **no guarantees**; volatility = feature. Forbidden wording (honesty rule): the
> words GameFi, investment and yield are banned framing.
