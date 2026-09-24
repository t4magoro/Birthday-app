import React, { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import { CONFIG } from '../config';

const REQUIRED_TAPS = 3; 

export const Hero = () => {
  const [hearts, setHearts] = useState<any[]>([]);
  const [showSecret, setShowSecret] = useState(false);
  const [tapCount, setTapCount] = useState(0); 

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 3}s`,
      animationDelay: `${Math.random() * 2}s`,
      size: Math.random() * 20 + 15,
    }));
    setHearts(newHearts);
  }, []);

  const handleCatTap = () => {
    const newCount = tapCount + 1;
    if (newCount >= REQUIRED_TAPS) {
      setShowSecret(true);
      setTapCount(0); 
    } else {
      setTapCount(newCount); 
    }
  };

  return (
    <section className="relative overflow-hidden w-full min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-pink-50 rounded-b-[3rem] shadow-sm">
      
      <style>{`
        @keyframes fall {
          0% { transform: translate3d(0, -10vh, 0) rotate(0deg) scale(0.8); opacity: 1; }
          100% { transform: translate3d(0, 110vh, 0) rotate(360deg) scale(1.2); opacity: 0; }
        }
        .falling-heart {
          position: absolute;
          top: -10%;
          animation: fall linear forwards;
          color: #fb7185;
          z-index: 10;
          will-change: transform;
          -webkit-transform-style: preserve-3d;
        }

        /* The gentle up and down floating animations for the side hearts */
        @keyframes floatSide {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-left {
          animation: floatSide 4s ease-in-out infinite;
        }
        .animate-float-right {
          animation: floatSide 5s ease-in-out infinite 1s; /* Delayed so they don't bounce identically */
        }
      `}</style>

      {/* LEFT SIDE BACKGROUND HEART */}
      <div className="absolute left-[-2rem] md:left-10 top-1/3 z-10 animate-float-left opacity-60 pointer-events-none">
        <Heart className="w-32 h-32 md:w-48 md:h-48 text-pink-200 fill-pink-100 -rotate-12" />
      </div>

      {/* RIGHT SIDE BACKGROUND HEART */}
      <div className="absolute right-[-2rem] md:right-10 top-1/4 z-10 animate-float-right opacity-60 pointer-events-none">
        <Heart className="w-24 h-24 md:w-40 md:h-40 text-pink-300 fill-pink-200 rotate-12" />
      </div>

      {/* THE TINY FALLING HEARTS */}
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          fill="currentColor"
          className="falling-heart pointer-events-none"
          style={{
            left: heart.left,
            width: heart.size,
            height: heart.size,
            animationDuration: heart.animationDuration,
            animationDelay: heart.animationDelay,
          }}
        />
      ))}

      {/* THE SECRET CAT BUTTON */}
      <button 
        onClick={handleCatTap}
        className="relative z-20 mb-6 bg-white p-4 rounded-full shadow-lg border-4 border-pink-200 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 animate-mobile-float touch-manipulation block"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        title="Tap me! 🐾"
      >
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 50L15 20L40 35Z" fill="#F472B6"/>
          <path d="M80 50L85 20L60 35Z" fill="#F472B6"/>
          <circle cx="50" cy="60" r="35" fill="#FBCFE8"/>
          <circle cx="35" cy="55" r="5" fill="#4B5563"/>
          <circle cx="65" cy="55" r="5" fill="#4B5563"/>
          <path d="M50 63L47 60H53L50 63Z" fill="#F472B6"/>
          <path d="M47 65C47 65 50 68 53 65" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
          <line x1="15" y1="55" x2="25" y2="58" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
          <line x1="15" y1="65" x2="25" y2="62" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
          <line x1="85" y1="55" x2="75" y2="58" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
          <line x1="85" y1="65" x2="75" y2="62" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* MAIN TEXT */}
      <h1 className="relative z-20 text-5xl md:text-6xl font-extrabold text-pink-600 tracking-tight drop-shadow-sm mb-4 font-serif">
        Happy Birthday, <br/>
        <span className="text-rose-500">{CONFIG.HER_NAME}!</span>
      </h1>
      <p className="relative z-20 text-lg text-pink-500 font-medium max-w-md mx-auto">
        Semoga ini jadi ulang tahun terbaik kamu sejauh ini AMINN
      </p>

      {/* THE SECRET EASTER EGG MODAL */}
      {showSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-100/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full relative animate-in zoom-in slide-in-from-bottom-8 duration-500 border-2 border-pink-200">
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowSecret(false);
              }}
              className="absolute top-4 right-4 text-pink-300 hover:text-pink-500 transition-colors bg-pink-50 p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mt-4">
              <div className="text-6xl mb-2 animate-bounce">🐾</div>
              <Heart className="w-10 h-10 text-pink-500 fill-pink-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3 font-serif">
                WIII NEMU EASTER EGG
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                I just wanted to remind you one more time how incredibly special you are to me. 
                I love you! ❤️
              </p>
            </div>
            
          </div>
        </div>
      )}

    </section>
  );
};