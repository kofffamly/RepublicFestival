import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MobileFrame } from '../../components/MobileFrame';
import { ChevronLeft, Phone, MapPin, Star, TrendingUp, Search, Filter, PhoneCall, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

const FACTORIES = [
  {
    id: 1, name: 'SIPEF Recyclage CI', location: 'Zone Industrielle, Port-Bouët', distance: '3.2 km',
    price: 250, unit: 'FCFA/kg', material: 'Plastique PET',
    rating: 4.8, phone: '+225 27 20 00 11 22', open: true, capacity: 'Grande', emoji: '🏭',
  },
  {
    id: 2, name: 'EcoTech Abidjan', location: 'Yopougon Industriel', distance: '5.8 km',
    price: 235, unit: 'FCFA/kg', material: 'Plastique + Carton',
    rating: 4.5, phone: '+225 27 20 33 44 55', open: true, capacity: 'Moyenne', emoji: '♻️',
  },
  {
    id: 3, name: 'GreenPro Industries', location: 'Koumassi, ZI', distance: '7.1 km',
    price: 260, unit: 'FCFA/kg', material: 'Métal & Aluminium',
    rating: 4.9, phone: '+225 07 07 88 99 00', open: false, capacity: 'Grande', emoji: '🔩',
  },
  {
    id: 4, name: 'Recyclage Côtière', location: 'Grand-Bassam', distance: '45 km',
    price: 280, unit: 'FCFA/kg', material: 'Tous matériaux',
    rating: 4.7, phone: '+225 27 21 55 66 77', open: true, capacity: 'Très grande', emoji: '🌊',
  },
  {
    id: 5, name: 'COPED Bouaké', location: 'Zone Nord, Bouaké', distance: '380 km',
    price: 310, unit: 'FCFA/kg', material: 'Plastique industriel',
    rating: 4.6, phone: '+225 27 31 11 22 33', open: true, capacity: 'Très grande', emoji: '🏗️',
  },
];

export default function PointsRachat() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [callingFactory, setCallingFactory] = useState<typeof FACTORIES[0] | null>(null);

  const filtered = FACTORIES.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.material.toLowerCase().includes(search.toLowerCase()) ||
    f.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleCall = (factory: typeof FACTORIES[0]) => {
    setCallingFactory(factory);
    // Simulate call screen showing for 2.5 seconds
    setTimeout(() => {
      setCallingFactory(null);
    }, 2800);
  };

  return (
    <MobileFrame bgColor="#F8F9F9">
      <div className="flex flex-col min-h-[760px] select-none relative">
        
        {/* Points Header */}
        <div style={{ background: CHARCOAL, padding: '16px 20px 24px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/pro')} 
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-white/80 font-bold mb-4"
          >
            <ChevronLeft size={20} color="#fff" />
            <span className="text-xs">Tableau de bord</span>
          </motion.button>
          
          <h1 className="text-xl font-black text-white">Points de Rachat</h1>

          {/* Available stock card pro banner */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '16px', marginTop: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Ton stock disponible</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white">500 kg</span>
              <span className="text-xs font-bold text-orange-500">Plastique PET</span>
            </div>
            
            {/* Custom mini bar graph */}
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-3.5 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '67%', background: GREEN }} />
            </div>
            <p className="text-[9px] text-slate-400 font-medium mt-1.5">500 kg sur 750 kg max de capacité de chargement</p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col px-5 pt-5 gap-4 pb-8 flex-1">
          {/* Search text input */}
          <div 
            className="flex items-center gap-3 bg-white px-4 border rounded-2xl shadow-sm transition-all"
            style={{ borderColor: '#e2e8f0' }}
          >
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Rechercher une usine de rachat..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-slate-800 font-semibold"
              style={{ flex: 1, border: 'none', outline: 'none', padding: '14px 0', fontSize: 13, background: 'transparent' }}
            />
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="bg-orange-500/10 border-none cursor-pointer rounded-xl p-1.5"
            >
              <Filter size={14} color={ORANGE} />
            </motion.button>
          </div>

          {/* Pricing indicator */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/15">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} color={GREEN} />
              <span className="text-xs text-slate-700 font-black">Meilleur cours actuel</span>
            </div>
            <span className="text-sm font-black text-emerald-600">310 FCFA/kg</span>
          </div>

          {/* Factory List layout */}
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {filtered.map((factory, idx) => (
                <motion.div
                  key={factory.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden border shadow-sm flex flex-col"
                  style={{ 
                    borderColor: idx === 0 ? GREEN : '#e2e8f0' 
                  }}
                >
                  {/* Recommended anchor banner */}
                  {idx === 0 && (
                    <div className="bg-emerald-500 px-4 py-2 flex items-center justify-between">
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">⭐ Meilleure option de revente</span>
                      <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full">Proche</span>
                    </div>
                  )}

                  <div className="p-4">
                    {/* Factory Header details */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                          <span className="text-2xl">{factory.emoji}</span>
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{factory.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 flex items-center gap-0.5">
                            <MapPin size={10} /> {factory.location}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Star size={12} color={ORANGE} fill={ORANGE} />
                          <span className="text-xs font-black text-slate-700">{factory.rating}</span>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider block mt-1 ${factory.open ? 'text-emerald-500' : 'text-red-500'}`}>
                          {factory.open ? 'Ouvert' : 'Fermé'}
                        </span>
                      </div>
                    </div>

                    {/* Stats metrics block */}
                    <div className="grid grid-cols-3 gap-2.5 mb-4">
                      <div className="flex flex-col items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-base font-black text-slate-800">{factory.price}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">FCFA/kg</span>
                      </div>
                      <div className="flex flex-col items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-xs font-black text-slate-800">{factory.distance}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Distance</span>
                      </div>
                      <div className="flex flex-col items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-xs font-black text-slate-800">{factory.capacity}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Capacité</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 font-bold mb-4">
                      ♻️ Matériaux: <span className="text-slate-800 font-semibold">{factory.material}</span>
                    </p>

                    {/* Action button */}
                    <motion.button
                      whileHover={factory.open ? { y: -1 } : {}}
                      whileTap={factory.open ? { scale: 0.97 } : {}}
                      onClick={() => handleCall(factory)}
                      disabled={!factory.open}
                      className="w-full border-none py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                      style={{
                        background: factory.open ? GREEN : '#e2e8f0',
                        boxShadow: factory.open ? `0 6px 18px ${GREEN}25` : 'none',
                      }}
                    >
                      <Phone size={16} color={factory.open ? '#fff' : '#94a3b8'} fill={factory.open ? '#fff' : 'none'} />
                      <span className={`text-xs font-black uppercase tracking-wider ${factory.open ? 'text-white' : 'text-slate-400'}`}>
                        Contacter / Appeler
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Ringing Calling Simulation HUD (Overlay) */}
        <AnimatePresence>
          {callingFactory && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 z-[500] flex flex-col justify-between p-8 text-white select-none"
            >
              {/* Top info */}
              <div className="flex flex-col items-center mt-12 text-center">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest animate-pulse">Appel sortant via RecyGo...</span>
                
                {/* Caller avatar */}
                <div className="relative flex items-center justify-center my-8">
                  {/* Dialing circular ripples */}
                  <div className="absolute w-36 h-36 rounded-full border border-emerald-500/25 animate-ping" style={{ animationDuration: '2s' }} />
                  <div className="absolute w-28 h-28 rounded-full border border-emerald-500/45 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
                  
                  <div className="relative w-24 h-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-4xl shadow-lg">
                    {callingFactory.emoji}
                  </div>
                </div>

                <h2 className="text-2xl font-black">{callingFactory.name}</h2>
                <p className="text-sm font-semibold text-slate-400 mt-2">{callingFactory.phone}</p>
              </div>

              {/* Bottom call tools */}
              <div className="flex flex-col items-center mb-12">
                <div className="flex items-center justify-center bg-slate-800/50 backdrop-blur-md border border-white/5 px-6 py-3 rounded-2xl mb-8">
                  <PhoneCall size={16} className="text-emerald-400 animate-bounce mr-2" />
                  <span className="text-xs font-bold text-slate-300">Mise en relation en cours...</span>
                </div>

                {/* Terminate button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCallingFactory(null)}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 border-none cursor-pointer flex items-center justify-center shadow-lg"
                >
                  <XCircle size={32} color="#fff" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileFrame>
  );
}
