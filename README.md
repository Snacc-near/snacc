# Snacc — Payung Polyrepo

**Snacc ($SNACC): NFTs that eat a memecoin.** *Feed your Snacc or it gets snacked.*
Satu `Homunculus Strain` (`NEP-171`/`NEP-177`) punya perut `$SNACC` + inventori `NEP-245`, metabolisme `BMR`, energi internal `$ATP` (non-transferable) yang dialokasikan ke slot organel tiap epoch, bisa merger (`splice_strains`), di-takeover saat sekarat, dan dipanen siapa pun saat pingsan — koloni multi-sel (`divide_strain`, `adopt` vs `snack`) berjalan di bawah pagar populasi alami (`MAX_COLONY_SIZE = 5`, `MAX_GENERATION = 8`, `births ≤ merges + lyses`). Di belakangnya bank sentral reaktif `CrucibleTemp` (Fever bakar 3,5% fee / Hypothermia subsidi 2%), 3 NPC otonom, dan verifikasi AI di `NEAR AI Cloud TEE` (`env::ed25519_verify` on-chain). Volatilitas `$SNACC` adalah fitur yang bisa dimainkan — bukan janji imbal hasil.

## Tata repo (keputusan pemilik 2026-11-06: polyrepo gaya `x207`)

| Repo | Modul | Isi |
| --- | --- | --- |
| `Snacc` (payung ini) | — | README juri, docs, orkestrasi demo, aset submission |
| `contracts` | `M1` + `M2` | Kontrak `snacc-v001.near` (Rust, `near-sdk 5.29.1`) |
| `oracle-tee` | `M3` | Dual-Layer Redaction + klien `z-ai/glm-5.3-flash` + verifiktor ed25519 |
| `sdk` | `M4` | `lab-sdk`: Function Call Keys (0-popup) + `SnaccClient` |
| `backend` | `M5` | Indexer `NEP-297` + API `/api/crucible/*` |
| `frontend` | `M6` | `biolab-ui`: 3-Column Console + 30s Judge Walkthrough |
| `scripts` | `M7` | `verify:thesis`, `demo:replay`, `gladi:retry`, simulasi ekonomi |

## Mulai cepat (juri: Node.js 22+, tanpa kunci, tanpa `npm install`)

```bash
git clone https://github.com/Snacc-near/snacc.git && cd snacc
git clone https://github.com/Snacc-near/scripts.git scripts
npm run demo:replay      # replay offline dari bukti ter-commit di evidence/
npm run verify:thesis    # falsifier F-01..F-03
```

Kontrak: clone repo `contracts`, lalu `cargo test`. Bukti per klaim: [`docs/evidence-pack.md`](docs/evidence-pack.md) · ringkasan submission: [`HACKATHON.md`](HACKATHON.md).

## Sumber kebenaran desain

Vault `snacc-vault/` — mulai dari [[Snacc Hub]]. Angka mengikuti **Kamus Angka Resmi** ([[Snacc - Model Data]]). Backlog & urutan eksekusi: [[Snacc - Backlog Master]] (±300 item).

**Onboarding partner (standalone, tanpa link):** [`docs/partner-onboarding.md`](docs/partner-onboarding.md) — ringkasan end-to-end Snacc untuk pihak luar.

**Aturan kejujuran:** tanpa hash testnet tidak ada klaim live; profit = kerja + redistribusi (Industrial Dividend Pool), tanpa jaminan untung; `$SNACC` testnet tanpa nilai uang.
