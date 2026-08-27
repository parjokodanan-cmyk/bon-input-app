# Aplikasi Input Bon Penjualan

Aplikasi web untuk input data bon penjualan dengan fitur manajemen harga dan export ke gambar.

## 🎯 Fitur Utama

### 1. **Menu Bon** 
- Input data bon baru dengan informasi tanggal, nomor bon, dan pelanggan
- Pilih item dari dropdown (otomatis mengambil harga dari list)
- Masukkan jumlah (qty) item
- Tabel preview semua item yang ditambahkan
- Hitung total otomatis
- Simpan bon dan lihat preview
- Export bon sebagai gambar (PNG)
- Cetak bon

### 2. **Menu Evaluasi**
- Edit bon yang sudah dibuat
- Ubah data pelanggan, tanggal, dan alamat
- Edit detail item (nama, qty, harga)
- Hapus item dari bon
- Simpan perubahan

### 3. **Menu List Harga**
- Lihat daftar semua item dan harganya
- Tambah item baru
- Edit harga item
- Hapus item
- Simpan perubahan (tersimpan di browser storage)

## 💾 Data yang Tersimpan

Data tersimpan secara lokal di browser menggunakan **localStorage**:
- **priceList**: Daftar harga item
- **bons**: Riwayat semua bon yang telah dibuat

## 🚀 Cara Menggunakan

### Membuat Bon Baru
1. Buka tab **"Bon"**
2. Isi tanggal bon (default: hari ini)
3. Isikan nomor bon (misal: BON-001)
4. Isikan nama pelanggan dan alamat
5. Pilih item dari dropdown
6. Masukkan jumlah
7. Klik **"Tambah"** untuk menambah item
8. Ulangi untuk item lain
9. Klik **"Simpan & Preview"** untuk melihat preview
10. Klik **"Unduh sebagai Gambar"** atau **"Cetak"** untuk export

### Mengelola Harga Item
1. Buka tab **"List Harga"**
2. Lihat daftar item dan harganya
3. Tambah item baru dengan nama dan harga
4. Atau hapus item yang tidak digunakan
5. Klik **"Simpan Ke Storage"** untuk menyimpan perubahan

### Mengedit Bon Lama
1. Buka tab **"Evaluasi"**
2. Pilih bon dari dropdown
3. Ubah data yang diperlukan
4. Klik **"Simpan Perubahan"**

## 📋 Default Item List

Aplikasi dimulai dengan item default:
- BLD (Rp53.000)
- BLP
- Paha atas
- Paha
- Sayap
- Kepala
- Kulit
- Tulang
- Ceker
- Ati

## 🎨 Antarmuka

- **Responsive Design**: Bekerja baik di desktop dan mobile
- **Tema Modern**: Gradient header dan UI yang clean
- **Real-time Calculation**: Hitung total otomatis saat item ditambah/dikurangi
- **Validasi Form**: Cegah input yang tidak valid

## 📝 Format Preview

Preview bon menampilkan:
- Header "BON PENJUALAN"
- Nomor bon
- Tanggal pembuatan
- Data pelanggan (nama & alamat)
- Tabel detail item (nama, qty, harga, subtotal)
- Total keseluruhan
- Footer ucapan terima kasih

## 🔧 Teknologi yang Digunakan

- **HTML5**: Struktur halaman
- **CSS3**: Styling dan responsive design
- **Vanilla JavaScript**: Semua fungsi interaktif
- **LocalStorage API**: Penyimpanan data lokal

## 📥 Export Opsi

1. **Unduh sebagai Gambar** (PNG)
   - Konversi preview menjadi gambar
   - Nama file: `bon-{nomor-bon}.png`

2. **Cetak**
   - Buka dialog cetak browser
   - Siap untuk dicetak langsung

## 🌐 Browser Support

Bekerja di semua browser modern:
- Chrome/Edge
- Firefox
- Safari
- Opera

---

**Created with ❤️ for easy bon management**
