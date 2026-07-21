import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { MobileFrame } from '../../components/MobileFrame';
import { ChevronLeft, CheckCircle, Clock, ArrowDownLeft, Wallet, ShieldCheck, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

const PAYMENT_CHANNELS = [
  { id: 'wave', name: 'Wave', emoji: '🌊', color: '#1E90FF', bg: '#EBF5FF', description: 'Retrait sans frais · 0%' },
  { id: 'orange', name: 'Orange Money', emoji: '🟠', color: '#FF6600', bg: '#FFF3EB', description: 'Instantané 24h/7' },
  { id: 'mtn', name: 'MTN MoMo', emoji: '💛', color: '#FFCC00', bg: '#FFFBEB', description: 'Réseau national CI' },
];

const TRANSACTIONS = [
  { id: 1, type: 'Plastique PET', amount: 300, date: 'Aujourd\'hui 14h30', status: 'success' },
  { id: 2, type: 'Carton brun', amount: 150, date: 'Hier 09h15', status: 'success' },
  { id: 3, type: 'Canette alu', amount: 450, date: '18 Juil 16h45', status: 'success' },
];

export default function Argent() {
  const navigate = useNavigate();
  const { balance } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loadingChannel, setLoadingChannel] = useState<string | null>(null);
  const [txRef, setTxRef] = useState('');

  useEffect(() => {
    // Pre-generate a transfer reference
    setTxRef(`RG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
  }, []);

  const handleWithdraw = (channelId: string) => {
    setLoadingChannel(channelId);
    setSelected(channelId);

    // Simulate mobile money api delay
    setTimeout(() => {
      setLoadingChannel(null);
      setSuccess(true);
    }, 1500);
  };

  // Launch confetti celebration when payment is successful
  useEffect(() => {
    if (success) {
      // Direct blast
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.75 }
      });
      // Staggered secondary blast
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [success]);

  if (success) {
    const channel = PAYMENT_CHANNELS.find(c => c.id === selected);
    return (
      <MobileFrame bgColor="#F8F9F9">
        <div className="flex flex-col items-center justify-center px-6 min-h-[760px] select-none">
          {/* Animated Success Badge */}
          <motion.div 
            initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex items-center justify-center mb-6 shadow-lg"
            style={{ 
              width: 84, 
              height: 84, 
              background: GREEN, 
              borderRadius: '50%',
              boxShadow: `0 12px 30px ${GREEN}40`
            }}
          >
            <CheckCircle size={44} color="#fff" strokeWidth={2.5} />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black text-center leading-tight" 
            style={{ color: CHARCOAL }}
          >
            {balance} FCFA <br/>transférés !
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-semibold text-slate-500 mt-2 text-center"
          >
            Virement effectué vers ton compte {channel?.name}
          </motion.p>

          {/* Premium Receipt */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-5 w-full mt-6 shadow-sm border border-slate-100 relative overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-slate-50 p-2.5 rounded-2xl block">{channel?.emoji}</span>
              <div>
                <p className="font-extrabold text-slate-800">{channel?.name}</p>
                <p className="text-xs text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                  <ShieldCheck size={13} /> Paiement instantané sécurisé
                </p>
              </div>
            </div>
            
            <div className="h-[1px] bg-slate-100 my-4" />
            
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider">N° de Référence</span>
              <span className="font-mono font-black text-slate-800">{txRef}</span>
            </div>
          </motion.div>

          {/* Action Back Home */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/citizen')}
            className="w-full border-none cursor-pointer py-4 mt-8 rounded-2xl text-white font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2"
            style={{ background: GREEN, boxShadow: `0 8px 24px ${GREEN}30` }}
          >
            <span>Retour à l'accueil</span>
          </motion.button>
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame bgColor="#F8F9F9">
      <div className="flex flex-col min-h-[760px] select-none">
        
        {/* Upper card header */}
        <div 
          className="relative px-5 pt-4 pb-8 rounded-b-[32px] shadow-lg flex flex-col justify-between"
          style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #1abc9c 100%)` }}
        >
          {/* Back btn */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/citizen')} 
            className="flex items-center gap-1.5 self-start mb-4 border-none cursor-pointer bg-transparent text-white/90 font-semibold"
          >
            <ChevronLeft size={20} color="#fff" />
            <span className="text-xs">Retour</span>
          </motion.button>

          {/* Virtual eco debit card (Glassmorphism layout) */}
          <div 
            className="relative rounded-2xl p-5 text-white overflow-hidden shadow-inner border border-white/20"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(12px)'
            }}
          >
            {/* NFC Wireless logo */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-white/75 uppercase tracking-widest font-black">RecyGo Wallet</p>
                <div className="w-9 h-7 bg-amber-400/20 rounded-md border border-amber-400/30 mt-3 flex items-center justify-center">
                  <div className="w-5 h-4 bg-amber-400/40 rounded-sm" />
                </div>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-60">
                <path d="M5 17.5c2.5-2.5 2.5-6.5 0-9M8 20c4-4 4-10 0-14M11 22.5c5.5-5.5 5.5-13.5 0-19" />
              </svg>
            </div>

            <div className="mt-6">
              <p className="text-[11px] text-white/75 font-semibold">Solde disponible pour retrait</p>
              <h1 className="text-3xl font-black mt-1 tracking-tight flex items-baseline gap-1.5">
                {balance.toLocaleString()} <span className="text-base font-bold text-emerald-100">FCFA</span>
              </h1>
            </div>

            <div className="mt-4 flex justify-between items-end">
              <span className="text-[10px] font-mono tracking-wider opacity-60">**** **** **** 1092</span>
              <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded uppercase">CI</span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col px-5 pt-5 gap-5 pb-6">
          {/* Payment channels section */}
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Choisir le mode de paiement</p>
            <div className="flex flex-col gap-3">
              {PAYMENT_CHANNELS.map(channel => {
                const isSelected = selected === channel.id;
                const isLoading = loadingChannel === channel.id;
                
                return (
                  <motion.button
                    key={channel.id}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWithdraw(channel.id)}
                    disabled={loadingChannel !== null}
                    className="flex items-center gap-4 border border-slate-200/80 cursor-pointer rounded-2xl p-4 text-left shadow-sm transition-all"
                    style={{
                      background: isSelected ? channel.bg : '#ffffff',
                      borderColor: isSelected ? channel.color : '#e2e8f0',
                    }}
                  >
                    <span className="text-3xl bg-slate-50 p-1.5 rounded-xl block">{channel.emoji}</span>
                    
                    <div className="flex-1">
                      <p className="text-sm font-extrabold text-slate-800">{channel.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{channel.description}</p>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="text-sm font-black" style={{ color: channel.color }}>{balance} FCFA</span>
                      {isLoading ? (
                        <div 
                          className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin mt-1" 
                          style={{ borderColor: `${channel.color} transparent transparent ${channel.color}` }}
                        />
                      ) : (
                        <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">Retirer →</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Transactions list */}
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Historique des gains</p>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {TRANSACTIONS.map((tx, idx) => (
                <div 
                  key={tx.id} 
                  className="flex items-center gap-3.5 px-4 py-4"
                  style={{ borderBottom: idx < TRANSACTIONS.length - 1 ? '1px solid #f8f9fa' : 'none' }}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" 
                    style={{ background: 'rgba(46,204,113,0.1)' }}
                  >
                    <ArrowDownLeft size={18} color={GREEN} strokeWidth={2.5} />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800">{tx.type}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock size={11} /> {tx.date}
                    </p>
                  </div>

                  <span className="text-xs font-black text-emerald-500">+{tx.amount} FCFA</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
