import { useState, useEffect } from "react";
import { Search, Eye, X, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPesanan() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch("/api/admin/pesanan")
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  };

  const handleShowDetail = async (id: number) => {
    const res = await fetch(`/api/admin/pesanan/${id}`);
    const data = await res.json();
    setSelectedOrder(data);
    setShowDetail(true);
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/pesanan/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchOrders();
    setShowDetail(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-black text-batik-brown text-center md:text-left">Pesanan <span className="text-batik-gold">Masuk</span></h1>

      <div className="bg-white rounded-3xl shadow-sm border border-batik-gold border-opacity-10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-batik-cream text-batik-brown">
            <tr>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Order ID</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Pelanggan</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Penerima</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Status</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Total</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4"><span className="font-black text-xs">#RJK-{o.id}</span></td>
                <td className="px-6 py-4 font-bold text-batik-brown italic">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-bold">{o.nama_penerima}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-6 py-4 font-black text-batik-maroon">Rp {o.total_harga.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleShowDetail(o.id)} className="bg-batik-cream text-batik-brown px-4 py-2 rounded-xl text-xs font-bold hover:bg-batik-gold shadow-sm transition-all flex items-center gap-2 ml-auto">
                    <Eye size={14} /> LIHAT DETAIL
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetail && selectedOrder && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetail(false)} className="absolute inset-0 bg-batik-brown bg-opacity-40 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden border-t-8 border-batik-gold"
            >
              <div className="p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-serif font-black text-batik-brown">Detail Pesanan #RJK-{selectedOrder.id}</h2>
                  <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-batik-cream rounded-full transition-colors"><X size={24} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-batik-gold">Info Pengiriman</h3>
                    <div className="bg-batik-cream bg-opacity-30 p-6 rounded-3xl border border-batik-gold border-opacity-10">
                      <div className="font-bold text-lg mb-2">{selectedOrder.nama_penerima}</div>
                      <div className="text-sm opacity-70 mb-4">{selectedOrder.alamat}</div>
                      <div className="text-xs font-black bg-batik-brown text-batik-cream w-fit px-3 py-1 rounded-full">{selectedOrder.no_hp}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-batik-gold">Pembayaran & Status</h3>
                    <div className="bg-batik-cream bg-opacity-30 p-6 rounded-3xl border border-batik-gold border-opacity-10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold uppercase opacity-40">Metode</span>
                        <span className="font-bold uppercase text-batik-brown">{selectedOrder.metode_bayar}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase opacity-40">Status</span>
                        <StatusBadge status={selectedOrder.status} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-batik-gold">Item Bordir</h3>
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-3xl overflow-hidden">
                    {selectedOrder.details.map((item: any) => (
                      <div key={item.id} className="p-4 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-batik-cream rounded-lg overflow-hidden flex-shrink-0"></div>
                          <div>
                            <div className="font-bold text-sm">{item.nama_produk}</div>
                            <div className="text-[10px] opacity-60 font-bold uppercase">{item.ukuran} &bull; {item.warna}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] opacity-40 font-bold">{item.jumlah}x @ Rp {item.harga_satuan.toLocaleString()}</div>
                          <div className="font-black text-xs">Rp {(item.jumlah * item.harga_satuan).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                    <div className="p-6 bg-batik-brown text-batik-cream flex justify-between items-center">
                      <span className="font-serif italic">Total Pembayaran</span>
                      <span className="text-2xl font-black text-batik-gold">Rp {selectedOrder.total_harga.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-batik-gold">Update Status Pesanan</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatusButton onClick={() => updateStatus(selectedOrder.id, 'pending')} label="Pending" active={selectedOrder.status === 'pending'} />
                      <StatusButton onClick={() => updateStatus(selectedOrder.id, 'diproses')} label="Diproses" active={selectedOrder.status === 'diproses'} />
                      <StatusButton onClick={() => updateStatus(selectedOrder.id, 'dikirim')} label="Dikirim" active={selectedOrder.status === 'dikirim'} />
                      <StatusButton onClick={() => updateStatus(selectedOrder.id, 'selesai')} label="Selesai" active={selectedOrder.status === 'selesai'} />
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    pending: "bg-amber-50 text-amber-600",
    diproses: "bg-blue-50 text-blue-600",
    dikirim: "bg-indigo-50 text-indigo-600",
    selesai: "bg-green-50 text-green-600"
  };
  const icons: any = {
    pending: <Clock size={12} />,
    diproses: <Package size={12} />,
    dikirim: <Truck size={12} />,
    selesai: <CheckCircle size={12} />
  };
  return (
    <span className={`flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
}

function StatusButton({ label, active, onClick }: { label: string, active: boolean, onClick: any }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
        active ? "bg-batik-gold text-batik-brown shadow-lg scale-105" : "bg-batik-cream text-batik-brown text-opacity-40 hover:bg-batik-gold hover:text-opacity-100"
      }`}
    >
      {label}
    </button>
  );
}
