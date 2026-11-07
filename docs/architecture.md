# Snacc — Arsitektur

> Ringkasan arsitektur teknis Snacc untuk juri & kontributor. Sumber kebenaran desain: vault `snacc-vault` (privat). Angka mengikuti **Kamus Angka Resmi** (`snacc-vault/04 Arsitektur/Snacc - Model Data.md`). Status implementasi mengikuti Backlog Master — dokumen ini membedakan apa yang **sudah ada di kode** vs **rencana spec**.

## 1. Polyrepo (org GitHub `Snacc-near`)

| Repo | Modul | Isi | Status |
| --- | --- | --- | --- |
| [`snacc`](../README.md) (payung) | — | README, docs, orkestrasi demo | aktif |
| [`contracts`](https://github.com/Snacc-near/contracts) | `M1` + `M2` | Kontrak Rust `snacc-v001.near` (`near-sdk =5.29.1`, `rustc 1.99.1`) — semua mekanik | `VC-001..006` ter-merge, 53 test |
| [`oracle-tee`](https://github.com/Snacc-near/oracle-tee) | `M3` | Dual-Layer Redaction (`ADR-05`) + klien TEE + verifikator ed25519 | `TEE-101..104` ter-merge, 14 test |
| [`sdk`](https://github.com/Snacc-near/sdk) | `M4` | `lab-sdk`: parser event NEP-297; `SnaccClient` + Function Call Keys menyusul | `SDK-107..108` ter-merge, 15 test |
| [`backend`](https://github.com/Snacc-near/backend) | `M5` | Indexer `NEP-297` + API `/api/crucible/*` | scaffold (`INT-101..108` berjalan) |
| [`frontend`](https://github.com/Snacc-near/frontend) | `M6` | `biolab-ui`: 3-Column Console + 30s Judge Walkthrough | stub |
| [`scripts`](https://github.com/Snacc-near/scripts) | `M7` | `verify:thesis`, `demo:replay`, `demo-e2e.mjs` | aktif |

## 2. Empat lapis mekanisme

| Lapis | Nama | Fungsi | Modul |
| --- | --- | --- | --- |
| 1 | **Living NFT** | Organisme ber-neraca: sub-account `s-<id>.snacc-v001.near`, vitalitas & BMR (Lazy evaluation, `ADR-22`), SVG `NEP-177` hidup | `M1`, `M2` |
| 2 | **Rantai pasok & korporasi** | Transmutasi 3 tahap `NEP-245` (`mt_burn` → `mt_mint` × `efficiency_bps`), role bitmask Coasean (`ADR-25`), merger `splice_strains` + `hostile_takeover_splice` (`ADR-26`), likuidasi `harvest_starving_strain`, koloni multi-sel dengan pagar populasi | `M1` |
| 3 | **Genom rahasia (TEE)** | Formula mutasi dievaluasi `z-ai/glm-5.3-flash` di enclave NEAR AI Cloud; kontrak memverifikasi sendiri: `env::sha256` rekonstruksi + `env::ed25519_verify` + anti-replay `chat_id` + guardrail ±1500 bps (`ADR-21`, `I-03`, `I-06`, `I-07`, `I-16`) | `M1`, `M3` |
| 4 | **Bank sentral makro** | Termostat `CrucibleTemp`: Fever `>1400 mK` → burn 350 bps fee; Hypothermia `<600 mK` → subsidi 200 bps dari treasury, cap 500 bps/epoch (`I-04`); Industrial Dividend Pool 50% fee non-burn | `M1`, `M5` |

## 3. Alur data utama

```
Alkemis (E1) --Function Call Keys (0-popup)--> biolab-ui (M6)
    --call--> snacc-v001.near (M1: state D1-D8, event NEP-297 -> D9)
    --Tahap 1 redaksi--> oracle-tee (M3) --POST /v1/chat/completions--> NEAR AI Cloud TEE (E3)
    <--{chat_id, signature ed25519}--  E3
    --apply_tee_mutation_zero_trust--> M1 (verifikasi on-chain, guardrail)
backend (M5): poll block/event NEP-297 -> /api/crucible/* -> M6 & M7
scripts (M7): verify:thesis (RPC benchmark) + demo:replay (offline, 0 API key)
```

## 4. Keputusan desain kunci (ADR)

33 ADR terdokumentasi di vault; yang paling menentukan bentuk kode:

- `ADR-04/27` — rumus `CrucibleTemp = floor(1000 × V_decayed / max(supply, 1))` dengan lazy decay (`VOLUME_DECAY_PER_SEC = 50`), tanpa cron.
- `ADR-21/33` — verifikasi TEE zero-trust 2-fase + registri `attested_tee_signers` yang bisa dirotasi.
- `ADR-25/26` — role bitmask Coasean (`1=Extractor`, `2=Fermenter`, `4=Synthesizer`); multi-bit hanya lewat merger; tangga solvensi 3 tingkat.
- `ADR-29` — anti-drain `state_nonce` + `pending_callbacks == 0` (mencegah ERC-6551 seller front-running).
- `ADR-30/31` — 3 NPC otonom on-chain + dual-skin UI (FinTech/Bio-Lab).

Lihat juga: [security.md](security.md) · [api-schemas.md](api-schemas.md) · [partner-onboarding.md](partner-onboarding.md)
