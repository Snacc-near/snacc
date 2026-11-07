# Snacc — Ringkasan Onboarding Partner

**Snacc ($SNACC): NFTs that eat a memecoin. Feed your Snacc or it gets snacked.**

*Dokumen ini berdiri sendiri — semua yang Anda butuhkan untuk memahami Snacc end-to-end ada di sini, tanpa referensi ke dokumen lain. Terakhir diperbarui: 7 November 2026.*

---

## 1. Ringkasan eksekutif

Snacc adalah **permainan ekonomi on-chain di NEAR** di mana setiap NFT bukan gambar mati, melainkan **organisme hidup yang punya perut, metabolisme, dan neraca keuangannya sendiri**. Setiap organisme (disebut *Homunculus Strain*) **harus makan memecoin `$SNACC`** agar tetap hidup. Jika pemiliknya lalai, Strain itu bisa **diambil alih pesaing saat sekarat**, atau **dipanen siapa pun saat pingsan** — dan kematiannya justru memberi makan seluruh ekosistem.

Di belakangnya berjalan mesin penuh: **bank sentral algoritmik** yang mengatur suplai `$SNACC` secara otomatis, **rantai pasok multi-token 3 tahap**, **M&A antar-NFT on-chain**, dan **verifikasi keputusan AI rahasia di TEE (Trusted Execution Environment) NEAR AI Cloud yang dicek langsung oleh kontrak pintar** — tanpa admin, tanpa komite, tanpa yang bisa mencurangi sistem termasuk pembuatnya sendiri.

Satu kalimat untuk investor: *"Autonomous balance-sheet NFTs yang hidup di atas memecoin dengan bank sentral algoritmik — kasino yang bandarnya adalah matematika."*

---

## 2. Masalah yang diselesaikan

Berdasarkan studi kasus runtuhnya token game on-chain dan memecoin generasi pertama (mis. token game yang jatuh >99% dalam hitungan minggu):

1. **Memecoin & token game mati karena tidak ada bank sentral otomatis.** Saat ramai, suplai meledak tanpa mekanisme bakar proporsional; saat sepi, tidak ada stimulus. Akibatnya: hiperinflasi lalu death spiral.
2. **NFT selama ini "dead JPEG"** — penanda kepemilikan pasif. NFT tidak bisa memegang kas sendiri, tidak punya biaya hidup, tidak bisa mengakuisisi NFT lain, tidak bisa bangkrut.
3. **Strategi/resep on-chain selalu bocor.** Begitu ada formula menang, semua parameter transaksi terlihat di explorer dan ditiru bot dalam 1 blok.
4. **Friksi popup wallet membunuh loop permainan.** Menandatangani transaksi berulang membuat game ekonomi mustahil dimainkan lancar.

Snacc menjawab keempatnya: termostat moneter otomatis, NFT-berneraca, eksekusi resep rahasia di TEE, dan sesi bermain tanpa popup (*signless*).

---

## 3. Produknya apa, persisnya?

Setiap **Homunculus Strain** adalah NFT (`NEP-171`) dengan:

- **Sub-account NEAR sendiri** (`s-<id>.snacc-v001.near`) — neraca berdaulat yang menyimpan kas `$SNACC` dan inventori molekul.
- **Vitalitas & BMR (Basal Metabolic Rate)** — vitalitas meluruh seiring waktu nyata. Tidak diberi makan → vitalitas 0 → pingsan/mati. Inilah "harus makan" itu.
- **Spesialisasi produksi (role bitmask)**: `Extractor` (penghasil bahan baku), `Fermenter` (pemurni), atau `Synthesizer` (pencipta produk akhir). Menggabungkan ketiganya (`0b111`) hanya mungkin lewat **M&A** — ini inti teori ekonominya: integrasi vertikal lewat merger, bukan farming sendirian.
- **Koloni multi-sel (`EN-08`)** — satu alkemis bisa membelah Strain (`divide_strain` → NFT anakan yang mewarisi genom & organel), mengadopsi (`adopt`) atau memanen (`snack`) Strain sekarat milik orang lain. Pagar populasi alami: `MAX_COLONY_SIZE = 5`, `MAX_GENERATION = 8`, dan `births ≤ merges + lyses` — populasi hanya bertumbuh seiring kerja (merger) dan kematian (lisis), bukan cetak-mencetak.
- **Metadata visual live (`NEP-177`)** — SVG 8 indikator (detak jantung, saldo, energi, organel, suhu ekonomi, zona, koloni, bounty) yang dirender langsung dari state kontrak (~1.734 byte, 0 biaya storage tambahan). NFT-nya "berdenyut" secara real-time.

