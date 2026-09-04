import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Sparkles, RefreshCw, Heart, Star, Award, Egg, Baby, Smile, Crown } from 'lucide-react';

// ==========================================
// 1. SOUND FX (Pure Web Audio API Synthesizer)
// Zero external sound files!
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Playful pop when tapping / selecting food
  pop() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Crunchy egg crack sound for the egg phase
  crack() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [0, 0.04, 0.08].forEach((offset, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + offset;

      osc.type = 'square';
      osc.frequency.setValueAtTime(600 + idx * 120, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.03);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.04);
    });
  }

  // Cute cartoon crunchy munching sequence (3 rapid crunchy bites)
  munch() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bites = [0, 0.12, 0.24];

    bites.forEach((offset, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + offset;

      osc.type = idx % 2 === 0 ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(440 - idx * 40, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.09);
    });
  }

  // Friendly, soft springy cartoon boing for an incorrect choice (zero penalty)
  boing() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.28);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  // Magical ascension sound when pet grows!
  grow() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.45);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Celebratory musical fanfare arpeggio (C E G C E)
  fanfare() {
    this.init();
    if (!this.ctx) return;
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.28);
    });
  }
}

const sfx = new SoundFX();

// ==========================================
// 2. VOICE SYNTHESIS HELPER
// ==========================================
function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.25; // Friendly higher cartoon tone
    utterance.rate = 0.9;   // Slower & clear for toddlers
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    );
    if (naturalVoice) utterance.voice = naturalVoice;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech error:', e);
  }
}

// ==========================================
// 3. GROWTH STAGES DEFINITION
// ==========================================
// Stage 0: Egg (0 to 2 feeds, hatches at 3)
// Stage 1: Baby Dino (3 to 6 feeds, grows to kid at 7)
// Stage 2: Playful Kid (7 to 10 feeds, matures to adult at 11)
// Stage 3: Full Adult Dragon (11+ feeds)
export const STAGES = [
  { id: 'egg', name: 'Magic Egg', icon: '🥚', minFeeds: 0, targetFeeds: 3, description: 'Feed the egg to help it crack and hatch!' },
  { id: 'baby', name: 'Baby Dino', icon: '🐣', minFeeds: 3, targetFeeds: 7, description: 'So tiny and hungry! Give baby lots of treats!' },
  { id: 'kid', name: 'Playful Kid', icon: '🦖', minFeeds: 7, targetFeeds: 11, description: 'Running and bouncing! Getting so big!' },
  { id: 'adult', name: 'Majestic Adult', icon: '👑', minFeeds: 11, targetFeeds: 15, description: 'Full grown magic creature! Proud of you!' },
];

export function getStageFromFeeds(feedCount) {
  if (feedCount < 3) return 0;
  if (feedCount < 7) return 1;
  if (feedCount < 11) return 2;
  return 3;
}

// ==========================================
// 4. GAME DATA & GENERATION
// ==========================================
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W'];

const SHAPES = [
  { id: 'star', name: 'Star' },
  { id: 'heart', name: 'Heart' },
  { id: 'circle', name: 'Circle' },
  { id: 'triangle', name: 'Triangle' },
  { id: 'square', name: 'Square' },
];

const COLORS = [
  { id: 'red', name: 'Red', fill: '#EF4444', text: 'text-red-500', border: 'border-red-400' },
  { id: 'blue', name: 'Blue', fill: '#3B82F6', text: 'text-blue-500', border: 'border-blue-400' },
  { id: 'green', name: 'Green', fill: '#10B981', text: 'text-emerald-500', border: 'border-emerald-400' },
  { id: 'yellow', name: 'Yellow', fill: '#F59E0B', text: 'text-amber-500', border: 'border-amber-400' },
  { id: 'purple', name: 'Purple', fill: '#8B5CF6', text: 'text-purple-500', border: 'border-purple-400' },
  { id: 'pink', name: 'Pink', fill: '#EC4899', text: 'text-pink-500', border: 'border-pink-400' },
];

const ACCESSORIES = [
  { id: 'party_hat', name: 'Party Hat', icon: '🎉' },
  { id: 'cool_sunglasses', name: 'Cool Sunglasses', icon: '🕶️' },
  { id: 'dapper_bowtie', name: 'Dapper Bowtie', icon: '🎀' },
  { id: 'golden_crown', name: 'Golden Crown', icon: '👑' },
  { id: 'flower_clip', name: 'Magic Flower', icon: '🌸' },
];

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRound(mode, stageIndex) {
  const stage = STAGES[stageIndex];
  const petSubject = stage.id === 'egg' ? 'the egg' : stage.id === 'baby' ? 'baby dino' : 'my pet';

  if (mode === 'phonics') {
    const letters = getRandomItems(LETTERS, 3);
    const target = letters[Math.floor(Math.random() * letters.length)];
    return {
      mode: 'phonics',
      targetLabel: `Letter ${target}`,
      spokenPrompt: `Feed ${petSubject} the letter ${target}!`,
      targetId: target,
      choices: letters.map((letter) => ({
        id: letter,
        label: letter,
        type: 'letter',
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })),
    };
  } else {
    const selectedColors = getRandomItems(COLORS, 3);
    const selectedShapes = getRandomItems(SHAPES, 3);
    const choices = [0, 1, 2].map((i) => ({
      id: `${selectedColors[i].id}_${selectedShapes[i].id}`,
      color: selectedColors[i],
      shape: selectedShapes[i],
      label: `${selectedColors[i].name} ${selectedShapes[i].name}`,
      type: 'shape',
    }));
    const targetChoice = choices[Math.floor(Math.random() * choices.length)];
    return {
      mode: 'shapes',
      targetLabel: targetChoice.label,
      spokenPrompt: `Feed ${petSubject} the ${targetChoice.color.name} ${targetChoice.shape.name}!`,
      targetId: targetChoice.id,
      choices: choices.sort(() => 0.5 - Math.random()),
    };
  }
}

