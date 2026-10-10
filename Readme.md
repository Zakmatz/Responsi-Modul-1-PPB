## Deskripsi Proyek

Perpustakaan API merupakan layanan backend yang menyediakan endpoint untuk melakukan operasi CRUD (*Create, Read, Update, Delete*) pada data anggota, buku, dan peminjaman.

Proyek ini menggunakan Node.js dan Express.js sebagai backend, serta Supabase sebagai layanan database PostgreSQL. API dapat diuji menggunakan Postman dan telah di-deploy menggunakan Vercel.

### Tujuan Proyek

- Mengimplementasikan REST API menggunakan Node.js dan Express.js.
- Mengelola data anggota, buku, dan transaksi peminjaman.
- Menghubungkan aplikasi backend dengan database Supabase.
- Mengimplementasikan operasi CRUD melalui endpoint API.
- Menampilkan status peminjaman berdasarkan tanggal jatuh tempo dan tanggal pengembalian.
- Melakukan pengujian API menggunakan Postman serta melakukan deployment ke Vercel.

## Teknologi yang Digunakan

- **Node.js** — lingkungan untuk menjalankan JavaScript pada sisi server.
- **Express.js** — framework untuk membangun REST API.
- **Supabase** — layanan database PostgreSQL.
- **Postman** — alat untuk menguji endpoint API.
- **Vercel** — platform deployment aplikasi.

## Struktur Proyek

```text
perpustakaan-api/
├── src/
│   ├── config/
│   │   └── supabaseClient.js
│   ├── models/
│   │   ├── bookModel.js
│   │   ├── memberModel.js
│   │   └── loanModel.js
│   ├── controllers/
│   │   ├── bookController.js
│   │   ├── memberController.js
│   │   └── loanController.js
│   ├── routes/
│   │   ├── bookRoutes.js
│   │   ├── memberRoutes.js
│   │   └── loanRoutes.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

Keterangan:

- `config/supabaseClient.js`: mengatur koneksi ke Supabase.
- `models/`: menangani operasi data pada database.
- `controllers/`: menangani request, validasi, dan response API.
- `routes/`: mendefinisikan endpoint API.
- `index.js`: menjalankan server Express dan menghubungkan route.
- `.env`: menyimpan konfigurasi lingkungan seperti URL dan key Supabase.

## Struktur Database

Database menggunakan PostgreSQL melalui Supabase dan terdiri dari tiga tabel utama.

### 1. Tabel `members`

| Kolom | Tipe data | Keterangan |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | TEXT | Nama anggota |
| `email` | TEXT | Email anggota, bersifat unik |
| `phone` | TEXT | Nomor telepon |
| `created_at` | TIMESTAMPTZ | Waktu data dibuat |

### 2. Tabel `books`

| Kolom | Tipe data | Keterangan |
|---|---|---|
| `id` | UUID | Primary key |
| `title` | TEXT | Judul buku |
| `author` | TEXT | Penulis buku |
| `isbn` | TEXT | ISBN buku, bersifat unik |
| `stock` | INTEGER | Jumlah stok buku, minimal 0 |
| `created_at` | TIMESTAMPTZ | Waktu data dibuat |

### 3. Tabel `loans`

| Kolom | Tipe data | Keterangan |
|---|---|---|
| `id` | UUID | Primary key |
| `member_id` | UUID | Foreign key ke `members.id` |
| `book_id` | UUID | Foreign key ke `books.id` |
| `loan_date` | DATE | Tanggal peminjaman |
| `due_date` | DATE | Tanggal jatuh tempo |
| `return_date` | DATE | Tanggal pengembalian, dapat bernilai NULL |
| `status` | TEXT | Status transaksi peminjaman |
| `created_at` | TIMESTAMPTZ | Waktu data dibuat |

Relasi database:

- Satu anggota dapat memiliki beberapa transaksi peminjaman.
- Satu buku dapat tercatat dalam beberapa transaksi peminjaman.
- Setiap transaksi peminjaman terhubung dengan satu anggota dan satu buku.

Status peminjaman yang digunakan adalah `Dipinjam`, `Dikembalikan`, dan `Terlambat`. Status dihitung berdasarkan tanggal jatuh tempo dan tanggal pengembalian saat data dibaca melalui API.

## Endpoint API

Semua endpoint menggunakan `/api`.

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/members` | Menampilkan semua anggota |
| GET | `/api/members/:id` | Menampilkan anggota berdasarkan ID |
| POST | `/api/members` | Menambahkan anggota |
| PUT | `/api/members/:id` | Memperbarui anggota |
| DELETE | `/api/members/:id` | Menghapus anggota |
| GET | `/api/books` | Menampilkan semua buku |
| GET | `/api/books/:id` | Menampilkan buku berdasarkan ID |
| POST | `/api/books` | Menambahkan buku |
| PUT | `/api/books/:id` | Memperbarui buku |
| DELETE | `/api/books/:id` | Menghapus buku |
| GET | `/api/loans` | Menampilkan semua transaksi peminjaman |
| GET | `/api/loans/:id` | Menampilkan transaksi berdasarkan ID |
| POST | `/api/loans` | Membuat transaksi peminjaman |
| PUT | `/api/loans/:id` | Memperbarui transaksi atau mencatat pengembalian |
| DELETE | `/api/loans/:id` | Menghapus transaksi peminjaman |

