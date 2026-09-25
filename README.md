# 💖 Personalized Interactive Birthday Web App 💖

Dear my beloved girl, this is my first time learning front end web developement and i wish to present my first project to you, i hope you can see my effort later in the future, but for now this is all i can do, i hope in the future i can develop my skill even further and contribute my skill to the society, but for now, i present to you this project from all of my heart.

---

## ✨ Features

*   **Hero Section:** Randomized, hardware-accelerated (`translate3d`) falling rose-gold hearts background safe for mobile GPUs.
*   **Love Letter:** Styled heartfelt message card.
*   **Polaroid Photo Gallery:** Dynamic, staggered tilted polaroids (`-rotate-2`, `rotate-3`, etc.) with continuous mobile float and active touch scaling.
*   **Interactive Gatekeeper / Quiz:** Requires a 100% score to unlock birthday rewards.
*   **Love Coupon Book:** Gated reward vouchers with a strict pick limit (`MAX_CHOICES`), custom stamp overlays upon selection (`CLAIMED`), and tactile mobile scaling (`active:scale-95`).
*   **Wishing Well:** Type-and-add multi-wish system with physics-driven "fly-away" animations sending wishes to the universe.
*   **Dedicated IG Story Studio:** A memory-optimized, secondary routing view that allows the user to design a 9:16 Instagram Story Keepsake based on her chosen gifts.
    *   **Customizable Themes:** Switch between different color palettes and photo frame styles (Polaroid, Modern, Dreamy Glow).
    *   **Dynamic Love Dust:** A randomized, perfectly balanced background pattern generator with a "Shuffle Pattern" feature.
    *   **Smart Sticker Placement:** A "Round Robin" safe-zone algorithm that ensures stickers perfectly anchor the corners without blocking the photo or text.
    *   **Frosted Glass UI:** Premium iOS-style `backdrop-blur` aesthetics.
    *   **High-Res Export:** Uses `html-to-image` to export a flawless 1080x1920 JPEG without rendering flickers.
*   **Mobile-First / Android Optimized:** Built with smooth CSS keyframes, seamless view transitions, GPU hints (`will-change`), and touch-responsive micro-interactions.

---

## 🛠 Tech Stack

*   **Core:** React 18+, TypeScript (`.tsx`)
*   **Build Tool:** Vite (`@tailwindcss/vite`)
*   **Styling:** Tailwind CSS v4
*   **Icons:** `lucide-react`
*   **Image Generation:** `html-to-image`
*   **Containerization:** Docker & Docker Compose (Node 20)
*   **CI/CD & Hosting:** GitHub Actions & GitHub Pages

---

## 🐳 Running via Docker

Open your project folder in your terminal:

```bash
cd "D:\my-Project\my--app"
```
Build and start the container:

```bash
docker-compose up --build
```

Open your browser and navigate to:

```text
http://localhost:5173/
```

To close it when you are done:

```bash
docker-compose down
```
---

##  📁 Project Structure

```text
Birthday-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD pipeline
├── src/
│   ├── assets/                 # Local images / media files
│   ├── components/
│   │   ├── storybuilder/       # IG Story Studio module (Canvas, Tools, Constants)
│   │   ├── Hero.tsx            # Falling hearts & greeting header
│   │   ├── LoveCoupons.tsx     # Gated interactive reward vouchers
│   │   ├── Message.tsx         # Romantic letter card
│   │   ├── PhotoFrame.tsx      # Scattered polaroid gallery
│   │   └── Wishes.tsx          # Interactive wishing well + fly-away anim
│   ├── pages/
│   │   └── MainPage.tsx        # Aggregates all components for the main gift experience
│   ├── styles/
│   │   └── FallingHeartsStyle.tsx # GPU-accelerated keyframes for falling hearts
│   ├── App.tsx                 # Main view router & smooth fade transition controller
│   ├── config.ts               # Centralized text, names, and photo config
│   ├── index.css               # Tailwind v4 import & mobile GPU keyframes
│   └── main.tsx                # React DOM root entry
├── docker-compose.yml          # Docker service definition (Port 5173)
├── Dockerfile                  # Container build instructions
├── package.json                # Dependencies and scripts
└── vite.config.ts              # Vite config with GitHub Pages base path
```
---

## 🎨 Customization Guide

1. General Config `(src/config.ts)`
Personalize names, text, and photos directly in `src/config.ts`. The Story Builder automatically pulls from here!

```bash
export const CONFIG = {
  HER_NAME: "Babe", 
  
  MESSAGE_TEXT: "Happy Birthday to my favorite person in the world! ...",
  
  PHOTOS: [
    {
      url: "[https://picsum.photos/seed/memory1/800/800](https://picsum.photos/seed/memory1/800/800)", // or local import /asset
      caption: "SO BYUTIPULL 🥰"
    }
  ]
};
```

2. Story Builder Colors `(src/components/storybuilder/constants.ts)`
Add new color themes to the design studio by adding to the STORY_COLORS array:

```bash
{ 
  id: 'matcha', 
  name: 'Matcha Green', 
  class: 'bg-[#e8f5e9]', 
  text: 'text-emerald-700' 
}
```

3. Adjusting Coupon Selection Limits `(src/components/LoveCoupons.tsx)`
Open `src/components/LoveCoupons.tsx` and modify the top configuration constant to change how many gifts she can claim:

```bash
const MAX_CHOICES = 2; // Change how many vouchers she can redeem
```