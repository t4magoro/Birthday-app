import { useState } from 'react';
import { CONFIG } from '../config';
import { Emoji } from './storybuilder/Emoji';

interface GiftIntroProps {
  onOpen: () => void;
}

// Full-screen "you've got a gift" cover shown when the site first opens.
// Her tap here also counts as the first tap MusicButton waits for, so the music
// starts even on iPhones (which block sound until the visitor taps something).
export const GiftIntro = ({ onOpen }: GiftIntroProps) => {
  const [leaving, setLeaving] = useState(false);

  const open = () => {
    if (leaving) return;
    setLeaving(true);
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('confetti')); // ConfettiButton listens for this
    setTimeout(onOpen, 500); // matches the fade-out below
  };

  return (
    <div
      className={`fixed inset-0 z-[90] bg-paper flex flex-col items-center justify-center px-6 text-center touch-none transition-all duration-500 ease-in ${
        leaving ? 'opacity-0 scale-110 pointer-events-none' : ''
      }`}
    >
      <div className="postmark absolute top-8 left-6 -rotate-12">WITH LOVE</div>
      <div className="stamp absolute top-7 right-6 rotate-6">for<br />you ♥</div>

      <div className="animate-rise" style={{ animationDelay: '0.1s' }}>
        <div className="animate-wiggle">
          <Emoji emoji="💝" className="w-28 h-28" />
        </div>
      </div>

      <p className="animate-rise font-hand text-4xl text-pink-500 mt-6" style={{ animationDelay: '0.3s' }}>
        Halo cayang
      </p>
      <h1 className="animate-rise font-hand text-5xl text-ink leading-none max-w-xs" style={{ animationDelay: '0.45s' }}>
        Ive prepared something for you muehehehe ♡
      </h1>

      <button
        onClick={open}
        className="animate-rise btn-pop mt-10 bg-pink-500 text-white font-pop font-semibold text-xl px-8 py-4 rounded-full"
        style={{ animationDelay: '0.7s' }}
      >
        Buka kadonya
      </button>
      <p className="animate-rise mt-5 text-sm font-bold text-pink-400" style={{ animationDelay: '0.9s' }}>
        🔊 nyalain suaranya ya
      </p>
    </div>
  );
};
