import { useState, useEffect, FormEvent } from "react";
import { Plus, Edit, Trash2, X, Upload, Save, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProduk() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nama_produk: "",
    kategori: "baju",
    deskripsi: "",
    harga: 0,
    stok: 0
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("/api/produk?kategori=semua")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_produk", form.nama_produk);
    formData.append("kategori", form.kategori);
    formData.append("deskripsi", form.deskripsi);
    formData.append("harga", form.harga.toString());
    formData.append("stok", form.stok.toString());
    if (file) formData.append("foto", file);

    const url = editingId ? `/api/admin/produk/${editingId}` : "/api/admin/produk";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });
    const data = await res.json();
    if (data.success) {
      setShowModal(false);
      setEditingId(null);
      resetForm();
      fetchProducts();
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      nama_produk: product.nama_produk,
      kategori: product.kategori,
      deskripsi: product.deskripsi,
      harga: product.harga,
      stok: product.stok
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus produk ini?")) {
      await fetch(`/api/admin/produk/${id}`, { method: "DELETE" });
      fetchProducts();
    }
  };

  const resetForm = () => {
    setForm({ nama_produk: "", kategori: "baju", deskripsi: "", harga: 0, stok: 0 });
    setFile(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-black text-batik-brown">Kelola <span className="text-batik-gold">Produk</span></h1>
        <button 
          onClick={() => { resetForm(); setEditingId(null); setShowModal(true); }}
          className="bg-batik-brown text-batik-cream px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-batik-gold hover:text-batik-brown transition-all shadow-md"
        >
          <Plus size={20} /> Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-batik-gold border-opacity-10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-batik-cream text-batik-brown">
            <tr>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Info Produk</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Kategori</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Harga (Rp)</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Stok</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-batik-cream overflow-hidden">
                      <img src={p.foto ? (p.foto.startsWith('http') ? p.foto : `/uploads/produk/${p.foto}`) : ""} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="font-bold text-batik-brown">{p.nama_produk}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-batik-gold bg-batik-brown bg-opacity-5 px-3 py-1 rounded-full">{p.kategori}</span>
                </td>
                <td className="px-6 py-4 font-black text-batik-brown">{p.harga.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4">
                  <span className={`font-bold ${p.stok < 10 ? 'text-batik-maroon' : 'text-green-600'}`}>{p.stok}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(p)} className="p-2 text-batik-brown hover:bg-batik-cream rounded-lg transition-colors"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-batik-maroon hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-batik-brown bg-opacity-40 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden border-t-8 border-batik-gold"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-serif font-black text-batik-brown">{editingId ? "Edit" : "Tambah"} Produk Bordir</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-batik-cream rounded-full transition-colors"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-batik-brown text-opacity-40 mb-2 block ml-1">Nama Produk</label>
                      <input type="text" required value={form.nama_produk} onChange={e => setForm({...form, nama_produk: e.target.value})} className="w-full bg-batik-cream bg-opacity-30 h-14 px-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-batik-brown text-opacity-40 mb-2 block ml-1">Kategori</label>
                      <select value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})} className="w-full bg-batik-cream bg-opacity-30 h-14 px-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold">
                        <option value="baju">Baju / Kaos</option>
                        <option value="topi">Topi</option>
                        <option value="tas">Tas</option>
                        <option value="seragam">Seragam</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-batik-brown text-opacity-40 mb-2 block ml-1">Deskripsi Singkat</label>
                    <textarea rows={2} required value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} className="w-full bg-batik-cream bg-opacity-30 p-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold resize-none" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-batik-brown text-opacity-40 mb-2 block ml-1">Harga (IDR)</label>
                      <input type="number" required value={form.harga} onChange={e => setForm({...form, harga: parseInt(e.target.value)})} className="w-full bg-batik-cream bg-opacity-30 h-14 px-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-batik-brown text-opacity-40 mb-2 block ml-1">Stok Tersedia</label>
                      <input type="number" required value={form.stok} onChange={e => setForm({...form, stok: parseInt(e.target.value)})} className="w-full bg-batik-cream bg-opacity-30 h-14 px-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-batik-brown text-opacity-40 mb-4 block ml-1">Foto Produk</label>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-batik-cream rounded-3xl flex items-center justify-center text-batik-gold border-2 border-dashed border-batik-gold border-opacity-30 relative overflow-hidden">
                        {file ? <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" /> : <ImageIcon size={32} />}
                      </div>
                      <label className="bg-batik-cream text-batik-brown px-8 py-4 rounded-2xl font-bold cursor-pointer hover:bg-batik-gold transition-all flex items-center gap-2">
                        <Upload size={18} /> Unggah Foto
                        <input type="file" className="hidden" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-batik-brown text-batik-cream h-16 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-batik-maroon transition-all shadow-xl active:scale-95 group">
                    <Save size={20} /> SIMPAN DATA PRODUK
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
