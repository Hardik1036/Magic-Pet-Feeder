import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Sparkles, RefreshCw, Heart, Star, Award, User, PawPrint, Trophy } from 'lucide-react';
import { PETS } from '../data/pets.js';
import { ALL_LETTERS, ALL_NUMBERS, ALL_SHAPES, ALL_COLORS } from '../data/shapes.js';
import { BADGES } from '../data/badges.js';

// ==========================================
// 1. SOUND FX (Pure Web Audio API Synthesizer)
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
function speakPetText(text, petVoice) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = petVoice?.pitch || 1.25;
    utterance.rate = petVoice?.rate || 0.9;
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
// 3. EVOLUTION STAGES
// ==========================================
const STAGES = [
  { id: 'egg', name: 'Magic Egg', icon: '🥚', minFeeds: 0, targetFeeds: 3, description: 'Feed the egg to help it crack and hatch!' },
  { id: 'baby', name: 'Baby Pet', icon: '🐣', minFeeds: 3, targetFeeds: 7, description: 'So tiny and hungry! Give baby lots of treats!' },
  { id: 'kid', name: 'Playful Kid', icon: '🐾', minFeeds: 7, targetFeeds: 11, description: 'Running and bouncing! Getting so big!' },
  { id: 'adult', name: 'Majestic Adult', icon: '👑', minFeeds: 11, targetFeeds: 15, description: 'Full grown magic creature! Proud of you!' },
];

function getStageFromFeeds(feedCount) {
  if (feedCount < 3) return 0;
  if (feedCount < 7) return 1;
  if (feedCount < 11) return 2;
  return 3;
}

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

