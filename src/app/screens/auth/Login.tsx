import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useApp, Role } from '../../context/AppContext';
import { MobileFrame } from '../../components/MobileFrame';
import { Phone, ChevronLeft, ArrowRight, Recycle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, setRole } = useApp();
  const role = (searchParams.get('role') || 'citizen') as Role;

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState(0); // Used to trigger shake animation on error repeat

  const accent = role === 'citizen' ? GREEN : CHARCOAL;

  const handleLogin = () => {
    if (!phone.trim() || phone.length < 10) {
      setError('Numéro de téléphone invalide (10 chiffres requis)');
      setErrorKey(prev => prev + 1);
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate network delay for a fluid experience
    setTimeout(() => {
      setIsLoading(false);
      const user = { name: role === 'citizen' ? 'Koné Moussa' : 'Recycleur Côte d\'Ivoire', phone: `+225 ${phone}`, role };
      login(user);
      setRole(role);
      navigate(role === 'citizen' ? '/citizen' : '/pro');
    }, 1200);
  };

  return (
    <MobileFrame bgColor="#F8F9F9">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="flex flex-col px-6 pt-4 pb-8 min-h-[760px]"
      >
        {/* Back Button */}
        <motion.button 
          whileHover={{ x: -2 }}
          onClick={() => navigate('/')} 
          className="flex items-center gap-1 mb-8 self-start text-slate-500 font-medium bg-none border-none cursor-pointer"
        >
          <ChevronLeft size={20} />
          <span className="text-sm">Retour</span>
        </motion.button>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center mb-4" 
            style={{ 
              width: 72, 
              height: 72, 
              background: accent, 
              borderRadius: 22, 
              boxShadow: `0 8px 24px ${accent}30` 
            }}
          >
            <Recycle size={38} color="#fff" />
          </motion.div>
          <h1 className="text-2xl font-extrabold" style={{ color: CHARCOAL }}>Connexion</h1>
          <p className="text-xs font-bold mt-1.5 px-3 py-1 rounded-full" style={{ background: `${accent}15`, color: accent }}>
            {role === 'citizen' ? '🌿 Espace Citoyen' : '🏭 Espace Recycleur Pro'}
          </p>
        </div>

        {/* Phone Input */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
            📞 Ton Numéro de Téléphone
          </label>
          
          <div 
            className="flex items-center transition-all duration-300" 
            style={{ 
              background: '#fff', 
              borderRadius: 20, 
              border: `2px solid ${isFocused ? accent : phone.length === 10 ? '#34c759' : '#e8ecef'}`, 
              overflow: 'hidden', 
              boxShadow: isFocused ? `0 4px 20px ${accent}15` : '0 4px 12px rgba(0,0,0,0.03)' 
            }}
          >
            <div 
              className="flex items-center gap-1.5 px-4 py-4 transition-colors" 
              style={{ 
                background: isFocused ? `${accent}10` : '#f8f9fa', 
                borderRight: `2px solid ${isFocused ? accent : '#e8ecef'}` 
              }}
            >
              <Phone size={18} color={isFocused ? accent : '#94a3b8'} />
              <span className="text-base font-extrabold" style={{ color: isFocused ? accent : CHARCOAL }}>+225</span>
            </div>
            
            <input
              type="tel"
              placeholder="07 00 00 00 00"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isLoading}
              style={{ 
                flex: 1, 
                border: 'none', 
                outline: 'none', 
                padding: '16px', 
                fontSize: 18, 
                background: 'transparent', 
                color: CHARCOAL, 
                letterSpacing: 2, 
                fontWeight: 700 
              }}
            />
          </div>
        </div>

        {/* Error Alert with shake animation */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              key={errorKey}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                x: [0, -10, 10, -10, 10, -5, 5, 0] // Shake animation keyframes
              }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 p-4 mb-4 text-sm font-semibold rounded-xl text-red-600 bg-red-50 border border-red-100"
            >
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit CTA */}
        <motion.button
          whileHover={!isLoading ? { y: -2, boxShadow: '0 8px 24px rgba(230,126,34,0.4)' } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          onClick={handleLogin}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 w-full border-none cursor-pointer py-4"
          style={{ 
            background: ORANGE, 
            borderRadius: 20, 
            boxShadow: '0 6px 18px rgba(230,126,34,0.3)', 
            marginTop: 8,
            opacity: isLoading ? 0.8 : 1
          }}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={24} color="#fff" />
          ) : (
            <>
              <span className="text-lg font-black text-white">Se connecter</span>
              <ArrowRight size={22} color="#fff" strokeWidth={3} />
            </>
          )}
        </motion.button>

        {/* Separator */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-[1px] bg-slate-200" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ou</span>
          <div className="flex-1 h-[1px] bg-slate-200" />
        </div>

        {/* Register Link */}
        <div className="text-center mb-6">
          <p className="text-sm text-slate-500">Nouveau sur RecyGo ?</p>
          <button
            onClick={() => navigate(`/auth/register?role=${role}`)}
            className="text-base font-extrabold mt-1 border-none bg-none cursor-pointer"
            style={{ color: accent }}
          >
            Créer un compte gratuitement
          </button>
        </div>

        {/* Switch Profile Space */}
        <motion.div 
          whileHover={{ y: -1 }}
          className="text-center mt-auto p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {role === 'citizen' ? 'Recycleur Professionnel ?' : 'Simple Citoyen ?'}
          </p>
          <button
            onClick={() => navigate(`/auth/login?role=${role === 'citizen' ? 'pro' : 'citizen'}`)}
            className="text-sm font-extrabold mt-1 bg-none border-none cursor-pointer"
            style={{ color: role === 'citizen' ? CHARCOAL : GREEN }}
          >
            Basculer vers l'espace {role === 'citizen' ? 'Pro' : 'Citoyen'} →
          </button>
        </motion.div>
      </motion.div>
    </MobileFrame>
  );
}
