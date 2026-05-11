import { Link } from "react-router-dom";
import { ChevronRight, Star, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-batik-cream overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white border-b-8 border-batik-gold">
        <div className="absolute inset-0 bg-batik opacity-5 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1200" 
            alt="Main Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-[2px] bg-batik-gold"></div>
              <span className="text-batik-gold font-bold uppercase tracking-[0.3em] text-xs">Premium Embroidery</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif font-black text-batik-maroon leading-[0.9] mb-8 uppercase italic">
              Bordir <br />
              <span className="text-batik-brown not-italic">Presisi.</span> <br />
              <span className="text-batik-gold">Sempurna.</span>
            </h1>
            
            <p className="text-lg text-batik-dark text-opacity-70 mb-10 leading-relaxed font-medium uppercase tracking-wider">
              Solusi bordir komputer profesional untuk <span className="text-batik-brown">korporasi</span>, <span className="text-batik-brown">komunitas</span>, dan <span className="text-batik-brown">personal</span> dengan standar kualitas tinggi.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-4">
              <Link to="/katalog" className="bg-batik-maroon text-white px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-batik-brown transition-all shadow-2xl flex items-center gap-3 border-b-4 border-batik-gold">
                Mulai Pesanan <ChevronRight size={18} />
              </Link>
              <Link to="/register" className="border-2 border-batik-brown text-batik-brown px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-batik-brown hover:text-white transition-all">
                Daftar Akun
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-batik-cream border-b border-batik-gold/20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <Benefit icon={<ShieldCheck size={20} />} title="PREMIUM QUALITY" desc="High grade thread" />
          <Benefit icon={<Truck size={20} />} title="NATIONAL SHIP" desc="Fast delivery" />
          <Benefit icon={<RefreshCcw size={20} />} title="QUICK PROCESS" desc="On-time delivery" />
          <Benefit icon={<Star size={20} />} title="CUSTOM DESIGN" desc="Your imagination" />
        </div>
      </section>

      {/* Featured Group */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-batik-brown mb-4">Layanan Unggulan Kami</h2>
          <div className="w-24 h-1 bg-batik-gold mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Seragam Batik" 
            image="https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=600"
            desc="Sempurnakan identitas instansi dengan bordir logo & motif batik elegan."
          />
          <FeatureCard 
            title="Topi & Tas" 
            image="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600"
            desc="Aksesoris kustom untuk merchandise atau kebutuhan komunitas."
          />
          <FeatureCard 
            title="Desain Bebas" 
            image="https://images.unsplash.com/photo-1523381235312-3b1fbc34394a?auto=format&fit=crop&q=80&w=600"
            desc="Punya ide sendiri? Kami siap mewujudkannya dengan mesin bordir canggih."
          />
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-batik-brown text-batik-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-batik opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-8">Tentang Rejeki Bordir</h2>
            <p className="text-lg opacity-80 leading-relaxed mb-6">
              Berawal dari kecintaan pada seni tekstil Nusantara, Rejeki Bordir lahir untuk memberikan solusi kebutuhan bordir modern dengan tetap menjaga nilai estetika tradisional.
            </p>
            <p className="opacity-80 leading-relaxed mb-10">
              Dengan mesin berteknologi tinggi dan tim ahli berpengalaman, kami telah melayani ribuan pesanan mulai dari perorangan hingga korporat berskala besar. Komitmen kami adalah detail yang sempurna di setiap jahitan.
            </p>
            <Link to="/katalog" className="inline-flex items-center gap-2 text-batik-gold font-bold hover:gap-4 transition-all uppercase tracking-widest text-sm">
              Mulai Belanja <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1605650170067-1647f12a3224?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Detail 1" />
            </div>
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl mt-8">
              <img src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Detail 2" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Benefit({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="mb-3 text-batik-gold">
        {icon}
      </div>
      <h4 className="font-bold text-batik-maroon text-[10px] md:text-xs tracking-[0.2em] uppercase mb-1">{title}</h4>
      <p className="text-[8px] md:text-[10px] text-batik-brown text-opacity-60 uppercase tracking-widest">{desc}</p>
    </div>
  );
}

function FeatureCard({ title, image, desc }: { title: string, image: string, desc: string }) {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden border-2 border-batik-gold/20 hover:border-batik-gold transition-all duration-500">
      <img src={image} alt={title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-batik-maroon via-transparent to-transparent opacity-90 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-3xl font-serif font-bold text-white mb-2 uppercase italic">{title}</h3>
        <p className="text-batik-gold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-6">{desc}</p>
        <Link to="/katalog" className="inline-block border border-white text-white px-6 py-2 text-[10px] tracking-widest uppercase hover:bg-white hover:text-batik-maroon transition-all">Lihat Layanan</Link>
      </div>
    </div>
  );
}
