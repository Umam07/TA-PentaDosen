# 🚀 Team Fortuna - Research Management System (Frontend)
<p align="center"> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" /> <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" /> <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" /> </p>
Frontend aplikasi manajemen penelitian terintegrasi yang dibangun dengan React untuk membantu dosen dalam mengelola proposal, pendanaan, dan publikasi hasil riset secara digital dan transparan.

---

## 📋 Daftar Isi
- [👥 Tim Pengembang](#-tim-pengembang)
- [✨ Fitur Utama](#-fitur-utama)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Keunggulan](#-keunggulan)
- [⚙️ Panduan Instalasi](#️-panduan-instalasi)
  - [Prasyarat](#1-prasyarat)
  - [Clone Repository](#2-clone-repository)
  - [Instalasi Dependencies](#3-instalasi-dependencies)
  - [Konfigurasi Environment](#4-konfigurasi-environment)
- [🚀 Menjalankan Aplikasi](#-menjalankan-aplikasi)
  - [Mode Development](#mode-development)
  - [Mode Production](#mode-production)

---

## 👥 Tim Pengembang (Team DUK)

| Nama | Peran | GitHub |
|------|-------|--------|
| **Kiki Aimar Wicaksana** | Backend Developer |  |
| **Muhammad Syafi'ul Umam** | Frontend Developer | [Umam07](https://github.com/Umam07) |
| **Rafi Daniswara Anggoro Putra** | UI/UX | - |

---

## ✨ Fitur Utama

### 📊 Dashboard Interaktif
- Visualisasi data penelitian dalam bentuk grafik dan statistik
- Ringkasan proposal, pendanaan, dan publikasi
- Notifikasi real-time untuk update status

### 📝 Manajemen Proposal Riset
- Form pengajuan proposal penelitian
- Tracking status proposal (pending, review, approved, rejected)
- Upload dokumen pendukung

### 💰 Pengelolaan Pendanaan
- Monitoring anggaran penelitian
- Pelaporan penggunaan dana

### 📚 Publikasi Hasil Riset
- Katalog publikasi dosen
- Statistik sitasi dan impact factor

### 👥 Multi-role Akses
- **Dosen**: Pengajuan dan monitoring penelitian
- **Administrator**: Manajemen sistem dan user

---

## 🛠️ Tech Stack

### **Core Framework:**
- **React**
- **Vite**
- **TypeScript** 
---

## ⚡ Keunggulan

1. **Performansi Optimal** - Menggunakan Vite untuk build time yang sangat cepat
2. **Responsif** - Design mobile-first dengan Tailwind CSS
3. **Aksesibilitas** - Komponen yang ramah untuk semua pengguna
---

## ⚙️ Panduan Instalasi

### **1. Prasyarat**

Pastikan software berikut sudah terinstal di sistem Anda:

- [Node.js](https://nodejs.org/) (v18 atau lebih baru direkomendasikan)
- [Git](https://git-scm.com/)

### **2. Clone Repository**

```bash
# Clone repository
git clone https://github.com/Umam07/TA-PentaDosen.git

# Masuk ke direktori proyek
cd TA-PentaDosen
```

### **3. Instalasi Dependencies**

```bash
npm install
```

### **4. Konfigurasi Environment**

```bash
# Salin file environment contoh
cp .env.example .env

# Edit file .env sesuai konfigurasi backend API Anda
# Buka file .env di text editor favorit Anda
```

---

## 🚀 Menjalankan Aplikasi

### **Mode Development**

```bash
# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di **http://localhost:5173** (port default Vite).

Browser akan otomatis terbuka. Jika tidak, buka manual di browser favorit Anda.

### **Mode Production**

```bash
# Build aplikasi untuk production
npm run build

# Preview build production secara lokal
npm run preview
```

Build production akan tersedia di folder `dist/`.

---

<p align="center">
  Dibuat dengan ❤️ oleh <strong>Team DUK</strong> 
  <br>
  © 2026 PentaDosen - Research Management System
</p>

---
**Catatan**: Proyek ini dalam pengembangan aktif. Dokumentasi akan diperbarui secara berkala.