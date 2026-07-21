import { useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { MobileFrame } from '../../components/MobileFrame';
import { Camera, ReceiptText, MapPin, Wallet, Bell, Settings, Recycle, ArrowRight, Award } from 'lucide-react';
import { motion } from 'motion/react';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

export default function CitizenHome() {
  const navigate = useNavigate();
  const { user, balance } = useApp();

  return (
    <MobileFrame bgColor="#F8F9F9">
      <div className="flex flex-col min-h-[760px]">
        {/* Header with fluid gradient */}
        <div 
          className="relative overflow-hidden px-5 pt-6 pb-8 rounded-b-[32px] shadow-lg select-none"
          style={{ 
            background: 'linear-gradient(135deg, #2ecc71 0%, #1abc9c 100%)',
          }}
        >
          {/* Subtle blurred design elements in background */}
          <div className="absolute top-[-30px] right-[-30px] w-28 height-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute bottom-[-40px] left-[-20px] w-36 height-36 rounded-full bg-emerald-300/20 blur-2xl pointer-events-none" />

          {/* Navigation/Actions bar */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <div 
                className="flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/10"
                style={{ width: 38, height: 38 }}
              >
                <Recycle size={20} color="#fff" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">RecyGo</span>
            </div>
            
            <div className="flex gap-2.5">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 border border-white/10 cursor-pointer"
                style={{ width: 38, height: 38 }}
              >
                <Bell size={18} color="#fff" />
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/shared/switch-role')} 
                className="flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 border border-white/10 cursor-pointer"
                style={{ width: 38, height: 38 }}
              >
                <Settings size={18} color="#fff" />
              </motion.button>
            </div>
          </div>

          {/* Welcome & Balance */}
          <div className="relative z-10">
            <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Bonjour 👋</p>
            <h2 className="text-2xl font-black text-white mt-0.5">{user?.name || 'Utilisateur'}</h2>
            
            {/* Balance card */}
            <motion.div 
              whileHover={{ y: -1 }}
              className="mt-5 p-5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner flex justify-between items-center"
            >
              <div>
                <p className="text-xs font-bold text-white/80 uppercase tracking-wide">Mon Solde mobile money</p>
                <p className="text-3xl font-black text-white mt-1 tracking-tight">
                  {balance.toLocaleString()} <span className="text-lg font-bold text-emerald-100">FCFA</span>
                </p>
              </div>
              <div 
                onClick={() => navigate('/citizen/argent')}
                className="flex items-center justify-center rounded-full bg-white text-emerald-600 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                style={{ width: 44, height: 44 }}
              >
                <ArrowRight size={20} strokeWidth={2.5} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center px-5 pt-6 flex-1 justify-between pb-6">
          <div className="w-full text-center">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
              Prêt à recycler ?
            </h3>
            <p className="text-xs text-slate-400">
              Prends en photo tes bouteilles, cartons ou métaux
            </p>
          </div>

          {/* Glowing Shutter Camera Button */}
          <div className="relative flex items-center justify-center my-6">
            {/* Sonar pulse rings */}
            <div className="sonar-ring absolute" style={{ animationDelay: '0s' }} />
            <div className="sonar-ring absolute" style={{ animationDelay: '0.8s' }} />
            <div className="sonar-ring absolute" style={{ animationDelay: '1.6s' }} />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => navigate('/citizen/camera')}
              className="relative flex flex-col items-center justify-center border-none cursor-pointer z-10"
              style={{
                width: 170,
                height: 170,
                background: `linear-gradient(135deg, ${ORANGE} 0%, #d35400 100%)`,
                borderRadius: '50%',
                boxShadow: `0 12px 36px rgba(230,126,34,0.45), inset 0 4px 10px rgba(255,255,255,0.2)`,
              }}
            >
              <Camera size={56} color="#fff" strokeWidth={2} />
              <span className="text-xs font-black text-white mt-2.5 tracking-widest uppercase">Scanner</span>
            </motion.button>
          </div>

          {/* Info categories */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/50 mb-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">🔍 plastique · carton · métal · verre</span>
          </div>

          {/* Stats card */}
          <div className="w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-4">
            <div className="flex items-center gap-1.5 mb-4">
              <Award size={16} color={GREEN} />
              <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Mon Impact (Cette semaine)</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Recyclé', value: '3 fois', color: '#3498db', bg: '#ebf5fb' },
                { label: 'Poids total', value: '12 kg', color: GREEN, bg: '#e8f8f5' },
                { label: 'Gains', value: '900 FCFA', color: ORANGE, bg: '#fef5e7' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center p-3 rounded-xl border border-slate-100" style={{ background: stat.bg }}>
                  <span className="text-sm font-extrabold" style={{ color: stat.color }}>{stat.value}</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide text-center">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid Navigation */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              { icon: ReceiptText, label: 'Mes Ventes', path: '/citizen/analyse', color: GREEN },
              { icon: MapPin, label: 'Collectes', path: '/citizen/camera', color: ORANGE },
              { icon: Wallet, label: 'Mon Argent', path: '/citizen/argent', color: '#9b59b6' },
            ].map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center border-none cursor-pointer p-4 bg-white rounded-2xl shadow-sm border border-slate-100"
              >
                <div 
                  className="flex items-center justify-center mb-2.5 rounded-xl"
                  style={{ width: 44, height: 44, background: `${item.color}12` }}
                >
                  <item.icon size={22} color={item.color} />
                </div>
                <span className="text-xs font-extrabold text-slate-700 text-center leading-tight">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded style sheet for ripples */}
      <style>{`
        .sonar-ring {
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background-color: ${ORANGE};
          opacity: 0;
          animation: sonar 2.4s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
        }
        @keyframes sonar {
          0% {
            transform: scale(0.95);
            opacity: 0.55;
          }
          100% {
            transform: scale(1.45);
            opacity: 0;
          }
        }
      `}</style>
    </MobileFrame>
  );
}