### Rantai pasok 3 tahap (9 molekul `NEP-245`)

`Raw Spores → Refined Enzymes → Philosopher Elixirs` — tiap tahap **membakar input dan mencetak output** (`mt_burn` → `mt_mint`) dengan efisiensi yang dihasilkan dari resep rahasia. Ini "pabrik"-nya: pemain adalah spesialis rantai pasok yang saling membutuhkan.

### 4 lapis mekanisme (ringkas teknis)

| Lapis | Nama | Fungsi |
| --- | --- | --- |
| 1 | **Living NFT** | Organisme ber-neraca, BMR, sub-account, SVG live |
| 2 | **Rantai pasok & korporasi** | Transmutasi 3 tahap, role bitmask, M&A (`splice_strains`), likuidasi (`harvest_starving_strain`), tangga solvabilitas 3 tingkat |
| 3 | **Genom rahasia (TEE)** | Formula mutasi dievaluasi AI di enclave; kontrak memverifikasi sendiri keaslian hasilnya |
| 4 | **Bank sentral makro** | Termostat `CrucibleTemp` (bakar 3,5% saat panas / subsidi 2% saat dingin) + kolam dividen industri |

---

## 4. Cara bermain (satu epoch dalam kehidupan pemain)

1. **Onboarding tanpa popup** — masuk dengan Function Call Access Key (sesi *signless*), incubate Strain baru: 80% deposit jadi modal Strain, 20% masuk treasury aturan.
2. **Alokasikan energi (`$ATP`)** — sekali per epoch, pemain membagi energi internal ke 3 slot organel: **Mitokondria** (produksi naik), **Nukleus** (ketahanan), **Lisosom** (efek saat memanen). *Ini keputusan utama pemain.*
3. **Transmutasi** — bakar molekul tahap bawah → cetak tahap atas × efisiensi; setiap kerja membukukan `$ATP`.
4. **Beri makan (`feed`)** — bayar fee `$SNACC`; di sinilah termostat bekerja: saat ekonomi "Fever" sebagian fee otomatis **dibakar**; saat "Hypothermia" treasury **mensubsidi**.
5. **Eksekusi resep rahasia di TEE** — susun formula mutasi → AI mengevaluasi di enclave privat → hasilnya diterapkan ke `efficiency_bps` (batas ±15%) setelah kontrak memverifikasi tanda tangan digital enclave.
6. **Sosial & PvP** — merger dengan Strain sendiri (voluntary), **hostile takeover** ke Strain sekarat milik orang lain (bayar nilai buku + 15%), `adopt` (selamatkan), atau `snack` (panen — dapat bounty 10%).
7. **Klaim dividen** — bakar eliksir puncak (`mt:elixir-aether`) untuk mendapat bagian **pro-rata** dari 50% fee industri tiap epoch. *Inilah "earning loop"-nya: profit datang dari kerja dan redistribusi, bukan janji imbal hasil.*
8. Epoch ditutup → zona baru, event Nutrient Burst, leaderboard, ulangi.

Total: **±7 keputusan bermakna per epoch** — bukan klik kosong.

---

## 5. Ekonomi `$SNACC` — volatilitas sebagai fitur

`$SNACC` **bukan stablecoin dan tidak mematok harga apa pun.** Yang diatur otomatis hanya emisi & insentif. Harga pasar tetap volatil penuh seperti memecoin pada umumnya — dan itu disengaja: daya tarik memecoin adalah pertaruhan (*hoki → untung besar, sial → rungkad*).

**Tiga mesin volatilitas:**

| Mesin | Aturan | Efek |
| --- | --- | --- |
| **Calcination Fever** | Suhu ekonomi > 1400 mK → tiap transaksi mem-burn 3,5% fee | Makin ramai → suplai menyusut → scarcity spiral ke atas |
| **Hypothermia Rebate** | Suhu < 600 mK → subsidi 2% dari treasury (maks 5%/epoch) | Lantai utilitas saat sepi — bukan lantai harga |
| **Event** | Nutrient Burst, Great Feast, window takeover, klaim dividen | ±7 momen taruhan per epoch |

**Peta hoki vs rungkad** (contoh): membeli Strain sekarat yang murah → hoki: pulih + kebagian Nutrient Burst; rungkad: di-snack rival duluan. Membakar eliksir untuk dividen → hoki: rate besar saat sedikit pesaing; rungkad: terdilusi saat ramai. Berjudi di zona Great Feast → bonus saat tepat, biaya membengkak saat meleset. Bahkan **kematian pemain lain adalah kesempatan Anda**: satu Strain mati → 90% kasnya kembali ke treasury dan seluruh ekosistem kebagian **diskon makan 1 epoch** ("satu mati, semua kenyang").

