# Prototipe Aplikasi e-Presensi Mobile

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux">
</p>

Prototipe aplikasi presensi elektronik (e-Presensi) berbasis mobile yang dikembangkan menggunakan React Native & Expo. Proyek ini dirancang sebagai solusi fungsional untuk mendemonstrasikan kelayakan sistem presensi mobile yang modern, aman, dan akurat.

---

## Daftar Isi
- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Tumpukan Teknologi](#tumpukan-teknologi)
- [Tampilan Aplikasi](#tampilan-aplikasi)
- [Unduh & Coba Aplikasi](#unduh--coba-aplikasi)
- [Menjalankan Proyek Secara Lokal](#menjalankan-proyek-secara-lokal)

## Tentang Proyek

Aplikasi e-Presensi ini adalah sebuah prototipe fungsional yang dibangun untuk menunjukkan bagaimana sebuah sistem presensi mobile dapat diimplementasikan dengan penekanan kuat pada validitas dan keamanan data. Aplikasi ini mencakup alur kerja presensi yang komprehensif, mulai dari autentikasi pengguna hingga pencatatan kehadiran harian dengan berbagai mekanisme pengecekan.

## Fitur Utama

- **📍 Validasi Lokasi & Waktu Akurat:** Menggunakan GPS dan formula Haversine untuk _geofencing_ (radius 50m) serta sinkronisasi waktu dengan NTP server.
- **🔐 Deteksi Keamanan:** Mampu mendeteksi dan menolak presensi jika penggunaan **lokasi palsu (mock location)** atau **perangkat yang telah di-root** teridentifikasi.
- **✈️ Pencatatan Perjalanan Dinas:** Fitur untuk melakukan presensi dengan status perjalanan dinas beserta input keterangan.
- ** biometric: Autentikasi Biometrik:** Lapisan keamanan tambahan menggunakan sidik jari atau pengenalan wajah saat melakukan aksi presensi.
- **📖 Riwayat & Filter Presensi:** Menampilkan daftar riwayat kehadiran yang dapat difilter berdasarkan periode waktu (mingguan/bulanan).
- **📊 Ringkasan Data (Infocard):** Menampilkan data agregat seperti jumlah total kehadiran dan perjalanan dinas dalam satu bulan.
- **⚛️ Manajemen State Terpusat:** Menggunakan Redux Toolkit untuk mengelola state aplikasi secara konsisten dan efisien.

## Tumpukan Teknologi

- **Frontend (Mobile):** React Native, Expo
- **Manajemen State:** Redux Toolkit
- **Navigasi:** React Navigation
- **Layanan Backend:** Firebase Authentication, Firebase Realtime Database
- **Bahasa:** JavaScript (ES6+)

## Tampilan Aplikasi

Berikut adalah beberapa tampilan dari antarmuka pengguna aplikasi.

<table align="center">
 <tr>
    <td align="center"><b>Layar Login</b></td>
    <td align="center"><b>Layar Utama (Siap Check-in)</b></td>
 </tr>
 <tr>
    <td>
      <!-- Paste gambar Anda di GitHub, lalu salin URL-nya ke src di bawah ini -->
      <img src="https://github.com/user-attachments/assets/84828c04-ff2a-4375-8bac-7160809b1701" alt="Layar Login" width="300"/>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/da0d3ba5-9eda-49de-91ae-ad474fd2b640" alt="Layar Utama" width="300"/>
    </td>
 </tr>
 <tr>
    <td align="center"><b>Modal Perjalanan Dinas</b></td>
    <td align="center"><b>Halaman Riwayat & Filter</b></td>
 </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/dcb38e43-359c-4145-ac18-ff4e74fbc40e" alt="Modal Dinas" width="300"/>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/78699dd3-efcb-4aa8-b299-a3801253196d" alt="Halaman Riwayat" width="300"/>
    </td>
 </tr>
</table>


## Unduh & Coba Aplikasi

Versi `.apk` untuk Android dapat diunduh melalui halaman **Releases** di repositori ini.

**[➡️ Klik di sini untuk mengunduh APK dari Halaman Releases](https://github.com/shinshARK/epresensi/releases)** 

## Menjalankan Proyek Secara Lokal

Untuk menjalankan proyek ini di lingkungan pengembangan lokal, ikuti langkah-langkah berikut:

1.  **Clone repositori ini**
    ```bash
    git clone https://github.com/shinshARK/epresensi.git
    cd epresensi
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Konfigurasi Firebase**
    - Buka file `constants/firebase.js`.
    - Masukkan kredensial `apiKey` dan `databaseURL` (RTDB) Anda dari proyek Firebase yang telah Anda buat.

4.  **Jalankan aplikasi menggunakan Expo**
    ```bash
    npx expo start
    ```
    Pindai QR code yang muncul menggunakan aplikasi Expo Go di perangkat mobile Anda.

---
