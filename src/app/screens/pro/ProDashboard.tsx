import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import { MobileFrame } from '../../components/MobileFrame';
import { Bell, Settings, TrendingUp, Bell as AlertIcon, Map, Building2, ChevronRight, Package, Recycle, Truck, BarChart3, Clock, Sparkles, Zap, Target, ShoppingBag } from 'lucide-react';
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

const RECENT_COLLECTIONS = [
  { location: 'Cocody Riviera 2', type: 'Plastique PET', weight: '30 kg', price: '8 000 FCFA', time: 'Il y a 5 min', emoji: '🧴', status: 'completed' },
  { location: 'Yopougon Selmer', type: 'Carton', weight: '45 kg', price: '6 750 FCFA', time: 'Il y a 20 min', emoji: '📦', status: 'completed' },
  { location: 'Plateau Centre', type: 'Métal', weight: '12 kg', price: '4 800 FCFA', time: 'Il y a 1h', emoji: '🥫', status: 'in_progress' },
  { location: 'Adjamé Marché', type: 'Verre mixte', weight: '18 kg', price: '2 700 FCFA', time: 'Il y a 2h', emoji: '🍶', status: 'pending' },
];

const QUICK_ACTIONS = [
  { icon: AlertIcon, label: 'Demandes', path: '/pro/demandes', color: ORANGE, badge: 8 },
  { icon: Map, label: 'Carte Live', path: '/pro/demandes', color: '#3498db', badge: null },
  { icon: Building2, label: 'Usines Rachat', path: '/pro/points-rachat', color: GREEN, badge: null },
];

// Animated counter hook
function useAnimatedCounter(target: number, duration = 1200) {
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

function AnimatedMetricCard({ icon: Icon, label, value, suffix, color, sublabel }: {
  icon: any;
  label: string;
  value: number;
  suffix: string;
  color: string;
  sublabel: string;
}) {
  const animatedValue = useAnimatedCounter(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 14 }}
      className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 shadow-inner"
    >
      <div className="flex items-center gap-1.5 mb-1 text-slate-400">
        <Icon size={14} color={color} />
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-3xl font-black text-white">
          {animatedValue}{suffix}
        </span>
        <span className="text-[10px] font-bold text-slate-400">{sublabel}</span>
      </div>
    </motion.div>
  );
}

