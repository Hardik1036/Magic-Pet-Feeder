import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, User, RefreshCw, Volume2 } from 'lucide-react';
import PetAvatar from './PetAvatar.jsx';
import ActivityNavBar from './ActivityNavBar.jsx';
import { PETS } from '../data/pets.js';
import { sfx, speakPetText } from '../utils/audio.js';

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

  // Tools: 'sponge' | 'shower' | 'bubbles' | 'towel'
  const [activeTool, setActiveTool] = useState('sponge');
  const [petExpression, setPetExpression] = useState('idle');
  const [petSparkle, setPetSparkle] = useState(false);

  // Muddy / soapy spots on pet (positions in %)
  const [spots, setSpots] = useState([
    { id: 1, x: 38, y: 44, cleaned: false },
    { id: 2, x: 58, y: 52, cleaned: false },
    { id: 3, x: 48, y: 64, cleaned: false },
  ]);

  // Floating soap bubbles
  const [bubbles, setBubbles] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      y: 20 + Math.random() * 50,
      size: 40 + Math.random() * 30,
      color: ['#93C5FD', '#F472B6', '#C084FC', '#67E8F9'][i % 4],
    }))
  );

  // Initial welcome voice
  useEffect(() => {
    const timer = setTimeout(() => {
      speakPetText(`Splish splash! Let's take a warm bubble bath, ${playerName}!`, currentPet.voice);
    }, 450);
    return () => clearTimeout(timer);
  }, [currentPet, playerName]);

  // Handle cleaning a mud spot
  const handleCleanSpot = (spotId) => {
    sfx.splash();
    setPetExpression('happy');
    setSpots((prev) =>
      prev.map((s) => (s.id === spotId ? { ...s, cleaned: true } : s))
    );

    setTimeout(() => setPetExpression('idle'), 600);

    // Check if all spots cleaned
    const remaining = spots.filter((s) => s.id !== spotId && !s.cleaned);
    if (remaining.length === 0) {
      setTimeout(() => {
        sfx.fanfare();
        setPetSparkle(true);
        speakPetText(`So clean and sparkly! You are the best!`, currentPet.voice);
        setTimeout(() => setPetSparkle(false), 2000);
      }, 500);
    }
  };

  // Handle popping a floating bubble
  const handlePopBubble = (bubbleId) => {
    sfx.bubblePop();
    setBubbles((prev) => prev.filter((b) => b.id !== bubbleId));

    // Add replacement bubble after a moment
    setTimeout(() => {
      setBubbles((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: 10 + Math.random() * 75,
          y: 20 + Math.random() * 50,
          size: 38 + Math.random() * 32,
          color: ['#93C5FD', '#F472B6', '#C084FC', '#67E8F9'][Math.floor(Math.random() * 4)],
        },
      ]);
    }, 1200);

    // Track bubbles popped stat
    const newBubbleCount = (playerStats.bubblesPopped || 0) + 1;
    if (onUpdateStats) {
      onUpdateStats((prev) => ({
        ...prev,
        bubblesPopped: newBubbleCount,
      }));
    }

    // Award Bubble Champ badge if reached 15 bubbles!
    if (newBubbleCount >= 15 && !unlockedBadges.includes('bubble_champ')) {
      if (onUnlockBadge) onUnlockBadge('bubble_champ');
      sfx.fanfare();
      speakPetText(`Hooray! You earned the Bubble Champion trophy!`, currentPet.voice);
    }
  };

  // Tool actions
  const handleUseTool = (toolId) => {
    setActiveTool(toolId);
    if (toolId === 'shower') {
      sfx.splash();
      setPetExpression('happy');
      // Wash all spots
      setSpots((prev) => prev.map((s) => ({ ...s, cleaned: true })));
      speakPetText(`Whoosh! Warm water feels so nice!`, currentPet.voice);
      setTimeout(() => setPetExpression('idle'), 1000);
    } else if (toolId === 'bubbles') {
      sfx.bubblePop();
      speakPetText(`Pop all the rainbow bubbles!`, currentPet.voice);
      // Spawn new wave of bubbles
      setBubbles(
        Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x: 10 + Math.random() * 75,
          y: 15 + Math.random() * 55,
          size: 36 + Math.random() * 34,
          color: ['#93C5FD', '#F472B6', '#C084FC', '#67E8F9'][i % 4],
        }))
      );
    } else if (toolId === 'towel') {
      sfx.sparkle();
      setPetSparkle(true);
      setPetExpression('happy');
      speakPetText(`Fluffy and dry! Look at that shine!`, currentPet.voice);
      setTimeout(() => {
        setPetSparkle(false);
        setPetExpression('idle');
      }, 1500);
    } else {
      sfx.pop();
      speakPetText(`Rub-a-dub with the soft sponge!`, currentPet.voice);
    }
  };

  const allClean = spots.every((s) => s.cleaned);

  return (
    <div
      className="relative w-full min-h-screen bg-gradient-to-b from-cyan-300 via-sky-100 to-blue-200 flex flex-col justify-between items-center p-3 sm:p-5 select-none overflow-hidden font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Top Header */}
      <header className="w-full max-w-md flex items-center justify-between px-1 pt-1 z-20">
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

      {/* Task Prompt Banner */}
      <section className="w-full max-w-md my-1 z-20">
        <div className="bg-white/95 rounded-3xl p-3 shadow-xl border-4 border-cyan-400 flex items-center justify-between">
          <div className="text-left">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-700">
              🛁 Bubble Bath Time:
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              {allClean ? '✨ Sparkling Clean Pet! ✨' : 'Scrub & Pop the Bubbles!'}
            </h2>
          </div>

          <button
            onClick={() => {
              sfx.pop();
              speakPetText(
                allClean
                  ? `${petDisplayName} is clean and fresh! Great job!`
                  : `Tap the soap bubbles to pop them, and scrub ${petDisplayName} clean!`,
                currentPet.voice
              );
            }}
            className="w-11 h-11 bg-gradient-to-tr from-cyan-400 to-sky-300 rounded-2xl shadow-md border-2 border-cyan-500 flex items-center justify-center text-cyan-950 active:scale-90"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Bath Tub & Pet Play Area */}
      <main className="relative my-auto flex flex-col items-center justify-center z-10 w-full max-w-sm h-72 sm:h-80">
        {/* Sparkle Aura when Cleaned */}
        {petSparkle && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-pulse">
            <span className="text-5xl animate-bounce">✨</span>
            <span className="text-4xl -mt-20 ml-12 animate-ping">🌟</span>
            <span className="text-5xl mt-24 -ml-16 animate-bounce">✨</span>
          </div>
        )}

        {/* Floating Tap-to-Pop Soap Bubbles */}
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={() => handlePopBubble(b.id)}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              backgroundColor: `${b.color}44`,
              borderColor: b.color,
            }}
            className="absolute rounded-full border-2 shadow-lg backdrop-blur-xs flex items-center justify-center active:scale-125 transition-transform duration-150 animate-float z-25 cursor-pointer"
          >
            <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/80 rounded-full -rotate-45" />
            <span className="text-xs font-bold text-white drop-shadow-sm">🫧</span>
          </button>
        ))}

        {/* Pet Avatar in Bath */}
        <div className="relative z-15">
          <PetAvatar
            petId={currentPet.id}
            stageIndex={stageIndex}
            feedCount={feedCount}
            expression={petExpression}
            accessories={unlockedAccessories}
          />

          {/* Muddy / Foamy Spots on Pet */}
          {spots.map((spot) => (
            !spot.cleaned && (
              <button
                key={spot.id}
                onClick={() => handleCleanSpot(spot.id)}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="absolute w-8 h-8 rounded-full bg-amber-700/80 border-2 border-amber-900 shadow-md flex items-center justify-center text-xs animate-pulse active:scale-75 z-20 cursor-pointer"
                title="Tap to Scrub!"
              >
                🧼
              </button>
            )
          ))}
        </div>

        {/* Bathtub Rim Graphic */}
        <div className="w-64 sm:w-72 h-16 bg-white/90 rounded-b-3xl border-b-4 border-cyan-400 shadow-lg flex items-center justify-center gap-2 -mt-4 z-10">
          <span className="text-2xl animate-bounce">🛁</span>
          <span className="text-xs font-black text-cyan-900 uppercase tracking-wider">
            Warm Bubble Spa
          </span>
          <span className="text-2xl animate-bounce">🧼</span>
        </div>
      </main>

      {/* Spa Tools Bar */}
      <footer className="w-full max-w-md flex flex-col gap-2 z-20">
        <div className="flex items-center justify-around gap-2 bg-white/95 rounded-3xl p-2 shadow-lg border-2 border-cyan-300">
          <button
            onClick={() => handleUseTool('sponge')}
            className={`flex-1 flex flex-col items-center py-2 px-1 rounded-2xl transition-all active:scale-90 ${
              activeTool === 'sponge'
                ? 'bg-amber-400 text-amber-950 font-black shadow-md ring-2 ring-amber-300'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <span className="text-2xl">🧽</span>
            <span className="text-[11px]">Sponge</span>
          </button>

          <button
            onClick={() => handleUseTool('shower')}
            className={`flex-1 flex flex-col items-center py-2 px-1 rounded-2xl transition-all active:scale-90 ${
              activeTool === 'shower'
                ? 'bg-sky-500 text-white font-black shadow-md ring-2 ring-sky-300'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <span className="text-2xl">🚿</span>
            <span className="text-[11px]">Shower</span>
          </button>

          <button
            onClick={() => handleUseTool('bubbles')}
            className={`flex-1 flex flex-col items-center py-2 px-1 rounded-2xl transition-all active:scale-90 ${
              activeTool === 'bubbles'
                ? 'bg-purple-500 text-white font-black shadow-md ring-2 ring-purple-300'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <span className="text-2xl">🫧</span>
            <span className="text-[11px]">Bubbles</span>
          </button>

          <button
            onClick={() => handleUseTool('towel')}
            className={`flex-1 flex flex-col items-center py-2 px-1 rounded-2xl transition-all active:scale-90 ${
              activeTool === 'towel'
                ? 'bg-rose-400 text-rose-950 font-black shadow-md ring-2 ring-rose-300'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <span className="text-2xl">🧴</span>
            <span className="text-[11px]">Dry Towel</span>
          </button>
        </div>

        {/* Room Navigation Dock */}
        <ActivityNavBar
          currentActivity="bath"
          onSelectActivity={onNavigate}
          unlockedBadgesCount={unlockedBadges.length}
        />
      </footer>
    </div>
  );
}
