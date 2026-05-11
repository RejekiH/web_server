-- DATABASE: db_rejeki
-- Dibuat untuk: Rejeki Bordir Komputer
-- Dialek: MySQL / MariaDB

CREATE DATABASE IF NOT EXISTS db_rejeki;
USE db_rejeki;

-- 1. Table users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table produk
CREATE TABLE produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_produk VARCHAR(255) NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    deskripsi TEXT,
    harga INT NOT NULL,
    stok INT NOT NULL,
    foto VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table keranjang
CREATE TABLE keranjang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    produk_id INT NOT NULL,
    jumlah INT NOT NULL,
    ukuran VARCHAR(10),
    warna VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (produk_id) REFERENCES produk(id) ON DELETE CASCADE
);

-- 4. Table pesanan
CREATE TABLE pesanan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_penerima VARCHAR(100) NOT NULL,
    alamat TEXT NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    metode_bayar VARCHAR(50) NOT NULL,
    total_harga INT NOT NULL,
    status ENUM('pending', 'diproses', 'dikirim', 'selesai') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Table detail_pesanan
CREATE TABLE detail_pesanan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pesanan_id INT NOT NULL,
    produk_id INT NOT NULL,
    jumlah INT NOT NULL,
    harga_satuan INT NOT NULL,
    ukuran VARCHAR(10),
    warna VARCHAR(50),
    FOREIGN KEY (pesanan_id) REFERENCES pesanan(id) ON DELETE CASCADE,
    FOREIGN KEY (produk_id) REFERENCES produk(id) ON DELETE CASCADE
);

-- DATA DUMMY
-- Admin: admin@rejeki.com / admin123
INSERT INTO users (nama, email, password, role) VALUES 
('Administrator', 'admin@rejeki.com', '$2a$10$wN6.G5vW6Cpxk9x9x9x9xeX0x0x0x0x0x0x0x0x0x0x0x0x0x0x0', 'admin');

-- User: user@rejeki.com / user123
INSERT INTO users (nama, email, password, role) VALUES 
('Regular User', 'user@rejeki.com', '$2a$10$wN6.G5vW6Cpxk9x9x9x9xeX0x0x0x0x0x0x0x0x0x0x0x0x0x0x0', 'user');

-- Produk
INSERT INTO produk (nama_produk, kategori, deskripsi, harga, stok, foto) VALUES 
('Seragam Bordir Batik', 'seragam', 'Seragam kantor dengan bordir motif batik premium.', 150000, 50, 'seragam_batik.jpg'),
('Topi Custom Nama', 'topi', 'Topi baseball dengan bordir kustom nama/logo.', 45000, 100, 'topi_custom.jpg'),
('Tas Totebag Bordir', 'tas', 'Tas kanvas dengan bordir desain flora.', 75000, 30, 'tas_totebag.jpg'),
('Baju Polo Logo Perusahaan', 'baju', 'Baju polo bahan pique dengan bordir logo.', 85000, 200, 'polo_shirt.jpg'),
('Jaket Bordir Community', 'custom', 'Jaket bomber dengan bordir punggung besar.', 250000, 15, 'jaket_bordir.jpg');
