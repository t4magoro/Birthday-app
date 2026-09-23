import React from 'react';
import { Heart } from 'lucide-react';
import { CONFIG } from '../config';

export const Message = () => (
  <section className="max-w-2xl mx-auto px-6 py-16">
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-pink-100 relative">
      <Heart className="absolute -top-6 -left-6 w-12 h-12 text-pink-300 fill-pink-200 rotate-[-15deg]" />
      <Heart className="absolute -bottom-6 -right-6 w-16 h-16 text-rose-300 fill-rose-200 rotate-[15deg]" />
      
      <p className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-line font-medium text-center">
        {CONFIG.MESSAGE_TEXT}
      </p>
    </div>
  </section>
);