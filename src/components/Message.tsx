import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { CONFIG } from '../config';

// A new paragraph starts wherever MESSAGE_TEXT has an empty line
const PARAGRAPHS = CONFIG.MESSAGE_TEXT.split(/\n\s*\n/);

export const Message = () => {
  const [envelopeState, setEnvelopeState] = useState<'sealed' | 'opening' | 'opened'>('sealed');

  const handleOpen = () => {
    if (envelopeState !== 'sealed') return;

    setEnvelopeState('opening');

    setTimeout(() => {
      setEnvelopeState('opened');
    }, 1500);
  };

  return (
    <section className="reveal max-w-xl mx-auto px-6 py-16 flex flex-col items-center justify-center min-h-[400px]">

      <style>{`
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounceSubtle 2.5s infinite ease-in-out;
        }

        @keyframes popJump {
          0% { transform: scale(1) translateY(0); }
          25% { transform: scale(1.15) translateY(-25px); }
          50% { transform: scale(0.95) translateY(10px); }
          75% { transform: scale(1.05) translateY(-5px); }
          100% { transform: scale(1) translateY(0); }
        }
        .animate-pop-jump {
          animation: popJump 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* STAGE 1 & 2: THE ENVELOPE */}
      {envelopeState !== 'opened' && (
        <>
          <h2 className="font-hand text-5xl text-ink squiggle mb-10 text-center">Ada surat buat kamu</h2>

          {/* 1. THE OUTER WRAPPER: This exclusively handles the continuous gentle floating bounce and the final fade-out */}
          <div className={`transition-opacity duration-500 ${
            envelopeState === 'sealed' ? 'animate-bounce-subtle opacity-100' : 'opacity-0 delay-[1300ms]'
          }`}>

            {/* 2. THE INNER ENVELOPE: This handles the smooth hover scale and the pop-jump click! */}
            <div
              onClick={handleOpen}
              className={`relative w-72 h-48 cursor-pointer [perspective:1000px] touch-manipulation ${
                envelopeState === 'sealed'
                  ? 'transition-transform duration-300 hover:scale-105 active:scale-95'
                  : 'animate-pop-jump'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Back of Envelope */}
              <div className="absolute inset-0 bg-pink-400 rounded-b-lg shadow-xl"></div>

              {/* The Letter inside the envelope */}
              <div className={`absolute left-4 right-4 bottom-2 bg-white h-44 rounded-t-lg border border-gray-100 flex items-start justify-center pt-4 z-20 transition-transform duration-500 ease-out ${
                envelopeState === 'sealed' ? 'translate-y-0' : '-translate-y-24 delay-[700ms]'
              }`}>
                <span className="font-hand text-2xl text-pink-400">for you ♡</span>
              </div>

              {/* Envelope Flap */}
              <div
                className={`absolute top-0 left-0 right-0 h-24 bg-pink-300 origin-top [transform-style:preserve-3d] transition-transform duration-500 ease-in-out ${
                  envelopeState === 'sealed'
                    ? '[transform:rotateX(0deg)] z-40'
                    : '[transform:rotateX(180deg)] z-10 delay-[400ms]'
                }`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
              ></div>

              {/* Envelope Front */}
              <div className="absolute inset-0 bg-pink-500 rounded-b-lg z-30 pointer-events-none" style={{ clipPath: 'polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)' }}></div>

              {/* Wax seal on the flap's tip: pops off first when she taps */}
              <div className={`absolute left-1/2 top-24 -translate-x-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-pink-600 border-4 border-pink-700/40 shadow-md flex items-center justify-center text-white text-2xl pointer-events-none transition-all duration-300 ${
                envelopeState === 'sealed' ? 'scale-100 opacity-100' : 'scale-150 opacity-0'
              }`}>
                ♥
              </div>

              {/* Tap to Open Badge. It hangs below the envelope, so it must stay tappable
                  (taps on it bubble up to the envelope's onClick) */}
              {envelopeState === 'sealed' && (
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-white text-pink-600 font-pop font-semibold px-4 py-2 rounded-full border-[2.5px] border-ink shadow-[3px_3px_0_var(--color-ink)] flex items-center gap-2 w-max z-50">
                  <Mail className="w-4 h-4" /> Tap to Open
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* STAGE 3: THE FULL LETTER, on lined notebook paper */}
      {envelopeState === 'opened' && (
        <div className="animate-in fade-in zoom-in w-full relative z-20">
          <div
            className="relative bg-white pl-9 pr-6 pt-12 pb-10 shadow-xl -rotate-1"
            style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 35px, #fbcfe8 35px 36px)', backgroundPosition: '0 20px' }}
          >
            <span className="tape" />
            {/* the pink margin line of a notebook page */}
            <div className="absolute top-0 bottom-0 left-6 w-px bg-pink-300" />

            <p className="animate-rise font-hand text-4xl leading-9 text-pink-500" style={{ animationDelay: '0.3s' }}>
              Dear {CONFIG.HER_NAME},
            </p>
            {/* each paragraph is "written" a moment after the one before it */}
            {PARAGRAPHS.map((paragraph, index) => (
              <p
                key={index}
                className="animate-rise font-hand text-[1.7rem] leading-9 text-ink mt-9"
                style={{ animationDelay: `${0.9 + index * 0.8}s` }}
              >
                {paragraph}
              </p>
            ))}
            <p
              className="animate-rise font-hand text-4xl leading-9 text-pink-500 text-right mt-9"
              style={{ animationDelay: `${0.9 + PARAGRAPHS.length * 0.8}s` }}
            >
              {CONFIG.LETTER_SIGNATURE}
            </p>
          </div>
        </div>
      )}

    </section>
  );
};