Yang membedakan dari memecoin sampah: (1) volatilitasnya punya **sumber mekanik** yang bisa dimainkan, bukan sekadar pump-dump; (2) sistemnya **anti-death-spiral** (bank sentral algoritmik), tapi **bukan anti-rugi** — keputusan buruk tetap dihukum; (3) semua risiko bisa **dilihat live** (meteran suhu, zona, countdown); (4) tidak ada admin yang bisa menarik kas atau mengubah aturan diam-diam.

> *Pitch untuk juri: "$SNACC tetap kasino — tapi house edge-nya datang dari nyali & timing, bukan keberuntungan semata; dan bandarnya (CrucibleTemp) tidak bisa dicurangi siapa pun, termasuk kami."*

**Batas kejujuran:** pada tahap ini token uji coba **tanpa nilai uang**; klaim profit = kerja + redistribusi, **tanpa jaminan untung**; volatilitas adalah fitur, bukan janji.

---

## 6. Mekanik memecoin ringkas (11 mekanik)

1. Suplai reaktif (`CrucibleTemp` → burn 3,5% / rebate 2%) · 2. **Nutrient Burst** — kematian memberi diskon makan global · 3. **The Great Feast** — target volume komunitas per epoch (bonus "Goldilocks" / zona Fever-Famine, top-3 kontributor) · 4. **Rescue feeding** — makin sekarat makin murah disuapi (ada risiko ditinggal mati) · 5. **Diet per kasta** — diskon beda per spesialisasi saat zona ekstrem · 6. **Watchability** — meteran selera makan + event live · 7. **`$ATP`** — energi internal non-transferable (bukan token!) yang membuat suplai `$SNACC` benar-benar terasa · 8. **Slot organel** — alokasi energi per epoch · 9. **Koloni multi-sel** — belah diri (`divide_strain`, NFT anakan), adopsi (`adopt`) vs panen (`snack`), dengan pagar populasi alami: `MAX_COLONY_SIZE = 5`, `MAX_GENERATION = 8`, `births ≤ merges + lyses` (bukan "populasi hanya menyusut" versi lama) · 10. **Industrial Dividend Pool** — 50% fee non-burn dibagikan pro-rata ke pemegang eliksir · 11. **NPC otonom** — 3 pedagang AI on-chain (*Pyre-X, Myco-7, Void-0*) yang menyediakan likuiditas dua arah dengan harga kelangkaan, sehingga ekonomi tetap hidup 24/7 tanpa dev patch.

---

## 7. Teknologi & integrasi

**Dibangun di NEAR, dan hanya bisa di NEAR:**

- **Standar NEAR**: `NEP-141` (token `$SNACC` + burn), `NEP-171` (NFT), `NEP-177` (metadata SVG dinamis), `NEP-245` (9 molekul multi-token), `NEP-297` (event), **Sub-Accounts** (neraca per organisme), **Function Call Access Keys** (sesi bermain tanpa popup), host function kripto asli `env::ed25519_verify` + `env::sha256`.
- **NEAR AI Cloud TEE** (`cloud-api.near.ai`): model `z-ai/glm-5.3-flash` berjalan di enclave Intel TDX + NVIDIA confidential GPU dengan tanda tangan hardware per request. **Mekanisme zero-trust 2 fase**: (1) komitmen hash request on-chain sebelum AI bicara; (2) setelah jawaban datang, kontrak **menghitung ulang hash-nya sendiri di dalam WASM**, memverifikasi tanda tangan ed25519 64-byte enclave, menolak replay, lalu mem-parse hasilnya on-chain dengan guardrail ±15%. Artinya: **tidak ada oracle yang harus dipercaya** — bahkan relayer jahat tidak bisa memalsukan hasil AI. Redaksi ganda (identitas dompet dihapus, takaran resep disembunyikan di balik komitmen SHA-256) menjaga resep tetap rahasia.
- **Integrasi nilai jual**: widget swap Ref/Rhea + NEAR Intents (beli `$SNACC` termasuk lintas chain), Meme Cooking (peluncuran ritual memecoin), Keypom/Linkdrops (`NEP-452` — "starter pack" instan untuk pemain baru/juri), gas keys (`NEP-611`) & meta-transaksi (onboarding tanpa saldo), SocialDB (leaderboard sosial), Chain Signatures (identitas EVM lintas chain untuk Strain), FastNEAR/NearBlocks (bukti hash yang bisa diklik), Phala `dcap-qvl` (verifikasi quote hardware TDX secara offline).
- **Stack**: Rust (`near-sdk 5.29.1`, `rustc 1.99.1`) untuk kontrak tunggal atomik `snacc-v001.near`; TypeScript (SDK, oracle-tee, backend indexer); React + Vite (lab UI dengan mode ganda FinTech/Bio-Lab). Arsitektur **polyrepo**: `contracts`, `oracle-tee`, `sdk`, `backend`, `frontend`, `scripts` + repo payung.

