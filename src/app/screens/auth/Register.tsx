import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useApp, Role } from '../../context/AppContext';
import { MobileFrame } from '../../components/MobileFrame';
import { User, Phone, ChevronLeft, ArrowRight, Recycle, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, setRole } = useApp();
  const role = (searchParams.get('role') || 'citizen') as Role;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [activeInput, setActiveInput] = useState<'name' | 'phone' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState(0);

  const accent = role === 'citizen' ? GREEN : CHARCOAL;

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Saisis ton nom complet');
      setErrorKey(prev => prev + 1);
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Numéro de téléphone invalide (10 chiffres requis)');
      setErrorKey(prev => prev + 1);
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = { name: name.trim(), phone: `+225 ${phone}`, role };
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
          className="flex items-center gap-1 mb-6 self-start text-slate-500 font-medium bg-none border-none cursor-pointer"
        >
          <ChevronLeft size={20} />
          <span className="text-sm">Retour</span>
        </motion.button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="flex items-center justify-center shrink-0" 
            style={{ width: 52, height: 52, background: accent, borderRadius: 18, boxShadow: `0 6px 16px ${accent}25` }}
          >
            <Recycle size={28} color="#fff" />
          </motion.div>
          <div>
            <h1 className="text-xl font-black" style={{ color: CHARCOAL }}>Créer mon compte</h1>
            <p className="text-xs font-bold mt-0.5" style={{ color: accent }}>
              {role === 'citizen' ? '🌿 Profil Citoyen' : '🏭 Profil Recycleur Pro'}
            </p>
          </div>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-5 flex-1">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
              👤 Ton Nom Complet
            </label>
            <div 
              className="flex items-center gap-3 transition-all duration-300" 
              style={{ 
                background: '#fff', 
                borderRadius: 18, 
                padding: '0 16px', 
                border: `2px solid ${activeInput === 'name' ? accent : name.trim() ? '#34c759' : '#e8ecef'}`, 
                boxShadow: activeInput === 'name' ? `0 4px 16px ${accent}15` : '0 2px 8px rgba(0,0,0,0.03)' 
              }}
            >
              <User size={18} color={activeInput === 'name' ? accent : name.trim() ? '#34c759' : '#94a3b8'} />
              <input
                type="text"
                placeholder="Ex: Koné Moussa"
                value={name}
                onChange={e => setName(e.target.value)}
                onFocus={() => setActiveInput('name')}
                onBlur={() => setActiveInput(null)}
                disabled={isLoading}
                className="font-semibold text-slate-800"
                style={{ 
                  flex: 1, 
                  border: 'none', 
                  outline: 'none', 
                  padding: '16px 0', 
                  fontSize: 15, 
                  background: 'transparent',
                }}
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
              📞 Numéro de Téléphone
            </label>
            <div 
              className="flex items-center transition-all duration-300" 
              style={{ 
                background: '#fff', 
                borderRadius: 18, 
                border: `2px solid ${activeInput === 'phone' ? accent : phone.length === 10 ? '#34c759' : '#e8ecef'}`, 
                boxShadow: activeInput === 'phone' ? `0 4px 16px ${accent}15` : '0 2px 8px rgba(0,0,0,0.03)',
                overflow: 'hidden'
              }}
            >
              <div 
                className="flex items-center gap-1 px-4 py-4 transition-colors" 
                style={{ 
                  background: activeInput === 'phone' ? `${accent}10` : '#f8f9fa', 
                  borderRight: `2px solid ${activeInput === 'phone' ? accent : '#e8ecef'}` 
                }}
              >
                <Phone size={16} color={activeInput === 'phone' ? accent : '#94a3b8'} />
                <span className="text-sm font-extrabold" style={{ color: activeInput === 'phone' ? accent : CHARCOAL }}>+225</span>
              </div>
              <input
                type="tel"
                placeholder="07 00 00 00 00"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                onFocus={() => setActiveInput('phone')}
                onBlur={() => setActiveInput(null)}
                disabled={isLoading}
                style={{ 
                  flex: 1, 
                  border: 'none', 
                  outline: 'none', 
                  padding: '16px 12px', 
                  fontSize: 15, 
                  background: 'transparent', 
                  color: CHARCOAL, 
                  letterSpacing: 1.5,
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
                  x: [0, -10, 10, -10, 10, -5, 5, 0] // Shake animation
                }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 p-4 text-sm font-semibold rounded-xl text-red-600 bg-red-50 border border-red-100"
              >
                <span className="text-base">⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Info Panel */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="flex gap-3 p-4 rounded-2xl border"
            style={{ 
              background: `linear-gradient(135deg, ${accent}08 0%, ${accent}15 100%)`, 
              borderColor: `${accent}25` 
            }}
          >
            <Info size={20} color={accent} className="shrink-0 mt-0.5" />
            <p className="text-xs font-semibold leading-relaxed" style={{ color: CHARCOAL }}>
              Ton numéro servira pour recevoir ton argent instantanément via Mobile Money (Wave, Orange Money, MTN) dès validation de tes dépôts.
            </p>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={!isLoading ? { y: -2, boxShadow: '0 8px 24px rgba(230,126,34,0.4)' } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 w-full border-none cursor-pointer py-4"
          style={{ 
            background: ORANGE, 
            borderRadius: 20, 
            boxShadow: '0 6px 18px rgba(230,126,34,0.3)', 
            marginTop: 24,
            opacity: isLoading ? 0.8 : 1
          }}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={24} color="#fff" />
          ) : (
            <>
              <span className="text-base font-black text-white uppercase tracking-wider">Créer mon compte</span>
              <ArrowRight size={20} color="#fff" strokeWidth={3} />
            </>
          )}
        </motion.button>

        {/* Bottom Switch Link */}
        <div className="text-center mt-6">
          <span className="text-sm text-slate-500">Tu as déjà un compte ? </span>
          <button 
            onClick={() => navigate(`/auth/login?role=${role}`)} 
            className="text-sm font-extrabold border-none bg-none cursor-pointer underline"
            style={{ color: accent }}
          >
            Se connecter
          </button>
        </div>
      </motion.div>
    </MobileFrame>
  );
}
