import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, ShieldAlert, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin({ setUser }: { setUser: any }) {
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
      body: JSON.stringify({ email, password, role: 'admin' })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      navigate("/admin/dashboard");
    } else {
      setError(data.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-batik-brown min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-batik opacity-[0.03]"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[50px] shadow-2xl p-12 md:p-16 relative z-10 border-t-8 border-batik-gold"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-batik-maroon text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-serif font-black text-batik-brown mb-2 tracking-tight">Admin <span className="text-batik-gold">Panel</span></h1>
          <p className="text-xs font-bold uppercase tracking-widest text-batik-brown text-opacity-40">Rejeki Bordir Komputer</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-batik-brown text-opacity-40 ml-1">Admin Email</label>
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-batik-gold" size={18} />
              <input 
                type="email" required placeholder="admin@rejeki.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-batik-cream bg-opacity-30 h-16 pl-16 pr-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-batik-brown text-opacity-40 ml-1">Master Password</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-batik-gold" size={18} />
              <input 
                type="password" required placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-batik-cream bg-opacity-30 h-16 pl-16 pr-6 rounded-2xl border-2 border-transparent focus:border-batik-gold outline-none transition-all font-bold"
              />
            </div>
          </div>

          {error && <div className="text-batik-maroon text-xs font-black text-center bg-red-50 py-4 rounded-2xl border border-red-100 uppercase tracking-widest">{error}</div>}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-batik-brown text-batik-cream h-16 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-batik-maroon transition-all shadow-xl active:scale-95 group uppercase tracking-widest text-sm"
          >
            {loading ? "AUTHENTICATING..." : "LOGIN TO DASHBOARD"} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-12 text-center">
          <span className="text-[10px] text-batik-brown text-opacity-30 font-bold uppercase tracking-widest">&copy; 2026 INTERNAL SYSTEM ONLY</span>
        </div>
      </motion.div>
    </div>
  );
}
