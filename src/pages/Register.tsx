import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({ nama: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } else {
      setError(data.message);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-batik-cream min-h-screen py-24 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-16 rounded-[50px] shadow-2xl text-center max-w-lg">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><CheckCircle2 size={40} /></div>
          <h1 className="text-3xl font-serif font-black text-batik-brown mb-4">Pendaftaran Sukses!</h1>
          <p className="text-batik-brown text-opacity-60 leading-relaxed mb-8">Akun Anda telah berhasil dibuat. Anda akan dialihkan ke halaman login dalam beberapa saat.</p>
          <div className="w-full bg-batik-cream h-1.5 rounded-full overflow-hidden"><motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ duration: 3 }} className="h-full bg-batik-gold" /></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-batik-cream min-h-screen pt-12 pb-24 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[50px] shadow-2xl p-10 md:p-14 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-batik-gold via-batik-maroon to-batik-gold"></div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-black text-batik-brown mb-2">Buat Akun Baru</h1>
            <p className="text-batik-brown text-opacity-50 text-sm">Bergabunglah dengan komunitas Rejeki Bordir</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-batik-brown text-opacity-50 ml-1">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-batik-gold" size={18} />
                <input 
                  type="text" required placeholder="Nama Anda"
                  value={form.nama} onChange={e => setForm({...form, nama: e.target.value})}
                  className="w-full bg-batik-cream bg-opacity-30 h-14 pl-16 pr-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-batik-brown text-opacity-50 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-batik-gold" size={18} />
                <input 
                  type="email" required placeholder="email@contoh.com"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-batik-cream bg-opacity-30 h-14 pl-16 pr-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-batik-brown text-opacity-50 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-batik-gold" size={18} />
                <input 
                  type="password" required placeholder="Minimal 6 karakter"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full bg-batik-cream bg-opacity-30 h-14 pl-16 pr-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold"
                />
              </div>
            </div>

            {error && <div className="text-batik-maroon text-sm font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100">{error}</div>}

            <button 
              type="submit" disabled={loading}
              className="w-full bg-batik-brown text-batik-cream h-16 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-batik-maroon transition-all shadow-xl active:scale-95 group"
            >
              {loading ? "Mendaftar..." : "Daftar Akun"} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-batik-brown text-opacity-60 mb-4">Sudah punya akun?</p>
            <Link to="/login" className="text-batik-maroon font-bold hover:text-batik-gold transition-colors">Masuk di sini</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
