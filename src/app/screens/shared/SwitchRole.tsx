import { useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { MobileFrame } from '../../components/MobileFrame';
import { ChevronLeft, LogOut, Leaf, Factory, ChevronRight, Shield, HelpCircle, Bell, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

export default function SwitchRole() {
  const navigate = useNavigate();
  const { role, user, setRole, logout } = useApp();

  const handleSwitchToCitizen = () => {
    setRole('citizen');
    navigate('/citizen');
  };

  const handleSwitchToPro = () => {
    setRole('pro');
    navigate('/pro');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isCitizen = role === 'citizen';
  const accentColor = isCitizen ? GREEN : CHARCOAL;

  return (
    <MobileFrame bgColor="#F8F9F9">
      <div className="flex flex-col min-h-[760px] select-none">
        
        {/* Profile/Role Header */}
        <div 
          className="relative px-5 pt-4 pb-8 rounded-b-[32px] shadow-lg text-white"
          style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #16213e 120%)` }}
        >
          {/* Back btn */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(isCitizen ? '/citizen' : '/pro')} 
            className="flex items-center gap-1.5 self-start mb-4 border-none cursor-pointer bg-transparent text-white/95 font-bold"
          >
            <ChevronLeft size={20} color="#fff" />
            <span className="text-xs">Retour</span>
          </motion.button>

          {/* User Profile Info Card */}
          <div className="flex items-center gap-4 mt-2">
            <div 
              className="w-16 h-16 bg-white/20 border border-white/10 rounded-2xl flex items-center justify-center text-3xl shadow-inner"
            >
              {isCitizen ? '🌿' : '🏭'}
            </div>
            
            <div className="flex-1">
              <h1 className="text-xl font-black text-white">{user?.name || 'Utilisateur'}</h1>
              <p className="text-xs text-white/75 mt-0.5">{user?.phone || '+225 07 00 00 00 00'}</p>
              
              {/* Gamification badge */}
              <div className="inline-flex items-center gap-1 bg-white/20 border border-white/5 rounded-lg px-2.5 py-0.5 mt-2">
                <Trophy size={11} className="text-yellow-400" />
                <span className="text-[9px] font-black text-white uppercase tracking-wider">Niveau 4 · Protecteur Vert</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col px-5 pt-5 gap-5 pb-6">
          {/* Switch Role block */}
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Changer de mode</p>
            <div className="flex gap-4">
              {/* Switch to Citizen */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSwitchToCitizen}
                className="flex-1 flex flex-col items-center p-4 border rounded-3xl cursor-pointer transition-all shadow-sm"
                style={{
                  background: isCitizen ? `${GREEN}08` : '#ffffff',
                  borderColor: isCitizen ? GREEN : '#e2e8f0',
                }}
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: isCitizen ? `${GREEN}20` : '#f1f5f9' }}
                >
                  <Leaf size={24} color={isCitizen ? GREEN : '#94a3b8'} />
                </div>
                <span className={`text-sm font-black ${isCitizen ? 'text-emerald-500' : 'text-slate-500'}`}>Citoyen</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Vendre</span>
                
                {isCitizen && (
                  <span className="text-[8px] font-black text-white uppercase tracking-wider bg-emerald-500 px-2 py-0.5 rounded-full mt-3">
                    Actif
                  </span>
                )}
              </motion.button>

              {/* Switch to Pro */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSwitchToPro}
                className="flex-1 flex flex-col items-center p-4 border rounded-3xl cursor-pointer transition-all shadow-sm"
                style={{
                  background: !isCitizen ? `${CHARCOAL}08` : '#ffffff',
                  borderColor: !isCitizen ? CHARCOAL : '#e2e8f0',
                }}
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: !isCitizen ? `${CHARCOAL}20` : '#f1f5f9' }}
                >
                  <Factory size={24} color={!isCitizen ? CHARCOAL : '#94a3b8'} />
                </div>
                <span className={`text-sm font-black ${!isCitizen ? 'text-slate-800' : 'text-slate-500'}`}>Recycleur Pro</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Gérer</span>
                
                {!isCitizen && (
                  <span className="text-[8px] font-black text-white uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded-full mt-3">
                    Actif
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Account Settings Menu */}
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Mon compte & Support</p>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {[
                { icon: Bell, label: 'Notifications', desc: 'Alertes collectes activées', color: ORANGE },
                { icon: Shield, label: 'Confidentialité', desc: 'Données personnelles cryptées', color: GREEN },
                { icon: HelpCircle, label: 'Aide & Support client', desc: 'FAQ, Assistance Whatsapp 24h/7', color: '#3498db' },
              ].map((item, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ background: '#f8f9fa' }}
                  className="flex items-center gap-3.5 w-full px-4 py-4 text-left border-none bg-transparent cursor-pointer"
                  style={{ borderBottom: idx < 2 ? '1px solid #f8f9fa' : 'none' }}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" 
                    style={{ background: `${item.color}10` }}
                  >
                    <item.icon size={18} color={item.color} />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  
                  <ChevronRight size={16} color="#cbd5e1" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Log Out CTA */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center justify-center gap-2.5 w-full cursor-pointer py-4 rounded-3xl border-2 transition-all mt-2"
            style={{ 
              background: '#fdf2f2', 
              borderColor: '#fde8e8',
            }}
          >
            <LogOut size={18} color="#e53e3e" />
            <span className="text-xs font-black text-red-600 uppercase tracking-wider">Se déconnecter</span>
          </motion.button>

          <p className="text-[9px] text-slate-400 text-center mt-4">
            RecyGo App v1.0.3 · Fait avec ♻️ à Abidjan, Côte d'Ivoire
          </p>
        </div>
      </div>
    </MobileFrame>
  );
}