function ProgressBarWithLabel({ label, current, max, color, emoji, index }: {
  label: string;
  current: number;
  max: number;
  color: string;
  emoji: string;
  index: number;
}) {
  const percentage = (current / max) * 100;
  const animatedPercent = useAnimatedCounter(percentage);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <motion.span
            whileHover={{ scale: 1.2 }}
            className="text-base bg-slate-50 p-1 rounded-lg block"
          >
            {emoji}
          </motion.span>
          <span className="text-xs font-black text-slate-800">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black" style={{ color }}>{current} / {max} kg</span>
          <span className="text-[9px] font-bold text-slate-400">({animatedPercent}%)</span>
        </div>
      </div>
      {/* Progress Bar Container */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${animatedPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full relative"
          style={{ background: color }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              skewX: '-20deg',
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', repeatDelay: 1 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  const width = 100;
  const height = 32;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - minVal) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="opacity-70">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

function TimelineItem({ item, index }: { item: typeof RECENT_COLLECTIONS[0]; index: number }) {
  const statusColors = {
    completed: GREEN,
    in_progress: ORANGE,
    pending: '#94a3b8',
  };

  const statusLabels = {
    completed: 'Terminée',
    in_progress: 'En cours',
    pending: 'En attente',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex gap-3 px-4 py-4"
      style={{ borderBottom: index < RECENT_COLLECTIONS.length - 1 ? '1px solid #f8f9fa' : 'none' }}
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-3 h-3 rounded-full border-2 mt-1"
          style={{
            borderColor: statusColors[item.status],
            background: item.status === 'completed' ? statusColors[item.status] : 'transparent',
          }}
        />
        {index < RECENT_COLLECTIONS.length - 1 && (
          <div className="w-0.5 flex-1 bg-slate-200 mt-1" />
        )}
      </div>

      <div className="flex items-center gap-3 flex-1">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${ORANGE}10` }}
        >
          <span className="text-lg">{item.emoji}</span>
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-black text-slate-800">{item.location}</p>
            <span
              className="text-[8px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background: `${statusColors[item.status]}15`,
                color: statusColors[item.status],
              }}
            >
              {statusLabels[item.status]}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <Clock size={10} /> {item.time} · {item.type} · ⚖️ {item.weight}
          </p>
        </div>

        <span className="text-xs font-black text-emerald-500">{item.price}</span>
      </div>
    </motion.div>
  );
}

export default function ProDashboard() {
  const navigate = useNavigate();
  const { user } = useApp();

  const revenueData = [32000, 38000, 35000, 42000, 45000, 48000, 52000];
  const maxRevenue = Math.max(...revenueData);

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
              <motion.div
                whileHover={{ rotate: 15 }}
                className="flex items-center justify-center rounded-xl bg-orange-500 shadow-md"
                style={{ width: 38, height: 38 }}
              >
                <Recycle size={20} color="#fff" />
              </motion.div>
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

            {/* Quick Metrics Cards — Animated */}
            <div className="flex gap-3 mt-5">
              <AnimatedMetricCard
                icon={Truck}
                label="Collectes dispo"
                value={8}
                suffix=""
                color={ORANGE}
                sublabel="alertes"
              />
              <AnimatedMetricCard
                icon={TrendingUp}
                label="Revenu / mois"
                value={45}
                suffix="K"
                color={GREEN}
                sublabel="FCFA"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex flex-col px-5 pt-5 gap-4 pb-6 flex-1 overflow-y-auto">
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((item, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center border-none cursor-pointer p-4 bg-white rounded-2xl shadow-sm border border-slate-100 relative"
              >
                {item.badge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="absolute top-2 right-2 bg-orange-500 rounded-full flex items-center justify-center"
                    style={{ width: 18, height: 18 }}
                  >
                    <span className="text-[9px] font-black text-white">{item.badge}</span>
                  </motion.div>
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

          {/* Revenue Mini Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} color={GREEN} />
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Revenus Hebdo</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles size={10} color={GREEN} />
                <span className="text-[10px] font-black text-emerald-500">+12%</span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-1">
              {revenueData.map((val, idx) => {
                const heightPercent = (val / maxRevenue) * 100;
                const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.05 }}
                      className="w-full rounded-t-lg"
                      style={{
                        height: `${heightPercent * 0.5}px`,
                        background: `linear-gradient(180deg, ${GREEN}, ${GREEN}80)`,
                        minHeight: 8,
                      }}
                    />
                    <span className="text-[7px] font-bold text-slate-400">{days[idx]}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Stock inventory level section */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target size={14} color={CHARCOAL} />
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Suivi de mon Stock</span>
              </div>
              <div className="flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-xl">
                <Package size={13} color={GREEN} />
                <span className="text-[11px] font-black text-emerald-600">355 kg accumulés</span>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              {STOCK.map((stock, i) => (
                <ProgressBarWithLabel
                  key={i}
                  label={stock.label}
                  current={stock.current}
                  max={stock.max}
                  color={stock.color}
                  emoji={stock.emoji}
                  index={i}
                />
              ))}
            </div>
          </div>

          {/* Recent activity timeline */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex-1">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <ShoppingBag size={14} color={CHARCOAL} />
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Collectes récentes</span>
              </div>
              <motion.button
                whileHover={{ x: 2 }}
                onClick={() => navigate('/pro/demandes')}
                className="text-xs font-extrabold text-orange-500 flex items-center gap-0.5 border-none bg-transparent cursor-pointer"
              >
                <span>Voir tout</span>
                <ChevronRight size={13} />
              </motion.button>
            </div>

            <div className="flex flex-col">
              {RECENT_COLLECTIONS.map((item, idx) => (
                <TimelineItem key={idx} item={item} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