function generateRound(mode, stageIndex, petDisplayName) {
  const isEgg = stageIndex === 0;
  const petSubject = isEgg ? 'the magic egg' : petDisplayName || 'your pet';

  if (mode === 'numbers') {
    const numbers = getRandomItems(ALL_NUMBERS, 3);
    const target = numbers[Math.floor(Math.random() * numbers.length)];
    return {
      mode: 'numbers',
      targetLabel: `Number ${target}`,
      spokenPrompt: `Feed ${petSubject} the number ${target}!`,
      targetId: target.toString(),
      choices: numbers.map((num) => ({
        id: num.toString(),
        label: num.toString(),
        type: 'number',
        count: num,
        color: ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)],
      })),
    };
  } else if (mode === 'phonics') {
    // All 26 letters of alphabet
    const letters = getRandomItems(ALL_LETTERS, 3);
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
        color: ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)],
      })),
    };
  } else {
    // 10 Shapes Mode
    const selectedColors = getRandomItems(ALL_COLORS, 3);
    const selectedShapes = getRandomItems(ALL_SHAPES, 3);
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
// 4. MULTI-SPECIES PET AVATAR SVG (8 ANIMALS)
// ==========================================
function PetAvatar({ petId, stageIndex, feedCount, expression, accessories, isNearFood }) {
  const mouthOpen = isNearFood || expression === 'hungry';
  const isChewing = expression === 'chewing';
  const isHappy = expression === 'happy';

  const petConfig = PETS.find((p) => p.id === petId) || PETS[0];

  // ------------------------------------------
  // STAGE 0: SPECIES MAGIC EGG
  // ------------------------------------------
  if (stageIndex === 0) {
    const crackLevel = feedCount;
    const ec = petConfig.eggColors;
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
            <linearGradient id={`eggGrad_${petId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ec.gradStart} />
              <stop offset="50%" stopColor={ec.gradMid} />
              <stop offset="100%" stopColor={ec.gradEnd} />
            </linearGradient>
            <radialGradient id={`eggSpot_${petId}`}>
              <stop offset="0%" stopColor={ec.spot} stopOpacity="0.9" />
              <stop offset="100%" stopColor={ec.spot} stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse cx="100" cy="215" rx="45" ry="12" fill="#1E293B" opacity="0.3" />

          {/* Egg Shell */}
          <path
            d="M 100 20 C 150 20, 175 90, 175 160 C 175 205, 145 220, 100 220 C 55 220, 25 205, 25 160 C 25 90, 50 20, 100 20 Z"
            fill={`url(#eggGrad_${petId})`}
            stroke={ec.stroke}
            strokeWidth="4"
          />

          <circle cx="65" cy="85" r="14" fill={`url(#eggSpot_${petId})`} />
          <circle cx="135" cy="70" r="10" fill={`url(#eggSpot_${petId})`} />
          <circle cx="140" cy="140" r="18" fill={`url(#eggSpot_${petId})`} />
          <circle cx="60" cy="155" r="12" fill={`url(#eggSpot_${petId})`} />
          <circle cx="100" cy="115" r="16" fill={`url(#eggSpot_${petId})`} />

          {/* Eyes */}
          <g>
            <circle cx="80" cy="115" r="7" fill="#FFFFFF" />
            <circle cx="81" cy="115" r="4.5" fill="#1E293B" />
            <circle cx="79" cy="113" r="2" fill="#FFFFFF" />

            <circle cx="120" cy="115" r="7" fill="#FFFFFF" />
            <circle cx="119" cy="115" r="4.5" fill="#1E293B" />
            <circle cx="117" cy="113" r="2" fill="#FFFFFF" />

            <ellipse cx="68" cy="125" rx="6" ry="3.5" fill="#F472B6" opacity="0.8" />
            <ellipse cx="132" cy="125" rx="6" ry="3.5" fill="#F472B6" opacity="0.8" />
          </g>

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

          <polygon points="100,55 103,62 110,63 105,68 106,75 100,71 94,75 95,68 90,63 97,62" fill="#FEF08A" />
        </svg>
      </div>
    );
  }

  // ------------------------------------------
  // STAGES 1, 2, 3: ANIMAL SPECIES
  // ------------------------------------------
  const isBaby = stageIndex === 1;
  const isAdult = stageIndex === 3;
  const scaleClass = isBaby ? 'scale-90' : isAdult ? 'scale-110' : 'scale-100';

  let bodyColor = '#10B981';
  let tummyColor = '#A7F3D0';

  if (petId === 'bunny') {
    bodyColor = '#F472B6';
    tummyColor = '#FCE7F3';
  } else if (petId === 'puppy') {
    bodyColor = '#F59E0B';
    tummyColor = '#FEF3C7';
  } else if (petId === 'kitten') {
    bodyColor = '#A78BFA';
    tummyColor = '#EDE9FE';
  } else if (petId === 'panda') {
    bodyColor = '#FFFFFF';
    tummyColor = '#F1F5F9';
  } else if (petId === 'fox') {
    bodyColor = '#EA580C';
    tummyColor = '#FFEDD5';
  } else if (petId === 'penguin') {
    bodyColor = '#0F172A';
    tummyColor = '#FFFFFF';
  } else if (petId === 'hamster') {
    bodyColor = '#F59E0B';
    tummyColor = '#FEF3C7';
  }

  return (
    <div className={`relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center select-none ${scaleClass} transition-transform duration-500`}>
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
        {/* Adult Wings */}
        {isAdult && (
          <g className="animate-pulse">
            <path d="M 45 105 Q 5 65 20 25 Q 50 55 70 90 Z" fill="#FBBF24" opacity="0.9" stroke="#B45309" strokeWidth="2" />
            <path d="M 195 105 Q 235 65 220 25 Q 190 55 170 90 Z" fill="#FBBF24" opacity="0.9" stroke="#B45309" strokeWidth="2" />
          </g>
        )}

        {/* Feet */}
        <ellipse cx="80" cy="205" rx="20" ry="13" fill="#334155" opacity="0.3" />
        <ellipse cx="160" cy="205" rx="20" ry="13" fill="#334155" opacity="0.3" />
        <ellipse cx="80" cy="202" rx="20" ry="13" fill={petId === 'penguin' ? '#F59E0B' : petId === 'panda' ? '#0F172A' : bodyColor} />
        <ellipse cx="160" cy="202" rx="20" ry="13" fill={petId === 'penguin' ? '#F59E0B' : petId === 'panda' ? '#0F172A' : bodyColor} />

        {/* EARS BY SPECIES */}
        {petId === 'bunny' && (
          <g>
            <path d="M 75 60 C 55 -5, 80 -15, 95 60 Z" fill={bodyColor} stroke="#BE185D" strokeWidth="2.5" />
            <path d="M 80 50 C 68 10, 85 5, 92 50 Z" fill="#FCE7F3" />
            <path d="M 165 60 C 185 -5, 160 -15, 145 60 Z" fill={bodyColor} stroke="#BE185D" strokeWidth="2.5" />
            <path d="M 160 50 C 172 10, 155 5, 148 50 Z" fill="#FCE7F3" />
          </g>
        )}

        {petId === 'puppy' && (
          <g>
            <path d="M 65 60 Q 25 75 35 115 Q 55 110 70 85 Z" fill="#B45309" />
            <path d="M 175 60 Q 215 75 205 115 Q 185 110 170 85 Z" fill="#B45309" />
          </g>
        )}

        {petId === 'kitten' && (
          <g>
            <polygon points="60,65 75,20 100,55" fill={bodyColor} stroke="#581C87" strokeWidth="2" />
            <polygon points="68,60 76,32 94,54" fill="#FCE7F3" />
            <polygon points="180,65 165,20 140,55" fill={bodyColor} stroke="#581C87" strokeWidth="2" />
            <polygon points="172,60 164,32 146,54" fill="#FCE7F3" />
          </g>
        )}

        {petId === 'dino' && (
          <g>
            <path d="M 65 52 Q 40 20 52 14 Q 72 26 78 44 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
            <path d="M 175 52 Q 200 20 188 14 Q 168 26 162 44 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
          </g>
        )}

        {petId === 'panda' && (
          <g>
            <circle cx="70" cy="55" r="22" fill="#0F172A" />
            <circle cx="170" cy="55" r="22" fill="#0F172A" />
          </g>
        )}

        {petId === 'fox' && (
          <g>
            <polygon points="60,65 70,15 100,55" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
            <polygon points="68,58 72,26 94,52" fill="#FFFFFF" />
            <polygon points="180,65 170,15 140,55" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
            <polygon points="172,58 168,26 146,52" fill="#FFFFFF" />
          </g>
        )}

        {petId === 'penguin' && (
          <g>
            <ellipse cx="60" cy="140" rx="14" ry="32" fill="#0F172A" transform="rotate(-15 60 140)" />
            <ellipse cx="180" cy="140" rx="14" ry="32" fill="#0F172A" transform="rotate(15 180 140)" />
          </g>
        )}

        {petId === 'hamster' && (
          <g>
            <circle cx="68" cy="55" r="18" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
            <circle cx="68" cy="55" r="10" fill="#FCE7F3" />
            <circle cx="172" cy="55" r="18" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
            <circle cx="172" cy="55" r="10" fill="#FCE7F3" />
          </g>
        )}

        {/* Main Body */}
        <path
          d="M 120 35 C 180 35, 210 75, 210 135 C 210 195, 175 210, 120 210 C 65 210, 30 195, 30 135 C 30 75, 60 35, 120 35 Z"
          fill={bodyColor}
          stroke={petId === 'panda' ? '#0F172A' : '#1E293B'}
          strokeWidth="3.5"
        />

        {/* Tummy */}
        <ellipse cx="120" cy="155" rx="54" ry="42" fill={tummyColor} opacity="0.9" />

        {/* Panda Eye Patches */}
        {petId === 'panda' && (
          <g>
            <ellipse cx="85" cy="100" rx="20" ry="16" fill="#0F172A" transform="rotate(-15 85 100)" />
            <ellipse cx="155" cy="100" rx="20" ry="16" fill="#0F172A" transform="rotate(15 155 100)" />
          </g>
        )}

        {/* Cheeks */}
        <circle cx="65" cy="130" r="14" fill="#F472B6" opacity="0.75" />
        <circle cx="175" cy="130" r="14" fill="#F472B6" opacity="0.75" />

        {/* Eyes */}
        {isHappy ? (
          <g stroke="#1E293B" strokeWidth="5" strokeLinecap="round" fill="none">
            <path d="M 72 102 Q 86 88 100 102" />
            <path d="M 140 102 Q 154 88 168 102" />
          </g>
        ) : (
          <g>
            <circle cx="85" cy="100" r={mouthOpen ? 17 : 15} fill="#FFFFFF" />
            <circle cx="87" cy="100" r="10" fill="#1E293B" />
            <circle cx="83" cy="96" r="4.5" fill="#FFFFFF" />
            <circle cx="91" cy="103" r="2" fill="#FFFFFF" />

            <circle cx="155" cy="100" r={mouthOpen ? 17 : 15} fill="#FFFFFF" />
            <circle cx="153" cy="100" r="10" fill="#1E293B" />
            <circle cx="149" cy="96" r="4.5" fill="#FFFFFF" />
            <circle cx="157" cy="103" r="2" fill="#FFFFFF" />
          </g>
        )}

        {/* Noses / Beaks */}
        {petId === 'penguin' ? (
          <polygon points="120,115 110,126 130,126" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
        ) : petId === 'puppy' ? (
          <ellipse cx="120" cy="118" rx="8" ry="6" fill="#3B1C0B" />
        ) : petId === 'bunny' || petId === 'kitten' || petId === 'fox' || petId === 'hamster' ? (
          <polygon points="120,121 115,116 125,116" fill="#DB2777" />
        ) : null}

        {/* Mouth */}
        {mouthOpen ? (
          <g>
            <path d="M 94 125 C 94 125, 120 118, 146 125 C 150 155, 90 155, 94 125 Z" fill="#881337" stroke="#1E293B" strokeWidth="3.5" />
            <ellipse cx="120" cy="146" rx="15" ry="9" fill="#FB7185" />
            <rect x="110" y="122" width="7" height="6" rx="2.5" fill="#FFFFFF" />
            <rect x="123" y="122" width="7" height="6" rx="2.5" fill="#FFFFFF" />
          </g>
        ) : isChewing ? (
          <path d="M 104 132 Q 120 146 136 132 Q 120 138 104 132 Z" fill="#881337" stroke="#1E293B" strokeWidth="3.5" />
        ) : (
          <path d="M 102 128 Q 120 144 138 128" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
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

        {(accessories.includes('golden_crown') || isAdult) && (
          <g transform="translate(85, 10)">
            <polygon points="0,28 10,6 25,20 40,3 55,20 70,6 80,28" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
            <circle cx="10" cy="5" r="3.5" fill="#EF4444" />
            <circle cx="40" cy="2" r="4" fill="#3B82F6" />
            <circle cx="70" cy="5" r="3.5" fill="#10B981" />
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
          <g transform="translate(120, 196)">
            <polygon points="0,0 -24,-12 -24,12" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <polygon points="0,0 24,-12 24,12" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <circle cx="0" cy="0" r="7" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          </g>
        )}

        {accessories.includes('flower_clip') && (
          <g transform="translate(62, 54)">
            <circle cx="-8" cy="0" r="7" fill="#F472B6" />
            <circle cx="8" cy="0" r="7" fill="#F472B6" />
            <circle cx="0" cy="-8" r="7" fill="#F472B6" />
            <circle cx="0" cy="8" r="7" fill="#F472B6" />
            <circle cx="0" cy="0" r="6" fill="#FBBF24" />
          </g>
        )}
      </svg>
    </div>
  );
}

// ==========================================
// 5. 10 SHAPES SVG RENDERER
// ==========================================
function ShapeIcon({ shape, color, size = 52 }) {
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
    case 'diamond':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className="drop-shadow-md">
          <polygon points="12,2 22,12 12,22 2,12" />
        </svg>
      );
    case 'moon':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className="drop-shadow-md">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    case 'oval':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className="drop-shadow-md">
          <ellipse cx="12" cy="12" rx="7" ry="10" />
        </svg>
      );
    case 'flower':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className="drop-shadow-md">
          <circle cx="12" cy="7" r="4" />
          <circle cx="17" cy="12" r="4" />
          <circle cx="12" cy="17" r="4" />
          <circle cx="7" cy="12" r="4" />
          <circle cx="12" cy="12" r="3.5" fill="#FEF08A" />
        </svg>
      );
    case 'cloud':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className="drop-shadow-md">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
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
// 6. CONFETTI CANVAS
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
// 7. MAIN GAME COMPONENT (PAGE 3)
// ==========================================
export default function MagicPetFeeder({
  playerName,
  petNickname,
  selectedPetId,
  initialFeedCount = 0,
  initialAccessories = [],
  unlockedBadges = [],
  onUnlockBadge,
  onOpenBadges,
  onSwitchPet,
  onChangeProfile,
  onSaveProgress,
}) {
  const currentPet = PETS.find((p) => p.id === selectedPetId) || PETS[0];
  const petDisplayName = petNickname || currentPet.defaultName;

  const [currentMode, setCurrentMode] = useState('numbers'); // 'numbers' | 'phonics' | 'shapes'
  const [feedCount, setFeedCount] = useState(initialFeedCount);
  const [stageIndex, setStageIndex] = useState(() => getStageFromFeeds(initialFeedCount));
  const [round, setRound] = useState(() => generateRound('numbers', getStageFromFeeds(initialFeedCount), petDisplayName));
  const [unlockedAccessories, setUnlockedAccessories] = useState(initialAccessories);

  // Modals
  const [evolutionModal, setEvolutionModal] = useState(null);
  const [accessoryModal, setAccessoryModal] = useState(null);
  const [newBadgeModal, setNewBadgeModal] = useState(null);

  // States
  const [petExpression, setPetExpression] = useState('idle');
  const [isNearPet, setIsNearPet] = useState(false);
  const [wobbleId, setWobbleId] = useState(null);
  const [flyingFoodId, setFlyingFoodId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Dragging
  const [draggingItem, setDraggingItem] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const petZoneRef = useRef(null);

  // Auto-speak on round change using selected pet's voice!
  useEffect(() => {
    const timer = setTimeout(() => {
      speakPetText(round.spokenPrompt, currentPet.voice);
    }, 450);
    return () => clearTimeout(timer);
  }, [round, currentPet]);

  // Sync initial props when switching pets
  useEffect(() => {
    setFeedCount(initialFeedCount);
    const newStage = getStageFromFeeds(initialFeedCount);
    setStageIndex(newStage);
    setUnlockedAccessories(initialAccessories);
    setRound(generateRound(currentMode, newStage, petDisplayName));
  }, [selectedPetId, initialFeedCount, initialAccessories, petDisplayName]);

  // Persist progress
  useEffect(() => {
    if (onSaveProgress) {
      onSaveProgress({
        feedCount,
        stageIndex,
        unlockedAccessories,
      });
    }
  }, [feedCount, stageIndex, unlockedAccessories, onSaveProgress]);

  // Check and award badges based on milestones & achievements
  const checkBadgeAwards = useCallback(
    (newFeeds, newStage, lastMode, choice) => {
      const awarded = [];

      // --- Milestones ---
      if (newFeeds >= 1 && !unlockedBadges.includes('first_snack')) awarded.push('first_snack');
      if (newFeeds >= 5 && !unlockedBadges.includes('high_five')) awarded.push('high_five');
      if (newFeeds >= 10 && !unlockedBadges.includes('super_feeder')) awarded.push('super_feeder');
      if (newFeeds >= 20 && !unlockedBadges.includes('mega_feeder')) awarded.push('mega_feeder');
      if (newStage >= 1 && !unlockedBadges.includes('egg_cracker')) awarded.push('egg_cracker');
      if (newStage >= 2 && !unlockedBadges.includes('kid_growth')) awarded.push('kid_growth');
      if (newStage >= 3 && !unlockedBadges.includes('adult_majesty')) awarded.push('adult_majesty');
      if (newFeeds >= 4 && !unlockedBadges.includes('rainbow_belly')) awarded.push('rainbow_belly');

      // --- Learning Modes ---
      if (lastMode === 'numbers' && !unlockedBadges.includes('number_whiz')) awarded.push('number_whiz');
      if (choice?.id === '10' && !unlockedBadges.includes('ten_frame_master')) awarded.push('ten_frame_master');
      if (lastMode === 'phonics' && !unlockedBadges.includes('alphabet_champ')) awarded.push('alphabet_champ');
      if (['A', 'E', 'I', 'O', 'U'].includes(choice?.id) && !unlockedBadges.includes('vowel_superstar')) awarded.push('vowel_superstar');
      if (lastMode === 'shapes' && !unlockedBadges.includes('shape_master')) awarded.push('shape_master');
      if (['diamond', 'moon', 'flower', 'cloud'].some((sh) => choice?.id?.includes(sh)) && !unlockedBadges.includes('gem_collector')) {
        awarded.push('gem_collector');
      }

      // --- Animal Bonds ---
      if (selectedPetId === 'dino' && !unlockedBadges.includes('dino_tamer')) awarded.push('dino_tamer');
      if (selectedPetId === 'bunny' && !unlockedBadges.includes('bunny_buddy')) awarded.push('bunny_buddy');
      if (selectedPetId === 'puppy' && !unlockedBadges.includes('puppy_pal')) awarded.push('puppy_pal');
      if (selectedPetId === 'kitten' && !unlockedBadges.includes('kitty_cuddle')) awarded.push('kitty_cuddle');
      if (selectedPetId === 'panda' && !unlockedBadges.includes('bamboo_master')) awarded.push('bamboo_master');
      if (selectedPetId === 'fox' && !unlockedBadges.includes('fox_explorer')) awarded.push('fox_explorer');
      if (selectedPetId === 'penguin' && !unlockedBadges.includes('penguin_dancer')) awarded.push('penguin_dancer');
      if (selectedPetId === 'hamster' && !unlockedBadges.includes('hamster_cheeks')) awarded.push('hamster_cheeks');

      // --- Random Fun Celebration Clear ---
      if (newFeeds >= 3 && !unlockedBadges.includes('party_animal') && Math.random() > 0.3) {
        awarded.push('party_animal');
      }

      if (awarded.length > 0) {
        awarded.forEach((bId) => {
          if (onUnlockBadge) onUnlockBadge(bId);
        });
        const badgeObj = BADGES.find((b) => b.id === awarded[0]);
        if (badgeObj) {
          setNewBadgeModal(badgeObj);
          sfx.fanfare();
          speakPetText(`Hooray! You earned the ${badgeObj.title} trophy!`, currentPet.voice);
        }
      }
    },
    [unlockedBadges, onUnlockBadge, currentPet, selectedPetId]
  );

  const checkCollisionWithPet = useCallback((x, y) => {
    if (!petZoneRef.current) return false;
    const rect = petZoneRef.current.getBoundingClientRect();
    const margin = 45;
    return (
      x >= rect.left - margin &&
      x <= rect.right + margin &&
      y >= rect.top - margin &&
      y <= rect.bottom + margin
    );
  }, []);

  const handleSuccessfulFeed = useCallback(
    (choice) => {
      setFlyingFoodId(choice.id);
      setPetExpression('chewing');

      if (stageIndex === 0) {
        sfx.crack();
      } else {
        sfx.munch();
      }

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1400);

      const newFeedCount = feedCount + 1;
      const newStageIndex = getStageFromFeeds(newFeedCount);
      setFeedCount(newFeedCount);

      // Check badge awards
      checkBadgeAwards(newFeedCount, newStageIndex, currentMode, choice);

      if (newStageIndex > stageIndex) {
        setStageIndex(newStageIndex);
        const nextStageObj = STAGES[newStageIndex];

        setTimeout(() => {
          sfx.grow();
          sfx.fanfare();
          setEvolutionModal(nextStageObj);
          if (newStageIndex === 1) {
            speakPetText(`WOW! The egg hatched! Welcome ${petDisplayName}!`, currentPet.voice);
          } else if (newStageIndex === 2) {
            speakPetText(`Hooray! ${petDisplayName} grew into a playful kid!`, currentPet.voice);
          } else {
            speakPetText(`AMAZING! ${petDisplayName} is now a full grown adult!`, currentPet.voice);
          }
        }, 800);
      } else {
        const praises =
          stageIndex === 0
            ? ['Crack crack!', 'The egg loves it!', 'Keep going!', 'Almost hatching!']
            : [currentPet.voice.nomSound, 'So yummy!', 'Delicious!', 'Super job!', 'Nom nom nom!'];
        const randomPraise = praises[Math.floor(Math.random() * praises.length)];
        setTimeout(() => speakPetText(randomPraise, currentPet.voice), 300);

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
            speakPetText(`Yay! You unlocked the silly ${accessoryToUnlock.name}!`, currentPet.voice);
          }, 1100);
        }
      }

      setTimeout(() => {
        setPetExpression('happy');
        setTimeout(() => {
          setFlyingFoodId(null);
          setPetExpression('idle');
          const nextMode =
            currentMode === 'numbers'
              ? 'phonics'
              : currentMode === 'phonics'
              ? 'shapes'
              : 'numbers';
          setCurrentMode(nextMode);
          setRound(generateRound(nextMode, newStageIndex, petDisplayName));
        }, 700);
      }, 900);
    },
    [currentMode, feedCount, stageIndex, unlockedAccessories, currentPet, petDisplayName, checkBadgeAwards]
  );

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
      speakPetText(
        softReminders[Math.floor(Math.random() * softReminders.length)],
        currentPet.voice
      );
    },
    [round, currentPet]
  );

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

  const handleDirectTap = (choice) => {
    if (draggingItem || flyingFoodId) return;
    sfx.pop();
    if (choice.id === round.targetId) {
      handleSuccessfulFeed(choice);
    } else {
      handleGentleMiss(choice);
    }
  };

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
      className="relative w-full min-h-screen bg-gradient-to-b from-sky-300 via-indigo-100 to-pink-200 flex flex-col justify-between items-center p-3 sm:p-5 select-none overflow-hidden font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      <ConfettiCanvas active={showConfetti} />

      {/* ------------------------------------ */}
      {/* TOP HEADER: PLAYERS, PETS, TROPHIES  */}
      {/* ------------------------------------ */}
      <header className="w-full max-w-md flex flex-col items-center gap-1.5 pt-1 z-20">
        <div className="w-full flex items-center justify-between px-1">
          {/* Switch Pet / Profile */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onChangeProfile}
              title="Change Player Name"
              className="flex items-center gap-1 bg-white/85 px-2.5 py-1 rounded-full text-xs font-bold text-indigo-900 border border-indigo-200 shadow-sm active:scale-95 transition-transform"
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>{playerName || 'Player'}</span>
            </button>

            <button
              onClick={onSwitchPet}
              title="Switch Pet"
              className="flex items-center gap-1 bg-white/85 px-2.5 py-1 rounded-full text-xs font-bold text-purple-900 border border-purple-200 shadow-sm active:scale-95 transition-transform"
            >
              <span>{currentPet.icon}</span>
              <span>{petDisplayName}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Badges Trophy Button */}
            <button
              onClick={onOpenBadges}
              title="View Badges & Trophies"
              className="flex items-center gap-1 bg-amber-400 text-amber-950 px-2.5 py-1 rounded-full text-xs font-black shadow-md border-2 border-amber-500 active:scale-95 transition-transform"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{unlockedBadges.length}</span>
            </button>

            {/* Mode Switcher Button */}
            <button
              onClick={() => {
                sfx.pop();
                const nextMode =
                  currentMode === 'numbers'
                    ? 'phonics'
                    : currentMode === 'phonics'
                    ? 'shapes'
                    : 'numbers';
                setCurrentMode(nextMode);
                setRound(generateRound(nextMode, stageIndex, petDisplayName));
              }}
              className="flex items-center gap-1 bg-white/90 active:scale-95 px-2.5 py-1 rounded-full text-xs font-black text-amber-900 shadow-md border-2 border-amber-300 transition-transform"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {currentMode === 'numbers'
                  ? '🔢 Numbers'
                  : currentMode === 'phonics'
                  ? '🔤 Letters'
                  : '🎨 Shapes'}
              </span>
            </button>
          </div>
        </div>

        {/* Growth Timeline Bar */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border-2 border-purple-300 flex flex-col gap-1">
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
                  <span className="text-[9px] font-bold text-slate-600 mt-0.5">
                    {st.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden border border-purple-200 mt-0.5">
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
              {stageIndex === 0 ? 'Help The Egg Hatch:' : `Feed ${petDisplayName}:`}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>{round.targetLabel}</span>
              <span className="text-2xl animate-pulse">
                {stageIndex === 0 ? '✨' : currentPet.icon}
              </span>
            </h1>
          </div>

          <button
            onClick={() => {
              sfx.pop();
              speakPetText(round.spokenPrompt, currentPet.voice);
            }}
            aria-label="Repeat Prompt"
            className="w-13 h-13 p-3 bg-gradient-to-tr from-amber-400 to-yellow-300 active:scale-90 hover:scale-105 rounded-2xl shadow-lg border-2 border-amber-500 flex items-center justify-center text-amber-900 transition-transform"
          >
            <Volume2 className="w-7 h-7" />
          </button>
        </div>
      </section>

      {/* ------------------------------------ */}
      {/* PET DROP ZONE & AVATAR               */}
      {/* ------------------------------------ */}
      <main ref={petZoneRef} className="relative my-auto flex flex-col items-center justify-center z-10">
        <PetAvatar
          petId={currentPet.id}
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
      {/* CHOICES: NUMBERS, LETTERS OR SHAPES  */}
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

                {/* NUMBER DISPLAY WITH ALL 10 COUNTING DOTS (NO +5 TRUNCATION) */}
                {choice.type === 'number' && (
                  <div className="flex flex-col items-center justify-center">
                    <span className={`text-4xl sm:text-5xl font-black leading-none ${choice.color?.text || 'text-amber-600'}`}>
                      {choice.label}
                    </span>
                    {/* Counting Sprinkle Dots - Ten-Frame Layout */}
                    <div className="flex flex-col items-center gap-1 mt-1.5">
                      <div className="flex gap-1 justify-center">
                        {Array.from({ length: Math.min(choice.count, 5) }).map((_, dotIdx) => (
                          <div
                            key={`row1-${dotIdx}`}
                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-sm"
                            style={{ backgroundColor: choice.color.fill }}
                          />
                        ))}
                      </div>
                      {choice.count > 5 && (
                        <div className="flex gap-1 justify-center">
                          {Array.from({ length: choice.count - 5 }).map((_, dotIdx) => (
                            <div
                              key={`row2-${dotIdx}`}
                              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-sm"
                              style={{ backgroundColor: choice.color.fill }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* PHONICS LETTER DISPLAY (ALL 26 ALPHABET) */}
                {choice.type === 'letter' && (
                  <div className="flex flex-col items-center justify-center">
                    <span className={`text-4xl sm:text-5xl font-black ${choice.color?.text || 'text-indigo-600'}`}>
                      {choice.label}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      Cookie
                    </span>
                  </div>
                )}

                {/* SHAPE DISPLAY (10 VIBRANT SHAPES) */}
                {choice.type === 'shape' && (
                  <div className="flex flex-col items-center justify-center">
                    <ShapeIcon shape={choice.shape} color={choice.color} size={46} />
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
          {draggingItem.type === 'number' ? (
            <span className={`text-5xl font-black ${draggingItem.color?.text || 'text-amber-600'}`}>
              {draggingItem.label}
            </span>
          ) : draggingItem.type === 'letter' ? (
            <span className={`text-5xl font-black ${draggingItem.color?.text || 'text-indigo-600'}`}>
              {draggingItem.label}
            </span>
          ) : (
            <ShapeIcon shape={draggingItem.shape} color={draggingItem.color} size={50} />
          )}
        </div>
      )}

      {/* ------------------------------------ */}
      {/* EVOLUTION CELEBRATION MODAL          */}
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
                setRound(generateRound(currentMode, stageIndex, petDisplayName));
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
              {petDisplayName} loves dressing up! Look at that style!
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

      {/* ------------------------------------ */}
      {/* NEW BADGE CELEBRATION MODAL 🏆       */}
      {/* ------------------------------------ */}
      {newBadgeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl border-4 border-amber-400 animate-fly-in flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-5xl my-2 shadow-inner border-2 border-amber-300 animate-bounce">
              {newBadgeModal.icon}
            </div>
            <span className="text-xs font-black text-amber-600 uppercase tracking-widest">
              🏆 TROPHY UNLOCKED! 🏆
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1 mb-2">
              {newBadgeModal.title}
            </h2>
            <p className="text-sm font-semibold text-slate-600 mb-6">
              {newBadgeModal.description}
            </p>

            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => {
                  sfx.pop();
                  setNewBadgeModal(null);
                }}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-black text-base shadow-lg active:scale-95 transition-transform"
              >
                KEEP FEEDING! 🍪
              </button>

              <button
                onClick={() => {
                  sfx.pop();
                  setNewBadgeModal(null);
                  if (onOpenBadges) onOpenBadges();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs active:scale-95 transition-transform"
              >
                View Trophy Room 🏆
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
