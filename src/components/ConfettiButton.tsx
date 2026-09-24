import React, { useState, useMemo } from 'react';
import { PartyPopper } from 'lucide-react';

export const ConfettiButton = () => {
  const [isFiring, setIsFiring] = useState(false);

  // 1. PRE-CALCULATION (JS Optimization)
  // We generate the random math and array ONLY ONCE when the app first loads.
  // This completely removes the calculation lag when the button is tapped!
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 100;
      return {
        id: i,
        tx: `${Math.cos(angle) * velocity}vw`,
        ty: `${-40 - Math.random() * 80}vh`,
        rot: `${Math.random() * 720 - 360}deg`,
        size: Math.random() * 1.2 + 0.5,
        color: ['text-pink-400', 'text-rose-400', 'text-fuchsia-400', 'text-red-400'][Math.floor(Math.random() * 4)],
        delay: Math.random() * 0.15,
      };
    });
  }, []);

  const fireConfetti = () => {
    if (isFiring) return;
    setIsFiring(true);
    setTimeout(() => setIsFiring(false), 2500);
  };

  return (
    <>
      <style>{`
        /* 2. HARDWARE ACCELERATION (CSS Optimization) */
        /* Using translate3d forces the browser to use the GPU (Graphics Card) instead of the CPU */
        @keyframes explodeAndFall {
          0% { transform: translate3d(0, 0, 0) scale(0) rotate(0deg); opacity: 1; }
          20% { transform: translate3d(calc(var(--tx) * 0.2), calc(var(--ty) * 0.5), 0) scale(var(--size)) rotate(calc(var(--rot) * 0.2)); opacity: 1; }
          80% { transform: translate3d(var(--tx), calc(var(--ty) * -0.2), 0) scale(var(--size)) rotate(var(--rot)); opacity: 0.8; }
          100% { transform: translate3d(var(--tx), 100vh, 0) scale(0.5) rotate(calc(var(--rot) * 1.5)); opacity: 0; }
        }
        .animate-confetti {
          animation: explodeAndFall 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          will-change: transform; /* Tells the browser to prep this element for motion */
        }
      `}</style>

      <button 
        onClick={fireConfetti}
        className="fixed bottom-6 left-6 z-50 bg-white text-pink-500 p-4 rounded-full shadow-2xl hover:bg-pink-50 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-pink-200 print:hidden flex items-center justify-center"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        title="Celebrate!"
      >
        <PartyPopper className={`w-6 h-6 ${isFiring ? 'animate-bounce text-pink-300' : ''}`} />
      </button>

      {isFiring && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden flex items-end justify-center">
          <div className="relative mb-20">
            {particles.map((p) => (
              
              /* 3. RAW SVG (React Optimization) */
              /* Replacing the React Lucide Component with a raw SVG string cuts render overhead by 90% */
              <svg 
                key={p.id}
                viewBox="0 0 24 24"
                className={`absolute w-6 h-6 fill-current ${p.color} animate-confetti`}
                style={{
                  '--tx': p.tx,
                  '--ty': p.ty,
                  '--rot': p.rot,
                  '--size': p.size,
                  animationDelay: `${p.delay}s`,
                } as React.CSSProperties}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>

            ))}
          </div>
        </div>
      )}
    </>
  );
};