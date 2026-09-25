import React, { useState } from 'react';
import { Film, Coffee, Heart, Utensils, CheckCircle2, Gift } from 'lucide-react';


import img1 from './assets/1.jpeg';
import img2 from './assets/2.jpeg';
import img3 from './assets/3.jpeg';
import img4 from './assets/4.jpeg';
import img5 from './assets/5.jpeg';
import img6 from './assets/6.jpeg';
import img7 from './assets/7.jpeg';



const rawPhotos = [
  { url: img1, caption: "SO BYUTIPULL 🥰" },
  { url: img2, caption: "SO KYUTTTTT ☀️" },
  { url: img3, caption: "anjay harusnya best couple sih ini 🍦" },
  { url: img4, caption: "Ini salah satu foto favorit aku sihh wkwkw" },
  { url: img5, caption: "BIDADARI INI" },
  { url: img6, caption: "Cute couple 🍦" },
  { url: img7, caption: "GABISA BERKATA-KATA" }
];

const fallbackColors = ['bg-pink-300', 'bg-rose-300', 'bg-pink-400', 'bg-fuchsia-300', 'bg-rose-300', 'bg-pink-400', 'bg-fuchsia-300'];
const angles = [-2, 3, -1, 2, -3, 1,2, -3, 1];

export const CONFIG = {
  HER_NAME: "Hera",

  MUSIC_URL: `${import.meta.env.BASE_URL}music/birthday.mp3`,
  
  MESSAGE_TEXT: `Happy Birthday to my favorite person in the world! 
  Every day with you is an adventure, and I am so grateful for all the laughs, 
  the quiet moments, and the endless love we share. I hope your day is as 
  beautiful, sweet, and amazing as you are. Here's to many more birthdays 
  together! I love you! ❤️`,

  PHOTOS: rawPhotos.map((photo, index) => ({
    ...photo,
    id: index,
    fallback: fallbackColors[index % fallbackColors.length],
    angle: angles[index % angles.length]
  })),
  

  QUIZ_QUESTIONS: [
    {
      question: "Kita pertama kali ngedate dimana ??",
      options: ["Ciwalk", "Caffe pohon jati", "stasion kopi", "Pendopo coffe"],
      correctIndex: 1
    },
    {
      question: "Yang nembak pertama kali siapa ?",
      options: ["Hera", "Iqbal", "Ngomong nya barengan", "Ciko"],
      correctIndex: 0
    },
    {
      question: "Apa hal yang paling aku suka tentang kamu ?",
      options: ["Your smile", "Your terrible jokes", "Everything", "Your cooking"],
      correctIndex: 2
    },
    {
      question: "Kita kan waktu itu pernah nobar nah film pertama yang kita tonton apa ?",
      options: ["Daily Dose of Sunshine", "Obsession", "Project Hail Mary", "Shrek 2"],
      correctIndex: 0
    },
    {
      question: "Kita nanti bakal punya kucing berapa ??",
      options: ["1 Aja ah", "anjay 2", "4 kebanyakan sih", "1 shelter kucing kita punya"],
      correctIndex: 0
    }
  ],
  
  INITIAL_COUPONS: [
  { 
    id: 1, 
    title: "Kita Nonton Film kesukaan kamu", 
    desc: "You have 100% control over the movie and snacks. No complaints allowed from me!", 
    icon: Film 
  },
  { 
    id: 2, 
    title: "Makan makanan kesukaan kamuuu", 
    desc: "Your favorite food, coffee, and and every kind of snack you want.", 
    icon: Coffee 
  },
  { 
    id: 3, 
    title: "30-Minute Massage", 
    desc: "A full back and shoulder massage to melt away all your stress.", 
    icon: Heart 
  },
  { 
    id: 4, 
    title: "Free Dinner Date", 
    desc: "We go to any restaurant you want, no excuses (semoga uangnya ada ya).", 
    icon: Utensils 
  }
  ]
};