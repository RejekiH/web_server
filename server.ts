import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import db, { initDb } from "./src/db/schema.js";
import bcrypt from "bcryptjs";
import session from "express-session";
import multer from "multer";

declare module 'express-session' {
  interface SessionData {
    userId: any;
    userRole: string;
    userName: string;
  }
}

const app = express();
const PORT = 3000;

// Initialize DB
initDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'rejeki-secret-bordir',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Serve static files
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

// Multer config for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/produk');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- API ROUTES ---

// Authentication
app.post("/api/register", async (req, res) => {
  const { nama, email, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)').run(nama, email, passwordHash, 'user');
    res.json({ success: true, userId: result.lastInsertRowid });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message.includes('UNIQUE') ? 'Email sudah terdaftar' : error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password, role } = req.body;
  const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (user && await bcrypt.compare(password, user.password)) {
    if (role && user.role !== role) {
      return res.status(401).json({ success: false, message: 'Akses ditolak' });
    }
    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.userName = user.nama;
    res.json({ success: true, user: { id: user.id, nama: user.nama, role: user.role, email: user.email } });
  } else {
    res.status(401).json({ success: false, message: 'Email atau password salah' });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get("/api/me", (req, res) => {
  if (req.session.userId) {
    const user: any = db.prepare('SELECT id, nama, email, role FROM users WHERE id = ?').get(req.session.userId);
    res.json({ success: true, user });
  } else {
    res.json({ success: false });
  }
});

// Products
app.get("/api/produk", (req, res) => {
  const { kategori } = req.query;
  let query = 'SELECT * FROM produk';
  const params: any[] = [];
  if (kategori && kategori !== 'semua') {
    query += ' WHERE kategori = ?';
    params.push(kategori);
  }
  query += ' ORDER BY created_at DESC';
  const products = db.prepare(query).all(...params);
  res.json(products);
});

app.get("/api/produk/:id", (req, res) => {
  const product = db.prepare('SELECT * FROM produk WHERE id = ?').get(req.params.id);
  res.json(product);
});

// Admin Product Management
app.post("/api/admin/produk", upload.single('foto'), (req, res) => {
  if (req.session.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { nama_produk, kategori, deskripsi, harga, stok } = req.body;
  const foto = req.file ? req.file.filename : '';
  db.prepare('INSERT INTO produk (nama_produk, kategori, deskripsi, harga, stok, foto) VALUES (?, ?, ?, ?, ?, ?)').run(
    nama_produk, kategori, deskripsi, harga, stok, foto
  );
  res.json({ success: true });
});

app.put("/api/admin/produk/:id", upload.single('foto'), (req, res) => {
  if (req.session.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { nama_produk, kategori, deskripsi, harga, stok } = req.body;
  const product: any = db.prepare('SELECT foto FROM produk WHERE id = ?').get(req.params.id);
  const foto = req.file ? req.file.filename : product.foto;
  db.prepare('UPDATE produk SET nama_produk = ?, kategori = ?, deskripsi = ?, harga = ?, stok = ?, foto = ? WHERE id = ?').run(
    nama_produk, kategori, deskripsi, harga, stok, foto, req.params.id
  );
  res.json({ success: true });
});

app.delete("/api/admin/produk/:id", (req, res) => {
  if (req.session.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  db.prepare('DELETE FROM produk WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Cart
app.get("/api/keranjang", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
  const items = db.prepare(`
    SELECT k.*, p.nama_produk, p.harga, p.foto 
    FROM keranjang k 
    JOIN produk p ON k.produk_id = p.id 
    WHERE k.user_id = ?
  `).all(req.session.userId);
  res.json(items);
});

app.post("/api/keranjang", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
  const { produk_id, jumlah, ukuran, warna } = req.body;
  
  // Check if already in cart
  const existing: any = db.prepare('SELECT id, jumlah FROM keranjang WHERE user_id = ? AND produk_id = ? AND ukuran = ? AND warna = ?').get(
    req.session.userId, produk_id, ukuran, warna
  );

  if (existing) {
    db.prepare('UPDATE keranjang SET jumlah = ? WHERE id = ?').run(existing.jumlah + jumlah, existing.id);
  } else {
    db.prepare('INSERT INTO keranjang (user_id, produk_id, jumlah, ukuran, warna) VALUES (?, ?, ?, ?, ?)').run(
      req.session.userId, produk_id, jumlah, ukuran, warna
    );
  }
  res.json({ success: true });
});

app.put("/api/keranjang/:id", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
  const { jumlah } = req.body;
  db.prepare('UPDATE keranjang SET jumlah = ? WHERE id = ? AND user_id = ?').run(jumlah, req.params.id, req.session.userId);
  res.json({ success: true });
});

app.delete("/api/keranjang/:id", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
  db.prepare('DELETE FROM keranjang WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);
  res.json({ success: true });
});

// Checkout
app.post("/api/checkout", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
  const { nama_penerima, alamat, no_hp, metode_bayar, total_harga } = req.body;
  
  // Start transaction
  const transaction = db.transaction(() => {
    // 1. Create order
    const result = db.prepare(`
      INSERT INTO pesanan (user_id, nama_penerima, alamat, no_hp, metode_bayar, total_harga, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(req.session.userId, nama_penerima, alamat, no_hp, metode_bayar, total_harga, 'pending');
    const orderId = result.lastInsertRowid;

    // 2. Move items from cart to order details
    const cartItems = db.prepare(`
      SELECT k.*, p.harga FROM keranjang k 
      JOIN produk p ON k.produk_id = p.id 
      WHERE k.user_id = ?
    `).all(req.session.userId) as any[];

    const insertDetail = db.prepare(`
      INSERT INTO detail_pesanan (pesanan_id, produk_id, jumlah, harga_satuan, ukuran, warna) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const item of cartItems) {
      insertDetail.run(orderId, item.produk_id, item.jumlah, item.harga, item.ukuran, item.warna);
      // Reduce stock
      db.prepare('UPDATE produk SET stok = stok - ? WHERE id = ?').run(item.jumlah, item.produk_id);
    }

    // 3. Clear cart
    db.prepare('DELETE FROM keranjang WHERE user_id = ?').run(req.session.userId);

    return orderId;
  });

  try {
    const orderId = transaction();
    res.json({ success: true, orderId });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Dashboard stats
app.get("/api/admin/dashboard", (req, res) => {
  if (req.session.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const totalProduk: any = db.prepare('SELECT COUNT(*) as count FROM produk').get();
  const pesananMasuk: any = db.prepare("SELECT COUNT(*) as count FROM pesanan WHERE status = 'pending'").get();
  const pesananSelesai: any = db.prepare("SELECT COUNT(*) as count FROM pesanan WHERE status = 'selesai'").get();
  res.json({
    totalProduk: totalProduk.count,
    pesananMasuk: pesananMasuk.count,
    pesananSelesai: pesananSelesai.count
  });
});

app.get("/api/admin/pesanan", (req, res) => {
  if (req.session.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const orders = db.prepare('SELECT * FROM pesanan ORDER BY created_at DESC').all();
  res.json(orders);
});

app.get("/api/admin/pesanan/:id", (req, res) => {
  if (req.session.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const order: any = db.prepare('SELECT * FROM pesanan WHERE id = ?').get(req.params.id);
  const details = db.prepare(`
    SELECT dp.*, p.nama_produk 
    FROM detail_pesanan dp 
    JOIN produk p ON dp.produk_id = p.id 
    WHERE dp.pesanan_id = ?
  `).all(req.params.id);
  res.json({ ...order, details });
});

app.patch("/api/admin/pesanan/:id/status", (req, res) => {
  if (req.session.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { status } = req.body;
  db.prepare('UPDATE pesanan SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

app.get("/api/admin/users", (req, res) => {
  if (req.session.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const users = db.prepare('SELECT id, nama, email, role, created_at FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

// User orders
app.get("/api/pesanan", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });
  const orders = db.prepare('SELECT * FROM pesanan WHERE user_id = ? ORDER BY created_at DESC').all(req.session.userId);
  res.json(orders);
});

// --- VITE MIDDLEWARE ---
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();
