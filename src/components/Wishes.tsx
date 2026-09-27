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
    <section className="reveal max-w-xl mx-auto px-6 py-16">

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

      <div className="bg-white p-6 pt-10 md:p-10 shadow-xl -rotate-[0.5deg] relative">
        <span className="tape" />

        {/* ========================================================
            IDLE STATE: Adding wishes
            ======================================================== */}
        {status === 'idle' && (
          <div className="animate-in fade-in">
            <div className="text-center mb-8">
              <h2 className="font-hand text-5xl text-ink squiggle inline-block px-2">
                Make a Wish <span className="text-3xl">✨</span>
              </h2>
            </div>

            <form onSubmit={handleAddWish} className="flex gap-3 mb-6">
              <input
                id="wish-input"
                type="text"
                value={currentWish}
                onChange={(e) => setCurrentWish(e.target.value)}
                placeholder="I wish for..."
                maxLength={100}
                // text-base (16px) stops iPhones from zooming in when she taps the box
                className="flex-1 min-w-0 px-4 py-3 rounded-2xl border-2 border-ink bg-white text-base text-ink placeholder:text-ink/40 focus:ring-4 focus:ring-pink-200 outline-none transition-shadow"
              />
              <button
                type="submit"
                disabled={!currentWish.trim()}
                aria-label="Add wish"
                className="btn-pop shrink-0 bg-pink-100 text-pink-600 px-3 rounded-2xl disabled:opacity-50"
              >
                <Plus className="w-6 h-6" />
              </button>
            </form>

            <div className="flex flex-col gap-3 mb-8 min-h-[120px]">
              {wishes.length === 0 ? (
                <div className="flex-1 flex items-center justify-center font-hand text-2xl text-pink-300 border-2 border-dashed border-pink-200 rounded-2xl">
                  Waiting for your wishes...
                </div>
              ) : (
                wishes.map((wish, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 bg-pink-50 px-4 py-2.5 rounded-2xl animate-in slide-in-from-left-2">
                    {/* min-w-0 + overflow-wrap:anywhere let long words wrap instead of pushing the delete button out */}
                    <span className="min-w-0 font-hand text-2xl leading-tight text-ink flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                      <span className="min-w-0 [overflow-wrap:anywhere]">{wish}</span>
                    </span>
                    <button
                      onClick={() => handleRemoveWish(idx)}
                      aria-label="Remove wish"
                      className="shrink-0 p-1 text-pink-300 hover:text-red-400 transition-colors"
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
              className="btn-pop w-full flex items-center justify-center gap-2 bg-pink-500 disabled:bg-gray-300 disabled:shadow-none disabled:border-gray-300 text-white px-6 py-4 rounded-2xl font-pop font-semibold text-lg"
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
            <h3 className="font-hand text-4xl text-ink">Sending your wishes...</h3>
          </div>
        )}

        {/* ========================================================
            SENT STATE: Success confirmation
            ======================================================== */}
        {status === 'sent' && (
          <div className="text-center animate-in fade-in zoom-in py-10">
            <div className="animate-float-wish flex justify-center mb-6">
              <HeartHandshake className="w-24 h-24 text-pink-400" />
            </div>
            <h3 className="font-hand text-5xl text-ink mb-3">Wishes Delivered! ✨</h3>
            <p className="font-hand text-2xl text-ink/70 mb-8">The universe has received your wishes ❤️</p>
            <button
              onClick={() => setStatus('idle')}
              className="btn-pop bg-white text-pink-600 px-5 py-2.5 rounded-full font-pop font-semibold"
            >
              Make another wish
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
