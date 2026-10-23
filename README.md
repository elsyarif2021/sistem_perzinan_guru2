# Ruang Izin — Sistem Perizinan Guru

Aplikasi web berbahasa Indonesia untuk mencatat pengajuan izin guru. Dibangun dengan HTML, CSS, JavaScript, dan server statis Node.js tanpa dependensi npm.

## Menjalankan

Memerlukan Node.js 20 atau lebih baru.

```sh
npm start
```

Buka `http://localhost:3000` di browser. Ubah port dengan variabel `PORT` bila diperlukan. Tidak perlu menjalankan `npm install`.

## Fitur

- Formulir nama guru, NIP/identitas, jenis izin, periode, dan alasan.
- Validasi tanggal, isian wajib, serta jumlah hari kalender inklusif.
- Ringkasan pengajuan, pencarian nama/NIP, dan filter status.
- Persetujuan, penolakan, dan penghapusan dengan konfirmasi.
- Ekspor hasil filter ke CSV; masukan formula dinetralkan saat ekspor.
- Tampilan responsif dan penyimpanan lokal yang bertahan setelah halaman dimuat ulang.

## Batasan penggunaan

Ini versi lokal untuk demonstrasi atau penggunaan satu perangkat. Data disimpan dalam `localStorage` browser untuk alamat situs yang sama, bukan di GitHub atau server. Menghapus data browser akan menghapus catatan. Ekspor CSV secara berkala untuk menyimpan rekap; impor CSV belum tersedia.

Belum ada autentikasi, pembagian peran, basis data bersama, lampiran, notifikasi, atau audit persetujuan. Siapa pun yang membuka aplikasi pada browser tersebut dapat mengubah status. Jangan gunakan versi ini untuk data pribadi nyata atau proses persetujuan resmi sebelum menambahkan login, otorisasi server, penyimpanan terpusat, pencadangan, dan HTTPS. Font Google bersifat opsional; aplikasi tetap memakai font sistem tanpa jaringan.

## Pengujian

```sh
npm test
```

Pengujian mencakup validasi pengajuan, tanggal, perhitungan hari, dan pengamanan ekspor CSV. Untuk pemeriksaan manual, buat pengajuan, muat ulang halaman, setujui/tolak, cari dan filter data, ekspor CSV, lalu hapus pengajuan.
