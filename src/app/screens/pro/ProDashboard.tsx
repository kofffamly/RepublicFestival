import { useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { MobileFrame } from '../../components/MobileFrame';
import { Bell, Settings, TrendingUp, Bell as AlertIcon, Map, Building2, ChevronRight, Package, Recycle, Truck } from 'lucide-react';
import { motion } from 'motion/react';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

const STOCK = [
  { label: 'Plastique', current: 200, max: 300, color: '#3498db', bg: '#ebf5fb', emoji: '🧴' },
  { label: 'Carton', current: 80, max: 200, color: ORANGE, bg: '#fef5e7', emoji: '📦' },
  { label: 'Métal', current: 45, max: 100, color: '#95a5a6', bg: '#f2f4f4', emoji: '🥫' },
  { label: 'Verre', current: 30, max: 150, color: '#1abc9c', bg: '#e8f8f5', emoji: '🍶' },
];

export default function ProDashboard() {
  const navigate = useNavigate();
  const { user } = useApp();

  return (
    <MobileFrame bgColor="#F8F9F9">
      <div className="flex flex-col min-h-[760px] select-none">
        
        {/* Dark Pro Header */}
        <div 
          className="relative px-5 pt-6 pb-8 rounded-b-[32px] shadow-lg text-white"
          style={{ background: 'linear-gradient(135deg, #1e2b37 0%, #0f171e 100%)' }}
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '16px 16px' }} />

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <div 
                className="flex items-center justify-center rounded-xl bg-orange-500 shadow-md"
                style={{ width: 38, height: 38 }}
              >
                <Recycle size={20} color="#fff" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">RecyGo <span className="text-orange-500 font-extrabold text-sm">PRO</span></span>
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/pro/demandes')}
                className="relative flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 border border-white/5 cursor-pointer text-white"
                style={{ width: 38, height: 38 }}
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/shared/switch-role')} 
                className="flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 border border-white/5 cursor-pointer text-white"
                style={{ width: 38, height: 38 }}
              >
                <Settings size={18} />
              </motion.button>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Espace Recyclage Pro</p>
            <h2 className="text-xl font-black mt-1 text-white">{user?.name || 'Recycleur Pro'}</h2>
            
            {/* Quick Metrics Cards */}
            <div className="flex gap-3 mt-5">
              {/* Card 1 */}
              <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 shadow-inner">
                <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                  <Truck size={14} color={ORANGE} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Collectes dispo</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-white">8</span>
                  <span className="text-xs font-semibold text-slate-400">alertes</span>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 shadow-inner">
                <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                  <TrendingUp size={14} color={GREEN} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Revenu / mois</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-emerald-400">+45K</span>
                  <span className="text-[10px] font-bold text-slate-400">FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Actions Grid */}
        <div className="flex flex-col px-5 pt-5 gap-4 pb-6 flex-1">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: AlertIcon, label: 'Demandes', path: '/pro/demandes', color: ORANGE, badge: 8 },
              { icon: Map, label: 'Carte Live', path: '/pro/demandes', color: '#3498db', badge: null },
              { icon: Building2, label: 'Usines Rachat', path: '/pro/points-rachat', color: GREEN, badge: null },
            ].map((item, idx) => (
              <motion.button
                key={idx}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center border-none cursor-pointer p-4 bg-white rounded-2xl shadow-sm border border-slate-100 relative"
              >
                {item.badge && (
                  <div className="absolute top-2 right-2 bg-orange-500 rounded-full flex items-center justify-center" style={{ width: 18, height: 18 }}>
                    <span className="text-[9px] font-black text-white">{item.badge}</span>
                  </div>
                )}
                <div 
                  className="flex items-center justify-center mb-2 rounded-xl"
                  style={{ width: 44, height: 44, background: `${item.color}10` }}
                >
                  <item.icon size={22} color={item.color} />
                </div>
                <span className="text-xs font-extrabold text-slate-700 text-center leading-tight">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Stock inventory level section */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Suivi de mon Stock</span>
              <div className="flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-xl">
                <Package size={13} color={GREEN} />
                <span className="text-[11px] font-black text-emerald-600">355 kg accumulés</span>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              {STOCK.map((stock, i) => {
                const percentage = (stock.current / stock.max) * 100;
                
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base bg-slate-50 p-1 rounded-lg block">{stock.emoji}</span>
                        <span className="text-xs font-black text-slate-800">{stock.label}</span>
                      </div>
                      <span className="text-xs font-black" style={{ color: stock.color }}>{stock.current} / {stock.max} kg</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: stock.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent activity timeline */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex-1">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-50 bg-slate-50/50">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Collectes récentes</span>
              <button 
                onClick={() => navigate('/pro/demandes')}
                className="text-xs font-extrabold text-orange-500 flex items-center gap-0.5 border-none bg-transparent cursor-pointer"
              >
                <span>Voir tout</span>
                <ChevronRight size={13} />
              </button>
            </div>
            
            <div className="flex flex-col">
              {[
                { location: 'Cocody Riviera 2', type: 'Plastique PET', weight: '30 kg', price: '8 000 FCFA', time: 'Il y a 5 min' },
                { location: 'Yopougon Selmer', type: 'Carton', weight: '45 kg', price: '6 750 FCFA', time: 'Il y a 20 min' },
                { location: 'Plateau Centre', type: 'Métal', weight: '12 kg', price: '4 800 FCFA', time: 'Il y a 1h' },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 px-4 py-4"
                  style={{ borderBottom: idx < 2 ? '1px solid #f8f9fa' : 'none' }}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" 
                    style={{ background: 'rgba(230,126,34,0.1)' }}
                  >
                    <span className="text-lg">🧴</span>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800">{item.location} · {item.type}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">⚖️ {item.weight} · {item.time}</p>
                  </div>
                  
                  <span className="text-xs font-black text-emerald-500">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
