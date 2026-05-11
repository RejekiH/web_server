import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Heart, Share2, ShieldCheck, Ruler, Check, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function Detail({ user }: { user: any }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jumlah, setJumlah] = useState(1);
  const [ukuran, setUkuran] = useState("M");
  const [warna, setWarna] = useState("Navy");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch(`/api/produk/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    const res = await fetch("/api/keranjang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        produk_id: product.id,
        jumlah,
        ukuran,
        warna
      })
    });
    const data = await res.json();
    if (data.success) {
      setTimeout(() => {
        setAdding(false);
        navigate("/cart");
      }, 500);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Produk tidak ditemukan</div>;

  const imageUrl = product.foto 
    ? (product.foto.startsWith('http') ? product.foto : `/uploads/produk/${product.foto}`)
    : "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=800";

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = ["Navy", "Hitam", "Maroon", "Putih", "Cream"];

  return (
    <div className="bg-batik-cream min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-batik-brown text-opacity-60 hover:text-batik-brown font-bold mb-8 transition-all">
          <ArrowLeft size={18} /> Kembali ke Katalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Image Gallery */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-2 border-2 border-batik-gold/10 shadow-2xl"
            >
              <div className="aspect-square relative group overflow-hidden bg-batik-cream">
                <img src={imageUrl} alt={product.nama_produk} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute top-6 right-6 flex flex-col gap-3">
                  <button className="w-10 h-10 bg-white border border-batik-gold flex items-center justify-center text-batik-maroon hover:bg-batik-maroon hover:text-white transition-colors"><Heart size={18} /></button>
                  <button className="w-10 h-10 bg-white border border-batik-gold flex items-center justify-center text-batik-brown hover:bg-batik-brown hover:text-white transition-colors"><Share2 size={18} /></button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 flex flex-col pt-4 md:pt-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-batik-gold"></div>
                <span className="text-batik-gold font-bold uppercase tracking-[0.3em] text-[10px]">{product.kategori}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-black text-batik-maroon mb-6 leading-none uppercase italic">{product.nama_produk}</h1>
              
              <div className="flex items-baseline gap-4 mb-8">
                <div className="text-3xl font-serif font-bold text-batik-brown italic">Rp {product.harga.toLocaleString('id-ID')}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-green-600 bg-green-50 px-3 py-1 border border-green-200">AVAILABILITY: <span className="text-batik-brown">{product.stok} IN STOCK</span></div>
              </div>

              <div className="mb-10 p-6 bg-white border-l-4 border-batik-gold shadow-sm">
                <p className="text-batik-dark text-opacity-70 leading-relaxed italic text-sm">
                  "{product.deskripsi}"
                </p>
              </div>

              {/* Options */}
              <div className="space-y-8 mb-10">
                {/* Size */}
                <div>
                  <h4 className="font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                    <Ruler size={16} className="text-batik-gold" /> Pilih Ukuran
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setUkuran(s)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all border-2 ${
                          ukuran === s ? "bg-batik-brown text-batik-cream border-batik-brown" : "bg-white text-batik-brown border-batik-gold border-opacity-20 hover:border-batik-gold"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <h4 className="font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                    Warna Bordir
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {colors.map(c => (
                      <button
                        key={c}
                        onClick={() => setWarna(c)}
                        className={`px-4 py-2 rounded-full font-medium text-sm transition-all border-2 flex items-center gap-2 ${
                          warna === c ? "bg-batik-cream border-batik-gold text-batik-brown" : "bg-white border-transparent text-batik-brown opacity-60"
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full shadow-inner ${
                          c === 'Navy' ? 'bg-blue-900' : c === 'Hitam' ? 'bg-black' : c === 'Maroon' ? 'bg-red-900' : c === 'Putih' ? 'bg-white border' : 'bg-orange-100'
                        }`}></div>
                        {c}
                        {warna === c && <Check size={14} className="text-batik-gold" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="pt-4">
                  <h4 className="font-bold mb-4 text-[10px] uppercase tracking-[0.2em] text-batik-gold italic">Order Quantity</h4>
                  <div className="flex items-center gap-4 bg-white w-fit border border-batik-gold/30 p-1">
                    <button 
                      onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                      className="w-12 h-12 flex items-center justify-center font-bold text-batik-brown hover:bg-batik-cream transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-black border-x border-batik-gold/10">{jumlah}</span>
                    <button 
                      onClick={() => setJumlah(Math.min(product.stok, jumlah + 1))}
                      className="w-12 h-12 flex items-center justify-center font-bold text-batik-brown hover:bg-batik-cream transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={adding}
                   className={`flex-grow h-16 font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95 border-b-4 ${
                    adding ? "bg-batik-gold text-white cursor-wait border-batik-brown" : "bg-batik-maroon text-white border-batik-gold hover:bg-batik-brown"
                  }`}
                >
                  <ShoppingCart size={24} /> {adding ? "PROCESSING..." : "ADD TO COLLECTION"}
                </button>
              </div>

              <div className="mt-12 pt-12 border-t border-batik-gold/20 flex flex-col sm:flex-row gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border border-batik-gold/30 flex items-center justify-center text-batik-gold"><ShieldCheck size={20} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-batik-maroon">Quality Shield</span>
                    <span className="text-[9px] uppercase tracking-widest text-batik-brown opacity-60">Professional Embroidery</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border border-batik-gold/30 flex items-center justify-center text-batik-gold"><Package size={20} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-batik-maroon">Premium Pack</span>
                    <span className="text-[9px] uppercase tracking-widest text-batik-brown opacity-60">Safe Global Shipping</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
