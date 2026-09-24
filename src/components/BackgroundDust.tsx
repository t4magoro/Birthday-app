import React, { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';

export const BackgroundDust = () => {
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  
  // Reference for our physics animation loop
  const requestRef = useRef<number>(0);
  
  // Tracks where the scroll IS vs where it is GOING
  const scrollState = useRef({
    target: 0,
    current: 0,
  });

  const [mounted, setMounted] = useState(false);

  const generateDust = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 14 + 6,
      opacity: Math.random() * 0.3 + 0.1,
      rotation: Math.random() * 360,
      delay: `${Math.random() * 2}s`
    }));
  };

  const [dust1] = useState(() => generateDust(50));
  const [dust2] = useState(() => generateDust(50));
  const [dust3] = useState(() => generateDust(50));

  useEffect(() => {
    setMounted(true);
    
    // 1. Update the target whenever she scrolls
    const handleScroll = () => {
      scrollState.current.target = window.scrollY;
    };

    // 2. The physics loop (Runs at 60fps on the GPU)
    const updateAnimation = () => {
      // Lerp (Smoothly catch current position up to the target position)
      scrollState.current.current += (scrollState.current.target - scrollState.current.current) * 0.08;
      
      const { current, target } = scrollState.current;
      
      // Calculate velocity: The faster she scrolls, the bigger this number gets
      const velocity = target - current; 

      // Apply Base Parallax + Velocity Kick
      if (layer1Ref.current) {
        // Background: Moves up slowly, slight kick
        const y1 = (current * 0.15) + (velocity * 0.2);
        layer1Ref.current.style.transform = `translate3d(0, ${y1}px, 0)`;
      }
      if (layer2Ref.current) {
        // Midground: Moves down (reverse jar effect), moderate kick
        const y2 = (current * -0.1) - (velocity * 0.3);
        layer2Ref.current.style.transform = `translate3d(0, ${y2}px, 0)`;
      }
      if (layer3Ref.current) {
        // Foreground: Moves up fastest, massive kick
        const y3 = (current * 0.25) + (velocity * 0.6);
        layer3Ref.current.style.transform = `translate3d(0, ${y3}px, 0)`;
      }

      // Loop to next frame
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    requestRef.current = requestAnimationFrame(updateAnimation);

    // Cleanup physics loop on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      
      <style>{`
        @keyframes dustFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.1); }
        }
        .animate-dust {
          animation: dustFloat 4s ease-in-out infinite;
        }
      `}</style>

      {/* Layer 1 */}
      <div ref={layer1Ref} className="absolute -top-[30%] -bottom-[30%] left-0 right-0 will-change-transform">
        {dust1.map(d => (
          <div key={d.id} className="absolute animate-dust" style={{ left: d.left, top: d.top, animationDelay: d.delay }}>
            <Heart className="text-pink-300/40 fill-pink-200/30" style={{ width: d.size, height: d.size, transform: `rotate(${d.rotation}deg)` }} />
          </div>
        ))}
      </div>

      {/* Layer 2 */}
      <div ref={layer2Ref} className="absolute -top-[30%] -bottom-[30%] left-0 right-0 will-change-transform">
        {dust2.map(d => (
          <div key={d.id} className="absolute animate-dust" style={{ left: d.left, top: d.top, animationDelay: d.delay }}>
            <Heart className="text-pink-400/50 fill-pink-300/40" style={{ width: d.size, height: d.size, transform: `rotate(${d.rotation}deg)` }} />
          </div>
        ))}
      </div>

      {/* Layer 3 */}
      <div ref={layer3Ref} className="absolute -top-[30%] -bottom-[30%] left-0 right-0 will-change-transform">
        {dust3.map(d => (
          <div key={d.id} className="absolute animate-dust" style={{ left: d.left, top: d.top, animationDelay: d.delay }}>
            <Heart className="text-pink-300/70 fill-pink-200/60 border-pink-100" style={{ width: d.size, height: d.size, transform: `rotate(${d.rotation}deg)` }} />
          </div>
        ))}
      </div>

    </div>
  );
};