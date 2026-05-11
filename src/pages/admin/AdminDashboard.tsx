import { useState, useEffect } from "react";
import { Package, ShoppingCart, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading Stats...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-black text-batik-brown">Dashboard <span className="text-batik-gold">Ringkasan</span></h1>
        <div className="text-sm font-bold text-batik-brown text-opacity-40 uppercase tracking-widest">{new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Package className="text-blue-600" />} 
          label="Total Produk" 
          value={stats.totalProduk} 
          color="bg-blue-50"
        />
        <StatCard 
          icon={<Clock className="text-amber-600" />} 
          label="Pesanan Pending" 
          value={stats.pesananMasuk} 
          color="bg-amber-50"
        />
        <StatCard 
          icon={<CheckCircle className="text-green-600" />} 
          label="Pesanan Selesai" 
          value={stats.pesananSelesai} 
          color="bg-green-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-batik-gold border-opacity-10">
          <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-batik-gold" /> Aktivitas Terbaru
          </h3>
          <div className="space-y-6">
            <ActivityItem label="User baru mendaftar" time="2 jam yang lalu" />
            <ActivityItem label="Pesanan baru #ORD-102" time="5 jam yang lalu" />
            <ActivityItem label="Stok Seragam Batik diperbarui" time="1 hari yang lalu" />
            <ActivityItem label="Pesanan #ORD-99 dikirim" time="2 hari yang lalu" />
          </div>
        </div>

        <div className="bg-batik-brown text-batik-cream p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-batik opacity-5"></div>
          <h3 className="font-serif text-2xl font-bold mb-4 relative">Tips Admin</h3>
          <p className="text-sm text-opacity-70 leading-relaxed mb-6 relative italic">
            "Selalu periksa antrian desain bordir kustom setiap pagi untuk memastikan pengerjaan tepat waktu demi kepuasan pelanggan premium."
          </p>
          <div className="flex gap-4 relative">
             <div className="w-12 h-12 bg-batik-gold rounded-full bg-opacity-20 flex items-center justify-center text-batik-gold font-bold">!</div>
             <div className="text-xs self-center font-bold uppercase tracking-widest text-batik-gold">Sistem Berjalan Normal</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[32px] shadow-sm border border-batik-gold border-opacity-10 flex items-center gap-6"
    >
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-inner`}>
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-batik-brown text-opacity-40 mb-1">{label}</div>
        <div className="text-3xl font-black text-batik-brown">{value}</div>
      </div>
    </motion.div>
  );
}

function ActivityItem({ label, time }: { label: string, time: string }) {
  return (
    <div className="flex items-center justify-between border-b border-batik-cream border-opacity-50 pb-4">
      <div className="text-sm font-bold text-batik-brown text-opacity-80">{label}</div>
      <div className="text-[10px] uppercase font-bold text-batik-brown text-opacity-30">{time}</div>
    </div>
  );
}
