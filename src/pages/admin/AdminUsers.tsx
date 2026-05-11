import { useState, useEffect } from "react";
import { User, Shield, Mail, Calendar } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-black text-batik-brown">Database <span className="text-batik-gold">Pengguna</span></h1>

      <div className="bg-white rounded-3xl shadow-sm border border-batik-gold border-opacity-10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-batik-cream text-batik-brown">
            <tr>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Nama & Peran</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Email</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Tgl Terdaftar</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${u.role === 'admin' ? 'bg-batik-maroon text-white' : 'bg-batik-cream text-batik-brown'}`}>
                      {u.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                    </div>
                    <div>
                      <div className="font-bold text-batik-brown">{u.nama}</div>
                      <div className={`text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'text-batik-gold' : 'text-batik-brown text-opacity-30'}`}>{u.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-batik-brown text-opacity-60">
                    <Mail size={14} /> {u.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2 text-xs font-bold text-batik-brown text-opacity-40">
                    <Calendar size={14} /> {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2 shadow-sm"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Aktif</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-batik-cream bg-opacity-50 p-6 rounded-3xl border border-batik-gold border-opacity-10">
        <p className="text-xs text-batik-brown text-opacity-40 italic text-center font-medium">
          Daftar ini berisi semua pengguna yang telah melakukan registrasi melalui website Rejeki Bordir. 
          Administrator berhak melakukan peninjauan terhadap penyalahgunaan akun.
        </p>
      </div>
    </div>
  );
}
