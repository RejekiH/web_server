import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart({ user }: { user: any }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchItems();
  }, [user]);

  const fetchItems = () => {
    fetch("/api/keranjang")
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  };

  const updateQuantity = async (id: number, delta: number) => {
    const item = items.find(i => i.id === id);
    const newQty = item.jumlah + delta;
    if (newQty < 1) return;
    
    await fetch(`/api/keranjang/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jumlah: newQty })
    });
    fetchItems();
  };

  const removeItem = async (id: number) => {
    await fetch(`/api/keranjang/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const subtotal = items.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-batik-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-serif font-black text-batik-brown mb-12">Keranjang <span className="text-batik-gold">Belanja</span></h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center shadow-xl border border-batik-gold border-opacity-10">
            <div className="w-24 h-24 bg-batik-cream rounded-full flex items-center justify-center text-batik-gold mx-auto mb-8">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-batik-brown mb-4">Keranjang Kosong</h2>
            <p className="text-batik-brown text-opacity-60 mb-10">Sepertinya Anda belum memilih produk untuk dibordir.</p>
            <Link to="/katalog" className="bg-batik-brown text-batik-cream px-10 py-4 rounded-full font-bold hover:bg-batik-maroon transition-all shadow-lg inline-block">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* List Items */}
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-6 rounded-[32px] shadow-sm flex flex-col sm:flex-row items-center gap-6 border border-batik-gold border-opacity-10"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                      <img 
                        src={item.foto ? (item.foto.startsWith('http') ? item.foto : `/uploads/produk/${item.foto}`) : "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=200"} 
                        alt={item.nama_produk} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="font-serif text-lg font-bold text-batik-brown mb-1">{item.nama_produk}</h3>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-bold text-batik-brown text-opacity-50 mb-3">
                        <span className="bg-batik-cream px-3 py-1 rounded-full">Ukuran: {item.ukuran}</span>
                        <span className="bg-batik-cream px-3 py-1 rounded-full">Warna: {item.warna}</span>
                      </div>
                      <div className="text-batik-maroon font-black">Rp {item.harga.toLocaleString('id-ID')}</div>
                    </div>
                    <div className="flex items-center gap-4 bg-batik-cream p-1 rounded-2xl">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-xl transition-colors"><Minus size={14} /></button>
                      <span className="w-6 text-center font-bold">{item.jumlah}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-xl transition-colors"><Plus size={14} /></button>
                    </div>
                    <div className="text-right sm:min-w-[120px]">
                      <div className="text-lg font-black text-batik-brown">Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</div>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-3 text-batik-maroon hover:bg-red-50 rounded-2xl transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-4">
              <div className="bg-batik-brown text-batik-cream p-10 rounded-[40px] shadow-2xl sticky top-28 overflow-hidden relative">
                <div className="absolute inset-0 bg-batik opacity-5"></div>
                <h2 className="font-serif text-2xl font-bold mb-8 relative">Ringkasan Pesanan</h2>
                <div className="space-y-4 mb-8 relative">
                  <div className="flex justify-between text-opacity-70">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-opacity-70">
                    <span>Biaya Layanan</span>
                    <span>Rp 0</span>
                  </div>
                  <div className="pt-4 border-t border-batik-cream border-opacity-10 flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span className="text-batik-gold">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <Link to="/checkout" className="w-full bg-batik-gold text-batik-brown h-16 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg relative">
                  Lanjut ke Checkout <ArrowRight size={20} />
                </Link>
                <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-opacity-50 relative">
                  Bordir Komputer Premium &bull; Solo, Indonesia
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
