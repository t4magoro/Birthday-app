# 💖 Personalized Interactive Birthday Web App 💖
Dear my beloved girl  this is my first time learning front end web developement and i wish to present my first project to you, i hope you can see my effort later in the future, but for now this is all i can do, i hope in the future i can develop my skill even further and contribute my skill to the society, but for now, i present to you this project from all of my heart 

---

## Features

*   **Hero Section:** Randomized, hardware-accelerated (`translate3d`) falling rose-gold hearts background safe for mobile GPUs.
*   **Love Letter:** Styled heartfelt message card.
*   **Polaroid Photo Gallery:** Dynamic, staggered tilted polaroids (`-rotate-2`, `rotate-3`, etc.) with continuous mobile float and active touch scaling.
*   **Interactive Gatekeeper / Quiz:** Requires a 100% score to unlock birthday rewards (or customizable flow).
*   **Love Coupon Book:** Gated reward vouchers with a strict pick limit (`MAX_CHOICES`), custom stamp overlays upon selection (`CLAIMED`), and tactile mobile scaling (`active:scale-95`).
*   **Wishing Well:** Type-and-add multi-wish system with physics-driven "fly-away" animations sending wishes to the universe.
*   **Keepsake PDF Generator:** Native browser-print print-media stylesheet (`@media print` / `printColorAdjust: exact`) formatting claimed coupons and wishes into a formal, pink-bordered certificate.
*   **Mobile-First / Android Optimized:** Built with smooth CSS keyframes, GPU hints (`will-change`), and touch-responsive micro-interactions.

---

## Tech Stack

*   **Core:** React 18+, TypeScript (`.tsx`)
*   **Build Tool:** Vite (`@tailwindcss/vite`)
*   **Styling:** Tailwind CSS v4
*   **Icons:** `lucide-react`
*   **Containerization:** Docker & Docker Compose (Node 20)
*   **CI/CD & Hosting:** GitHub Actions & GitHub Pages

---

## Running via Docker

Open your project folder in your terminal:

```bash
cd "D:\my-Project\my--app"
```
build and start the container

```bash
docker-compose up --build
```

Open your browser and navigate to:

```bash
http://localhost:5173/
```

to close it when you are done

```bash
docker-compose down
```

---

## Project Structure

```text
Birthday-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD pipeline
├── src/
│   ├── assets/                 # Local images / media files
│   ├── components/
│   │   ├── Hero.tsx            # Falling hearts & greeting header
│   │   ├── KeepsakePDF.tsx     # Printable A4/Letter certificate template
│   │   ├── LoveCoupons.tsx     # Gated interactive reward vouchers
│   │   ├── Message.tsx         # Romantic letter card
│   │   ├── PhotoFrame.tsx      # Scattered polaroid gallery
│   │   └── Wishes.tsx          # Interactive wishing well + fly-away anim
│   ├── styles/
│   │   └── FallingHeartsStyle.tsx # GPU-accelerated keyframes for falling hearts
│   ├── App.tsx                 # Main layout & cross-component state lift
│   ├── config.ts               # Centralized text, names, and photo config
│   ├── index.css               # Tailwind v4 import & mobile GPU keyframes
│   └── main.tsx                # React DOM root entry
├── docker-compose.yml          # Docker service definition (Port 5173)
├── Dockerfile                  # Container build instructions
├── package.json                # Dependencies and scripts
└── vite.config.ts              # Vite config with GitHub Pages base path
```

---

## Customization Guide (src/config.ts)

Personalize names, text, and photos directly in :src/config.ts

```bash
export const CONFIG = {
  HER_NAME: "Babe", 
  
  MESSAGE_TEXT: "Happy Birthday to my favorite person in the world! ...",
  
  PHOTOS: [
    {
      url: "[https://picsum.photos/seed/memory1/800/800](https://picsum.photos/seed/memory1/800/800)", // or local import /asset
      caption: "SO BYUTIPULL 🥰"
    },
    {
      url: "[https://picsum.photos/seed/memory2/800/800](https://picsum.photos/seed/memory2/800/800)",
      caption: "SO KYUTTTTT ☀️"
    }
  ]
};
```

---

## Adjusting Coupon Selection Limits (src/components/LoveCoupons.tsx)

Open  and modify the top configuration constant:src/components/LoveCoupons.ts

```bash
const MAX_CHOICES = 2; // Change how many vouchers she can redeem
```








