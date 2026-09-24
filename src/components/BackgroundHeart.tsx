import React, { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

export const BackgroundHeart = () => {
  const bgHeartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (bgHeartRef.current) {
            const scrollY = window.scrollY;
            // The hero section is roughly 60vh. Start showing after ~40% of the screen.
            const heroThreshold = window.innerHeight * 0.4; 

            if (scrollY > heroThreshold) {
              bgHeartRef.current.style.opacity = '1';
              
              // Parallax math: Moves opposite to scroll direction at 15% speed
              const moveY = (scrollY - heroThreshold) * 0.15; 
              bgHeartRef.current.style.transform = `translate3d(-50%, calc(-50% + ${moveY}px), 0) rotate(-10deg)`;
            } else {
              bgHeartRef.current.style.opacity = '0';
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={bgHeartRef}
      className="fixed top-1/2 left-1/2 -z-10 pointer-events-none transition-opacity duration-700 ease-in-out"
      style={{ 
        opacity: 0, 
        transform: 'translate3d(-50%, -50%, 0) rotate(-10deg)',
        willChange: 'transform, opacity' 
      }}
    >
      <Heart className="w-[150vw] h-[150vw] md:w-[40rem] md:h-[40rem] text-pink-200/40 fill-pink-100/30" />
    </div>
  );
};