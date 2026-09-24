import React, { useState } from 'react';
import { Heart, Camera } from 'lucide-react';
import { CONFIG } from '../config';

export const PhotoFrame = () => {
  const [animatingOut, setAnimatingOut] = useState(false);
  
  // The component is now super clean again!
  const [photos, setPhotos] = useState([...CONFIG.PHOTOS]);

  const handleNextPhoto = () => {
    if (animatingOut) return;
    
    setAnimatingOut(true);

    setTimeout(() => {
      setPhotos(prev => {
        const newStack = [...prev];
        const topCard = newStack.shift();
        if (topCard) newStack.push(topCard);
        return newStack;
      });
      setAnimatingOut(false);
    }, 300);
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-16 flex flex-col items-center min-h-[500px]">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-pink-500 font-serif flex items-center justify-center gap-2 mb-2">
          <Camera className="w-6 h-6" /> Memories
        </h2>
        <p className="text-pink-400 font-medium">Tap the photo to flip through!</p>
      </div>

      <div className="relative w-72 h-80 md:w-80 md:h-96">
        {photos.map((photo, index) => {
          if (index > 2) return null;

          const isTopCard = index === 0;
          
          return (
            <div
              key={photo.id}
              onClick={isTopCard ? handleNextPhoto : undefined}
              className={`absolute inset-0 bg-white p-4 pb-16 rounded-sm shadow-xl border border-gray-100 flex flex-col items-center justify-center transition-all duration-300 origin-bottom-left ${
                isTopCard ? 'cursor-pointer touch-manipulation hover:scale-105 active:scale-95' : 'pointer-events-none'
              } ${
                isTopCard && animatingOut ? 'translate-x-full rotate-12 opacity-0' : ''
              }`}
              style={{
                transform: !animatingOut || !isTopCard 
                  ? `rotate(${photo.angle}deg) scale(${1 - index * 0.05}) translateY(${index * 15}px)` 
                  : undefined,
                zIndex: 10 - index,
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <div className={`w-full h-full ${photo.fallback} bg-cover bg-center rounded overflow-hidden relative flex items-center justify-center border border-gray-50`}
                   style={photo.url ? { backgroundImage: `url(${photo.url})` } : {}}>
                {!photo.url && <Heart className="w-12 h-12 text-white/50 fill-white/30" />}
              </div>

              <div className="absolute bottom-4 left-0 w-full text-center">
                <p className="font-serif text-xl text-gray-700 italic font-medium px-4 line-clamp-2 leading-tight">
                  "{photo.caption}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};