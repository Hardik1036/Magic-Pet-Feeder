import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Volume2, Sparkles, RefreshCw, Check } from 'lucide-react';
import PetAvatar from './PetAvatar.jsx';
import ActivityNavBar from './ActivityNavBar.jsx';
import { PETS } from '../data/pets.js';
import { sfx, speakPetText } from '../utils/audio.js';

// 4-Step Playroom Activity Routine:
// 1. 'ball': Throw the beach ball to pet to catch 3 times
// 2. 'blocks': Stack 3 colorful toy building blocks into a tower
// 3. 'balloon': Pop 3 floating balloons
// 4. 'duck': Squeeze the rubber ducky for joyful musical giggles

export default function PlayroomPage({
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

  // Active step: 'ball' | 'blocks' | 'balloon' | 'duck'
  const [activeToy, setActiveToy] = useState('ball');

  // Step 1: Ball catches
  const [ballCatches, setBallCatches] = useState(0);
  const [ballPos, setBallPos] = useState({ x: 50, y: 74 });
  const [isBallFlying, setIsBallFlying] = useState(false);

  // Step 2: Stacked blocks (count 0..3)
  const [stackedBlocks, setStackedBlocks] = useState([]);

  // Step 3: Floating balloons
  const [balloons, setBalloons] = useState(() => [
    { id: 1, icon: '⭐', color: 'bg-rose-400 border-rose-500', x: 18, y: 15 },
    { id: 2, icon: '🎈', color: 'bg-amber-400 border-amber-500', x: 50, y: 12 },
    { id: 3, icon: '✨', color: 'bg-purple-400 border-purple-500', x: 82, y: 16 },
  ]);
  const [balloonsPoppedCount, setBalloonsPoppedCount] = useState(0);

  // Step 4: Duck squeaks (0..3)
  const [duckSqueaks, setDuckSqueaks] = useState(0);

  // Overall celebration
  const [isPlayCompleted, setIsPlayCompleted] = useState(false);
  const [petExpression, setPetExpression] = useState('idle');
  const [petSparkle, setPetSparkle] = useState(false);

  // Welcome speech
  useEffect(() => {
    const timer = setTimeout(() => {
      speakPetText(
        `Yay, playtime! Throw the bouncy ball to play catch with ${petDisplayName}!`,
        currentPet.voice
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [currentPet, petDisplayName]);

  // -------------------------------------------------------------
  // STEP 1: BOUNCY BALL CATCH
  // -------------------------------------------------------------
  const handleThrowBall = useCallback(() => {
    if (isBallFlying) return;
    setIsBallFlying(true);
    sfx.bounce();
    setPetExpression('happy');

    // Arc trajectory up to pet
    setBallPos({ x: 50, y: 38 });

    setTimeout(() => {
      sfx.squeak();
      setBallPos({ x: 50, y: 74 });
      setIsBallFlying(false);

      const nextCatches = ballCatches + 1;
      setBallCatches(nextCatches);

      // Update global bounces stat
      const nextBounces = (playerStats.ballsBounced || 0) + 1;
      if (onUpdateStats) {
        onUpdateStats((prev) => ({
          ...prev,
          ballsBounced: nextBounces,
        }));
      }

      // Check badge unlock for 10 bounces
      if (nextBounces >= 10 && !unlockedBadges.includes('ball_juggler')) {
        if (onUnlockBadge) onUnlockBadge('ball_juggler');
        sfx.fanfare();
        speakPetText(`Incredible! You earned the Ball Juggler trophy!`, currentPet.voice);
      }

      if (nextCatches >= 3) {
        setTimeout(() => {
          sfx.chime(2);
          speakPetText(
            `Awesome catch! Now let's stack the colorful building blocks!`,
            currentPet.voice
          );
          setActiveToy('blocks');
          setPetExpression('idle');
        }, 350);
      } else {
        const praises = ['Good catch!', 'Wheee!', 'Bounce bounce!'];
        speakPetText(praises[Math.floor(Math.random() * praises.length)], currentPet.voice);
        setTimeout(() => setPetExpression('idle'), 300);
      }
    }, 450);
  }, [isBallFlying, ballCatches, currentPet, playerStats, onUpdateStats, unlockedBadges, onUnlockBadge]);

  // -------------------------------------------------------------
  // STEP 2: STACKING TOY BLOCKS
  // -------------------------------------------------------------
  const handleStackNextBlock = () => {
    if (stackedBlocks.length >= 3) return;
    sfx.pop();
    setPetExpression('happy');

    const blockStyles = [
      { id: 1, label: '🟥', name: 'Cube Base', color: 'bg-rose-500 border-rose-600' },
      { id: 2, label: '🟡', name: 'Star Middle', color: 'bg-amber-400 border-amber-500' },
      { id: 3, label: '👑', name: 'Crown Top', color: 'bg-indigo-500 border-indigo-600' },
    ];

    const nextBlock = blockStyles[stackedBlocks.length];
    const updated = [...stackedBlocks, nextBlock];
    setStackedBlocks(updated);

    if (updated.length === 3) {
      setTimeout(() => {
        sfx.chime(4);
        speakPetText(
          `Look at our tall magic block tower! Look at the floating balloons, pop them!`,
          currentPet.voice
        );
        setActiveToy('balloon');
        setPetExpression('idle');
      }, 400);
    } else {
      setTimeout(() => setPetExpression('idle'), 300);
    }
  };

  // -------------------------------------------------------------
  // STEP 3: BALLOON POPPING
  // -------------------------------------------------------------
  const handlePopBalloon = (id) => {
    sfx.bubblePop();
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setPetExpression('happy');

    const nextPopped = balloonsPoppedCount + 1;
    setBalloonsPoppedCount(nextPopped);

    if (nextPopped >= 3) {
      setTimeout(() => {
        sfx.chime(3);
        speakPetText(
          `Pop pop pop! All balloons popped! Now squeeze the rubber ducky!`,
          currentPet.voice
        );
        setActiveToy('duck');
        setPetExpression('idle');
      }, 400);
    } else {
      setTimeout(() => setPetExpression('idle'), 300);
    }
  };

  // -------------------------------------------------------------
  // STEP 4: SQUEAKY DUCK
  // -------------------------------------------------------------
  const handleSqueezeDuck = () => {
    sfx.squeak();
    setPetExpression('happy');

    const nextSqueaks = duckSqueaks + 1;
    setDuckSqueaks(nextSqueaks);

    if (nextSqueaks >= 3) {
      setTimeout(() => {
        sfx.sparkle();
        sfx.fanfare();
        setPetSparkle(true);
        setIsPlayCompleted(true);
        speakPetText(
          `Quack quack! That was the most fun playtime ever, ${playerName}!`,
          currentPet.voice
        );
      }, 350);
    } else {
      speakPetText(`Quack! Hehe, that tickles!`, currentPet.voice);
      setTimeout(() => setPetExpression('idle'), 350);
    }
  };

  // Reset routine to play again
  const handleResetPlay = () => {
    sfx.pop();
    setBallCatches(0);
    setStackedBlocks([]);
    setDuckSqueaks(0);
    setBalloonsPoppedCount(0);
    setBalloons([
      { id: Date.now() + 1, icon: '⭐', color: 'bg-rose-400 border-rose-500', x: 18, y: 15 },
      { id: Date.now() + 2, icon: '🎈', color: 'bg-amber-400 border-amber-500', x: 50, y: 12 },
      { id: Date.now() + 3, icon: '✨', color: 'bg-purple-400 border-purple-500', x: 82, y: 16 },
    ]);
    setIsPlayCompleted(false);
    setPetSparkle(false);
    setActiveToy('ball');
    speakPetText(`Ready to play again! Throw the beach ball to catch!`, currentPet.voice);
  };

  return (
    <div
      className="relative w-full h-full max-h-[100dvh] bg-gradient-to-b from-emerald-300 via-teal-100 to-lime-200 flex flex-col justify-between items-center px-2 py-1 sm:px-4 sm:py-2.5 select-none overflow-hidden font-sans"
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

        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full shadow-md border-2 border-emerald-300">
          <span className="text-xs">⚽</span>
          <span className="text-xs font-black text-emerald-900">
            {playerStats.ballsBounced || 0} / 10 Bounces
          </span>
        </div>
      </header>

      {/* Play Step & Mission Banner */}
      <section className="w-full max-w-md my-0.5 z-20 flex-shrink-0">
        <div className="bg-white/95 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-md border-2 sm:border-3 border-emerald-400 flex items-center justify-between">
          <div className="text-left">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
              ⚽ Toy Playroom Routine:
            </p>
            <h2 className="text-sm sm:text-lg font-black text-slate-800 tracking-tight leading-tight">
              {isPlayCompleted
                ? '✨ Super Fun Playtime Champion! ✨'
                : activeToy === 'ball'
                ? `1. Throw Beach Ball: ${ballCatches} / 3 Catches`
                : activeToy === 'blocks'
                ? `2. Stack Magic Blocks: ${stackedBlocks.length} / 3 Stacked`
                : activeToy === 'balloon'
                ? `3. Pop Party Balloons: ${balloonsPoppedCount} / 3 Popped`
                : `4. Squeeze Squeaky Duck: ${duckSqueaks} / 3 Squeaks`}
            </h2>
          </div>

          <button
            onClick={() => {
              sfx.pop();
              const hints = {
                ball: `Tap the bouncy beach ball to toss it to ${petDisplayName}!`,
                blocks: `Tap or stack the colorful toy blocks to build a tower!`,
                balloon: `Tap any floating balloon to pop it!`,
                duck: `Squeeze the yellow rubber ducky to hear silly quacks!`,
              };
              speakPetText(hints[activeToy] || hints.ball, currentPet.voice);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-emerald-400 to-teal-300 rounded-xl shadow-md border border-emerald-500 flex items-center justify-center text-emerald-950 active:scale-90 flex-shrink-0"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>

      {/* Main Play Area */}
      <main className="relative my-auto flex-1 min-h-0 flex flex-col items-center justify-center z-10 w-full max-w-sm">
        {/* Sparkles on Celebration */}
        {petSparkle && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-pulse">
            <span className="text-4xl animate-bounce">🎉</span>
            <span className="text-4xl -mt-16 ml-12 animate-ping">✨</span>
            <span className="text-4xl mt-20 -ml-14 animate-bounce">🌟</span>
            <span className="text-3xl -mt-12 -ml-16 animate-ping">💖</span>
          </div>
        )}

        {/* Floating Party Balloons (Step 3) */}
        {balloons.map((b) => (
          <button
            key={b.id}
            onClick={() => handlePopBalloon(b.id)}
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
            className={`absolute w-10 h-13 sm:w-12 sm:h-15 rounded-full ${b.color} border-2 shadow-lg flex items-center justify-center text-lg text-white active:scale-130 transition-transform animate-float z-25 cursor-pointer`}
          >
            <span className="filter drop-shadow-sm">{b.icon}</span>
            <div className="absolute -bottom-1.5 w-1 h-2 bg-white/70 rounded-full" />
          </button>
        ))}

        {/* Pet Avatar in Playroom */}
        <div className={`relative z-15 transition-transform duration-300 ${isBallFlying ? '-translate-y-4 scale-105' : ''}`}>
          <PetAvatar
            petId={currentPet.id}
            stageIndex={stageIndex}
            feedCount={feedCount}
            expression={petExpression}
            accessories={unlockedAccessories}
          />
        </div>

        {/* 2. STACKED BLOCKS TOWER (Step 2 - on side of pet) */}
        {activeToy === 'blocks' && (
          <div
            onClick={handleStackNextBlock}
            className="absolute right-3 sm:right-6 bottom-10 z-25 flex flex-col-reverse items-center gap-1 cursor-pointer"
          >
            {stackedBlocks.map((block) => (
              <div
                key={block.id}
                className={`w-11 h-10 sm:w-13 sm:h-11 ${block.color} rounded-xl shadow-md border-2 border-white flex items-center justify-center text-lg text-white animate-bounce`}
              >
                {block.label}
              </div>
            ))}
            {stackedBlocks.length < 3 && (
              <button className="w-11 h-10 sm:w-13 sm:h-11 bg-white/80 border-2 border-dashed border-amber-400 rounded-xl flex items-center justify-center text-xs font-black text-amber-900 animate-pulse shadow-sm">
                + Stack
              </button>
            )}
          </div>
        )}

        {/* 1. INTERACTIVE BOUNCY BALL (Step 1) */}
        {activeToy === 'ball' && (
          <button
            onClick={handleThrowBall}
            style={{
              left: `${ballPos.x}%`,
              top: `${ballPos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-2xl flex items-center justify-center border-4 border-amber-300 z-30 cursor-pointer active:scale-90 transition-all duration-300 ${
              isBallFlying ? 'animate-spin scale-110' : 'animate-bounce'
            }`}
            title="Toss Ball to Pet!"
          >
            <div className="w-full h-full rounded-full overflow-hidden relative bg-gradient-to-tr from-rose-400 via-amber-300 to-sky-400 flex items-center justify-center">
              <span className="text-3xl filter drop-shadow">⚽</span>
            </div>
          </button>
        )}

        {/* 4. SQUEAKY RUBBER DUCK (Step 4) */}
        {activeToy === 'duck' && (
          <button
            onClick={handleSqueezeDuck}
            className="absolute left-6 sm:left-10 bottom-10 w-16 h-16 rounded-full bg-yellow-400 border-4 border-yellow-500 shadow-xl flex items-center justify-center text-3xl active:scale-80 transition-transform animate-bounce z-30 cursor-pointer"
            title="Squeeze Rubber Duck!"
          >
            🐥
          </button>
        )}

        {/* Floor Mat Graphic */}
        <div className="w-56 sm:w-72 h-8 sm:h-10 bg-emerald-700/20 rounded-full blur-xs -mt-3 sm:-mt-5 z-0" />

        {/* Replay Button when Finished */}
        {isPlayCompleted && (
          <div className="mt-2 z-30 flex-shrink-0">
            <button
              onClick={handleResetPlay}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs px-4 py-2 rounded-full shadow-lg active:scale-95 transition-transform"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>⚽ PLAY AGAIN!</span>
            </button>
          </div>
        )}
      </main>

      {/* 4-Step Toy Selector Bar */}
      <footer className="w-full max-w-md flex flex-col gap-1 z-20 pb-0.5 flex-shrink-0">
        <div className="flex items-center justify-around gap-1 bg-white/95 rounded-2xl p-1.5 shadow-md border-2 border-emerald-300">
          {/* Toy 1: Bouncy Ball */}
          <button
            onClick={() => {
              sfx.pop();
              setActiveToy('ball');
              speakPetText(`Throw the bouncy ball to play catch!`, currentPet.voice);
            }}
            className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
              activeToy === 'ball'
                ? 'bg-amber-400 text-amber-950 font-black shadow-md ring-2 ring-amber-300 scale-105'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <div className="relative">
              <span className="text-xl">⚽</span>
              {ballCatches >= 3 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[9px] mt-0.5">1. Catch</span>
          </button>

          {/* Toy 2: Blocks */}
          <button
            onClick={() => {
              sfx.pop();
              setActiveToy('blocks');
              speakPetText(`Stack colorful wooden blocks into a tower!`, currentPet.voice);
            }}
            className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
              activeToy === 'blocks'
                ? 'bg-rose-500 text-white font-black shadow-md ring-2 ring-rose-300 scale-105'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <div className="relative">
              <span className="text-xl">🧱</span>
              {stackedBlocks.length >= 3 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[9px] mt-0.5">2. Blocks</span>
          </button>

          {/* Toy 3: Balloons */}
          <button
            onClick={() => {
              sfx.pop();
              setActiveToy('balloon');
              speakPetText(`Tap the floating balloons to pop them!`, currentPet.voice);
            }}
            className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
              activeToy === 'balloon'
                ? 'bg-purple-500 text-white font-black shadow-md ring-2 ring-purple-300 scale-105'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <div className="relative">
              <span className="text-xl">🎈</span>
              {balloonsPoppedCount >= 3 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[9px] mt-0.5">3. Balloons</span>
          </button>

          {/* Toy 4: Squeaky Duck */}
          <button
            onClick={() => {
              sfx.pop();
              setActiveToy('duck');
              speakPetText(`Squeeze the rubber ducky!`, currentPet.voice);
            }}
            className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all active:scale-90 ${
              activeToy === 'duck'
                ? 'bg-yellow-400 text-yellow-950 font-black shadow-md ring-2 ring-yellow-300 scale-105'
                : 'bg-slate-100 text-slate-700 font-bold'
            }`}
          >
            <div className="relative">
              <span className="text-xl">🐥</span>
              {duckSqueaks >= 3 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-[9px] mt-0.5">4. Squeak</span>
          </button>
        </div>

        {/* Activity Navigation Dock */}
        <ActivityNavBar
          currentActivity="playroom"
          onSelectActivity={onNavigate}
          unlockedBadgesCount={unlockedBadges.length}
        />
      </footer>
    </div>
  );
}
