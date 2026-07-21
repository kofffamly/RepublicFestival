import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MobileFrame } from '../../components/MobileFrame';
import { ChevronLeft, MapPin, Scale, Banknote, Clock, CheckCircle, X, Radio, ArrowRight, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

interface Demande {
  id: number;
  location: string;
  district: string;
  type: string;
  emoji: string;
  weight: number;
  price: number;
  distance: string;
  time: string;
  status: 'pending' | 'accepted' | 'refused';
}

const INITIAL_DEMANDES: Demande[] = [
  { id: 1, location: 'Cocody', district: 'Riviera 2', type: 'Plastique PET', emoji: '🧴', weight: 30, price: 8000, distance: '1.2 km', time: 'Il y a 3 min', status: 'pending' },
  { id: 2, location: 'Yopougon', district: 'Selmer', type: 'Carton brun', emoji: '📦', weight: 45, price: 6750, distance: '3.5 km', time: 'Il y a 8 min', status: 'pending' },
  { id: 3, location: 'Plateau', district: 'Centre', type: 'Canettes alu', emoji: '🥫', weight: 12, price: 4800, distance: '5.1 km', time: 'Il y a 15 min', status: 'pending' },
  { id: 4, location: 'Adjamé', district: 'Marché', type: 'Bouteilles verre', emoji: '🍶', weight: 20, price: 3000, distance: '6.8 km', time: 'Il y a 22 min', status: 'pending' },
];

export default function Demandes() {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState<Demande[]>(INITIAL_DEMANDES);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleAction = (id: number, action: 'accepted' | 'refused') => {
    if (action === 'accepted') {
      setLoadingId(id);
      // Simulate confirmation lag
      setTimeout(() => {
        setDemandes(prev => prev.map(d => d.id === id ? { ...d, status: action } : d));
        setLoadingId(null);
      }, 800);
    } else {
      setDemandes(prev => prev.map(d => d.id === id ? { ...d, status: action } : d));
    }
  };

  const filtered = demandes.filter(d => activeTab === 'pending' ? d.status === 'pending' : d.status === 'accepted');
  const pendingCount = demandes.filter(d => d.status === 'pending').length;

  return (
    <MobileFrame bgColor="#F8F9F9">
      <div className="flex flex-col min-h-[760px] select-none">
        
        {/* Pro Header */}
        <div style={{ background: CHARCOAL, padding: '16px 20px 20px', borderBottomLeftRadius: 28, borderBottomRightRadius: 28, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
          <div className="flex items-center justify-between mb-4">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/pro')} 
              className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-white/80 font-bold"
            >
              <ChevronLeft size={20} color="#fff" />
              <span className="text-xs">Tableau de bord</span>
            </motion.button>
            
            <div className="flex items-center gap-1.5 bg-orange-500/20 px-2.5 py-1 rounded-full border border-orange-500/30">
              <Radio size={12} className="text-orange-500 animate-pulse" />
              <span className="text-[9px] text-orange-500 font-extrabold uppercase tracking-wider">Flux Live</span>
            </div>
          </div>
          
          <h1 className="text-xl font-black text-white">Demandes de collecte</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            {pendingCount} dépôt{pendingCount > 1 ? 's' : ''} disponible{pendingCount > 1 ? 's' : ''} à proximité
          </p>
        </div>

        {/* Tab switcher with animated background slider */}
        <div className="flex mx-5 mt-5 mb-3 bg-slate-200/60 rounded-2xl p-1 relative z-10">
          {(['pending', 'accepted'] as const).map(tab => {
            const isTabActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-3 text-xs font-black rounded-xl border-none cursor-pointer relative bg-transparent text-slate-700 transition-colors"
                style={{ 
                  color: isTabActive ? CHARCOAL : '#718096',
                  zIndex: 20
                }}
              >
                {isTabActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-100"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {tab === 'pending' ? `⏳ À collecter (${pendingCount})` : `✅ Acceptées`}
              </button>
            );
          })}
        </div>

        {/* Request List */}
        <div className="flex flex-col gap-4 px-5 pb-8 flex-1">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <span className="text-5xl mb-4">🎉</span>
                <p className="text-base font-black text-slate-800">
                  {activeTab === 'pending' ? 'Rien en attente' : 'Aucune collecte en cours'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {activeTab === 'pending' ? 'Toutes les demandes ont été prises en charge !' : 'Accepte des collectes pour les voir ici'}
                </p>
              </motion.div>
            ) : (
              filtered.map(demande => {
                const isAccepting = loadingId === demande.id;
                
                return (
                  <motion.div
                    key={demande.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="bg-white rounded-3xl overflow-hidden border shadow-sm flex flex-col"
                    style={{ 
                      borderColor: demande.status === 'accepted' ? GREEN : '#e2e8f0' 
                    }}
                  >
                    {/* Card Header metadata */}
                    <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-50 bg-slate-50/50">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} color={ORANGE} />
                        <span className="text-xs font-black text-slate-800">{demande.location}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{demande.district}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={11} color="#cbd5e1" />
                        <span className="text-[10px] font-bold text-slate-400">{demande.time}</span>
                      </div>
                    </div>

                    {/* Interactive Simulated Map Grid */}
                    {demande.status === 'accepted' && (
                      <div className="h-28 bg-slate-100 relative overflow-hidden border-b border-slate-100 flex items-center justify-center">
                        {/* Mock Map Vector Grid */}
                        <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 200 100" fill="none" stroke="#94a3b8" strokeWidth="0.5">
                          <path d="M0 20h200M0 50h200M0 80h200M40 0v100M100 0v100M160 0v100" />
                          <path d="M0 0l200 100M0 100L200 0" strokeDasharray="3 3" />
                        </svg>
                        
                        {/* Citizen Target & Pulsing Pin */}
                        <div className="relative flex items-center justify-center z-10">
                          <span className="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping" />
                          <span className="absolute w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md" />
                        </div>
                        <div className="absolute bottom-2 left-3 bg-slate-900/80 text-white font-black text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span>📍 Itinéraire en direct: {demande.distance}</span>
                        </div>
                      </div>
                    )}

                    {/* Card Content info */}
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl bg-slate-50 p-1 rounded-xl block">{demande.emoji}</span>
                        <div>
                          <p className="text-sm font-black text-slate-800">Dépôt {demande.type}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Distance: {demande.distance}</p>
                        </div>
                      </div>

                      {/* Weight and value indicators */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                          <Scale size={18} color={CHARCOAL} />
                          <div>
                            <p className="text-sm font-black text-slate-800">{demande.weight} kg</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Poids de collecte</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                          <Banknote size={18} color={GREEN} />
                          <div>
                            <p className="text-sm font-black text-emerald-600">{demande.price.toLocaleString()} FCFA</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Prix estimé</p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom actions or status layout */}
                      <div className="w-full">
                        {demande.status === 'pending' ? (
                          <div className="flex gap-3">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAction(demande.id, 'refused')}
                              className="flex-1 bg-slate-100 hover:bg-slate-200 border-none cursor-pointer rounded-2xl py-3.5 flex items-center justify-center gap-1.5"
                            >
                              <X size={16} color="#64748b" strokeWidth={2.5} />
                              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Refuser</span>
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ y: -1, boxShadow: '0 6px 16px rgba(46,204,113,0.3)' }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAction(demande.id, 'accepted')}
                              disabled={isAccepting}
                              className="flex-[2] border-none cursor-pointer rounded-2xl py-3.5 flex items-center justify-center gap-1.5 text-white"
                              style={{ background: GREEN }}
                            >
                              {isAccepting ? (
                                <Loader size={16} className="animate-spin text-white" />
                              ) : (
                                <>
                                  <CheckCircle size={16} color="#fff" />
                                  <span className="text-xs font-black uppercase tracking-wider">Prendre la collecte</span>
                                </>
                              )}
                            </motion.button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/15">
                            <CheckCircle size={16} color={GREEN} />
                            <span className="text-xs font-black text-emerald-600 uppercase tracking-wide">Collecte acceptée · En route</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileFrame>
  );
}
