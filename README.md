# Rekod Kuliah Masjid & Surau

<img width="795" height="515" alt="image" src="https://github.com/user-attachments/assets/adbb57ba-d80f-40d1-b211-8c4e49cc8311" />

<img width="775" height="483" alt="image" src="https://github.com/user-attachments/assets/4e945a61-b8d2-494d-a4ac-1f78d83d166e" />


*Tangkapan skrin di atas menunjukkan borang untuk menambah rekod kuliah baru dalam aplikasi.*

Aplikasi web untuk merekod dan menguruskan jadual kuliah di masjid dan surau. Pengguna boleh menambah, melihat, mengedit, dan memadam butiran kuliah termasuk tajuk, penceramah, lokasi, tarikh, dan masa. Data disimpan secara setempat di dalam pelayar.

## ✨ Ciri-Ciri Utama

- **Pengurusan Kuliah Penuh (CRUD):** Tambah, kemas kini, padam, dan lihat rekod kuliah dengan mudah.
- **Borang Pintar:** Termasuk muat naik gambar penceramah dan pemilihan lokasi berasaskan peta interaktif.
- **Kuliah Berulang:** Tetapkan kuliah untuk berulang setiap minggu atau bulan sehingga tarikh tamat.
- **Paparan Pelbagai:** Lihat jadual dalam bentuk senarai kad, kalendar bulanan, atau paparan peta geografi.
- **Carian & Tapis:** Cari kuliah dengan pantas dan tapis paparan mengikut status (Akan Datang, Sudah Lepas, Semua).
- **Notifikasi Peringatan:** Dapatkan peringatan di desktop sebelum kuliah bermula (memerlukan kebenaran).
- **Import & Eksport Data:** Bawa data anda masuk (import JSON) dan keluar (eksport ke JSON, CSV, PDF).
- **Fungsi Kongsi:** Kongsi butiran kuliah dengan mudah ke aplikasi media sosial.
- **Sedia Luar Talian (Offline-First):** Direka sebagai Progressive Web App (PWA), aplikasi ini berfungsi sepenuhnya walaupun tanpa sambungan internet.
- **Privasi Terjamin:** Semua data anda disimpan selamat di dalam peranti anda.

## 🛠️ Teknologi Digunakan

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS
- **Peta:** Leaflet.js
- **Eksport PDF:** jsPDF & jsPDF-AutoTable
- **Fungsi Luar Talian:** Service Workers (PWA)
- **Penyimpanan Data:** `localStorage` Pelayar

## 🏛️ Reka Bentuk Seni Bina

Aplikasi ini menggunakan seni bina **sepenuhnya di sisi pelanggan (client-side)**. Tiada *backend* diperlukan, yang menjadikannya sangat pantas, percuma untuk dihoskan, dan mementingkan privasi.

- **State Management:** Komponen `App.tsx` bertindak sebagai sumber kebenaran tunggal (*single source of truth*).
- **Penyimpanan Data:** *Custom hook* `useLocalStorage` digunakan untuk menyegerakkan state aplikasi dengan `localStorage` pelayar secara automatik.
- **Fungsi Luar Talian:** Service Worker (`sw.js`) menyimpan aset-aset utama aplikasi, membolehkannya dimuatkan serta-merta walaupun tanpa internet.

Untuk butiran lanjut, sila rujuk [Seni Bina Aplikasi (seniBinaApp.md)](./seniBinaApp.md).

## 🚀 Roadmap Pembangunan

Aplikasi ini telah melengkapkan Fasa 1 & 2. Perancangan masa depan adalah untuk mengubahnya menjadi platform komuniti.

- **🎯 Fasa 3: Asas Komuniti & Awan:** Memperkenalkan akaun pengguna dan pangkalan data awam.
- **🚀 Fasa 4: Penemuan & Interaksi:** Peta global, profil penceramah, dan sistem langganan.
- **🌟 Fasa 5: Penglibatan Komuniti:** Ulasan, penilaian, dan galeri gambar.

Untuk butiran lanjut, sila rujuk [Roadmap Pembangunan (roadmap.md)](./roadmap.md).
