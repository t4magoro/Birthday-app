import React, { useState } from 'react';
import { Heart, Mail, Sparkles } from 'lucide-react';
import { CONFIG } from '../config';

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
    <section className="max-w-3xl mx-auto px-6 py-16 flex flex-col items-center justify-center min-h-[400px]">
      
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
        
        /* 1. THE OUTER WRAPPER: This exclusively handles the continuous gentle floating bounce and the final fade-out */
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
              <Heart className="w-8 h-8 text-pink-300 fill-pink-200" />
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

            {/* Tap to Open Badge */}
            {envelopeState === 'sealed' && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white text-pink-500 px-4 py-2 rounded-full font-bold shadow-md flex items-center gap-2 w-max animate-pulse z-50 pointer-events-none">
                <Mail className="w-4 h-4" /> Tap to Open
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 3: THE FULL LETTER */}
      {envelopeState === 'opened' && (
        <div className="animate-in fade-in zoom-in slide-in-from-bottom-8 duration-1000 w-full relative z-20">
          <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border-2 border-white relative overflow-hidden">
            <Heart className="absolute -top-6 -left-6 w-24 h-24 text-pink-100 fill-pink-50 -rotate-12" />
            <Heart className="absolute -bottom-6 -right-6 w-24 h-24 text-pink-100 fill-pink-50 rotate-12" />
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-pink-500 mb-6 font-serif flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                For {CONFIG.HER_NAME}
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </h2>
              <div className="prose prose-pink mx-auto text-lg text-gray-700 leading-relaxed font-medium">
                {CONFIG.MESSAGE_TEXT.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-center">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};