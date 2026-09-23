import React from 'react';
import { CONFIG } from '../config';

export const PhotoFrame = () => {
  const rotations = [
    "-rotate-2 hover:rotate-1 active:rotate1",
    "rotate-3 hover:rotate-1 active:rotate1",
    "-rotate-1 hover:rotate-1 active:rotate1",
    "-rotate-2 hover:rotate-1 active:rotate1"
  ];

  return (
    <section className="flex flex-wrap justify-center gap-10 py-16 px-6 overflow-hidden max-w-6xl mx-auto">
      {CONFIG.PHOTOS.map((photo, index) => {
        const rotationClass = rotations[index % rotations.length];
        // Stagger the animation timing so they float independently
        const delay = `${index * 0.5}s`;
        
        return (
          <div 
            key={index} 
            className="animate-mobile-float"
            style={{ animationDelay: delay }}
          >
            {/* Added active:scale-95 so she gets visual feedback when she taps it */}
            <div 
              className={`bg-white p-4 pb-12 w-full max-w-sm rounded-sm shadow-xl border border-gray-100 flex-shrink-0 transition-all duration-300 active:scale-95 z-0 hover:z-10 ${rotationClass}`}
            >
              <div className="bg-gray-200 aspect-square w-full overflow-hidden mb-4 relative">
                <img 
                  src={photo.url} 
                  alt={`Memory ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center font-serif text-gray-600 text-xl font-medium tracking-wide">
                {photo.caption}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
};