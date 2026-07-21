import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MobileFrame } from '../../components/MobileFrame';
import { ChevronLeft, Zap, FlipHorizontal, Image, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ORANGE = '#E67E22';

export default function Camera() {
  const navigate = useNavigate();
  const [flash, setFlash] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');

  const handleCapture = () => {
    setCaptured(true);
    // Visual shutter & redirect
    setTimeout(() => {
      navigate('/citizen/analyse');
    }, 700);
  };

  return (
    <MobileFrame bgColor="#0f0f15">
      <div className="flex flex-col h-[760px] relative select-none" style={{ background: '#090a0f' }}>
        {/* Viewfinder Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col justify-between">
          {/* Simulated Cam Feed with subtle zoom/floating noise */}
          <div 
            className="absolute inset-0 opacity-80" 
            style={{ 
              background: 'radial-gradient(circle at center, #1b2838 0%, #0d121a 100%)',
            }}
          />

          {/* 3x3 Camera Grid */}
          <div className="absolute inset-0 pointer-events-none flex flex-col z-10">
            <div className="flex-1 border-b border-white/10 flex">
              <div className="flex-1 border-r border-white/10" />
              <div className="flex-1 border-r border-white/10" />
              <div className="flex-1" />
            </div>
            <div className="flex-1 border-b border-white/10 flex">
              <div className="flex-1 border-r border-white/10" />
              <div className="flex-1 border-r border-white/10" />
              <div className="flex-1" />
            </div>
            <div className="flex-1 flex">
              <div className="flex-1 border-r border-white/10" />
              <div className="flex-1 border-r border-white/10" />
              <div className="flex-1" />
            </div>
          </div>

          {/* Top Controls Bar */}
          <div className="flex items-center justify-between px-4 pt-4 relative z-30">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/citizen')}
              className="flex items-center justify-center rounded-xl bg-black/60 backdrop-blur-md border border-white/10 cursor-pointer text-white"
              style={{ width: 42, height: 42 }}
            >
              <ChevronLeft size={22} />
            </motion.button>
            
            <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[11px] font-black text-white uppercase tracking-wider">Objectif IA</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setFlash(f => !f)}
              className="flex items-center justify-center rounded-xl cursor-pointer text-white transition-colors"
              style={{ 
                width: 42, 
                height: 42, 
                background: flash ? `${ORANGE}dd` : 'rgba(0,0,0,0.6)', 
                border: flash ? `1px solid ${ORANGE}` : '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <Zap size={20} color={flash ? '#fff' : '#fff'} fill={flash ? '#fff' : 'none'} />
            </motion.button>
          </div>

          {/* AI Focus Reticle */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex items-center justify-center"
            style={{ width: 230, height: 230 }}
          >
            {/* Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl animate-pulse" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl animate-pulse" />

            {/* Glowing laser scan line */}
            <div className="absolute left-1 right-1 h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] scan-animation" />

            {/* Focus Target Dot */}
            <div className="w-16 h-16 rounded-full border border-emerald-400/30 flex items-center justify-center animate-ping" />
            <div className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </div>

          {/* Tips Overlay */}
          <div className="relative z-30 self-center text-center pb-6">
            <div className="inline-flex items-center gap-2 bg-black/75 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl shadow-lg">
              <span className="text-[13px] font-black text-white/90">♻️ Cadre ton déchet</span>
              <span className="text-[11px] font-semibold text-slate-400">Plastique, carton ou canette</span>
            </div>
          </div>

          {/* Simulated Shutter & Flash Sequence */}
          <AnimatePresence>
            {captured && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.6, times: [0, 0.1, 0.2, 1] }}
                className="absolute inset-0 bg-white z-50 pointer-events-none"
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {captured && (
              <motion.div 
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 0.5, times: [0, 0.4, 0.8] }}
                className="absolute inset-0 bg-black z-40 pointer-events-none origin-top"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Shutter Bar and Mode selector */}
        <div className="flex flex-col bg-black pb-8 relative z-30">
          {/* Mode Selector */}
          <div className="flex justify-center gap-6 py-3 border-b border-white/5">
            <button 
              onClick={() => setActiveTab('auto')}
              className="text-xs font-black uppercase tracking-widest border-none bg-transparent cursor-pointer"
              style={{ color: activeTab === 'auto' ? ORANGE : '#555' }}
            >
              Détection IA
            </button>
            <button 
              onClick={() => setActiveTab('manual')}
              className="text-xs font-black uppercase tracking-widest border-none bg-transparent cursor-pointer"
              style={{ color: activeTab === 'manual' ? ORANGE : '#555' }}
            >
              Photo simple
            </button>
          </div>

          {/* Shutter Controls */}
          <div className="flex items-center justify-between px-8 pt-5">
            {/* Gallery Button */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer rounded-2xl"
              style={{ width: 50, height: 50 }}
            >
              <Image size={22} color="#fff" />
            </motion.button>

            {/* Shutter Capture Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCapture}
              className="flex items-center justify-center border-none cursor-pointer rounded-full"
              style={{
                width: 84,
                height: 84,
                background: '#ffffff',
                boxShadow: `0 0 0 4px #000, 0 0 0 8px #ffffff, 0 0 24px rgba(255,255,255,0.4)`
              }}
            >
              <div 
                className="rounded-full flex items-center justify-center transition-all duration-300" 
                style={{ 
                  width: 68, 
                  height: 68, 
                  background: `linear-gradient(135deg, ${ORANGE} 0%, #d35400 100%)`,
                  boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.2)' 
                }} 
              >
                <Circle size={20} color="#fff" fill="#fff" className="opacity-45" />
              </div>
            </motion.button>

            {/* Flip Cam Button */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer rounded-2xl"
              style={{ width: 50, height: 50 }}
            >
              <FlipHorizontal size={22} color="#fff" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Styles for scanner laser lines */}
      <style>{`
        .scan-animation {
          animation: scanLine 2s ease-in-out infinite;
        }
        @keyframes scanLine {
          0% { top: 4px; }
          50% { top: 226px; }
          100% { top: 4px; }
        }
      `}</style>
    </MobileFrame>
  );
}
