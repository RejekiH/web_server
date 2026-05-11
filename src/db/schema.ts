import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'rejeki.db');
const db = new Database(dbPath);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('user', 'admin')) NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS produk (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama_produk TEXT NOT NULL,
      kategori TEXT NOT NULL,
      deskripsi TEXT,
      harga INTEGER NOT NULL,
      stok INTEGER NOT NULL,
      foto TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS keranjang (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      produk_id INTEGER NOT NULL,
      jumlah INTEGER NOT NULL,
      ukuran TEXT,
      warna TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (produk_id) REFERENCES produk(id)
    );

    CREATE TABLE IF NOT EXISTS pesanan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      nama_penerima TEXT NOT NULL,
      alamat TEXT NOT NULL,
      no_hp TEXT NOT NULL,
      metode_bayar TEXT NOT NULL,
      total_harga INTEGER NOT NULL,
      status TEXT CHECK(status IN ('pending', 'diproses', 'dikirim', 'selesai')) NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS detail_pesanan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pesanan_id INTEGER NOT NULL,
      produk_id INTEGER NOT NULL,
      jumlah INTEGER NOT NULL,
      harga_satuan INTEGER NOT NULL,
      ukuran TEXT,
      warna TEXT,
      FOREIGN KEY (pesanan_id) REFERENCES pesanan(id),
      FOREIGN KEY (produk_id) REFERENCES produk(id)
    );
  `);

  // Seed initial data
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@rejeki.com');
  if (!adminExists) {
    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)').run(
      'Administrator',
      'admin@rejeki.com',
      adminPassword,
      'admin'
    );
  }

  const userExists = db.prepare('SELECT id FROM users WHERE email = ?').get('user@rejeki.com');
  if (!userExists) {
    const userPassword = bcrypt.hashSync('user123', 10);
    db.prepare('INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)').run(
      'Regular User',
      'user@rejeki.com',
      userPassword,
      'user'
    );
  }

  const productCount = db.prepare('SELECT COUNT(*) as count FROM produk').get() as { count: number };
  if (productCount.count === 0) {
    const products = [
      ['Seragam Bordir Batik', 'seragam', 'Seragam kantor dengan bordir motif batik premium.', 150000, 50, 'seragam_batik.jpg'],
      ['Topi Custom Nama', 'topi', 'Topi baseball dengan bordir kustom nama/logo.', 45000, 100, 'topi_custom.jpg'],
      ['Tas Totebag Bordir', 'tas', 'Tas kanvas dengan bordir desain flora.', 75000, 30, 'tas_totebag.jpg'],
      ['Baju Polo Logo Perusahaan', 'baju', 'Baju polo bahan pique dengan bordir logo.', 85000, 200, 'polo_shirt.jpg'],
      ['Jaket Bordir Community', 'custom', 'Jaket bomber dengan bordir punggung besar.', 250000, 15, 'jaket_bordir.jpg']
    ];

    const insertProduct = db.prepare('INSERT INTO produk (nama_produk, kategori, deskripsi, harga, stok, foto) VALUES (?, ?, ?, ?, ?, ?)');
    products.forEach(p => insertProduct.run(...p));
  }
}

export default db;
