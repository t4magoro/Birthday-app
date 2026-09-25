import { CONFIG } from '../../config';
import React, { useRef, useEffect } from 'react';
import { StoryColor, StoryTheme, StickerData, LoveDustItem } from './types';

interface StoryCanvasProps {
  containerRef: React.Ref<HTMLDivElement>;
  storyRef: React.Ref<HTMLDivElement>;
  scale: number;
  activeColor: StoryColor;
  activeTheme: StoryTheme;
  uploadedImg: string | null;
  stickers: StickerData[];
  wishes: string[];
  claimedCoupons: typeof CONFIG.INITIAL_COUPONS;
  loveDust: LoveDustItem[];
}

export const StoryCanvas = ({
  containerRef, storyRef, scale, activeColor, activeTheme, 
  uploadedImg, stickers, wishes, claimedCoupons, loveDust
}: StoryCanvasProps) => {

  // 🔥 THE ULTIMATE iOS FIX: Placed right here before the return statement!
  const photoCanvasRef = useRef<HTMLCanvasElement>(null);
  const currentImg = uploadedImg || CONFIG.PHOTOS[0]?.url || '';

  useEffect(() => {
    const canvas = photoCanvasRef.current;
    if (!canvas || !currentImg) return;
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Only use crossOrigin for external web links, not local uploads
    if (!currentImg.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    
    img.onload = () => {
      // Set high-res internal dimensions for a perfect 4:5 portrait aspect ratio
      canvas.width = 800;
      canvas.height = 1000;
      
      // Math to perfectly replicate Tailwind's "object-cover"
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;
      
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };
    img.src = currentImg;
  }, [currentImg]);

  return (
    <div className="w-full flex justify-center shrink-0 md:w-[380px] z-10">
      <div className="w-full p-2 md:p-3 rounded-[2rem] border-[3px] border-dashed border-gray-300 bg-white/40 flex justify-center items-center">
        <div ref={containerRef} className="relative w-full max-w-[360px] aspect-[9/16] rounded-2xl shadow-lg overflow-hidden">
          <div 
            ref={storyRef}
            style={{ width: '360px', height: '640px', transform: `scale(${scale})`, transformOrigin: 'top left' }}
            className={`absolute top-0 left-0 flex flex-col justify-center items-center p-5 transition-colors duration-300 ${activeColor.class}`}
          >
            {/* Dynamic Background Dust */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              <div className={`absolute inset-0 transition-colors duration-300 ${activeColor.text}`}>
                {loveDust.map((item, idx) => {
                  if (item.type === 'heart') {
                    return (
                      <svg key={idx} viewBox="0 0 24 24" fill="currentColor" className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out"
                        style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.size}px`, height: `${item.size}px`, transform: `translate(-50%, -50%) rotate(${item.rot}deg)`, opacity: item.opacity }}
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    );
                  }
                  return (
                    <div key={idx} className="absolute rounded-full bg-current -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out"
                      style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.size}px`, height: `${item.size}px`, opacity: item.opacity }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Header */}
            <div className="text-center z-10 shrink-0 mb-5">
              <h1 className={`text-[32px] font-bold font-serif leading-none tracking-tight mb-1 ${activeColor.text}`}>Happy Birthday</h1>
              <p className={`font-medium text-sm opacity-80 ${activeColor.text}`}>{CONFIG.HER_NAME} ❤️</p>
            </div>

            {/* Photo Area */}
            <div className="flex flex-col items-center justify-center z-10 w-full shrink-0 mb-5">
              <div className={`p-1.5 rounded-3xl border-2 border-dashed border-current ${activeColor.text} transition-colors duration-300`}>
                <div className={`${activeTheme.frameClass} w-[190px] flex flex-col shrink-0 shadow-lg`}>
                  
                  {/* 🔥 FIXED: The canvas now draws the image so Safari doesn't block the export */}
                  <canvas 
                    ref={photoCanvasRef}
                    className="w-full aspect-[4/5] rounded bg-pink-200"
                    style={{ display: 'block' }}
                  />

                  {activeTheme.id === 'classic' && (
                    <p className="text-center font-serif text-gray-700 italic mt-2 px-1 text-[10px] leading-tight line-clamp-1">
                      {"A moment to remember"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic Stack (Wishes & Coupons) */}
            <div className="shrink-0 flex flex-col gap-3 z-10 w-full max-w-[300px]">
              {wishes.length > 0 && (
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-3 border border-white/50 shadow-sm w-full">
                  <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 text-center ${activeColor.text}`}>Your Birthday Wish ✨</p>
                  <div className="flex flex-col gap-1">
                    {wishes.map((wish, idx) => (
                      <p key={idx} className="text-[11px] font-serif text-gray-800 text-center italic leading-tight line-clamp-2">"{wish}"</p>
                    ))}
                  </div>
                </div>
              )}

              {claimedCoupons.length > 0 && (
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-3 border border-white/50 shadow-sm w-full">
                  <p className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 text-center ${activeColor.text}`}>claimed Coupons</p>
                  <div className="flex flex-col gap-1.5">
                    {claimedCoupons.map(coupon => {
                      const Icon = coupon.icon;
                      return (
                        <div key={coupon.id} className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-lg shadow-sm">
                          <div className="bg-pink-50 p-1 rounded-md text-pink-500 shrink-0">
                            <Icon className="w-3 h-3" />
                          </div>
                          <span className="font-bold text-gray-700 text-[10px] truncate leading-none pt-0.5">{coupon.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Stickers */}
            {stickers.map(sticker => (
              <div 
                key={sticker.id}
                className="absolute text-4xl drop-shadow-md pointer-events-none select-none z-[5]"
                style={{ 
                  left: `${sticker.x}%`, 
                  top: `${sticker.y}%`, 
                  transform: `translate(-50%, -50%) rotate(${sticker.rot}deg)` 
                }}
              >
                {sticker.emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};