import { useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { MobileFrame } from '../../components/MobileFrame';
import { Recycle, Factory, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { setRole } = useApp();

  const handleCitizen = () => {
    setRole('citizen');
    navigate('/auth/register?role=citizen');
  };

  const handlePro = () => {
    setRole('pro');
    navigate('/auth/register?role=pro');
  };

  // Variants for staggered entrance animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  return (
    <MobileFrame bgColor="#F8F9F9">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center px-6 pt-8 pb-8 min-h-[760px] justify-between"
      >
        {/* Top & Logo */}
        <div className="flex flex-col items-center w-full">
          {/* Logo animation with glow */}
          <motion.div
            variants={itemVariants}
            className="relative flex items-center justify-center mb-4"
            style={{ width: 80, height: 80 }}
          >
            {/* Spinning background halo */}
            <div 
              className="absolute inset-0 rounded-3xl animate-pulse" 
              style={{ 
                background: `linear-gradient(135deg, ${GREEN} 0%, #27ae60 100%)`, 
                filter: 'blur(8px)',
                opacity: 0.4 
              }} 
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="relative flex items-center justify-center rounded-3xl"
              style={{
                width: 76,
                height: 76,
                background: `linear-gradient(135deg, ${GREEN} 0%, #27ae60 100%)`,
                boxShadow: '0 8px 24px rgba(46,204,113,0.3)',
              }}
            >
              <Recycle size={42} color="#fff" strokeWidth={2.5} />
            </motion.div>
          </motion.div>

          <motion.h1 
            variants={itemVariants} 
            className="text-4xl font-extrabold tracking-tight text-center"
            style={{ color: CHARCOAL }}
          >
            RecyGo
          </motion.h1>
          
          <motion.p 
            variants={itemVariants} 
            className="text-sm font-medium text-slate-500 mt-1 text-center"
          >
            Transforme tes déchets en argent de façon moderne
          </motion.p>
        </div>

        {/* Title */}
        <motion.div variants={itemVariants} className="w-full text-center my-6">
          <h2 className="text-xl font-bold" style={{ color: CHARCOAL }}>Qui es-tu ?</h2>
          <p className="text-xs text-slate-400 mt-1">Choisis ton profil pour commencer l'aventure</p>
        </motion.div>

        {/* Role Cards */}
        <div className="flex flex-col gap-5 w-full flex-1 justify-center">
          {/* Citizen Card */}
          <motion.button
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(46,204,113,0.22)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCitizen}
            className="w-full flex items-center text-left gap-4"
            style={{
              background: '#ffffff',
              borderRadius: 24,
              border: `2px solid ${GREEN}`,
              padding: '24px',
              boxShadow: '0 8px 24px rgba(46,204,113,0.1)',
              cursor: 'pointer',
            }}
          >
            <div 
              className="flex items-center justify-center shrink-0" 
              style={{ width: 56, height: 56, background: `${GREEN}12`, borderRadius: 16 }}
            >
              <Leaf size={28} color={GREEN} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold" style={{ color: CHARCOAL }}>
                  🧑‍🤝‍🧑 Citoyen
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${GREEN}15`, color: GREEN }}>Vendeur</span>
              </div>
              <div className="text-sm font-semibold mt-1" style={{ color: '#27ae60' }}>
                Je veux vendre mes déchets
              </div>
              <div className="text-xs text-slate-400 mt-1 leading-snug">
                Prends une photo de tes déchets et reçois de l'argent directement sur Mobile Money.
              </div>
            </div>
          </motion.button>

          {/* Pro Card */}
          <motion.button
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(44,62,80,0.3)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePro}
            className="w-full flex items-center text-left gap-4"
            style={{
              background: `linear-gradient(135deg, ${CHARCOAL} 0%, #1e2b37 100%)`,
              borderRadius: 24,
              border: '2px solid #34495e',
              padding: '24px',
              boxShadow: '0 8px 24px rgba(44,62,80,0.2)',
              cursor: 'pointer',
            }}
          >
            <div 
              className="flex items-center justify-center shrink-0" 
              style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.08)', borderRadius: 16 }}
            >
              <Factory size={28} color="#fff" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold text-white">
                  🏭 Recycleur Pro
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${ORANGE}22`, color: ORANGE }}>Collecteur</span>
              </div>
              <div className="text-sm font-semibold mt-1" style={{ color: ORANGE }}>
                Je gère les collectes
              </div>
              <div className="text-xs text-slate-300 mt-1 leading-snug">
                Suis ton inventaire, gère tes tournées de ramassage et connecte-toi aux usines.
              </div>
            </div>
          </motion.button>
        </div>

        {/* Footer */}
        <motion.p 
          variants={itemVariants} 
          className="text-xs text-slate-400 mt-6 text-center"
        >
          En continuant, tu acceptes nos <span className="underline cursor-pointer">Conditions d'utilisation</span>
        </motion.p>
      </motion.div>
    </MobileFrame>
  );
}