---

## 8. Posisi kompetitif

- **Track utama: `memecoins` ("the joke needs rules") dan `nfts` ("what comes after the JPEG")** — Snacc menjawab keduanya persis: mekanik memecoin nyata (11 mekanik di atas) + NFT yang benar-benar *melakukan sesuatu* (berneraca, M&A, bangkrut). Track `privacy`, `games`, `thesis` didukung bukti terpisah.
- **Audit 184 proyek peserta** menunjukkan celah ini nyata: `$SNACC` adalah satu-satunya kontrak NEP-141 ber-suplai reaktif yang rampung di track memecoin, dan tidak ada peserta NFT yang memberi NFT-nya neraca + M&A + kebangkrutan.
- **Diferensiasi filosofis**: ekonomi makro Snacc **mandiri** (tanpa oracle harga eksternal yang bisa dimanipulasi), moneter **algoritmik** (tanpa voting komite yang lambat), dan semua klaim didukung bukti on-chain yang bisa diverifikasi siapa pun dalam hitungan detik (termasuk skrip verifikasi 1-perintah untuk juri AI & manusia).

---

## 9. Status proyek & roadmap (jujur)

| Aspek | Status per 7 Nov 2026 |
| --- | --- |
| Desain | **Tuntas** — 86 dokumen spesifikasi (7 fitur, 33 keputusan desain, DFD, sequence, matriks uji) |
| Kode | Fondasi kontrak hijau (`cargo test` lulus); implementasi mekanik sedang berjalan sesuai backlog ±323 item |
| Bukti on-chain | **Belum ada klaim live** — prinsip kami: tanpa hash transaksi nyata, tidak ada klaim. Semua bukti menyusul di testnet sebelum 13 Nov |
| Timeline | Hackathon NEAR (1–14 Nov 2026, total hadiah $250K). Gladi bersih + video demo + README juri: 12–13 Nov. **Submission: 14 Nov 2026 23:59 UTC** |
| Pasca-hackathon | Listing Meme Cooking/DEX, pasar molekul, turnamen koloni antar-musim, verifikasi quote TDX penuh, audit keamanan independen |

---

## 10. Pertanyaan yang biasa diajukan partner

**Apakah ini judi?**
Ini permainan ekonomi on-chain dengan risiko nyata dan mekanik yang bisa dikuasai (timing, informasi, strategi rantai pasok). Tidak ada pihak yang menjanjikan keuntungan; yang dijual adalah *mekanik permainannya*, bukan potensi imbal hasil.

**Siapa yang mengontrol kas/treasury?**
Tidak ada siapa pun. Treasury diatur aturan di dalam kontrak (hanya keluar saat suhu ekonomi < 600, maks 5%/epoch). Tidak ada fungsi penarikan admin. Moneter dijalankan termostat algoritmik, bukan voting.

**Apa yang membuatnya tidak ikut runtuh seperti token game lain?**
Saat ramai suplai otomatis dibakar, saat sepi otomatis disubsidi — arah yang berlawanan dengan hiperinflasi token game klasik. Pemain tetap bisa rugi karena keputusan buruk; yang dicegah adalah kematian sistem akibat desain emisi yang ceroboh.

**Mengapa AI-nya penting, bukan tempelan?**
Resep rahasia adalah keunggulan kompetitif pemain; hanya TEE yang bisa mengevaluasinya tanpa membocorkannya, dan hanya NEAR yang bisa memverifikasi keaslian hasilnya langsung di kontrak. Rantainya nyata: AI → efisiensi produksi → energi → produk → dividen.

**Bagaimana cara mencobanya?**
Gladi publik di testnet akan dibuka dengan link "starter pack" (klik → langsung punya Strain) menjelang demo, disertai satu perintah verifikasi yang bisa dijalankan siapa pun untuk mengecek semua klaim di atas.

---

*Ringkasan ini disusun dari spesifikasi desain Snacc (86 dokumen) yang menjadi sumber kebenaran tunggal proyek. Angka-angka mengikuti kamus angka resmi: burn Fever 350 bps, rebate 200 bps, cap 500 bps/epoch, guardrail mutasi AI ±1.500 bps, bounty likuidasi 10%/90%, pajak merger 2,5%, premi takeover 15%, koloni maks 5 sel/generasi maks 8, SVG 1.734 byte.*
