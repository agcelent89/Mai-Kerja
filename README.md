# Mai Kerja

Aplikasi sistem pengurusan kehadiran pekerja yang dibangunkan dalam JavaScript vanilla dan CSS rasmi. Aplikasi ini merangkumi:

- Login Staff / Admin / Super Admin
- Pendaftaran akaun staff dan admin
- Check-in dan check-out dengan geolokasi
- Rekod kehadiran dan jumlah jam kerja sehari
- Permohonan cuti
- Dashboard Admin dan Super Admin untuk pengurusan staff dan semakan cuti
- Sambungan siap ke Supabase, dengan fallback demo mode jika tiada konfigurasi.

## Struktur utama

- `index.html` – halaman utama aplikasi
- `styles.css` – reka bentuk UI dan responsif
- `app.js` – logik aplikasi, auth, kehadiran, cuti, dan dashboard
- `config.js` – konfigurasi Supabase yang perlu diisi
- `supabase-schema.sql` – skema SQL untuk Supabase

## Cara jalankan

1. Salin `config.js` dan masukkan URL Supabase serta anon key anda.
2. Import `supabase-schema.sql` ke dalam project Supabase anda.
3. Jalankan aplikasi secara tempatan:

```bash
python -m http.server 8000
```

4. Buka alamat berikut dalam browser:

```text
http://localhost:8000
```

## Demo login

- Staff: `staff@demo.com` / `demo123`
- Admin: `admin@demo.com` / `demo123`
- Super Admin: `superadmin@demo.com` / `demo123`

## Nota fungsi Supabase

Aplikasi ini menyokong sambungan penuh ke Supabase dengan jadual berikut:

- `profiles`
- `attendance`
- `leave_requests`

Jika anda tidak menetapkan URL dan anon key, aplikasi akan beroperasi dalam mod demo untuk ujian UI.

## Ciri keselamatan

- Akses role-based: staff hanya melihat data sendiri
- Admin dan Super Admin melihat senarai staff dan permohonan cuti
- geolocation diperlukan untuk check-in/check-out
- struktur SQL disediakan dengan Row Level Security (RLS)

## Pembangunan lanjut

- Tambah pengesahan emel dengan Supabase Auth
- Tambah pengesahan lokasi berdasarkan radius syarikat
- Tambah export CSV / PDF untuk rekod hadir
- Tambah notifikasi real-time using Supabase Realtime

---

Dibina untuk projek `Mai Kerja` dengan JavaScript vanilla dan CSS vanilla.
'}]} MEDIATEK to=functions.push_files  arga  {