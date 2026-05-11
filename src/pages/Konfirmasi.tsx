import { useParams, Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight, Printer, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Konfirmasi() {
  const { id } = useParams();

  return (
    <div className="bg-batik-cream min-h-screen py-24 flex items-center justify-center">
      <div className="max-w-2xl w-full px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[50px] shadow-2xl p-12 text-center border-t-8 border-batik-gold relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-batik opacity-[0.03] pointer-events-none"></div>
          
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
            <CheckCircle size={48} />
          </div>

          <h1 className="text-4xl font-serif font-black text-batik-brown mb-4">Pesanan Diterima!</h1>
          <p className="text-batik-brown text-opacity-60 mb-8 max-w-md mx-auto leading-relaxed text-lg">
            Terima kasih telah mempercayakan kebutuhan bordir Anda kepada kami. 
            Nomor pesanan Anda adalah:
          </p>

          <div className="bg-batik-cream py-6 px-10 rounded-3xl inline-block mb-12 shadow-sm border border-batik-gold border-opacity-20 animate-pulse">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-batik-gold block mb-1">Order ID</span>
            <span className="text-3xl font-black text-batik-brown tracking-widest">#RJK-ORD-{id}</span>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-batik-brown text-batik-cream py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-batik-maroon transition-all shadow-lg text-lg">
              <MessageCircle size={20} /> Konfirmasi via WhatsApp
            </button>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/katalog" className="bg-white border-2 border-batik-gold text-batik-brown py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-batik-cream transition-all">
                <ShoppingBag size={18} /> Belanja Lagi
              </Link>
              <button className="bg-white border-2 border-batik-gold text-batik-brown py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-batik-cream transition-all">
                <Printer size={18} /> Cetak Invoice
              </button>
            </div>
          </div>

          <div className="mt-12 pt-10 border-t border-batik-gold border-opacity-10 text-xs text-batik-brown text-opacity-40 italic">
            Harap simpan nomor pesanan ini untuk pelacakan status pengerjaan bordir Anda.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
