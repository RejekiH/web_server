import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Katalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("semua");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/produk?kategori=${category}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, [category]);

  const categories = [
    { id: "semua", label: "Semua Produk" },
    { id: "baju", label: "Baju / Kaos" },
    { id: "topi", label: "Topi & Aksesoris" },
    { id: "tas", label: "Tas / Totebag" },
    { id: "seragam", label: "Seragam Kantor" },
    { id: "custom", label: "Custom Design" }
  ];

  return (
    <div className="bg-batik-cream min-h-screen pb-20">
      {/* Header */}
      <header className="bg-batik-maroon text-white py-16 relative overflow-hidden border-b-4 border-batik-gold">
        <div className="absolute inset-0 bg-batik opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 relative text-center">
          <div className="w-12 h-12 border-2 border-batik-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-6 h-6 bg-batik-gold rotate-45"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black mb-4 uppercase italic">KOLEKSI <span className="text-batik-gold not-italic">UNGGULAN</span></h1>
          <p className="text-batik-gold text-xs uppercase tracking-[0.2em] font-medium max-w-xl mx-auto opacity-70 italic">Computerized Embroidery Excellence</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        {/* Filters */}
        <div className="bg-white p-6 rounded-none shadow-2xl flex flex-wrap items-center justify-between gap-6 border-2 border-batik-gold/10 mb-12">
          <div className="flex overflow-x-auto no-scrollbar gap-4 p-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`whitespace-nowrap px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${
                  category === cat.id 
                    ? "border-batik-maroon text-batik-maroon" 
                    : "border-transparent text-batik-brown text-opacity-40 hover:text-batik-maroon"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-batik-gold font-bold italic">
            <Filter size={14} /> Refine Selection
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] bg-white rounded-3xl animate-pulse shadow-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {products.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={item} />
                </motion.div>
              ))}
            </AnimatePresence>
            {products.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <ShoppingBag size={48} className="mx-auto text-batik-gold opacity-30 mb-4" />
                <p className="text-batik-brown text-opacity-60">Belum ada produk di kategori ini.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const imageUrl = product.foto 
    ? (product.foto.startsWith('http') ? product.foto : `/uploads/produk/${product.foto}`)
    : "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=400";

  return (
    <Link to={`/produk/${product.id}`} className="group block bg-white border-2 border-batik-gold/10 hover:border-batik-gold transition-all duration-500 overflow-hidden relative">
      <div className="aspect-[4/5] relative overflow-hidden bg-batik-cream">
        <img 
          src={imageUrl} 
          alt={product.nama_produk} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
        />
        <div className="absolute top-0 right-0 bg-batik-maroon text-white text-[8px] font-bold px-4 py-2 uppercase tracking-widest border-b border-l border-batik-gold">
          {product.kategori}
        </div>
      </div>
      <div className="p-6 text-center border-t border-batik-gold/10">
        <h3 className="font-serif text-sm font-bold text-batik-maroon mb-2 uppercase group-hover:text-batik-gold transition-colors tracking-widest italic">{product.nama_produk}</h3>
        <p className="text-batik-brown font-black text-xs tracking-widest mb-4">Rp {product.harga.toLocaleString('id-ID')}</p>
        <div className="w-10 h-[1px] bg-batik-gold mx-auto group-hover:w-20 transition-all duration-500"></div>
      </div>
    </Link>
  );
}
