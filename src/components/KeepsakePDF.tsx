import React, { useMemo } from 'react';
import { Heart, Sparkles, Gift, Ticket } from 'lucide-react';
import { CONFIG } from '../config';

interface KeepsakePDFProps {
  wishes: string[];
  redeemedIds: number[];
}

export const KeepsakePDF = ({ wishes, redeemedIds }: KeepsakePDFProps) => {
  const staticDust = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 12 + 8,
      rotation: Math.random() * 360,
    }));
  }, []);

// UPDATED FUNCTION: Grabs the title directly from your config file
  const getCouponName = (id: number) => {
    const coupon = CONFIG.INITIAL_COUPONS.find((c: any) => c.id === id);
    return coupon ? coupon.title : `Special Reward #${id}`;
  };

  return (
    <div className="w-full h-screen bg-pink-50 relative overflow-hidden flex flex-col p-8 md:p-12 box-border border-8 border-pink-200">
      
      {/* PRINT CSS */}
      <style>{`
        @media print {
          @page { size: letter portrait; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; }
          html, body { height: 100%; overflow: hidden; }
        }
      `}</style>

      {/* BACKGROUND DUST */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {staticDust.map(d => (
          <div key={d.id} className="absolute" style={{ left: d.left, top: d.top }}>
            <Heart 
              className="text-pink-300/40 fill-pink-200/30" 
              style={{ width: d.size, height: d.size, transform: `rotate(${d.rotation}deg)` }} 
            />
          </div>
        ))}
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col h-full bg-white/70 backdrop-blur-sm rounded-3xl p-10 shadow-sm border border-pink-100/50">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Heart className="w-12 h-12 text-pink-500 fill-pink-400" />
          </div>
          <h1 className="text-4xl font-black text-pink-600 mb-2 font-serif tracking-tight">
            Official Birthday Keepsake
          </h1>
          <p className="text-xl text-pink-400 font-medium tracking-wide">
            Prepared exclusively for {CONFIG.HER_NAME}
          </p>
        </div>

        {/* STACKED LAYOUT: TICKETS ON TOP, WISHES ON BOTTOM */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          
          {/* ========================================================
              TOP SECTION: CLAIMED TICKETS (Horizontal Wrap)
              ======================================================== */}
          <div className="w-full bg-white/80 p-5 rounded-2xl border-2 border-pink-100 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4 font-serif flex items-center justify-center gap-2 border-b-2 border-pink-50 pb-3">
              <Gift className="w-5 h-5 text-pink-500" />
              Claimed Rewards
            </h2>
            
            {redeemedIds.length === 0 ? (
              <p className="text-gray-400 italic text-center">No rewards claimed yet.</p>
            ) : (
              <div className="flex flex-wrap justify-center gap-4 overflow-hidden">
                {redeemedIds.map((id, index) => (
                  /* THE TICKET UI - Now constrained in width to sit horizontally next to each other */
                  <div key={index} className="relative w-[280px] bg-pink-50 border-2 border-dashed border-pink-300 rounded-xl p-3 flex items-center gap-3 shrink-0 shadow-sm">
                    <div className="bg-pink-200 p-2 rounded-lg text-pink-600">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-base leading-tight">{getCouponName(id)}</h3>
                      <p className="text-pink-500 text-[10px] font-bold uppercase tracking-widest mt-1">Valid for 1 Use</p>
                    </div>
                    
                    {/* Ticket Cutouts */}
                    <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-r-2 border-pink-300"></div>
                    <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-l-2 border-pink-300"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========================================================
              BOTTOM SECTION: WISHES (Centered 1 & 2, Horizontal Rest)
              ======================================================== */}
          <div className="w-full bg-white/80 p-5 rounded-2xl border-2 border-pink-100 flex flex-col flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-4 font-serif flex items-center justify-center gap-2 border-b-2 border-pink-50 pb-3">
              <Sparkles className="w-5 h-5 text-pink-500" />
              Wishes Sent to the Universe
            </h2>
            
            {wishes.length === 0 ? (
              <p className="text-gray-400 italic text-center">No wishes recorded.</p>
            ) : (
              <div className="w-full flex flex-col items-center gap-3">
                
                {/* 1. First two wishes - Centered on their own lines */}
                {wishes.slice(0, 2).map((wish, index) => (
                  <div key={index} className="w-full max-w-2xl flex items-center justify-center gap-2 bg-pink-50/50 p-3 rounded-xl border border-pink-100 text-center shadow-sm">
                    <Heart className="w-4 h-4 text-pink-400 shrink-0 fill-pink-200" />
                    <span className="text-base text-gray-700 font-medium italic">
                      "{wish}"
                    </span>
                    <Heart className="w-4 h-4 text-pink-400 shrink-0 fill-pink-200" />
                  </div>
                ))}

                {/* 2. Remaining wishes - Placed next to each other horizontally */}
                {wishes.length > 2 && (
                  <div className="flex flex-wrap justify-center gap-3 w-full mt-1">
                    {wishes.slice(2).map((wish, index) => (
                      <div key={index + 2} className="flex-1 min-w-[200px] max-w-sm flex items-center justify-center gap-2 bg-pink-50/50 p-3 rounded-xl border border-pink-100 text-center shadow-sm">
                        <Heart className="w-4 h-4 text-pink-400 shrink-0 fill-pink-200" />
                        <span className="text-base text-gray-700 font-medium italic">
                          "{wish}"
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
              </div>
            )}
          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-6 pt-4 border-t-2 border-pink-200/50 flex justify-between items-end text-pink-400 font-medium">
          <div>
            <p className="text-sm">Authorized by:</p>
            <p className="text-xl font-serif text-pink-500 mt-1">Your Favorite Person</p>
          </div>
          <div className="text-right">
            <p className="text-sm">Valid until:</p>
            <p className="text-base mt-1">Forever</p>
          </div>
        </div>

      </div>
    </div>
  );
};