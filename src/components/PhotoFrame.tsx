import React, { useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { CONFIG } from '../config';

const SWIPE_DISTANCE = 70; // px she has to drag before the photo flies away
const TAP_DISTANCE = 6;    // moving less than this counts as a tap

export const PhotoFrame = () => {
  const [photos, setPhotos] = useState([...CONFIG.PHOTOS]);
  const [dragX, setDragX] = useState(0);   // how far the top photo is being dragged sideways
  const [flyDir, setFlyDir] = useState(0); // -1 / 1 while the top photo flies off, 0 otherwise
  const dragStart = useRef<number | null>(null);

  const sendTopPhotoAway = (dir: number) => {
    if (flyDir) return;
    setFlyDir(dir);
    setTimeout(() => {
      setPhotos(prev => [...prev.slice(1), prev[0]]); // top photo goes to the bottom of the pile
      setFlyDir(0);
      setDragX(0);
    }, 300);
  };

  // Swipe: the photo follows her finger; let go far enough and it flies off that way
  const onPointerDown = (e: React.PointerEvent) => {
    if (flyDir) return;
    dragStart.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStart.current !== null) setDragX(e.clientX - dragStart.current);
  };
  const onPointerUp = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (Math.abs(dragX) < TAP_DISTANCE) sendTopPhotoAway(1);                        // a tap
    else if (Math.abs(dragX) > SWIPE_DISTANCE) sendTopPhotoAway(Math.sign(dragX));  // a swipe
    else setDragX(0);                                                               // not far enough: snap back
  };
  // the browser took over (e.g. she's scrolling the page instead)
  const onPointerCancel = () => {
    dragStart.current = null;
    setDragX(0);
  };

  return (
    <section className="reveal max-w-xl mx-auto px-6 py-16 flex flex-col items-center min-h-[500px]">

      <div className="text-center mb-12">
        <h2 className="font-hand text-6xl text-ink squiggle inline-block px-2">Memories</h2>
        <p className="font-hand text-2xl text-pink-500 mt-2">geser atau tap fotonya ♡</p>
      </div>

      <div className="relative w-72 h-[22rem] md:w-80 md:h-96">
        {photos.map((photo, index) => {
          if (index > 2) return null;

          const isTopCard = index === 0;
          const isDragging = isTopCard && dragX !== 0 && !flyDir;

          let transform = `rotate(${photo.angle}deg) scale(${1 - index * 0.05}) translateY(${index * 14}px)`;
          if (isTopCard && flyDir) transform = `translateX(${flyDir * 130}%) rotate(${flyDir * 25}deg)`;
          else if (isTopCard) transform = `translateX(${dragX}px) rotate(${photo.angle + dragX / 12}deg)`;

          return (
            <div
              key={photo.id}
              {...(isTopCard && { onPointerDown, onPointerMove, onPointerUp, onPointerCancel })}
              className={`absolute inset-0 bg-white p-3 pb-16 shadow-xl select-none ${
                isTopCard ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
              }`}
              style={{
                transform,
                opacity: isTopCard && flyDir ? 0 : 1,
                // no transition while dragging, so the photo sticks to her finger
                transition: isDragging ? 'none' : 'transform 300ms ease-out, opacity 300ms ease-out',
                zIndex: 10 - index,
                touchAction: 'pan-y', // vertical swipes still scroll the page
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <span className="tape" />
              <div className={`w-full h-full ${photo.fallback} bg-cover bg-center relative flex items-center justify-center`}
                   style={photo.url ? { backgroundImage: `url(${photo.url})` } : {}}>
                {!photo.url && <Heart className="w-12 h-12 text-white/50 fill-white/30" />}
              </div>

              {/* only the top photo shows its caption (the ones behind used to peek out) */}
              <p
                className="absolute bottom-3 left-0 w-full px-4 text-center font-hand text-3xl text-ink leading-none line-clamp-2 transition-opacity duration-300"
                style={{ opacity: isTopCard ? 1 : 0 }}
              >
                {photo.caption}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
