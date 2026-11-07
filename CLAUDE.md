# Snacc — NEAR HACKATHON

Snacc ($SNACC) — *NFTs that eat a memecoin. Feed your Snacc or it gets snacked.* Lapisan permainan ekonomi on-chain NEAR: NFT organisme hidup ber-neraca, rantai pasok `NEP-245`, bank sentral algoritmik `CrucibleTemp`, dan verifikasi AI rahasia di `NEAR AI Cloud TEE`. Build window: 1–14 Nov 2026 (submission tutup 2026-11-14T23:59Z). Track: `memecoins` + `nfts` (klaim track lain hanya dengan hash bukti).

**Wajib juga ikuti aturan global** (hemat usage, cara ubah file, batasi output, pakai subagent): @~/.claude/CLAUDE.md

**Cakupan:** file ini mengatur proyek Snacc (`repos/Snacc/*` di org `Snacc-near`, `snacc-vault/`, log `Progress Snacc`). Aturan root `CLAUDE.md` (x207) berlaku umum; bila bertentangan untuk urusan Snacc, **file ini yang menang**.

- Sumber kebenaran desain: `snacc-vault/` (mulai dari `Snacc Hub.md`). **Angka WAJIB dari Kamus Angka Resmi** (`snacc-vault/04 Arsitektur/Snacc - Model Data.md`) — nilai lain superseded, jangan dipakai.
- Backlog & pemilik item: `snacc-vault/09 Backlog/Snacc - Backlog Master.md` (**label `@pemilik · Lx`** di setiap baris) + `Snacc - Pembagian Tim.md`. Urutan eksekusi: Backlog Master §12.
- Repo: `repos/Snacc/` (payung) + `contracts`, `oracle-tee`, `sdk`, `backend`, `frontend`, `scripts` — org GitHub **`Snacc-near`** (7 repo **public**; `snacc-vault` **private**, jangan pernah dijadikan public).
- Tim: `@shenhan` (medium–high + FE inti), `@esther` (easy), `@arya` (easy–medium). **100% commit partner direview Shenhan** sebelum masuk.
- Log proyek: `vault/00 Log/Progress/Progress Snacc.md`.

## Wajib: vault selalu terbaru
- **Sebelum mulai, atau saat bingung progress sudah sampai mana, baca vault dulu**, jangan menebak: `snacc-vault/09 Backlog/` (Backlog Master, Pembagian Tim, Rencana Sprint), `Snacc Hub.md`, dan log `Progress Snacc.md`.
- **Setiap item selesai atau berubah status:** commit di repo terkait dengan pesan `<ID>: <ringkasan>`, perbarui barisnya di Backlog Master (status/label), lalu commit vault dengan `docs: status <ID>`. Item partial ditutup dengan commit `<ID>: complete - <ringkasan>` (atau `partial` bila belum tuntas).
- Keputusan baru, alamat deploy, dan perubahan spec dicatat di note vault terkait, atau dilaporkan ke pemilik bila sesi tidak boleh mengubahnya.

## Wajib: log progress setiap selesai tugas
Setiap sesi **wajib menulis log sebelum melapor selesai atau berhenti**.

1. File: `vault/00 Log/Progress/Progress Snacc.md` — hanya tambah di akhir. Format entri:

   ```markdown
   ## 2026-11-07 11:20 UTC
   - Selesai: VC-002 (`e496c71`, 7 test lulus)
   - Sebagian: VC-003 (`0190c40`, method X belum)
   - Menunggu: <apa yang ditunggu>
   - Keputusan/pertanyaan: <ringkas, atau "tidak ada">
   - Bukti: <output test/CI/hash yang dilihat sendiri; yang belum dijalankan tulis "belum dijalankan">
   ```

   Waktu dari `date -u`. Tulis hanya yang benar-benar terjadi.
2. Commit log itu saja:

   ```bash
   git -C vault add "00 Log/Progress/Progress Snacc.md" && git -C vault commit -m "log: Snacc" -- "00 Log/Progress/Progress Snacc.md"
   ```

## Aturan tetap
1. **Heredoc di Bash hanya untuk dua hal:** (1) input ke command, mis. `git commit -m "$(cat <<'EOF' ... EOF)"` atau `python3 -I - <<'EOF` untuk script sekali pakai; (2) menulis banyak file sekaligus lewat loop atau generator. Menulis satu atau beberapa file tidak termasuk: pakai Write (paralel dalam satu pesan) atau Edit, jangan `cat > file <<EOF`. Script `python3 -I - <<'EOF` yang menulis, menyisipkan, atau mengganti teks di file (baris backlog, log progress, docs) juga **bukan** pengecualian; pengecualian (1) hanya untuk script yang membaca atau memeriksa.
2. **Push & PR:** sesi boleh push **branch `item/<ID>`** dan membuka **PR** ke `Snacc-near`. **Merge ke `main` hanya setelah CI hijau** (atau persetujuan pemilik). Push langsung ke `main` hanya untuk commit infra/docs kecil yang diminta pemilik. Branch dirapikan setelah merge.
3. **Visibilitas & rilis:** `npm publish`, deploy/transaksi **mainnet**, dan mengubah visibilitas repo **tetap butuh persetujuan eksplisit pemilik**. `snacc-vault` wajib tetap private.
4. **Testnet diizinkan pemilik untuk gladi:** deploy ulang, akun faucet, transaksi di `testnet` (`snacc.testnet` dkk.). Jangan memindahkan kunci atau akun testnet ke mainnet.
5. **Batas waktu:** satu item maksimal 45 menit; satu masalah maksimal 3 kali menjalankan test yang sama. Lewat itu commit yang lulus, catat kendala di log, pindah item.
6. Secret hanya di `.env` (gitignored) dan `.secrets/` di root proyek. Jangan ditampilkan, dicatat, disalin, atau di-commit. Jalankan pindai secret sebelum push.
7. **Commit dengan path eksplisit**, tidak pernah `git add -A` di repo bersama. Pesan commit diawali ID item (`<ID>: <ringkasan>`); item sebagian beri kata "partial". Pengecualian vault: `docs: status <ID>` dan `log: Snacc`.
8. **Nama method, event, field, error, endpoint, dan kolom disalin persis** dari spec di `snacc-vault/04 Arsitektur/`.
9. **Aturan kejujuran:** tanpa hash testnet = tanpa klaim live; dilarang kata "GameFi/investasi/yield" di README (pakai "permainan ekonomi on-chain"); profit = kerja + redistribusi, tanpa jaminan untung; `$SNACC` testnet tanpa nilai uang; volatilitas = fitur, bukan janji.
