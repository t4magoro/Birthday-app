import React from 'react';

export const FallingHeartsStyle = () => (
  <style>{`
    @keyframes fall {
      0% { transform: translate3d(0, -10vh, 0) rotate(0deg) scale(0.8); opacity: 1; }
      100% { transform: translate3d(0, 110vh, 0) rotate(360deg) scale(1.2); opacity: 0; }
    }
    .falling-heart {
      position: absolute;
      top: -10%;
      animation: fall linear forwards;
      color: #fb7185;
      z-index: 10;
      /* CRITICAL FOR ANDROID PERFORMANCE */
      will-change: transform;
      -webkit-transform-style: preserve-3d;
    }
  `}</style>
);