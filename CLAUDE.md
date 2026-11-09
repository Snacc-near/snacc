# Snacc — NEAR HACKATHON

Snacc ($SNACC) — *NFTs that eat a memecoin. Feed your Snacc or it gets snacked.* An on-chain economy game layer on NEAR: living balance-sheet NFT organisms, a `NEP-245` supply chain, an algorithmic central bank `CrucibleTemp`, and secret AI verification in `NEAR AI Cloud TEE`. Build window: Nov 1–14, 2026 (submission closes 2026-11-14T23:59Z). Tracks: `memecoins` + `nfts` (claiming other tracks only with hash evidence).

**You must also follow the global rules** (usage thrift, how to change files, output limits, use subagents): @~/.claude/CLAUDE.md

**Scope:** this file governs the Snacc project (`repos/Snacc/*` in the `Snacc-near` org, `snacc-vault/`, the `Progress Snacc` log). The root `CLAUDE.md` rules (x207) apply generally; when they conflict on Snacc matters, **this file wins**.

- Source of design truth: `snacc-vault/` (start from `Snacc Hub.md`). **Numbers MUST come from the official Number Dictionary** (`snacc-vault/04 Arsitektur/Snacc - Model Data.md`) — other values are superseded, do not use them.
- Backlog & item owners: `snacc-vault/09 Backlog/Snacc - Backlog Master.md` (**the `@pemilik · Lx` label** on every row) + `Snacc - Pembagian Tim.md`. Execution order: Backlog Master §12.
- Repos: `repos/Snacc/` (this umbrella) + `contracts`, `oracle-tee`, `sdk`, `backend`, `frontend`, `scripts` — GitHub org **`Snacc-near`** (7 **public** repos; `snacc-vault` is **private**, never make it public).
- Team: `@shenhan` (medium–high + core FE), `@esther` (easy), `@arya` (easy–medium). **100% of partner commits are reviewed by Shenhan** before they land.
- Project log: `vault/00 Log/Progress/Progress Snacc.md`.

## Mandatory: keep the vault up to date
- **Before you start, or whenever you are confused about where the progress stands, read the vault first**, do not guess: `snacc-vault/09 Backlog/` (Backlog Master, Pembagian Tim, Rencana Sprint), `Snacc Hub.md`, and the `Progress Snacc.md` log.
- **Whenever an item is finished or changes status:** commit in the relevant repo with the message `<ID>: <summary>`, update its row in Backlog Master (status/label), then commit the vault with `docs: status <ID>`. Partial items are closed with a commit `<ID>: complete - <summary>` (or `partial` when not yet finished).
- New decisions, deploy addresses, and spec changes are recorded in the related vault note, or reported to the owner when a session is not allowed to change them.

## Mandatory: write a progress log whenever you finish a task
Every session **must write the log before reporting done or stopping**.

1. File: `vault/00 Log/Progress/Progress Snacc.md` — append only at the end. Entry format:

   ```markdown
   ## 2026-11-07 11:20 UTC
   - Done: VC-002 (`e496c71`, 7 tests passing)
   - Partial: VC-003 (`0190c40`, method X not yet)
   - Waiting: <what is being waited on>
   - Decisions/questions: <summarized, or "none">
   - Evidence: <test/CI/hash output you saw yourself; anything not yet run must say "not yet run">
   ```

   Time from `date -u`. Write only what actually happened.
2. Commit only that log:

   ```bash
   git -C vault add "00 Log/Progress/Progress Snacc.md" && git -C vault commit -m "log: Snacc" -- "00 Log/Progress/Progress Snacc.md"
   ```

## Standing rules
1. **Heredocs in Bash are allowed for only two things:** (1) input to a command, e.g. `git commit -m "$(cat <<'EOF' ... EOF)"` or `python3 -I - <<'EOF` for one-off scripts; (2) writing many files at once via a loop or generator. Writing one or a few files does not count: use Write (in parallel in one message) or Edit, do not `cat > file <<EOF`. A `python3 -I - <<'EOF` script that writes, inserts, or replaces text in files (backlog rows, progress logs, docs) is also **not** an exception; exception (1) is only for scripts that read or check.
2. **Push & PR:** sessions may push **the `item/<ID>` branch** and open a **PR** to `Snacc-near`. **Merge to `main` only after CI is green** (or with the owner's approval). Direct pushes to `main` are only for small infra/docs commits requested by the owner. Branches are cleaned up after merge.
3. **Visibility & release:** `npm publish`, mainnet deploy/transactions, and changing repo visibility **still need the owner's explicit approval**. `snacc-vault` must stay private.
4. **Testnet is owner-approved for rehearsals:** redeploying, faucet accounts, transactions on `testnet` (`snacc.testnet` etc.). Do not move these keys or accounts to mainnet.
5. **Time limits:** one item at most 45 minutes; one problem at most 3 runs of the same test. Beyond that, commit what passes, note the obstacle in the log, move to the next item.
6. Secrets live only in `.env` (gitignored) and `.secrets/` at the project root. Never display, record, copy, or commit them. Run the secret scan before pushing.
7. **Commit with explicit paths**, never `git add -A` in shared repos. Commit messages start with the item ID (`<ID>: <summary>`); partial items get the word "partial". Vault exceptions: `docs: status <ID>` and `log: Snacc`.
8. **Method, event, field, error, endpoint, and column names are copied verbatim** from the specs in `snacc-vault/04 Arsitektur/`.
9. **Honesty rules:** no testnet hash = no live claim; the words "GameFi/investment/yield" are banned in the README (use "on-chain economy game"); profit = work + redistribution, no profit guarantee; `$SNACC` testnet has no monetary value; volatility is a feature, not a promise.
