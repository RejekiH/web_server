import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, User, MapPin, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Checkout({ user }: { user: any }) {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({
    nama_penerima: user?.nama || "",
    alamat: "",
    no_hp: "",
    metode_bayar: "transfer"
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch("/api/keranjang")
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) navigate("/cart");
        setItems(data);
      });
  }, [user, navigate]);

  const total = items.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, total_harga: total })
    });
    const data = await res.json();
    if (data.success) {
      navigate(`/konfirmasi/${data.orderId}`);
    } else {
      alert(data.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-batik-cream min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-serif font-black text-batik-brown mb-12">Lengkapi <span className="text-batik-gold">Detail Pengiriman</span></h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="bg-white p-8 md:p-10 rounded-[40px] shadow-xl border border-batik-gold border-opacity-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-batik opacity-[0.03] -translate-y-1/2 translate-x-1/2"></div>
                <h2 className="text-xl font-serif font-bold mb-8 flex items-center gap-3">
                  <User className="text-batik-gold" /> Informasi Penerima
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-batik-brown text-opacity-50 mb-2">Nama Lengkap</label>
                    <input 
                      type="text" required value={form.nama_penerima}
                      onChange={e => setForm({...form, nama_penerima: e.target.value})}
                      className="w-full bg-batik-cream bg-opacity-50 h-14 px-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-batik-brown text-opacity-50 mb-2">Nomor WhatsApp</label>
                      <div className="relative">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-batik-gold" size={18} />
                        <input 
                          type="tel" required placeholder="0812..." value={form.no_hp}
                          onChange={e => setForm({...form, no_hp: e.target.value})}
                          className="w-full bg-batik-cream bg-opacity-50 h-14 pl-16 pr-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-batik-brown text-opacity-50 mb-2">Alamat Pengiriman Lengkap</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-6 text-batik-gold" size={18} />
                      <textarea 
                        required placeholder="Nama jalan, Nomor rumah, RT/RW, Kecamatan, Kota..."
                        rows={3} value={form.alamat}
                        onChange={e => setForm({...form, alamat: e.target.value})}
                        className="w-full bg-batik-cream bg-opacity-50 p-6 pl-16 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold resize-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-10 rounded-[40px] shadow-xl border border-batik-gold border-opacity-10">
                <h2 className="text-xl font-serif font-bold mb-8 flex items-center gap-3">
                  <CreditCard className="text-batik-gold" /> Metode Pembayaran
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    type="button" onClick={() => setForm({...form, metode_bayar: 'transfer'})}
                    className={`p-6 rounded-3xl border-2 text-left transition-all relative ${
                      form.metode_bayar === 'transfer' ? "border-batik-gold bg-batik-cream shadow-md" : "border-batik-gold border-opacity-10 hover:border-opacity-30"
                    }`}
                  >
                    <div className="font-bold mb-1">Transfer Bank</div>
                    <div className="text-xs opacity-60 italic">BCA, Mandiri, BRI</div>
                    {form.metode_bayar === 'transfer' && <div className="absolute top-4 right-4 w-6 h-6 bg-batik-gold rounded-full flex items-center justify-center text-batik-brown scale-75 whitespace-nowrap px-2">✓</div>}
                  </button>
                  <button 
                    type="button" onClick={() => setForm({...form, metode_bayar: 'cod'})}
                    className={`p-6 rounded-3xl border-2 text-left transition-all relative ${
                      form.metode_bayar === 'cod' ? "border-batik-gold bg-batik-cream shadow-md" : "border-batik-gold border-opacity-10 hover:border-opacity-30"
                    }`}
                  >
                    <div className="font-bold mb-1">Bayar Ditempat (COD)</div>
                    <div className="text-xs opacity-60 italic">Khusus area Kota Solo</div>
                    {form.metode_bayar === 'cod' && <div className="absolute top-4 right-4 w-6 h-6 bg-batik-gold rounded-full flex items-center justify-center text-batik-brown scale-75">✓</div>}
                  </button>
                </div>
              </section>
            </form>
          </div>

          {/* Checkout Info */}
          <div className="lg:col-span-5">
            <div className="bg-batik-brown text-batik-cream p-10 rounded-[40px] shadow-2xl sticky top-28 overflow-hidden">
              <div className="absolute inset-0 bg-batik opacity-5"></div>
              <h3 className="font-serif text-2xl font-bold mb-8 relative">Order Review</h3>
              <div className="space-y-4 mb-8 relative">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-opacity-70 flex-grow max-w-[200px] truncate">{item.jumlah}x {item.nama_produk}</span>
                    <span className="font-bold">Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</span>
                  </div>
                ))}
                <div className="pt-6 mt-6 border-t border-white border-opacity-10">
                  <div className="flex justify-between text-xl font-black">
                    <span>Total Bayar</span>
                    <span className="text-batik-gold">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 p-6 rounded-3xl mb-8 relative">
                <div className="flex items-center gap-3 mb-2">
                  <Truck size={20} className="text-batik-gold" />
                  <span className="font-bold text-sm">Estimasi Pengerjaan</span>
                </div>
                <p className="text-xs text-opacity-70">3-7 Hari Kerja (tergantung antrian bordir)</p>
              </div>

              <button 
                onClick={handleSubmit} disabled={submitting}
                className="w-full bg-batik-gold text-batik-brown h-16 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.02] transition-all shadow-xl relative"
              >
                {submitting ? "Memproses..." : "Konfirmasi Pesanan"}
                {!submitting && <ArrowRight size={22} />}
              </button>
              
              <div className="mt-8 flex justify-center items-center gap-4 text-[10px] uppercase tracking-widest text-opacity-50 relative">
                <ShieldCheck size={14} /> Transaksi Aman & Terenkripsi
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
