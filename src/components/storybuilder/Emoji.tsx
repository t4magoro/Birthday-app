import twemoji from 'twemoji';

interface EmojiProps {
  emoji: string;
  className?: string;
}

// 🔥 EXPORT FIX: the twemoji package still points at twemoji.maxcdn.com, which
// serves its SVGs WITHOUT CORS headers. html-to-image has to fetch() every <img>
// to embed it in the export, so those emojis made every download fail.
// jsDelivr serves the maintained twemoji fork with `Access-Control-Allow-Origin: *`.
const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/';

// Same rule twemoji uses internally: drop the U+FE0F variation selector unless
// the emoji is a ZWJ sequence (so "❤️" maps to 2764.svg).
const toTwemojiUrl = (emoji: string) => {
  const raw = emoji.includes('‍') ? emoji : emoji.replace(/️/g, '');
  return `${TWEMOJI_BASE}${twemoji.convert.toCodePoint(raw)}.svg`;
};

export const Emoji = ({ emoji, className }: EmojiProps) => (
  <img
    src={toTwemojiUrl(emoji)}
    alt={emoji}
    draggable={false}
    // Load with CORS from the start so Safari caches a CORS-enabled copy that
    // html-to-image's fetch() can reuse at export time.
    crossOrigin="anonymous"
    // max-w-none: Tailwind's base `img { max-width: 100% }` otherwise squashes
    // stickers placed near the card's right edge (their wrapper shrinks to fit).
    className={`max-w-none ${className ?? ''}`}
  />
);