Filter status peminjaman tersedia melalui query parameter:

- `/api/loans?status=Dipinjam`
- `/api/loans?status=Dikembalikan`
- `/api/loans?status=Terlambat`

## Contoh Request dan Response

### 1. Menambahkan Anggota

**Request**
Body:

```json
{
  "name": "Andi Pratama",
  "email": "andi.pratama@suki.com",
  "phone": "081234567801"
}
```

**Contoh response**

```json
{
  "success": true,
  "message": "Anggota berhasil ditambahkan",
  "data": {
    "id": "UUID_ANGGOTA",
    "name": "Andi Pratama",
    "email": "andi.pratama@example.com",
    "phone": "081234567801"
  }
}
```

### 2. Menambahkan Buku

**Request**
Body:

```json
{
  "title": "Laskar Pelangi",
  "author": "Andrea Hirata",
  "isbn": "9789793062792",
  "stock": 5
}
```

**Contoh response**

```json
{
  "success": true,
  "data": {
    "id": "UUID_BUKU",
    "title": "Laskar Pelangi",
    "author": "Andrea Hirata",
    "isbn": "9789793062792",
    "stock": 5
  }
}
```

### 3. Membuat Peminjaman

**Request**
Body:

```json
{
  "member_id": "UUID_ANGGOTA",
  "book_id": "UUID_BUKU",
  "due_date": "2026-10-20"
}
```

Ganti UUID dengan ID anggota dan buku yang dari database.

**Contoh response**

```json
{
  "success": true,
  "message": "Peminjaman berhasil ditambahkan",
  "data": {
    "id": "UUID_PEMINJAMAN",
    "member_id": "UUID_ANGGOTA",
    "book_id": "UUID_BUKU",
    "loan_date": "2026-10-10",
    "due_date": "2026-10-20",
    "return_date": null,
    "status": "Dipinjam"
  }
}
```

### 4. Menampilkan Transaksi Peminjaman

**Request**

```http
GET /api/loans
```

Endpoint ini menampilkan data peminjaman, termasuk informasi anggota dan buku yang berelasi, sesuai implementasi model.

### 5. Mencatat Pengembalian Buku

**Request**

```http
PUT /api/loans/UUID_PEMINJAMAN
Content-Type: application/json
```

Body:

```json
{
  "status": "Dikembalikan"
}
```

Ganti `UUID_PEMINJAMAN` dengan ID transaksi yang valid.

Response yang diharapkan menunjukkan bahwa pengembalian berhasil diproses dan status transaksi menjadi `Dikembalikan`.

## Instalasi dan Menjalankan Secara Lokal

Pastikan Node.js, npm, Git, akun Supabase, dan Postman sudah tersedia.

### 1. Clone Repository

```bash
git clone https://github.com/Zakmatz/Responsi-Modul-1-PPB.git
cd perpustakaan-api
```

### 2. Instal Dependensi

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env` di direktori utama proyek:

```env
SUPABASE_URL=https://PROJECT_ID.supabase.co
SUPABASE_KEY=SUPABASE_PUBLISHABLE_ATAU_ANON_KEY
PORT=3000
```

### 4. Siapkan Database

Buat tabel `members`, `books`, dan `loans` di Supabase sesuai struktur database di atas. Pastikan relasi foreign key dan izin akses database telah dikonfigurasi.

Buat tabel database menggunakan kode untuk SQL Editor dibawah ini :
```
-- 1. Tabel anggota perpustakaan
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel buku
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  stock INTEGER NOT NULL DEFAULT 0
    CHECK (stock >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel transaksi peminjaman
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id),
  book_id UUID NOT NULL REFERENCES books(id),
  loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  status TEXT NOT NULL DEFAULT 'Dipinjam'
    CHECK (
      status IN ('Dipinjam', 'Dikembalikan', 'Terlambat')
    ),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk pencarian transaksi berdasarkan status
CREATE INDEX idx_loans_status ON loans(status);
```

### 5. Jalankan Server

Untuk mode pengembangan:

```bash
npm run dev
```

Jika server berjalan dengan benar, API lokal dapat diakses melalui:

```text
http://localhost:3000
```

### 6. Uji Menggunakan Postman

Gunakan URL lokal berikut untuk pengujian:

```text
GET http://localhost:3000/api/members
GET http://localhost:3000/api/books
GET http://localhost:3000/api/loans
```

Untuk request POST dan PUT, pilih **Body → raw → JSON** dan masukkan data sesuai contoh request.

## Deployment Vercel

Aplikasi telah di-deploy menggunakan Vercel.

**URL Deployment:** (https://responsi-modul-1-ppb-six.vercel.app/)

Contoh pengujian endpoint setelah deployment:

```text
GET https://https://responsi-modul-1-ppb-six.vercel.app/api/members
GET https://https://responsi-modul-1-ppb-six.vercel.app/api/books
GET https://https://responsi-modul-1-ppb-six.vercel.app/api/loans
```
