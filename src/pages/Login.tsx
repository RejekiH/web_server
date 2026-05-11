import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Login({ setUser }: { setUser: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: 'user' })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      navigate("/");
    } else {
      setError(data.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-batik-cream min-h-screen pt-12 pb-24 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[50px] shadow-2xl p-10 md:p-14 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-batik-gold via-batik-maroon to-batik-gold"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-batik opacity-[0.05] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-batik-cream rounded-2xl flex items-center justify-center text-batik-brown mx-auto mb-6 shadow-sm border border-batik-gold border-opacity-20">
              <User size={32} />
            </div>
            <h1 className="text-3xl font-serif font-black text-batik-brown mb-2">Selamat Datang</h1>
            <p className="text-batik-brown text-opacity-50 text-sm">Masuk untuk mulai memesan bordir kustom Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-batik-brown text-opacity-50 ml-1">Email</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-batik-gold" size={18} />
                <input 
                  type="email" required placeholder="email@contoh.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-batik-cream bg-opacity-30 h-14 pl-16 pr-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-batik-brown text-opacity-50 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-batik-gold" size={18} />
                <input 
                  type="password" required placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-batik-cream bg-opacity-30 h-14 pl-16 pr-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold"
                />
              </div>
            </div>

            {error && <div className="text-batik-maroon text-sm font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100">{error}</div>}

            <button 
              type="submit" disabled={loading}
              className="w-full bg-batik-brown text-batik-cream h-16 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-batik-maroon transition-all shadow-xl active:scale-95 group"
            >
              {loading ? "Memverifikasi..." : "Masuk Akun"} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm text-batik-brown text-opacity-60 mb-6">Belum punya akun?</p>
            <Link to="/register" className="inline-block border-2 border-batik-gold text-batik-gold font-bold px-10 py-3 rounded-2xl hover:bg-batik-gold hover:text-batik-brown transition-all">
              Daftar Gratis
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
