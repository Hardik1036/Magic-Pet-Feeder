import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Volume2, Sparkles, Check, RefreshCw } from 'lucide-react';
import PetAvatar from './PetAvatar.jsx';
import ActivityNavBar from './ActivityNavBar.jsx';
import { PETS } from '../data/pets.js';
import { sfx, speakPetText } from '../utils/audio.js';

// 4 Spa Steps in order:
// 1. 'sponge': Scrub away all 5 mud/dirt patches from the pet
// 2. 'shampoo': Lather shampoo to cover pet in thick fluffy white soap bubbles
// 3. 'shower': Turn on overhead shower head with cascading water to rinse soap, spawning floating bubbles to pop
// 4. 'towel': Pat and wipe pet dry with fluffy towel for a radiant shine

const INITIAL_MUD_SPOTS = [
  { id: 1, x: 42, y: 36, size: 28, label: 'Cheek' },
  { id: 2, x: 56, y: 44, size: 32, label: 'Ear' },
  { id: 3, x: 38, y: 56, size: 34, label: 'Tummy' },
  { id: 4, x: 58, y: 62, size: 30, label: 'Paw' },
  { id: 5, x: 48, y: 48, size: 36, label: 'Chest' },
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

  // Step 1: Mud spots
  const [cleanedSpots, setCleanedSpots] = useState([]);

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

  // Dragging tool state
  const [isDraggingTool, setIsDraggingTool] = useState(false);
  const [dragToolPos, setDragToolPos] = useState({ x: 0, y: 0 });

  const petContainerRef = useRef(null);
  const showerIntervalRef = useRef(null);

  // Welcome speech
  useEffect(() => {
    const timer = setTimeout(() => {
      speakPetText(
        `Splish splash! Let's take a warm bubble bath! Grab the scrub sponge to clean the mud off ${petDisplayName}!`,
        currentPet.voice
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [currentPet, petDisplayName]);

  // Clean up shower sound loop on unmount
  useEffect(() => {
    return () => {
      if (showerIntervalRef.current) clearInterval(showerIntervalRef.current);
    };
  }, []);

  // -------------------------------------------------------------
  // STEP 1: SCRUB MUD SPOTS
  // -------------------------------------------------------------
  const handleScrubSpot = useCallback((spotId) => {
    if (cleanedSpots.includes(spotId)) return;
    sfx.scrub();
    setPetExpression('happy');

    setCleanedSpots((prev) => {
      const next = [...prev, spotId];
      if (next.length === INITIAL_MUD_SPOTS.length) {
        setTimeout(() => {
          sfx.chime(2);
          speakPetText(
            `All the dirt is scrubbed away! Now let's lather with shampoo!`,
            currentPet.voice
          );
          setActiveTool('shampoo');
          setPetExpression('idle');
        }, 400);
      } else {
        setTimeout(() => setPetExpression('idle'), 300);
      }
      return next;
    });
  }, [cleanedSpots, currentPet]);

  // -------------------------------------------------------------
  // STEP 2: SHAMPOO LATHERING
  // -------------------------------------------------------------
  const handleLatherShampoo = useCallback(() => {
    if (foamLevel >= 100) return;
    sfx.splash();
    setPetExpression('happy');

    setFoamLevel((prev) => {
      const next = Math.min(100, prev + 25);
      if (next >= 100 && prev < 100) {
        setTimeout(() => {
          sfx.chime(4);
          speakPetText(
            `Ooh so foamy and bubbly! Turn on the shower to rinse me off!`,
            currentPet.voice
          );
          setActiveTool('shower');
          setPetExpression('idle');
        }, 350);
      }
      return next;
    });
  }, [foamLevel, currentPet]);

  // -------------------------------------------------------------
  // STEP 3: SHOWER RINSE & FLOATING BUBBLES
  // -------------------------------------------------------------
  const handleToggleShower = () => {
    if (!showerActive) {
      setShowerActive(true);
      sfx.showerStream();
      setPetExpression('happy');

      // Periodic shower sound
      if (showerIntervalRef.current) clearInterval(showerIntervalRef.current);
      showerIntervalRef.current = setInterval(() => {
        sfx.showerStream();
      }, 700);

      speakPetText(`Ah, warm water feels so good! Washing away the bubbles!`, currentPet.voice);

      // Gradually rinse foam to 0 over 2 seconds
      const rinseTimer = setInterval(() => {
        setFoamLevel((prev) => {
          if (prev <= 0) {
            clearInterval(rinseTimer);
            return 0;
          }
          return Math.max(0, prev - 25);
        });
      }, 400);

      // Spawn floating bubbles outside of pet to pop
      const newBubbles = Array.from({ length: 8 }, (_, idx) => ({
        id: Date.now() + idx,
        x: 8 + (idx % 4) * 22 + Math.random() * 8,
        y: 12 + Math.floor(idx / 4) * 32 + Math.random() * 12,
        size: 38 + Math.random() * 24,
        color: ['#93C5FD', '#F472B6', '#C084FC', '#67E8F9'][idx % 4],
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
          `All rinsed! Pop any floating bubbles, then grab the soft towel to dry me off!`,
          currentPet.voice
        );
        setActiveTool('towel');
        setPetExpression('idle');
      }, 2600);
    } else {
      setShowerActive(false);
      if (showerIntervalRef.current) {
        clearInterval(showerIntervalRef.current);
        showerIntervalRef.current = null;
      }
    }
  };

  // Pop a floating bubble outside of the pet
  const handlePopBubble = (bubbleId) => {
    sfx.bubblePop();
    setFloatingBubbles((prev) => prev.filter((b) => b.id !== bubbleId));

    // Update quest stats
    const nextBubbles = (playerStats.bubblesPopped || 0) + 1;
    if (onUpdateStats) {
      onUpdateStats((prev) => ({
        ...prev,
        bubblesPopped: nextBubbles,
      }));
    }

    // Award Bubble Champ badge on 15 pops
    if (nextBubbles >= 15 && !unlockedBadges.includes('bubble_champ')) {
      if (onUnlockBadge) onUnlockBadge('bubble_champ');
      sfx.fanfare();
      speakPetText(`Hooray! You earned the Bubble Champion trophy!`, currentPet.voice);
    }
  };

  // -------------------------------------------------------------
  // STEP 4: TOWEL DRY CLEAN
  // -------------------------------------------------------------
  const handleTowelRub = useCallback(() => {
    if (dryLevel >= 100) return;
    sfx.squeak();
    setPetExpression('happy');

    setDryLevel((prev) => {
      const next = Math.min(100, prev + 25);
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
        }, 400);
      }
      return next;
    });
  }, [dryLevel, currentPet, playerName]);

  // Restart the entire spa routine
  const handleResetSpa = () => {
    sfx.pop();
    setCleanedSpots([]);
    setFoamLevel(0);
    setShowerActive(false);
    setFloatingBubbles([]);
    setDryLevel(0);
    setIsFullyCompleted(false);
    setPetSparkle(false);
    setActiveTool('sponge');
    speakPetText(`Ready for another bubbly spa session! Scrub the mud spots!`, currentPet.voice);
  };

  // Pointer drag handler for active tool over the pet
  const handlePetPointerDown = (e) => {
    setIsDraggingTool(true);
    setDragToolPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e) => {
    if (!isDraggingTool) return;
    setDragToolPos({ x: e.clientX, y: e.clientY });

    // Check proximity to mud spots if using sponge
    if (activeTool === 'sponge') {
      INITIAL_MUD_SPOTS.forEach((spot) => {
        if (!cleanedSpots.includes(spot.id)) {
          const el = document.getElementById(`mud_spot_${spot.id}`);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (
              e.clientX >= rect.left - 20 &&
              e.clientX <= rect.right + 20 &&
              e.clientY >= rect.top - 20 &&
              e.clientY <= rect.bottom + 20
            ) {
              handleScrubSpot(spot.id);
            }
          }
        }
      });
    } else if (activeTool === 'shampoo') {
      handleLatherShampoo();
    } else if (activeTool === 'towel') {
      handleTowelRub();
    }
  };

  const handlePointerUp = () => {
    setIsDraggingTool(false);
  };

  const allSpotsCleaned = cleanedSpots.length === INITIAL_MUD_SPOTS.length;

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-full max-h-[100dvh] bg-gradient-to-b from-cyan-300 via-sky-100 to-blue-200 flex flex-col justify-between items-center px-2 py-1 sm:px-4 sm:py-2.5 select-none overflow-hidden font-sans"
      style={{ touchAction: 'manipulation' }}
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

        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full shadow-md border-2 border-cyan-300">
          <span className="text-xs">🫧</span>
          <span className="text-xs font-black text-cyan-900">
            {playerStats.bubblesPopped || 0} / 15 Popped
          </span>
        </div>
      </header>

      {/* Spa Step & Mission Banner */}
      <section className="w-full max-w-md my-0.5 z-20 flex-shrink-0">
        <div className="bg-white/95 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-md border-2 sm:border-3 border-cyan-400 flex items-center justify-between">
          <div className="text-left">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-700">
              🛁 Bath Spa Routine:
            </p>
            <h2 className="text-sm sm:text-lg font-black text-slate-800 tracking-tight leading-tight">
              {isFullyCompleted
                ? '✨ Sparkling, Clean & Fluffy! ✨'
                : activeTool === 'sponge'
                ? `1. Scrub the Mud: ${cleanedSpots.length} / ${INITIAL_MUD_SPOTS.length} Cleaned`
                : activeTool === 'shampoo'
                ? `2. Rub Shampoo: ${foamLevel}% Bubbles Made`
                : activeTool === 'shower'
                ? '3. Turn On Shower & Pop Floating Bubbles!'
                : `4. Pat Dry with Fluffy Towel: ${dryLevel}% Dry`}
            </h2>
          </div>

          <button
            onClick={() => {
              sfx.pop();
              const hints = {
                sponge: `Rub the sponge over ${petDisplayName}'s mud spots to scrub them clean!`,
                shampoo: `Rub shampoo on ${petDisplayName} to make fluffy soap bubbles!`,
                shower: `Shower is rinsing the soap! Tap and pop the floating bubbles!`,
                towel: `Wipe ${petDisplayName} with the warm fluffy towel to dry off!`,
              };
              speakPetText(hints[activeTool] || hints.sponge, currentPet.voice);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-cyan-400 to-sky-300 rounded-xl shadow-md border border-cyan-500 flex items-center justify-center text-cyan-950 active:scale-90 flex-shrink-0"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>

      {/* Main Bathtub & Interactive Pet Stage */}
      <main
        ref={petContainerRef}
        onPointerDown={handlePetPointerDown}
        className="relative my-auto flex-1 min-h-0 flex flex-col items-center justify-center z-10 w-full max-w-sm cursor-pointer"
      >
        {/* Overhead Shower Fixture & Water Streams */}
        {showerActive && (
          <div className="absolute top-0 inset-x-0 flex flex-col items-center pointer-events-none z-35 animate-fade">
            {/* Shower head graphic */}
            <div className="w-20 h-7 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b-2xl shadow-lg border-2 border-slate-300 flex items-center justify-center">
              <div className="w-14 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {/* Falling Water Droplets & Streams */}
            <div className="w-44 h-48 flex justify-between px-3 overflow-hidden">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    animationDelay: `${(i % 3) * 0.12}s`,
                    animationDuration: '0.45s',
                  }}
                  className="w-1 h-full bg-gradient-to-b from-cyan-200 via-sky-400 to-blue-300 rounded-full animate-bounce opacity-85"
                />
              ))}
            </div>
          </div>
        )}

        {/* Celebration Golden Sparkles when Complete */}
        {petSparkle && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-pulse">
            <span className="text-4xl animate-bounce">✨</span>
            <span className="text-4xl -mt-16 ml-12 animate-ping">🌟</span>
            <span className="text-4xl mt-20 -ml-14 animate-bounce">💖</span>
            <span className="text-3xl -mt-12 -ml-16 animate-ping">✨</span>
          </div>
        )}

        {/* Floating Tap-to-Pop Rainbow Soap Bubbles */}
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
            className="absolute rounded-full border-2 shadow-lg backdrop-blur-xs flex items-center justify-center active:scale-130 transition-transform duration-150 animate-float z-30 cursor-pointer"
          >
            <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/80 rounded-full -rotate-45" />
            <span className="text-xs font-bold text-white drop-shadow-sm">🫧</span>
          </button>
        ))}

        {/* Pet Avatar Inside Tub */}
        <div className="relative z-15">
          <PetAvatar
            petId={currentPet.id}
            stageIndex={stageIndex}
            feedCount={feedCount}
            expression={petExpression}
            accessories={unlockedAccessories}
          />

          {/* 1. MUD SPOTS ON PET (Scrub Stage) */}
          {activeTool === 'sponge' &&
            INITIAL_MUD_SPOTS.map((spot) => {
              const isCleaned = cleanedSpots.includes(spot.id);
              if (isCleaned) return null;
              return (
                <button
                  key={spot.id}
                  id={`mud_spot_${spot.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScrubSpot(spot.id);
                  }}
                  style={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    width: `${spot.size}px`,
                    height: `${spot.size}px`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-800/85 border-2 border-amber-950 shadow-md flex items-center justify-center text-xs animate-pulse active:scale-75 z-25 cursor-pointer"
                  title={`Scrub ${spot.label}!`}
                >
                  <span className="text-[10px]">🧽</span>
                </button>
              );
            })}

          {/* 2. FLUFFY SOAP FOAM LAYER (Shampoo Stage) */}
          {foamLevel > 0 && (
            <div
              onClick={handleLatherShampoo}
              className="absolute inset-0 pointer-events-auto z-25 flex items-center justify-center cursor-pointer"
            >
              {/* Head Foam Crown */}
              <div
                style={{ opacity: foamLevel / 100, transform: `scale(${0.7 + (foamLevel / 100) * 0.35})` }}
                className="absolute top-2 w-32 h-16 bg-white/95 rounded-full shadow-lg border-2 border-sky-200 flex items-center justify-around px-2 transition-all duration-300"
              >
                <span className="text-2xl animate-bounce">🫧</span>
                <span className="text-xl animate-pulse">🧼</span>
                <span className="text-2xl animate-bounce">🫧</span>
              </div>

              {/* Tummy / Body Foam Layer */}
              <div
                style={{ opacity: foamLevel / 100, transform: `scale(${0.75 + (foamLevel / 100) * 0.3})` }}
                className="absolute top-24 w-40 h-22 bg-white/90 rounded-full shadow-inner border-2 border-sky-100 flex items-center justify-center gap-2 transition-all duration-300"
              >
                <span className="text-2xl animate-pulse">🫧</span>
                <span className="text-sm font-black text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                  Soap Suds!
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
                className="w-36 h-36 bg-blue-400/20 rounded-full blur-md animate-pulse"
              />
            </div>
          )}
        </div>

        {/* Bathtub Rim & Water Waves Graphic */}
        <div className="relative w-64 sm:w-72 h-16 bg-white/95 rounded-b-3xl border-b-4 border-cyan-400 shadow-xl flex items-center justify-between px-4 -mt-4 z-20">
          <span className="text-2xl animate-bounce">🛁</span>
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-black text-cyan-900 uppercase tracking-wider">
              {isFullyCompleted ? '🎉 All Clean & Fresh!' : 'Warm Bubble Spa'}
            </span>
            <div className="flex gap-1 items-center mt-0.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[9px] font-bold text-cyan-700">
                {activeTool === 'sponge'
                  ? 'Rub mud to scrub'
                  : activeTool === 'shampoo'
                  ? 'Tap pet to lather'
                  : activeTool === 'shower'
                  ? 'Shower rinsing water'
                  : 'Rub pet to dry'}
              </span>
            </div>
          </div>
          <span className="text-2xl animate-bounce">🧼</span>
        </div>

        {/* Replay Spa Button when Finished */}
        {isFullyCompleted && (
          <div className="mt-2 z-30 flex-shrink-0">
            <button
              onClick={handleResetSpa}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-black text-xs px-4 py-2 rounded-full shadow-lg active:scale-95 transition-transform"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>🛁 SPA DAY AGAIN!</span>
            </button>
          </div>
        )}
      </main>

      {/* Interactive 4-Step Tool Selector Bar */}
      <footer className="w-full max-w-md flex flex-col gap-1 z-20 pb-0.5 flex-shrink-0">
        <div className="flex items-center justify-around gap-1 bg-white/95 rounded-2xl p-1.5 shadow-md border-2 border-cyan-300">
          {/* Tool 1: Scrub Sponge */}
          <button
            onClick={() => {
              sfx.pop();
              setActiveTool('sponge');
              speakPetText(`Rub the soft sponge over the mud spots!`, currentPet.voice);
            }}
            className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
              activeTool === 'sponge'
                ? 'bg-amber-400 text-amber-950 font-black shadow-md ring-2 ring-amber-300 scale-105'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <div className="relative">
              <span className="text-xl">🧽</span>
              {allSpotsCleaned && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[9px] mt-0.5">1. Scrub</span>
          </button>

          {/* Tool 2: Shampoo */}
          <button
            onClick={() => {
              sfx.pop();
              setActiveTool('shampoo');
              speakPetText(`Rub shampoo to make fluffy bubbles!`, currentPet.voice);
            }}
            className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
              activeTool === 'shampoo'
                ? 'bg-purple-500 text-white font-black shadow-md ring-2 ring-purple-300 scale-105'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <div className="relative">
              <span className="text-xl">🧴</span>
              {foamLevel >= 100 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[9px] mt-0.5">2. Shampoo</span>
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
              <span className="text-xl">{showerActive ? '🚿 💦' : '🚿'}</span>
              {foamLevel === 0 && cleanedSpots.length > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[9px] mt-0.5">{showerActive ? 'Rinsing...' : '3. Shower'}</span>
          </button>

          {/* Tool 4: Towel */}
          <button
            onClick={() => {
              sfx.pop();
              setActiveTool('towel');
              speakPetText(`Rub with the fluffy towel to dry clean!`, currentPet.voice);
            }}
            className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
              activeTool === 'towel'
                ? 'bg-rose-400 text-rose-950 font-black shadow-md ring-2 ring-rose-300 scale-105'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <div className="relative">
              <span className="text-xl">🧺</span>
              {dryLevel >= 100 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[9px] mt-0.5">4. Towel</span>
          </button>
        </div>

        {/* Activity Navigation Dock */}
        <ActivityNavBar
          currentActivity="bath"
          onSelectActivity={onNavigate}
          unlockedBadgesCount={unlockedBadges.length}
        />
      </footer>
    </div>
  );
}
