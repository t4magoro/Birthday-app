import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { CONFIG } from '../config';

const START_EVENTS = ['pointerdown', 'touchend', 'click', 'keydown'] as const;

interface MusicButtonProps {
  // true while the confetti button is on screen (main page): sit just above it;
  // false (story builder): slide down into the confetti button's spot
  aboveConfetti: boolean;
}

// Background music that loops for the whole visit, with a mute / unmute button
// sitting above the confetti button.
// Browsers (iPhone Safari most strictly) block sound until the visitor taps something,
// so if autoplay is refused the music starts on their first tap anywhere on the page.
export const MusicButton = ({ aboveConfetti }: MusicButtonProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [available, setAvailable] = useState(true); // false when the song file is missing
  const userMuted = useRef(false); // once they mute, never start the music again by ourselves

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5; // ignored on iPhone, where volume is controlled by the phone buttons

    const stopListening = () => START_EVENTS.forEach(ev => document.removeEventListener(ev, startOnFirstTap));
    function startOnFirstTap(e: Event) {
      // a tap on the music button itself is handled by its own onClick
      if ((e.target as Element | null)?.closest?.('[data-music-toggle]')) return;
      if (userMuted.current) return stopListening();
      audio!.play().then(stopListening).catch(() => { /* still blocked: try again on the next tap */ });
    }

    audio.play().catch(() => START_EVENTS.forEach(ev => document.addEventListener(ev, startOnFirstTap)));

    // pause while the tab / app is in the background, carry on when they come back
    let resumeOnReturn = false;
    const onVisibilityChange = () => {
      if (document.hidden) {
        resumeOnReturn = !audio.paused;
        audio.pause();
      } else if (resumeOnReturn && !userMuted.current) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      stopListening();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      audio.pause();
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      userMuted.current = false;
      audio.play().catch(() => {});
    } else {
      userMuted.current = true;
      audio.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={CONFIG.MUSIC_URL}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setAvailable(false)}
      />
      {available && (
        <button
          data-music-toggle
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Mute music' : 'Play music'}
          title={isPlaying ? 'Mute music' : 'Play music'}
          className={`fixed bottom-6 left-6 z-50 bg-white text-pink-500 p-4 rounded-full shadow-2xl hover:bg-pink-50 hover:scale-110 active:scale-95 border-2 border-pink-200 print:hidden flex items-center justify-center 
            ${aboveConfetti ? '-translate-y-18' : 'translate-y-0'
          }`}
          style={{ WebkitTapHighlightColor: 'transparent',
            // smooth up/down slide with a little overshoot; hover & press stay quick
            transition: 'translate 550ms cubic-bezier(0.34, 1.4, 0.64, 1), scale 200ms ease-out, background-color 300ms ease', }}
        >
          {isPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
      )}
    </>
  );
};