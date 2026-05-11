import { useState, useEffect, FormEvent } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, LogOut, Menu, X, ChevronRight, Package, Home as HomeIcon, LayoutDashboard, ShoppingBag, Users, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Pages (will create these files shortly)
import Home from "./pages/Home";
import Katalog from "./pages/Katalog";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Konfirmasi from "./pages/Konfirmasi";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProduk from "./pages/admin/AdminProduk";
import AdminPesanan from "./pages/admin/AdminPesanan";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.user);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-batik-cream text-batik-brown">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/katalog" element={<Katalog />} />
            <Route path="/produk/:id" element={<Detail user={user} />} />
            <Route path="/cart" element={<Cart user={user} />} />
            <Route path="/checkout" element={<Checkout user={user} />} />
            <Route path="/konfirmasi/:id" element={<Konfirmasi />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
            <Route path="/admin" element={<AdminLayout user={user} />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="produk" element={<AdminProduk />} />
              <Route path="pesanan" element={<AdminPesanan />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function Navbar({ user, setUser }: { user: any, setUser: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    navigate("/");
  };

  const isAdmin = user?.role === 'admin';
  const showAdminNav = location.pathname.startsWith('/admin') && isAdmin;

  return (
    <nav className="bg-batik-maroon text-white sticky top-0 z-50 border-b-4 border-batik-gold shadow-xl">
      <div className="absolute inset-0 bg-batik opacity-5 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 border-2 border-batik-gold rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-batik-gold rotate-45"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight leading-none uppercase">Rejeki <span className="text-batik-gold">Bordir</span></span>
              <span className="text-batik-gold text-[8px] uppercase tracking-[0.2em] font-bold">Computerized Embroidery</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
            {!showAdminNav ? (
              <>
                <Link to="/" className="hover:text-batik-gold transition-colors">Beranda</Link>
                <Link to="/katalog" className="hover:text-batik-gold transition-colors">Katalog</Link>
                <Link to="/cart" className="relative hover:text-batik-gold transition-colors p-2 border border-white/20 rounded-lg">
                  <ShoppingCart size={18} className="text-batik-gold" />
                </Link>
                {user ? (
                  <div className="flex items-center space-x-6">
                    <span className="text-[10px] opacity-70 tracking-normal capitalize font-sans leading-none">Halo, {user.nama}</span>
                    {isAdmin && <Link to="/admin/dashboard" className="text-[9px] border border-batik-gold text-batik-gold px-2 py-1 hover:bg-batik-gold hover:text-batik-maroon transition-all leading-none">ADMIN</Link>}
                    <button onClick={handleLogout} className="hover:text-batik-gold transition-colors border-l border-white/20 pl-4"><LogOut size={16} /></button>
                  </div>
                ) : (
                  <Link to="/login" className="border border-batik-gold text-batik-gold px-5 py-2 hover:bg-batik-gold hover:text-batik-maroon transition-all text-xs">LOGIN</Link>
                )}
              </>
            ) : (
              <>
                <Link to="/admin/dashboard" className="hover:text-batik-gold">Dashboard</Link>
                <Link to="/admin/produk" className="hover:text-batik-gold">Produk</Link>
                <Link to="/admin/pesanan" className="hover:text-batik-gold">Pesanan</Link>
                <Link to="/admin/users" className="hover:text-batik-gold">Users</Link>
                <button onClick={handleLogout} className="text-batik-gold border border-batik-gold px-4 py-2 text-xs hover:bg-batik-gold hover:text-batik-maroon transition-all">LOGOUT ADMIN</button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-batik-cream">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-batik-brown border-t border-batik-gold border-opacity-20"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsOpen(false)} className="block py-3 border-b border-batik-cream border-opacity-10 text-lg">Beranda</Link>
              <Link to="/katalog" onClick={() => setIsOpen(false)} className="block py-3 border-b border-batik-cream border-opacity-10 text-lg">Katalog</Link>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="block py-3 border-b border-batik-cream border-opacity-10 text-lg flex items-center justify-between">
                Keranjang <ShoppingCart size={20} />
              </Link>
              {user ? (
                <>
                  <div className="pt-4 pb-2 text-batik-gold font-bold italic text-sm">Masuk sebagai {user.nama}</div>
                  {isAdmin && <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block py-2 text-batik-gold">Panel Admin</Link>}
                  <button onClick={handleLogout} className="block w-full text-left py-3 text-batik-maroon font-bold">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block py-4 text-center bg-batik-gold text-batik-brown rounded font-bold mt-4">Login Sekarang</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function AdminLayout({ user }: { user: any }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-batik-gold border-opacity-20">
            <h2 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
              <LayoutDashboard size={20} className="text-batik-gold" /> Panel Admin
            </h2>
            <nav className="space-y-1">
              <AdminNavLink to="/admin/dashboard" icon={<Package size={18} />} label="Dashboard" />
              <AdminNavLink to="/admin/produk" icon={<ShoppingBag size={18} />} label="Kelola Produk" />
              <AdminNavLink to="/admin/pesanan" icon={<Package size={18} />} label="Pesanan Masuk" />
              <AdminNavLink to="/admin/users" icon={<Users size={18} />} label="Data Pengguna" />
            </nav>
          </div>
        </aside>
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="produk" element={<AdminProduk />} />
                <Route path="pesanan" element={<AdminPesanan />} />
                <Route path="users" element={<AdminUsers />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function AdminNavLink({ to, icon, label }: { to: string, icon: any, label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive ? "bg-batik-brown text-batik-cream shadow-md" : "hover:bg-batik-cream text-batik-brown"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function Footer() {
  return (
    <footer className="h-16 border-t border-batik-gold bg-white flex items-center justify-between px-4 sm:px-10 shrink-0 text-[10px] md:text-xs text-batik-brown text-opacity-60 font-medium uppercase tracking-widest relative overflow-hidden">
      <div className="absolute inset-0 bg-batik opacity-5 pointer-events-none"></div>
      <div className="relative z-10 flex items-center gap-2">
        <span className="font-bold">&copy; 2026 REJEKI BORDIR KOMPUTER</span>
        <span className="hidden sm:inline border-l border-batik-brown/20 pl-2">CV. REJEKI BERKAH UTAMA</span>
      </div>
      <div className="relative z-10 flex gap-4 md:gap-8 overflow-x-auto no-scrollbar whitespace-nowrap">
        <span className="flex items-center gap-1 font-bold"><Phone size={12} className="text-batik-gold" /> 0812-3456-7890</span>
        <span className="flex items-center gap-1 font-bold">IG: <span className="text-batik-gold">@REJEKI.BORDIR</span></span>
      </div>
    </footer>
  );
}
