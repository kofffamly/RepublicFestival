import { ReactNode, useState, useEffect } from 'react';

interface MobileFrameProps {
  children: ReactNode;
  bgColor?: string;
}

export function MobileFrame({ children, bgColor = '#F8F9F9' }: MobileFrameProps) {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const isDarkBg = bgColor === '#000' || bgColor === '#111' || bgColor === '#2C3E50';
  const textColor = isDarkBg ? '#FFFFFF' : '#1A1A1A';
  const subColor = isDarkBg ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white" 
      style={{ 
        background: 'linear-gradient(135deg, #0d0f12 0%, #151b24 50%, #1c2635 100%)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div
        className="relative overflow-hidden flex flex-col transition-all duration-300"
        style={{
          width: 390,
          height: 844,
          borderRadius: 48,
          border: '12px solid #1c1c1e',
          background: bgColor,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 3px #2c2c2e, inset 0 0 0 2px rgba(255,255,255,0.05)',
        }}
      >
        {/* Top Camera Notch (Dynamic Island Simulator) */}
        <div 
          style={{
            position: 'absolute',
            top: 11,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 110,
            height: 30,
            background: '#000000',
            borderRadius: 20,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            boxShadow: 'inset 0 0 2px rgba(255,255,255,0.1)'
          }}
        >
          {/* Camera lens */}
          <div style={{ width: 11, height: 11, background: '#11131c', borderRadius: '50%', border: '1.5px solid #242838', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 4, height: 4, background: '#092140', borderRadius: '50%' }} />
          </div>
          {/* Subtle green privacy dot */}
          <div style={{ width: 4, height: 4, background: '#34c759', borderRadius: '50%', opacity: 0.6 }} />
          {/* Speaker / sensor */}
          <div style={{ width: 35, height: 4, background: '#1c1c1e', borderRadius: 2 }} />
        </div>

        {/* Status bar */}
        <div 
          className="flex items-center justify-between px-6 pt-3 pb-1 select-none" 
          style={{ 
            background: 'transparent', 
            minHeight: 44,
            zIndex: 50,
          }}
        >
          {/* Left: Dynamic Local Time */}
          <span style={{ fontSize: 13, fontWeight: 700, color: textColor, letterSpacing: '-0.2px' }}>{time}</span>
          
          {/* Right: Network status */}
          <div className="flex items-center gap-1.5">
            {/* Cellular Signal */}
            <div className="flex items-end gap-[2px] h-[9px]">
              <div style={{ width: 3, height: 3, background: textColor, borderRadius: 0.5 }} />
              <div style={{ width: 3, height: 5, background: textColor, borderRadius: 0.5 }} />
              <div style={{ width: 3, height: 7, background: textColor, borderRadius: 0.5 }} />
              <div style={{ width: 3, height: 9, background: textColor, borderRadius: 0.5 }} />
            </div>

            {/* Wifi Icon */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
              <path d="M7.5 10.5L14 3.7C13.2 3 11 1 7.5 1C4 1 1.8 3 1 3.7L7.5 10.5Z" fill={textColor} fillOpacity="0.85" stroke={textColor} strokeWidth="0.5" />
            </svg>

            {/* Battery Indicator */}
            <div className="flex items-center" style={{ gap: 1 }}>
              <div 
                style={{ 
                  width: 22, 
                  height: 11, 
                  borderRadius: 3.5, 
                  border: `1px solid ${textColor}`, 
                  padding: 1, 
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div style={{ width: '85%', height: '100%', background: '#34c759', borderRadius: 2 }} />
              </div>
              <div style={{ width: 1.5, height: 4, background: textColor, borderTopRightRadius: 1, borderBottomRightRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* Screen content wrapper */}
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden relative" 
          style={{ 
            height: 'calc(844px - 44px - 20px)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div 
          className="flex justify-center items-center select-none" 
          style={{ 
            height: 20, 
            background: 'transparent',
            zIndex: 50,
            pointerEvents: 'none'
          }}
        >
          <div 
            style={{ 
              width: 134, 
              height: 5, 
              background: textColor, 
              opacity: 0.35, 
              borderRadius: 100,
              marginBottom: 4
            }} 
          />
        </div>
      </div>

      {/* Inject scrollbar hide and general resets */}
      <style>{`
        ::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
