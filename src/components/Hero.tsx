import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { CONFIG } from '../config';

export const Hero = () => {
  const [hearts, setHearts] = useState<any[]>([]);

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

  return (
    <section className="relative overflow-hidden w-full min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-pink-50 rounded-b-[3rem] shadow-sm">
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          fill="currentColor"
          className="falling-heart"
          style={{
            left: heart.left,
            width: heart.size,
            height: heart.size,
            animationDuration: heart.animationDuration,
            animationDelay: heart.animationDelay,
          }}
        />
      ))}

      <div className="relative z-20 mb-6 bg-white p-4 rounded-full shadow-lg border-4 border-pink-200">
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
      </div>

      <h1 className="relative z-20 text-5xl md:text-6xl font-extrabold text-pink-600 tracking-tight drop-shadow-sm mb-4 font-serif">
        Happy Birthday, <br/>
        <span className="text-rose-500">{CONFIG.HER_NAME}!</span>
      </h1>
      <p className="relative z-20 text-lg text-pink-500 font-medium max-w-md mx-auto">
        Semoga ini jadi ulang tahun terbaik kamu sejauh ini AMINN
      </p>
    </section>
  );
};