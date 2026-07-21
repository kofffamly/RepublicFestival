import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MobileFrame } from '../../components/MobileFrame';
import { ChevronLeft, CheckCircle, Scale, Banknote, MapPin, RefreshCw, Share2, Award, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GREEN = '#2ECC71';
const CHARCOAL = '#2C3E50';
const ORANGE = '#E67E22';

const ANALYSIS_RESULTS = [
  { type: 'Bouteille plastique PET', recyclable: true, price: 300, weight: 10, confidence: 96, category: 'Plastique', emoji: '🧴' },
  { type: 'Carton brun', recyclable: true, price: 150, weight: 8, confidence: 92, category: 'Carton', emoji: '📦' },
  { type: 'Canette aluminium', recyclable: true, price: 450, weight: 5, confidence: 98, category: 'Métal', emoji: '🥫' },
];

export default function Analyse() {
  const navigate = useNavigate();
  const [result] = useState(ANALYSIS_RESULTS[0]);
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnalyzing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 1800);
  };

  return (
    <MobileFrame bgColor="#F8F9F9">
      <div className="flex flex-col min-h-[760px] select-none">
        {/* Navigation Header */}
        <div style={{ background: '#fff', padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <div className="flex items-center justify-between">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/citizen/camera')} 
              className="flex items-center justify-center border-none cursor-pointer rounded-xl bg-slate-100" 
              style={{ width: 38, height: 38 }}
            >
              <ChevronLeft size={20} color={CHARCOAL} />
            </motion.button>
            <span className="text-base font-extrabold" style={{ color: CHARCOAL }}>Analyse IA en direct</span>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center border-none cursor-pointer rounded-xl bg-slate-100" 
              style={{ width: 38, height: 38 }}
            >
              <Share2 size={16} color={CHARCOAL} />
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col px-5 pt-5 gap-4 flex-1">
          
          {/* AI Viewfinder Preview Box */}
          <div 
            className="relative rounded-3xl overflow-hidden shadow-sm flex items-center justify-center" 
            style={{ 
              height: 220, 
              background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)', 
            }}
          >
            {/* Visual element emoji */}
            <motion.span 
              initial={{ scale: 0.8 }}
              animate={analyzing ? { scale: [1, 1.05, 1] } : { scale: 1.15 }}
              transition={{ repeat: analyzing ? Infinity : 0, duration: 1.5 }}
              style={{ fontSize: 90 }}
            >
              {result.emoji}
            </motion.span>

            {/* Bounding box simulation when scanning */}
            <AnimatePresence>
              {analyzing ? (
                <>
                  {/* Bounding bracket lines */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute border border-dashed border-emerald-400"
                    style={{ width: 140, height: 140, borderRadius: 12 }}
                  />
                  {/* Glowing vertical laser scan line */}
                  <motion.div 
                    animate={{ top: [20, 180, 20] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="absolute left-10 right-10 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] pointer-events-none"
                  />
                  {/* Float text details */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute bottom-4 left-4 bg-emerald-500 text-white font-mono text-[9px] px-2 py-0.5 rounded shadow-sm"
                  >
                    SCANNING: RAW_OBJECT
                  </motion.div>
                </>
              ) : (
                /* Static detected labels after analysis */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                      PET_PLASTIC ✔️
                    </div>
                    <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/10">
                      IA: {result.confidence}%
                    </div>
                  </div>
                  <div className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1.5 rounded-lg border border-white/5 self-start">
                    OBJECT_CLASS_091: RECYCLABLE
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analysis State Modal cover */}
            <AnimatePresence>
              {analyzing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center mb-3">
                      <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <Cpu size={18} className="absolute text-emerald-400 animate-pulse" />
                    </div>
                    <p className="text-sm font-black text-white tracking-wide uppercase">Analyse IA en cours...</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">Classification des polymères...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {!analyzing && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                {/* Result Info Card */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest">{result.category}</p>
                      <h2 className="text-xl font-black mt-1" style={{ color: CHARCOAL }}>{result.type}</h2>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-xl">
                      <CheckCircle size={14} color={GREEN} />
                      <span className="text-xs font-black text-emerald-600">Recyclable</span>
                    </div>
                  </div>

                  {/* Highlighted metrics widgets */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="flex flex-col items-center p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      <Banknote size={20} color={ORANGE} />
                      <span className="text-xl font-black mt-1.5" style={{ color: CHARCOAL }}>{result.price}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">FCFA Estimés</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      <Scale size={20} color={GREEN} />
                      <span className="text-xl font-black mt-1.5" style={{ color: CHARCOAL }}>{result.weight}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Kg Estimés</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      <Award size={20} color="#9b59b6" />
                      <span className="text-xl font-black mt-1.5" style={{ color: CHARCOAL }}>A+</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Qualité</span>
                    </div>
                  </div>
                </div>

                {/* Eco-Impact badge */}
                <div 
                  className="rounded-2xl p-4 border flex items-center gap-3 bg-emerald-500/5 border-emerald-500/10"
                >
                  <span className="text-xl">🌱</span>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">Impact Écologique</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                      Cette collecte évite environ <b>15.6 kg</b> d'émissions de CO2. Merci !
                    </p>
                  </div>
                </div>

                {/* Detailed pricing breakdown */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3">Estimation du tarif</span>
                  
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'Prix de base (plastique PET)', value: `${result.price - 50} FCFA` },
                      { label: 'Bonus Qualité A+ (propreté)', value: '+50 FCFA', positive: true },
                      { label: 'Valeur totale estimée', value: `${result.price} FCFA`, bold: true },
                    ].map((row, idx) => (
                      <div 
                        key={idx} 
                        className="flex justify-between items-center py-1.5" 
                        style={{ borderBottom: row.bold ? 'none' : '1px solid #f8f9fa' }}
                      >
                        <span className={`text-xs ${row.bold ? 'font-black text-slate-800' : 'text-slate-500'}`}>{row.label}</span>
                        <span className={`text-xs font-black ${row.positive ? 'text-emerald-500' : row.bold ? 'text-orange-500 text-sm' : 'text-slate-800'}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex gap-3 mt-1 pb-6">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRetry}
                    className="flex-1 bg-white border border-slate-200 cursor-pointer rounded-2xl flex items-center justify-center gap-2 py-4"
                  >
                    <RefreshCw size={16} color={CHARCOAL} />
                    <span className="text-xs font-bold text-slate-700">Réessayer</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(230,126,34,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/citizen/argent')}
                    className="flex-[2] border-none cursor-pointer rounded-2xl flex items-center justify-center gap-2 py-4 text-white"
                    style={{ background: ORANGE }}
                  >
                    <MapPin size={16} color="#fff" />
                    <span className="text-xs font-black uppercase tracking-wider">Trouver un collecteur</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileFrame>
  );
}
