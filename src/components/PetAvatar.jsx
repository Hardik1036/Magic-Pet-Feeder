import React, { useState } from 'react';
import { PETS } from '../data/pets.js';
import ThreePetCanvas from './ThreePetCanvas.jsx';

export default function PetAvatar({
  petId,
  stageIndex,
  feedCount = 0,
  expression = 'idle', // 'idle' | 'hungry' | 'chewing' | 'happy' | 'sleeping' | 'sparkle'
  accessories = [],
  isNearFood = false,
  onPet,
  onTease,
}) {
  const [is3DMode, setIs3DMode] = useState(true);
  const [webglError, setWebglError] = useState(false);

  const mouthOpen = isNearFood || expression === 'hungry';
  const isChewing = expression === 'chewing';
  const isHappy = expression === 'happy' || expression === 'sparkle';
  const isSleeping = expression === 'sleeping';

  const petConfig = PETS.find((p) => p.id === petId) || PETS[0];

  // ------------------------------------------
  // 3D INTERACTIVE PET AVATAR (ALL 8 PETS & ALL STAGES)
  // ------------------------------------------
  if (is3DMode && !webglError) {
    return (
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 max-h-[32dvh] flex items-center justify-center select-none">
        {/* Ambient 3D Glow Aura */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 opacity-65 pointer-events-none ${
            isNearFood
              ? 'bg-amber-400 scale-110'
              : expression === 'happy' || expression === 'sparkle'
              ? 'bg-rose-400 scale-105'
              : 'bg-emerald-400 scale-95'
          }`}
        />

        {/* 3D Interactive Three.js Pet Canvas with Proper Limbs */}
        <ThreePetCanvas
          petId={petId}
          isNearFood={isNearFood}
          expression={expression}
          accessories={accessories}
          onPet={onPet}
          onTease={onTease}
          onError={() => setWebglError(true)}
          className="w-full h-full relative z-10 drop-shadow-2xl"
        />

        {/* 3D Mode Switcher Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIs3DMode(false);
          }}
          className="absolute -top-1 -right-1 z-20 px-2 py-0.5 rounded-full bg-emerald-700/90 hover:bg-emerald-600 text-white text-[9px] font-black shadow border border-emerald-300 transition active:scale-95 flex items-center gap-1"
          title="Switch to 2D view"
        >
          <span>3D ✨</span>
        </button>
      </div>
    );
  }

  // ------------------------------------------
  // STAGE 0: SPECIES MAGIC EGG (3D SHADED 2D FALLBACK)
  // ------------------------------------------
  if (stageIndex === 0) {
    const crackLevel = feedCount;
    const ec = petConfig.eggColors;
    return (
      <div className="relative w-38 h-46 sm:w-52 sm:h-60 max-h-[27dvh] flex items-center justify-center select-none">
        {/* Ambient 3D Glow Aura */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 opacity-65 ${
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
            <radialGradient id={`eggGrad_${petId}`} cx="32%" cy="26%" r="72%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="15%" stopColor={ec.gradStart} />
              <stop offset="65%" stopColor={ec.gradMid} />
              <stop offset="95%" stopColor={ec.gradEnd} />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.4" />
            </radialGradient>

            <radialGradient id={`eggSpot_${petId}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="45%" stopColor={ec.spot} />
              <stop offset="100%" stopColor={ec.gradEnd} stopOpacity="0.5" />
            </radialGradient>

            <linearGradient id="egg3DGloss" x1="0%" y1="0%" x2="60%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Soft Ground Contact Shadow */}
          <ellipse cx="100" cy="216" rx="52" ry="12" fill="#0F172A" opacity="0.28" />

          {/* 3D Volumetric Egg Shell */}
          <path
            d="M 100 16 C 154 16, 180 88, 180 160 C 180 208, 148 224, 100 224 C 52 224, 20 208, 20 160 C 20 88, 46 16, 100 16 Z"
            fill={`url(#eggGrad_${petId})`}
          />

          {/* 3D Curvature Highlight Sheen */}
          <path
            d="M 64 36 C 92 22, 122 26, 142 46 C 124 40, 84 38, 54 68 C 48 54, 54 42, 64 36 Z"
            fill="url(#egg3DGloss)"
          />
          <ellipse cx="75" cy="55" rx="20" ry="10" transform="rotate(-28 75 55)" fill="#FFFFFF" opacity="0.4" />

          {/* 3D Embossed Egg Spots */}
          <circle cx="65" cy="85" r="14" fill={`url(#eggSpot_${petId})`} />
          <circle cx="63" cy="83" r="4" fill="#FFFFFF" opacity="0.6" />

          <circle cx="138" cy="68" r="11" fill={`url(#eggSpot_${petId})`} />
          <circle cx="136" cy="66" r="3" fill="#FFFFFF" opacity="0.6" />

          <circle cx="145" cy="142" r="17" fill={`url(#eggSpot_${petId})`} />
          <circle cx="142" cy="139" r="4.5" fill="#FFFFFF" opacity="0.6" />

          <circle cx="56" cy="155" r="13" fill={`url(#eggSpot_${petId})`} />
          <circle cx="54" cy="153" r="3.5" fill="#FFFFFF" opacity="0.6" />

          <circle cx="102" cy="116" r="15" fill={`url(#eggSpot_${petId})`} />
          <circle cx="100" cy="114" r="4" fill="#FFFFFF" opacity="0.6" />

          {/* Expressive Baby Eyes in Egg */}
          {isSleeping ? (
            <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
              <path d="M 72 118 Q 80 126 88 118" />
              <path d="M 112 118 Q 120 126 128 118" />
            </g>
          ) : (
            <g>
              <ellipse cx="78" cy="114" rx="10" ry="12" fill="#0F172A" />
              <circle cx="75" cy="110" r="4.5" fill="#FFFFFF" />
              <circle cx="81" cy="118" r="2" fill="#FFFFFF" />

              <ellipse cx="122" cy="114" rx="10" ry="12" fill="#0F172A" />
              <circle cx="119" cy="110" r="4.5" fill="#FFFFFF" />
              <circle cx="125" cy="118" r="2" fill="#FFFFFF" />

              <ellipse cx="66" cy="124" rx="8" ry="5" fill="#F43F5E" opacity="0.65" />
              <ellipse cx="134" cy="124" rx="8" ry="5" fill="#F43F5E" opacity="0.65" />
            </g>
          )}

          {/* Glowing Cracks */}
          {crackLevel >= 1 && (
            <path
              d="M 100 16 L 94 45 L 112 65 L 88 88"
              stroke="#FEF08A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="animate-pulse"
              filter="drop-shadow(0 0 4px #F59E0B)"
            />
          )}
          {crackLevel >= 2 && (
            <path
              d="M 180 160 L 145 148 L 158 128 L 132 118"
              stroke="#FEF08A"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="animate-pulse"
              filter="drop-shadow(0 0 5px #F59E0B)"
            />
          )}
        </svg>

        {/* 2D to 3D Switcher Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIs3DMode(true);
          }}
          className="absolute -top-1 -right-1 z-20 px-2 py-0.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black shadow border border-indigo-300 transition active:scale-95 flex items-center gap-1"
          title="Switch to 3D Avatar"
        >
          <span>See 3D ✨</span>
        </button>
      </div>
    );
  }

  // ------------------------------------------
  // STAGES 1, 2, 3: ULTRA-CUTE 3D PIXAR PETS
  // ------------------------------------------
  const isBaby = stageIndex === 1;
  const isAdult = stageIndex === 3;
  const scaleClass = isBaby ? 'scale-90' : isAdult ? 'scale-105' : 'scale-100';

  // Rich 3D Pixar Color Palettes
  const palettes = {
    dino: {
      light: '#A7F3D0',
      base: '#34D399',
      mid: '#10B981',
      dark: '#059669',
      deep: '#064E3B',
      bellyLight: '#FEF9C3',
      bellyBase: '#FEF08A',
      bellyDark: '#FDE047',
      spikeLight: '#FDE047',
      spikeBase: '#F59E0B',
      spikeDark: '#D97706',
      eyeIris: '#059669',
      eyeSecondary: '#34D399',
      cheek: '#FB7185',
      nose: '#047857',
    },
    bunny: {
      light: '#FFF1F2',
      base: '#FBCFE8',
      mid: '#F472B6',
      dark: '#DB2777',
      deep: '#9D174D',
      bellyLight: '#FFFFFF',
      bellyBase: '#FFF1F2',
      bellyDark: '#FCE7F3',
      innerEar: '#FDA4AF',
      eyeIris: '#6366F1',
      eyeSecondary: '#A5B4FC',
      cheek: '#FDA4AF',
      nose: '#E11D48',
    },
    puppy: {
      light: '#FEF3C7',
      base: '#FDE68A',
      mid: '#F59E0B',
      dark: '#D97706',
      deep: '#78350F',
      bellyLight: '#FFFFFF',
      bellyBase: '#FEF3C7',
      bellyDark: '#FDE68A',
      muzzleLight: '#FFFFFF',
      muzzleBase: '#FEF3C7',
      muzzleDark: '#FDE68A',
      eyeIris: '#92400E',
      eyeSecondary: '#F59E0B',
      cheek: '#FB923C',
      nose: '#1E1B18',
    },
    kitten: {
      light: '#F5F3FF',
      base: '#DDD6FE',
      mid: '#A78BFA',
      dark: '#7C3AED',
      deep: '#4C1D95',
      bellyLight: '#FFFFFF',
      bellyBase: '#F5F3FF',
      bellyDark: '#EDE9FE',
      innerEar: '#FBCFE8',
      eyeIris: '#0284C7',
      eyeSecondary: '#38BDF8',
      cheek: '#F472B6',
      nose: '#E11D48',
    },
    panda: {
      light: '#FFFFFF',
      base: '#F8FAFC',
      mid: '#E2E8F0',
      dark: '#94A3B8',
      deep: '#475569',
      blackFurLight: '#334155',
      blackFurBase: '#1E293B',
      blackFurDark: '#0F172A',
      bellyLight: '#FFFFFF',
      bellyBase: '#F1F5F9',
      bellyDark: '#E2E8F0',
      eyeIris: '#334155',
      eyeSecondary: '#64748B',
      cheek: '#FDA4AF',
      nose: '#0F172A',
    },
    fox: {
      light: '#FED7AA',
      base: '#FB923C',
      mid: '#EA580C',
      dark: '#C2410C',
      deep: '#7C2D12',
      bibLight: '#FFFFFF',
      bibBase: '#FFF7ED',
      bibDark: '#FFEDD5',
      tailTip: '#FFFFFF',
      eyeIris: '#B45309',
      eyeSecondary: '#F59E0B',
      cheek: '#FB7185',
      nose: '#18181B',
    },
    penguin: {
      light: '#475569',
      base: '#1E293B',
      mid: '#0F172A',
      dark: '#020617',
      deep: '#000000',
      chestLight: '#FFFFFF',
      chestBase: '#F8FAFC',
      chestDark: '#E2E8F0',
      auricularLight: '#FDE047',
      auricularBase: '#F59E0B',
      beakBase: '#F59E0B',
      beakDark: '#D97706',
      eyeIris: '#0284C7',
      eyeSecondary: '#38BDF8',
    },
    hamster: {
      light: '#FEF9C3',
      base: '#FDE68A',
      mid: '#F59E0B',
      dark: '#B45309',
      deep: '#78350F',
      bellyLight: '#FFFFFF',
      bellyBase: '#FEF3C7',
      bellyDark: '#FDE68A',
      cheekLight: '#FFFFFF',
      cheekBase: '#FEF3C7',
      cheekDark: '#FDE68A',
      paws: '#FDA4AF',
      eyeIris: '#78350F',
      eyeSecondary: '#F59E0B',
      cheek: '#FB7185',
      nose: '#E11D48',
    },
  };

  const p = palettes[petId] || palettes.dino;

  return (
    <div
      className={`relative w-44 h-44 sm:w-60 sm:h-60 max-h-[30dvh] flex items-center justify-center select-none ${scaleClass} transition-transform duration-500`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIs3DMode(true);
        }}
        className="absolute -top-1 -right-1 z-20 px-2 py-0.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white text-[9px] font-black shadow border border-emerald-300 transition active:scale-95 flex items-center gap-1"
        title="Switch to 3D view"
      >
        <span>2D 🎨 → 3D ✨</span>
      </button>

      {/* 3D Volumetric Ambient Glow */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 opacity-60 ${
          isHappy
            ? 'bg-amber-300 scale-110'
            : mouthOpen
            ? 'bg-rose-300 scale-105'
            : isSleeping
            ? 'bg-indigo-300 scale-90'
            : 'bg-emerald-300 scale-95'
        }`}
      />

      {/* Sleeping Zzz Floating Animation */}
      {isSleeping && (
        <div className="absolute -top-3 right-5 flex flex-col items-center pointer-events-none z-20 animate-bounce">
          <span className="text-xl font-black text-indigo-400 opacity-90 drop-shadow">Z</span>
          <span className="text-sm font-black text-purple-400 opacity-75 -mt-1 ml-3">z</span>
          <span className="text-xs font-black text-pink-300 opacity-60 -mt-1 ml-5">z</span>
        </div>
      )}

      <svg
        viewBox="0 0 240 240"
        className={`w-full h-full relative z-10 drop-shadow-2xl transition-transform duration-300 ${
          isChewing ? 'animate-chew' : isHappy ? 'animate-bounce' : isSleeping ? 'opacity-95' : 'animate-float'
        }`}
      >
        <defs>
          {/* 3D Spherical Body Gradient (Key light top-left, rim light bottom) */}
          <radialGradient id={`bodyGrad3D_${petId}`} cx="34%" cy="28%" r="72%">
            <stop offset="0%" stopColor={p.light} />
            <stop offset="28%" stopColor={p.base} />
            <stop offset="68%" stopColor={p.mid} />
            <stop offset="92%" stopColor={p.dark} />
            <stop offset="100%" stopColor={p.deep} />
          </radialGradient>

          {/* 3D Belly Cushion Gradient */}
          <radialGradient id={`bellyGrad3D_${petId}`} cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor={p.bellyLight || '#FFFFFF'} />
            <stop offset="55%" stopColor={p.bellyBase || '#FEF08A'} />
            <stop offset="100%" stopColor={p.bellyDark || '#FDE047'} />
          </radialGradient>

          {/* 3D Dorsal Spikes / Plates Gradient */}
          <linearGradient id={`spikeGrad3D_${petId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={p.spikeLight || '#FDE047'} />
            <stop offset="45%" stopColor={p.spikeBase || '#F59E0B'} />
            <stop offset="100%" stopColor={p.spikeDark || '#D97706'} />
          </linearGradient>

          {/* 3D Pixar Glassy Eye Iris Gradient */}
          <radialGradient id={`irisGrad3D_${petId}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="20%" stopColor={p.eyeSecondary || p.eyeIris} />
            <stop offset="60%" stopColor={p.eyeIris} />
            <stop offset="85%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* 3D Embossed Scale Dome Gradient */}
          <radialGradient id={`scaleDomeGrad_${petId}`} cx="32%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="35%" stopColor={p.light} />
            <stop offset="75%" stopColor={p.base} />
            <stop offset="100%" stopColor={p.dark} />
          </radialGradient>

          {/* 3D Glossy Surface Highlights */}
          <linearGradient id="glossHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Deep Oral Cavity Gradient */}
          <radialGradient id="mouth3DCavity" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="60%" stopColor="#881337" />
            <stop offset="100%" stopColor="#4C0519" />
          </radialGradient>

          {/* 3D Pink Tongue */}
          <radialGradient id="tongue3D" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="70%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#F43F5E" />
          </radialGradient>
        </defs>

        {/* ------------------------------------ */}
        {/* UNDER-BODY ACCESSORIES & GROUND      */}
        {/* ------------------------------------ */}

        {/* Super Cape (Under Body) */}
        {accessories.includes('super_cape') && (
          <path
            d="M 68 125 C 22 170, 26 226, 48 232 C 110 220, 185 232, 208 232 C 230 170, 192 125, 172 125 Z"
            fill="#DC2626"
            filter="drop-shadow(0 4px 6px rgba(153, 27, 27, 0.4))"
            className="animate-pulse"
          />
        )}

        {/* Adult Wings */}
        {isAdult && (
          <g className="animate-pulse">
            <path
              d="M 45 95 Q 0 45 18 12 Q 52 45 70 78 Z"
              fill="#FBBF24"
              opacity="0.95"
              stroke="#B45309"
              strokeWidth="2.2"
              filter="drop-shadow(0 2px 4px rgba(180, 83, 9, 0.3))"
            />
            <path
              d="M 195 95 Q 240 45 222 12 Q 188 45 170 78 Z"
              fill="#FBBF24"
              opacity="0.95"
              stroke="#B45309"
              strokeWidth="2.2"
              filter="drop-shadow(0 2px 4px rgba(180, 83, 9, 0.3))"
            />
          </g>
        )}

        {/* Soft Volumetric Ground Shadow */}
        <ellipse cx="120" cy="216" rx="72" ry="13" fill="#0F172A" opacity="0.28" />

        {/* ================================================================= */}
        {/* 1. DINO: ADORABLE 3D PIXAR DINOSAUR (CHUBBY SNOUT, SCALES, TAIL)  */}
        {/* ================================================================= */}
        {petId === 'dino' && (
          <g id="cute_3d_dino">
            {/* Chunky Huggable 3D Dinosaur Tail Curving Up with Soft Spikes */}
            <g id="dino_tail">
              {/* Rounded 3D Amber Plates Along Tail Crest */}
              <path d="M 166 142 Q 174 126 182 138 Z" fill={`url(#spikeGrad3D_${petId})`} />
              <path d="M 184 130 Q 196 112 204 125 Z" fill={`url(#spikeGrad3D_${petId})`} />
              <path d="M 204 116 Q 218 95 224 110 Z" fill={`url(#spikeGrad3D_${petId})`} />
              <path d="M 220 102 Q 234 82 232 98 Z" fill={`url(#spikeGrad3D_${petId})`} />

              {/* Main Chunky Tubular Tail with 3D Shading */}
              <path
                d="M 152 146 C 188 138, 222 118, 230 92 C 234 88, 228 84, 220 92 C 205 108, 185 142, 148 178 Z"
                fill={`url(#bodyGrad3D_${petId})`}
              />
              {/* Glossy 3D Highlight Sheen on Tail Arch */}
              <path
                d="M 160 144 C 185 135, 210 115, 220 96"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
            </g>

            {/* Rounded 3D Dorsal Spikes Down Head & Neck */}
            <g id="dino_head_spikes">
              <path d="M 108 26 Q 102 6 118 18 Z" fill={`url(#spikeGrad3D_${petId})`} />
              <path d="M 124 28 Q 126 8 138 24 Z" fill={`url(#spikeGrad3D_${petId})`} />
              <path d="M 140 38 Q 148 18 156 38 Z" fill={`url(#spikeGrad3D_${petId})`} />
              <path d="M 154 54 Q 166 38 168 60 Z" fill={`url(#spikeGrad3D_${petId})`} />
              <path d="M 164 78 Q 178 64 174 88 Z" fill={`url(#spikeGrad3D_${petId})`} />
              <path d="M 168 106 Q 182 94 176 118 Z" fill={`url(#spikeGrad3D_${petId})`} />
            </g>

            {/* Chubby 3D Hind Feet with Rounded Claws */}
            <g id="dino_hind_feet">
              {/* Left Foot */}
              <ellipse cx="78" cy="204" rx="22" ry="14" fill={p.dark} />
              <ellipse cx="76" cy="202" rx="20" ry="12" fill={`url(#bodyGrad3D_${petId})`} />
              {/* Cute Rounded Claws */}
              <ellipse cx="62" cy="210" rx="3.5" ry="5" fill="#FFFFFF" />
              <ellipse cx="72" cy="212" rx="3.5" ry="5" fill="#FFFFFF" />
              <ellipse cx="82" cy="211" rx="3.5" ry="5" fill="#FFFFFF" />

              {/* Right Foot */}
              <ellipse cx="162" cy="204" rx="22" ry="14" fill={p.dark} />
              <ellipse cx="164" cy="202" rx="20" ry="12" fill={`url(#bodyGrad3D_${petId})`} />
              <ellipse cx="152" cy="211" rx="3.5" ry="5" fill="#FFFFFF" />
              <ellipse cx="162" cy="212" rx="3.5" ry="5" fill="#FFFFFF" />
              <ellipse cx="172" cy="210" rx="3.5" ry="5" fill="#FFFFFF" />
            </g>

            {/* Plump 3D Dinosaur Torso */}
            <path
              d="M 112 30 C 154 28, 180 62, 180 114 C 180 166, 164 204, 116 208 C 68 208, 60 166, 66 118 C 72 75, 84 38, 112 30 Z"
              fill={`url(#bodyGrad3D_${petId})`}
            />

            {/* 3D Volumetric Highlight across Forehead/Chest */}
            <path
              d="M 108 34 C 138 34, 162 65, 162 108 C 162 125, 158 138, 150 148 C 145 110, 126 55, 102 48 C 94 54, 88 88, 86 112 C 80 102, 78 86, 80 72 C 84 50, 94 34, 108 34 Z"
              fill="url(#glossHighlight)"
              opacity="0.45"
            />

            {/* Segmented Custard Cream 3D Belly Cushion */}
            <g id="dino_belly">
              <path
                d="M 86 118 C 86 118, 108 112, 134 116 C 140 150, 128 196, 110 200 C 90 198, 78 160, 86 118 Z"
                fill={`url(#bellyGrad3D_${petId})`}
              />
              {/* Soft Pillowy 3D Belly Segments */}
              <path d="M 87 136 Q 108 142 130 134" stroke={p.bellyDark} strokeWidth="2.5" fill="none" opacity="0.7" />
              <path d="M 86 154 Q 106 160 128 152" stroke={p.bellyDark} strokeWidth="2.5" fill="none" opacity="0.7" />
              <path d="M 88 172 Q 105 178 124 170" stroke={p.bellyDark} strokeWidth="2.5" fill="none" opacity="0.7" />
            </g>

            {/* 3D Embossed Shiny Pebble Scales (Raised Jeweled Domes) */}
            <g id="dino_3d_scales">
              {/* Flank scale cluster */}
              <circle cx="146" cy="85" r="5" fill={`url(#scaleDomeGrad_${petId})`} />
              <circle cx="144.5" cy="83.5" r="1.8" fill="#FFFFFF" opacity="0.8" />

              <circle cx="158" cy="90" r="4.2" fill={`url(#scaleDomeGrad_${petId})`} />
              <circle cx="156.5" cy="88.5" r="1.5" fill="#FFFFFF" opacity="0.8" />

              <circle cx="150" cy="98" r="4.5" fill={`url(#scaleDomeGrad_${petId})`} />
              <circle cx="148.5" cy="96.5" r="1.6" fill="#FFFFFF" opacity="0.8" />

              <circle cx="160" cy="106" r="3.8" fill={`url(#scaleDomeGrad_${petId})`} />
              <circle cx="158.5" cy="104.5" r="1.3" fill="#FFFFFF" opacity="0.8" />

              {/* Lower flank scale cluster */}
              <circle cx="148" cy="148" r="4.5" fill={`url(#scaleDomeGrad_${petId})`} />
              <circle cx="146.5" cy="146.5" r="1.5" fill="#FFFFFF" opacity="0.8" />

              <circle cx="157" cy="155" r="3.8" fill={`url(#scaleDomeGrad_${petId})`} />
              <circle cx="155.5" cy="153.5" r="1.3" fill="#FFFFFF" opacity="0.8" />
            </g>

            {/* ----------------------------------------------------------- */}
            {/* CUTE 3D ROUNDED DINOSAUR SNOUT & LONG MOUTH                */}
            {/* ----------------------------------------------------------- */}
            <g id="dino_snout_and_head">
              {/* Chubby 3D Head & Rounded Forward Snout */}
              <path
                d="M 120 28 C 98 28, 76 34, 56 46 C 40 56, 36 72, 48 82 C 64 92, 98 90, 126 84 C 146 80, 154 52, 142 36 C 135 29, 128 28, 120 28 Z"
                fill={`url(#bodyGrad3D_${petId})`}
              />

              {/* 3D Snout Specular Sheen */}
              <ellipse cx="72" cy="52" rx="18" ry="8" transform="rotate(-18 72 52)" fill="#FFFFFF" opacity="0.45" />

              {/* Cute 3D Nostril Dimples with Highlight */}
              <ellipse cx="48" cy="66" rx="3.5" ry="2.2" fill={p.deep} transform="rotate(-15 48 66)" />
              <ellipse cx="47" cy="65" rx="1.5" ry="0.8" fill="#FFFFFF" opacity="0.6" transform="rotate(-15 47 65)" />

              {/* Soft Brow Ridge */}
              <path d="M 64 45 Q 80 38 98 42" stroke={p.dark} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />

              {/* CUTE MOUTH & CHICLET TEETH */}
              {isSleeping ? (
                <g>
                  {/* Peaceful Sweet Sleeping Smile */}
                  <path d="M 46 76 Q 75 84 116 80" stroke="#064E3B" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Cute chiclet tooth tip peeking */}
                  <rect x="58" y="75" width="4.5" height="5" rx="1.8" fill="#FFFFFF" />
                  <rect x="76" y="76" width="4.5" height="5" rx="1.8" fill="#FFFFFF" />
                </g>
              ) : mouthOpen ? (
                /* BIG JOYFUL OPEN 3D MOUTH (NOM NOM!) */
                <g id="dino_mouth_open">
                  {/* Deep 3D Oral Cavity */}
                  <path
                    d="M 44 72 Q 85 75 116 80 L 112 106 Q 76 112 46 94 Z"
                    fill="url(#mouth3DCavity)"
                  />
                  {/* Plump 3D Pink Tongue */}
                  <path
                    d="M 62 94 Q 84 84 104 94 Q 84 108 62 94 Z"
                    fill="url(#tongue3D)"
                  />
                  <ellipse cx="82" cy="94" rx="8" ry="3" fill="#FDA4AF" opacity="0.7" />

                  {/* Adorable Rounded White Chiclet Teeth (Not Sharp Needles!) */}
                  <rect x="48" y="72" width="5.5" height="6.5" rx="2" fill="#FFFFFF" />
                  <rect x="58" y="73" width="5.5" height="7.5" rx="2" fill="#FFFFFF" />
                  <rect x="70" y="74" width="5.5" height="7.5" rx="2" fill="#FFFFFF" />
                  <rect x="82" y="75" width="5.5" height="7" rx="2" fill="#FFFFFF" />
                  <rect x="94" y="76" width="5" height="6" rx="2" fill="#FFFFFF" />

                  {/* Bottom Rounded Teeth */}
                  <rect x="54" y="88" width="5" height="6" rx="2" fill="#FFFFFF" />
                  <rect x="68" y="90" width="5.5" height="6.5" rx="2" fill="#FFFFFF" />
                  <rect x="82" y="91" width="5.5" height="6.5" rx="2" fill="#FFFFFF" />

                  {/* Lower Jaw Contour */}
                  <path
                    d="M 44 94 Q 76 114 114 106"
                    stroke={p.deep}
                    strokeWidth="3.2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </g>
              ) : isChewing ? (
                /* CHEWING CUTE MOUTH */
                <g>
                  <path d="M 46 76 Q 78 92 116 80" stroke="#064E3B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  <rect x="62" y="77" width="5" height="6" rx="2" fill="#FFFFFF" />
                  <rect x="80" y="78" width="5" height="6" rx="2" fill="#FFFFFF" />
                </g>
              ) : (
                /* SWEET CHUBBY CLOSED SMILE WITH CUTE TEETH PEEKING */
                <g>
                  <path
                    d="M 44 74 Q 68 84 116 78"
                    stroke="#064E3B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Cute rounded teeth tips */}
                  <rect x="52" y="74" width="5" height="5.5" rx="2" fill="#FFFFFF" />
                  <rect x="68" y="76" width="5" height="6" rx="2" fill="#FFFFFF" />
                  <rect x="84" y="77" width="5" height="5.5" rx="2" fill="#FFFFFF" />
                  <rect x="98" y="77" width="4.5" height="5" rx="2" fill="#FFFFFF" />
                  {/* Smile dimple */}
                  <circle cx="118" cy="77" r="2.5" fill="#047857" />
                </g>
              )}
            </g>

            {/* BIG SOULFUL 3D SPARKLING PIXAR EYES */}
            <g id="dino_eyes">
              {isSleeping ? (
                <path d="M 80 54 Q 94 64 108 54" stroke="#064E3B" strokeWidth="4" strokeLinecap="round" fill="none" />
              ) : isHappy ? (
                <path d="M 78 56 Q 94 40 110 56" stroke="#064E3B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              ) : (
                <g>
                  {/* Eye Sclera with 3D Depth */}
                  <ellipse cx="94" cy="50" rx="18" ry="17" fill="#FFFFFF" />
                  <path d="M 78 44 Q 94 38 110 44" stroke="#0F172A" strokeWidth="1.5" fill="none" opacity="0.3" />

                  {/* 3D Multi-Stop Glassy Emerald Iris */}
                  <ellipse cx="96" cy="50" rx="12" ry="12" fill={`url(#irisGrad3D_${petId})`} />

                  {/* Deep Black Pupil */}
                  <circle cx="97" cy="50" r="6.5" fill="#020617" />

                  {/* Primary Specular Star Catchlight */}
                  <circle cx="92" cy="44" r="4.5" fill="#FFFFFF" />

                  {/* Secondary Twinkle Catchlight */}
                  <circle cx="102" cy="55" r="2" fill="#FFFFFF" />

                  {/* Bottom Crescent Bounce Light Reflection */}
                  <path d="M 90 56 Q 96 61 103 56" stroke="#A7F3D0" strokeWidth="1.8" fill="none" opacity="0.8" />
                </g>
              )}
              {/* Soft Rosy 3D Cheek Blush */}
              <ellipse cx="112" cy="68" rx="11" ry="7" fill={p.cheek} opacity="0.6" />
            </g>

            {/* Cute Chubby 3D Raptor Arms with Rounded Claws */}
            <g id="dino_arms">
              {/* Left Arm */}
              <path
                d="M 84 124 C 70 128, 58 140, 64 150 C 70 156, 78 150, 86 140 Z"
                fill={`url(#bodyGrad3D_${petId})`}
              />
              <ellipse cx="64" cy="148" rx="2" ry="3" fill="#FFFFFF" />
              <ellipse cx="68" cy="151" rx="2" ry="3" fill="#FFFFFF" />

              {/* Right Arm */}
              <path
                d="M 126 128 C 138 132, 150 144, 144 154 C 138 158, 130 152, 122 142 Z"
                fill={`url(#bodyGrad3D_${petId})`}
              />
              <ellipse cx="144" cy="150" rx="2" ry="3" fill="#FFFFFF" />
              <ellipse cx="140" cy="154" rx="2" ry="3" fill="#FFFFFF" />
            </g>
          </g>
        )}

        {/* ================================================================= */}
        {/* 2. BUNNY: ADORABLE 3D PLUSH BUNNY (PIXAR EARS & COTTON TAIL)      */}
        {/* ================================================================= */}
        {petId === 'bunny' && (
          <g id="cute_3d_bunny">
            {/* Puffy 3D Marshmallow Cotton Tail */}
            <g id="bunny_tail">
              <circle cx="178" cy="165" r="20" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(157, 23, 77, 0.2))" />
              <circle cx="175" cy="162" r="15" fill="#FFF1F2" />
              <circle cx="172" cy="158" r="6" fill="#FFFFFF" opacity="0.8" />
            </g>

            {/* Velvety 3D Bunny Ears with Soft Inner Pink Glow */}
            <g id="bunny_ears">
              {/* Left Ear */}
              <path
                d="M 80 72 C 50 -10, 82 -28, 102 65 Z"
                fill={`url(#bodyGrad3D_${petId})`}
              />
              <path d="M 83 64 C 68 8, 86 0, 97 60 Z" fill={p.innerEar} opacity="0.85" />
              <path d="M 76 50 Q 82 10 92 4" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.5" />

              {/* Right Ear */}
              <path
                d="M 160 72 C 190 -10, 158 -28, 138 65 Z"
                fill={`url(#bodyGrad3D_${petId})`}
              />
              <path d="M 157 64 C 172 8, 154 0, 143 60 Z" fill={p.innerEar} opacity="0.85" />
              <path d="M 164 50 Q 158 10 148 4" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.5" />
            </g>

            {/* Chubby Hind Thighs & Feet */}
            <ellipse cx="72" cy="180" rx="26" ry="18" fill={p.mid} />
            <ellipse cx="168" cy="180" rx="26" ry="18" fill={p.mid} />
            <ellipse cx="68" cy="204" rx="18" ry="11" fill="#FFFFFF" />
            <ellipse cx="172" cy="204" rx="18" ry="11" fill="#FFFFFF" />

            {/* Plump 3D Plush Body */}
            <path
              d="M 120 52 C 172 52, 190 94, 190 152 C 190 200, 164 210, 120 210 C 76 210, 50 200, 50 152 C 50 94, 68 52, 120 52 Z"
              fill={`url(#bodyGrad3D_${petId})`}
            />

            {/* Creamy 3D Belly Patch */}
            <ellipse cx="120" cy="158" rx="46" ry="42" fill={`url(#bellyGrad3D_${petId})`} />

            {/* Cheek Fur Fluff */}
            <circle cx="56" cy="128" r="14" fill={`url(#bodyGrad3D_${petId})`} />
            <circle cx="184" cy="128" r="14" fill={`url(#bodyGrad3D_${petId})`} />

            {/* Big Sparkling 3D Bunny Eyes */}
            <g id="bunny_eyes">
              {isSleeping ? (
                <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 76 100 Q 88 110 100 100" />
                  <path d="M 140 100 Q 152 110 164 100" />
                </g>
              ) : isHappy ? (
                <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 74 98 Q 88 84 102 98" />
                  <path d="M 138 98 Q 152 84 166 98" />
                </g>
              ) : (
                <g>
                  {/* Left Eye */}
                  <ellipse cx="88" cy="96" rx="16" ry="15" fill="#FFFFFF" />
                  <ellipse cx="90" cy="96" rx="11" ry="11" fill={`url(#irisGrad3D_${petId})`} />
                  <circle cx="91" cy="96" r="6" fill="#020617" />
                  <circle cx="86" cy="91" r="4.5" fill="#FFFFFF" />
                  <circle cx="95" cy="100" r="1.8" fill="#FFFFFF" />

                  {/* Right Eye */}
                  <ellipse cx="152" cy="96" rx="16" ry="15" fill="#FFFFFF" />
                  <ellipse cx="150" cy="96" rx="11" ry="11" fill={`url(#irisGrad3D_${petId})`} />
                  <circle cx="149" cy="96" r="6" fill="#020617" />
                  <circle cx="145" cy="91" r="4.5" fill="#FFFFFF" />
                  <circle cx="154" cy="100" r="1.8" fill="#FFFFFF" />
                </g>
              )}
              {/* Rosy Cheeks */}
              <ellipse cx="68" cy="120" rx="13" ry="8" fill={p.cheek} opacity="0.65" />
              <ellipse cx="172" cy="120" rx="13" ry="8" fill={p.cheek} opacity="0.65" />
            </g>

            {/* Pink Button Nose & Cute Buck Teeth */}
            <g id="bunny_snout">
              <ellipse cx="120" cy="116" rx="6" ry="4.5" fill={p.nose} />
              <ellipse cx="119" cy="115" rx="2" ry="1" fill="#FFFFFF" opacity="0.7" />
              <line x1="120" y1="120" x2="120" y2="126" stroke="#0F172A" strokeWidth="2.5" />

              {/* Whiskers */}
              <g stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" opacity="0.6">
                <line x1="90" y1="120" x2="54" y2="114" />
                <line x1="90" y1="126" x2="56" y2="128" />
                <line x1="150" y1="120" x2="186" y2="114" />
                <line x1="150" y1="126" x2="184" y2="128" />
              </g>

              {mouthOpen ? (
                <g>
                  <path d="M 104 126 Q 120 150 136 126 Z" fill="url(#mouth3DCavity)" />
                  <ellipse cx="120" cy="142" rx="9" ry="5" fill="url(#tongue3D)" />
                  <rect x="115" y="126" width="4.5" height="6.5" rx="1.5" fill="#FFFFFF" />
                  <rect x="120.5" y="126" width="4.5" height="6.5" rx="1.5" fill="#FFFFFF" />
                </g>
              ) : isChewing ? (
                <path d="M 108 128 Q 120 142 132 128" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
              ) : (
                <g>
                  <path d="M 110 126 Q 115 132 120 126 Q 125 132 130 126" stroke="#0F172A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                  <rect x="116" y="126" width="3.5" height="5" rx="1" fill="#FFFFFF" />
                  <rect x="120.5" y="126" width="3.5" height="5" rx="1" fill="#FFFFFF" />
                </g>
              )}
            </g>

            {/* Front Bunny Paws */}
            <g id="bunny_front_paws">
              <ellipse cx="102" cy="180" rx="11" ry="8" fill="#FFFFFF" />
              <ellipse cx="138" cy="180" rx="11" ry="8" fill="#FFFFFF" />
            </g>
          </g>
        )}

        {/* ================================================================= */}
        {/* 3. PUPPY: ADORABLE 3D GOLDEN PUP (FLOPPY EARS, WAG TAIL, TONGUE)  */}
        {/* ================================================================= */}
        {petId === 'puppy' && (
          <g id="cute_3d_puppy">
            {/* Arched Wagging 3D Dog Tail */}
            <path
              d="M 165 155 C 190 140, 218 110, 208 88 C 202 78, 194 86, 198 102 C 202 120, 180 145, 155 165 Z"
              fill={`url(#bodyGrad3D_${petId})`}
              className="animate-bounce"
            />

            {/* Velvety 3D Floppy Hound Ears */}
            <g id="puppy_ears">
              <path
                d="M 66 54 Q 16 70 26 122 Q 54 120 72 86 Z"
                fill={`url(#bodyGrad3D_${petId})`}
              />
              <path d="M 62 60 Q 30 76 38 110 Q 54 108 68 86 Z" fill={p.deep} opacity="0.3" />

              <path
                d="M 174 54 Q 224 70 214 122 Q 186 120 168 86 Z"
                fill={`url(#bodyGrad3D_${petId})`}
              />
              <path d="M 178 60 Q 210 76 202 110 Q 186 108 172 86 Z" fill={p.deep} opacity="0.3" />
            </g>

            {/* Rounded 3D Puppy Body & Paws */}
            <ellipse cx="72" cy="204" rx="20" ry="12" fill={p.dark} />
            <ellipse cx="168" cy="204" rx="20" ry="12" fill={p.dark} />

            <path
              d="M 120 44 C 174 44, 194 84, 194 146 C 194 196, 170 210, 120 210 C 70 210, 46 196, 46 146 C 46 84, 66 44, 120 44 Z"
              fill={`url(#bodyGrad3D_${petId})`}
            />

            {/* Soft Creamy Chest Fluff */}
            <ellipse cx="120" cy="162" rx="42" ry="38" fill={`url(#bellyGrad3D_${petId})`} />

            {/* Big Melt-Your-Heart Puppy Eyes */}
            <g id="puppy_eyes">
              {isSleeping ? (
                <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 76 94 Q 88 104 100 94" />
                  <path d="M 140 94 Q 152 104 164 94" />
                </g>
              ) : isHappy ? (
                <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 74 92 Q 88 78 102 92" />
                  <path d="M 138 92 Q 152 78 166 92" />
                </g>
              ) : (
                <g>
                  <ellipse cx="88" cy="88" rx="15" ry="14" fill="#FFFFFF" />
                  <ellipse cx="89" cy="88" rx="11" ry="11" fill={`url(#irisGrad3D_${petId})`} />
                  <circle cx="90" cy="88" r="6" fill="#020617" />
                  <circle cx="86" cy="84" r="4.5" fill="#FFFFFF" />
                  <circle cx="94" cy="92" r="1.8" fill="#FFFFFF" />

                  <ellipse cx="152" cy="88" rx="15" ry="14" fill="#FFFFFF" />
                  <ellipse cx="151" cy="88" rx="11" ry="11" fill={`url(#irisGrad3D_${petId})`} />
                  <circle cx="150" cy="88" r="6" fill="#020617" />
                  <circle cx="146" cy="84" r="4.5" fill="#FFFFFF" />
                  <circle cx="154" cy="92" r="1.8" fill="#FFFFFF" />
                </g>
              )}
              {/* Rosy Cheeks */}
              <ellipse cx="66" cy="114" rx="13" ry="8" fill={p.cheek} opacity="0.6" />
              <ellipse cx="174" cy="114" rx="13" ry="8" fill={p.cheek} opacity="0.6" />
            </g>

            {/* Chubby 3D Snout & Glossy Black Nose */}
            <g id="puppy_snout">
              <ellipse cx="120" cy="120" rx="24" ry="18" fill={p.muzzleBase} />
              <ellipse cx="120" cy="114" rx="20" ry="10" fill="#FFFFFF" opacity="0.4" />

              {/* Glossy Black Nose with Specular Highlight */}
              <ellipse cx="120" cy="108" rx="10" ry="7" fill={p.nose} />
              <ellipse cx="118" cy="106" rx="3.5" ry="1.8" fill="#FFFFFF" opacity="0.8" />

              {mouthOpen ? (
                <g>
                  <path d="M 104 122 Q 120 116 136 122 C 140 152, 100 152, 104 122 Z" fill="url(#mouth3DCavity)" />
                  <path d="M 112 132 C 112 155, 128 155, 128 132 Z" fill="url(#tongue3D)" />
                  <ellipse cx="120" cy="144" rx="5" ry="2" fill="#FDA4AF" opacity="0.8" />
                </g>
              ) : isChewing ? (
                <path d="M 108 126 Q 120 140 132 126" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M 108 122 Q 114 130 120 124 Q 126 130 132 122" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
              )}
            </g>

            {/* Front Paws */}
            <ellipse cx="98" cy="186" rx="14" ry="10" fill={p.light} />
            <ellipse cx="142" cy="186" rx="14" ry="10" fill={p.light} />
          </g>
        )}

        {/* ================================================================= */}
        {/* 4. KITTEN: ADORABLE 3D COZY KITTEN (SAPPHIRE EYES, FLUFFY S-TAIL) */}
        {/* ================================================================= */}
        {petId === 'kitten' && (
          <g id="cute_3d_kitten">
            {/* Graceful Fluffy 3D Cat Tail */}
            <path
              d="M 160 162 C 190 160, 218 135, 214 105 C 210 80, 192 78, 196 92 C 198 104, 185 130, 150 174 Z"
              fill={`url(#bodyGrad3D_${petId})`}
            />

            {/* Alert 3D Triangular Ears with Fluffy Tuft */}
            <g id="kitten_ears">
              <polygon points="56,72 74,18 104,60" fill={`url(#bodyGrad3D_${petId})`} />
              <polygon points="65,64 75,28 97,56" fill={p.innerEar} />
              <path d="M 72 56 L 78 44 L 84 56" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              <polygon points="184,72 166,18 136,60" fill={`url(#bodyGrad3D_${petId})`} />
              <polygon points="175,64 165,28 143,56" fill={p.innerEar} />
              <path d="M 168 56 L 162 44 L 156 56" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>

            {/* Plump Feline Body */}
            <path
              d="M 120 48 C 168 48, 188 88, 188 148 C 188 198, 164 210, 120 210 C 76 210, 52 198, 52 148 C 52 88, 72 48, 120 48 Z"
              fill={`url(#bodyGrad3D_${petId})`}
            />

            {/* Soft Creamy Belly Bib */}
            <ellipse cx="120" cy="158" rx="44" ry="40" fill={`url(#bellyGrad3D_${petId})`} />

            {/* Luminous 3D Sapphire Eyes */}
            <g id="kitten_eyes">
              {isSleeping ? (
                <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 76 96 Q 88 106 100 96" />
                  <path d="M 140 96 Q 152 106 164 96" />
                </g>
              ) : isHappy ? (
                <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 74 94 Q 88 80 102 94" />
                  <path d="M 138 94 Q 152 80 166 94" />
                </g>
              ) : (
                <g>
                  <ellipse cx="88" cy="92" rx="15" ry="14" fill="#FFFFFF" />
                  <ellipse cx="89" cy="92" rx="11" ry="11" fill={`url(#irisGrad3D_${petId})`} />
                  <ellipse cx="90" cy="92" rx="4" ry="8" fill="#020617" />
                  <circle cx="86" cy="87" r="4.5" fill="#FFFFFF" />
                  <circle cx="94" cy="96" r="1.8" fill="#FFFFFF" />

                  <ellipse cx="152" cy="92" rx="15" ry="14" fill="#FFFFFF" />
                  <ellipse cx="151" cy="92" rx="11" ry="11" fill={`url(#irisGrad3D_${petId})`} />
                  <ellipse cx="150" cy="92" rx="4" ry="8" fill="#020617" />
                  <circle cx="147" cy="87" r="4.5" fill="#FFFFFF" />
                  <circle cx="154" cy="96" r="1.8" fill="#FFFFFF" />
                </g>
              )}
              {/* Rosy Cheeks */}
              <ellipse cx="68" cy="116" rx="12" ry="7" fill={p.cheek} opacity="0.6" />
              <ellipse cx="172" cy="116" rx="12" ry="7" fill={p.cheek} opacity="0.6" />
            </g>

            {/* Dainty Pink Nose & Arched Whiskers */}
            <g id="kitten_snout">
              <polygon points="120,116 114,110 126,110" fill={p.nose} />
              <ellipse cx="119" cy="111" rx="2" ry="1" fill="#FFFFFF" opacity="0.8" />

              <g stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
                <path d="M 94 116 Q 70 110 50 114" fill="none" />
                <path d="M 94 122 Q 72 124 54 130" fill="none" />
                <path d="M 146 116 Q 170 110 190 114" fill="none" />
                <path d="M 146 122 Q 168 124 186 130" fill="none" />
              </g>

              {mouthOpen ? (
                <path d="M 106 122 Q 120 144 134 122 Z" fill="url(#mouth3DCavity)" />
              ) : isChewing ? (
                <path d="M 110 124 Q 120 136 130 124" stroke="#0F172A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M 110 122 Q 115 128 120 122 Q 125 128 130 122" stroke="#0F172A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
              )}
            </g>

            {/* Front Paws */}
            <ellipse cx="102" cy="184" rx="11" ry="8" fill={p.light} />
            <ellipse cx="138" cy="184" rx="11" ry="8" fill={p.light} />
          </g>
        )}

        {/* ================================================================= */}
        {/* 5. PANDA: ADORABLE 3D MARSHMALLOW PANDA (VELVET PATCHES & EARS)   */}
        {/* ================================================================= */}
        {petId === 'panda' && (
          <g id="cute_3d_panda">
            {/* Stubby Bear Tail */}
            <circle cx="180" cy="168" r="14" fill={p.blackFurBase} />

            {/* Fuzzy Round Bear Ears with 3D Depth */}
            <circle cx="68" cy="48" r="24" fill={p.blackFurBase} />
            <circle cx="70" cy="48" r="14" fill={p.blackFurLight} opacity="0.6" />
            <circle cx="172" cy="48" r="24" fill={p.blackFurBase} />
            <circle cx="170" cy="48" r="14" fill={p.blackFurLight} opacity="0.6" />

            {/* Chubby Hind Legs */}
            <ellipse cx="70" cy="198" rx="24" ry="16" fill={p.blackFurBase} />
            <ellipse cx="170" cy="198" rx="24" ry="16" fill={p.blackFurBase} />

            {/* White Plush Body */}
            <path
              d="M 120 45 C 174 45, 196 85, 196 148 C 196 200, 168 210, 120 210 C 72 210, 44 200, 44 148 C 44 85, 66 45, 120 45 Z"
              fill={`url(#bodyGrad3D_${petId})`}
            />

            {/* 3D Black Saddle Band across Shoulders & Arms */}
            <path
              d="M 46 128 C 44 148, 62 165, 88 165 C 104 165, 136 165, 152 165 C 178 165, 196 148, 194 128 C 182 108, 160 100, 120 100 C 80 100, 58 108, 46 128 Z"
              fill={p.blackFurBase}
            />
            <ellipse cx="120" cy="178" rx="36" ry="24" fill="#FFFFFF" />

            {/* Velvety 3D Panda Eye Patches */}
            <ellipse cx="84" cy="92" rx="22" ry="18" fill={p.blackFurBase} transform="rotate(-18 84 92)" />
            <ellipse cx="156" cy="92" rx="22" ry="18" fill={p.blackFurBase} transform="rotate(18 156 92)" />

            {/* Gentle Sparkling Panda Eyes */}
            <g id="panda_eyes">
              {isSleeping ? (
                <g stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none">
                  <path d="M 76 92 Q 84 100 92 92" />
                  <path d="M 148 92 Q 156 100 164 92" />
                </g>
              ) : isHappy ? (
                <g stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 76 90 Q 84 80 92 90" />
                  <path d="M 148 90 Q 156 80 164 90" />
                </g>
              ) : (
                <g>
                  <circle cx="85" cy="90" r="12" fill="#FFFFFF" />
                  <circle cx="86" cy="90" r="8.5" fill={p.blackFurLight} />
                  <circle cx="87" cy="90" r="5" fill="#020617" />
                  <circle cx="84" cy="86" r="3.5" fill="#FFFFFF" />

                  <circle cx="155" cy="90" r="12" fill="#FFFFFF" />
                  <circle cx="154" cy="90" r="8.5" fill={p.blackFurLight} />
                  <circle cx="153" cy="90" r="5" fill="#020617" />
                  <circle cx="152" cy="86" r="3.5" fill="#FFFFFF" />
                </g>
              )}
            </g>

            {/* Broad Bear Muzzle & Nose */}
            <g id="panda_snout">
              <ellipse cx="120" cy="118" rx="16" ry="12" fill="#FFFFFF" />
              <ellipse cx="120" cy="112" rx="9" ry="6" fill={p.nose} />
              <ellipse cx="118" cy="110" rx="3" ry="1.5" fill="#FFFFFF" opacity="0.8" />
              <line x1="120" y1="116" x2="120" y2="122" stroke="#0F172A" strokeWidth="2" />
              {mouthOpen ? (
                <ellipse cx="120" cy="126" rx="8" ry="6" fill="url(#mouth3DCavity)" />
              ) : (
                <path d="M 112 124 Q 120 130 128 124" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              )}
            </g>

            {/* Front Paws */}
            <ellipse cx="90" cy="162" rx="16" ry="13" fill={p.blackFurBase} />
            <ellipse cx="150" cy="162" rx="16" ry="13" fill={p.blackFurBase} />
          </g>
        )}

        {/* ================================================================= */}
        {/* 6. FOX: ADORABLE 3D WOODLAND FOX (SUPER FLUFFY BUSHY TAIL & RUFF) */}
        {/* ================================================================= */}
        {petId === 'fox' && (
          <g id="cute_3d_fox">
            {/* Magnificent Ultra-Fluffy 3D Bushy Tail with Cloud White Tip */}
            <g id="fox_tail">
              <path
                d="M 155 160 C 195 155, 236 120, 226 76 C 220 52, 196 66, 185 95 C 172 125, 170 150, 150 178 Z"
                fill={`url(#bodyGrad3D_${petId})`}
              />
              <path
                d="M 226 76 C 224 62, 212 54, 198 66 C 206 82, 218 85, 226 76 Z"
                fill="#FFFFFF"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
              />
            </g>

            {/* Pointed 3D Fox Ears with Dark Backing & White Fluff */}
            <g id="fox_ears">
              <polygon points="52,68 68,8 104,58" fill={`url(#bodyGrad3D_${petId})`} />
              <polygon points="62,60 70,20 96,52" fill="#FFFFFF" />
              <polygon points="64,10 70,14 66,22" fill="#0F172A" />

              <polygon points="188,68 172,8 136,58" fill={`url(#bodyGrad3D_${petId})`} />
              <polygon points="178,60 170,20 144,52" fill="#FFFFFF" />
              <polygon points="176,10 170,14 174,22" fill="#0F172A" />
            </g>

            {/* Plump Fox Body & Black Stocking Feet */}
            <ellipse cx="72" cy="204" rx="18" ry="11" fill="#1E1B18" />
            <ellipse cx="168" cy="204" rx="18" ry="11" fill="#1E1B18" />

            <path
              d="M 120 48 C 168 48, 188 88, 188 148 C 188 198, 164 210, 120 210 C 76 210, 52 198, 52 148 C 52 88, 72 48, 120 48 Z"
              fill={`url(#bodyGrad3D_${petId})`}
            />

            {/* Fluffy White 3D Chest Bib / Ruff */}
            <path
              d="M 120 108 C 95 108, 80 135, 80 172 C 80 198, 102 206, 120 206 C 138 206, 160 198, 160 172 C 160 135, 145 108, 120 108 Z"
              fill="#FFFFFF"
            />
            <path d="M 44 116 Q 66 112 76 128 Q 54 136 44 116 Z" fill="#FFFFFF" />
            <path d="M 196 116 Q 174 112 164 128 Q 186 136 196 116 Z" fill="#FFFFFF" />

            {/* Fox Amber Eyes */}
            <g id="fox_eyes">
              {isSleeping ? (
                <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 76 94 Q 88 104 100 94" />
                  <path d="M 140 94 Q 152 104 164 94" />
                </g>
              ) : isHappy ? (
                <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 74 92 Q 88 78 102 92" />
                  <path d="M 138 92 Q 152 78 166 92" />
                </g>
              ) : (
                <g>
                  <ellipse cx="88" cy="90" rx="15" ry="14" fill="#FFFFFF" />
                  <ellipse cx="89" cy="90" rx="11" ry="11" fill={`url(#irisGrad3D_${petId})`} />
                  <circle cx="90" cy="90" r="6" fill="#020617" />
                  <circle cx="86" cy="85" r="4.5" fill="#FFFFFF" />
                  <circle cx="94" cy="94" r="1.8" fill="#FFFFFF" />

                  <ellipse cx="152" cy="90" rx="15" ry="14" fill="#FFFFFF" />
                  <ellipse cx="151" cy="90" rx="11" ry="11" fill={`url(#irisGrad3D_${petId})`} />
                  <circle cx="150" cy="90" r="6" fill="#020617" />
                  <circle cx="146" cy="85" r="4.5" fill="#FFFFFF" />
                  <circle cx="154" cy="94" r="1.8" fill="#FFFFFF" />
                </g>
              )}
            </g>

            {/* Fox Snout & Nose */}
            <g id="fox_snout">
              <polygon points="120,126 106,108 134,108" fill="#FFFFFF" />
              <polygon points="120,126 114,118 126,118" fill="#18181B" />
              <ellipse cx="119" cy="119" rx="2" ry="1" fill="#FFFFFF" opacity="0.8" />

              {mouthOpen ? (
                <path d="M 108 126 Q 120 144 132 126 Z" fill="url(#mouth3DCavity)" />
              ) : (
                <path d="M 112 125 Q 120 130 128 125" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              )}
            </g>

            {/* Front Paws in Black Stockings */}
            <ellipse cx="102" cy="184" rx="11" ry="8" fill="#1E1B18" />
            <ellipse cx="138" cy="184" rx="11" ry="8" fill="#1E1B18" />
          </g>
        )}

        {/* ================================================================= */}
        {/* 7. PENGUIN: ADORABLE 3D BABY PENGUIN (GLOSSY CERAMIC/VINYL SHINE) */}
        {/* ================================================================= */}
        {petId === 'penguin' && (
          <g id="cute_3d_penguin">
            {/* Orange Webbed Feet */}
            <path d="M 64 205 C 55 208, 52 216, 75 216 C 88 216, 88 208, 80 205 Z" fill="#F59E0B" />
            <path d="M 160 205 C 152 208, 152 216, 165 216 C 188 216, 185 208, 176 205 Z" fill="#F59E0B" />

            {/* Glossy Ceramic/Vinyl Torpedo Body */}
            <path
              d="M 120 32 C 166 32, 192 78, 192 148 C 192 198, 164 210, 120 210 C 76 210, 48 198, 48 148 C 48 78, 74 32, 120 32 Z"
              fill={`url(#bodyGrad3D_${petId})`}
            />

            {/* Golden Auricular Sunset Head Glow */}
            <path d="M 64 62 C 64 48, 80 44, 88 64 C 92 84, 76 96, 68 84 Z" fill="#F59E0B" opacity="0.9" />
            <path d="M 176 62 C 176 48, 160 44, 152 64 C 148 84, 164 96, 172 84 Z" fill="#F59E0B" opacity="0.9" />

            {/* Clean Tuxedo White Belly & Golden Throat Swirl */}
            <path
              d="M 120 64 C 152 64, 166 102, 166 156 C 166 196, 146 206, 120 206 C 94 206, 74 196, 74 156 C 74 102, 88 64, 120 64 Z"
              fill="#FFFFFF"
            />
            <path d="M 98 76 C 112 68, 128 68, 142 76 C 138 98, 102 98, 98 76 Z" fill="#F59E0B" opacity="0.85" />

            {/* Flippers Held Out Waddling */}
            <path d="M 52 110 C 24 125, 26 165, 48 175 C 56 172, 62 145, 60 118 Z" fill={`url(#bodyGrad3D_${petId})`} />
            <path d="M 188 110 C 216 125, 214 165, 192 175 C 184 172, 178 145, 180 118 Z" fill={`url(#bodyGrad3D_${petId})`} />

            {/* Big Starry Penguin Eyes */}
            <g id="penguin_eyes">
              {isSleeping ? (
                <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 80 94 Q 90 102 100 94" />
                  <path d="M 140 94 Q 150 102 160 94" />
                </g>
              ) : isHappy ? (
                <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 78 92 Q 90 80 102 92" />
                  <path d="M 138 92 Q 150 80 162 92" />
                </g>
              ) : (
                <g>
                  <ellipse cx="90" cy="90" rx="14" ry="13" fill="#FFFFFF" />
                  <ellipse cx="91" cy="90" rx="9.5" ry="9.5" fill={`url(#irisGrad3D_${petId})`} />
                  <circle cx="92" cy="90" r="5" fill="#020617" />
                  <circle cx="88" cy="86" r="4" fill="#FFFFFF" />

                  <ellipse cx="150" cy="90" rx="14" ry="13" fill="#FFFFFF" />
                  <ellipse cx="149" cy="90" rx="9.5" ry="9.5" fill={`url(#irisGrad3D_${petId})`} />
                  <circle cx="148" cy="90" r="5" fill="#020617" />
                  <circle cx="146" cy="86" r="4" fill="#FFFFFF" />
                </g>
              )}
            </g>

            {/* Cute 3D Beak */}
            <g id="penguin_beak">
              {mouthOpen ? (
                <g>
                  <polygon points="120,98 104,114 136,114" fill="#F59E0B" />
                  <polygon points="120,126 108,114 132,114" fill="#D97706" />
                  <ellipse cx="120" cy="114" rx="10" ry="4" fill="url(#mouth3DCavity)" />
                </g>
              ) : (
                <polygon points="120,102 106,120 134,120" fill="#F59E0B" />
              )}
            </g>
          </g>
        )}

        {/* ================================================================= */}
        {/* 8. HAMSTER: ADORABLE 3D SQUISHY HAMSTER (OVERFLOWING CHEEKS)      */}
        {/* ================================================================= */}
        {petId === 'hamster' && (
          <g id="cute_3d_hamster">
            {/* Tiny Pink Nub Tail */}
            <circle cx="182" cy="172" r="7" fill={p.paws} />

            {/* Delicate 3D Pink-Lined Ears */}
            <circle cx="64" cy="54" r="20" fill={`url(#bodyGrad3D_${petId})`} />
            <circle cx="64" cy="54" r="12" fill={p.paws} />
            <circle cx="176" cy="54" r="20" fill={`url(#bodyGrad3D_${petId})`} />
            <circle cx="176" cy="54" r="12" fill={p.paws} />

            {/* Pear-Shaped Chubby Body */}
            <path
              d="M 120 54 C 160 54, 185 80, 196 112 C 210 148, 192 195, 150 205 C 132 208, 108 208, 90 205 C 48 195, 30 148, 44 112 C 55 80, 80 54, 120 54 Z"
              fill={`url(#bodyGrad3D_${petId})`}
            />

            <ellipse cx="120" cy="164" rx="48" ry="38" fill={`url(#bellyGrad3D_${petId})`} />

            {/* Squishy Stuffed 3D Cheek Pouches */}
            <ellipse cx="62" cy="126" rx="24" ry="20" fill={p.light} />
            <ellipse cx="178" cy="126" rx="24" ry="20" fill={p.light} />

            {/* Big Boba-Like Hamster Eyes */}
            <g id="hamster_eyes">
              {isSleeping ? (
                <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 76 96 Q 88 106 100 96" />
                  <path d="M 140 96 Q 152 106 164 96" />
                </g>
              ) : isHappy ? (
                <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M 74 94 Q 88 80 102 94" />
                  <path d="M 138 94 Q 152 80 166 94" />
                </g>
              ) : (
                <g>
                  <ellipse cx="88" cy="94" rx="15" ry="14" fill="#FFFFFF" />
                  <ellipse cx="89" cy="94" rx="11" ry="11" fill={`url(#irisGrad3D_${petId})`} />
                  <circle cx="90" cy="94" r="6" fill="#020617" />
                  <circle cx="86" cy="89" r="4.5" fill="#FFFFFF" />
                  <circle cx="94" cy="98" r="1.8" fill="#FFFFFF" />

                  <ellipse cx="152" cy="94" rx="15" ry="14" fill="#FFFFFF" />
                  <ellipse cx="151" cy="94" rx="11" ry="11" fill={`url(#irisGrad3D_${petId})`} />
                  <circle cx="150" cy="94" r="6" fill="#020617" />
                  <circle cx="146" cy="89" r="4.5" fill="#FFFFFF" />
                  <circle cx="154" cy="98" r="1.8" fill="#FFFFFF" />
                </g>
              )}
              {/* Rosy Cheek Blush */}
              <ellipse cx="62" cy="132" rx="13" ry="8" fill={p.cheek} opacity="0.75" />
              <ellipse cx="178" cy="132" rx="13" ry="8" fill={p.cheek} opacity="0.75" />
            </g>

            {/* Pink Twitchy Nose & Buck Incisors */}
            <g id="hamster_snout">
              <ellipse cx="120" cy="116" rx="5.5" ry="4" fill={p.nose} />
              <ellipse cx="119" cy="115" rx="2" ry="1" fill="#FFFFFF" opacity="0.8" />

              {/* Whiskers */}
              <g stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" opacity="0.65">
                <line x1="88" y1="120" x2="52" y2="114" />
                <line x1="88" y1="126" x2="54" y2="132" />
                <line x1="152" y1="120" x2="188" y2="114" />
                <line x1="152" y1="126" x2="186" y2="132" />
              </g>

              {mouthOpen ? (
                <g>
                  <path d="M 106 122 Q 120 146 134 122 Z" fill="url(#mouth3DCavity)" />
                  <rect x="115.5" y="122" width="4" height="6.5" rx="1" fill="#FFFFFF" />
                  <rect x="120.5" y="122" width="4" height="6.5" rx="1" fill="#FFFFFF" />
                </g>
              ) : isChewing ? (
                <path d="M 110 125 Q 120 138 130 125" stroke="#0F172A" strokeWidth="2.8" fill="none" strokeLinecap="round" />
              ) : (
                <g>
                  <path d="M 112 122 Q 116 128 120 123 Q 124 128 128 122" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <rect x="116" y="122" width="3.5" height="5" rx="1" fill="#FFFFFF" />
                  <rect x="120.5" y="122" width="3.5" height="5" rx="1" fill="#FFFFFF" />
                </g>
              )}
            </g>

            {/* Tiny Pink 3D Paws Held Up */}
            <ellipse cx="110" cy="165" rx="8" ry="6" fill={p.paws} />
            <ellipse cx="130" cy="165" rx="8" ry="6" fill={p.paws} />
          </g>
        )}

        {/* ================================================================= */}
        {/* ACCESSORIES OVERLAYS                                              */}
        {/* ================================================================= */}
        {accessories.includes('party_hat') && (
          <g className="animate-pulse-glow origin-bottom" transform="translate(0, -6)">
            <polygon points="120,4 88,48 152,48" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
            <polygon points="120,4 98,34 142,34" fill="#FBBF24" opacity="0.85" />
            <polygon points="120,4 108,18 132,18" fill="#3B82F6" opacity="0.85" />
            <circle cx="120" cy="4" r="8" fill="#FDE047" />
          </g>
        )}

        {accessories.includes('wizard_hat') && (
          <g transform="translate(75, -12)">
            <ellipse cx="45" cy="48" rx="46" ry="12" fill="#6366F1" stroke="#3730A3" strokeWidth="2" />
            <polygon points="45,-12 18,44 72,44" fill="#4F46E5" stroke="#3730A3" strokeWidth="2" />
            <polygon points="45,15 48,22 55,23 50,28 51,35 45,31 39,35 40,28 35,23 42,22" fill="#FDE047" />
          </g>
        )}

        {(accessories.includes('golden_crown') || isAdult) && (
          <g transform="translate(85, 2)">
            <polygon points="0,28 10,6 25,20 40,3 55,20 70,6 80,28" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
            <circle cx="10" cy="5" r="3.5" fill="#EF4444" />
            <circle cx="40" cy="2" r="4" fill="#3B82F6" />
            <circle cx="70" cy="5" r="3.5" fill="#10B981" />
          </g>
        )}

        {accessories.includes('cool_sunglasses') && (
          <g transform="translate(0, -4)">
            <path d="M 68 94 Q 88 94 98 96 Q 120 90 142 96 Q 152 94 172 94" stroke="#1E293B" strokeWidth="3" fill="none" />
            <rect x="70" y="82" width="38" height="24" rx="7" fill="#1E293B" />
            <rect x="132" y="82" width="38" height="24" rx="7" fill="#1E293B" />
            <line x1="74" y1="86" x2="90" y2="102" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="136" y1="86" x2="152" y2="102" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {accessories.includes('dapper_bowtie') && (
          <g transform="translate(120, 150)">
            <polygon points="0,0 -22,-10 -22,10" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <polygon points="0,0 22,-10 22,10" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <circle cx="0" cy="0" r="6" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          </g>
        )}

        {accessories.includes('flower_clip') && (
          <g transform="translate(62, 42)">
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
