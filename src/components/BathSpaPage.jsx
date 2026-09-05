import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Volume2, Sparkles, RefreshCw, Droplets, Heart, Check, Star, Award, Puzzle } from 'lucide-react';
import PetAvatar from './PetAvatar.jsx';
import ActivityNavBar from './ActivityNavBar.jsx';
import { PETS } from '../data/pets.js';
import { sfx, speakPetText } from '../utils/audio.js';

// 5 Mud Spots across the pet body with clear anatomical body part labels
const INITIAL_MUD_SPOTS = [
  { id: 1, x: 36, y: 32, size: 44, label: 'Cheek', hint: 'Cheek! Used for smiling!' },
  { id: 2, x: 64, y: 34, size: 42, label: 'Ear', hint: 'Ear! Used for listening!' },
  { id: 3, x: 38, y: 56, size: 46, label: 'Tummy', hint: 'Tummy! Where food goes!' },
  { id: 4, x: 64, y: 62, size: 40, label: 'Paw', hint: 'Paw! Used for walking and dancing!' },
  { id: 5, x: 50, y: 46, size: 46, label: 'Chest', hint: 'Chest! Protects our strong heart!' },
];

// Educational Bath Toy Body Parts for the Assembly Game
const TOY_BODY_PARTS = [
  {
    id: 'head',
    name: 'Head',
    icon: '🟡',
    explanation: 'Head! That is where we think, smile, and learn!',
    slot: { x: 50, y: 24, w: 76, h: 72 },
    shape: 'rounded-full bg-amber-300 border-3 border-amber-500 shadow-md',
  },
  {
    id: 'eyes',
    name: 'Eyes',
    icon: '👀',
    explanation: 'Eyes! Used for seeing all the bright and beautiful colors!',
    slot: { x: 58, y: 22, w: 32, h: 22 },
    shape: 'flex items-center justify-center text-xl',
  },
  {
    id: 'beak',
    name: 'Beak',
    icon: '👄',
    explanation: 'Beak! Used for eating tasty food and singing songs!',
    slot: { x: 68, y: 30, w: 30, h: 22 },
    shape: 'bg-orange-500 rounded-r-2xl border-2 border-orange-700',
  },
  {
    id: 'body',
    name: 'Tummy',
    icon: '🎽',
    explanation: 'Tummy! Keeps our food digesting and body warm!',
    slot: { x: 44, y: 52, w: 96, h: 72 },
    shape: 'rounded-3xl bg-amber-400 border-3 border-amber-600 shadow-md',
  },
  {
    id: 'wings',
    name: 'Wings',
    icon: '🪽',
    explanation: 'Wings! Used for splashing water, flapping, and warm hugs!',
    slot: { x: 32, y: 52, w: 42, h: 42 },
    shape: 'rounded-full bg-amber-300 border-2 border-amber-500',
  },
  {
    id: 'feet',
    name: 'Feet',
    icon: '🦶',
    explanation: 'Feet! Used for walking, waddling, and paddling in the tub!',
    slot: { x: 46, y: 78, w: 56, h: 22 },
    shape: 'bg-orange-400 rounded-b-xl border-2 border-orange-600',
  },
];

