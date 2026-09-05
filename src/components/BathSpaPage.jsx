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

// Educational Cute Human Toy Body Parts for the Assembly Game
const TOY_BODY_PARTS = [
  {
    id: 'head',
    name: 'Head',
    label: '1. Head (Brain & Face)',
    icon: '👦',
    explanation: 'Our head holds our brain to think, learn, imagine, and smile with joy!',
    slot: { x: 50, y: 22, w: 90, h: 86 },
    hint: 'Drag the head up to the top of the body to think and smile!',
  },
  {
    id: 'eyes',
    name: 'Eyes',
    label: '2. Eyes (Vision)',
    icon: '👀',
    explanation: 'Our two eyes see vibrant colors, read storybooks, and see our happy friends!',
    slot: { x: 50, y: 23, w: 56, h: 26 },
    hint: 'Drag the sparkling eyes onto the face so the buddy can see!',
  },
  {
    id: 'ears',
    name: 'Ears',
    label: '3. Ears (Hearing)',
    icon: '👂',
    explanation: 'Our ears listen to sweet music, birds singing, and cheerful stories!',
    slot: { x: 50, y: 23, w: 98, h: 28 },
    hint: 'Drag the ears to both sides of the head to listen!',
  },
  {
    id: 'tummy',
    name: 'Tummy & Chest',
    label: '4. Tummy & Chest',
    icon: '👕',
    explanation: 'Our chest breathes healthy fresh air and our tummy digests food for energy!',
    slot: { x: 50, y: 52, w: 88, h: 74 },
    hint: 'Drag the tummy and chest right into the middle of the body!',
  },
  {
    id: 'arms',
    name: 'Arms & Hands',
    label: '5. Arms & Hands',
    icon: '🤲',
    explanation: 'Our arms give big warm hugs, and our hands build toys, draw, and wave hello!',
    slot: { x: 50, y: 52, w: 140, h: 44 },
    hint: 'Drag the waving arms to both sides of the chest!',
  },
  {
    id: 'feet',
    name: 'Legs & Feet',
    label: '6. Legs & Feet',
    icon: '👟',
    explanation: 'Our strong legs run, jump, and dance, and our feet balance and walk!',
    slot: { x: 50, y: 81, w: 80, h: 46 },
    hint: 'Drag the legs and sneakers to the bottom to stand and run!',
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
  // Drag & drop state for cute human toy assembly
  const [draggedToyPart, setDraggedToyPart] = useState(null);
  const [dragToyPos, setDragToyPos] = useState({ x: 0, y: 0 });
  const [hoveredToySlot, setHoveredToySlot] = useState(null);
  const blueprintRef = useRef(null);

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
  // EDUCATIONAL CUTE HUMAN TOY ASSEMBLY (DRAG & DROP HANDLERS)
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
            `Amazing job! You assembled all 6 human body parts to build Cute Human Buddy! Give it to ${petDisplayName} so they stop crying!`,
            currentPet.voice
          );
        }, 500);
      }
      return next;
    });
  };

  const handleToyDragStart = (part, e) => {
    if (placedToyParts.includes(part.id)) return;
    sfx.pop();
    const touch = e.touches ? e.touches[0] : e;
    setDraggedToyPart(part);
    setDragToyPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleToyDragMove = (e) => {
    if (!draggedToyPart) return;
    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX;
    const y = touch.clientY;
    setDragToyPos({ x, y });

    // Calculate proximity to the correct target slot on the blueprint
    if (blueprintRef.current) {
      const rect = blueprintRef.current.getBoundingClientRect();
      const targetSlotX = rect.left + (draggedToyPart.slot.x / 100) * rect.width;
      const targetSlotY = rect.top + (draggedToyPart.slot.y / 100) * rect.height;
      const dist = Math.hypot(x - targetSlotX, y - targetSlotY);

      if (dist < 70) {
        setHoveredToySlot(draggedToyPart.id);
      } else {
        setHoveredToySlot(null);
      }
    }
  };

  const handleToyDragEnd = (e) => {
    if (!draggedToyPart) return;
    const touch = e.changedTouches ? e.changedTouches[0] : (e.touches ? e.touches[0] : e);
    const x = touch.clientX;
    const y = touch.clientY;

    let snapped = false;
    if (blueprintRef.current) {
      const rect = blueprintRef.current.getBoundingClientRect();
      const targetSlotX = rect.left + (draggedToyPart.slot.x / 100) * rect.width;
      const targetSlotY = rect.top + (draggedToyPart.slot.y / 100) * rect.height;
      const dist = Math.hypot(x - targetSlotX, y - targetSlotY);

      if (dist < 75) {
        snapped = true;
        handleSnapToyPart(draggedToyPart);
      }
    }

    if (!snapped) {
      sfx.boing();
      speakPetText(draggedToyPart.hint, currentPet.voice);
    }

    setDraggedToyPart(null);
    setHoveredToySlot(null);
  };

  const handleToyDirectTap = (part) => {
    if (placedToyParts.includes(part.id)) {
      sfx.pop();
      setActiveToyLesson(`${part.name}: ${part.explanation}`);
      speakPetText(`${part.name}! ${part.explanation}`, currentPet.voice);
    } else {
      handleSnapToyPart(part);
    }
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
        `Hooray! ${petDisplayName} stopped crying and loves playing with Cute Human Buddy in the bathtub!`,
        currentPet.voice
      );
      setTimeout(() => setPetSparkle(false), 2000);
    }, 400);
  };

  const handleInteractToy = () => {
    sfx.squeak();
    sfx.splash();
    setDuckSqueaking(true);
    setTimeout(() => setDuckSqueaking(false), 500);
    speakPetText(`Yay! ${petDisplayName} giggles and splashes with Cute Human Buddy in the warm tub!`, currentPet.voice);
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

        {/* Assemble Toy / Toy Workshop Button (Extra Noticeable for Kids!) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sfx.pop();
              setShowToyModal(true);
              speakPetText(
                isToyComplete
                  ? `Anatomy Workshop! Review the body parts on Cute Human Buddy!`
                  : `Drag and drop body parts to build the cute human toy and stop ${petDisplayName} from crying!`,
                currentPet.voice
              );
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shadow-xl active:scale-95 cursor-pointer ${
              !isToyComplete
                ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white border-2 border-white ring-4 ring-pink-400 animate-pulse scale-105 hover:scale-110'
                : 'bg-white/95 text-purple-900 border-2 border-purple-300 hover:bg-purple-50'
            }`}
            title="Assemble Cute Human Toy"
          >
            <span className="text-lg animate-bounce">{isToyComplete ? '🧸' : '🧩'}</span>
            <span>{isToyComplete ? 'Human Toy Lab' : '✨ ASSEMBLE TOY! 😭'}</span>
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
                ? `😭 ${petDisplayName} is crying! Tap 'ASSEMBLE TOY' to build a cute human buddy!`
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

                {/* Big Impossible-to-Miss Crying Pet Banner */}
                {isPetCrying && !isToyComplete && (
                  <div className="absolute -top-14 -inset-x-8 flex flex-col items-center z-35 animate-bounce pointer-events-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sfx.pop();
                        setShowToyModal(true);
                        speakPetText(
                          `Drag and drop body parts to build the cute human toy and stop ${petDisplayName} from crying!`,
                          currentPet.voice
                        );
                      }}
                      className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-400 hover:from-purple-500 hover:to-amber-300 text-white font-black text-xs sm:text-sm px-3.5 py-2 rounded-2xl shadow-2xl border-2 border-white ring-4 ring-pink-400 flex items-center gap-1.5 cursor-pointer active:scale-95 animate-pulse"
                    >
                      <span className="text-xl animate-spin">🧩</span>
                      <span>WAAAH! BUILD MY TOY!</span>
                      <span className="bg-white text-purple-900 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black shadow-md">
                        👉 TAP HERE!
                      </span>
                    </button>
                    <div className="w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-pink-500 -mt-0.5" />
                  </div>
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

              {/* REAL PHYSICAL FLOATING CUTE HUMAN BUDDY TOY */}
              {isToyComplete ? (
                <button
                  type="button"
                  onClick={handleInteractToy}
                  style={{
                    left: `${duckPos.x}%`,
                    bottom: '22px',
                  }}
                  className={`absolute z-25 flex flex-col items-center justify-center w-13 h-13 bg-gradient-to-tr from-amber-300 via-pink-200 to-sky-200 hover:from-amber-400 hover:to-pink-300 border-2 border-white rounded-full shadow-xl cursor-pointer transition-transform active:scale-90 ${
                    duckSqueaking ? 'animate-bounce scale-125' : 'animate-float'
                  }`}
                  title="Play with Cute Human Buddy!"
                >
                  <span className="text-2xl leading-none">🧸</span>
                  <span className="text-[7.5px] font-black text-purple-950 bg-white/90 px-1 rounded-full -mt-0.5 shadow-xs">
                    Buddy!
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    sfx.pop();
                    setShowToyModal(true);
                    speakPetText(
                      `No toy in the tub! Drag and drop body parts to build a cute human toy!`,
                      currentPet.voice
                    );
                  }}
                  style={{
                    left: `${duckPos.x}%`,
                    bottom: '20px',
                  }}
                  className="absolute z-25 flex items-center gap-1.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 border-2 border-white text-white px-3 py-1.5 rounded-full shadow-xl cursor-pointer animate-bounce ring-3 ring-pink-300 active:scale-90 hover:scale-105"
                  title="Missing bath toy! Assemble it now!"
                >
                  <span className="text-base animate-spin">🧩</span>
                  <span className="text-[9.5px] font-black uppercase tracking-wider">
                    Build Human Toy!
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
        <div
          onPointerMove={handleToyDragMove}
          onPointerUp={handleToyDragEnd}
          style={{ touchAction: 'none' }}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-between p-2.5 sm:p-4 overflow-y-auto animate-fade select-none"
        >
          {/* Modal Header */}
          <div className="w-full max-w-lg flex items-center justify-between bg-white/95 rounded-2xl px-3.5 py-2 sm:py-2.5 shadow-xl border-2 border-purple-400 flex-shrink-0">
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 flex items-center gap-1">
                <span>🧸 Cute Human Buddy Workshop:</span>
              </span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900">
                {placedToyParts.length === TOY_BODY_PARTS.length
                  ? '🎉 Cute Buddy Complete! Ready to Give to Pet! 🎉'
                  : `Drag & Drop Body Parts! (${placedToyParts.length}/${TOY_BODY_PARTS.length} Placed)`}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sfx.pop();
                  speakPetText(
                    `Drag and drop each human body part onto the matching spot on the blueprint! Learn what our head, eyes, ears, tummy, arms, and feet do!`,
                    currentPet.voice
                  );
                }}
                className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-300 text-purple-900 flex items-center justify-center shadow-sm active:scale-90 cursor-pointer"
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
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center text-xs font-black shadow-sm active:scale-90 cursor-pointer"
                title="Close modal"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Educational Human Body Part Lesson Card */}
          <div className="w-full max-w-lg my-1.5 bg-gradient-to-r from-purple-900/95 to-indigo-900/95 border-2 border-purple-300 rounded-2xl px-3.5 py-2 text-white shadow-lg flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-left">
              <span className="text-2xl animate-pulse">💡</span>
              <div>
                <p className="text-[10px] font-bold text-purple-200 uppercase tracking-wide">
                  {draggedToyPart ? `Dragging ${draggedToyPart.name}:` : 'Human Anatomy Lesson:'}
                </p>
                <p className="text-xs sm:text-sm font-black text-amber-200">
                  {draggedToyPart
                    ? draggedToyPart.hint
                    : activeToyLesson || 'Drag each body part from below onto the human silhouette to learn!'}
                </p>
              </div>
            </div>

            {activeToyLesson && !draggedToyPart && (
              <button
                type="button"
                onClick={() => {
                  sfx.pop();
                  speakPetText(activeToyLesson, currentPet.voice);
                }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex-shrink-0 active:scale-90 cursor-pointer"
                title="Replay lesson audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Blueprint Canvas: Drag & Drop Drop-Zone with Cute Human Art */}
          <div
            ref={blueprintRef}
            className="relative my-auto flex-1 min-h-[240px] max-h-[350px] w-full max-w-sm sm:max-w-md bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl border-4 border-purple-400 shadow-2xl p-2 flex flex-col items-center justify-center select-none overflow-hidden"
          >
            {/* Blueprint Grid Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#c084fc_1.5px,transparent_1.5px)] [background-size:16px_16px] rounded-3xl" />

            {/* Blueprint Title Badge */}
            <div className="absolute top-2 left-3 px-3 py-1 rounded-full bg-purple-500/80 border border-purple-300 text-[10px] font-black text-white flex items-center gap-1.5 shadow-sm z-20">
              <span>📐</span>
              <span>BLUEPRINT: CUTE HUMAN BUDDY</span>
              <span className="bg-purple-900/80 px-1.5 py-0.2 rounded-full text-[9px] font-bold">
                {placedToyParts.length} / {TOY_BODY_PARTS.length}
              </span>
            </div>

            {/* Interactive SVG Canvas for Cute Chibi Human Buddy */}
            <svg
              viewBox="0 0 200 190"
              className="w-full h-full max-h-[270px] relative z-10 filter drop-shadow-md"
            >
              {/* Dotted Guide Outlines (Shown when parts not yet placed) */}
              {/* Head Silhouette Outline */}
              {!placedToyParts.includes('head') && (
                <circle
                  cx="100"
                  cy="52"
                  r="36"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  opacity="0.4"
                />
              )}

              {/* Ears Silhouette Outline */}
              {!placedToyParts.includes('ears') && (
                <g opacity="0.35">
                  <circle cx="62" cy="52" r="8" fill="none" stroke="#A855F7" strokeWidth="2" strokeDasharray="3,3" />
                  <circle cx="138" cy="52" r="8" fill="none" stroke="#A855F7" strokeWidth="2" strokeDasharray="3,3" />
                </g>
              )}

              {/* Eyes Silhouette Outline */}
              {!placedToyParts.includes('eyes') && (
                <g opacity="0.35">
                  <ellipse cx="86" cy="50" rx="6" ry="8" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3,3" />
                  <ellipse cx="114" cy="50" rx="6" ry="8" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3,3" />
                </g>
              )}

              {/* Tummy & Chest Silhouette Outline */}
              {!placedToyParts.includes('tummy') && (
                <rect
                  x="78"
                  y="88"
                  width="44"
                  height="44"
                  rx="12"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  opacity="0.4"
                />
              )}

              {/* Arms Silhouette Outline */}
              {!placedToyParts.includes('arms') && (
                <g opacity="0.35">
                  <path d="M 78 96 C 60 90, 48 78, 44 66" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeDasharray="4,4" />
                  <circle cx="44" cy="65" r="7" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3,3" />
                  <path d="M 122 96 C 140 90, 152 78, 156 66" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeDasharray="4,4" />
                  <circle cx="156" cy="65" r="7" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3,3" />
                </g>
              )}

              {/* Legs & Feet Silhouette Outline */}
              {!placedToyParts.includes('feet') && (
                <g opacity="0.35">
                  <rect x="80" y="130" width="40" height="15" rx="4" fill="none" stroke="#A855F7" strokeWidth="2" strokeDasharray="4,4" />
                  <ellipse cx="88" cy="156" rx="8" ry="6" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3,3" />
                  <ellipse cx="112" cy="156" rx="8" ry="6" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3,3" />
                </g>
              )}

              {/* --------------------------------------------------- */}
              {/* ASSEMBLED CUTE CHIBI HUMAN ARTWORK (LAYER BY LAYER) */}
              {/* --------------------------------------------------- */}

              {/* 1. EARS LAYER */}
              {placedToyParts.includes('ears') && (
                <g className="animate-fade">
                  {/* Left Ear */}
                  <circle cx="62" cy="52" r="9" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
                  <circle cx="62" cy="52" r="5" fill="#FDA4AF" opacity="0.75" />
                  {/* Right Ear */}
                  <circle cx="138" cy="52" r="9" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
                  <circle cx="138" cy="52" r="5" fill="#FDA4AF" opacity="0.75" />
                </g>
              )}

              {/* 2. HEAD & FACE LAYER */}
              {placedToyParts.includes('head') && (
                <g className="animate-fade">
                  {/* Hair Back */}
                  <ellipse cx="100" cy="45" rx="45" ry="40" fill="#78350F" />
                  {/* Cute Round Face */}
                  <circle cx="100" cy="53" r="37" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2.5" />
                  {/* Sweet Cheeks */}
                  <ellipse cx="78" cy="62" rx="7" ry="4.5" fill="#FDA4AF" opacity="0.85" />
                  <ellipse cx="122" cy="62" rx="7" ry="4.5" fill="#FDA4AF" opacity="0.85" />
                  {/* Cheerful Mouth Smile */}
                  <path d="M 94 65 Q 100 72 106 65" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  {/* Cute Hair Bangs Front */}
                  <path d="M 65 44 Q 82 26 100 36 Q 118 26 135 44 Q 124 35 100 37 Q 76 35 65 44 Z" fill="#92400E" />
                  {/* Cute Hair Sprout with Leaf */}
                  <path d="M 100 24 Q 106 14 113 18 Q 108 24 100 24" fill="#10B981" />
                </g>
              )}

              {/* 3. EYES LAYER */}
              {placedToyParts.includes('eyes') && (
                <g className="animate-fade">
                  {/* Left Big Sparkling Anime Eye */}
                  <ellipse cx="86" cy="51" rx="6.5" ry="8.5" fill="#0F172A" />
                  <circle cx="84" cy="48" r="2.8" fill="#FFFFFF" />
                  <circle cx="88" cy="54" r="1.4" fill="#FFFFFF" />
                  {/* Right Big Sparkling Anime Eye */}
                  <ellipse cx="114" cy="51" rx="6.5" ry="8.5" fill="#0F172A" />
                  <circle cx="112" cy="48" r="2.8" fill="#FFFFFF" />
                  <circle cx="116" cy="54" r="1.4" fill="#FFFFFF" />
                  {/* Cute Anime Eyebrows */}
                  <path d="M 80 40 Q 86 37 92 41" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M 108 41 Q 114 37 120 40" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* 4. ARMS & HANDS LAYER */}
              {placedToyParts.includes('arms') && (
                <g className="animate-fade">
                  {/* Left Waving Arm */}
                  <path d="M 78 96 C 60 90, 48 78, 44 66 C 42 60, 50 58, 54 64 C 58 74, 68 85, 80 90" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="45" cy="64" r="7.5" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
                  {/* Right Waving Arm */}
                  <path d="M 122 96 C 140 90, 152 78, 156 66 C 158 60, 150 58, 146 64 C 142 74, 132 85, 120 90" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="155" cy="64" r="7.5" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
                </g>
              )}

              {/* 5. TUMMY & CHEST LAYER */}
              {placedToyParts.includes('tummy') && (
                <g className="animate-fade">
                  {/* Cute Sky Blue Star T-Shirt */}
                  <rect x="77" y="88" width="46" height="44" rx="12" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
                  {/* Golden Glowing Star Badge */}
                  <path d="M 100 97 L 103 104 L 111 105 L 105 110 L 107 118 L 100 114 L 93 118 L 95 110 L 89 105 L 97 104 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
                  {/* White Collar Trim */}
                  <path d="M 91 88 Q 100 96 109 88" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* 6. LEGS & FEET LAYER */}
              {placedToyParts.includes('feet') && (
                <g className="animate-fade">
                  {/* Denim Shorts */}
                  <rect x="79" y="130" width="42" height="15" rx="4" fill="#6366F1" stroke="#4338CA" strokeWidth="2" />
                  <line x1="100" y1="130" x2="100" y2="145" stroke="#4338CA" strokeWidth="2" />
                  {/* Cute White Socks */}
                  <rect x="83" y="145" width="11" height="8" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                  <rect x="106" y="145" width="11" height="8" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                  {/* Red Bright Sneakers with White Toe Cap */}
                  <ellipse cx="88" cy="156" rx="9" ry="6" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
                  <ellipse cx="88" cy="154" rx="5" ry="2.5" fill="#FFFFFF" />
                  <ellipse cx="112" cy="156" rx="9" ry="6" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
                  <ellipse cx="112" cy="154" rx="5" ry="2.5" fill="#FFFFFF" />
                </g>
              )}

              {/* Hover Golden Pulse on Target Slot while dragging */}
              {hoveredToySlot && (
                <g className="animate-pulse">
                  {hoveredToySlot === 'head' && (
                    <circle cx="100" cy="52" r="42" fill="none" stroke="#FBBF24" strokeWidth="4" strokeDasharray="6,4" />
                  )}
                  {hoveredToySlot === 'eyes' && (
                    <rect x="74" y="40" width="52" height="22" rx="10" fill="none" stroke="#FBBF24" strokeWidth="3.5" strokeDasharray="4,4" />
                  )}
                  {hoveredToySlot === 'ears' && (
                    <g>
                      <circle cx="62" cy="52" r="13" fill="none" stroke="#FBBF24" strokeWidth="3" strokeDasharray="4,3" />
                      <circle cx="138" cy="52" r="13" fill="none" stroke="#FBBF24" strokeWidth="3" strokeDasharray="4,3" />
                    </g>
                  )}
                  {hoveredToySlot === 'tummy' && (
                    <rect x="72" y="84" width="56" height="52" rx="16" fill="none" stroke="#FBBF24" strokeWidth="4" strokeDasharray="6,4" />
                  )}
                  {hoveredToySlot === 'arms' && (
                    <g>
                      <circle cx="45" cy="65" r="15" fill="none" stroke="#FBBF24" strokeWidth="3.5" strokeDasharray="4,3" />
                      <circle cx="155" cy="65" r="15" fill="none" stroke="#FBBF24" strokeWidth="3.5" strokeDasharray="4,3" />
                    </g>
                  )}
                  {hoveredToySlot === 'feet' && (
                    <rect x="74" y="126" width="52" height="38" rx="12" fill="none" stroke="#FBBF24" strokeWidth="4" strokeDasharray="6,4" />
                  )}
                </g>
              )}
            </svg>

            {/* Tap-to-Review or Tap-to-Snap overlay targets on blueprint slots */}
            <div className="absolute inset-0 pointer-events-none">
              {TOY_BODY_PARTS.map((part) => {
                const isPlaced = placedToyParts.includes(part.id);
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => handleToyDirectTap(part)}
                    style={{
                      left: `${part.slot.x}%`,
                      top: `${part.slot.y}%`,
                      width: `${part.slot.w}px`,
                      height: `${part.slot.h}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute flex flex-col items-center justify-center pointer-events-auto cursor-pointer rounded-2xl transition-all ${
                      hoveredToySlot === part.id
                        ? 'bg-amber-400/25 ring-4 ring-amber-300 scale-105'
                        : isPlaced
                        ? 'hover:ring-2 hover:ring-purple-300'
                        : 'border-2 border-dashed border-purple-400/40 hover:bg-purple-500/20'
                    }`}
                    title={isPlaced ? `Review ${part.name}` : `Drop or tap ${part.name}`}
                  >
                    {!isPlaced && (
                      <span className="text-[10px] font-black text-purple-200/80 bg-slate-900/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                        {hoveredToySlot === part.id ? '✨ DROP!' : `${part.name}?`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Assembled Cute Buddy Celebration Overlay */}
            {placedToyParts.length === TOY_BODY_PARTS.length && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-4 z-40 animate-fade text-white text-center">
                <span className="text-5xl animate-bounce mb-1">🧸✨</span>
                <h3 className="text-base sm:text-lg font-black text-amber-300">
                  Cute Human Buddy Assembled!
                </h3>
                <p className="text-xs text-purple-100 max-w-xs mt-1 leading-relaxed">
                  You learned all 6 human body parts: <strong>Head</strong>, <strong>Eyes</strong>, <strong>Ears</strong>, <strong>Tummy</strong>, <strong>Arms</strong>, and <strong>Feet</strong>!
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-3 w-full max-w-xs">
                  <button
                    type="button"
                    onClick={handleGiveToyToPet}
                    className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm py-2.5 px-4 rounded-2xl shadow-xl border-2 border-emerald-300 flex items-center justify-center gap-1.5 animate-pulse active:scale-95 cursor-pointer"
                  >
                    <span>🎁</span>
                    <span>Give Cute Buddy to Pet & Stop Crying!</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Floating Drag Clone: Follows finger/pointer while dragging */}
          {draggedToyPart && (
            <div
              style={{
                left: `${dragToyPos.x}px`,
                top: `${dragToyPos.y}px`,
                transform: 'translate(-50%, -50%) scale(1.22)',
              }}
              className="fixed pointer-events-none z-[100] flex flex-col items-center justify-center p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border-3 border-purple-400 ring-4 ring-pink-400 animate-pulse select-none"
            >
              <span className="text-4xl leading-none">{draggedToyPart.icon}</span>
              <span className="text-[10px] font-black text-purple-900 mt-1 uppercase">
                {draggedToyPart.name}
              </span>
              <span className="text-[8px] font-black text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full mt-0.5">
                Drop on silhouette!
              </span>
            </div>
          )}

          {/* Draggable Body Parts Tray at Bottom */}
          <div className="w-full max-w-lg bg-white/95 rounded-2xl p-2 sm:p-2.5 shadow-xl border-2 border-purple-300 mt-1.5 flex-shrink-0">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider flex items-center gap-1">
                <span>👇 Drag Body Parts to Silhouette (or Tap):</span>
              </span>
              <span className="text-[9.5px] font-bold text-slate-500">
                (Touch & drag onto blueprint)
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
              {TOY_BODY_PARTS.map((part) => {
                const isPlaced = placedToyParts.includes(part.id);
                return (
                  <button
                    key={part.id}
                    type="button"
                    onPointerDown={(e) => handleToyDragStart(part, e)}
                    onClick={() => handleToyDirectTap(part)}
                    style={{ touchAction: 'none' }}
                    className={`flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing select-none ${
                      isPlaced
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                        : 'bg-purple-50 border-purple-300 hover:bg-purple-100 text-purple-950 active:scale-90 shadow-xs ring-1 ring-purple-200'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl">{part.icon}</span>
                    <span className="text-[8.5px] sm:text-[9px] font-black mt-0.5 leading-tight truncate max-w-full">
                      {part.name}
                    </span>
                    <span
                      className={`text-[7px] sm:text-[7.5px] font-bold px-1 rounded-full mt-0.5 ${
                        isPlaced
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-purple-200 text-purple-900'
                      }`}
                    >
                      {isPlaced ? '✓ Placed' : '🖐️ Drag'}
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
