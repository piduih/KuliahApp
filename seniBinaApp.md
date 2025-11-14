# Reka Bentuk Seni Bina Aplikasi "Rekod Kuliah"

Ini adalah penerangan terperinci dan diagram teks mengenai reka bentuk seni bina (architecture) untuk aplikasi "Rekod Kuliah".

### Falsafah Teras: **Aplikasi Sisi Pelanggan (Client-Side) & Mengutamakan Luar Talian (Offline-First)**

Aplikasi ini direka bentuk sepenuhnya untuk berjalan di dalam pelayar web pengguna. Tiada *backend* atau pangkalan data di awan. Semua data dan logik aplikasi berada pada peranti pengguna, yang memberikan beberapa kelebihan utama:

1.  **Sangat Pantas:** Tiada masa menunggu untuk berhubung dengan pelayan. Semua operasi berlaku serta-merta.
2.  **Berfungsi Luar Talian:** Pengguna boleh menambah, melihat, atau mengedit jadual kuliah walaupun tanpa sambungan internet.
3.  **Privasi Terjamin:** Semua data jadual disimpan secara peribadi di dalam storan tempatan pelayar pengguna.
4.  **Kos Sifar:** Tidak memerlukan kos untuk penyenggaraan pelayan atau pangkalan data.

### Rajah Seni Bina Aplikasi

Berikut adalah "lukisan" bagaimana komponen-komponen aplikasi ini disusun dan berinteraksi antara satu sama lain:

```
┌──────────────────────────────────────────┐
│              Pelayar Web (Browser)       │
└────────────────────┬─────────────────────┘
                     │
┌────────────────────▼─────────────────────┐
│      Progressive Web App (PWA) Layer     │
│  ┌─────────────────┐ ┌─────────────────┐ │
│  │ manifest.json   │ │ sw.js (Service  │ │
│  │ (Install & App  │ │    Worker)      │ │
│  │      Info)      │ │ (Offline Cache) │ │
│  └─────────────────┘ └─────────────────┘ │
└────────────────────┬─────────────────────┘
                     │
┌────────────────────▼─────────────────────┐
│          Aplikasi React (index.tsx)      │
└────────────────────┬─────────────────────┘
                     │
┌────────────────────▼─────────────────────┐
│          App.tsx (Komponen Induk)        │
│ ┌──────────────────────────────────────┐ │
│ │ State Utama:                         │ │
│ │  - lectures[] (Senarai Kuliah)       │ │
│ │  - editingLecture, searchTerm,       │ │
│ │    viewMode, dll.                    │ │
│ ├──────────────────────────────────────┤ │
│ │ Logik Utama:                         │ │
│ │  - addLecture(), updateLecture(),    │ │
│ │    deleteLecture(), carian, tapis    │ │
│ └───────────┬──────────────────────────┘ │
└─────────────┼────────────────────────────┘
              │                              
┌─────────────┼────────────────────────────┐
│             │                            │
│ ┌───────────▼────────────┐  ┌────────────▼───────────┐
│ │   useLocalStorage Hook │  │ Notification API       │
│ └───────────┬────────────┘  └────────────────────────┘
│             │
│ ┌───────────▼────────────┐
│ │ Browser localStorage   │
│ │ (Penyimpanan Data)     │
│ └────────────────────────┘
│
└─────────────┬────────────────────────────┐
              │ Render Komponen Anak       │
              ├────────────────────────────┤
┌─────────────▼─────────────┐ ┌────────────▼───────────┐ ┌────────────────────▼────────────────────┐
│     LectureForm.tsx       │ │    Controls & Filters    │ │        Conditional Viewport           │
│ (Borang Tambah/Kemaskini) │ │ (Carian, Tapis, Tukar   │ │  (Berdasarkan `viewMode` state)       │
└───────────────────────────┘ │         Paparan)         │ │                                       │
                              └──────────────────────────┘ │ ┌──────────► LectureCard.tsx (List)  │
                                                           │ │                                     │
                                                           │ ├──────────► CalendarView.tsx        │
                                                           │ │                                     │
                                                           │ └──────────► MapView.tsx             │
                                                           └───────────────────────────────────────┘
```

### Pecahan Komponen Utama:

1.  **Lapisan PWA (`manifest.json` & `sw.js`):**
    *   Ini adalah lapisan paling luar yang mengubah laman web ini menjadi sebuah "aplikasi".
    *   `manifest.json` memberitahu pelayar bagaimana aplikasi ini harus kelihatan dan berkelakuan apabila dipasang pada peranti.
    *   `sw.js` (Service Worker) bertindak sebagai proksi antara aplikasi dan rangkaian. Ia menyimpan aset-aset penting (seperti kod dan ikon) secara proaktif. Apabila pengguna membuka aplikasi di luar talian, Service Worker akan menghidangkan aset dari *cache*, membolehkan aplikasi berfungsi sepenuhnya.

2.  **Komponen Induk (`App.tsx`):**
    *   Ini adalah "otak" kepada aplikasi. Ia memegang semua state utama, termasuk senarai penuh kuliah.
    *   Semua fungsi untuk mengubah data (menambah, mengedit, memadam) terletak di sini.
    *   Ia kemudiannya menghantar data dan fungsi-fungsi ini kepada komponen anak sebagai `props`. Ini adalah corak reka bentuk React yang dipanggil "lifting state up".

3.  **Pengurusan Data (`useLocalStorage.ts`):**
    *   Ini adalah *custom hook* yang sangat penting. Setiap kali state `lectures` dalam `App.tsx` berubah, hook ini secara automatik akan menyimpan versi terbaharu ke dalam `localStorage` pelayar.
    *   Apabila aplikasi dimuatkan semula, hook ini akan membaca data dari `localStorage` untuk memulihkan state sebelumnya, memastikan tiada data yang hilang.

4.  **Komponen Paparan & Interaksi:**
    *   **`LectureForm.tsx`**: Borang pintar yang menguruskan input pengguna. Ia berkomunikasi kembali dengan `App.tsx` untuk menambah atau mengemas kini data.
    *   **`LectureCard.tsx`, `CalendarView.tsx`, `MapView.tsx`**: Ini adalah komponen "presentational". Tugas utama mereka adalah untuk memaparkan data kuliah dalam format yang berbeza (senarai, kalendar, peta). Mereka menerima data daripada `App.tsx` dan tidak mengubahnya secara langsung.
    *   **Modal (`ConfirmationModal.tsx`, `LocationPickerModal.tsx`)**: Komponen yang muncul di atas skrin untuk tugas-tugas spesifik seperti pengesahan pemadaman atau pemilihan lokasi, memberikan pengalaman pengguna yang lebih fokus.

### Kaitan dengan `roadmap.md`

Seni bina semasa ini **sangat sesuai dan cemerlang** untuk **Fasa 1 dan Fasa 2** dalam roadmap. Ia pantas, percuma, dan amat berkesan sebagai alat pengurusan peribadi.

Untuk bergerak ke **Fasa 3 (Asas Komuniti & Awan)**, seni bina ini perlu berkembang dengan ketara:

*   **`useLocalStorage` akan digantikan** dengan modul yang berinteraksi dengan pangkalan data awan (seperti Firebase/Supabase).
*   **Akan wujud sebuah *Backend/Server*** untuk menguruskan akaun pengguna, pengesahan (authentication), dan logik perniagaan yang lebih kompleks.
*   Aplikasi ini akan beralih dari model **"Client-Only"** kepada model **"Client-Server"**.

Seni bina semasa adalah asas yang kukuh untuk membina ciri-ciri masa depan ini.