export default function BathSpaPage({
  playerName,
  petNickname,
  selectedPetId,
  stageIndex = 1,
  feedCount = 5,
  unlockedAccessories = [],
  unlockedBadges = [],
  playerStats = {},
  onUpdateStats,
  onUnlockBadge,
  onNavigate,
  onSwitchPet,
  onChangeProfile,
}) {
  const currentPet = PETS.find((p) => p.id === selectedPetId) || PETS[0];
  const petDisplayName = petNickname || currentPet.defaultName;

  // Active step: 'sponge' | 'shampoo' | 'shower' | 'towel'
  const [activeTool, setActiveTool] = useState('sponge');

  // Step 1: Mud spots & scrub progress
  const [cleanedSpots, setCleanedSpots] = useState([]);
  const [spotHealth, setSpotHealth] = useState({}); // spotId -> remaining hits (3 down to 0)

  // Step 2: Shampoo lather level (0 to 100)
  const [foamLevel, setFoamLevel] = useState(0);

  // Step 3: Shower state & floating pop bubbles
  const [showerActive, setShowerActive] = useState(false);
  const [floatingBubbles, setFloatingBubbles] = useState([]);

  // Step 4: Towel dry level (0 to 100)
  const [dryLevel, setDryLevel] = useState(0);
  const [isFullyCompleted, setIsFullyCompleted] = useState(false);

  // Pet expressions and sparkles
  const [petExpression, setPetExpression] = useState('idle');
  const [petSparkle, setPetSparkle] = useState(false);

  // Physical Floating Rubber Ducky state
  const [duckPos, setDuckPos] = useState({ x: 22, y: 72 });
  const [duckSqueaking, setDuckSqueaking] = useState(false);

  // Drag physics tracking
  const [isDragging, setIsDragging] = useState(false);
  const petContainerRef = useRef(null);
  const showerIntervalRef = useRef(null);
  const lastScrubTimeRef = useRef(0);

  // -------------------------------------------------------------
  // TOY ANATOMY ASSEMBLY & CRYING PET STATE
  // -------------------------------------------------------------
  const [placedToyParts, setPlacedToyParts] = useState([]);
  const [isToyComplete, setIsToyComplete] = useState(false);
  const [isPetCrying, setIsPetCrying] = useState(true);
  const [showToyModal, setShowToyModal] = useState(false);
  const [activeToyLesson, setActiveToyLesson] = useState('');

  // Welcome speech
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isToyComplete && isPetCrying) {
        speakPetText(
          `Waaah! ${petDisplayName} is crying in the bathtub because they lost their bath toy! Tap 'Assemble Toy' to build one from body parts so ${petDisplayName} stops crying!`,
          currentPet.voice
        );
      } else {
        speakPetText(
          `Splish splash! Let's take a warm bubble bath! Drag the soft sponge across ${petDisplayName}'s mud spots to scrub them clean!`,
          currentPet.voice
        );
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [currentPet, petDisplayName, isToyComplete, isPetCrying]);

  // Clean up shower sound loop on unmount
  useEffect(() => {
    return () => {
      if (showerIntervalRef.current) clearInterval(showerIntervalRef.current);
    };
  }, []);

  // -------------------------------------------------------------
  // INTERACTIVE DRAGGING PHYSICS (SCRUB, LATHER, TOWEL DRY)
  // -------------------------------------------------------------
  const handlePointerDown = (e) => {
    setIsDragging(true);
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e) => {
    if (!isDragging && e.type !== 'pointerdown') return;
    if (!petContainerRef.current) return;

    const rect = petContainerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const relX = ((clientX - rect.left) / rect.width) * 100;
    const relY = ((clientY - rect.top) / rect.height) * 100;

    const now = Date.now();

    // 1. DRAGGING SPONGE OVER MUD SPOTS
    if (activeTool === 'sponge') {
      INITIAL_MUD_SPOTS.forEach((spot) => {
        if (cleanedSpots.includes(spot.id)) return;
        const dist = Math.hypot(relX - spot.x, relY - spot.y);
        if (dist < 14) {
          if (now - lastScrubTimeRef.current > 140) {
            lastScrubTimeRef.current = now;
            sfx.scrub();
            setPetExpression('happy');

            setSpotHealth((prev) => {
              const currentHits = prev[spot.id] ?? 2;
              const nextHits = currentHits - 1;
              if (nextHits <= 0) {
                // Spot is completely scrubbed!
                sfx.chime(spot.id);
                speakPetText(`${spot.label} is clean!`, currentPet.voice);
                setCleanedSpots((c) => {
                  const nextCleaned = [...c, spot.id];
                  if (nextCleaned.length === INITIAL_MUD_SPOTS.length) {
                    setTimeout(() => {
                      sfx.chime(4);
                      speakPetText(
                        `All the mud is scrubbed away! Now drag shampoo over ${petDisplayName} to make fluffy foam!`,
                        currentPet.voice
                      );
                      setActiveTool('shampoo');
                      setPetExpression('idle');
                    }, 400);
                  }
                  return nextCleaned;
                });
                return { ...prev, [spot.id]: 0 };
              }
              return { ...prev, [spot.id]: nextHits };
            });
          }
        }
      });
    }

    // 2. DRAGGING SHAMPOO OVER PET (Lathers fluffy soap foam)
    if (activeTool === 'shampoo' && foamLevel < 100) {
      if (relX >= 20 && relX <= 80 && relY >= 15 && relY <= 75) {
        if (now - lastScrubTimeRef.current > 110) {
          lastScrubTimeRef.current = now;
          sfx.splash();
          setPetExpression('happy');

          setFoamLevel((prev) => {
            const next = Math.min(100, prev + 8);
            if (next >= 100 && prev < 100) {
              setTimeout(() => {
                sfx.chime(4);
                speakPetText(
                  `Ooh, so bubbly and foamy! Turn on the shower to rinse all the soap away!`,
                  currentPet.voice
                );
                setActiveTool('shower');
                setPetExpression('idle');
              }, 400);
            }
            return next;
          });
        }
      }
    }

    // 3. DRAGGING TOWEL OVER PET (Pat-dries coat)
    if (activeTool === 'towel' && dryLevel < 100) {
      if (relX >= 20 && relX <= 80 && relY >= 15 && relY <= 75) {
        if (now - lastScrubTimeRef.current > 110) {
          lastScrubTimeRef.current = now;
          sfx.squeak();
          setPetExpression('happy');

          setDryLevel((prev) => {
            const next = Math.min(100, prev + 10);
            if (next >= 100 && prev < 100) {
              setTimeout(() => {
                sfx.sparkle();
                sfx.fanfare();
                setPetSparkle(true);
                setIsFullyCompleted(true);
                speakPetText(
                  `All dry, soft and super fluffy! Look at that radiant shine, ${playerName}!`,
                  currentPet.voice
                );
              }, 350);
            }
            return next;
          });
        }
      }
    }
  };

  // Click fallback for scrubbing a spot
  const handleScrubSpotClick = (spot) => {
    sfx.scrub();
    setPetExpression('happy');
    sfx.chime(spot.id);
    speakPetText(`${spot.label} is clean!`, currentPet.voice);
    setCleanedSpots((prev) => {
      if (prev.includes(spot.id)) return prev;
      const next = [...prev, spot.id];
      if (next.length === INITIAL_MUD_SPOTS.length) {
        setTimeout(() => {
          sfx.chime(4);
          speakPetText(
            `All the mud is scrubbed away! Now drag shampoo over ${petDisplayName} to make fluffy foam!`,
            currentPet.voice
          );
          setActiveTool('shampoo');
          setPetExpression('idle');
        }, 400);
      }
      return next;
    });
  };

  // -------------------------------------------------------------
  // SHOWER RINSE & FLOATING BUBBLE POPPING
  // -------------------------------------------------------------
  const handleToggleShower = () => {
    if (!showerActive) {
      setShowerActive(true);
      sfx.showerStream();
      setPetExpression('happy');

      if (showerIntervalRef.current) clearInterval(showerIntervalRef.current);
      showerIntervalRef.current = setInterval(() => {
        sfx.showerStream();
      }, 650);

      speakPetText(`Ah, warm water feels so good! Washing away the bubbles!`, currentPet.voice);

      // Gradually rinse foam down to 0
      const rinseTimer = setInterval(() => {
        setFoamLevel((prev) => {
          if (prev <= 0) {
            clearInterval(rinseTimer);
            return 0;
          }
          return Math.max(0, prev - 25);
        });
      }, 350);

      // Spawn floating rainbow bubbles
      const newBubbles = Array.from({ length: 9 }, (_, idx) => ({
        id: Date.now() + idx,
        x: 12 + (idx % 3) * 32 + Math.random() * 8,
        y: 12 + Math.floor(idx / 3) * 26 + Math.random() * 8,
        size: 42 + Math.random() * 22,
        color: ['#93C5FD', '#F472B6', '#C084FC', '#67E8F9', '#FDE047'][idx % 5],
      }));
      setFloatingBubbles(newBubbles);

      setTimeout(() => {
        if (showerIntervalRef.current) {
          clearInterval(showerIntervalRef.current);
          showerIntervalRef.current = null;
        }
        setShowerActive(false);
        sfx.chime(3);
        speakPetText(
          `All rinsed! Pop any floating bubbles, then drag the fluffy towel to dry me off!`,
          currentPet.voice
        );
        setActiveTool('towel');
        setPetExpression('idle');
      }, 2500);
    } else {
      setShowerActive(false);
      if (showerIntervalRef.current) {
        clearInterval(showerIntervalRef.current);
        showerIntervalRef.current = null;
      }
    }
  };

  // Pop floating soap bubbles
  const handlePopBubble = (bubbleId) => {
    sfx.bubblePop();
    setFloatingBubbles((prev) => prev.filter((b) => b.id !== bubbleId));

    const nextBubbles = (playerStats.bubblesPopped || 0) + 1;
    if (onUpdateStats) {
      onUpdateStats((prev) => ({
        ...prev,
        bubblesPopped: nextBubbles,
      }));
    }

    if (nextBubbles >= 15 && !unlockedBadges.includes('bubble_champ')) {
      if (onUnlockBadge) onUnlockBadge('bubble_champ');
      sfx.fanfare();
      speakPetText(`Hooray! You earned the Bubble Champion trophy!`, currentPet.voice);
    }
  };

  // Interactive Physical Floating Rubber Duck
  const handleInteractDuck = () => {
    sfx.squeak();
    sfx.splash();
    setDuckSqueaking(true);
    setTimeout(() => setDuckSqueaking(false), 500);
    speakPetText(`Quack quack! Squeaky rubber ducky loves bath time!`, currentPet.voice);
  };

  // Reset Spa to play again
  const handleResetSpa = () => {
    sfx.pop();
    setCleanedSpots([]);
    setSpotHealth({});
    setFoamLevel(0);
    setDryLevel(0);
    setIsFullyCompleted(false);
    setPetSparkle(false);
    setActiveTool('sponge');
    speakPetText(`Splish splash! Ready for another refreshing bubble bath!`, currentPet.voice);
  };

  // -------------------------------------------------------------
  // EDUCATIONAL TOY BODY PARTS ASSEMBLY HANDLERS
  // -------------------------------------------------------------
  const handleSnapToyPart = (part) => {
    if (placedToyParts.includes(part.id)) return;
    sfx.pop();
    sfx.chime(placedToyParts.length + 1);

    setActiveToyLesson(`${part.name}: ${part.explanation}`);
    speakPetText(`${part.name}! ${part.explanation}`, currentPet.voice);

    setPlacedToyParts((prev) => {
      const next = [...prev, part.id];
      if (next.length === TOY_BODY_PARTS.length) {
        setTimeout(() => {
          sfx.fanfare();
          sfx.sparkle();
          speakPetText(
            `Incredible! All 6 body parts are assembled! Give the toy to ${petDisplayName} so they stop crying!`,
            currentPet.voice
          );
        }, 500);
      }
      return next;
    });
  };

  const handleGiveToyToPet = () => {
    sfx.splash();
    sfx.fanfare();
    setIsToyComplete(true);
    setIsPetCrying(false);
    setPetExpression('happy');
    setPetSparkle(true);
    setShowToyModal(false);

    if (onUnlockBadge && !unlockedBadges.includes('toy_maker')) {
      onUnlockBadge('toy_maker');
    }

    setTimeout(() => {
      speakPetText(
        `Hooray! ${petDisplayName} stopped crying and is so happy with the new bath toy! Now let's scrub and wash in our warm bubble bath!`,
        currentPet.voice
      );
      setTimeout(() => setPetSparkle(false), 2000);
    }, 400);
  };

  const allSpotsCleaned = cleanedSpots.length === INITIAL_MUD_SPOTS.length;

  return (
    <div
      className="relative w-full h-full max-h-[100dvh] bg-gradient-to-b from-cyan-200 via-sky-100 to-teal-100 flex flex-col justify-between items-center px-2 py-1 sm:px-4 sm:py-2 select-none overflow-hidden font-sans"
      style={{ touchAction: 'manipulation' }}
      onPointerUp={handlePointerUp}
    >
      {/* Top Header */}
      <header className="w-full max-w-md flex items-center justify-between px-1 pt-0.5 z-20 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onChangeProfile}
            className="flex items-center gap-1 bg-white/85 px-2.5 py-1 rounded-full text-xs font-bold text-indigo-900 border border-indigo-200 shadow-sm active:scale-95"
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>{playerName}</span>
          </button>
          <button
            onClick={onSwitchPet}
            className="flex items-center gap-1 bg-white/85 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-900 border border-emerald-200 shadow-sm active:scale-95"
          >
            <span>{currentPet.icon}</span>
            <span>{petDisplayName}</span>
          </button>
        </div>

        {/* Assemble Toy / Toy Workshop Button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sfx.pop();
              setShowToyModal(true);
              speakPetText(
                isToyComplete
                  ? `Toy Anatomy Workshop! Learn about body parts and review the toy!`
                  : `Assemble all body parts to make a bath toy and stop ${petDisplayName} from crying!`,
                currentPet.voice
              );
            }}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
              !isToyComplete
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-2 border-purple-300 ring-2 ring-purple-200 animate-pulse'
                : 'bg-white/90 text-purple-900 border border-purple-300 hover:bg-purple-50'
            }`}
          >
            <span>🧩</span>
            <span>{isToyComplete ? 'Toy Workshop' : 'Assemble Toy! 😭'}</span>
          </button>
        </div>
      </header>

      {/* Mission & Instruction Bar */}
      <section className="w-full max-w-md my-0.5 z-20 flex-shrink-0">
        <div className="bg-white/95 rounded-2xl p-2 sm:p-2.5 shadow-md border-2 border-cyan-400 flex items-center justify-between">
          <div className="text-left">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-700 flex items-center gap-1">
              <span>🛁 Bathhouse Hygiene Routine:</span>
              <span className="text-cyan-500 font-bold">
                {activeTool === 'sponge'
                  ? '(Step 1: Scrub)'
                  : activeTool === 'shampoo'
                  ? '(Step 2: Lather)'
                  : activeTool === 'shower'
                  ? '(Step 3: Rinse)'
                  : '(Step 4: Dry)'}
              </span>
            </p>
            <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight leading-tight">
              {!isToyComplete && isPetCrying
                ? `😭 ${petDisplayName} is crying! Tap 'Assemble Toy' to build one!`
                : isFullyCompleted
                ? '✨ Sparkling Clean, Soft & Fluffy! ✨'
                : activeTool === 'sponge'
                ? `Drag sponge over mud spots! (${cleanedSpots.length}/${INITIAL_MUD_SPOTS.length} cleaned)`
                : activeTool === 'shampoo'
                ? `Rub shampoo across pet body to make foam! (${foamLevel}%)`
                : activeTool === 'shower'
                ? 'Shower is rinsing! Tap floating bubbles to pop!'
                : `Drag towel over pet to dry off! (${dryLevel}%)`}
            </h2>
          </div>

          <button
            onClick={() => {
              sfx.pop();
              if (!isToyComplete && isPetCrying) {
                speakPetText(
                  `Waaah! ${petDisplayName} is crying because they want a bath toy! Tap Assemble Toy to build one from body parts!`,
                  currentPet.voice
                );
                return;
              }
              const hints = {
                sponge: `Drag the soft sponge across ${petDisplayName}'s mud spots to scrub them clean!`,
                shampoo: `Drag shampoo back and forth across ${petDisplayName} to lather fluffy soap foam!`,
                shower: `Shower is rinsing the soap! Tap and pop the floating bubbles!`,
                towel: `Rub the fluffy warm towel back and forth across ${petDisplayName} to dry off!`,
              };
              speakPetText(hints[activeTool] || hints.sponge, currentPet.voice);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-cyan-400 to-sky-300 rounded-xl shadow-md border border-cyan-500 flex items-center justify-center text-cyan-950 active:scale-90 flex-shrink-0"
            title="Hear instruction"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>

          {/* ------------------------------------------------------------- */}
          {/* THE REAL BATHTUB ARENA                                        */}
          {/* Pet sits happily inside real porcelain tub filled with water! */}
          {/* ------------------------------------------------------------- */}
          <main
            ref={petContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            className="relative my-auto flex-1 min-h-[220px] max-h-[350px] w-full max-w-sm sm:max-w-md flex flex-col items-center justify-center z-10 cursor-grab active:cursor-grabbing"
          >
            {/* Shower Fixture & Falling Rain Streams */}
            {showerActive && (
              <div className="absolute top-0 inset-x-0 flex flex-col items-center pointer-events-none z-35 animate-fade">
                <div className="w-24 h-7 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 rounded-b-3xl shadow-xl border-2 border-slate-200 flex items-center justify-center">
                  <div className="flex gap-2">
                    <div className="w-2 h-1 bg-cyan-200 rounded-full animate-ping" />
                    <div className="w-2 h-1 bg-cyan-200 rounded-full animate-ping" />
                    <div className="w-2 h-1 bg-cyan-200 rounded-full animate-ping" />
                  </div>
                </div>

                <div className="w-44 h-48 flex justify-between px-3 overflow-hidden">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        animationDelay: `${(i % 3) * 0.12}s`,
                        animationDuration: '0.4s',
                      }}
                      className="w-1.5 h-full bg-gradient-to-b from-cyan-200 via-sky-400 to-blue-400 rounded-full animate-bounce opacity-85"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Floating Tap-to-Pop Bubbles */}
            {floatingBubbles.map((b) => (
              <button
                key={b.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePopBubble(b.id);
                }}
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  backgroundColor: `${b.color}44`,
                  borderColor: b.color,
                }}
                className="absolute rounded-full border-2 shadow-lg flex items-center justify-center active:scale-130 transition-transform duration-150 animate-float z-30 cursor-pointer"
              >
                <div className="absolute top-1 left-2 w-3.5 h-2 bg-white/80 rounded-full -rotate-45" />
                <span className="text-xs font-bold text-white drop-shadow-sm">🫧</span>
              </button>
            ))}

            {/* Sparkles on Bath Complete */}
            {petSparkle && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-pulse">
                <span className="text-4xl animate-bounce">✨</span>
                <span className="text-4xl -mt-16 ml-12 animate-ping">🌟</span>
                <span className="text-4xl mt-20 -ml-14 animate-bounce">💖</span>
                <span className="text-3xl -mt-12 -ml-16 animate-ping">✨</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* REAL 3D PORCELAIN BATHTUB STRUCTURE                       */}
            {/* ========================================================= */}
            <div className="relative w-64 sm:w-72 h-64 flex flex-col items-center justify-end">
              {/* Back Tub Rim (Behind Pet) */}
              <div className="absolute top-12 w-60 sm:w-68 h-32 bg-gradient-to-b from-slate-100 via-sky-50 to-cyan-100 rounded-t-full border-4 border-slate-300 shadow-inner z-5" />

              {/* Water Layer inside tub */}
              <div className="absolute top-28 w-56 sm:w-64 h-24 bg-gradient-to-b from-cyan-400/40 via-sky-400/60 to-blue-500/80 rounded-full blur-[1px] z-8 animate-pulse" />

              {/* PET AVATAR (Nestled inside the tub) */}
              <div className="relative z-15 active:scale-98 transition-transform mb-2">
                <PetAvatar
                  petId={currentPet.id}
                  stageIndex={stageIndex}
                  feedCount={feedCount}
                  expression={isPetCrying ? 'crying' : isFullyCompleted ? 'sparkle' : petExpression}
                  accessories={unlockedAccessories}
                />

                {/* Crying Pet Speech Bubble: Informs child and opens toy modal */}
                {isPetCrying && !isToyComplete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sfx.pop();
                      setShowToyModal(true);
                      speakPetText(`Waaah! I need my bath toy! Tap to assemble body parts!`, currentPet.voice);
                    }}
                    className="absolute -top-8 -right-4 bg-white/95 px-2.5 py-1 rounded-full shadow-lg border-2 border-purple-400 text-[10px] font-black text-purple-900 flex items-center gap-1 animate-bounce z-30 cursor-pointer hover:scale-105"
                  >
                    <span>😭</span>
                    <span>Waaah! Need toy!</span>
                    <span className="text-purple-600 underline">Assemble 🧩</span>
                  </button>
                )}

                {/* 1. MUD SPOTS ON PET (Scrub Stage) */}
                {activeTool === 'sponge' &&
                  INITIAL_MUD_SPOTS.map((spot) => {
                    const isCleaned = cleanedSpots.includes(spot.id);
                    if (isCleaned) return null;
                    const hitsRemaining = spotHealth[spot.id] ?? 2;
                    return (
                      <button
                        key={spot.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScrubSpotClick(spot);
                        }}
                        style={{
                          left: `${spot.x}%`,
                          top: `${spot.y}%`,
                          width: `${spot.size}px`,
                          height: `${spot.size}px`,
                          transform: `translate(-50%, -50%) scale(${0.7 + hitsRemaining * 0.15})`,
                        }}
                        className="absolute rounded-full bg-gradient-to-tr from-amber-900 via-amber-800 to-amber-700 border-2 border-amber-950 shadow-md flex items-center justify-center text-xs animate-pulse active:scale-75 z-25 cursor-pointer hover:ring-2 hover:ring-amber-400"
                        title={`Scrub ${spot.label}!`}
                      >
                        <span className="text-[10px] font-black text-amber-100">{spot.label}</span>
                      </button>
                    );
                  })}

                {/* 2. RICH ORGANIC SOAP FOAM LATHER (Shampoo Stage) */}
                {foamLevel > 0 && (
                  <div className="absolute inset-0 pointer-events-none z-25 flex items-center justify-center">
                    {/* Head / Ears Cloud Foam Crown */}
                    <div
                      style={{
                        opacity: Math.min(1, foamLevel / 40),
                        transform: `scale(${0.65 + (foamLevel / 100) * 0.45})`,
                      }}
                      className="absolute -top-3 w-40 h-20 bg-white/95 rounded-full shadow-lg border-2 border-sky-200 flex items-center justify-around px-2 transition-all duration-300"
                    >
                      <span className="text-2xl animate-bounce">🫧</span>
                      <span className="text-lg animate-pulse">🧼</span>
                      <span className="text-2xl animate-bounce">🫧</span>
                      <span className="text-xl animate-pulse">✨</span>
                    </div>

                    {/* Chest & Tummy Fluffy Soap Layer */}
                    <div
                      style={{
                        opacity: Math.min(1, foamLevel / 35),
                        transform: `scale(${0.7 + (foamLevel / 100) * 0.4})`,
                      }}
                      className="absolute top-20 w-48 h-26 bg-gradient-to-b from-white via-sky-50 to-white/90 rounded-full shadow-inner border-2 border-sky-100 flex items-center justify-center gap-1.5 transition-all duration-300"
                    >
                      <span className="text-2xl animate-pulse">🫧</span>
                      <span className="text-xs font-black text-sky-800 bg-sky-100/90 px-3 py-1 rounded-full shadow-sm">
                        Soap Suds ({foamLevel}%)
                      </span>
                      <span className="text-2xl animate-pulse">🫧</span>
                    </div>
                  </div>
                )}

                {/* 4. TOWEL DRY WIPE OVERLAY */}
                {activeTool === 'towel' && dryLevel > 0 && dryLevel < 100 && (
                  <div className="absolute inset-0 pointer-events-none z-25 flex items-center justify-center">
                    <div
                      style={{ opacity: (100 - dryLevel) / 100 }}
                      className="w-44 h-44 bg-cyan-300/30 rounded-full animate-pulse border-2 border-cyan-400/40"
                    />
                  </div>
                )}
              </div>

              {/* Front Porcelain Bathtub Wall (Covers lower body of pet) */}
              <div className="relative w-64 sm:w-72 h-22 bg-gradient-to-b from-white via-slate-50 to-slate-200 rounded-b-3xl border-4 border-slate-300 shadow-2xl z-20 flex flex-col items-center justify-between pt-1 pb-2">
                {/* Bathtub Porcelain Water Lip with animated bubbles */}
                <div className="w-full px-3 flex items-center justify-between">
                  <div className="flex gap-1 items-center">
                    <span className="text-xs animate-bounce">🫧</span>
                    <span className="text-xs animate-pulse">🫧</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-900 bg-cyan-100 px-2 py-0.5 rounded-full border border-cyan-300">
                    {isFullyCompleted ? '✨ All Clean & Fluffy! ✨' : 'Porcelain Warm Tub'}
                  </span>
                  <div className="flex gap-1 items-center">
                    <span className="text-xs animate-pulse">🫧</span>
                    <span className="text-xs animate-bounce">🫧</span>
                  </div>
                </div>

                {/* Golden Claw Feet at bottom of tub */}
                <div className="absolute -bottom-3 inset-x-4 flex justify-between pointer-events-none z-10">
                  <div className="w-6 h-5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-full border border-amber-700 shadow-md transform -rotate-12" />
                  <div className="w-6 h-5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-full border border-amber-700 shadow-md transform rotate-12" />
                </div>
              </div>

              {/* REAL PHYSICAL FLOATING RUBBER DUCKY (In tub water) */}
              {isToyComplete ? (
                <button
                  type="button"
                  onClick={handleInteractDuck}
                  style={{
                    left: `${duckPos.x}%`,
                    bottom: '24px',
                  }}
                  className={`absolute z-25 flex flex-col items-center justify-center w-12 h-12 bg-amber-300 hover:bg-amber-400 border-2 border-amber-500 rounded-full shadow-lg cursor-pointer transition-transform active:scale-90 ${
                    duckSqueaking ? 'animate-bounce scale-125' : 'animate-float'
                  }`}
                  title="Squeak the Rubber Ducky!"
                >
                  <span className="text-2xl leading-none">🦆</span>
                  <span className="text-[8px] font-black text-amber-950 bg-white/80 px-1 rounded-full -mt-0.5 shadow-xs">
                    Squeak!
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    sfx.pop();
                    setShowToyModal(true);
                    speakPetText(
                      `No toy in the tub! Assemble body parts in the workshop to build one!`,
                      currentPet.voice
                    );
                  }}
                  style={{
                    left: `${duckPos.x}%`,
                    bottom: '24px',
                  }}
                  className="absolute z-25 flex flex-col items-center justify-center w-12 h-12 bg-purple-100/90 border-2 border-dashed border-purple-400 rounded-full shadow-sm cursor-pointer animate-pulse hover:scale-105"
                  title="Missing bath toy! Assemble it now!"
                >
                  <span className="text-xl opacity-40">🦆</span>
                  <span className="text-[7.5px] font-black text-purple-900 bg-white/90 px-1 rounded-full">
                    Build 🧩
                  </span>
                </button>
              )}
            </div>
          </main>

          {/* Replay Spa Button */}
          {isFullyCompleted && (
            <div className="my-1 z-30 flex-shrink-0">
              <button
                onClick={handleResetSpa}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs px-5 py-2 rounded-full shadow-lg active:scale-95 transition-transform"
              >
                <RefreshCw className="w-4 h-4" />
                <span>🛁 BATH SPA AGAIN!</span>
              </button>
            </div>
          )}

          {/* Interactive 4-Step Tool Selector Footer */}
          <footer className="w-full max-w-md flex flex-col gap-1 z-20 pb-0.5 flex-shrink-0">
            <div className="flex items-center justify-around gap-1.5 bg-white/95 rounded-2xl p-1.5 shadow-md border-2 border-cyan-300">
              {/* Tool 1: Scrub Sponge */}
              <button
                onClick={() => {
                  sfx.pop();
                  setActiveTool('sponge');
                  speakPetText(`Drag the soft sponge across the mud spots to scrub!`, currentPet.voice);
                }}
                className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
                  activeTool === 'sponge'
                    ? 'bg-amber-400 text-amber-950 font-black shadow-md ring-2 ring-amber-300 scale-105'
                    : 'bg-slate-100 text-slate-700 font-bold'
                }`}
              >
                <div className="relative">
                  <span className="text-2xl">🧽</span>
                  {allSpotsCleaned && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold shadow">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-[9.5px] font-black mt-0.5">1. Scrub</span>
              </button>

              {/* Tool 2: Shampoo */}
              <button
                onClick={() => {
                  sfx.pop();
                  setActiveTool('shampoo');
                  speakPetText(`Drag shampoo back and forth across the pet to make fluffy foam!`, currentPet.voice);
                }}
                className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
                  activeTool === 'shampoo'
                    ? 'bg-purple-500 text-white font-black shadow-md ring-2 ring-purple-300 scale-105'
                    : 'bg-slate-100 text-slate-700 font-bold'
                }`}
              >
                <div className="relative">
                  <span className="text-2xl">🧴</span>
                  {foamLevel >= 100 && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold shadow">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-[9.5px] font-black mt-0.5">2. Shampoo</span>
              </button>

              {/* Tool 3: Shower */}
              <button
                onClick={() => {
                  setActiveTool('shower');
                  handleToggleShower();
                }}
                className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
                  activeTool === 'shower' || showerActive
                    ? 'bg-sky-500 text-white font-black shadow-md ring-2 ring-sky-300 scale-105'
                    : 'bg-slate-100 text-slate-700 font-bold'
                }`}
              >
                <div className="relative">
                  <span className="text-2xl">{showerActive ? '🚿 💦' : '🚿'}</span>
                  {foamLevel === 0 && cleanedSpots.length > 0 && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold shadow">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-[9.5px] font-black mt-0.5">{showerActive ? 'Rinsing...' : '3. Shower'}</span>
              </button>

              {/* Tool 4: Towel */}
              <button
                onClick={() => {
                  sfx.pop();
                  setActiveTool('towel');
                  speakPetText(`Drag the warm towel across the pet to dry clean!`, currentPet.voice);
                }}
                className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
                  activeTool === 'towel'
                    ? 'bg-rose-400 text-rose-950 font-black shadow-md ring-2 ring-rose-300 scale-105'
                    : 'bg-slate-100 text-slate-700 font-bold'
                }`}
              >
                <div className="relative">
                  <span className="text-2xl">🧺</span>
                  {dryLevel >= 100 && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold shadow">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-[9.5px] font-black mt-0.5">4. Towel</span>
              </button>
            </div>

            <ActivityNavBar
              currentActivity="bath"
              onSelectActivity={onNavigate}
              unlockedBadgesCount={unlockedBadges.length}
            />
          </footer>

      {/* ============================================================= */}
      {/* MODAL / POPUP: TOY ANATOMY WORKSHOP (NO PET SHOWN IN MODAL!)  */}
      {/* Teaches body parts, assembles toy to stop pet from crying    */}
      {/* ============================================================= */}
      {showToyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-5 overflow-y-auto animate-fade">
          {/* Modal Header */}
          <div className="w-full max-w-lg flex items-center justify-between bg-white/95 rounded-2xl px-4 py-2.5 shadow-xl border-2 border-purple-400 flex-shrink-0">
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 flex items-center gap-1">
                <span>🧩 Toy Anatomy Workshop:</span>
              </span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900">
                {placedToyParts.length === TOY_BODY_PARTS.length
                  ? '🎉 Toy Complete! Give to Pet to Stop Crying! 🎉'
                  : `Assemble Body Parts! (${placedToyParts.length}/${TOY_BODY_PARTS.length})`}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sfx.pop();
                  speakPetText(
                    `Tap or snap each body part into the blueprint to build the bath toy! Learn what each body part does!`,
                    currentPet.voice
                  );
                }}
                className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-300 text-purple-900 flex items-center justify-center shadow-sm active:scale-90"
                title="Hear audio instructions"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.pop();
                  setShowToyModal(false);
                }}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center text-xs font-black shadow-sm active:scale-90"
                title="Close modal"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Educational Body Part Anatomy Lesson Card */}
          <div className="w-full max-w-lg my-2 bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border-2 border-purple-300 rounded-2xl px-4 py-2 text-white shadow-lg flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-left">
              <span className="text-2xl animate-pulse">💡</span>
              <div>
                <p className="text-[10px] font-bold text-purple-200 uppercase tracking-wide">
                  Body Part Lesson:
                </p>
                <p className="text-xs sm:text-sm font-black text-amber-200">
                  {activeToyLesson ||
                    'Tap each body part below to attach it and learn what it does!'}
                </p>
              </div>
            </div>

            {activeToyLesson && (
              <button
                type="button"
                onClick={() => {
                  sfx.pop();
                  speakPetText(activeToyLesson, currentPet.voice);
                }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex-shrink-0 active:scale-90"
                title="Replay lesson audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Blueprint Canvas (Silhouette & Assembly Zone) */}
          <div className="relative my-auto flex-1 min-h-[220px] max-h-[320px] w-full max-w-sm sm:max-w-md bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl border-4 border-purple-400 shadow-2xl p-4 flex flex-col items-center justify-center select-none">
            {/* Blueprint Grid Background Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#c084fc_1.5px,transparent_1.5px)] [background-size:16px_16px] rounded-3xl" />

            {/* Blueprint Title Badge */}
            <div className="absolute top-2 left-3 px-3 py-1 rounded-full bg-purple-500/80 border border-purple-300 text-[10px] font-black text-white flex items-center gap-1.5 shadow-sm">
              <span>📐</span>
              <span>BLUEPRINT: BATH DUCKY</span>
              <span className="bg-purple-900/80 px-1.5 py-0.2 rounded-full text-[9px] font-bold">
                {placedToyParts.length} / {TOY_BODY_PARTS.length}
              </span>
            </div>

            {/* Interactive Silhouette Slots */}
            <div className="relative w-64 h-56 flex items-center justify-center">
              {TOY_BODY_PARTS.map((part) => {
                const isPlaced = placedToyParts.includes(part.id);
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => {
                      if (!isPlaced) {
                        handleSnapToyPart(part);
                      } else {
                        sfx.pop();
                        setActiveToyLesson(`${part.name}: ${part.explanation}`);
                        speakPetText(`${part.name}! ${part.explanation}`, currentPet.voice);
                      }
                    }}
                    style={{
                      left: `${part.slot.x}%`,
                      top: `${part.slot.y}%`,
                      width: `${part.slot.w}px`,
                      height: `${part.slot.h}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                      isPlaced
                        ? `${part.shape} shadow-xl scale-100 hover:ring-2 hover:ring-purple-300`
                        : 'border-2 border-dashed border-purple-400/60 bg-purple-500/15 rounded-2xl hover:bg-purple-500/30'
                    }`}
                    title={isPlaced ? `Review ${part.name}` : `Snap in ${part.name}`}
                  >
                    {isPlaced ? (
                      <div className="flex flex-col items-center">
                        <span className="text-xl">{part.icon}</span>
                        <span className="text-[9px] font-black text-slate-900 leading-tight">
                          {part.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-purple-200/90">
                        {part.name}?
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Completion Overlay: Assembled Toy & Give to Pet Button */}
            {placedToyParts.length === TOY_BODY_PARTS.length && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-4 z-30 animate-fade text-white text-center">
                <span className="text-5xl animate-bounce mb-1">🦆✨</span>
                <h3 className="text-base font-black text-amber-300">Toy Fully Assembled!</h3>
                <p className="text-xs text-purple-100 max-w-xs mt-1">
                  You learned all body parts: Head, Eyes, Beak, Tummy, Wings, and Feet!
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-3 w-full max-w-xs">
                  <button
                    type="button"
                    onClick={handleGiveToyToPet}
                    className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm py-2.5 px-4 rounded-2xl shadow-xl border-2 border-emerald-300 flex items-center justify-center gap-1.5 animate-pulse active:scale-95"
                  >
                    <span>🎁</span>
                    <span>Give Toy to Pet & Stop Crying!</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Body Parts Tray (Buttons on bottom of modal) */}
          <div className="w-full max-w-lg bg-white/95 rounded-2xl p-2.5 shadow-xl border-2 border-purple-300 mt-2 flex-shrink-0">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider flex items-center gap-1">
                <span>👇 Available Body Parts:</span>
              </span>
              <span className="text-[9.5px] font-bold text-slate-600">
                (Tap part to attach & learn)
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {TOY_BODY_PARTS.map((part) => {
                const isPlaced = placedToyParts.includes(part.id);
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => {
                      if (!isPlaced) {
                        handleSnapToyPart(part);
                      } else {
                        sfx.pop();
                        setActiveToyLesson(`${part.name}: ${part.explanation}`);
                        speakPetText(`${part.name}! ${part.explanation}`, currentPet.voice);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all cursor-pointer ${
                      isPlaced
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                        : 'bg-purple-50 border-purple-300 hover:bg-purple-100 text-purple-950 active:scale-90 shadow-xs ring-1 ring-purple-200'
                    }`}
                  >
                    <span className="text-xl">{part.icon}</span>
                    <span className="text-[9px] font-black mt-0.5 leading-tight">{part.name}</span>
                    <span
                      className={`text-[7.5px] font-bold px-1 rounded-full mt-0.5 ${
                        isPlaced
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-purple-200 text-purple-900'
                      }`}
                    >
                      {isPlaced ? '✓ Placed' : 'Snap'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
