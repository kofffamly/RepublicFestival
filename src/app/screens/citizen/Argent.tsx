import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { MobileFrame } from '../../components/MobileFrame';
import { ChevronLeft, CheckCircle, Clock, ArrowDownLeft, Wallet, ShieldCheck, ArrowUpRight, Sparkles, Loader, Zap, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

const PAYMENT_CHANNELS = [
  { id: 'wave', name: 'Wave', emoji: '🌊', color: '#1E90FF', bg: '#EBF5FF', description: 'Retrait sans frais · 0%', gradient: 'linear-gradient(135deg, #1E90FF, #187bcd)' },
  { id: 'orange', name: 'Orange Money', emoji: '🟠', color: '#FF6600', bg: '#FFF3EB', description: 'Instantané 24h/7', gradient: 'linear-gradient(135deg, #FF6600, #e55a00)' },
  { id: 'mtn', name: 'MTN MoMo', emoji: '💛', color: '#FFCC00', bg: '#FFFBEB', description: 'Réseau national CI', gradient: 'linear-gradient(135deg, #FFCC00, #e6b800)' },
];

const TRANSACTIONS = [
  { id: 1, type: 'Plastique PET', amount: 300, date: 'Aujourd\'hui 14h30', status: 'success', emoji: '🧴' },
  { id: 2, type: 'Carton brun', amount: 150, date: 'Hier 09h15', status: 'success', emoji: '📦' },
  { id: 3, type: 'Canette alu', amount: 450, date: '18 Juil 16h45', status: 'success', emoji: '🥫' },
  { id: 4, type: 'Bouteilles verre', amount: 200, date: '15 Juil 11h20', status: 'success', emoji: '🍶' },
];

// Animated counter hook
function useAnimatedCounter(target: number, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const startTime = performance.now();
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return count;
}

// Withdrawal step indicator
function WithdrawStepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: 'Sélection', emoji: '👆' },
    { label: 'Confirmation', emoji: '⚡' },
    { label: 'Transfert', emoji: '💸' },
    { label: 'Terminé', emoji: '✅' },
  ];

  return (
    <div className="flex items-center justify-between px-2 py-3">
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 relative">
          {/* Connector line */}
          {idx < steps.length - 1 && (
            <div
              className="absolute top-3 left-[60%] right-0 h-0.5"
              style={{
                background: idx < currentStep ? GREEN : '#e2e8f0',
                transition: 'background 0.3s ease',
              }}
            />
          )}
          {/* Step circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black relative z-10"
            style={{
              background: idx < currentStep ? GREEN : idx === currentStep ? ORANGE : '#f1f5f9',
              color: idx <= currentStep ? '#fff' : '#94a3b8',
              boxShadow: idx === currentStep ? `0 0 0 4px ${ORANGE}20` : 'none',
            }}
          >
            {idx < currentStep ? '✓' : idx === currentStep ? step.emoji : idx + 1}
          </motion.div>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider text-center">
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Argent() {
  const navigate = useNavigate();
  const { balance } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loadingChannel, setLoadingChannel] = useState<string | null>(null);
  const [txRef, setTxRef] = useState('');
  const [step, setStep] = useState(0);
  const confettiTriggered = useRef(false);

  const animatedBalance = useAnimatedCounter(balance);

  useEffect(() => {
    setTxRef(`RG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
  }, []);

  const handleWithdraw = (channelId: string) => {
    setLoadingChannel(channelId);
    setSelected(channelId);
    setStep(1);

    // Step progression
    setTimeout(() => setStep(2), 500);
    setTimeout(() => setStep(3), 1100);

    // Complete
    setTimeout(() => {
      setLoadingChannel(null);
      setSuccess(true);
      setStep(4);
    }, 1600);
  };

  // Enhanced confetti celebration
  useEffect(() => {
    if (success && !confettiTriggered.current) {
      confettiTriggered.current = true;

      // Main central burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.65, x: 0.5 },
        colors: ['#2ECC71', '#1E90FF', '#FF6600', '#FFCC00', '#9B59B6'],
        shapes: ['circle', 'square'],
        ticks: 200,
      });

      // Left cannon
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 50,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#2ECC71', '#1E90FF'],
        });
      }, 200);

      // Right cannon
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 130,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#FF6600', '#FFCC00'],
        });
      }, 300);

      // Top shower
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 100,
          origin: { y: 0, x: 0.5 },
          colors: ['#2ECC71', '#9B59B6'],
          startVelocity: 30,
        });
      }, 500);

      confettiTriggered.current = true;
    }
  }, [success]);

  if (success) {
    const channel = PAYMENT_CHANNELS.find(c => c.id === selected);
    return (
      <MobileFrame bgColor="#F8F9F9">
        <div className="flex flex-col items-center justify-center px-6 min-h-[760px] select-none">
          {/* Animated Success Badge */}
          <motion.div
            initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12 }}
            className="flex items-center justify-center mb-5"
            style={{
              width: 100,
              height: 100,
              background: `linear-gradient(135deg, ${GREEN}, #1abc9c)`,
              borderRadius: '50%',
              boxShadow: `0 12px 40px ${GREEN}40`,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <CheckCircle size={52} color="#fff" strokeWidth={2.5} />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl font-black text-center leading-tight"
            style={{ color: CHARCOAL }}
          >
            {balance.toLocaleString()} FCFA <br/>transférés !
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-sm font-semibold text-slate-500 mt-2 text-center"
          >
            Virement effectué vers ton compte {channel?.name}
          </motion.p>

          {/* Premium Receipt with shimmer */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-3xl p-5 w-full mt-6 shadow-sm border border-slate-100 relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                skewX: '-20deg',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', repeatDelay: 1 }}
            />

            <div className="flex items-center gap-3 relative z-10">
              <motion.span
                initial={{ rotate: -10 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-3xl bg-slate-50 p-2.5 rounded-2xl block"
              >
                {channel?.emoji}
              </motion.span>
              <div>
                <p className="font-extrabold text-slate-800">{channel?.name}</p>
                <p className="text-xs text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                  <ShieldCheck size={13} /> Paiement instantané sécurisé
                </p>
              </div>
            </div>

            <div className="h-[1px] bg-slate-100 my-4" />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Smartphone size={14} color="#94a3b8" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">N° de Référence</span>
              </div>
              <span className="font-mono font-black text-slate-800 text-xs">{txRef}</span>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statut</span>
              <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1">
                <Zap size={10} /> Confirmé
              </span>
            </div>

            {/* Transaction hash visual */}
            <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-[8px] font-mono text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="truncate">TX_HASH: 0x7a3f...{txRef.slice(-4)}</span>
              </div>
            </div>
          </motion.div>

          {/* Action Back Home */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/citizen')}
            className="w-full border-none cursor-pointer py-4 mt-8 rounded-2xl text-white font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${GREEN}, #1abc9c)`,
              boxShadow: `0 8px 24px ${GREEN}30`,
            }}
          >
            <Sparkles size={16} />
            <span>Retour à l'accueil</span>
          </motion.button>
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame bgColor="#F8F9F9">
      <div className="flex flex-col min-h-[760px] select-none">
        {/* Upper card header — Gradient */}
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

          {/* Virtual eco debit card (Glassmorphism) */}
          <div
            className="relative rounded-2xl p-5 text-white overflow-hidden shadow-inner border border-white/20"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Decorative pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, #fff 1px, transparent 0)', backgroundSize: '20px 20px' }}
            />

            <div className="flex justify-between items-start relative z-10">
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

            <div className="mt-6 relative z-10">
              <p className="text-[11px] text-white/75 font-semibold">Solde disponible pour retrait</p>
              <h1 className="text-3xl font-black mt-1 tracking-tight flex items-baseline gap-1.5">
                <motion.span
                  key={balance}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                >
                  {animatedBalance.toLocaleString()}
                </motion.span>
                <span className="text-base font-bold text-emerald-100">FCFA</span>
              </h1>
            </div>

            {/* Withdrawal step indicator (visible when in progress) */}
            <AnimatePresence>
              {step > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-white/10"
                >
                  <WithdrawStepIndicator currentStep={step} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex justify-between items-end relative z-10">
              <span className="text-[10px] font-mono tracking-wider opacity-60">**** **** **** 1092</span>
              <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded uppercase">CI</span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col px-5 pt-5 gap-5 pb-6 flex-1 overflow-y-auto">
          {/* Payment channels section */}
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
              <Wallet size={12} /> Choisir le mode de paiement
            </p>
            <div className="flex flex-col gap-3">
              {PAYMENT_CHANNELS.map((channel, idx) => {
                const isSelected = selected === channel.id;
                const isLoading = loadingChannel === channel.id;

                return (
                  <motion.button
                    key={channel.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWithdraw(channel.id)}
                    disabled={loadingChannel !== null}
                    className="flex items-center gap-4 border cursor-pointer rounded-2xl p-4 text-left shadow-sm transition-all"
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
                      <span className="text-sm font-black" style={{ color: channel.color }}>
                        {balance.toLocaleString()} FCFA
                      </span>
                      {isLoading ? (
                        <div className="flex items-center gap-1 mt-1">
                          <Loader size={10} className="animate-spin" style={{ color: channel.color }} />
                          <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">En cours...</span>
                        </div>
                      ) : (
                        <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1 mt-1">
                          Retirer <ArrowUpRight size={10} />
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Transactions list — Staggered animation */}
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
              <Clock size={12} /> Historique des gains
            </p>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <AnimatePresence>
                {TRANSACTIONS.map((tx, idx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3.5 px-4 py-4"
                    style={{ borderBottom: idx < TRANSACTIONS.length - 1 ? '1px solid #f8f9fa' : 'none' }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(46,204,113,0.1)' }}
                    >
                      <ArrowDownLeft size={18} color={GREEN} strokeWidth={2.5} />
                    </motion.div>

                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span>{tx.emoji}</span>
                        <p className="text-xs font-black text-slate-800">{tx.type}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock size={11} /> {tx.date}
                      </p>
                    </div>

                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: idx * 0.05 + 0.2 }}
                      className="text-xs font-black text-emerald-500"
                    >
                      +{tx.amount} FCFA
                    </motion.span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

