import { ShadowLayer } from './types';

interface SoftShadowProps {
  layers: ShadowLayer[];
  radius: number; // px, the border radius of the element casting the shadow
}

// polygon(evenodd): a big rectangle with a rounded-rect hole exactly where the
// element sits, so the shadow is never painted underneath it — just like a real
// box-shadow. Without this, see-through surfaces (Dreamy Glow) turn grey.
const clipOutside = (r: number) => {
  const M = 200; // well past the furthest a shadow reaches
  const STEPS = 8; // points per rounded corner
  const x = (fromRight: boolean, px: number) => (fromRight ? `calc(100% - ${px.toFixed(2)}px)` : `${px.toFixed(2)}px`);
  const y = (fromBottom: boolean, px: number) => (fromBottom ? `calc(100% - ${px.toFixed(2)}px)` : `${px.toFixed(2)}px`);
  const hole: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const a = (i / STEPS) * (Math.PI / 2);
    hole.push(`${x(false, r - r * Math.cos(a))} ${y(false, r - r * Math.sin(a))}`); // top-left
  }
  for (let i = 0; i <= STEPS; i++) {
    const a = (i / STEPS) * (Math.PI / 2);
    hole.push(`${x(true, r - r * Math.sin(a))} ${y(false, r - r * Math.cos(a))}`); // top-right
  }
  for (let i = 0; i <= STEPS; i++) {
    const a = (i / STEPS) * (Math.PI / 2);
    hole.push(`${x(true, r - r * Math.cos(a))} ${y(true, r - r * Math.sin(a))}`); // bottom-right
  }
  for (let i = 0; i <= STEPS; i++) {
    const a = (i / STEPS) * (Math.PI / 2);
    hole.push(`${x(false, r - r * Math.sin(a))} ${y(true, r - r * Math.cos(a))}`); // bottom-left
  }
  const outer = [`-${M}px -${M}px`, `calc(100% + ${M}px) -${M}px`, `calc(100% + ${M}px) calc(100% + ${M}px)`, `-${M}px calc(100% + ${M}px)`, `-${M}px -${M}px`];
  // Return to the hole's first point so the jump in/out of the hole has no area.
  return `polygon(evenodd, ${[...outer, ...hole, hole[0]].join(', ')})`;
};

// 🔥 SAFARI FIX: a soft shadow built from blurred layers instead of CSS box-shadow.
// When html-to-image rasterizes the card, WebKit (Safari and every iPhone browser)
// paints blurred box-shadows as hard grey rectangles, while blurred divs render
// correctly. Put this as the first child of a `relative` element with the same radius.
export const SoftShadow = ({ layers, radius }: SoftShadowProps) => (
  <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ clipPath: clipOutside(radius) }}>
    {layers.map((layer, i) => (
      <div
        key={i}
        className="absolute"
        style={{
          top: -layer.spread,
          right: -layer.spread,
          bottom: -layer.spread,
          left: -layer.spread,
          borderRadius: Math.max(0, radius + layer.spread),
          background: `rgba(0,0,0,${layer.alpha})`,
          // a box-shadow blur radius is two standard deviations of the Gaussian
          filter: `blur(${layer.blur / 2}px)`,
          transform: `translateY(${layer.y}px)`,
        }}
      />
    ))}
  </div>
);
