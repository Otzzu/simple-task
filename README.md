# Simple Task Management Board

Aplikasi Fullstack Kanban Board sederhana untuk mengelola tugas dengan status "To Do", "In Progress", dan "Done". Proyek ini dibangun menggunakan arsitektur Monorepo yang terdiri dari Backend (Express.js), Frontend (React + Vite), dan Database (PostgreSQL), yang semuanya dibungkus menggunakan Docker.

## Tech Stack

**Frontend:**
* React.js + Vite (TypeScript)
* Tailwind CSS & Shadcn UI (Styling)
* @hello-pangea/dnd (Drag and Drop)
* Axios (API Consumption)

**Backend:**
* Node.js & Express.js (TypeScript)
* PostgreSQL (Database)
* Sequelize (ORM & Migrations)

**Infrastructure:**
* Docker & Docker Compose

---

## Environment Variables

Sebelum menjalankan aplikasi, pastikan Anda mengatur variabel lingkungan.

1. Buat file `.env` di dalam folder `be/` (Backend). Anda bisa menyalin dari `be/.env.example` yang tersedia kemudian isi dengan value yang sesuai (ini environment untuk backend dan juga database).

2.  Buat file `.env` di dalam folder `fe/` (Frontend). Lakukan cara yang sama juga dengan backend dengan cara copy `fe/.env.example` kemudian isi dengan value yang sesuai.


-----

## Cara Menjalankan (One Command Setup)

Sesuai persyaratan, aplikasi ini dapat dijalankan sepenuhnya hanya dengan satu perintah Docker Compose. Perintah ini akan:

1.  Membangun image Backend & Frontend.
2.  Menyalakan Database PostgreSQL.
3.  Menjalankan **Database Migrations** & **Seeders** secara otomatis.
4.  Menyajikan aplikasi siap pakai.

Jalankan perintah berikut di terminal (root folder):

```bash
docker-compose up --build
```

Tunggu hingga proses build selesai.

-----

## Akses Aplikasi

Setelah container berjalan, Anda dapat mengakses aplikasi melalui alamat default berikut:

  * **Frontend (Kanban Board):** [http://localhost:5173](=http://localhost:5173)
  * **Backend API:** [http://localhost:3000](http://localhost:3000)
  * **Database (Akses dari Host):** `localhost:5433` 

-----

## Fitur Utama

  * **Kanban Board:** Visualisasi tugas dalam 3 kolom status.
  * **Drag & Drop:** Pindahkan tugas antar kolom (status) dengan mudah menggunakan drag-and-drop.
  * **CRUD Tasks:** Membuat, Membaca, Memperbarui, dan Menghapus tugas.
  * **Validasi & Error Handling:** Validasi input yang ketat dan notifikasi error dengan toaster.
  * **Persistence:** Data tersimpan aman di PostgreSQL dan tidak hilang saat restart (Docker Volume).

-----

## Struktur Proyek

```
.
├── be/                         # BACKEND (Express + TS)
│   ├── config/                 # Konfigurasi Database (Sequelize CLI)
│   ├── migrations/             # File Migrasi Database
│   ├── seeders/                # Data Dummy Awal
│   ├── src/
│   │   ├── configs/            # Koneksi Database Instance
│   │   ├── controllers/        # Logika Bisnis (CRUD & Grouping)
│   │   ├── middlewares/        # Error Handler & Validasi
│   │   ├── models/             # Definisi Model & Validasi Schema
│   │   ├── routes/             # Definisi Endpoint API
│   │   └── utils/              # Helper Class atau helper function
│   ├── .env.example            # Template Environment Variables
│   └── Dockerfile              # Konfigurasi Docker Backend
│
├── fe/                         # FRONTEND (React + Vite)
│   ├── src/
│   │   ├── api/                # Konfigurasi Axios Client
│   │   ├── components/
│   │   │   ├── kanban/         # Komponen Utama Board & Drag-Drop
│   │   │   ├── ui/             # Komponen Reusable (Shadcn UI)
│   │   │   └── ...             # Modal & Komponen Lainnya
│   │   ├── lib/                # Utilitas (Tailwind Merge, dll)
│   │   ├── types/              # Definisi Tipe TypeScript Global
│   │   ├── App.tsx             # Main Layout & Logic
│   │   └── main.tsx            # Entry Point
│   ├── nginx.conf              # Konfigurasi Nginx Production
│   ├── .env.example            # Template Environment Variables
│   └── Dockerfile              # Konfigurasi Docker Frontend
│
├── docker-compose.yaml         # Orkestrasi Seluruh Service
└── README.md                   # Dokumentasi Proyek
```