// ==========================================
// 5. ANIMATED PET SVG (WITH 4 EVOLUTION STAGES)
// ==========================================
function PetAvatar({ stageIndex, feedCount, expression, accessories, isNearFood }) {
  const mouthOpen = isNearFood || expression === 'hungry';
  const isChewing = expression === 'chewing';
  const isHappy = expression === 'happy';

  // ------------------------------------------
  // STAGE 0: THE MAGIC EGG 🥚
  // ------------------------------------------
  if (stageIndex === 0) {
    const crackLevel = feedCount; // 0, 1, or 2
    return (
      <div className="relative w-48 h-56 flex items-center justify-center select-none">
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 opacity-60 ${
            isNearFood ? 'bg-amber-300 scale-110' : 'bg-purple-300 scale-95'
          }`}
        />
        <svg
          viewBox="0 0 200 240"
          className={`w-full h-full relative z-10 drop-shadow-2xl transition-transform duration-300 ${
            isNearFood ? 'animate-bounce' : isChewing ? 'animate-chew' : 'animate-float'
          }`}
        >
          <defs>
            <linearGradient id="eggGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#7E22CE" />
            </linearGradient>
            <radialGradient id="eggSpot">
              <stop offset="0%" stopColor="#FDE047" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Soft Egg Shadow */}
          <ellipse cx="100" cy="215" rx="45" ry="12" fill="#4C1D95" opacity="0.3" />

          {/* Magic Egg Shell */}
          <path
            d="M 100 20 C 150 20, 175 90, 175 160 C 175 205, 145 220, 100 220 C 55 220, 25 205, 25 160 C 25 90, 50 20, 100 20 Z"
            fill="url(#eggGrad)"
            stroke="#581C87"
            strokeWidth="4"
          />

          {/* Pretty Magic Spots */}
          <circle cx="65" cy="85" r="14" fill="url(#eggSpot)" />
          <circle cx="135" cy="70" r="10" fill="url(#eggSpot)" />
          <circle cx="140" cy="140" r="18" fill="url(#eggSpot)" />
          <circle cx="60" cy="155" r="12" fill="url(#eggSpot)" />
          <circle cx="100" cy="115" r="16" fill="url(#eggSpot)" />

          {/* Cute Eyes peeking through or painted on egg */}
          <g>
            <circle cx="80" cy="115" r="7" fill="#FFFFFF" />
            <circle cx="81" cy="115" r="4.5" fill="#3B0764" />
            <circle cx="79" cy="113" r="2" fill="#FFFFFF" />

            <circle cx="120" cy="115" r="7" fill="#FFFFFF" />
            <circle cx="119" cy="115" r="4.5" fill="#3B0764" />
            <circle cx="117" cy="113" r="2" fill="#FFFFFF" />

            {/* Rosy Egg Cheeks */}
            <ellipse cx="68" cy="125" rx="6" ry="3.5" fill="#F472B6" opacity="0.8" />
            <ellipse cx="132" cy="125" rx="6" ry="3.5" fill="#F472B6" opacity="0.8" />
          </g>

          {/* Cracks appearing as egg is fed! */}
          {crackLevel >= 1 && (
            <path
              d="M 100 20 L 95 45 L 110 65 L 90 85"
              stroke="#FEF08A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="animate-pulse"
            />
          )}
          {crackLevel >= 2 && (
            <path
              d="M 175 160 L 145 150 L 155 130 L 130 120"
              stroke="#FEF08A"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="animate-pulse"
            />
          )}

          {/* Magic Stars on Egg */}
          <polygon points="100,55 103,62 110,63 105,68 106,75 100,71 94,75 95,68 90,63 97,62" fill="#FEF08A" />
        </svg>
      </div>
    );
  }

  // ------------------------------------------
  // STAGE 1: BABY DINO 🐣 (scale ~0.8)
  // ------------------------------------------
  if (stageIndex === 1) {
    return (
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center select-none scale-90 transition-transform duration-500">
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 opacity-60 ${
            isHappy ? 'bg-amber-200 scale-110' : mouthOpen ? 'bg-rose-200 scale-105' : 'bg-emerald-200 scale-95'
          }`}
        />
        <svg
          viewBox="0 0 240 240"
          className={`w-full h-full relative z-10 drop-shadow-xl transition-transform duration-300 ${
            isChewing ? 'animate-chew' : isHappy ? 'animate-bounce' : 'animate-float'
          }`}
        >
          <defs>
            <linearGradient id="babyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="60%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="bibGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBCFE8" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
          </defs>

          {/* Baby Feet */}
          <ellipse cx="90" cy="205" rx="18" ry="12" fill="#047857" />
          <ellipse cx="150" cy="205" rx="18" ry="12" fill="#047857" />

          {/* Tiny Baby Monster Body */}
          <path
            d="M 120 45 C 170 45, 195 85, 195 140 C 195 195, 165 210, 120 210 C 75 210, 45 195, 45 140 C 45 85, 70 45, 120 45 Z"
            fill="url(#babyGrad)"
          />

          {/* Tiny Baby Horns */}
          <path d="M 80 58 Q 65 35 74 30 Q 88 38 90 52 Z" fill="#FDE047" />
          <path d="M 160 58 Q 175 35 166 30 Q 152 38 150 52 Z" fill="#FDE047" />

          {/* Baby Bib with heart */}
          <path d="M 85 140 C 85 140, 120 180, 155 140 L 145 125 L 95 125 Z" fill="url(#bibGrad)" stroke="#DB2777" strokeWidth="2" />
          <circle cx="120" cy="150" r="4" fill="#FFFFFF" />

          {/* Rosy Baby Cheeks */}
          <circle cx="70" cy="125" r="13" fill="#F472B6" opacity="0.75" />
          <circle cx="170" cy="125" r="13" fill="#F472B6" opacity="0.75" />

          {/* Giant Sparkly Baby Eyes */}
          {isHappy ? (
            <g stroke="#064E3B" strokeWidth="5" strokeLinecap="round" fill="none">
              <path d="M 75 105 Q 88 92 100 105" />
              <path d="M 140 105 Q 152 92 165 105" />
            </g>
          ) : (
            <g>
              <circle cx="88" cy="100" r={mouthOpen ? 18 : 16} fill="#FFFFFF" />
              <circle cx="90" cy="100" r="11" fill="#064E3B" />
              <circle cx="86" cy="95" r="5" fill="#FFFFFF" />
              <circle cx="93" cy="103" r="2.5" fill="#FFFFFF" />

              <circle cx="152" cy="100" r={mouthOpen ? 18 : 16} fill="#FFFFFF" />
              <circle cx="150" cy="100" r="11" fill="#064E3B" />
              <circle cx="146" cy="95" r="5" fill="#FFFFFF" />
              <circle cx="153" cy="103" r="2.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Baby Mouth */}
          {mouthOpen ? (
            <g>
              <path d="M 98 122 C 98 122, 120 115, 142 122 C 146 150, 94 150, 98 122 Z" fill="#881337" stroke="#064E3B" strokeWidth="3" />
              <ellipse cx="120" cy="140" rx="13" ry="7" fill="#FB7185" />
              <rect x="116" y="120" width="8" height="5" rx="2" fill="#FFFFFF" />
            </g>
          ) : isChewing ? (
            <path d="M 106 128 Q 120 142 134 128 Q 120 134 106 128 Z" fill="#881337" stroke="#064E3B" strokeWidth="3" />
          ) : (
            <path d="M 105 125 Q 120 138 135 125" fill="none" stroke="#064E3B" strokeWidth="3.5" strokeLinecap="round" />
          )}

          {/* Baby pacifier clip or small flower */}
          {accessories.includes('flower_clip') && (
            <g transform="translate(68, 55)">
              <circle cx="-6" cy="0" r="6" fill="#F472B6" />
              <circle cx="6" cy="0" r="6" fill="#F472B6" />
              <circle cx="0" cy="-6" r="6" fill="#F472B6" />
              <circle cx="0" cy="6" r="6" fill="#F472B6" />
              <circle cx="0" cy="0" r="5" fill="#FBBF24" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  // ------------------------------------------
  // STAGE 2: PLAYFUL KID 🦖 (scale 1.0)
  // ------------------------------------------
  if (stageIndex === 2) {
    return (
      <div className="relative w-56 h-56 sm:w-60 sm:h-60 flex items-center justify-center select-none scale-100 transition-transform duration-500">
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 opacity-60 ${
            isHappy ? 'bg-amber-300 scale-110' : mouthOpen ? 'bg-rose-300 scale-105' : 'bg-emerald-200 scale-95'
          }`}
        />
        <svg
          viewBox="0 0 240 240"
          className={`w-full h-full relative z-10 drop-shadow-xl transition-transform duration-300 ${
            isChewing ? 'animate-chew' : isHappy ? 'animate-bounce' : 'animate-float'
          }`}
        >
          <defs>
            <linearGradient id="kidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="kidTummy" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="100%" stopColor="#6EE7B7" />
            </linearGradient>
          </defs>

          {/* Feet */}
          <ellipse cx="80" cy="205" rx="22" ry="14" fill="#047857" />
          <ellipse cx="160" cy="205" rx="22" ry="14" fill="#047857" />

          {/* Playful Monster Body */}
          <path
            d="M 120 30 C 180 30, 210 75, 210 135 C 210 195, 175 210, 120 210 C 65 210, 30 195, 30 135 C 30 75, 60 30, 120 30 Z"
            fill="url(#kidGrad)"
          />

          {/* Horns */}
          <path d="M 65 52 Q 40 20 52 14 Q 72 26 78 44 Z" fill="#FBBF24" />
          <path d="M 175 52 Q 200 20 188 14 Q 168 26 162 44 Z" fill="#FBBF24" />

          {/* Tummy */}
          <ellipse cx="120" cy="155" rx="54" ry="42" fill="url(#kidTummy)" opacity="0.9" />

          {/* Cheeks */}
          <circle cx="62" cy="130" r="14" fill="#F472B6" opacity="0.75" />
          <circle cx="178" cy="130" r="14" fill="#F472B6" opacity="0.75" />

          {/* Eyes */}
          {isHappy ? (
            <g stroke="#064E3B" strokeWidth="5" strokeLinecap="round" fill="none">
              <path d="M 70 102 Q 85 88 100 102" />
              <path d="M 140 102 Q 155 88 170 102" />
            </g>
          ) : (
            <g>
              <circle cx="85" cy="100" r={mouthOpen ? 17 : 15} fill="#FFFFFF" />
              <circle cx="87" cy="100" r="10" fill="#064E3B" />
              <circle cx="83" cy="96" r="4.5" fill="#FFFFFF" />
              <circle cx="91" cy="103" r="2" fill="#FFFFFF" />

              <circle cx="155" cy="100" r={mouthOpen ? 17 : 15} fill="#FFFFFF" />
              <circle cx="153" cy="100" r="10" fill="#064E3B" />
              <circle cx="149" cy="96" r="4.5" fill="#FFFFFF" />
              <circle cx="157" cy="103" r="2" fill="#FFFFFF" />
            </g>
          )}

          {/* Mouth */}
          {mouthOpen ? (
            <g>
              <path d="M 92 125 C 92 125, 120 118, 148 125 C 152 158, 88 158, 92 125 Z" fill="#881337" stroke="#064E3B" strokeWidth="3.5" />
              <ellipse cx="120" cy="148" rx="16" ry="9" fill="#FB7185" />
              <rect x="108" y="122" width="7" height="6" rx="2.5" fill="#FFFFFF" />
              <rect x="125" y="122" width="7" height="6" rx="2.5" fill="#FFFFFF" />
            </g>
          ) : isChewing ? (
            <path d="M 102 132 Q 120 148 138 132 Q 120 138 102 132 Z" fill="#881337" stroke="#064E3B" strokeWidth="3.5" />
          ) : (
            <path d="M 100 130 Q 120 146 140 130" fill="none" stroke="#064E3B" strokeWidth="4" strokeLinecap="round" />
          )}

          {/* Accessories */}
          {accessories.includes('party_hat') && (
            <g className="animate-pulse-glow origin-bottom">
              <polygon points="120,4 88,48 152,48" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
              <polygon points="120,4 98,34 142,34" fill="#FBBF24" opacity="0.8" />
              <polygon points="120,4 108,18 132,18" fill="#3B82F6" opacity="0.8" />
              <circle cx="120" cy="4" r="9" fill="#FDE047" />
            </g>
          )}

          {accessories.includes('cool_sunglasses') && (
            <g>
              <path d="M 66 100 Q 88 100 98 102 Q 120 95 142 102 Q 152 100 174 100" stroke="#1E293B" strokeWidth="3" fill="none" />
              <rect x="68" y="90" width="38" height="22" rx="7" fill="#1E293B" />
              <rect x="134" y="90" width="38" height="22" rx="7" fill="#1E293B" />
              <line x1="72" y1="94" x2="88" y2="108" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="138" y1="94" x2="154" y2="108" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {accessories.includes('dapper_bowtie') && (
            <g transform="translate(120, 192)">
              <polygon points="0,0 -24,-12 -24,12" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
              <polygon points="0,0 24,-12 24,12" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
              <circle cx="0" cy="0" r="7" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  // ------------------------------------------
  // STAGE 3: MAJESTIC FULL ADULT DRAGON 🦕👑 (scale 1.18)
  // ------------------------------------------
  return (
    <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center select-none scale-105 sm:scale-110 transition-transform duration-500">
      {/* Majestic Golden Sparkle Aura */}
      <div className="absolute inset-0 rounded-full blur-3xl bg-gradient-to-tr from-amber-300 via-emerald-300 to-sky-300 opacity-70 animate-pulse" />

      <svg
        viewBox="0 0 260 260"
        className={`w-full h-full relative z-10 drop-shadow-2xl transition-transform duration-300 ${
          isChewing ? 'animate-chew' : isHappy ? 'animate-bounce' : 'animate-float'
        }`}
      >
        <defs>
          <linearGradient id="adultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="40%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="adultTummy" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>
        </defs>

        {/* Majestic Golden Dragon Wings */}
        <g className="animate-pulse">
          {/* Left Wing */}
          <path d="M 50 110 Q 5 70 20 30 Q 50 60 70 95 Z" fill="url(#wingGrad)" opacity="0.95" stroke="#B45309" strokeWidth="2.5" />
          {/* Right Wing */}
          <path d="M 210 110 Q 255 70 240 30 Q 210 60 190 95 Z" fill="url(#wingGrad)" opacity="0.95" stroke="#B45309" strokeWidth="2.5" />
        </g>

        {/* Feet */}
        <ellipse cx="90" cy="225" rx="26" ry="16" fill="#064E3B" />
        <ellipse cx="170" cy="225" rx="26" ry="16" fill="#064E3B" />

        {/* Adult Body */}
        <path
          d="M 130 35 C 195 35, 225 80, 225 145 C 225 210, 190 230, 130 230 C 70 230, 35 210, 35 145 C 35 80, 65 35, 130 35 Z"
          fill="url(#adultGrad)"
          stroke="#064E3B"
          strokeWidth="3.5"
        />

        {/* Majestic Golden Horns */}
        <path d="M 75 55 Q 35 15 50 8 Q 80 22 88 45 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
        <path d="M 185 55 Q 225 15 210 8 Q 180 22 172 45 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />

        {/* Golden Dragon Scales Tummy */}
        <ellipse cx="130" cy="165" rx="58" ry="46" fill="url(#adultTummy)" opacity="0.95" />
        {/* Scale ridges */}
        <path d="M 105 145 Q 130 155 155 145" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 100 165 Q 130 175 160 165" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 110 185 Q 130 195 150 185" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Cheeks */}
        <circle cx="70" cy="138" r="16" fill="#F472B6" opacity="0.8" />
        <circle cx="190" cy="138" r="16" fill="#F472B6" opacity="0.8" />

        {/* Eyes */}
        {isHappy ? (
          <g stroke="#064E3B" strokeWidth="6" strokeLinecap="round" fill="none">
            <path d="M 80 110 Q 95 95 110 110" />
            <path d="M 150 110 Q 165 95 180 110" />
          </g>
        ) : (
          <g>
            <circle cx="95" cy="108" r={mouthOpen ? 18 : 16} fill="#FFFFFF" />
            <circle cx="97" cy="108" r="11" fill="#064E3B" />
            <circle cx="93" cy="104" r="5" fill="#FFFFFF" />
            <circle cx="101" cy="111" r="2.5" fill="#FFFFFF" />

            <circle cx="165" cy="108" r={mouthOpen ? 18 : 16} fill="#FFFFFF" />
            <circle cx="163" cy="108" r="11" fill="#064E3B" />
            <circle cx="159" cy="104" r="5" fill="#FFFFFF" />
            <circle cx="167" cy="111" r="2.5" fill="#FFFFFF" />
          </g>
        )}

        {/* Mouth */}
        {mouthOpen ? (
          <g>
            <path d="M 102 135 C 102 135, 130 128, 158 135 C 162 170, 98 170, 102 135 Z" fill="#881337" stroke="#064E3B" strokeWidth="4" />
            <ellipse cx="130" cy="158" rx="18" ry="10" fill="#FB7185" />
            <rect x="117" y="132" width="8" height="7" rx="3" fill="#FFFFFF" />
            <rect x="135" y="132" width="8" height="7" rx="3" fill="#FFFFFF" />
          </g>
        ) : isChewing ? (
          <path d="M 112 142 Q 130 158 148 142 Q 130 148 112 142 Z" fill="#881337" stroke="#064E3B" strokeWidth="4" />
        ) : (
          <path d="M 108 140 Q 130 156 152 140" fill="none" stroke="#064E3B" strokeWidth="4.5" strokeLinecap="round" />
        )}

        {/* Royal Crown or Accessories */}
        {accessories.includes('golden_crown') || stageIndex === 3 ? (
          <g transform="translate(95, 12)">
            <polygon points="0,32 10,8 25,24 40,4 55,24 70,8 80,32" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
            <circle cx="10" cy="7" r="4" fill="#EF4444" />
            <circle cx="40" cy="3" r="5" fill="#3B82F6" />
            <circle cx="70" cy="7" r="4" fill="#10B981" />
          </g>
        ) : null}

        {accessories.includes('cool_sunglasses') && (
          <g transform="translate(10, 8)">
            <path d="M 66 100 Q 88 100 98 102 Q 120 95 142 102 Q 152 100 174 100" stroke="#1E293B" strokeWidth="3.5" fill="none" />
            <rect x="68" y="90" width="40" height="24" rx="8" fill="#1E293B" />
            <rect x="134" y="90" width="40" height="24" rx="8" fill="#1E293B" />
            <line x1="72" y1="94" x2="90" y2="110" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <line x1="138" y1="94" x2="156" y2="110" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {accessories.includes('dapper_bowtie') && (
          <g transform="translate(130, 212)">
            <polygon points="0,0 -26,-14 -26,14" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
            <polygon points="0,0 26,-14 26,14" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="8" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
}

// ==========================================
// 6. SHAPES RENDERER
// ==========================================
function ShapeIcon({ shape, color, size = 56 }) {
  const fill = color.fill;
  switch (shape.id) {
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className="drop-shadow-md">
          <polygon points="12,2 15,8.5 22,9.3 17,14 18.5,21 12,17.3 5.5,21 7,14 2,9.3 9,8.5" />
        </svg>
      );
    case 'heart':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className="drop-shadow-md">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className="drop-shadow-md">
          <polygon points="12,3 22,21 2,21" />
        </svg>
      );
    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className="drop-shadow-md">
          <rect x="3" y="3" width="18" height="18" rx="4" />
        </svg>
      );
    case 'circle':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className="drop-shadow-md">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

// ==========================================
// 7. CELEBRATION PARTICLES (HTML5 Canvas)
// ==========================================
function ConfettiCanvas({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'];
    const particles = Array.from({ length: 50 }, () => ({
      x: canvas.width / 2,
      y: canvas.height * 0.45,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.9) * 16,
      size: Math.random() * 12 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      alpha: 1,
      shape: Math.random() > 0.4 ? 'star' : 'circle',
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rotation += p.vRot;
        p.alpha -= 0.015;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.shape === 'star') {
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
              ctx.lineTo(
                Math.cos(((18 + i * 72) * Math.PI) / 180) * p.size,
                -Math.sin(((18 + i * 72) * Math.PI) / 180) * p.size
              );
              ctx.lineTo(
                Math.cos(((54 + i * 72) * Math.PI) / 180) * (p.size / 2),
                -Math.sin(((54 + i * 72) * Math.PI) / 180) * (p.size / 2)
              );
            }
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
}

// ==========================================
// 8. MAIN MAGIC PET FEEDER COMPONENT
// ==========================================
export default function MagicPetFeeder() {
  const [currentMode, setCurrentMode] = useState('phonics'); // 'phonics' | 'shapes'
  const [feedCount, setFeedCount] = useState(0); // tracks lifetime feeds for growth!
  const [stageIndex, setStageIndex] = useState(0); // 0: egg, 1: baby, 2: kid, 3: adult
  const [round, setRound] = useState(() => generateRound('phonics', 0));
  const [unlockedAccessories, setUnlockedAccessories] = useState([]);

  // Modals
  const [evolutionModal, setEvolutionModal] = useState(null);
  const [accessoryModal, setAccessoryModal] = useState(null);

  // States
  const [petExpression, setPetExpression] = useState('idle'); // 'idle' | 'hungry' | 'chewing' | 'happy'
  const [isNearPet, setIsNearPet] = useState(false);
  const [wobbleId, setWobbleId] = useState(null);
  const [flyingFoodId, setFlyingFoodId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Touch / Drag States
  const [draggingItem, setDraggingItem] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const petZoneRef = useRef(null);

  // Read prompt on round change
  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(round.spokenPrompt);
    }, 450);
    return () => clearTimeout(timer);
  }, [round]);

  // Toddler-forgiving collision detection
  const checkCollisionWithPet = useCallback((x, y) => {
    if (!petZoneRef.current) return false;
    const rect = petZoneRef.current.getBoundingClientRect();
    const margin = 45; // generous tolerance for toddler fingers
    return (
      x >= rect.left - margin &&
      x <= rect.right + margin &&
      y >= rect.top - margin &&
      y <= rect.bottom + margin
    );
  }, []);

  // Positive Reinforcement: Correct Snack Fed
  const handleSuccessfulFeed = useCallback(
    (choice) => {
      setFlyingFoodId(choice.id);
      setPetExpression('chewing');

      // If in egg stage, play egg crack sound! Otherwise play munch crunch
      if (stageIndex === 0) {
        sfx.crack();
      } else {
        sfx.munch();
      }

      // Confetti burst
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1400);

      // Increment total feeds & check for evolution
      const newFeedCount = feedCount + 1;
      const newStageIndex = getStageFromFeeds(newFeedCount);
      setFeedCount(newFeedCount);

      // Evolution Milestone Reached!
      if (newStageIndex > stageIndex) {
        setStageIndex(newStageIndex);
        const nextStageObj = STAGES[newStageIndex];

        setTimeout(() => {
          sfx.grow();
          sfx.fanfare();
          setEvolutionModal(nextStageObj);
          if (newStageIndex === 1) {
            speakText('WOW! The egg hatched! Welcome baby dino!');
          } else if (newStageIndex === 2) {
            speakText('Hooray! Your pet grew into a playful kid!');
          } else {
            speakText('AMAZING! Your pet is now a full grown majestic dragon!');
          }
        }, 800);
      } else {
        // Cheerful praise
        const praises =
          stageIndex === 0
            ? ['Crack crack!', 'The egg loves it!', 'Keep going!', 'Almost hatching!']
            : ['Yum yum yum!', 'So yummy!', 'Delicious!', 'Super job!', 'Nom nom nom!'];
        const randomPraise = praises[Math.floor(Math.random() * praises.length)];
        setTimeout(() => speakText(randomPraise), 300);

        // Every 4 feeds unlock silly accessory
        if (newFeedCount % 4 === 0) {
          const remaining = ACCESSORIES.filter((acc) => !unlockedAccessories.includes(acc.id));
          const accessoryToUnlock =
            remaining.length > 0
              ? remaining[0]
              : ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)];

          setTimeout(() => {
            setUnlockedAccessories((accs) =>
              accs.includes(accessoryToUnlock.id) ? accs : [...accs, accessoryToUnlock.id]
            );
            setAccessoryModal(accessoryToUnlock);
            sfx.fanfare();
            speakText(`Yay! You unlocked the silly ${accessoryToUnlock.name}!`);
          }, 1100);
        }
      }

      // Advance to next prompt smoothly after 1.5s
      setTimeout(() => {
        setPetExpression('happy');
        setTimeout(() => {
          setFlyingFoodId(null);
          setPetExpression('idle');
          const nextMode = currentMode === 'phonics' ? 'shapes' : 'phonics';
          setCurrentMode(nextMode);
          setRound(generateRound(nextMode, newStageIndex));
        }, 700);
      }, 900);
    },
    [currentMode, feedCount, stageIndex, unlockedAccessories]
  );

  // Positive Reinforcement: Incorrect Snack (Zero penalty, soft wobble, playful giggle)
  const handleGentleMiss = useCallback(
    (choice) => {
      sfx.boing();
      setWobbleId(choice.id);
      setTimeout(() => setWobbleId(null), 650);

      const softReminders = [
        `Oopsie! Let's find ${round.targetLabel}!`,
        `Hehe, that tickles! Try ${round.targetLabel}!`,
        `Almost! Can you find ${round.targetLabel}?`,
      ];
      speakText(softReminders[Math.floor(Math.random() * softReminders.length)]);
    },
    [round]
  );

  // Pointer Drag Handlers
  const handlePointerDown = (choice, e) => {
    if (!e.isPrimary) return;
    sfx.pop();
    const touch = e.touches ? e.touches[0] : e;
    setDraggingItem(choice);
    setDragPos({ x: touch.clientX, y: touch.clientY });
    setPetExpression('hungry');
  };

  const handlePointerMove = (e) => {
    if (!draggingItem) return;
    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX;
    const y = touch.clientY;
    setDragPos({ x, y });
    setIsNearPet(checkCollisionWithPet(x, y));
  };

  const handlePointerUp = (e) => {
    if (!draggingItem) return;
    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const x = touch.clientX;
    const y = touch.clientY;

    const fed = checkCollisionWithPet(x, y);
    setIsNearPet(false);

    if (fed) {
      if (draggingItem.id === round.targetId) {
        handleSuccessfulFeed(draggingItem);
      } else {
        setPetExpression('idle');
        handleGentleMiss(draggingItem);
      }
    } else {
      setPetExpression('idle');
    }

    setDraggingItem(null);
  };

  // Direct Tap-to-Feed mechanic
  const handleDirectTap = (choice) => {
    if (draggingItem || flyingFoodId) return;
    sfx.pop();
    if (choice.id === round.targetId) {
      handleSuccessfulFeed(choice);
    } else {
      handleGentleMiss(choice);
    }
  };

  // Current stage progress percentage
  const currentStage = STAGES[stageIndex];
  const nextMilestone = currentStage.targetFeeds;
  const prevMilestone = currentStage.minFeeds;
  const stageProgress = Math.min(
    100,
    Math.round(((feedCount - prevMilestone) / (nextMilestone - prevMilestone)) * 100)
  );

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full min-h-screen bg-gradient-to-b from-sky-300 via-indigo-100 to-pink-200 flex flex-col justify-between items-center p-3 sm:p-5 select-none overflow-hidden"
      style={{ touchAction: 'manipulation' }}
    >
      <ConfettiCanvas active={showConfetti} />

      {/* ------------------------------------ */}
      {/* HEADER: PET GROWTH & EVOLUTION BAR    */}
      {/* ------------------------------------ */}
      <header className="w-full max-w-md flex flex-col items-center gap-2 pt-2 z-20">
        {/* Top title and mode switcher */}
        <div className="w-full flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-3 py-1 rounded-full shadow-md border-2 border-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span className="font-black text-emerald-800 text-xs sm:text-sm tracking-wide uppercase">
              Magic Pet Feeder
            </span>
          </div>

          <button
            onClick={() => {
              sfx.pop();
              const nextMode = currentMode === 'phonics' ? 'shapes' : 'phonics';
              setCurrentMode(nextMode);
              setRound(generateRound(nextMode, stageIndex));
            }}
            className="flex items-center gap-1.5 bg-white/85 active:scale-95 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-md border-2 border-indigo-200 transition-transform"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{currentMode === 'phonics' ? '🔤 Letters' : '🎨 Shapes'}</span>
          </button>
        </div>

        {/* Visual Pet Growth Timeline Bar (Egg -> Baby -> Kid -> Adult) */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border-2 border-purple-300 flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1">
              <span className="text-base">{currentStage.icon}</span>
              <span className="text-xs font-black text-purple-900 uppercase tracking-wider">
                STAGE: {currentStage.name}
              </span>
            </div>
            <span className="text-[11px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
              Feeds: {feedCount}
            </span>
          </div>

          {/* 4 Evolution Icons Indicator */}
          <div className="flex items-center justify-between px-2 pt-0.5">
            {STAGES.map((st, idx) => {
              const isCurrent = stageIndex === idx;
              const isPassed = stageIndex > idx;
              return (
                <div key={st.id} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base transition-all duration-300 ${
                      isCurrent
                        ? 'bg-amber-400 text-white ring-4 ring-amber-200 scale-110 shadow-md'
                        : isPassed
                        ? 'bg-emerald-500 text-white scale-95'
                        : 'bg-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    {st.icon}
                  </div>
                  <span className="text-[9px] font-bold text-slate-600 mt-0.5">{st.name.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>

          {/* Growth Progress Bar to next stage */}
          <div className="w-full bg-purple-100 h-2.5 rounded-full overflow-hidden border border-purple-200 mt-0.5">
            <div
              className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 transition-all duration-500 rounded-full"
              style={{ width: `${stageIndex === 3 ? 100 : stageProgress}%` }}
            />
          </div>
        </div>
      </header>

      {/* ------------------------------------ */}
      {/* TARGET PROMPT BANNER                 */}
      {/* ------------------------------------ */}
      <section className="w-full max-w-md my-1 z-20">
        <div className="bg-white/95 rounded-3xl p-3.5 shadow-xl border-4 border-amber-400 flex items-center justify-between gap-2">
          <div className="flex-1 text-left">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              {stageIndex === 0 ? 'Help The Egg Hatch:' : `Feed ${currentStage.name}:`}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>{round.targetLabel}</span>
              <span className="text-2xl animate-pulse">{stageIndex === 0 ? '✨' : '😋'}</span>
            </h1>
          </div>

          <button
            onClick={() => {
              sfx.pop();
              speakText(round.spokenPrompt);
            }}
            aria-label="Repeat Prompt"
            className="w-13 h-13 p-3 bg-gradient-to-tr from-amber-400 to-yellow-300 active:scale-90 hover:scale-105 rounded-2xl shadow-lg border-2 border-amber-500 flex items-center justify-center text-amber-900 transition-transform"
          >
            <Volume2 className="w-7 h-7" />
          </button>
        </div>
      </section>

      {/* ------------------------------------ */}
      {/* PET DROP ZONE & EVOLUTION GRAPHIC    */}
      {/* ------------------------------------ */}
      <main ref={petZoneRef} className="relative my-auto flex flex-col items-center justify-center z-10">
        <PetAvatar
          stageIndex={stageIndex}
          feedCount={feedCount}
          expression={petExpression}
          accessories={unlockedAccessories}
          isNearFood={isNearPet}
        />

        <div
          className={`absolute -bottom-3 px-4 py-1.5 rounded-full text-xs font-black transition-all duration-300 shadow-md ${
            isNearPet
              ? 'bg-rose-500 text-white scale-110 ring-4 ring-rose-300 animate-bounce'
              : 'bg-emerald-600/85 text-white backdrop-blur-sm'
          }`}
        >
          {isNearPet
            ? stageIndex === 0 ? 'FEED THE EGG! 🥚' : 'DROP IN MOUTH! 👅'
            : stageIndex === 0 ? 'TAP OR DRAG FOOD TO HATCH! 🐣' : 'DRAG FOOD HERE OR TAP! 🍓'}
        </div>
      </main>

      {/* ------------------------------------ */}
      {/* CHOICES: LARGE 88px+ TOUCH BUBBLES   */}
      {/* ------------------------------------ */}
      <footer className="w-full max-w-md pb-3 pt-1 z-20">
        <div className="flex justify-around items-center gap-2 px-1">
          {round.choices.map((choice) => {
            const isWobbling = wobbleId === choice.id;
            const isBeingDragged = draggingItem?.id === choice.id;
            const isFlying = flyingFoodId === choice.id;

            return (
              <div
                key={choice.id}
                onPointerDown={(e) => handlePointerDown(choice, e)}
                onClick={() => handleDirectTap(choice)}
                style={{ touchAction: 'none' }}
                className={`
                  relative flex flex-col items-center justify-center
                  w-24 h-24 sm:w-28 sm:h-28 rounded-3xl
                  cursor-grab active:cursor-grabbing select-none
                  shadow-xl border-4 transition-all duration-200
                  ${choice.color?.border || 'border-indigo-300'}
                  ${isWobbling ? 'animate-wobble bg-rose-50 border-rose-400' : 'bg-white hover:scale-105 active:scale-95'}
                  ${isBeingDragged ? 'opacity-30 scale-90' : 'opacity-100'}
                  ${isFlying ? 'scale-0 translate-y-[-180px] transition-transform duration-700 ease-in' : ''}
                `}
              >
                <div className="absolute top-2 left-3 w-4 h-2 bg-white/70 rounded-full rotate-[-20deg]" />

                {choice.type === 'letter' ? (
                  <div className="flex flex-col items-center justify-center">
                    <span className={`text-4xl sm:text-5xl font-black ${choice.color?.text || 'text-indigo-600'}`}>
                      {choice.label}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      Cookie
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <ShapeIcon shape={choice.shape} color={choice.color} size={48} />
                    <span className="text-[10px] font-extrabold text-slate-600 capitalize mt-1 text-center leading-tight">
                      {choice.color.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </footer>

      {/* ------------------------------------ */}
      {/* DRAG POINTER CLONE                   */}
      {/* ------------------------------------ */}
      {draggingItem && (
        <div
          style={{
            position: 'fixed',
            left: `${dragPos.x}px`,
            top: `${dragPos.y}px`,
            transform: 'translate(-50%, -50%) scale(1.15)',
            touchAction: 'none',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          className={`w-24 h-24 rounded-3xl bg-white/95 shadow-2xl border-4 ${
            draggingItem.color?.border || 'border-amber-400'
          } flex flex-col items-center justify-center`}
        >
          {draggingItem.type === 'letter' ? (
            <span className={`text-5xl font-black ${draggingItem.color?.text || 'text-indigo-600'}`}>
              {draggingItem.label}
            </span>
          ) : (
            <ShapeIcon shape={draggingItem.shape} color={draggingItem.color} size={50} />
          )}
        </div>
      )}

      {/* ------------------------------------ */}
      {/* EVOLUTION CELEBRATION MODAL 🌟       */}
      {/* ------------------------------------ */}
      {evolutionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl border-4 border-amber-400 animate-fly-in flex flex-col items-center">
            <span className="text-7xl my-2 animate-bounce">{evolutionModal.icon}</span>
            <span className="text-xs font-black text-purple-600 uppercase tracking-widest">
              🌟 MAGIC EVOLUTION! 🌟
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1 mb-2">
              {evolutionModal.name}!
            </h2>
            <p className="text-sm font-semibold text-slate-600 mb-6">
              {evolutionModal.description}
            </p>

            <button
              onClick={() => {
                sfx.pop();
                setEvolutionModal(null);
                setRound(generateRound(currentMode, stageIndex));
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white font-black text-lg shadow-lg active:scale-95 transition-transform"
            >
              YAY! KEEP FEEDING! 🎉
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------ */}
      {/* ACCESSORY REWARD MODAL               */}
      {/* ------------------------------------ */}
      {accessoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl border-4 border-yellow-400 animate-fly-in flex flex-col items-center">
            <span className="text-6xl my-2 animate-bounce">{accessoryModal.icon}</span>
            <div className="flex items-center gap-1 text-xs font-black text-amber-600 uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>Silly Reward Unlocked!</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mt-1 mb-2">
              {accessoryModal.name}
            </h2>
            <p className="text-sm font-semibold text-slate-600 mb-6">
              Your pet loves dressing up! Look at that style!
            </p>

            <button
              onClick={() => {
                sfx.pop();
                setAccessoryModal(null);
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-black text-lg shadow-lg active:scale-95 transition-transform"
            >
              WEAR IT & PLAY! 🥳
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
