import React, { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import { CONFIG } from '../config';

const REQUIRED_TAPS = 3;
const MARQUEE_TEXT = `HAPPY BIRTHDAY ${CONFIG.HER_NAME.toUpperCase()} ♥ `.repeat(4);

interface HeroProps {
  // true once the gift screen is gone: that's when the entrance animation plays
  revealed: boolean;
}

export const Hero = ({ revealed }: HeroProps) => {
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

  // hidden until revealed, then each piece rises in (delays set per element = the stagger)
  const enter = revealed ? 'animate-rise' : 'opacity-0';

  return (
    <section className="relative overflow-hidden w-full min-h-[85svh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-28">

      <style>{`
        @keyframes fall {
          0% { transform: translate3d(0, -10vh, 0) rotate(0deg) scale(0.8); opacity: 1; }
          100% { transform: translate3d(0, 110vh, 0) rotate(360deg) scale(1.2); opacity: 0; }
        }
        .falling-heart {
          position: absolute;
          top: -10%;
          animation: fall linear forwards;
          color: #f472b6;
          z-index: 10;
          will-change: transform;
          -webkit-transform-style: preserve-3d;
        }
      `}</style>

      {/* SCRAPBOOK DECORATIONS */}
      <div className={`absolute top-6 left-5 ${enter}`} style={{ animationDelay: '0.5s' }}>
        <div className="postmark -rotate-12">WITH LOVE</div>
      </div>
      <div className={`absolute top-5 right-5 ${enter}`} style={{ animationDelay: '0.6s' }}>
        <div className="stamp rotate-6">for<br />you ♥</div>
      </div>
      <span className="absolute left-6 bottom-36 text-3xl text-pink-400 -rotate-12 pointer-events-none">♡</span>
      <span className="absolute right-8 bottom-44 text-2xl text-pink-400 rotate-12 pointer-events-none">✿</span>

      {/* THE TINY FALLING HEARTS (only once the gift is opened, so she actually sees them) */}
      {revealed && hearts.map((heart) => (
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

      {/* THE SECRET CAT BUTTON (wrappers: entrance > gentle float > button, so the animations don't overwrite each other) */}
      <div className={`relative z-20 mb-6 ${enter}`} style={{ animationDelay: '0.1s' }}>
        <div className="animate-mobile-float">
          <button
            onClick={handleCatTap}
            className="btn-pop bg-white p-3 rounded-full cursor-pointer touch-manipulation block"
            title="Tap me! 🐾"
          >
            <svg width="72" height="72" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </div>
      </div>

      {/* MAIN TEXT */}
      <div className="relative z-20">
        {/* candy-pop sticker */}
        <div className={`absolute -top-8 -right-4 ${enter}`} style={{ animationDelay: '0.9s' }}>
          <div className="animate-wiggle bg-white text-pink-600 font-pop font-semibold text-sm px-3 py-1.5 rounded-full border-[2.5px] border-ink shadow-[2px_2px_0_var(--color-ink)]">
            it's your day!
          </div>
        </div>

        <h1 className="font-hand text-ink leading-[0.85]">
          <span className={`block text-6xl md:text-7xl ${enter}`} style={{ animationDelay: '0.25s' }}>
            Happy Birthday,
          </span>
          <span className={`block text-8xl md:text-9xl text-pink-500 mt-1 ${enter}`} style={{ animationDelay: '0.45s' }}>
            {CONFIG.HER_NAME}!
          </span>
        </h1>
        <svg className={`mx-auto mt-1 ${enter}`} style={{ animationDelay: '0.6s' }} width="170" height="16" viewBox="0 0 150 14" aria-hidden>
          <path d="M3 9 C 30 2, 50 13, 75 7 S 120 3, 147 8" fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <p className={`relative z-20 font-hand text-2xl text-ink/80 max-w-xs mx-auto mt-3 ${enter}`} style={{ animationDelay: '0.75s' }}>
        Semoga ini jadi ulang tahun terbaik kamu sejauh ini AMINN
      </p>

      {/* CANDY-POP MARQUEE STRIP */}
      <div className="absolute bottom-8 left-[-5%] w-[110%] -rotate-2 bg-ink text-pink-200 font-pop font-semibold text-lg py-2.5 overflow-hidden whitespace-nowrap z-20">
        <div className="flex w-max animate-marquee">
          <span className="pr-2">{MARQUEE_TEXT}</span>
          <span className="pr-2" aria-hidden>{MARQUEE_TEXT}</span>
        </div>
      </div>

      {/* THE SECRET EASTER EGG MODAL */}
      {showSecret && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-100/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowSecret(false)} // tapping the dimmed background closes it
        >
          <div
            className="bg-white p-8 pt-10 shadow-2xl max-w-sm w-full relative -rotate-1 animate-in zoom-in slide-in-from-bottom-8 duration-500"
            onClick={(e) => e.stopPropagation()} // taps inside the card don't
          >
            <span className="tape" />

            {/* z-10 keeps the button above the bouncing 🐾, which used to cover it and swallow taps */}
            <button
              onClick={() => setShowSecret(false)}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-pink-50 text-pink-300 cursor-pointer touch-manipulation transition-all duration-200 ease-out hover:bg-pink-100 hover:text-pink-500 hover:scale-110 hover:rotate-90 active:scale-90"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mt-2">
              <div className="text-6xl mb-2 animate-bounce">🐾</div>
              <Heart className="w-10 h-10 text-pink-500 fill-pink-400 mx-auto mb-3 animate-pulse" />
              <h3 className="font-hand text-4xl text-ink mb-3">
                WIII NEMU EASTER EGG
              </h3>
              <p className="font-hand text-2xl text-ink/80 leading-snug">
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
