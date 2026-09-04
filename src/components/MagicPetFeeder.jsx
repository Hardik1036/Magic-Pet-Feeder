import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Sparkles, RefreshCw, Heart, Star, Award } from 'lucide-react';

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

  // Celebratory musical fanfare arpeggio (C E G C E)
  fanfare() {
    this.init();
    if (!this.ctx) return;
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.09;

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
// 3. GAME DATA & GENERATION
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

function generateRound(mode) {
  if (mode === 'phonics') {
    const letters = getRandomItems(LETTERS, 3);
    const target = letters[Math.floor(Math.random() * letters.length)];
    return {
      mode: 'phonics',
      targetLabel: `Letter ${target}`,
      spokenPrompt: `Feed me the letter ${target}!`,
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
      spokenPrompt: `I'm hungry for the ${targetChoice.color.name} ${targetChoice.shape.name}!`,
      targetId: targetChoice.id,
      choices: choices.sort(() => 0.5 - Math.random()),
    };
  }
}

// ==========================================
// 4. ANIMATED PET SVG COMPONENT
// ==========================================
function PetAvatar({ expression, accessories, isNearFood }) {
  const mouthOpen = isNearFood || expression === 'hungry';
  const isChewing = expression === 'chewing';
  const isHappy = expression === 'happy';

  return (
    <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center select-none">
      {/* Background Soft Aura */}
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
          <linearGradient id="petGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="60%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="tummyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>
          <radialGradient id="blushGradient">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Feet */}
        <ellipse cx="80" cy="205" rx="22" ry="14" fill="#047857" />
        <ellipse cx="160" cy="205" rx="22" ry="14" fill="#047857" />

        {/* Chubby Round Monster Body */}
        <path
          d="M 120 30 C 180 30, 210 75, 210 135 C 210 195, 175 210, 120 210 C 65 210, 30 195, 30 135 C 30 75, 60 30, 120 30 Z"
          fill="url(#petGradient)"
        />

        {/* Cute Horns / Antennae */}
        <path d="M 65 52 Q 40 20 52 14 Q 72 26 78 44 Z" fill="#FBBF24" />
        <path d="M 175 52 Q 200 20 188 14 Q 168 26 162 44 Z" fill="#FBBF24" />

        {/* Light Belly Patch */}
        <ellipse cx="120" cy="155" rx="54" ry="42" fill="url(#tummyGradient)" opacity="0.9" />

        {/* Rosy Cheeks */}
        <circle cx="62" cy="130" r="14" fill="url(#blushGradient)" />
        <circle cx="178" cy="130" r="14" fill="url(#blushGradient)" />

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

        {/* Responsive Mouth */}
        {mouthOpen ? (
          <g>
            <path
              d="M 92 125 C 92 125, 120 118, 148 125 C 152 158, 88 158, 92 125 Z"
              fill="#881337"
              stroke="#064E3B"
              strokeWidth="3.5"
            />
            {/* Pink Tongue */}
            <ellipse cx="120" cy="148" rx="16" ry="9" fill="#FB7185" />
            {/* Cute Little Baby Teeth */}
            <rect x="108" y="122" width="7" height="6" rx="2.5" fill="#FFFFFF" />
            <rect x="125" y="122" width="7" height="6" rx="2.5" fill="#FFFFFF" />
          </g>
        ) : isChewing ? (
          <path
            d="M 102 132 Q 120 148 138 132 Q 120 138 102 132 Z"
            fill="#881337"
            stroke="#064E3B"
            strokeWidth="3.5"
          />
        ) : (
          <path
            d="M 100 130 Q 120 146 140 130"
            fill="none"
            stroke="#064E3B"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}

        {/* ------------------------------------ */}
        {/* UNLOCKED SILLY ACCESSORIES           */}
        {/* ------------------------------------ */}
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

        {accessories.includes('golden_crown') && (
          <g transform="translate(85, 12)">
            <polygon points="0,28 10,6 25,20 40,3 55,20 70,6 80,28" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
            <circle cx="10" cy="5" r="3.5" fill="#EF4444" />
            <circle cx="40" cy="2" r="4" fill="#3B82F6" />
            <circle cx="70" cy="5" r="3.5" fill="#10B981" />
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
// 5. SHAPES RENDERER
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
// 6. CELEBRATION PARTICLES (HTML5 Canvas)
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
    const particles = Array.from({ length: 48 }, () => ({
      x: canvas.width / 2,
      y: canvas.height * 0.42,
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
        p.vy += 0.35; // Gentle gravity
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
// 7. MAIN MAGIC PET FEEDER COMPONENT
// ==========================================
export default function MagicPetFeeder() {
  const [currentMode, setCurrentMode] = useState('phonics'); // 'phonics' | 'shapes'
  const [round, setRound] = useState(() => generateRound('phonics'));
  const [petHappiness, setPetHappiness] = useState(0); // 0 to 4 (unlocks at 4)
  const [unlockedAccessories, setUnlockedAccessories] = useState([]);
  const [unlockedModal, setUnlockedModal] = useState(null);

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
    const margin = 40; // generous tolerance
    return (
      x >= rect.left - margin &&
      x <= rect.right + margin &&
      y >= rect.top - margin &&
      y <= rect.bottom + margin
    );
  }, []);

  // Positive Reinforcement: Correct Snack
  const handleSuccessfulFeed = useCallback(
    (choice) => {
      setFlyingFoodId(choice.id);
      setPetExpression('chewing');
      sfx.munch();

      // Confetti burst
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1400);

      // Cheerful voice affirmation
      const praises = ['Yum yum yum!', 'So yummy!', 'Delicious!', 'Super job!', 'Nom nom nom!'];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      setTimeout(() => speakText(randomPraise), 300);

      // Pet Happiness meter increment
      setPetHappiness((prev) => {
        const nextVal = prev + 1;
        if (nextVal >= 4) {
          const remaining = ACCESSORIES.filter((acc) => !unlockedAccessories.includes(acc.id));
          const accessoryToUnlock =
            remaining.length > 0
              ? remaining[0]
              : ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)];

          setTimeout(() => {
            setUnlockedAccessories((accs) =>
              accs.includes(accessoryToUnlock.id) ? accs : [...accs, accessoryToUnlock.id]
            );
            setUnlockedModal(accessoryToUnlock);
            sfx.fanfare();
            speakText(`Yay! You unlocked the silly ${accessoryToUnlock.name}!`);
          }, 1100);
          return 0; // reset meter for next accessory
        }
        return nextVal;
      });

      // Advance to next prompt smoothly after 1.5s
      setTimeout(() => {
        setPetExpression('happy');
        setTimeout(() => {
          setFlyingFoodId(null);
          setPetExpression('idle');
          const nextMode = currentMode === 'phonics' ? 'shapes' : 'phonics';
          setCurrentMode(nextMode);
          setRound(generateRound(nextMode));
        }, 700);
      }, 900);
    },
    [currentMode, unlockedAccessories]
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
        `Almost! Where is ${round.targetLabel}?`,
      ];
      speakText(softReminders[Math.floor(Math.random() * softReminders.length)]);
    },
    [round]
  );

  // Pointer Drag Handlers (touch & mouse unified)
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

  // Tap-to-Feed (Alternative mechanic for toddlers who prefer tapping)
  const handleDirectTap = (choice) => {
    if (draggingItem || flyingFoodId) return;
    sfx.pop();
    if (choice.id === round.targetId) {
      handleSuccessfulFeed(choice);
    } else {
      handleGentleMiss(choice);
    }
  };

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
      {/* HEADER: TITLE, MODE & HAPPINESS BAR   */}
      {/* ------------------------------------ */}
      <header className="w-full max-w-md flex flex-col items-center gap-2 pt-2 z-20">
        <div className="w-full flex items-center justify-between px-2">
          {/* Game Title */}
          <div className="flex items-center gap-2 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border-2 border-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span className="font-black text-emerald-800 text-sm tracking-wide uppercase">
              Magic Pet Feeder
            </span>
          </div>

          {/* Mode Switcher */}
          <button
            onClick={() => {
              sfx.pop();
              const nextMode = currentMode === 'phonics' ? 'shapes' : 'phonics';
              setCurrentMode(nextMode);
              setRound(generateRound(nextMode));
            }}
            className="flex items-center gap-1.5 bg-white/85 active:scale-95 px-3 py-1.5 rounded-full text-xs font-bold text-indigo-700 shadow-md border-2 border-indigo-200 transition-transform"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{currentMode === 'phonics' ? '🔤 Letters' : '🎨 Colors & Shapes'}</span>
          </button>
        </div>

        {/* Pet Happiness Progress Bar (4 Hearts) */}
        <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border-2 border-amber-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 pl-1">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-bounce" />
            <span className="text-xs font-extrabold text-amber-900 tracking-wider">HAPPINESS</span>
          </div>

          <div className="flex gap-2 pr-1">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = petHappiness > idx;
              return (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-base font-black transition-all duration-500 shadow-inner ${
                    isFilled
                      ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white scale-110 ring-2 ring-pink-400'
                      : 'bg-slate-200 text-slate-400 scale-95 opacity-60'
                  }`}
                >
                  {isFilled ? <Star className="w-4 h-4 fill-white text-white" /> : '○'}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* ------------------------------------ */}
      {/* TARGET PROMPT BANNER (High contrast) */}
      {/* ------------------------------------ */}
      <section className="w-full max-w-md my-2 z-20">
        <div className="bg-white/95 rounded-3xl p-4 shadow-xl border-4 border-amber-400 flex items-center justify-between gap-3">
          <div className="flex-1 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Feed My Hungry Pet:</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>{round.targetLabel}</span>
              <span className="text-2xl animate-pulse">😋</span>
            </h1>
          </div>

          {/* Repeat Spoken Prompt Button */}
          <button
            onClick={() => {
              sfx.pop();
              speakText(round.spokenPrompt);
            }}
            aria-label="Repeat Prompt"
            className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-yellow-300 active:scale-90 hover:scale-105 rounded-2xl shadow-lg border-2 border-amber-500 flex items-center justify-center text-amber-900 transition-transform"
          >
            <Volume2 className="w-7 h-7" />
          </button>
        </div>
      </section>

      {/* ------------------------------------ */}
      {/* PET DROP ZONE                        */}
      {/* ------------------------------------ */}
      <main ref={petZoneRef} className="relative my-auto flex flex-col items-center justify-center z-10">
        <PetAvatar
          expression={petExpression}
          accessories={unlockedAccessories}
          isNearFood={isNearPet}
        />

        <div
          className={`absolute -bottom-3 px-4 py-1.5 rounded-full text-xs font-black transition-all duration-300 shadow-md ${
            isNearPet
              ? 'bg-rose-500 text-white scale-110 ring-4 ring-rose-300 animate-bounce'
              : 'bg-emerald-600/80 text-white backdrop-blur-sm'
          }`}
        >
          {isNearPet ? 'DROP IN MOUTH! 👅' : 'DRAG FOOD HERE OR TAP! 🍓'}
        </div>
      </main>

      {/* ------------------------------------ */}
      {/* CHOICES: LARGE 88px+ TOUCH BUBBLES   */}
      {/* ------------------------------------ */}
      <footer className="w-full max-w-md pb-4 pt-2 z-20">
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
                {/* Bubble Shiny Highlight */}
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
      {/* REWARD OVERLAY MODAL (EVERY 4 FEEDS) */}
      {/* ------------------------------------ */}
      {unlockedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl border-4 border-yellow-400 animate-fly-in flex flex-col items-center">
            <span className="text-6xl my-2 animate-bounce">{unlockedModal.icon}</span>
            <div className="flex items-center gap-1 text-xs font-black text-amber-600 uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>Silly Reward Unlocked!</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mt-1 mb-2">
              {unlockedModal.name}
            </h2>
            <p className="text-sm font-semibold text-slate-600 mb-6">
              Your pet loves dressing up! Look at that style!
            </p>

            <button
              onClick={() => {
                sfx.pop();
                setUnlockedModal(null);
                setRound(generateRound(currentMode));
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-lg shadow-lg active:scale-95 transition-transform"
            >
              YAY! KEEP FEEDING! 🎉
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
