import React from 'react';
import { PETS } from '../data/pets.js';

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
      <div className="relative w-48 h-56 flex items-center justify-center select-none">
        <div
          className={`absolute inset-0 rounded-full blur-md transition-all duration-500 opacity-50 ${
            isNearFood ? 'bg-amber-300 scale-110' : 'bg-purple-300 scale-95'
          }`}
        />
        <svg
          viewBox="0 0 200 240"
          className={`w-full h-full relative z-10 transform-gpu will-change-transform transition-transform duration-300 ${
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
          {isSleeping ? (
            <g stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none">
              <path d="M 72 118 Q 80 126 88 118" />
              <path d="M 112 118 Q 120 126 128 118" />
            </g>
          ) : (
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
          )}

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
    <div
      onClick={onPet}
      className={`relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center select-none ${scaleClass} transition-transform duration-500 cursor-pointer`}
    >
      <div
        className={`absolute inset-0 rounded-full blur-md transition-all duration-500 opacity-50 ${
          isHappy ? 'bg-amber-300 scale-110' : mouthOpen ? 'bg-rose-300 scale-105' : isSleeping ? 'bg-indigo-300 scale-90' : 'bg-emerald-200 scale-95'
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
        className={`w-full h-full relative z-10 transform-gpu will-change-transform transition-transform duration-300 ${
          isChewing ? 'animate-chew' : isHappy ? 'animate-bounce' : isSleeping ? 'opacity-95' : 'animate-float'
        }`}
      >
        {/* Crisp vector ground shadow with 0 CPU filter overhead */}
        <ellipse cx="120" cy="225" rx="55" ry="10" fill="#0F172A" opacity="0.16" />

        {/* Super Cape (Under Body) */}
        {accessories.includes('super_cape') && (
          <path
            d="M 70 140 C 30 190, 40 230, 60 235 C 120 220, 180 235, 200 235 C 220 190, 190 140, 170 140 Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="3"
            className="animate-pulse"
          />
        )}

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

        {/* Dino Claws */}
        {petId === 'dino' && (
          <g fill="#FDE047" stroke="#B45309" strokeWidth="1">
            <polygon points="70,208 74,215 78,208" />
            <polygon points="78,209 82,216 86,209" />
            <polygon points="154,209 158,216 162,209" />
            <polygon points="162,208 166,215 170,208" />
          </g>
        )}

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

        {/* Dino Tail (Behind Body) */}
        {petId === 'dino' && (
          <g>
            <path
              d="M 180 165 Q 225 180 230 148 Q 218 138 178 152 Z"
              fill={bodyColor}
              stroke="#1E293B"
              strokeWidth="3.5"
            />
            <polygon points="226,142 238,146 230,156" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
          </g>
        )}

        {petId === 'dino' && (
          <g>
            {/* Dino golden horns / crest */}
            <path d="M 65 52 Q 40 20 52 14 Q 72 26 78 44 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
            <path d="M 175 52 Q 200 20 188 14 Q 168 26 162 44 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
            {/* Dorsal crest spikes on head */}
            <polygon points="120,16 110,38 130,38" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
            <polygon points="96,24 88,40 106,40" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <polygon points="144,24 134,40 152,40" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
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
        {isSleeping ? (
          <g stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" fill="none">
            <path d="M 74 105 Q 86 116 98 105" />
            <path d="M 142 105 Q 154 116 166 105" />
          </g>
        ) : isHappy ? (
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
        ) : petId === 'dino' ? (
          <g>
            <ellipse cx="114" cy="116" rx="2.5" ry="3" fill="#047857" opacity="0.8" />
            <ellipse cx="126" cy="116" rx="2.5" ry="3" fill="#047857" opacity="0.8" />
          </g>
        ) : petId === 'bunny' || petId === 'kitten' || petId === 'fox' || petId === 'hamster' ? (
          <polygon points="120,121 115,116 125,116" fill="#DB2777" />
        ) : null}

        {/* Mouth */}
        {isSleeping ? (
          <ellipse cx="120" cy="136" rx="6" ry="4" fill="#881337" opacity="0.7" />
        ) : mouthOpen ? (
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

        {/* ACCESSORIES OVERLAYS */}
        {accessories.includes('party_hat') && (
          <g className="animate-pulse-glow origin-bottom">
            <polygon points="120,4 88,48 152,48" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
            <polygon points="120,4 98,34 142,34" fill="#FBBF24" opacity="0.8" />
            <polygon points="120,4 108,18 132,18" fill="#3B82F6" opacity="0.8" />
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
