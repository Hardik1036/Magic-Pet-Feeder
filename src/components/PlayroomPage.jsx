import React, { useState, useEffect } from 'react';
import { User, Volume2 } from 'lucide-react';
import PetAvatar from './PetAvatar.jsx';
import ActivityNavBar from './ActivityNavBar.jsx';
import { PETS } from '../data/pets.js';
import { sfx, speakPetText } from '../utils/audio.js';

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

  const [petExpression, setPetExpression] = useState('idle');
  const [ballPos, setBallPos] = useState({ x: 50, y: 75 });
  const [isBouncing, setIsBouncing] = useState(false);
  const [activeToy, setActiveToy] = useState('ball'); // 'ball' | 'duck' | 'balloon'

  // Balloons
  const [balloons, setBalloons] = useState(() => [
    { id: 1, label: '⭐', color: 'bg-rose-400 border-rose-500', x: 20 },
    { id: 2, label: '🌟', color: 'bg-amber-400 border-amber-500', x: 50 },
    { id: 3, label: '✨', color: 'bg-purple-400 border-purple-500', x: 80 },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      speakPetText(`Yay, play time! Throw the bouncy ball to ${petDisplayName}!`, currentPet.voice);
    }, 200);
    return () => clearTimeout(timer);
  }, [currentPet, petDisplayName]);

  // Throw or tap the bouncy ball
  const handleBounceBall = () => {
    if (isBouncing) return;
    setIsBouncing(true);
    sfx.bounce();
    setPetExpression('happy');

    // Bounce trajectory
    setBallPos({ x: 45 + (Math.random() - 0.5) * 30, y: 35 });

    setTimeout(() => {
      sfx.squeak();
      setBallPos({ x: 50, y: 75 });
      setIsBouncing(false);
      setPetExpression('idle');

      // Increment bounced stat
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
      } else {
        const praises = ['Good catch!', 'Wheee!', 'Bounce bounce!', 'Super jump!'];
        speakPetText(praises[Math.floor(Math.random() * praises.length)], currentPet.voice);
      }
    }, 320);
  };

  // Squeeze squeaky duck
  const handleSqueezeDuck = () => {
    sfx.squeak();
    setPetExpression('happy');
    speakPetText(`Quack quack! ${petDisplayName} loves that sound!`, currentPet.voice);
    setTimeout(() => setPetExpression('idle'), 400);
  };

  // Pop balloon
  const handlePopBalloon = (id) => {
    sfx.pop();
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setPetExpression('happy');
    setTimeout(() => setPetExpression('idle'), 350);

    // Fast respawn
    setTimeout(() => {
      setBalloons((prev) => [
        ...prev,
        {
          id: Date.now(),
          label: ['⭐', '🎈', '✨'][Math.floor(Math.random() * 3)],
          color: ['bg-pink-400 border-pink-500', 'bg-sky-400 border-sky-500', 'bg-emerald-400 border-emerald-500'][
            Math.floor(Math.random() * 3)
          ],
          x: 20 + Math.random() * 60,
        },
      ]);
    }, 600);
  };

  return (
    <div
      className="relative w-full min-h-screen bg-gradient-to-b from-emerald-300 via-teal-100 to-lime-200 flex flex-col justify-between items-center p-3 sm:p-5 select-none overflow-hidden font-sans"
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

        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full shadow-md border-2 border-emerald-300">
          <span className="text-xs">⚽</span>
          <span className="text-xs font-black text-emerald-900">
            {playerStats.ballsBounced || 0} / 10 Bounces
          </span>
        </div>
      </header>

      {/* Task Prompt Banner */}
      <section className="w-full max-w-md my-1 z-20">
        <div className="bg-white/95 rounded-3xl p-3 shadow-xl border-4 border-emerald-400 flex items-center justify-between">
          <div className="text-left">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
              ⚽ Playroom Catch:
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Tap the Ball to Play Catch!
            </h2>
          </div>

          <button
            onClick={() => {
              sfx.pop();
              speakPetText(
                `Tap the colorful beach ball to play catch with ${petDisplayName}! Can you bounce it 10 times?`,
                currentPet.voice
              );
            }}
            className="w-11 h-11 bg-gradient-to-tr from-emerald-400 to-teal-300 rounded-2xl shadow-md border-2 border-emerald-500 flex items-center justify-center text-emerald-950 active:scale-90"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Play Area */}
      <main className="relative my-auto flex flex-col items-center justify-center z-10 w-full max-w-sm h-72 sm:h-80">
        {/* Floating Star Balloons */}
        {balloons.map((b) => (
          <button
            key={b.id}
            onClick={() => handlePopBalloon(b.id)}
            style={{ left: `${b.x}%`, top: '12%' }}
            className={`absolute w-12 h-14 rounded-full ${b.color} border-2 shadow-lg flex items-center justify-center text-xl text-white active:scale-125 transition-transform animate-float z-25 cursor-pointer`}
          >
            {b.label}
          </button>
        ))}

        {/* Pet Avatar Playing */}
        <div className={`transition-transform duration-300 ${isBouncing ? '-translate-y-6 scale-105' : ''}`}>
          <PetAvatar
            petId={currentPet.id}
            stageIndex={stageIndex}
            feedCount={feedCount}
            expression={petExpression}
            accessories={unlockedAccessories}
          />
        </div>

        {/* Interactive Bouncy Beach Ball */}
        <button
          onClick={handleBounceBall}
          style={{
            left: `${ballPos.x}%`,
            top: `${ballPos.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className={`absolute w-18 h-18 sm:w-20 sm:h-20 rounded-full shadow-2xl flex items-center justify-center border-4 border-amber-300 z-30 cursor-pointer active:scale-90 transition-all duration-300 ${
            isBouncing ? 'animate-spin scale-110' : 'animate-bounce'
          }`}
        >
          {/* Multi-color Beach Ball SVG Pattern */}
          <div className="w-full h-full rounded-full overflow-hidden relative bg-gradient-to-tr from-rose-400 via-amber-300 to-sky-400 flex items-center justify-center">
            <span className="text-3xl filter drop-shadow">⚽</span>
          </div>
        </button>

        {/* Floor Mat Graphic */}
        <div className="w-64 sm:w-72 h-10 bg-emerald-700/20 rounded-full blur-xs -mt-6 z-0" />
      </main>

      {/* Toy Selection Bar */}
      <footer className="w-full max-w-md flex flex-col gap-2 z-20">
        <div className="flex items-center justify-around gap-2 bg-white/95 rounded-3xl p-2 shadow-lg border-2 border-emerald-300">
          <button
            onClick={handleBounceBall}
            className="flex-1 flex flex-col items-center py-2 px-1 rounded-2xl bg-amber-400 text-amber-950 font-black shadow-md ring-2 ring-amber-300 active:scale-90 transition-transform"
          >
            <span className="text-2xl">⚽</span>
            <span className="text-[11px]">Bounce Ball</span>
          </button>

          <button
            onClick={handleSqueezeDuck}
            className="flex-1 flex flex-col items-center py-2 px-1 rounded-2xl bg-yellow-400 text-yellow-950 font-black shadow-md ring-2 ring-yellow-300 active:scale-90 transition-transform"
          >
            <span className="text-2xl">🐥</span>
            <span className="text-[11px]">Squeaky Duck</span>
          </button>

          <button
            onClick={() => {
              sfx.fanfare();
              setPetExpression('happy');
              speakPetText(`Hooray! What a super fun playtime!`, currentPet.voice);
              setTimeout(() => setPetExpression('idle'), 1000);
            }}
            className="flex-1 flex flex-col items-center py-2 px-1 rounded-2xl bg-purple-400 text-purple-950 font-black shadow-md ring-2 ring-purple-300 active:scale-90 transition-transform"
          >
            <span className="text-2xl">🎉</span>
            <span className="text-[11px]">Party Cheer</span>
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
