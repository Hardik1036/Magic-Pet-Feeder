import React from 'react';
import { PETS } from '../data/pets.js';

export default function PetAvatar({
  petId,
  stageIndex,
  feedCount = 0,
  expression = 'idle', // 'idle' | 'hungry' | 'chewing' | 'happy' | 'sleeping' | 'sparkle'
  accessories = [],
  isNearFood = false,
}) {
  const mouthOpen = isNearFood || expression === 'hungry';
  const isChewing = expression === 'chewing';
  const isHappy = expression === 'happy' || expression === 'sparkle';
  const isSleeping = expression === 'sleeping';

  const petConfig = PETS.find((p) => p.id === petId) || PETS[0];

  // ------------------------------------------
  // STAGE 0: SPECIES MAGIC EGG
  // ------------------------------------------
  if (stageIndex === 0) {
    const crackLevel = feedCount;
    const ec = petConfig.eggColors;
    return (
      <div className="relative w-36 h-44 sm:w-48 sm:h-56 max-h-[26dvh] flex items-center justify-center select-none">
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
            <radialGradient id={`eggGrad_${petId}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="25%" stopColor={ec.gradStart} />
              <stop offset="70%" stopColor={ec.gradMid} />
              <stop offset="100%" stopColor={ec.gradEnd} />
            </radialGradient>
            <radialGradient id={`eggSpot_${petId}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="50%" stopColor={ec.spot} stopOpacity="0.9" />
              <stop offset="100%" stopColor={ec.gradEnd} stopOpacity="0.3" />
            </radialGradient>
            <linearGradient id="eggShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Soft Ground Contact Shadow */}
          <ellipse cx="100" cy="216" rx="48" ry="11" fill="#0F172A" opacity="0.25" />

          {/* 3D Shaded Egg Shell */}
          <path
            d="M 100 18 C 152 18, 178 90, 178 160 C 178 206, 146 222, 100 222 C 54 222, 22 206, 22 160 C 22 90, 48 18, 100 18 Z"
            fill={`url(#eggGrad_${petId})`}
            stroke={ec.stroke}
            strokeWidth="3.5"
          />

          {/* 3D Curvature Highlight Sheen */}
          <path
            d="M 62 38 C 90 24, 120 28, 138 48 C 122 42, 85 40, 56 68 C 50 56, 54 44, 62 38 Z"
            fill="url(#eggShine)"
          />

          {/* Texture Egg Spots */}
          <circle cx="65" cy="85" r="14" fill={`url(#eggSpot_${petId})`} />
          <circle cx="138" cy="68" r="11" fill={`url(#eggSpot_${petId})`} />
          <circle cx="142" cy="142" r="18" fill={`url(#eggSpot_${petId})`} />
          <circle cx="58" cy="155" r="13" fill={`url(#eggSpot_${petId})`} />
          <circle cx="102" cy="116" r="16" fill={`url(#eggSpot_${petId})`} />

          {/* Expressive Baby Eyes in Egg */}
          {isSleeping ? (
            <g stroke="#0F172A" strokeWidth="4" strokeLinecap="round" fill="none">
              <path d="M 72 118 Q 80 126 88 118" />
              <path d="M 112 118 Q 120 126 128 118" />
            </g>
          ) : (
            <g>
              <ellipse cx="80" cy="115" rx="8" ry="9" fill="#0F172A" />
              <circle cx="78" cy="112" r="3.5" fill="#FFFFFF" />
              <circle cx="82" cy="118" r="1.5" fill="#FFFFFF" />

              <ellipse cx="120" cy="115" rx="8" ry="9" fill="#0F172A" />
              <circle cx="118" cy="112" r="3.5" fill="#FFFFFF" />
              <circle cx="122" cy="118" r="1.5" fill="#FFFFFF" />

              <ellipse cx="68" cy="125" rx="7" ry="4" fill="#F43F5E" opacity="0.6" />
              <ellipse cx="132" cy="125" rx="7" ry="4" fill="#F43F5E" opacity="0.6" />
            </g>
          )}

          {/* Glowing Cracks */}
          {crackLevel >= 1 && (
            <path
              d="M 100 18 L 94 45 L 112 65 L 88 88"
              stroke="#FEF08A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="animate-pulse"
              filter="drop-shadow(0 0 3px #F59E0B)"
            />
          )}
          {crackLevel >= 2 && (
            <path
              d="M 178 160 L 145 148 L 158 128 L 132 118"
              stroke="#FEF08A"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="animate-pulse"
              filter="drop-shadow(0 0 4px #F59E0B)"
            />
          )}

          <polygon points="100,55 103,62 110,63 105,68 106,75 100,71 94,75 95,68 90,63 97,62" fill="#FEF08A" />
        </svg>
      </div>
    );
  }

  // ------------------------------------------
  // STAGES 1, 2, 3: REALISTIC ANIMAL SPECIES
  // ------------------------------------------
  const isBaby = stageIndex === 1;
  const isAdult = stageIndex === 3;
  const scaleClass = isBaby ? 'scale-90' : isAdult ? 'scale-105' : 'scale-100';

  // Species color palettes with realistic 3D gradients
  const palette = {
    dino: {
      light: '#6EE7B7',
      base: '#10B981',
      dark: '#047857',
      deep: '#064E3B',
      tummyLight: '#D1FAE5',
      tummyBase: '#A7F3D0',
      tummyDark: '#6EE7B7',
      eyeIris: '#059669',
      cheek: '#FB7185',
      nose: '#064E3B',
    },
    bunny: {
      light: '#FBCFE8',
      base: '#F472B6',
      dark: '#DB2777',
      deep: '#9D174D',
      tummyLight: '#FFF1F2',
      tummyBase: '#FCE7F3',
      tummyDark: '#FBCFE8',
      eyeIris: '#4F46E5',
      cheek: '#FDA4AF',
      nose: '#E11D48',
    },
    puppy: {
      light: '#FDE68A',
      base: '#F59E0B',
      dark: '#D97706',
      deep: '#78350F',
      tummyLight: '#FFFBEB',
      tummyBase: '#FEF3C7',
      tummyDark: '#FDE68A',
      eyeIris: '#92400E',
      cheek: '#FB923C',
      nose: '#1E1B18',
    },
    kitten: {
      light: '#DDD6FE',
      base: '#A78BFA',
      dark: '#7C3AED',
      deep: '#4C1D95',
      tummyLight: '#F5F3FF',
      tummyBase: '#EDE9FE',
      tummyDark: '#DDD6FE',
      eyeIris: '#0284C7',
      cheek: '#F472B6',
      nose: '#E11D48',
    },
    panda: {
      light: '#FFFFFF',
      base: '#F8FAFC',
      dark: '#CBD5E1',
      deep: '#64748B',
      tummyLight: '#FFFFFF',
      tummyBase: '#F1F5F9',
      tummyDark: '#E2E8F0',
      eyeIris: '#334155',
      cheek: '#FDA4AF',
      nose: '#0F172A',
    },
    fox: {
      light: '#FDBA74',
      base: '#EA580C',
      dark: '#C2410C',
      deep: '#7C2D12',
      tummyLight: '#FFF7ED',
      tummyBase: '#FFEDD5',
      tummyDark: '#FED7AA',
      eyeIris: '#B45309',
      cheek: '#FB7185',
      nose: '#18181B',
    },
    penguin: {
      light: '#334155',
      base: '#0F172A',
      dark: '#020617',
      deep: '#000000',
      tummyLight: '#FEF08A',
      tummyBase: '#FFFFFF',
      tummyDark: '#E2E8F0',
      eyeIris: '#0284C7',
      cheek: '#FB923C',
      nose: '#F59E0B',
    },
    hamster: {
      light: '#FDE68A',
      base: '#F59E0B',
      dark: '#B45309',
      deep: '#78350F',
      tummyLight: '#FFFBEB',
      tummyBase: '#FEF3C7',
      tummyDark: '#FDE68A',
      eyeIris: '#78350F',
      cheek: '#FB7185',
      nose: '#E11D48',
    },
  }[petId] || {
    light: '#6EE7B7',
    base: '#10B981',
    dark: '#047857',
    deep: '#064E3B',
    tummyLight: '#D1FAE5',
    tummyBase: '#A7F3D0',
    tummyDark: '#6EE7B7',
    eyeIris: '#059669',
    cheek: '#FB7185',
    nose: '#064E3B',
  };

  return (
    <div
      className={`relative w-40 h-40 sm:w-56 sm:h-56 max-h-[27dvh] flex items-center justify-center select-none ${scaleClass} transition-transform duration-500`}
    >
      {/* Ambient Radial Aura Glow */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 opacity-55 ${
          isHappy
            ? 'bg-amber-300 scale-110'
            : mouthOpen
            ? 'bg-rose-300 scale-105'
            : isSleeping
            ? 'bg-indigo-300 scale-90'
            : 'bg-sky-200 scale-95'
        }`}
      />

      {/* Sleeping Zzz Floating Animation */}
      {isSleeping && (
        <div className="absolute -top-3 right-6 flex flex-col items-center pointer-events-none z-20 animate-bounce">
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
          {/* Realistic 3D Body Radial Gradient */}
          <radialGradient id={`bodyGrad_${petId}`} cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor={palette.light} />
            <stop offset="45%" stopColor={palette.base} />
            <stop offset="85%" stopColor={palette.dark} />
            <stop offset="100%" stopColor={palette.deep} />
          </radialGradient>

          {/* 3D Tummy Gradient with Soft Ambient Bounce */}
          <radialGradient id={`tummyGrad_${petId}`} cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor={palette.tummyLight} />
            <stop offset="70%" stopColor={palette.tummyBase} />
            <stop offset="100%" stopColor={palette.tummyDark} />
          </radialGradient>

          {/* Eye Iris Multi-Stop Realistic Gradient */}
          <radialGradient id={`irisGrad_${petId}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="30%" stopColor={palette.eyeIris} />
            <stop offset="80%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Ears Soft Depth Linear Gradient */}
          <linearGradient id={`earGrad_${petId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.light} />
            <stop offset="70%" stopColor={palette.base} />
            <stop offset="100%" stopColor={palette.dark} />
          </linearGradient>

          {/* Soft Fur Highlight */}
          <linearGradient id="bodySheen" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Super Cape (Under Body) */}
        {accessories.includes('super_cape') && (
          <path
            d="M 68 135 C 25 185, 35 228, 55 235 C 115 222, 185 235, 205 235 C 225 185, 195 135, 172 135 Z"
            fill="#DC2626"
            stroke="#991B1B"
            strokeWidth="3"
            className="animate-pulse"
          />
        )}

        {/* Adult Wings */}
        {isAdult && (
          <g className="animate-pulse">
            <path
              d="M 45 105 Q 2 60 18 20 Q 52 52 70 88 Z"
              fill="#FBBF24"
              opacity="0.92"
              stroke="#B45309"
              strokeWidth="2.5"
            />
            <path
              d="M 195 105 Q 238 60 222 20 Q 188 52 170 88 Z"
              fill="#FBBF24"
              opacity="0.92"
              stroke="#B45309"
              strokeWidth="2.5"
            />
          </g>
        )}

        {/* Realistic Ground Ambient Contact Shadow */}
        <ellipse cx="120" cy="214" rx="66" ry="13" fill="#0F172A" opacity="0.22" />

        {/* Back Feet / Paws */}
        <ellipse cx="78" cy="204" rx="22" ry="14" fill="#0F172A" opacity="0.25" />
        <ellipse cx="162" cy="204" rx="22" ry="14" fill="#0F172A" opacity="0.25" />
        <ellipse
          cx="78"
          cy="201"
          rx="21"
          ry="13"
          fill={petId === 'penguin' ? '#F59E0B' : petId === 'panda' ? '#0F172A' : `url(#bodyGrad_${petId})`}
        />
        <ellipse
          cx="162"
          cy="201"
          rx="21"
          ry="13"
          fill={petId === 'penguin' ? '#F59E0B' : petId === 'panda' ? '#0F172A' : `url(#bodyGrad_${petId})`}
        />

        {/* ------------------------------------ */}
        {/* SPECIES REALISTIC EARS & FEATURES    */}
        {/* ------------------------------------ */}

        {/* 1. BUNNY EARS (Dimensional velvety floppy ears) */}
        {petId === 'bunny' && (
          <g>
            {/* Left Ear */}
            <path
              d="M 74 65 C 50 -10, 82 -22, 98 62 Z"
              fill={`url(#earGrad_${petId})`}
              stroke="#BE185D"
              strokeWidth="2.5"
            />
            <path d="M 79 55 C 66 5, 85 -5, 93 54 Z" fill="#FCE7F3" opacity="0.9" />

            {/* Right Ear */}
            <path
              d="M 166 65 C 190 -10, 158 -22, 142 62 Z"
              fill={`url(#earGrad_${petId})`}
              stroke="#BE185D"
              strokeWidth="2.5"
            />
            <path d="M 161 55 C 174 5, 155 -5, 147 54 Z" fill="#FCE7F3" opacity="0.9" />
          </g>
        )}

        {/* 2. PUPPY EARS (Soft floppy golden ears with realistic fold) */}
        {petId === 'puppy' && (
          <g>
            <path
              d="M 68 58 Q 22 72 32 118 Q 58 114 74 84 Z"
              fill="#D97706"
              stroke="#78350F"
              strokeWidth="2"
            />
            <path d="M 64 64 Q 32 80 40 108 Q 54 104 68 84 Z" fill="#B45309" opacity="0.6" />

            <path
              d="M 172 58 Q 218 72 208 118 Q 182 114 166 84 Z"
              fill="#D97706"
              stroke="#78350F"
              strokeWidth="2"
            />
            <path d="M 176 64 Q 208 80 200 108 Q 186 104 172 84 Z" fill="#B45309" opacity="0.6" />
          </g>
        )}

        {/* 3. KITTEN EARS (Pointed ears with inner fur fluff) */}
        {petId === 'kitten' && (
          <g>
            <polygon points="58,68 76,16 102,58" fill={`url(#earGrad_${petId})`} stroke="#581C87" strokeWidth="2" />
            <polygon points="66,62 76,28 95,54" fill="#FCE7F3" />
            {/* Inner ear tuft */}
            <path d="M 72 54 L 78 44 L 84 54" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" />

            <polygon points="182,68 164,16 138,58" fill={`url(#earGrad_${petId})`} stroke="#581C87" strokeWidth="2" />
            <polygon points="174,62 164,28 145,54" fill="#FCE7F3" />
            <path d="M 168 54 L 162 44 L 156 54" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* 4. DINO SPINES (3D Dorsal Spikes along head & back) */}
        {petId === 'dino' && (
          <g>
            <polygon points="120,8 110,34 130,34" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
            <polygon points="85,22 75,46 95,46" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
            <polygon points="155,22 145,46 165,46" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
            <polygon points="56,48 48,70 66,70" fill="#F59E0B" stroke="#B45309" strokeWidth="1.8" />
            <polygon points="184,48 174,70 192,70" fill="#F59E0B" stroke="#B45309" strokeWidth="1.8" />
          </g>
        )}

        {/* 5. PANDA EARS (Rich rounded dark velvet bear ears) */}
        {petId === 'panda' && (
          <g>
            <circle cx="68" cy="54" r="23" fill="#0F172A" />
            <circle cx="70" cy="52" r="14" fill="#1E293B" opacity="0.6" />
            <circle cx="172" cy="54" r="23" fill="#0F172A" />
            <circle cx="170" cy="52" r="14" fill="#1E293B" opacity="0.6" />
          </g>
        )}

        {/* 6. FOX EARS & RUFF (Woodland pointed ears with dark rims and white ruff) */}
        {petId === 'fox' && (
          <g>
            <polygon points="56,68 70,12 102,58" fill="#C2410C" stroke="#7C2D12" strokeWidth="2" />
            <polygon points="66,60 72,24 94,52" fill="#FFFFFF" />
            <polygon points="68,14 74,18 70,24" fill="#0F172A" />

            <polygon points="184,68 170,12 138,58" fill="#C2410C" stroke="#7C2D12" strokeWidth="2" />
            <polygon points="174,60 168,24 146,52" fill="#FFFFFF" />
            <polygon points="172,14 166,18 170,24" fill="#0F172A" />
          </g>
        )}

        {/* 7. PENGUIN FLIPPERS (3D Tuxedo Wings) */}
        {petId === 'penguin' && (
          <g>
            <ellipse cx="56" cy="138" rx="14" ry="34" fill="#0F172A" transform="rotate(-16 56 138)" />
            <ellipse cx="184" cy="138" rx="14" ry="34" fill="#0F172A" transform="rotate(16 184 138)" />
          </g>
        )}

        {/* 8. HAMSTER EARS */}
        {petId === 'hamster' && (
          <g>
            <circle cx="66" cy="54" r="19" fill="#D97706" stroke="#92400E" strokeWidth="2" />
            <circle cx="66" cy="54" r="11" fill="#FCE7F3" />
            <circle cx="174" cy="54" r="19" fill="#D97706" stroke="#92400E" strokeWidth="2" />
            <circle cx="174" cy="54" r="11" fill="#FCE7F3" />
          </g>
        )}

        {/* ------------------------------------ */}
        {/* MAIN 3D BODY & CONTOUR               */}
        {/* ------------------------------------ */}
        <path
          d="M 120 32 C 182 32, 212 72, 212 136 C 212 196, 178 212, 120 212 C 62 212, 28 196, 28 136 C 28 72, 58 32, 120 32 Z"
          fill={`url(#bodyGrad_${petId})`}
          stroke={palette.deep}
          strokeWidth="3.2"
        />

        {/* Subtle 3D Surface Sheen Highlight */}
        <path
          d="M 120 36 C 172 36, 198 70, 198 126 C 198 140, 194 154, 186 166 C 180 120, 154 50, 120 44 C 86 50, 60 120, 54 166 C 46 154, 42 140, 42 126 C 42 70, 68 36, 120 36 Z"
          fill="url(#bodySheen)"
        />

        {/* Species Tummy / Chest */}
        {petId === 'penguin' ? (
          // Penguin Tuxedo Warm Chest
          <g>
            <path
              d="M 120 62 C 158 62, 175 105, 175 158 C 175 198, 152 208, 120 208 C 88 208, 65 198, 65 158 C 65 105, 82 62, 120 62 Z"
              fill="#FFFFFF"
            />
            {/* Emperor Penguin Golden Throat Gradient */}
            <path
              d="M 96 74 C 110 68, 130 68, 144 74 C 140 102, 100 102, 96 74 Z"
              fill="#F59E0B"
              opacity="0.85"
            />
          </g>
        ) : (
          <ellipse cx="120" cy="156" rx="55" ry="43" fill={`url(#tummyGrad_${petId})`} opacity="0.95" />
        )}

        {/* PANDA REALISTIC EYE PATCHES */}
        {petId === 'panda' && (
          <g>
            <ellipse cx="84" cy="98" rx="21" ry="17" fill="#0F172A" transform="rotate(-16 84 98)" />
            <ellipse cx="156" cy="98" rx="21" ry="17" fill="#0F172A" transform="rotate(16 156 98)" />
          </g>
        )}

        {/* FOX CHEEK WHITE RUFF */}
        {petId === 'fox' && (
          <g>
            <path d="M 44 126 Q 66 118 72 136 Q 52 144 44 126 Z" fill="#FFFFFF" />
            <path d="M 196 126 Q 174 118 168 136 Q 188 144 196 126 Z" fill="#FFFFFF" />
          </g>
        )}

        {/* Soft Rosy Cheeks */}
        <ellipse cx="64" cy="128" rx="14" ry="9" fill={palette.cheek} opacity="0.65" />
        <ellipse cx="176" cy="128" rx="14" ry="9" fill={palette.cheek} opacity="0.65" />

        {/* ------------------------------------ */}
        {/* REALISTIC MULTI-LAYER EYES           */}
        {/* ------------------------------------ */}
        {isSleeping ? (
          <g stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none">
            <path d="M 74 104 Q 86 116 98 104" />
            <path d="M 142 104 Q 154 116 166 104" />
          </g>
        ) : isHappy ? (
          <g stroke="#0F172A" strokeWidth="5" strokeLinecap="round" fill="none">
            <path d="M 72 102 Q 86 86 100 102" />
            <path d="M 140 102 Q 154 86 168 102" />
          </g>
        ) : (
          <g>
            {/* Left Eye */}
            <circle cx="85" cy="98" r={mouthOpen ? 17 : 15} fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="87" cy="98" r="11" fill={`url(#irisGrad_${petId})`} />
            <circle cx="88" cy="98" r="6" fill="#020617" />
            {/* Highlights */}
            <circle cx="83" cy="93" r="4.5" fill="#FFFFFF" />
            <circle cx="92" cy="102" r="2" fill="#FFFFFF" />
            <path d="M 80 94 Q 87 90 94 94" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" fill="none" />

            {/* Right Eye */}
            <circle cx="155" cy="98" r={mouthOpen ? 17 : 15} fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="153" cy="98" r="11" fill={`url(#irisGrad_${petId})`} />
            <circle cx="152" cy="98" r="6" fill="#020617" />
            {/* Highlights */}
            <circle cx="149" cy="93" r="4.5" fill="#FFFFFF" />
            <circle cx="158" cy="102" r="2" fill="#FFFFFF" />
            <path d="M 146 94 Q 153 90 160 94" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" fill="none" />

            {/* Cute Eyelashes for Bunny & Kitten */}
            {(petId === 'bunny' || petId === 'kitten') && (
              <g stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round">
                <line x1="68" y1="92" x2="63" y2="87" />
                <line x1="172" y1="92" x2="177" y2="87" />
              </g>
            )}
          </g>
        )}

        {/* ------------------------------------ */}
        {/* SNOUT, NOSE & BEAK                   */}
        {/* ------------------------------------ */}
        {petId === 'penguin' ? (
          // Realistic curved penguin beak
          <g>
            <polygon points="120,110 106,125 134,125" fill="#F59E0B" stroke="#B45309" strokeWidth="1.8" />
            <polygon points="120,113 111,123 129,123" fill="#FBBF24" />
            <circle cx="116" cy="115" r="1.2" fill="#78350F" />
            <circle cx="124" cy="115" r="1.2" fill="#78350F" />
          </g>
        ) : petId === 'puppy' ? (
          // Soft rounded muzzle & wet black nose
          <g>
            <ellipse cx="120" cy="125" rx="20" ry="14" fill="#FEF3C7" opacity="0.95" />
            <ellipse cx="120" cy="116" rx="9" ry="6.5" fill="#18181B" />
            <ellipse cx="118" cy="114" rx="3" ry="1.8" fill="#FFFFFF" opacity="0.75" />
          </g>
        ) : (
          // Cute button nose
          <g>
            <polygon
              points="120,121 114,115 126,115"
              fill={palette.nose}
            />
            <circle cx="118" cy="116" r="1" fill="#FFFFFF" opacity="0.7" />
          </g>
        )}

        {/* Whiskers for Bunny, Kitten, Fox, Hamster */}
        {['bunny', 'kitten', 'fox', 'hamster'].includes(petId) && (
          <g stroke="#334155" strokeWidth="1.6" opacity="0.5" strokeLinecap="round">
            <line x1="90" y1="124" x2="62" y2="120" />
            <line x1="90" y1="128" x2="64" y2="132" />
            <line x1="150" y1="124" x2="178" y2="120" />
            <line x1="150" y1="128" x2="176" y2="132" />
          </g>
        )}

        {/* ------------------------------------ */}
        {/* MOUTH & EXPRESSIONS                  */}
        {/* ------------------------------------ */}
        {isSleeping ? (
          <ellipse cx="120" cy="136" rx="6" ry="3.5" fill="#881337" opacity="0.75" />
        ) : mouthOpen ? (
          <g>
            <path
              d="M 94 125 C 94 125, 120 118, 146 125 C 150 156, 90 156, 94 125 Z"
              fill="#881337"
              stroke="#0F172A"
              strokeWidth="3.2"
            />
            {/* Tongue */}
            <ellipse cx="120" cy="147" rx="16" ry="9" fill="#FB7185" />
            {/* Cute Front Teeth for Bunny, Hamster or Dino */}
            {petId === 'bunny' || petId === 'hamster' ? (
              <g fill="#FFFFFF" stroke="#0F172A" strokeWidth="1">
                <rect x="114" y="123" width="5.5" height="7" rx="1.5" />
                <rect x="120.5" y="123" width="5.5" height="7" rx="1.5" />
              </g>
            ) : (
              <g fill="#FFFFFF">
                <rect x="110" y="123" width="7" height="6" rx="2" />
                <rect x="123" y="123" width="7" height="6" rx="2" />
              </g>
            )}
          </g>
        ) : isChewing ? (
          <path
            d="M 104 132 Q 120 148 136 132 Q 120 138 104 132 Z"
            fill="#881337"
            stroke="#0F172A"
            strokeWidth="3.2"
          />
        ) : (
          <g>
            {/* Friendly Pet Smile */}
            <path
              d="M 104 127 Q 112 136 120 128 Q 128 136 136 127"
              fill="none"
              stroke="#0F172A"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* ------------------------------------ */}
        {/* REALISTIC FRONT PAWS                 */}
        {/* ------------------------------------ */}
        {petId !== 'penguin' && (
          <g>
            {/* Left Paw */}
            <ellipse cx="94" cy="184" rx="12" ry="9" fill={`url(#bodyGrad_${petId})`} stroke={palette.deep} strokeWidth="2" />
            <circle cx="91" cy="183" r="3" fill="#FCE7F3" opacity="0.8" />
            <circle cx="97" cy="183" r="3" fill="#FCE7F3" opacity="0.8" />

            {/* Right Paw */}
            <ellipse cx="146" cy="184" rx="12" ry="9" fill={`url(#bodyGrad_${petId})`} stroke={palette.deep} strokeWidth="2" />
            <circle cx="143" cy="183" r="3" fill="#FCE7F3" opacity="0.8" />
            <circle cx="149" cy="183" r="3" fill="#FCE7F3" opacity="0.8" />
          </g>
        )}

        {/* ------------------------------------ */}
        {/* ACCESSORIES OVERLAYS                 */}
        {/* ------------------------------------ */}
        {accessories.includes('party_hat') && (
          <g className="animate-pulse-glow origin-bottom">
            <polygon points="120,4 88,48 152,48" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
            <polygon points="120,4 98,34 142,34" fill="#FBBF24" opacity="0.85" />
            <polygon points="120,4 108,18 132,18" fill="#3B82F6" opacity="0.85" />
            <circle cx="120" cy="4" r="9" fill="#FDE047" />
          </g>
        )}

        {accessories.includes('wizard_hat') && (
          <g transform="translate(75, -5)">
            <ellipse cx="45" cy="48" rx="45" ry="12" fill="#6366F1" stroke="#3730A3" strokeWidth="2" />
            <polygon points="45,-12 18,44 72,44" fill="#4F46E5" stroke="#3730A3" strokeWidth="2" />
            <polygon points="45,15 48,22 55,23 50,28 51,35 45,31 39,35 40,28 35,23 42,22" fill="#FDE047" />
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
            <path d="M 66 98 Q 88 98 98 100 Q 120 93 142 100 Q 152 98 174 98" stroke="#1E293B" strokeWidth="3" fill="none" />
            <rect x="68" y="88" width="38" height="22" rx="7" fill="#1E293B" />
            <rect x="134" y="88" width="38" height="22" rx="7" fill="#1E293B" />
            <line x1="72" y1="92" x2="88" y2="106" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="138" y1="92" x2="154" y2="106" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
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
