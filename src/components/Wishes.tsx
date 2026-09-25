import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, Send, HeartHandshake } from 'lucide-react';

interface WishesProps {
  wishes: string[];
  setWishes: (wishes: string[]) => void;
}

export const Wishes = ({ wishes, setWishes }: WishesProps) => {
  const [currentWish, setCurrentWish] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentWish.trim()) {
      setWishes([...wishes, currentWish.trim()]);
      setCurrentWish('');
    }
  };

  const handleRemoveWish = (indexToRemove: number) => {
    setWishes(wishes.filter((_, index) => index !== indexToRemove));
  };

  const handleSendWishes = () => {
    if (wishes.length === 0) return;
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 2000);
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-16">
      
      {/* 
        We are bringing the styles back inside the component! 
        This guarantees the browser renders the animations without relying on Tailwind v4's strict external CSS compiler.
      */}
      <style>{`
        @keyframes flyAway { 
          0% { transform: translateY(0) scale(1); opacity: 1; } 
          100% { transform: translateY(-300px) scale(0.5); opacity: 0; } 
        }
        .animate-fly-away { animation: flyAway 2s forwards cubic-bezier(0.4, 0, 0.2, 1); }
        
        @keyframes floatWish { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-10px); } 
        }
        .animate-float-wish { animation: floatWish 3s ease-in-out infinite; }
      `}</style>
      
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border-2 border-pink-100 relative overflow-hidden">
        
        {/* ========================================================
            IDLE STATE: Adding wishes
            ======================================================== */}
        {status === 'idle' && (
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-pink-500 mb-2 font-serif flex items-center justify-center gap-2">
                Make a Wish <Sparkles className="w-6 h-6 text-yellow-400" />
              </h2>
            </div>
            
            <form onSubmit={handleAddWish} className="flex gap-2 mb-6">
              <input 
                id="wish-input"
                type="text" 
                value={currentWish} 
                onChange={(e) => setCurrentWish(e.target.value)} 
                placeholder="I wish for..."
                maxLength={100}   
                className="flex-1 min-w-0 px-4 py-3 rounded-xl border-2 border-pink-200 focus:ring-2 focus:ring-pink-200 outline-none transition-all" 
              />
              <button 
                type="submit" 
                disabled={!currentWish.trim()} 
                className="min-w-0 bg-pink-100 text-pink-600 hover:bg-pink-200 p-3 rounded-xl disabled:opacity-50 transition-colors active:scale-95"
              >
                <Plus className="w-6 h-6" />
              </button>
            </form>
            
            <div className="flex flex-col gap-3 mb-8 min-h-[120px]">
              {wishes.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-pink-200 italic border-2 border-dashed border-pink-100 rounded-xl">
                  Waiting for your wishes...
                </div>
              ) : (
                wishes.map((wish, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 bg-pink-50 px-4 py-3 rounded-xl animate-in slide-in-from-left-2">
                    {/* min-w-0 + overflow-wrap:anywhere let long words wrap instead of pushing the delete button out */}
                    <span className="min-w-0 text-gray-700 font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                      <span className="min-w-0 [overflow-wrap:anywhere]">{wish}</span>
                    </span>
                    <button 
                      onClick={() => handleRemoveWish(idx)} 
                      aria-label="Remove wish"
                      className="shrink-0 text-pink-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                ))
              )}
            </div>
            
            <button 
              onClick={handleSendWishes} 
              disabled={wishes.length === 0} 
              className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white px-6 py-4 rounded-xl font-bold transition-transform active:scale-95 shadow-md"
            >
              Send to the Universe <Send className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* ========================================================
            SENDING STATE: The fly-away animation
            ======================================================== */}
        {status === 'sending' && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fly-away">
            <Send className="w-24 h-24 text-pink-400 mb-6" />
            <h3 className="text-2xl font-bold text-pink-500 font-serif">Sending your wishes...</h3>
          </div>
        )}
        
        {/* ========================================================
            SENT STATE: Success confirmation
            ======================================================== */}
        {status === 'sent' && (
          <div className="text-center animate-in fade-in zoom-in duration-500 py-10">
            <div className="animate-float-wish flex justify-center mb-6">
              <HeartHandshake className="w-24 h-24 text-rose-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4 font-serif">Wishes Delivered! ✨</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">The universe has received your wishes. ❤️</p>
            <button 
              onClick={() => setStatus('idle')} 
              className="text-pink-500 font-medium hover:underline"
            >
              Make another wish
            </button>
          </div>
        )}
        
      </div>
    </section>
  );
};