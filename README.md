# 📝 Dokumentasi Bahasa Pemrograman Sasak

## 1. 🔤 Deklarasi Variabel

Gunakan:

- `aran` untuk string (nama)
- `pire` untuk angka (bilangan)

**Contoh:**

```sasak
aran namaDepan = "Lalu";
pire umur = 16;
```

## 2. 🖨️ Output / Print

Gunakan `leka(...)` untuk menampilkan output.

**Contoh:**

```sasak
leka("Halo Dunia!");
leka("Halo " + namaDepan);
```

## 3. 🧠 Percabangan (if-else)

Gunakan `lamun (kondisi) { ... }` sebagai `if`, dan `saklain { ... }` sebagai `else`.

**Contoh:**

```sasak
lamun (umur >= 17) {
    leka("Dewasa");
} saklain {
    leka("Bocah");
}
```

## 4. ➕ Operasi Matematika

Gunakan operator biasa: `+`, `-`, `*`, `/`, `>=`, `<=`, `==`, `!=`

**Contoh:**

```sasak
pire a = 10;
pire b = 5;
pire hasil = a + b;
leka(hasil);
```

## 5. 🔍 Komentar

Gunakan `//` untuk menambahkan komentar.

**Contoh:**

```sasak
// Ini komentar
leka("Selamat datang!");
```

## 📄 Contoh Program Lengkap

```sasak
aran namaDepan = "Lalu";
pire umur = 16;

leka("Halo " + namaDepan);

lamun (umur >= 17) {
    leka("Dewasa");
} saklain {
    leka("Bocah");
}
```

## 🚀 Cara Menjalankan

1. Simpan program sebagai `contoh.sasak`
2. Jalankan lewat terminal:

```bash
node sasak_interpreter.js contoh.sasak
```

## 💡 Catatan Tambahan

- Interpreter ditulis dalam JavaScript (`Node.js`)
- Evaluasi ekspresi menggunakan `eval`
