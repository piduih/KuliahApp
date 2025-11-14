# Roadmap Pembangunan Aplikasi "Rekod Kuliah"

Aplikasi ini telah berjaya melengkapkan Fasa 1 dan 2, menjadikannya sebuah alat pengurusan kuliah peribadi yang sangat berkuasa, berfungsi di luar talian, dan kaya dengan ciri-ciri canggih. Roadmap ini menggariskan langkah-langkah seterusnya untuk mengubahnya menjadi platform komuniti yang bertenaga dan bermanfaat untuk semua.

---

## ✅ Fasa 1: Penambahbaikan Teras & Pengalaman Pengguna (SELESAI)

Semua sasaran dalam fasa ini telah dicapai sepenuhnya. Aplikasi kini mempunyai asas yang kukuh dan pengalaman pengguna yang lancar.

1.  **Fungsi Carian & Tapis:** Telah dilaksanakan. Pengguna boleh mencari kuliah dengan mudah dan menapis paparan mengikut status (akan datang, lepas, semua).
2.  **Paparan Kalendar:** Telah dilaksanakan. Paparan kalendar interaktif menyediakan gambaran visual jadual bulanan.
3.  **Penambahbaikan Antara Muka (UI):** Telah dilaksanakan. Aplikasi menggunakan reka letak yang kemas, responsif, dan mempunyai maklum balas visual yang baik.
4.  **Status PWA (Progressive Web App):** Telah dilaksanakan. Aplikasi boleh dipasang pada skrin utama peranti dan diakses di luar talian, memberikan pengalaman seperti aplikasi natif.

---

## ✅ Fasa 2: Ciri-ciri Lanjutan & Pengkongsian (SELESAI)

Ciri-ciri yang lebih kompleks untuk meningkatkan produktiviti dan membolehkan perkongsian maklumat telah berjaya dibangunkan.

1.  **Kuliah Berulang:** Telah dilaksanakan. Pengguna boleh menjimatkan masa dengan menetapkan kuliah untuk berulang setiap minggu atau bulan.
2.  **Fungsi Notifikasi:** Telah dilaksanakan. Sistem peringatan membantu pengguna agar tidak terlepas kuliah yang penting.
3.  **Eksport & Kongsi:** Telah dilaksanakan. Pengguna boleh berkongsi butiran kuliah individu melalui aplikasi sosial dan mengeksport senarai kuliah ke format PDF atau CSV.

---

## 🎯 Fasa 3: Asas Komuniti & Awan (Community & Cloud Foundation)

Ini adalah lonjakan terbesar. Matlamat fasa ini adalah untuk memecahkan batasan storan tempatan (`localStorage`) dan membina infrastruktur *backend* untuk semua ciri komuniti akan datang.

1.  **Akaun Pengguna & Sinkronisasi Awan:**
    *   **Apa:** Menggantikan `useLocalStorage` dengan sistem pangkalan data awan (cth: Firebase Firestore, Supabase). Melaksanakan fungsi pendaftaran dan log masuk (cth: guna Google Auth).
    *   **Kenapa:** Ini adalah langkah paling kritikal. Ia membolehkan pengguna mengakses jadual mereka dari **mana-mana peranti**, memastikan data tidak hilang jika peranti rosak, dan membuka pintu untuk perkongsian data antara pengguna.

2.  **Pangkalan Data Kuliah Awam:**
    *   **Apa:** Menambah pilihan "Peribadi" (hanya anda boleh lihat) atau "Awam" (semua pengguna boleh lihat) semasa menambah kuliah.
    *   **Kenapa:** Ini adalah permulaan kepada pangkalan data komuniti. Pengguna (seperti AJK Masjid) boleh mula menyumbang jadual kuliah untuk manfaat semua, tanpa memerlukan ciri yang kompleks lagi.

---

## 🚀 Fasa 4: Penemuan & Interaksi (Discovery & Interaction)

Setelah data boleh dikongsi di awan, fasa ini memberi tumpuan untuk membantu pengguna **menemui** kandungan tersebut dan **berinteraksi** dengannya secara bermakna.

1.  **Integrasi Peta Lanjutan:**
    *   **Apa:** Mewujudkan satu paparan peta khas yang memaparkan semua kuliah "Awam". Menambah fungsi "Cari Berdekatan Saya" menggunakan geolokasi peranti.
    *   **Kenapa:** Mengubah cara pengguna mencari kuliah. Daripada hanya mencari apa yang mereka sudah tahu, mereka boleh meneroka kuliah yang ada di sekeliling mereka.

2.  **Profil Penceramah & Lokasi:**
    *   **Apa:** Menjadikan nama penceramah dan lokasi boleh diklik, membawa pengguna ke halaman profil khas yang menyenaraiskan semua kuliah (akan datang dan lepas) untuk penceramah atau lokasi tersebut.
    *   **Kenapa:** Memberi nilai tambah yang besar. Pengguna boleh melihat keseluruhan jadual sesebuah masjid atau mengikuti semua kuliah penceramah kegemaran mereka dengan mudah.

3.  **Sistem Langganan ("Ikuti"):**
    *   **Apa:** Pada halaman profil penceramah/lokasi, menambah butang "Ikuti" (Follow). Pengguna akan menerima notifikasi apabila ada kuliah baharu daripada langganan mereka.
    *   **Kenapa:** Meningkatkan penglibatan pengguna secara drastik dan memastikan mereka sentiasa kembali ke aplikasi untuk maklumat yang relevan bagi mereka.

---

## 🌟 Fasa 5: Penglibatan Komuniti & Pemantapan (Community Engagement & Polish)

Fasa ini membina ciri-ciri sosial yang menggalakkan interaksi antara pengguna dan menjadikan platform lebih matang serta dipercayai.

1.  **Ulasan & Penilaian:**
    *   **Apa:** Selepas satu kuliah tamat, benarkan pengguna untuk memberi penarafan (rating) dan ulasan ringkas.
    *   **Kenapa:** Menambah elemen bukti sosial (*social proof*). Ulasan yang baik boleh menarik lebih ramai orang ke kuliah akan datang dan membantu pengguna lain memilih kuliah yang berkualiti.

2.  **Galeri Gambar Kuliah:**
    *   **Apa:** Benarkan AJK Masjid atau pengguna yang disahkan untuk memuat naik beberapa keping gambar selepas kuliah berlangsung. Gambar ini akan dipaparkan di halaman butiran kuliah yang lepas.
    *   **Kenapa:** Menjadikan aplikasi lebih hidup dan visual. Ia mewujudkan satu arkib visual aktiviti pengimarahan masjid dan surau.

3.  **Carian Global & Penapisan Lanjutan:**
    *   **Apa:** Menaik taraf fungsi carian untuk mencari dalam keseluruhan pangkalan data kuliah awam. Menambah penapis lanjutan seperti carian mengikut negeri, daerah, atau julat tarikh.
    *   **Kenapa:** Apabila data semakin banyak, keupayaan untuk mencari dengan tepat dan pantas menjadi sangat penting untuk pengalaman pengguna.
